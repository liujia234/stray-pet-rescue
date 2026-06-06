/**
 * AI 文案本地模板 - 作为 API 调用失败时的兜底方案
 * 根据宠物信息进行变量替换，生成可用的短视频文案
 */

/**
 * 根据宠物信息生成完整的视频素材（本地模板）
 * @param {Object} petInfo 宠物信息
 * @param {string} textType 'search' | 'adopt'
 */
function generateWithTemplate(petInfo, textType = 'search') {
  const petName = petInfo.name || '它'
  const petType = petInfo.petType === 'cat' ? '猫咪' : petInfo.petType === 'dog' ? '狗狗' : '毛孩子'
  const breed = petInfo.breed || '可爱'
  const color = petInfo.color || ''
  const address = petInfo.address || '附近'
  const description = petInfo.description || ''
  const gender = petInfo.gender === 'male' ? '男孩' : petInfo.gender === 'female' ? '女孩' : '小伙伴'
  const age = petInfo.age || ''

  // 随机选一套模板
  const warmScripts = textType === 'search' ? SEARCH_WARM_TEMPLATES : ADOPT_WARM_TEMPLATES
  const scienceScripts = textType === 'search' ? SEARCH_SCIENCE_TEMPLATES : ADOPT_SCIENCE_TEMPLATES
  const titles = textType === 'search' ? SEARCH_TITLES : ADOPT_TITLES

  const warmIdx = Math.floor(Math.random() * warmScripts.length)
  const scienceIdx = Math.floor(Math.random() * scienceScripts.length)
  const douyinIdx = Math.floor(Math.random() * titles.douyin.length)
  const xhsIdx = Math.floor(Math.random() * titles.xiaohongshu.length)

  const warmScript = fillTemplate(warmScripts[warmIdx], petInfo)
  const scienceScript = fillTemplate(scienceScripts[scienceIdx], petInfo)
  const douyinTitle = fillTemplate(titles.douyin[douyinIdx], petInfo)
  const xiaohongshuTitle = fillTemplate(titles.xiaohongshu[xhsIdx], petInfo)

  const hashtags = textType === 'search'
    ? ['#寻宠启事', '#扩散寻找', '#流浪动物', '#宠物回家', `#${petType}`, '#帮忙转发']
    : ['#领养代替购买', '#流浪动物', '#给它一个家', `#${petType}领养`, '#公益', '#救助站']

  const storyboard = generateStoryboard(petInfo, textType)
  const layoutTip = textType === 'search'
    ? '建议白底黑字，宠物照片居中大图，联系电话放大加粗置底'
    : '建议暖色滤镜，宠物照片圆角卡片排列，领养须知用清秀字体'

  const bgmTip = textType === 'search'
    ? '推荐《Cry for the Moon》钢琴版 或 温情吉他独奏'
    : '推荐《Happy》轻快版 或 治愈系尤克里里'

  return {
    warmScript,
    scienceScript,
    storyboard,
    douyinTitle,
    xiaohongshuTitle,
    hashtags,
    layoutTip,
    bgmTip,
    _source: 'template'
  }
}

/**
 * 模板变量替换
 */
function fillTemplate(template, petInfo) {
  const petName = petInfo.name || '它'
  const petType = petInfo.petType === 'cat' ? '猫咪' : petInfo.petType === 'dog' ? '狗狗' : '毛孩子'
  const breed = petInfo.breed || '可爱'
  const color = petInfo.color || ''
  const address = petInfo.address || '这座城市'
  const description = petInfo.description || ''
  const genderText = petInfo.gender === 'male' ? '它是个帅气的男孩子' : petInfo.gender === 'female' ? '它是个漂亮的女孩子' : ''

  return template
    .replace(/\{name\}/g, petName)
    .replace(/\{petType\}/g, petType)
    .replace(/\{breed\}/g, breed)
    .replace(/\{color\}/g, color)
    .replace(/\{address\}/g, address)
    .replace(/\{description\}/g, description)
    .replace(/\{gender\}/g, genderText)
    .replace(/\{age\}/g, petInfo.age || '')
}

/**
 * 生成分镜描述
 */
function generateStoryboard(petInfo, textType) {
  const petName = petInfo.name || '它'
  const petType = petInfo.petType === 'cat' ? '猫咪' : '狗狗'
  const breed = petInfo.breed || petType
  const address = petInfo.address || '某某地点'

  if (textType === 'search') {
    return [
      `分镜1（0-3秒）：${petName}的特写照片淡入，画面轻柔模糊转清晰，配文字"${petName}，你在哪里？"`,
      `分镜2（3-6秒）：${petName}生活照滚动展示（2-3张），中景展示全身和特征（${breed}，毛色特征）`,
      `分镜3（6-9秒）：地图定位动画，标注走失地点"${address}"，缩放效果`,
      `分镜4（9-12秒）：信息卡片弹出 - 姓名/${petName}、品种/${breed}、特征描述，联系电话居中放大`,
      `分镜5（12-15秒）：结尾画面"如果见到${petName}，请拨打上方电话"，加转发箭头动画`
    ]
  } else {
    return [
      `分镜1（0-3秒）：${petName}的正面特写，萌宠凝视镜头，配文字"你好，我想有个家"`,
      `分镜2（3-6秒）：救助站环境或${petName}互动画面中景，展示真实状态`,
      `分镜3（6-9秒）：${petName}的日常片段或生活场景，突出性格特点`,
      `分镜4（9-12秒）：领养信息卡片 - 姓名、年龄、品种、健康状况、性格标签`,
      `分镜5（12-15秒）：结尾"领养代替购买"，展示救助站联系方式或领养二维码`
    ]
  }
}

// ========== 寻宠温情文案模板（5套） ==========
const SEARCH_WARM_TEMPLATES = [
  `{name}，一只{color}的{breed}{petType}，在{address}与我们走散了。

还记得它每次听到开门声就飞奔过来的样子，记得它蜷在你身边打盹的午后阳光。{gender}，{age}的年纪，正是最依赖主人的时候。

{description}

如果你在街头巷尾看到一只{color}的{petType}，它可能就是某个家庭日思夜想的{name}。请停下脚步，给它一点食物，一个温暖的招呼，然后拨通那个等了很久的电话。

每一次转发，都是{name}回家的一份希望。谢谢你，陌生人。`,

  `「寻{petType}启事」——{name}，我们好想你。

{name}是一只{breed}，{color}，今年{age}了。{gender}最后一次出现在{address}附近。

{description}

我们找遍了每一条街道，问了每一个路人。每当看到相似的背影，心都会猛地一紧。我们知道希望渺茫，但更知道不能放弃。

如果你见过{name}，如果你知道它在哪——帮帮我们，帮帮这个一直在等{name}回家的家。`,

  `{name}走失的第N天，我们依然在寻找。

它是一只{color}的{breed}，{age}，{gender}走失地点在{address}。

{description}

每当夜深人静，我们总在想——{name}现在在哪？有没有吃饱？会不会害怕？这些没有答案的问题，填满了每一个辗转反侧的夜晚。

求扩散，求转发。哪怕只有万分之一的可能，我们也不愿放弃。`,

  `帮扩！{address}附近走失一只{breed}！

{name}，{age}，{color}，{gender}

{description}

请附近的朋友帮忙留意一下！如果您看到{name}，请不要追赶（它可能受惊跑远），直接拍照联系下方电话即可。每一条线索我们都万分感谢！🙏`,

  `{name}，如果你能听到——

家里你的小窝还在原地，你的玩具我们没舍得收，你爱吃的零食一直留着。{gender}

{description}

我们相信{name}一定还在某个地方，等我们找到它。请大家帮忙转发扩散，让更多人看到{name}的信息。你的每一次转发，都在缩短{name}回家的路。`
]

// ========== 寻宠科普文案模板（5套） ==========
const SEARCH_SCIENCE_TEMPLATES = [
  `宠物走失后，黄金寻找时间是多久？答案是：前72小时。

{name}是一只{breed}，于{address}附近走失。{description}

如果你的宠物不幸走失，请记住这几步：
1️⃣ 立刻在走失地点周边2公里范围内搜索
2️⃣ 发布线上寻宠信息（就像这条视频）
3️⃣ 联系附近宠物医院和救助站
4️⃣ 查看周边监控录像

同时，如果你在路上看到流浪动物，也可以拍照上传到这个平台。你的一次善意，可能就是某个家庭的团圆。`,

  `每一年，全国有超过百万只宠物走失，而找回率不足20%。

{name}就是其中之一。{age}的{breed}，{color}，于{address}走失。{gender}

{description}

为什么宠物走失这么难找回？
→ 没有佩戴身份标识
→ 主人没有第一时间扩散信息
→ 路人不知道如何帮助

这也是我们做这个平台的原因——让每一个走失的毛孩子，都有机会回家。如果你有{name}的线索，请一定联系我们。`,

  `走失宠物的主人有多煎熬？可能只有经历过的人才懂。

{name}走失那天，{address}的天气很好，但我们的世界下起了雨。{gender}

{description}

如果你捡到了流浪动物，可以做这几件事：
✅ 拍照上传本平台「拾宠招领」
✅ 带去宠物医院扫描芯片
✅ 在附近小区张贴招领启事
✅ 暂时安置或联系救助站

每一个走失的{petType}背后，都有一个心急如焚的家庭。你愿意帮帮{name}吗？`,

  `「我不认识{name}，但我转发了一条寻宠启事。」

为什么要帮忙转发寻宠信息？因为：
📱 每多一次转发，就多几百人看到
👀 多一个人看到，就多一分找到的可能
🏠 也许转发的人里，就有见过{name}的邻居

{name}，{breed}，{color}，{address}走失。{description}

动动手指转发，你可能就成就了一次重逢。❤️`,

  `救助流浪动物和帮助寻宠，其实是同一件事的两面。

当你捡到一只流浪{petType}，它可能就是别人苦寻不得的宝贝。{name}就是这样——看起来普通，却有人为它夜不能寐。

{name}，{breed}，{age}，{color}。{description}

希望每一个走失的毛孩子，都能被这个世界温柔以待。如果你在{address}附近，请帮忙留意。
也欢迎大家使用本平台，让寻宠和救助变得更简单。`
]

// ========== 领养温情文案模板（5套） ==========
const ADOPT_WARM_TEMPLATES = [
  `遇见{name}的那天，它正在{address}的街头流浪。{color}，{breed}，眼神里带着小心翼翼的希望。

{description}

你知道吗？在中国，每年有超过4000万只流浪动物在街头挣扎。而{name}，只是其中一个幸运的——它活着等到了救助。

但它需要的不只是一个暂时的避风港，而是一个真正的家。一个有人爱它、等它回家、叫它名字的家。

如果你刚好在找一个毛茸茸的家人，{name}可能就是你命中注定的那个。{age}的它，会用一生来爱你。`,

  `「领养代替购买」——不只是口号，而是{name}教会我们的事。

{name}是一只被救助的{breed}，{color}，{age}。{gender}

{description}

有人说流浪动物不如品种宠物好看。但{name}的眼神里，有世界上最纯粹的感激。它不会挑剔你是租房还是豪宅，不会在意你贫穷还是富有。它只知道——你给了它一个家，你就是它的全世界。

{name}正在{address}等你。你愿意成为它的全世界吗？`,

  `{name}的简历：
🐾 品种：{breed}
🎂 年龄：{age}
🎨 毛色：{color}
📍 坐标：{address}
💬 简介：{description}

{name}不需要多大的房子，不需要多贵的猫粮狗粮。它只需要——一个不会再抛弃它的家人。

如果你愿意，{name}会用蹭头、翻肚皮、在门口等你回家来回报你。这就是流浪动物的爱——深沉而热烈。`,

  `你为什么想养一只{petType}？

可能因为你孤单，可能因为你想给生活添点温度，也可能只是因为在手机上刷到了一张{name}的照片。

{name}是{breed}，{age}，{color}。{description}

而对{name}来说，被领养不是结束——是第二次生命的开始。每一只被领养的流浪动物，都会用最纯粹的方式爱你。

{name}在等你，它在{address}。去接它回家吧。`,

  `{name}最喜欢的事：被摸头、晒太阳、以及等一个永远不会再抛弃它的人。

它是{breed}，{color}，今年{age}。{description}

在救助站，{name}每次看到有人来，都会把脑袋凑近笼子。它不懂什么叫"等待领养"，它只是本能地——想靠近每一个可能爱它的人。

{name}在{address}。它等你很久了。你能带它回家吗？`
]

// ========== 领养科普文案模板（5套） ==========
const ADOPT_SCIENCE_TEMPLATES = [
  `领养一只流浪动物，你得到的远不只一只{petType}。

{name}是{breed}，{age}，住在{address}。{description}

领养前的3个必知事项：
1️⃣ 养宠是一份15-20年的承诺
2️⃣ 领养后要完成疫苗+绝育+芯片
3️⃣ 领养不是施舍，是双向奔赴的选择

如果你准备好了，{name}也准备好了。来{address}看看它吧。`,

  `「领养代替购买」为什么重要？

因为每购买一只宠物，就有一只像{name}这样的流浪动物失去被领养的机会。

{name}，{breed}，{color}，{age}。{description}

中国流浪动物数量超4000万，而每年能被领养的不足2%。它们同样健康、可爱、值得被爱——只是缺少一个展示自己的机会。

我们建立这个平台，就是为了连接每一个想养宠物的你，和每一个在等你的它。`,

  `给第一次领养的你，一份避坑指南 📋

🐾 {name}的自我介绍：{breed}，{age}，{color}
📍 坐标：{address}
📝 它的故事：{description}

领养流程其实很简单：
✅ 填写领养申请表
✅ 与救助站沟通了解情况
✅ 上门看{petType}，确认「眼缘」
✅ 准备基础用品（粮、碗、窝、砂）
✅ 接{name}回家！

领养后还有7天犹豫期哦～但相信你见到{name}的那一刻，就不会犹豫了 💕`,

  `流浪动物和宠物店买的有什么不同？

{name}来回答你：没有不同。它就是{breed}，{color}，{age}。

{description}

如果非要说不同——
流浪过的{petType}更懂得珍惜。它们知道饥饿的滋味，所以更感激每一顿饭；它们知道被抛弃的感觉，所以更依赖每一个拥抱。

{name}在{address}等你。不是买卖，是遇见。`,

  `关于领养，你可能关心的5个问题：

Q1：流浪动物健康吗？
A：{name}已完成驱虫和疫苗，健康状况良好 ✅

Q2：会不会不亲人？
A：{description}

Q3：成年{petType}还能养熟吗？
A：当然能！{name}今年{age}，正是最懂事的年纪。

Q4：领养要钱吗？
A：基本免费，但需承担疫苗/绝育成本。

Q5：{name}在哪？
A：{address}，来看看它吧！`
]

// ========== 抖音/小红书标题模板 ==========
const SEARCH_TITLES = {
  douyin: [
    `紧急寻{petType}！{name}在{address}走失，求转发扩散🙏`,
    `{name}走失第N天，主人还在等它回家💔 #寻宠`,
    `{breed}{name}寻找主人！你见过这只{petType}吗？`,
    `转发就是希望！{address}走失的{name}需要你的帮助`,
    `「找到{name}，悬赏5000」——一只{breed}的回家路`
  ],
  xiaohongshu: [
    `📢 寻宠启事 | {name}宝宝，你在哪儿？`,
    `🐱 帮扩 | {name}走失，{address}的朋友请留意`,
    `💔 我的{name}走丢了 | {breed}寻家之路`,
    `📍 {address} | 看到这只{petType}请联系我`,
    `🏠 等你回家 | {name}走失，每日更新线索`
  ]
}

const ADOPT_TITLES = {
  douyin: [
    `{name}：一只{breed}的深情告白💕 #领养`,
    `看完{name}的故事，你还会买{petType}吗？`,
    `它在{address}等你 | {breed}免费领养`,
    `{name}的眼神，让100万人破防了`,
    `领养代替购买 | {name}想有个家🏠`
  ],
  xiaohongshu: [
    `🐱 领养日记 | {name}等着和你相遇`,
    `💕 免费领养 | {breed}妹妹{name}找家`,
    `🏡 给它一个家 | {name}的故事看哭了`,
    `📍 {address} | 领养一只{breed}是什么体验？`,
    `🐾 待领养 | {name}，{age}的{breed}`
  ]
}

module.exports = {
  generateWithTemplate,
  fillTemplate
}
