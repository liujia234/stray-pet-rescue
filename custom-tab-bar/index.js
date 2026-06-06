Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        icon: '🏠',
        badge: 0
      },
      {
        pagePath: '/pages/report/index/index',
        text: '寻宠',
        icon: '🔍',
        badge: 0
      },
      {
        pagePath: '/pages/adopt/index/index',
        text: '领养',
        icon: '💕',
        badge: 0
      },
      {
        pagePath: '/pages/shelter/login/login',
        text: '救助站',
        icon: '🏥',
        badge: 0
      }
    ]
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      const index = data.index

      // 更新选中状态
      this.setData({ selected: index })

      // 跳转
      wx.switchTab({ url })
    }
  }
})
