const storage = require('../../../utils/storage')
const aiApi = require('../../../utils/ai-api')

Page({
  data: {
    keyword: '',
    showFilter: false,
    filterType: 'all',
    filterSize: 'all',
    allPets: [],
    filteredList: [],
    favoriteCount: 0,
    hasApiKey: false
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    this.loadData()
  },

  loadData() {
    const allPets = storage.getAdoptPets()
    const favorites = storage.getFavorites()
    const hasApiKey = aiApi.hasApiKey()

    this.setData({
      allPets,
      favoriteCount: favorites.length,
      hasApiKey
    })
    this.applyFilters()
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value })
    this.applyFilters()
  },

  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter })
  },

  setFilter(e) {
    const { key, value } = e.currentTarget.dataset
    this.setData({ [key]: value })
    this.applyFilters()
  },

  applyFilters() {
    let list = [...this.data.allPets]
    const { keyword, filterType, filterSize } = this.data

    // 关键词过滤
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      list = list.filter(p =>
        (p.breed && p.breed.toLowerCase().includes(kw)) ||
        (p.color && p.color.toLowerCase().includes(kw)) ||
        (p.name && p.name.toLowerCase().includes(kw)) ||
        (p.description && p.description.toLowerCase().includes(kw))
      )
    }

    // 类型过滤
    if (filterType !== 'all') {
      list = list.filter(p => p.petType === filterType)
    }

    // 体型过滤
    if (filterSize !== 'all') {
      list = list.filter(p => p.size === filterSize)
    }

    this.setData({ filteredList: list })
  },

  // 收藏
  toggleFav(e) {
    const id = e.currentTarget.dataset.id
    storage.isFavorite(id) ? storage.removeFavorite(id) : storage.addFavorite(id)
    this.setData({ favoriteCount: storage.getFavorites().length })
    util.showToast(storage.isFavorite(id) ? '已收藏' : '已取消收藏')
  },

  isFav(id) {
    return storage.isFavorite(id)
  },

  // 只看收藏
  showMyFavorites() {
    const favIds = storage.getFavorites()
    if (favIds.length === 0) {
      util.showToast('还没有收藏哦~')
      return
    }
    const favPets = this.data.allPets.filter(p => favIds.includes(p.id))
    this.setData({ filteredList: favPets, showFilter: false })
    util.showToast(`已收藏 ${favIds.length} 只萌宠`)
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&type=adopt`
    })
  },

  goApply() {
    wx.navigateTo({
      url: '/pages/adopt/form/form'
    })
  },

  // 设置 API Key
  setApiKey() {
    wx.showModal({
      title: '配置 AI 接口',
      content: '请输入 DeepSeek API Key（从 platform.deepseek.com 获取）：',
      editable: true,
      placeholderText: 'sk-xxxxxxxxxxxxxxxx',
      success: (res) => {
        if (res.confirm && res.content) {
          aiApi.setApiKey(res.content.trim())
          this.setData({ hasApiKey: true })
          util.showToast('API Key 已保存', 'success')
        }
      }
    })
  }
})

const util = require('../../../utils/util')
