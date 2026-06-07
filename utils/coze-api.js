/**
 * Coze API 调用封装
 * 用于小程序与 Coze Bot 的对话联动
 * API 文档: https://www.coze.cn/docs/developer_guides/chat_v3
 */

const API_CONFIG = {
  baseUrl: 'https://api.coze.cn',
  version: 'v3'
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

    // 构建消息列表（Coze v3 API 使用 additional_messages）
    const additionalMessages = buildMessages(message, chatHistory)

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
        stream: false,
        auto_save_history: true,
        additional_messages: additionalMessages
      },
      success(res) {
        console.log('Coze API 响应状态:', res.statusCode)
        console.log('Coze API 响应数据:', JSON.stringify(res.data))

        if (res.statusCode === 200 && res.data) {
          const data = res.data
          // Coze v3 API 返回格式
          let reply = ''
          if (data.messages && Array.isArray(data.messages)) {
            reply = data.messages
              .filter(m => m.role === 'assistant' && m.type === 'answer')
              .map(m => m.content)
              .join('\n')
          }
          if (!reply && data.content) {
            reply = data.content
          }
          if (!reply && data.msg) {
            reply = data.msg
          }

          if (reply) {
            resolve({
              reply: reply,
              raw: data,
              conversationId: data.conversation_id || ''
            })
          } else {
            // 可能是异步任务，需要轮询
            reject(new Error('Coze 返回数据格式异常，请检查 Bot ID 是否正确'))
          }
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          reject(new Error('API Key 无效或未授权，请检查'))
        } else if (res.statusCode === 404) {
          reject(new Error('Bot 不存在，请检查 Bot ID'))
        } else if (res.statusCode === 429) {
          reject(new Error('请求太频繁，请稍后再试'))
        } else {
          const errMsg = res.data && res.data.msg ? res.data.msg : JSON.stringify(res.data || {})
          reject(new Error(`请求失败(${res.statusCode}): ${errMsg}`))
        }
      },
      fail(err) {
        console.error('Coze 网络请求失败:', err)
        reject(new Error('网络请求失败: ' + (err.errMsg || '未知错误') + '\n\n请确认:\n1. 开发者工具勾选「不校验合法域名」\n2. 网络连接正常'))
      }
    })
  })
}

/**
 * 构建对话消息
 */
function buildMessages(currentMsg, history) {
  const recentHistory = history.slice(-6)
  const messages = recentHistory.map(h => ({
    role: h.role,
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
