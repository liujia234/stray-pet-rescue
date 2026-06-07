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
    wx.navigateTo({
      url: '/pages/chat/chat'
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
