const storage = require('../../utils/storage')
const aiApi = require('../../utils/ai-api')
const templateText = require('../../utils/template-text')
const util = require('../../utils/util')

Page({
  data: {
    petId: '',
    textType: 'search',  // 'search' | 'adopt'
    generating: true,
    loadingText: '正在分析宠物信息...',
    result: null,
    errorMsg: '',
    activeTab: 'warm',
    hashtagsStr: ''
  },

  onLoad(options) {
    const id = options.id
    const type = options.type || 'lost'
    const textType = options.textType || 'search'

    this.setData({ petId: id, textType })

    // 获取宠物数据
    let pet = null
    if (type === 'lost') pet = storage.getLostPetById(id)
    else if (type === 'found') pet = storage.getFoundPetById(id)
    else if (type === 'adopt') pet = storage.getAdoptPetById(id)

    if (!pet) {
      pet = storage.getLostPetById(id) ||
            storage.getFoundPetById(id) ||
            storage.getAdoptPetById(id)
    }

    if (!pet) {
      this.setData({
        generating: false,
        errorMsg: '宠物信息加载失败，请返回重试'
      })
      return
    }

    this.generateContent(pet)
  },

  async generateContent(pet) {
    const textType = this.data.textType

    // 模拟加载动画
    const loadingTexts = [
      '正在分析宠物信息...',
      '正在生成温情文案...',
      '正在设计分镜脚本...',
      '正在优化标题标签...',
      '即将完成...'
    ]
    let step = 1
    const loadingTimer = setInterval(() => {
      if (step < loadingTexts.length) {
        this.setData({ loadingText: loadingTexts[step] })
        step++
      }
    }, 800)

    try {
      // 先尝试 AI 生成
      const hasKey = aiApi.hasApiKey()
      let result = null

      if (hasKey) {
        try {
          this.setData({ loadingText: '正在调用 AI 智能生成...' })
          result = await aiApi.generateVideoScript(pet, textType)
        } catch (aiErr) {
          console.log('AI 调用失败，降级到模板:', aiErr.message)
          // 降级到本地模板
          result = templateText.generateWithTemplate(pet, textType)
        }
      } else {
        // 没有 API Key，直接使用模板
        this.setData({ loadingText: '使用本地模板生成...' })
        await new Promise(resolve => setTimeout(resolve, 600))
        result = templateText.generateWithTemplate(pet, textType)
      }

      clearInterval(loadingTimer)
      this.setData({
        generating: false,
        result,
        hashtagsStr: (result.hashtags || []).join(' '),
        errorMsg: ''
      })
    } catch (err) {
      clearInterval(loadingTimer)
      console.error('生成失败:', err)
      this.setData({
        generating: false,
        errorMsg: '生成失败: ' + (err.message || '未知错误')
      })
    }
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  copyText(e) {
    const text = e.currentTarget.dataset.text
    if (!text) return
    wx.setClipboardData({
      data: text,
      success() {
        util.showToast('已复制到剪贴板', 'success')
      }
    })
  },

  // 一键复制全部
  copyAll() {
    const r = this.data.result
    if (!r) return

    const fullText = `【短视频完整素材】

=== 温情文案 ===
${r.warmScript}

=== ${this.data.textType === 'search' ? '寻宠科普' : '领养科普'}文案 ===
${r.scienceScript}

=== 分镜描述 ===
${r.storyboard.join('\n')}

=== 抖音标题 ===
${r.douyinTitle}

=== 小红书标题 ===
${r.xiaohongshuTitle}

=== 话题标签 ===
${r.hashtags.join(' ')}

=== 排版建议 ===
${r.layoutTip}

=== BGM推荐 ===
${r.bgmTip}
`

    wx.setClipboardData({
      data: fullText,
      success() {
        util.showToast('全部素材已复制！', 'success')
      }
    })
  },

  retryGenerate() {
    wx.navigateBack()
  }
})
