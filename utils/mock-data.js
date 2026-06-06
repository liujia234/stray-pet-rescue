/**
 * Mock 数据 - 首次启动时自动加载
 * 提供示例数据让 Demo 可演示
 */

const storage = require('./storage')

/**
 * 初始化所有 Mock 数据到本地存储
 */
function initAllData() {
  initLostPets()
  initFoundPets()
  initAdoptPets()
  initShelterUsers()
  initActivities()
  console.log('所有 Mock 数据初始化完成')
}

// ========== 走失宠物 Mock（3条） ==========
function initLostPets() {
  const data = [
    {
      id: 'mock_lost_001',
      type: 'lost',
      petType: 'dog',
      name: '豆豆',
      breed: '金毛寻回犬',
      color: '金黄色',
      age: '2岁',
      gender: '公',
      injury: '无',
      description: '2026年5月20日下午在阳光花园小区附近走失，脖子上戴有红色项圈，挂有主人联系方式牌。性格温顺亲人，叫名字会有反应。走失时刚理过毛。',
      address: '北京市朝阳区阳光花园小区3号楼附近',
      latitude: 39.9219,
      longitude: 116.4435,
      contact: '138****6789',
      images: [],
      status: 'searching',
      createTime: '2026-05-21T10:30:00.000Z'
    },
    {
      id: 'mock_lost_002',
      type: 'lost',
      petType: 'cat',
      name: '咪咪',
      breed: '英国短毛猫',
      color: '蓝灰色',
      age: '1岁半',
      gender: '母',
      injury: '右耳有轻微伤疤',
      description: '6月1日晚从家中阳台跑出，平时胆子较小，怕生人。蓝灰色短毛，眼睛为橙色，体型偏圆润。喜欢躲在安静角落。',
      address: '上海市浦东新区张江高科技园区碧波路888号',
      latitude: 31.2045,
      longitude: 121.5854,
      contact: '139****1234',
      images: [],
      status: 'searching',
      createTime: '2026-06-02T08:00:00.000Z'
    },
    {
      id: 'mock_lost_003',
      type: 'lost',
      petType: 'dog',
      name: '大宝',
      breed: '柯基犬',
      color: '黄白双色',
      age: '3岁',
      gender: '公',
      injury: '无',
      description: '在公园遛弯时挣脱牵引绳跑丢，非常贪吃，对零食袋声音敏感。体型偏胖，短腿，背部有深色条纹。走失时身穿蓝色小马甲。',
      address: '广州市天河区珠江新城花城广场附近',
      latitude: 23.1198,
      longitude: 113.3245,
      contact: '185****5678',
      images: [],
      status: 'searching',
      createTime: '2026-06-04T16:00:00.000Z'
    }
  ]
  storage.setList('lost_pets', data)
}

// ========== 拾到流浪动物 Mock（4条） ==========
function initFoundPets() {
  const data = [
    {
      id: 'mock_found_001',
      type: 'found',
      petType: 'cat',
      name: '未命名',
      breed: '中华田园猫（橘猫）',
      color: '橘色条纹',
      age: '约6个月',
      gender: '未知',
      injury: '左后腿轻微跛行',
      description: '在小区垃圾桶旁发现，非常瘦弱，应该是饿了几天。目前已带回家临时安置，性格活泼不怕人，会用猫砂。',
      address: '深圳市南山区科技园南路16号附近',
      latitude: 22.5370,
      longitude: 113.9534,
      contact: '136****8901',
      images: [],
      status: 'found',
      createTime: '2026-06-03T12:00:00.000Z'
    },
    {
      id: 'mock_found_002',
      type: 'found',
      petType: 'dog',
      name: '未命名',
      breed: '泰迪犬（疑似混血）',
      color: '棕色卷毛',
      age: '约1-2岁',
      gender: '母',
      injury: '无明显外伤',
      description: '在公交站台徘徊了一整天，身上比较干净，应该是近期走失。毛发有修剪痕迹，对陌生人友好。',
      address: '杭州市西湖区文三路与学院路交叉口',
      latitude: 30.2820,
      longitude: 120.1265,
      contact: '157****2345',
      images: [],
      status: 'found',
      createTime: '2026-06-05T09:30:00.000Z'
    },
    {
      id: 'mock_found_003',
      type: 'found',
      petType: 'cat',
      name: '小黑',
      breed: '中华田园猫（黑猫）',
      color: '纯黑色',
      age: '约1岁',
      gender: '公',
      injury: '右眼角膜轻微浑浊',
      description: '下雨天在学校车棚下发现，全身湿透发抖。纯黑短毛，黄色眼睛，非常安静不爱叫。已经带去宠物医院做了基础检查。',
      address: '成都市武侯区一环路南一段24号四川大学附近',
      latitude: 30.6350,
      longitude: 104.0780,
      contact: '182****3456',
      images: [],
      status: 'found',
      createTime: '2026-06-01T18:00:00.000Z'
    },
    {
      id: 'mock_found_004',
      type: 'found',
      petType: 'dog',
      name: '未命名',
      breed: '哈士奇',
      color: '黑白双色',
      age: '约1岁',
      gender: '公',
      injury: '无',
      description: '在小区门口跟着外卖小哥跑进来的，精力旺盛，应该是家养走失的。脖子上有蓝色项圈但无身份牌。',
      address: '武汉市武昌区中南路地铁站C口',
      latitude: 30.5410,
      longitude: 114.3360,
      contact: '177****7890',
      images: [],
      status: 'found',
      createTime: '2026-06-06T07:00:00.000Z'
    }
  ]
  storage.setList('found_pets', data)
}

// ========== 待领养宠物 Mock（6条） ==========
function initAdoptPets() {
  const data = [
    {
      id: 'mock_adopt_001',
      type: 'adopt',
      petType: 'dog',
      name: '小黄',
      breed: '中华田园犬（串串）',
      color: '黄色短毛',
      age: '约8个月',
      gender: '母',
      size: '中型',
      health: '已驱虫、已打疫苗',
      character: '活泼好动，亲人，适合有小孩的家庭',
      injury: '无',
      description: '小黄是一只被遗弃在工地的流浪狗宝宝，被救助时只有两个月大。现在健康活泼，已经学会定点大小便和基本指令。非常聪明，对食物动力强，容易训练。',
      address: '北京市朝阳区望京流浪动物救助中心',
      latitude: 39.9850,
      longitude: 116.4750,
      contact: '010-****5678',
      images: [],
      shelterId: 'shelter_001',
      shelterName: '望京流浪动物救助中心',
      status: 'available',
      createTime: '2026-04-15T10:00:00.000Z'
    },
    {
      id: 'mock_adopt_002',
      type: 'adopt',
      petType: 'cat',
      name: '花花',
      breed: '三花猫',
      color: '白黑橙三色',
      age: '约1岁',
      gender: '母',
      size: '小型',
      health: '已绝育、已驱虫、已打疫苗',
      character: '温柔安静，喜欢被摸头，适合上班族',
      injury: '无',
      description: '花花是在某小区救助的流浪猫妈妈，它的宝宝们都已经找到领养。花花性格温柔，不拆家不闹腾，适合在公寓饲养。已绝育。',
      address: '上海市闵行区莘庄流浪猫狗救助站',
      latitude: 31.1116,
      longitude: 121.3800,
      contact: '021-****9012',
      images: [],
      shelterId: 'shelter_002',
      shelterName: '莘庄流浪猫狗救助站',
      status: 'available',
      createTime: '2026-04-20T14:00:00.000Z'
    },
    {
      id: 'mock_adopt_003',
      type: 'adopt',
      petType: 'dog',
      name: '阿福',
      breed: '拉布拉多（混血）',
      color: '米白色',
      age: '约2岁',
      gender: '公',
      size: '大型',
      health: '已绝育、已驱虫、已打疫苗',
      character: '稳重忠诚，适合做陪伴犬，需要较大活动空间',
      injury: '无',
      description: '阿福是救助站从狗肉车上救下的狗狗之一，经历过创伤但对人仍然信任。性格稳重，不扑人不乱叫，是非常好的家庭伴侣犬。需要有足够活动空间的家庭。',
      address: '广州市番禺区市桥流浪动物救助中心',
      latitude: 22.9380,
      longitude: 113.3620,
      contact: '020-****3456',
      images: [],
      shelterId: 'shelter_003',
      shelterName: '市桥流浪动物救助中心',
      status: 'available',
      createTime: '2026-05-01T09:00:00.000Z'
    },
    {
      id: 'mock_adopt_004',
      type: 'adopt',
      petType: 'cat',
      name: '团子',
      breed: '美国短毛猫（疑似混血）',
      color: '银色虎斑',
      age: '约4个月',
      gender: '公',
      size: '小型',
      health: '已驱虫、第一针疫苗',
      character: '好奇心强，活泼爱玩，适合新手',
      injury: '无',
      description: '团子是在公园发现的独行小猫，救助时只有巴掌大。现在健康活泼，是标准的"干饭猫"，对逗猫棒毫无抵抗力。适合第一次养猫的新手。',
      address: '杭州市余杭区临平流浪动物之家',
      latitude: 30.4210,
      longitude: 120.3020,
      contact: '0571-****7890',
      images: [],
      shelterId: 'shelter_004',
      shelterName: '临平流浪动物之家',
      status: 'available',
      createTime: '2026-05-10T11:00:00.000Z'
    },
    {
      id: 'mock_adopt_005',
      type: 'adopt',
      petType: 'dog',
      name: '雪球',
      breed: '比熊犬',
      color: '纯白色',
      age: '约3岁',
      gender: '母',
      size: '小型',
      health: '已绝育、已驱虫、已打疫苗',
      character: '粘人精，喜欢抱抱，适合老年陪伴',
      injury: '无',
      description: '雪球原主人因搬家无法继续饲养。性格极度粘人，喜欢窝在人腿上睡觉。不掉毛，适合公寓饲养。需要一个有耐心、能经常陪伴的主人。',
      address: '成都市锦江区春熙路流浪动物救助站',
      latitude: 30.6570,
      longitude: 104.0830,
      contact: '028-****0123',
      images: [],
      shelterId: 'shelter_005',
      shelterName: '春熙路流浪动物救助站',
      status: 'available',
      createTime: '2026-05-18T15:00:00.000Z'
    },
    {
      id: 'mock_adopt_006',
      type: 'adopt',
      petType: 'cat',
      name: '大橘',
      breed: '橘猫（中华田园猫）',
      color: '橘白双色',
      age: '约2岁',
      gender: '公',
      size: '中型',
      health: '已绝育、已驱虫、已打疫苗',
      character: '佛系懒散，爱吃爱睡，适合佛系主人',
      injury: '右耳有V型缺口（已愈合）',
      description: '大橘是救助站的"元老级"猫咪，因性格太佛系总是被活泼的猫咪抢先找到领养。其实大橘非常适合需要一个安静陪伴的主人，它只需要一个温暖的窝和定时投喂。',
      address: '武汉市洪山区光谷流浪动物救助站',
      latitude: 30.5070,
      longitude: 114.4050,
      contact: '027-****4567',
      images: [],
      shelterId: 'shelter_006',
      shelterName: '光谷流浪动物救助站',
      status: 'available',
      createTime: '2026-03-01T10:00:00.000Z'
    }
  ]
  storage.setList('adopt_pets', data)
}

// ========== 救助站账号 Mock（2个） ==========
function initShelterUsers() {
  const data = [
    {
      id: 'shelter_001',
      username: 'admin',
      password: '123456',
      name: '望京流浪动物救助中心',
      address: '北京市朝阳区望京街道',
      phone: '010-8888-5678',
      contactPerson: '李站长'
    },
    {
      id: 'shelter_002',
      username: 'shelter',
      password: '123456',
      name: '莘庄流浪猫狗救助站',
      address: '上海市闵行区莘庄镇',
      phone: '021-6666-9012',
      contactPerson: '王站长'
    }
  ]
  storage.setList('shelter_users', data)
}

// ========== 救助活动 Mock（2条） ==========
function initActivities() {
  const data = [
    {
      id: 'mock_activity_001',
      title: '「给它一个家」线下领养日 — 6月专场',
      content: '本周末将举办线下领养日活动，届时将有30+只健康流浪猫狗等待领养。现场有兽医免费咨询、宠物用品义卖、志愿者招募等环节。\n\n时间：2026年6月15日 10:00-17:00\n地点：望京SOHO中心广场\n\n领养要求：\n1. 年满18周岁，有稳定住所\n2. 家人同意领养\n3. 愿意接受定期回访\n4. 科学喂养，适龄绝育',
      shelterId: 'shelter_001',
      shelterName: '望京流浪动物救助中心',
      type: 'activity',
      createTime: '2026-06-01T09:00:00.000Z'
    },
    {
      id: 'mock_activity_002',
      title: '紧急募捐：救助站猫粮狗粮告急',
      content: '各位爱心人士，近期救助站收容数量激增，现有猫粮狗粮库存仅能维持一周。急需以下物资：\n\n🐱 猫粮（成猫/幼猫）：50kg\n🐶 狗粮（中型犬）：100kg\n💊 体内外驱虫药：各50支\n🏥 猫砂：100kg\n📦 尿垫/宠物尿布\n\n物资邮寄地址：上海市闵行区莘庄镇XX路XX号\n联系人：王站长 021-6666-9012\n\n也可扫描下方二维码直接捐款（每笔善款公开透明）',
      shelterId: 'shelter_002',
      shelterName: '莘庄流浪猫狗救助站',
      type: 'donation',
      createTime: '2026-06-03T14:00:00.000Z'
    }
  ]
  storage.setList('activities', data)
}

module.exports = {
  initAllData
}
