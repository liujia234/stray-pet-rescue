/**
 * Coze API 调用封装
 * 用于小程序与 Coze Bot 的对话联动
 */

const API_CONFIG = {
  baseUrl: 'https://api.coze.cn',
  version: 'v1'
}

/**
 * 获取 Coze 配置
 */
function getCozeConfig() {
  return {
    botId: wx.getStorageSync('coze_bot_id') || '',
    apiKey: wx.getStorageSync('coze_api_key') || ''
  }
}

/**
 * 保存 Coze 配置
 */
function setCozeConfig(botId, apiKey) {
  wx.setStorageSync('coze_bot_id', botId)
  wx.setStorageSync('coze_api_key', apiKey)
}

/**
 * 检查是否已配置
 */
function isConfigured() {
  const config = getCozeConfig()
  return !!(config.botId && config.apiKey)
}

/**
 * 发送消息到 Coze Bot
 * @param {string} message 用户消息
 * @param {Array} chatHistory 历史消息
 * @returns {Promise<Object>}
 */
function sendMessage(message, chatHistory = []) {
  return new Promise((resolve, reject) => {
    const config = getCozeConfig()
    if (!config.botId || !config.apiKey) {
      reject(new Error('请先配置 Coze Bot'))
      return
    }

    // 构建上下文消息
    const messages = buildMessages(message, chatHistory)

    wx.request({
      url: `${API_CONFIG.baseUrl}/${API_CONFIG.version}/chat`,
      method: 'POST',
      timeout: 30000,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      data: {
        bot_id: config.botId,
        user_id: 'mini_program_user',
        query: message,
        stream: false,
        chat_history: messages
      },
      success(res) {
        if (res.statusCode === 200 && res.data) {
          const data = res.data
          // Coze API 返回的消息在 messages 数组中
          const reply = data.messages
            ? data.messages.filter(m => m.role === 'assistant').map(m => m.content).join('\n')
            : (data.content || data.msg || JSON.stringify(data))

          resolve({
            reply: reply,
            raw: data,
            conversationId: data.conversation_id || ''
          })
        } else if (res.statusCode === 401) {
          reject(new Error('Coze API Key 无效'))
        } else {
          reject(new Error(`请求失败 (${res.statusCode}): ${JSON.stringify(res.data)}`))
        }
      },
      fail(err) {
        reject(new Error('网络请求失败: ' + (err.errMsg || '未知错误')))
      }
    })
  })
}

/**
 * 构建对话消息历史
 */
function buildMessages(currentMsg, history) {
  // Coze API 只需要传最近几轮对话
  const recentHistory = history.slice(-6)
  const messages = recentHistory.map(h => ({
    role: h.role,       // 'user' | 'assistant'
    content: h.content,
    content_type: 'text'
  }))
  messages.push({
    role: 'user',
    content: currentMsg,
    content_type: 'text'
  })
  return messages
}

module.exports = {
  getCozeConfig,
  setCozeConfig,
  isConfigured,
  sendMessage
}
