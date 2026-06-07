const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    stats: { lostCount: 0, foundCount: 0, adoptCount: 0, activityCount: 0 },
    latestLost: [],
    latestAdopt: [],
    latestActivity: null
  },

  onShow() {
    this.loadData()
    // 更新自定义 TabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  loadData() {
    const stats = storage.getStats()
    const lostPets = storage.getLostPets()
    const adoptPets = storage.getAdoptPets()
    const activities = storage.getActivities()

    this.setData({
      stats,
      latestLost: lostPets.filter(p => p.status === 'searching').slice(0, 2),
      latestAdopt: adoptPets.filter(p => p.status === 'available').slice(0, 2),
      latestActivity: activities.length > 0 ? activities[0] : null
    })
  },

  // 跳转寻宠页
  goReport() {
    wx.switchTab({ url: '/pages/report/index/index' })
  },

  // 跳转领养页
  goAdopt() {
    wx.switchTab({ url: '/pages/adopt/index/index' })
  },

  // 跳转救助站
  goShelter() {
    wx.switchTab({ url: '/pages/shelter/login/login' })
  },

  // 跳转 AI 设置
  goAISetup() {
    wx.showModal({
      title: '🎬 AI 短视频生成',
      content: '在任意宠物详情页中，点击「生成短视频素材」按钮即可使用。\n\nAI 会自动生成：\n• 温情寻宠/领养科普文案\n• 5镜分镜描述\n• 抖音/小红书标题\n• 话题标签 + BGM推荐\n\n配置 DeepSeek API Key 可开启智能生成。',
      showCancel: true,
      cancelText: '知道了',
      confirmText: '去领养页',
      success(res) {
        if (res.confirm) {
          wx.switchTab({ url: '/pages/adopt/index/index' })
        }
      }
    })
  },

  goChatBot() {
    wx.navigateTo({
      url: '/pages/chat/chat'
    })
  },

  onActivityTap(e) {
    const id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: `/pages/shelter/activity/activity?id=${id}`
      })
    }
  }
})
