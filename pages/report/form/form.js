const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: {
    isLost: true,
    form: {
      petType: 'dog',
      name: '',
      breed: '',
      color: '',
      age: '',
      gender: '',
      injury: '',
      description: '',
      address: '',
      contact: '',
      latitude: 0,
      longitude: 0
    },
    images: [],
    previewData: {}
  },

  onLoad(options) {
    const type = options.type || 'lost'
    this.setData({ isLost: type === 'lost' })
  },

  setType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ isLost: type === 'lost' })
  },

  setField(e) {
    const { field, value } = e.currentTarget.dataset
    this.setData({
      ['form.' + field]: value
    })
    this.updatePreview()
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      ['form.' + field]: e.detail.value
    })
    this.updatePreview()
  },

  // GPS 定位
  getLocation() {
    util.showLoading('获取位置中...')
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res
        // 逆地址解析
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=OUDBZ-PI6K3-M6C3A-OZR5B-OVH7Q-32B6L`,
          success: (addrRes) => {
            util.hideLoading()
            if (addrRes.data && addrRes.data.status === 0) {
              const addr = addrRes.data.result.address
              this.setData({
                ['form.address']: addr,
                ['form.latitude']: latitude,
                ['form.longitude']: longitude
              })
            } else {
              this.setData({
                ['form.address']: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                ['form.latitude']: latitude,
                ['form.longitude']: longitude
              })
            }
            this.updatePreview()
          },
          fail: () => {
            util.hideLoading()
            this.setData({
              ['form.address']: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              ['form.latitude']: latitude,
              ['form.longitude']: longitude
            })
            this.updatePreview()
          }
        })
      },
      fail: (err) => {
        util.hideLoading()
        console.log('定位失败:', err)
        wx.showModal({
          title: '定位失败',
          content: '请在设置中授权位置权限，或手动输入地址',
          showCancel: false
        })
      }
    })
  },

  // 选择图片
  chooseImage() {
    const remain = 6 - this.data.images.length
    if (remain <= 0) {
      util.showToast('最多上传6张照片')
      return
    }
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        const images = [...this.data.images, ...newImages]
        this.setData({ images })
        this.updatePreview()
      }
    })
  },

  // 删除图片
  removeImage(e) {
    const index = e.currentTarget.dataset.index
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
    this.updatePreview()
  },

  // 更新预览
  updatePreview() {
    const preview = {
      ...this.data.form,
      type: this.data.isLost ? 'lost' : 'found',
      images: this.data.images,
      status: 'searching',
      id: 'preview_temp'
    }
    this.setData({ previewData: preview })
  },

  // 提交
  onSubmit() {
    const form = this.data.form
    // 必填校验
    if (!form.name.trim()) return util.showToast('请输入宠物名称')
    if (!form.description.trim()) return util.showToast('请填写详细描述')
    if (!form.address.trim()) return util.showToast('请填写或获取地点')
    if (!form.contact.trim()) return util.showToast('请输入联系电话')
    if (form.contact.trim().length < 11) return util.showToast('请输入正确的手机号')

    const petData = {
      type: this.data.isLost ? 'lost' : 'found',
      petType: form.petType,
      name: form.name.trim(),
      breed: form.breed.trim(),
      color: form.color.trim(),
      age: form.age.trim(),
      gender: form.gender,
      injury: form.injury.trim(),
      description: form.description.trim(),
      address: form.address.trim(),
      latitude: form.latitude,
      longitude: form.longitude,
      contact: form.contact.trim(),
      images: this.data.images,
      status: this.data.isLost ? 'searching' : 'found'
    }

    if (this.data.isLost) {
      storage.addLostPet(petData)
    } else {
      storage.addFoundPet(petData)
    }

    util.showToast('发布成功！', 'success')

    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})
