const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: {
    activities: [],
    showPublishModal: false,
    pubForm: {
      type: 'activity',
      title: '',
      content: ''
    }
  },

  onLoad(options) {
    // 如果是从首页跳转过来的，带活动 ID
    const id = options.id
    if (id) {
      // 展示特定活动（效果是滚动到对应位置）
      this.loadActivities()
      return
    }
    this.loadActivities()
  },

  onShow() {
    this.loadActivities()
  },

  loadActivities() {
    const activities = storage.getActivities()
    const formatted = activities.map(a => ({
      ...a,
      timeText: util.formatDate(a.createTime, 'date')
    }))
    this.setData({ activities: formatted })
  },

  showPublish() {
    this.setData({
      showPublishModal: true,
      pubForm: { type: 'activity', title: '', content: '' }
    })
  },

  closePublish() {
    this.setData({ showPublishModal: false })
  },

  setPubField(e) {
    const { field, value } = e.currentTarget.dataset
    this.setData({ ['pubForm.' + field]: value })
  },

  onPubInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ ['pubForm.' + field]: e.detail.value })
  },

  doPublish() {
    const form = this.data.pubForm
    if (!form.title.trim()) return util.showToast('请输入标题')
    if (!form.content.trim()) return util.showToast('请输入内容')

    const shelter = wx.getStorageSync('shelter_user') || {}

    storage.addActivity({
      title: form.title.trim(),
      content: form.content.trim(),
      type: form.type,
      shelterId: shelter.id || '',
      shelterName: shelter.name || '匿名救助站'
    })

    util.showToast('发布成功', 'success')
    this.setData({ showPublishModal: false })
    this.loadActivities()
  },

  deleteActivity(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定删除这条公告吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteActivity(id)
          util.showToast('已删除')
          this.loadActivities()
        }
      }
    })
  }
})
