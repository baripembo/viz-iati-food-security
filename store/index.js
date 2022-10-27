export const state = () => ({
  tooltips: {},
  orgNameIndex: [],
  isProd: true
})

export const mutations = {
  setTooltips (state, tooltips) {
    state.tooltips = tooltips.reduce((summary, item) => {
      summary[item.key] = item.tooltip
      return summary
    }, {})
  },
  setOrgNameIndex (state, orgNameIndex) {
    state.orgNameIndex = orgNameIndex
  },
  setProd (state, isProd) {
    state.isProd = isProd
  }
}

export const actions = {
}
