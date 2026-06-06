/**
 * DeepSeek API 调用封装
 * 用于 AI 文案生成，失败时抛出异常由上层降级处理
 */

const API_CONFIG = {
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-chat',
  maxTokens: 2048,
  temperature: 0.8,
  timeout: 15000
}

/**
 * 获取 API Key（从本地存储）
 */
function getApiKey() {
  return wx.getStorageSync('apiKey') || ''
}

/**
 * 保存 API Key
 */
function setApiKey(key) {
  wx.setStorageSync('apiKey', key)
}

/**
 * 检查 API Key 是否已配置
 */
function hasApiKey() {
  const key = getApiKey()
  return key && key.trim().length > 10
}

/**
 * 调用 DeepSeek API 生成视频文案
 * @param {Object} petInfo 宠物信息
 * @param {string} textType 文案类型: 'search' 寻宠 | 'adopt' 领养
 * @returns {Promise<Object>} 生成的文案对象
 */
function generateVideoScript(petInfo, textType = 'search') {
  return new Promise((resolve, reject) => {
    const apiKey = getApiKey()
    if (!apiKey || apiKey.trim().length < 10) {
      reject(new Error('请先配置 DeepSeek API Key'))
      return
    }

    const prompt = buildPrompt(petInfo, textType)

    wx.request({
      url: `${API_CONFIG.baseUrl}/chat/completions`,
      method: 'POST',
      timeout: API_CONFIG.timeout,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        model: API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的短视频内容创作者，擅长为宠物公益类视频编写温情文案和分镜脚本。请严格按照要求的 JSON 格式输出，不要添加额外的解释。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: API_CONFIG.maxTokens,
        temperature: API_CONFIG.temperature
      },
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.choices) {
          try {
            const content = res.data.choices[0].message.content
            // 尝试从 AI 回复中提取 JSON
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const result = JSON.parse(jsonMatch[0])
              resolve({ ...result, _raw: content, _source: 'ai' })
            } else {
              reject(new Error('AI 返回格式异常，无法解析'))
            }
          } catch (e) {
            reject(new Error('AI 返回解析失败: ' + e.message))
          }
        } else if (res.statusCode === 401) {
          reject(new Error('API Key 无效，请检查后重试'))
        } else if (res.statusCode === 402) {
          reject(new Error('API 余额不足，请充值后重试'))
        } else {
          reject(new Error(`API 请求失败 (${res.statusCode})`))
        }
      },
      fail(err) {
        reject(new Error('网络请求失败: ' + (err.errMsg || '未知错误')))
      }
    })
  })
}

/**
 * 构建 AI 提示词
 */
function buildPrompt(petInfo, textType) {
  const typeLabel = textType === 'search' ? '寻宠启事' : '领养科普'
  const emotion = textType === 'search'
    ? '焦急、温情、充满希望——主人正在寻找走失的毛孩子'
    : '温暖、科普、有责任感——呼吁领养代替购买'

  return `请为以下流浪动物信息生成短视频素材文案。类型：${typeLabel}，情感基调：${emotion}。

宠物信息：
- 名称：${petInfo.name || '未知'}
- 类型：${petInfo.petType === 'cat' ? '猫咪' : petInfo.petType === 'dog' ? '狗狗' : '宠物'}
- 品种：${petInfo.breed || '未知'}
- 毛色：${petInfo.color || '未知'}
- 年龄：${petInfo.age || '未知'}
- 性别：${petInfo.gender || '未知'}
- 特征/性格：${petInfo.character || petInfo.description || '详见描述'}
- 地址：${petInfo.address || '未知'}
- 详细描述：${petInfo.description || '无'}

请严格按照以下 JSON 格式输出（不要添加其他内容）：

{
  "warmScript": "温情短视频成片文案（200-300字，感人叙事风格，适合配音朗读）",
  "scienceScript": "领养科普短视频文案（200-300字，知识科普风格，讲救助和领养的重要）",
  "storyboard": [
    "分镜1（0-3秒）：特写镜头 - [具体画面描述]",
    "分镜2（3-6秒）：中景镜头 - [具体画面描述]",
    "分镜3（6-9秒）：全景镜头 - [具体画面描述]",
    "分镜4（9-12秒）：信息卡片 - [具体画面描述]",
    "分镜5（12-15秒）：结尾号召 - [具体画面描述]"
  ],
  "douyinTitle": "抖音爆款标题（15-25字，带情感钩子）",
  "xiaohongshuTitle": "小红书种草标题（15-25字，温暖治愈风）",
  "hashtags": ["话题标签1", "话题标签2", "话题标签3", "话题标签4", "话题标签5"],
  "layoutTip": "排版建议（50字内，如文字位置、字体风格、配色建议）",
  "bgmTip": "背景音乐推荐（如：轻快钢琴、温情吉他、治愈纯音乐等）"
}`
}

module.exports = {
  generateVideoScript,
  setApiKey,
  getApiKey,
  hasApiKey
}
