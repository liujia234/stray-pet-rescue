const util = require('../../utils/util')

Component({
  properties: {
    // 宠物数据
    petData: {
      type: Object,
      value: {}
    },
    // 卡片类型: 'lost' | 'found' | 'adopt'
    cardType: {
      type: String,
      value: 'lost'
    },
    // 是否显示类型标签
    showType: {
      type: Boolean,
      value: true
    },
    // 是否显示操作区
    showActions: {
      type: Boolean,
      value: false
    },
    // 自定义占位色
    placeholderColor: {
      type: String,
      value: ''
    }
  },

  observers: {
    'petData': function(data) {
      if (data && data.id) {
        this.processData(data)
      }
    }
  },

  data: {
    // 处理后的展示数据
    name: '',
    breed: '',
    color: '',
    age: '',
    description: '',
    address: '',
    images: [],
    petType: 'dog',
    statusConfig: { text: '', class: '' },
    typeName: '',
    genderName: '',
    timeText: '',
    createTime: ''
  },

  methods: {
    processData(data) {
      const statusConfig = util.getStatusConfig(data.status || 'searching')
      const typeName = util.getReportTypeName(data.type || this.properties.cardType)
      const genderName = data.gender ? util.getGenderName(data.gender) : ''
      const timeText = data.createTime ? util.formatDate(data.createTime, 'relative') : ''

      // 图片路径处理（支持 base64 和临时路径）
      let images = []
      if (data.images && Array.isArray(data.images)) {
        images = data.images.filter(Boolean).slice(0, 6)
      }

      this.setData({
        name: data.name || '',
        breed: data.breed || '',
        color: data.color || '',
        age: data.age || '',
        description: data.description || '',
        address: data.address || '',
        petType: data.petType || 'dog',
        statusConfig,
        typeName,
        genderName,
        timeText,
        createTime: data.createTime,
        images
      })
    },

    onCardTap() {
      const petData = this.properties.petData
      if (petData && petData.id) {
        const type = petData.type || this.properties.cardType
        wx.navigateTo({
          url: `/pages/detail/detail?id=${petData.id}&type=${type}`
        })
      }
    }
  }
})
