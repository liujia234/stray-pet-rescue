const storage = require('../../../utils/storage')

Page({
  data: {
    dbTab: 'lost',
    lostPets: [],
    foundPets: [],
    adoptPets: [],
    activities: [],
    currentList: []
  },

  onLoad() {
    this.loadAll()
  },

  loadAll() {
    const lostPets = storage.getLostPets()
    const foundPets = storage.getFoundPets()
    const adoptPets = storage.getAdoptPets()
    const activities = storage.getActivities()

    this.setData({ lostPets, foundPets, adoptPets, activities })
    this.showTabList(this.data.dbTab)
  },

  switchDbTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ dbTab: tab })
    this.showTabList(tab)
  },

  showTabList(tab) {
    let list = []
    if (tab === 'lost') list = this.data.lostPets
    else if (tab === 'found') list = this.data.foundPets
    else if (tab === 'adopt') list = this.data.adoptPets
    this.setData({ currentList: list })
  }
})
