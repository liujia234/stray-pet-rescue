const util = require('../../../utils/util')
const storage = require('../../../utils/storage')

Page({
  data: {
    form: {
      city: '',
      housingType: '',
      hasExperience: '',
      space: '',
      lifestyle: '',
      preferType: 'all',
      preferBreed: ''
    }
  },

  setField(e) {
    const { field, value } = e.currentTarget.dataset
    this.setData({ ['form.' + field]: value })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ ['form.' + field]: e.detail.value })
  },

  toggleLifestyle(e) {
    const value = e.currentTarget.dataset.value
    let lifestyle = this.data.form.lifestyle
    const arr = lifestyle ? lifestyle.split(',') : []
    const idx = arr.indexOf(value)
    if (idx > -1) {
      arr.splice(idx, 1)
    } else {
      arr.push(value)
    }
    this.setData({ ['form.lifestyle']: arr.join(',') })
  },

  onSubmit() {
    const form = this.data.form
    if (!form.city.trim()) return util.showToast('请输入居住城市')
    if (!form.housingType) return util.showToast('请选择住房类型')
    if (!form.hasExperience) return util.showToast('请选择养宠经验')

    // 保存申请表
    storage.addAdoptApp({
      ...form,
      city: form.city.trim(),
      preferBreed: form.preferBreed.trim(),
      space: form.space.trim(),
      submitTime: new Date().toISOString()
    })

    // 跳转匹配结果页，携带表单参数
    const params = Object.entries(form)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')
    wx.navigateTo({
      url: `/pages/adopt/match/match?${params}`
    })
  }
})
