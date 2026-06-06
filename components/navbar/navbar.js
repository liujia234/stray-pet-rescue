Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    showBack: {
      type: Boolean,
      value: false
    }
  },

  data: {
    statusBarHeight: 20,
    navBarHeight: 44
  },

  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight || 20,
        navBarHeight: (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height
      })
    }
  },

  methods: {
    onBackTap() {
      wx.navigateBack({ delta: 1 })
    }
  }
})
