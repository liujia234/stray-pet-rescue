# 小程序 ⇄ Coze 实时数据同步方案

## 📋 概述

当前 Demo 阶段，小程序和 Coze Bot 的数据独立存储。本文档设计正式版的**实时数据同步架构**，实现救助站录入新宠物后，Coze AI 助手可在秒级内推荐给领养人。

---

## 一、当前问题

```
┌──────────────┐     ┌──────────────┐
│   微信小程序   │     │   Coze Bot   │
│              │     │              │
│ 数据：手机本地 │     │ 数据：上传文件 │
│ wx.Storage   │     │ 静态知识库    │
└──────────────┘     └──────────────┘
        ✗                 ✗
     没有连接，数据独立，互不知晓
```

**问题场景**：
> 救助站在小程序新增了一只叫"小白"的狗 → 存手机本地 → 领养人问 Coze Bot → Bot 不知道小白的存在 → 错过领养机会

---

## 二、目标架构

```
┌─────────────────────────────────────────────────┐
│                  微信云开发平台                     │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ 云数据库  │  │ 云函数    │  │ 云存储       │  │
│  │ (数据)   │  │ (逻辑)   │  │ (图片)       │  │
│  └────┬─────┘  └────┬─────┘  └──────────────┘  │
│       │             │                            │
└───────┼─────────────┼────────────────────────────┘
        │             │
   ┌────▼──┐    ┌────▼────┐
   │ 小程序 │    │ HTTP API│ ←── Coze 插件调用
   │ 读写   │    │ 接口    │
   └───────┘    └────┬────┘
                     │
              ┌──────▼──────┐
              │  Coze Bot   │
              │  实时查询    │
              └─────────────┘
```

---

## 三、技术实现（三步完成）

### 步骤 1：小程序接入云开发

```javascript
// app.js 中初始化云开发
wx.cloud.init({
  env: 'stray-pet-prod',  // 云环境 ID
  traceUser: true
})

// 宠物新增/修改时，写入云数据库而非本地 Storage
const db = wx.cloud.database()
const petsCollection = db.collection('adopt_pets')

// 救助站新增宠物
async function addPet(petData) {
  const result = await petsCollection.add({
    data: {
      ...petData,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  })
  return result._id
}
```

### 步骤 2：创建云函数暴露 HTTP API

在云开发中创建云函数 `getPetsList`，通过 HTTP 触发器暴露给外部：

```javascript
// cloudfunctions/getPetsList/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { city, type, size, keyword } = event

  // 构建查询条件
  let query = db.collection('adopt_pets').where({
    status: 'available'
  })

  if (city) {
    query = query.where({
      address: db.RegExp({ regexp: city, options: 'i' })
    })
  }
  if (type && type !== 'all') {
    query = query.where({ petType: type })
  }

  // 获取最新数据
  const result = await query
    .orderBy('updateTime', 'desc')
    .limit(20)
    .get()

  return {
    code: 0,
    data: result.data,
    total: result.data.length
  }
}
```

配置 HTTP 触发器后，获得 API 地址：
```
https://api.weixin.qq.com/.../getPetsList
```

### 步骤 3：Coze 创建 API 插件

在 Coze 平台上：

1. **创建插件**
   - 左侧菜单 → **「插件」**
   - 点 **「+ 创建插件」**
   - 名称：`宠物信息查询`

2. **配置 API 接口**
   ```yaml
   接口名称: getAvailablePets
   请求方式: POST
   URL: https://api.weixin.qq.com/.../getPetsList
   
   请求参数:
   - city: string (选填) - 城市名
   - type: string (选填) - dog/cat/all
   - size: string (选填) - small/medium/large
   - keyword: string (选填) - 关键词搜索
   
   返回格式: JSON
   {
     "code": 0,
     "data": [
       {
         "name": "花花",
         "breed": "三花猫",
         "age": "1岁",
         ...
       }
     ]
   }
   ```

3. **Bot 绑定插件**
   - 打开你的 Bot → **「技能」**
   - 添加刚创建的插件
   - 在人设与回复逻辑中加入：
   ```
   当用户询问领养推荐时，先调用"宠物信息查询"插件获取最新可领养宠物列表，
   然后基于实时数据为用户推荐，而不是使用内置知识库的静态数据。
   ```

---

## 四、完整数据流

```
救助站在小程序录入新宠物"小白"
    ↓ (写入)
云数据库 pets 集合（新增一条记录）
    ↓ (实时生效)
云函数 HTTP API（查询可返回小白）
    ↓ (Coze Bot 调用)
用户："我想养白色的狗"
    ↓
Bot 调用插件 → API 返回包含小白的最新列表
    ↓
Bot 回复："刚上架一只白色小狗叫小白，要了解吗？🐶"
```

**延迟**：新增数据到 Bot 可推荐，延迟 < 1 秒（云数据库实时生效）

---

## 五、数据库设计

### adopt_pets 集合

| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | string | 自动生成 |
| `name` | string | 宠物名称 |
| `petType` | string | dog / cat / other |
| `breed` | string | 品种 |
| `color` | string | 毛色 |
| `age` | string | 年龄 |
| `gender` | string | male / female |
| `size` | string | small / medium / large |
| `character` | string | 性格描述 |
| `health` | string | 健康状况 |
| `description` | string | 详细描述 |
| `images` | array | 图片云存储 ID 列表 |
| `address` | string | 所在地址 |
| `contact` | string | 联系方式 |
| `shelterName` | string | 救助站名称 |
| `status` | string | available / adopted / offline |
| `createTime` | date | 创建时间 |
| `updateTime` | date | 更新时间 |

---

## 六、成本估算

| 项目 | 免费额度 | 是否够用 |
|------|----------|----------|
| 云数据库读 | 5 万次/天 | ✅ 绰绰有余 |
| 云数据库写 | 3 万次/天 | ✅ 绰绰有余 |
| 云函数调用 | 10 万次/月 | ✅ 初期够用 |
| 云存储 | 5GB | ✅ 够用 |
| Coze API 调用 | 100 次/分钟 | ✅ 够用 |

> 💰 **结论**：日活 < 1000 之前，**完全免费**。

---

## 七、架构优势

| 维度 | 当前 Demo | 实时同步方案 |
|------|-----------|-------------|
| 数据存储 | 手机本地 Storage | 云数据库（所有用户共享） |
| 数据一致性 | 各看各的 | 一处更新，全部同步 |
| Coze 数据源 | 静态上传文件 | API 实时查询 |
| 扩展性 | 单机 | 水平扩展 |
| 多设备 | 不支持 | 天然支持 |
| 成本 | 免费 | 初期免费 |

---

## 八、与产品 Roadmap 的对齐

| 版本 | 数据方案 |
|------|----------|
| V1.0 ✅ | 本地 Storage（Demo） |
| V1.1 🚧 | Coze Bot 静态知识库 |
| V1.2 📅 | **微信云开发接入，Coze 插件实时同步** |
| V2.0 📅 | 独立后端 + 自建 API + 多端数据打通 |
