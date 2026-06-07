const cozeApi = require('../../utils/coze-api')
const util = require('../../utils/util')

Page({
  data: {
    messages: [],
    inputText: '',
    loading: false,
    scrollToView: '',
    configured: false,
    showConfigModal: false,
    botId: '',
    apiKey: ''
  },

  onLoad() {
    const config = cozeApi.getCozeConfig()
    this.setData({
      configured: cozeApi.isConfigured(),
      botId: config.botId,
      apiKey: config.apiKey
    })
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },

  // 发送快捷标签消息
  sendQuick(e) {
    const text = e.currentTarget.dataset.text
    this.setData({ inputText: text })
    this.sendMessage()
  },

  // 发送消息
  async sendMessage() {
    const text = this.data.inputText.trim()
    if (!text) return util.showToast('请输入内容')
    if (this.data.loading) return
    if (!cozeApi.isConfigured()) {
      this.showConfig()
      return
    }

    // 添加用户消息
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text
    }
    const messages = [...this.data.messages, userMsg]
    this.setData({
      messages,
      inputText: '',
      loading: true,
      scrollToView: 'msg-' + userMsg.id
    })

    try {
      const result = await cozeApi.sendMessage(text, this.data.messages)
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.reply
      }
      this.setData({
        messages: [...this.data.messages, botMsg],
        loading: false,
        scrollToView: 'msg-' + botMsg.id
      })
    } catch (err) {
      util.showToast(err.message || '发送失败')
      // 删除发送失败的用户消息
      this.setData({
        messages: this.data.messages.filter(m => m.id !== userMsg.id),
        loading: false,
        inputText: text  // 恢复输入
      })
    }
  },

  // 配置弹窗
  showConfig() {
    const config = cozeApi.getCozeConfig()
    this.setData({
      showConfigModal: true,
      botId: config.botId,
      apiKey: config.apiKey
    })
  },
  closeConfig() {
    this.setData({ showConfigModal: false })
  },
  preventBubble() {
    // 阻止冒泡，不做任何事（防止点击弹窗内容时关闭）
  },
  onConfigInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [field]: e.detail.value })
  },
  saveConfig() {
    const { botId, apiKey } = this.data
    if (!botId.trim()) return util.showToast('请输入 Bot ID')
    if (!apiKey.trim()) return util.showToast('请输入 API Key')

    cozeApi.setCozeConfig(botId.trim(), apiKey.trim())
    this.setData({
      configured: true,
      showConfigModal: false
    })
    util.showToast('配置已保存！试试和我聊天吧~', 'success')
  }
})
