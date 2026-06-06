/**
 * 领养智能匹配引擎
 * 根据领养人条件和宠物属性进行标签权重匹配
 */

/**
 * 计算匹配分数
 * @param {Object} application 领养申请表
 * @param {Object} pet 待领养宠物
 * @returns {number} 0-100 的匹配分数
 */
function calculateMatchScore(application, pet) {
  let score = 0
  const details = []

  // 1. 城市匹配（权重 15%）
  const cityScore = matchCity(application.city, pet.address)
  score += cityScore * 0.15
  if (cityScore >= 100) details.push('同城')

  // 2. 宠物类型偏好（权重 25%）
  const typeScore = matchPetType(application.preferType, pet.petType)
  score += typeScore * 0.25
  if (typeScore >= 100) details.push('品种偏好匹配')

  // 3. 体型/品种偏好（权重 20%）
  const breedScore = matchBreed(application.preferBreed, pet.breed)
  score += breedScore * 0.20
  if (breedScore >= 80) details.push('品种接近')

  // 4. 住房空间适配（权重 20%）
  const spaceScore = matchSpace(application.housingType, application.space, pet.size)
  score += spaceScore * 0.20
  if (spaceScore >= 80) details.push('空间适配')

  // 5. 养宠经验适配（权重 10%）
  const expScore = matchExperience(application.hasExperience, pet.character)
  score += expScore * 0.10
  if (expScore >= 80) details.push('经验适配')

  // 6. 性格/需求匹配（权重 10%）
  const charScore = matchCharacter(application.lifestyle || '', pet.character)
  score += charScore * 0.10

  return {
    score: Math.round(score),
    details,
    petId: pet.id
  }
}

/**
 * 城市匹配
 */
function matchCity(userCity, petAddress) {
  if (!userCity || !petAddress) return 50
  // 提取城市关键词
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '重庆', '西安', '苏州', '天津']
  const userMain = cities.find(c => userCity.includes(c)) || userCity.substring(0, 2)
  const petMain = cities.find(c => petAddress.includes(c)) || petAddress.substring(0, 2)

  if (userMain === petMain) return 100
  // 同一省份简化判断
  return 30
}

/**
 * 宠物类型匹配
 */
function matchPetType(prefer, petType) {
  if (!prefer || prefer === 'all') return 80
  if (prefer === petType) return 100
  return 20
}

/**
 * 品种匹配（模糊匹配）
 */
function matchBreed(preferBreed, petBreed) {
  if (!preferBreed || preferBreed === 'all' || preferBreed === '不限') return 60
  if (!petBreed) return 40

  const prefer = preferBreed.toLowerCase()
  const breed = petBreed.toLowerCase()

  // 精确匹配
  if (breed.includes(prefer) || prefer.includes(breed)) return 100

  // 模糊匹配关键词
  const keywords = preferBreed.split(/[,，、\s]+/).filter(Boolean)
  for (const kw of keywords) {
    if (breed.includes(kw.toLowerCase())) return 85
  }

  return 30
}

/**
 * 空间适配
 */
function matchSpace(housingType, spaceDesc, petSize) {
  const sizeScore = {
    'small': 90,   // 小型宠物适合各种环境
    'medium': 70,  // 中型需要一定空间
    'large': 40    // 大型需要大空间
  }

  const baseScore = sizeScore[petSize] || 60

  // 租房降低适配度（对大型宠物影响更大）
  if (housingType === 'rent') {
    if (petSize === 'large') return baseScore * 0.4
    if (petSize === 'medium') return baseScore * 0.7
  }

  // 自有住房 + 大空间 + 大型宠 = 绝配
  if (housingType === 'own' && petSize === 'large' && spaceDesc && spaceDesc.includes('大')) {
    return 100
  }

  return baseScore
}

/**
 * 经验适配
 */
function matchExperience(hasExperience, character) {
  if (!character) return 60

  // 需要经验丰富的宠物特征关键词
  const needsExperience = ['精力旺', '需要耐心', '训练', '大型', '活跃', '胆小', '怕生', '创伤']

  const needsExp = needsExperience.some(kw => character.includes(kw))

  if (hasExperience === 'yes' && needsExp) return 100
  if (hasExperience === 'yes') return 85
  if (hasExperience === 'no' && !needsExp) return 90
  if (hasExperience === 'no' && needsExp) return 40

  return 60
}

/**
 * 性格/生活方式匹配
 */
function matchCharacter(lifestyle, character) {
  if (!lifestyle || !character) return 60

  let score = 60

  // 生活方式关键词匹配
  if (lifestyle.includes('安静') && (character.includes('安静') || character.includes('温柔') || character.includes('佛系'))) {
    score += 20
  }
  if (lifestyle.includes('活跃') && (character.includes('活泼') || character.includes('精力') || character.includes('爱玩'))) {
    score += 20
  }
  if (lifestyle.includes('陪伴') && (character.includes('亲人') || character.includes('粘人') || character.includes('陪伴'))) {
    score += 20
  }
  if (lifestyle.includes('新手') && (character.includes('新手') || character.includes('容易') || character.includes('简单'))) {
    score += 20
  }

  return Math.min(score, 100)
}

/**
 * 批量匹配排序
 * @param {Object} application 领养申请表
 * @param {Array} pets 待领养宠物列表
 * @param {number} topN 返回前 N 条
 * @returns {Array} 按分数降序排列的匹配结果
 */
function matchPets(application, pets, topN = 10) {
  const results = pets
    .filter(p => p.status === 'available')
    .map(pet => calculateMatchScore(application, pet))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  return results
}

module.exports = {
  calculateMatchScore,
  matchPets
}
