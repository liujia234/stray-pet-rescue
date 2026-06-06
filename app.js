/**
 * 流浪猫狗寻回领养救助平台
 * 公益类微信小程序 - 纯前端 Demo
 */

const storage = require('./utils/storage')
const mockData = require('./utils/mock-data')

App({
  globalData: {
    // DeepSeek API Key（用户自行配置）
    apiKey: '',
    // 当前登录的救助站信息
    shelterUser: null,
    // 用户收藏的宠物 ID 列表
    favorites: [],
    // 用户留言数据
    messages: []
  },

  onLaunch() {
    // 初始化数据：首次启动载入 Mock 数据
    this.initMockData()
    // 加载本地持久化数据
    this.loadLocalData()
  },

  /**
   * 首次启动时初始化 Mock 数据到 Storage
   */
  initMockData() {
    const initialized = wx.getStorageSync('data_initialized')
    if (!initialized) {
      mockData.initAllData()
      wx.setStorageSync('data_initialized', true)
      console.log('Mock 数据已初始化')
    }
  },

  /**
   * 从 Storage 加载全局状态
   */
  loadLocalData() {
    const apiKey = wx.getStorageSync('apiKey') || ''
    const favorites = wx.getStorageSync('favorites') || []
    const messages = wx.getStorageSync('messages') || []

    this.globalData.apiKey = apiKey
    this.globalData.favorites = favorites
    this.globalData.messages = messages
  },

  /**
   * 保存 API Key
   */
  setApiKey(key) {
    this.globalData.apiKey = key
    wx.setStorageSync('apiKey', key)
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite(petId) {
    const idx = this.globalData.favorites.indexOf(petId)
    if (idx > -1) {
      this.globalData.favorites.splice(idx, 1)
    } else {
      this.globalData.favorites.push(petId)
    }
    wx.setStorageSync('favorites', this.globalData.favorites)
    return idx === -1 // true = 已收藏, false = 已取消
  },

  /**
   * 检查是否已收藏
   */
  isFavorite(petId) {
    return this.globalData.favorites.indexOf(petId) > -1
  }
})
