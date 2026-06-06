/**
 * 本地存储封装 - 模拟数据库操作
 * 所有数据以 key-value 形式存入 wx.Storage
 */

const STORAGE_KEYS = {
  LOST_PETS: 'lost_pets',           // 走失宠物上报列表
  FOUND_PETS: 'found_pets',         // 拾到流浪动物列表
  ADOPT_PETS: 'adopt_pets',         // 待领养宠物列表
  ADOPT_APPLICATIONS: 'adopt_apps',  // 领养申请表
  ACTIVITIES: 'activities',         // 救助活动/公告
  SHELTER_USERS: 'shelter_users',   // 救助站账号
  FAVORITES: 'favorites',           // 用户收藏
  MESSAGES: 'messages'              // 留言消息
}

/**
 * 通用读取
 */
function getList(key) {
  try {
    const data = wx.getStorageSync(key)
    return data || []
  } catch (e) {
    console.error(`读取 ${key} 失败:`, e)
    return []
  }
}

/**
 * 通用写入
 */
function setList(key, list) {
  try {
    wx.setStorageSync(key, list)
    return true
  } catch (e) {
    console.error(`写入 ${key} 失败:`, e)
    return false
  }
}

/**
 * 添加一条记录（自动生成 ID）
 */
function addItem(key, item) {
  const list = getList(key)
  const newItem = {
    ...item,
    id: generateId(),
    createTime: new Date().toISOString()
  }
  list.unshift(newItem)
  setList(key, list)
  return newItem
}

/**
 * 根据 ID 更新一条记录
 */
function updateItem(key, id, updates) {
  const list = getList(key)
  const index = list.findIndex(item => item.id === id)
  if (index > -1) {
    list[index] = { ...list[index], ...updates, updateTime: new Date().toISOString() }
    setList(key, list)
    return list[index]
  }
  return null
}

/**
 * 根据 ID 删除一条记录
 */
function deleteItem(key, id) {
  const list = getList(key)
  const filtered = list.filter(item => item.id !== id)
  setList(key, filtered)
  return filtered
}

/**
 * 根据 ID 查询单条
 */
function getById(key, id) {
  const list = getList(key)
  return list.find(item => item.id === id) || null
}

/**
 * 生成唯一 ID
 */
function generateId() {
  return 'pet_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9)
}

// ========== 具体业务操作 ==========

// 走失宠物
function getLostPets() { return getList(STORAGE_KEYS.LOST_PETS) }
function addLostPet(item) { return addItem(STORAGE_KEYS.LOST_PETS, item) }
function updateLostPet(id, updates) { return updateItem(STORAGE_KEYS.LOST_PETS, id, updates) }
function deleteLostPet(id) { return deleteItem(STORAGE_KEYS.LOST_PETS, id) }
function getLostPetById(id) { return getById(STORAGE_KEYS.LOST_PETS, id) }

// 拾到动物
function getFoundPets() { return getList(STORAGE_KEYS.FOUND_PETS) }
function addFoundPet(item) { return addItem(STORAGE_KEYS.FOUND_PETS, item) }
function updateFoundPet(id, updates) { return updateItem(STORAGE_KEYS.FOUND_PETS, id, updates) }
function deleteFoundPet(id) { return deleteItem(STORAGE_KEYS.FOUND_PETS, id) }
function getFoundPetById(id) { return getById(STORAGE_KEYS.FOUND_PETS, id) }

// 待领养宠物
function getAdoptPets() { return getList(STORAGE_KEYS.ADOPT_PETS) }
function addAdoptPet(item) { return addItem(STORAGE_KEYS.ADOPT_PETS, item) }
function updateAdoptPet(id, updates) { return updateItem(STORAGE_KEYS.ADOPT_PETS, id, updates) }
function deleteAdoptPet(id) { return deleteItem(STORAGE_KEYS.ADOPT_PETS, id) }
function getAdoptPetById(id) { return getById(STORAGE_KEYS.ADOPT_PETS, id) }

// 领养申请
function getAdoptApps() { return getList(STORAGE_KEYS.ADOPT_APPLICATIONS) }
function addAdoptApp(item) { return addItem(STORAGE_KEYS.ADOPT_APPLICATIONS, item) }

// 救助活动
function getActivities() { return getList(STORAGE_KEYS.ACTIVITIES) }
function addActivity(item) { return addItem(STORAGE_KEYS.ACTIVITIES, item) }
function deleteActivity(id) { return deleteItem(STORAGE_KEYS.ACTIVITIES, id) }

// 救助站用户
function getShelterUsers() { return getList(STORAGE_KEYS.SHELTER_USERS) }

// 收藏
function getFavorites() { return getList(STORAGE_KEYS.FAVORITES) }
function addFavorite(petId) {
  const list = getFavorites()
  if (!list.includes(petId)) {
    list.push(petId)
    setList(STORAGE_KEYS.FAVORITES, list)
  }
  return list
}
function removeFavorite(petId) {
  const list = getFavorites().filter(id => id !== petId)
  setList(STORAGE_KEYS.FAVORITES, list)
  return list
}
function isFavorite(petId) {
  return getFavorites().includes(petId)
}

// 留言
function getMessages() { return getList(STORAGE_KEYS.MESSAGES) }
function addMessage(petId, content, userType) {
  return addItem(STORAGE_KEYS.MESSAGES, { petId, content, userType })
}
function getMessagesByPetId(petId) {
  return getMessages().filter(m => m.petId === petId)
}

// 统计
function getStats() {
  return {
    lostCount: getLostPets().length,
    foundCount: getFoundPets().length,
    adoptCount: getAdoptPets().length,
    activityCount: getActivities().length
  }
}

module.exports = {
  // 基础操作
  getList,
  setList,
  addItem,
  updateItem,
  deleteItem,
  getById,
  generateId,
  // 走失宠物
  getLostPets,
  addLostPet,
  updateLostPet,
  deleteLostPet,
  getLostPetById,
  // 拾到动物
  getFoundPets,
  addFoundPet,
  updateFoundPet,
  deleteFoundPet,
  getFoundPetById,
  // 待领养
  getAdoptPets,
  addAdoptPet,
  updateAdoptPet,
  deleteAdoptPet,
  getAdoptPetById,
  // 领养申请
  getAdoptApps,
  addAdoptApp,
  // 活动
  getActivities,
  addActivity,
  deleteActivity,
  // 救助站
  getShelterUsers,
  // 收藏
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  // 留言
  getMessages,
  addMessage,
  getMessagesByPetId,
  // 统计
  getStats
}
