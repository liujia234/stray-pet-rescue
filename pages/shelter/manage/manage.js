const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: {
    pets: [],
    showModal: false,
    editingId: null,
    editForm: {
      name: '',
      petType: 'dog',
      breed: '',
      color: '',
      age: '',
      size: 'medium',
      sizeIndex: 1,
      character: '',
      health: '',
      description: '',
      address: '',
      contact: ''
    },
    sizeOptions: ['小型', '中型', '大型']
  },

  onShow() {
    this.loadPets()
  },

  loadPets() {
    const shelter = wx.getStorageSync('shelter_user')
    const allPets = storage.getAdoptPets()
    // 只显示当前救助站的宠物
    const myPets = shelter
      ? allPets.filter(p => p.shelterId === shelter.id)
      : allPets
    this.setData({ pets: myPets })
  },

  showAddDialog() {
    this.setData({
      showModal: true,
      editingId: null,
      editForm: {
        name: '',
        petType: 'dog',
        breed: '',
        color: '',
        age: '',
        size: 'medium',
        sizeIndex: 1,
        character: '',
        health: '',
        description: '',
        address: '',
        contact: ''
      }
    })
  },

  editPet(e) {
    const id = e.currentTarget.dataset.id
    const pet = this.data.pets.find(p => p.id === id)
    if (!pet) return

    const sizeMap = { small: 0, medium: 1, large: 2 }
    this.setData({
      showModal: true,
      editingId: id,
      editForm: {
        name: pet.name || '',
        petType: pet.petType || 'dog',
        breed: pet.breed || '',
        color: pet.color || '',
        age: pet.age || '',
        size: pet.size || 'medium',
        sizeIndex: sizeMap[pet.size] || 1,
        character: pet.character || '',
        health: pet.health || '',
        description: pet.description || '',
        address: pet.address || '',
        contact: pet.contact || ''
      }
    })
  },

  onEditInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ ['editForm.' + field]: e.detail.value })
  },

  setEditField(e) {
    const { field, value } = e.currentTarget.dataset
    this.setData({ ['editForm.' + field]: value })
  },

  onSizeChange(e) {
    const idx = parseInt(e.detail.value)
    const sizes = ['small', 'medium', 'large']
    this.setData({
      ['editForm.sizeIndex']: idx,
      ['editForm.size']: sizes[idx]
    })
  },

  closeModal() {
    this.setData({ showModal: false })
  },

  savePet() {
    const form = this.data.editForm
    if (!form.name.trim()) return util.showToast('请输入名称')
    if (!form.description.trim()) return util.showToast('请输入描述')

    const shelter = wx.getStorageSync('shelter_user') || {}

    const petData = {
      type: 'adopt',
      petType: form.petType,
      name: form.name.trim(),
      breed: form.breed.trim(),
      color: form.color.trim(),
      age: form.age.trim(),
      size: form.size,
      character: form.character.trim(),
      health: form.health.trim(),
      description: form.description.trim(),
      address: form.address.trim() || (shelter.address || ''),
      contact: form.contact.trim() || (shelter.phone || ''),
      status: 'available',
      shelterId: shelter.id || '',
      shelterName: shelter.name || '',
      images: []
    }

    if (this.data.editingId) {
      storage.updateAdoptPet(this.data.editingId, petData)
      util.showToast('修改成功', 'success')
    } else {
      storage.addAdoptPet(petData)
      util.showToast('新增成功', 'success')
    }

    this.setData({ showModal: false })
    this.loadPets()
  },

  toggleStatus(e) {
    const { id, status } = e.currentTarget.dataset
    const newStatus = status === 'available' ? 'offline' : 'available'
    storage.updateAdoptPet(id, { status: newStatus })
    util.showToast(newStatus === 'available' ? '已上架' : '已下架', 'success')
    this.loadPets()
  },

  deletePet(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确定删除吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteAdoptPet(id)
          util.showToast('已删除')
          this.loadPets()
        }
      }
    })
  }
})
