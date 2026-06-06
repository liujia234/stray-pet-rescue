const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    pet: {},
    petId: '',
    petType: 'lost',
    statusConfig: { text: '', class: '' },
    typeName: '',
    genderName: '',
    sizeName: '',
    createTimeText: '',
    maskedPhone: '',
    placeholderColor: '',
    messages: [],
    msgInput: '',
    isFavorited: false
  },

  onLoad(options) {
    const id = options.id
    const type = options.type || 'lost'
    if (!id) {
      util.showToast('参数错误')
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }

    this.setData({ petId: id, petType: type })
    this.loadPetData(id, type)
    this.loadMessages(id)
  },

  loadPetData(id, type) {
    let pet = null

    if (type === 'lost') pet = storage.getLostPetById(id)
    else if (type === 'found') pet = storage.getFoundPetById(id)
    else if (type === 'adopt') pet = storage.getAdoptPetById(id)

    // 如果不在专属列表中，尝试全局查找
    if (!pet) {
      pet = storage.getLostPetById(id) ||
            storage.getFoundPetById(id) ||
            storage.getAdoptPetById(id)
    }

    if (!pet) {
      util.showToast('宠物信息不存在')
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }

    const statusConfig = util.getStatusConfig(pet.status || 'searching')
    const typeName = util.getReportTypeName(pet.type || type)
    const genderName = util.getGenderName(pet.gender)
    const sizeName = util.getSizeName(pet.size)
    const createTimeText = util.formatDate(pet.createTime, 'full')
    const maskedPhone = util.maskPhone(pet.contact)
    const placeholderColor = util.getRandomColor()
    const isFavorited = storage.isFavorite(id)

    this.setData({
      pet,
      statusConfig,
      typeName,
      genderName,
      sizeName,
      createTimeText,
      maskedPhone,
      placeholderColor,
      isFavorited
    })
  },

  loadMessages(petId) {
    const messages = storage.getMessagesByPetId(petId)
    const formatted = messages.map(m => ({
      ...m,
      timeText: util.formatDate(m.createTime, 'relative')
    }))
    this.setData({ messages: formatted })
  },

  onMsgInput(e) {
    this.setData({ msgInput: e.detail.value })
  },

  sendMessage() {
    const content = this.data.msgInput.trim()
    if (!content) return util.showToast('请输入留言内容')

    storage.addMessage(this.data.petId, content, 'user')
    this.setData({ msgInput: '' })
    this.loadMessages(this.data.petId)
    util.showToast('留言成功', 'success')
  },

  toggleFavorite() {
    const isFav = storage.isFavorite(this.data.petId)
    if (isFav) {
      storage.removeFavorite(this.data.petId)
      this.setData({ isFavorited: false })
      util.showToast('已取消收藏')
    } else {
      storage.addFavorite(this.data.petId)
      this.setData({ isFavorited: true })
      util.showToast('已加入收藏', 'success')
    }
  },

  sharePet() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    util.showToast('请点击右上角分享')
  },

  // 跳转 AI 短视频生成
  goVideoGen() {
    const pet = this.data.pet
    const textType = pet.type === 'adopt' ? 'adopt' : 'search'
    const params = `id=${this.data.petId}&type=${pet.type || this.data.petType}&textType=${textType}`
    wx.navigateTo({
      url: `/pages/video-gen/video-gen?${params}`
    })
  }
})
