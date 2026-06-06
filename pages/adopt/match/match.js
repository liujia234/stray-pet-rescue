const storage = require('../../../utils/storage')
const matchEngine = require('../../../utils/match-engine')
const util = require('../../../utils/util')

Page({
  data: {
    application: {},
    results: []
  },

  onLoad(options) {
    const application = {
      city: options.city || '',
      housingType: options.housingType || '',
      hasExperience: options.hasExperience || '',
      space: options.space || '',
      lifestyle: options.lifestyle || '',
      preferType: options.preferType || 'all',
      preferBreed: options.preferBreed || ''
    }

    this.setData({ application })

    // 执行匹配
    const allPets = storage.getAdoptPets()
    const matched = matchEngine.matchPets(application, allPets, 10)

    // 附加宠物完整信息
    const results = matched.map(m => ({
      ...m,
      pet: allPets.find(p => p.id === m.petId) || {}
    }))

    this.setData({ results })
  },

  toggleFav(e) {
    const id = e.currentTarget.dataset.id
    storage.isFavorite(id) ? storage.removeFavorite(id) : storage.addFavorite(id)
    util.showToast(storage.isFavorite(id) ? '已收藏' : '已取消收藏')
  },

  isFav(id) {
    return storage.isFavorite(id)
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&type=adopt`
    })
  }
})
