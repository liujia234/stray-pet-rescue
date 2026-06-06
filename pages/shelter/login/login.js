const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: {
    isLoggedIn: false,
    shelter: null,
    username: '',
    password: '',
    stats: { lostCount: 0, foundCount: 0, adoptCount: 0, activityCount: 0 }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    // 检查是否已登录
    const shelter = wx.getStorageSync('shelter_user')
    if (shelter) {
      this.setData({ isLoggedIn: true, shelter })
    }
    this.loadStats()
  },

  loadStats() {
    this.setData({ stats: storage.getStats() })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [field]: e.detail.value })
  },

  doLogin() {
    const { username, password } = this.data
    if (!username.trim()) return util.showToast('请输入账号')
    if (!password.trim()) return util.showToast('请输入密码')

    const users = storage.getShelterUsers()
    const user = users.find(u => u.username === username.trim() && u.password === password.trim())

    if (user) {
      // 不存密码到本地
      const shelterInfo = {
        id: user.id,
        name: user.name,
        address: user.address,
        phone: user.phone,
        contactPerson: user.contactPerson
      }
      wx.setStorageSync('shelter_user', shelterInfo)
      this.setData({ isLoggedIn: true, shelter: shelterInfo })
      util.showToast('登录成功', 'success')
    } else {
      util.showToast('账号或密码错误')
    }
  },

  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('shelter_user')
          this.setData({ isLoggedIn: false, shelter: null, username: '', password: '' })
          util.showToast('已退出')
        }
      }
    })
  },

  goDashboard() {
    wx.navigateTo({ url: '/pages/shelter/dashboard/dashboard' })
  },
  goManage() {
    wx.navigateTo({ url: '/pages/shelter/manage/manage' })
  },
  goActivity() {
    wx.navigateTo({ url: '/pages/shelter/activity/activity' })
  },
  goAllReports() {
    wx.switchTab({ url: '/pages/report/index/index' })
  },
  goReport() {
    wx.switchTab({ url: '/pages/report/index/index' })
  }
})
