const storage = require('../../../utils/storage')

Page({
  data: {
    currentTab: 'lost',
    list: []
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    this.loadList()
  },

  loadList() {
    const tab = this.data.currentTab
    const list = tab === 'lost' ? storage.getLostPets() : storage.getFoundPets()
    this.setData({ list })
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab }, () => this.loadList())
  },

  goAddReport() {
    wx.navigateTo({
      url: '/pages/report/form/form?type=' + this.data.currentTab
    })
  }
})
