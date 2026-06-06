/**
 * 通用工具函数
 */

/**
 * 格式化日期为可读字符串
 * @param {string|Date} dateStr ISO 日期字符串或 Date 对象
 * @param {string} format 格式类型: 'full' | 'date' | 'relative'
 */
function formatDate(dateStr, format = 'full') {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  if (format === 'date') {
    return `${year}-${month}-${day}`
  }
  if (format === 'relative') {
    return getRelativeTime(date)
  }
  return `${year}-${month}-${day} ${hour}:${minute}`
}

/**
 * 获取相对时间描述
 */
function getRelativeTime(date) {
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`
  return `${Math.floor(days / 365)}年前`
}

/**
 * 手机号脱敏显示
 */
function maskPhone(phone) {
  if (!phone) return ''
  if (phone.includes('****')) return phone
  if (phone.length === 11) {
    return phone.substring(0, 3) + '****' + phone.substring(7)
  }
  return phone
}

/**
 * 获取宠物类型中文名
 */
function getPetTypeName(type) {
  const map = {
    dog: '🐶 狗狗',
    cat: '🐱 猫咪',
    other: '🐾 其他'
  }
  return map[type] || '🐾 宠物'
}

/**
 * 获取上报类型中文名
 */
function getReportTypeName(type) {
  const map = {
    lost: '寻宠启事',
    found: '拾宠招领',
    adopt: '待领养'
  }
  return map[type] || '未知'
}

/**
 * 获取宠物性别中文名
 */
function getGenderName(gender) {
  const map = {
    male: '♂ 公',
    female: '♀ 母',
    unknown: '未知'
  }
  return map[gender] || '未知'
}

/**
 * 获取宠物体型中文名
 */
function getSizeName(size) {
  const map = {
    small: '小型',
    medium: '中型',
    large: '大型'
  }
  return map[size] || '未知'
}

/**
 * 获取状态标签配置
 */
function getStatusConfig(status) {
  const map = {
    searching: { text: '寻找中', class: 'tag-warning' },
    found: { text: '已找到', class: 'tag-success' },
    available: { text: '可领养', class: 'tag-success' },
    adopted: { text: '已领养', class: 'tag-info' },
    pending: { text: '审核中', class: 'tag-warning' },
    offline: { text: '已下架', class: '' }
  }
  return map[status] || { text: status, class: '' }
}

/**
 * 判断宠物是猫还是狗（基于品种关键词）
 */
function guessPetType(breed) {
  if (!breed) return 'other'
  const catKeywords = ['猫', '英短', '美短', '暹罗', '布偶', '橘', '三花', '狸花', '加菲', '缅因']
  const dogKeywords = ['狗', '犬', '金毛', '泰迪', '柯基', '哈士奇', '二哈', '拉布拉多', '比熊', '柴犬', '边牧', '萨摩']

  const lower = breed.toLowerCase()
  for (const kw of catKeywords) {
    if (lower.includes(kw)) return 'cat'
  }
  for (const kw of dogKeywords) {
    if (lower.includes(kw)) return 'dog'
  }
  return 'other'
}

/**
 * 生成随机颜色（用于占位图背景）
 */
function getRandomColor() {
  const colors = ['#FFD4A8', '#FFB89A', '#FFD1C1', '#FFE4C4', '#FFECD2', '#FADADD']
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 深拷贝
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Toast 提示封装
 */
function showToast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 2000 })
}

/**
 * 显示加载中
 */
function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true })
}

/**
 * 隐藏加载
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示确认弹窗
 */
function showConfirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success(res) {
        resolve(res.confirm)
      }
    })
  })
}

module.exports = {
  formatDate,
  maskPhone,
  getPetTypeName,
  getReportTypeName,
  getGenderName,
  getSizeName,
  getStatusConfig,
  guessPetType,
  getRandomColor,
  deepClone,
  showToast,
  showLoading,
  hideLoading,
  showConfirm
}
