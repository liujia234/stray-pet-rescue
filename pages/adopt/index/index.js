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

  goChatBot() {
    wx.navigateTo({
      url: '/pages/chat/chat'
    })
  },

  // 测试 API Key
  testApiKey() {
    util.showLoading('正在测试连接...')
    const apiKey = aiApi.getApiKey()
    wx.request({
      url: 'https://api.deepseek.com/v1/chat/completions',
      method: 'POST',
      timeout: 10000,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: '你好，请回复"连接成功"' }],
        max_tokens: 10
      },
      success: (res) => {
        util.hideLoading()
        if (res.statusCode === 200) {
          wx.showModal({
            title: '✅ 连接成功',
            content: 'DeepSeek API 调用正常，AI 文案生成功能可用！',
            showCancel: false
          })
        } else if (res.statusCode === 401) {
          wx.showModal({
            title: '❌ 认证失败',
            content: 'API Key 无效，请检查是否复制完整（以 sk- 开头）',
            showCancel: false
          })
        } else if (res.statusCode === 402) {
          wx.showModal({
            title: '💰 余额不足',
            content: 'DeepSeek 账户余额不足，请前往 platform.deepseek.com 充值',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '⚠️ 连接异常',
            content: `返回状态码: ${res.statusCode}\n可能原因：\n1. 网络不通\n2. API 地址被拦截\n3. 开发者工具中请在「详情→本地设置」勾选「不校验合法域名」`,
            showCancel: false
          })
        }
      },
      fail: (err) => {
        util.hideLoading()
        wx.showModal({
          title: '❌ 网络请求失败',
          content: `错误信息: ${err.errMsg || '未知'}\n\n请检查：\n1. 是否在微信开发者工具中\n2. 详情→本地设置→勾选「不校验合法域名」\n3. 网络是否正常`,
          showCancel: false
        })
      }
    })
  },

  // 清除 API Key
  clearApiKey() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除已保存的 API Key 吗？',
      success: (res) => {
        if (res.confirm) {
          aiApi.setApiKey('')
          this.setData({ hasApiKey: false })
          util.showToast('已清除')
        }
      }
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
