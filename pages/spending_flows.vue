<template>
  <div>
    <template v-if="isBusy">
      <div class="custom-loader text-center text-secondary mt-5">
        <b-spinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
    </template>
    <template v-if="!isBusy">
      <hr class="mt-4 mb-0">

      <div class="header-sticky">
        <div class="container">
          <h2>
            <span v-if="activityCount > filteredData.length">Top <b>{{ filteredData.length }}</b> of </span><b>{{ numberFormatter(activityCount) }}</b> <span v-if="filteredData.length > 1 || filteredData.length===0">spending flows</span><span v-else>spending flow</span> reported by <b>{{ selectedFilterLabel }}</b>
          </h2>
          <a class="anchor" @click="scrollTo('filters')">Customize filters</a>
        </div>
      </div>

      <hr class="mt-0 mb-4">

      <b-container>
        <b-row ref="filters">
          <b-col cols="12" lg="7">
            <h3>
              Reporting organization
              <b-badge
                v-b-tooltip.hover
                class="info-icon p-0"
                variant="dark"
                pill
                :title="tooltips['reportingOrg']">
                ?
              </b-badge>
            </h3>
            <v-select
              :value="selectedFilter"
              class="filter-select filter-select-org mb-3"
              :options="reportingOrgs"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  v-bind="attributes"
                  placeholder="Type organization name here"
                  v-on="events"
                >
              </template>
            </v-select>
          </b-col>
          <b-col>
            <b-row>
              <b-col>
                Filter for COVID-19 related flows
                <b-badge
                  v-b-tooltip.hover
                  class="info-icon p-0"
                  variant="dark"
                  pill
                  :title="tooltips['flowsCOVID']">
                  ?
                </b-badge>:
              </b-col>
              <b-col>
                <b-button-group id="strict">
                  <b-button
                    v-for="(btn, id) in strictToggleOptions"
                    :key="id"
                    :value="btn.value"
                    :class="{ 'active': btn.value===filterParams.strict }"
                    @click="onToggle($event)"
                  >
                    {{ btn.label }}
                  </b-button>
                </b-button-group>
              </b-col>
            </b-row>
            <hr class="my-3">
            <b-row>
              <b-col>
                Only show humanitarian flows
                <b-badge
                  v-b-tooltip.hover
                  class="info-icon p-0"
                  variant="dark"
                  pill
                  :title="tooltips['flowsHumanitarian']">
                  ?
                </b-badge>:
              </b-col>
              <b-col>
                <b-button-group id="humanitarian">
                  <b-button
                    v-for="(btn, id) in humanitarianToggleOptions"
                    :key="id"
                    :value="btn.value"
                    :class="{ 'active': btn.value===filterParams.humanitarian }"
                    @click="onToggle($event)"
                  >
                    {{ btn.label }}
                  </b-button>
                </b-button-group>
              </b-col>
            </b-row>
            <hr class="my-3">
            <b-row>
              <b-col cols="12" md="8" class="my-3">
                <DownloadDataButton
                  type="flows"
                  :filter-params="filterParams"
                  :selected-filter-dimension="selectedFilterDimension"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <h2 class="header mt-3">
          Spending Flows&nbsp;
          <b-badge
            v-b-tooltip.hover
            class="info-icon p-0"
            variant="dark"
            pill
            :title="tooltips['sankeyHeader']">
            ?
          </b-badge>
        </h2>

        <SankeyChart :items="filteredData" :params="filterParams" />

        <div class="small text-muted mt-5 ml-4">
          {{ lastUpdatedDate }} | IATI
        </div>
        <hr>
      </b-container>
    </template>
  </div>
</template>
<style>
</style>
<script>
import axios from 'axios'
import csvtojson from 'csvtojson'
import numeral from 'numeral'
import config from '../nuxt.config'
import SankeyChart from '~/components/FinancialSankey.vue'
import DownloadDataButton from '~/components/DownloadDataButton'
export default {
  components: {
    SankeyChart,
    DownloadDataButton
  },
  data () {
    return {
      title: config.head.title,
      selectedFilterDimension: '#org+id+reporting',
      selectedFilter: '*',
      selectedFilterLabel: '',
      strictToggleOptions: [
        { label: 'Loose', value: 'off' },
        { label: 'Strict', value: 'on' }
      ],
      humanitarianToggleOptions: [
        { label: 'No', value: 'off' },
        { label: 'Yes', value: 'on' }
      ],
      activityCount: 0,
      fullData: [],
      filteredData: [],
      filterParams: {},
      orgNameIndex: [],
      lastUpdatedDate: '',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  },
  head () {
    return {
      title: config.head.title + ': Spending Flows'
    }
  },
  computed: {
    isBusy () {
      return this.fullData.length === 0
    },
    tooltips () {
      return this.$store.state.tooltips
    },
    isProd () {
      return this.$store.state.isProd
    },
    reportingOrgs () {
      let orgList = [...new Set(this.fullData.map(item => item['#org+id+reporting']))]
      orgList = orgList.map((item) => {
        const org = {}
        org.value = item
        org.text = this.getOrgName(item)
        return org
      })
      return this.populateSelect(orgList, 'All reporting organizations')
    },
    orgCount () {
      const orgs = [...new Set(this.fullData.map(item => item['#org+id+reporting']))]
      return orgs.length
    }
  },
  updated () {
    this.createStickyHeader()
  },
  mounted () {
    this.filterParams = {
      humanitarian: 'off',
      strict: 'off'
    }
    this.filterParams['#org+id+reporting'] = this.selectedFilter

    const dataPath = 'https://raw.githubusercontent.com/OCHA-DAP/hdx-scraper-iati-viz/gh-pages/foodsecurity/reporting_orgs.json'
    axios.get(dataPath)
      .then((response) => {
        this.orgNameIndex = response.data.data
        this.$store.commit('setorgNameIndex', response.data.data)

        this.$nextTick(() => {
          if ('org' in this.$route.query) {
            this.filterParams['#org+id+reporting'] = this.selectedFilter = this.$route.query.org
            this.selectedFilterLabel = this.getOrgName(this.$route.query.org)
          }
          if ('humanitarian' in this.$route.query) {
            this.filterParams.humanitarian = this.$route.query.humanitarian
          }
          if ('strict' in this.$route.query) {
            this.filterParams.strict = this.$route.query.strict
          }

          this.loadData()
        })
      })
  },
  methods: {
    async loadData () {
      const filePath = (config.dev) ? '' : '/viz-iati-food-security/'
      const dataPath = 'https://raw.githubusercontent.com/OCHA-DAP/hdx-scraper-iati-viz/gh-pages/foodsecurity/flows.json'
      await axios.get(filePath + 'tooltips.csv')
        .then((response) => {
          return csvtojson().fromString(response.data).then((jsonData) => {
            this.$store.commit('setTooltips', jsonData)
          })
        })

      await axios.get(dataPath)
        .then((response) => {
          // process the metadata
          const metadata = response.data.metadata
          const dateRun = new Date(metadata['#date+run'])
          const date = this.months[dateRun.getMonth()] + ' ' + dateRun.getDate() + ', ' + dateRun.getFullYear()
          this.lastUpdatedDate = date

          this.fullData = response.data.data
          this.updateFilteredData()

          // set intitial filter label
          if (Object.keys(this.$route.query).length < 1) {
            const count = this.orgCount
            this.selectedFilterLabel = count + ' reporting organizations'
          }
        })
    },
    urlQuery () {
      const _query = {}
      if (this.filterParams['#org+id+reporting'] !== '*') {
        _query.org = this.filterParams['#org+id+reporting']
      }
      if (this.filterParams.humanitarian !== 'off') {
        _query.humanitarian = this.filterParams.humanitarian
      }
      if (this.filterParams.strict !== 'off') {
        _query.strict = this.filterParams.strict
      }
      return _query
    },
    updateRouter () {
      this.$router.push({ name: 'spending_flows', query: this.urlQuery() })
    },
    updateFilteredData () {
      this.filteredData = this.filterData()
      this.updateRouter()
    },
    filterData () {
      let result = this.fullData.map(i => ({ ...i }))
      const params = this.filterParams
      const filterDimension = this.selectedFilterDimension

      if (params[filterDimension] && params[filterDimension] !== '*') {
        result = result.filter(item => item[filterDimension] === params[filterDimension])
      }
      if (params['humanitarian'] === 'on') {
        result = result.filter(item => item['#indicator+bool+humanitarian'] === 1)
      }
      if (params['strict'] === 'on') {
        result = result.filter(item => item['#indicator+bool+strict'] === 1)
      }
      if (params['humanitarian'] === 'off' || params['strict'] === 'off') {
        result = this.aggregateFlows(result)
      }

      // get total count before partioning data into incoming/outgoing
      this.activityCount = result.length
      result = this.partitionData(result)
      return result
    },
    aggregateFlows (data) {
      const aggregated = data.reduce((acc, item) => {
        const pattern = (item['#x_transaction_direction'] === 'incoming') ? '#org+name+provider' : '#org+name+receiver'
        const match = acc.find(a => a[pattern] !== '' && a['#org+id+reporting'] === item['#org+id+reporting'] && a[pattern] === item[pattern])

        if (!match) {
          acc.push(item)
        } else {
          match['#value+total'] += item['#value+total']
        }
        return acc
      }, [])
      return aggregated
    },
    partitionData (data) {
      let [incoming, outgoing] = data.reduce((result, element) => {
        result[element['#x_transaction_direction'] === 'incoming' ? 0 : 1].push(element)
        return result
      }, [[], []])
      incoming = this.formatData(incoming)
      outgoing = this.formatData(outgoing)
      return incoming.concat(outgoing)
    },
    formatData (array) {
      return array.sort((a, b) =>
        a['#value+total'] > b['#value+total'] ? -1 : 1
      ).slice(0, 10)
    },
    onSelect (value) {
      this.selectedFilter = value
      this.filterParams[this.selectedFilterDimension] = value
      if (value !== '*') {
        this.selectedFilterLabel = this.getOrgName(value)
      } else {
        this.selectedFilterLabel = this.orgCount + ' reporting organizations'
      }
      this.updateFilteredData()
      // this.$mixpanelTrackAction('change content', 'Spending Flows Breakdown select filter', value)
    },
    onToggle (event) {
      this.filterParams[event.target.parentElement.id] = event.target.value
      this.updateFilteredData()
      // this.$mixpanelTrackAction('change content', 'Spending Flows Breakdown toggle filter', event.target.parentElement.id + ' ' + event.target.value)
    },
    populateSelect (data, defaultValue) {
      const selectList = data.reduce((itemList, item) => {
        itemList.push({ value: item.value, text: item.text })
        return itemList
      }, []).sort((a, b) =>
        a.text < b.text ? -1 : 1
      )
      selectList.unshift({ value: '*', text: defaultValue })
      return selectList
    },
    getOrgName (id) {
      const org = this.orgNameIndex.filter(org => org['#org+id+reporting'] === id)
      return (org[0] !== undefined) ? org[0]['#org+name+reporting'] : ''
    },
    getOrgID (name) {
      const org = this.orgNameIndex.filter(org => org['#org+name+reporting'] === name)
      return org[0]['#org+id+reporting']
    },
    numberFormatter (value) {
      if (value === 0) { return '0' }
      return value
        ? numeral(value).format('0,0')
        : ''
    },
    createStickyHeader () {
      const el = document.getElementsByClassName('header-sticky')[0]
      if (!this.loaded && el !== undefined) {
        this.loaded = true
        const observer = new IntersectionObserver(
          ([e]) => e.target.classList.toggle('is-stuck', e.intersectionRatio < 1),
          { threshold: [1] }
        )
        observer.observe(el)
      }
    },
    scrollTo (refName) {
      const element = this.$refs[refName]
      const top = element.offsetTop - 100
      window.scrollTo(0, top)
    }
  }
}
</script>

<style lang='scss'>
  abbr[title], abbr[data-original-title] {
    text-decoration: none;
    cursor: auto;
  }

  @media only screen and (max-width: 992px) {
    .iati-viz {
      h2.header {
        .badge.info-icon.badge-pill {
          width: 14px;
        }
      }
    }
  }
</style>
