<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <p class="mb-4">
            The <a href="https://iatistandard.org/" target="_blank">International Aid Transparency Initiative</a> (IATI) is a global effort to improve the transparency of development and humanitarian resources and their results to address poverty and crises. This page allows you to explore the flow of financing between funding and implementing organizations.
          </p>
        </b-col>
        <b-col>
          <DownloadDataButton
            type="flows"
            :filter-params="filterParams"
            :selected-filter-dimension="selectedFilterDimension"
          />
        </b-col>
      </b-row>
    </b-container>
    <template v-if="isBusy">
      <div class="custom-loader text-center text-secondary mt-5">
        <b-spinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
    </template>
    <template
      v-if="!isBusy">
      <b-container>
        <h2 class="header mt-3">
          Spending Flows
        </h2>
        <b-row>
          <b-col cols="7">
            <h3>Reporting organization:</h3>
            <v-select
              :value="selectedFilter"
              class="filter-select filter-select-org mb-3"
              :options="reportingOrgs"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            />

            <div class="quick-filter-list">
              Quick filters:
              <ul class="horizontal-list d-inline">
                <li v-for="filter in quickFilters" :key="filter.id">
                  <a :id="filter.id" href="#" :title="filter.name" @click="onQuickFilter">{{ filter.name }}</a>
                </li>
              </ul>
            </div>
          </b-col>
          <b-col>
            <b-row>
              <b-col>
                Filter for COVID-19 related transactions
                <b-badge
                  v-b-tooltip.hover
                  class="info-icon p-0"
                  variant="dark"
                  pill
                  :title="tooltips['activitiesCOVID']">
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
                Only show humanitarian transactions
                <b-badge
                  v-b-tooltip.hover
                  class="info-icon p-0"
                  variant="dark"
                  pill
                  :title="tooltips['activitiesHumanitarian']">
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
          </b-col>
        </b-row>

        <hr class="my-4">

        <h2 class="my-4">
          <span v-if="activityCount > filteredData.length">Top <b>{{ filteredData.length }}</b> of </span><b>{{ numberFormatter(activityCount) }}</b> <span v-if="filteredData.length > 1 || filteredData.length===0">spending flows</span><span v-else>spending flow</span> reported by <b>{{ selectedFilterLabel }}</b>
        </h2>

        <SankeyChart :items="filteredData" :params="filterParams" />
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
      selectedFilterLabel: 'all reporting organizations',
      quickFilters: [
        { name: 'Asian Development Bank', id: 'xm-dac-46004' },
        { name: 'Inter-American Development Bank', id: 'xi-iati-iadb' },
        { name: 'UNOCHA - Central Emergency Response Fund (CERF)', id: 'xm-ocha-cerf' },
        { name: 'United Nations Development Programme', id: 'xm-dac-41114' },
        { name: 'United States Agency for International Development (USAID)', id: 'us-gov-1' },
        { name: 'World Food Programme', id: 'xm-dac-41140' }
      ],
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
      orgNameIndex: []
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
    }
  },
  mounted () {
    this.filterParams = {
      humanitarian: 'off',
      strict: 'off'
    }
    this.filterParams['#org+id+reporting'] = this.selectedFilter

    const dataPath = (this.isProd) ? 'https://ocha-dap.github.io/hdx-scraper-iati-viz/reporting_orgs.json' : 'https://mcarans.github.io/hdx-scraper-iati-viz/reporting_orgs.json'
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
      const dataPath = (this.isProd) ? 'https://ocha-dap.github.io/hdx-scraper-iati-viz/flows.json' : 'https://mcarans.github.io/hdx-scraper-iati-viz/flows.json'
      const filePath = (config.dev) ? '' : '/viz-iati-c19-explorer/'
      await axios.get(filePath + 'tooltips.csv')
        .then((response) => {
          return csvtojson().fromString(response.data).then((jsonData) => {
            this.$store.commit('setTooltips', jsonData)
          })
        })

      await axios.get(dataPath)
        .then((response) => {
          this.fullData = response.data.data
          this.updateFilteredData()
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
      let result = this.fullData
      const params = this.filterParams
      const filterDimension = this.selectedFilterDimension

      if (params[filterDimension] && params[filterDimension] !== '*') {
        result = result.filter(item => item[filterDimension].includes(params[filterDimension]))
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
        const match = acc.find(a => a[pattern] !== '' && a[pattern] === item[pattern])

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
      // let [incoming, outgoing] = data.reduce((result, element) => {
      //   result[element['#x_transaction_direction'] === 'incoming' ? 0 : 1].push(element)
      //   return result
      // }, [[], []])
      // incoming = this.formatData(incoming)
      // outgoing = this.formatData(outgoing)
      // return incoming.concat(outgoing)
      return data
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
        this.selectedFilterLabel = 'all reporting organizations'
      }
      this.updateFilteredData()
    },
    onToggle (event) {
      this.filterParams[event.target.parentElement.id] = event.target.value
      this.updateFilteredData()
    },
    onQuickFilter (event) {
      event.preventDefault()
      this.onSelect(event.target.id)
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
    getTotal (data) {
      const result = data.map(item => Number(item['#value+total']))
      return (result.length > 0) ? result.reduce((total, value) => total + value) : 0
    },
    getOrgName (id) {
      const org = this.orgNameIndex.filter(org => org['#org+id+reporting'] === id)
      return org[0]['#org+name+reporting']
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
    }
  }
}
</script>

<style lang='scss'>
  abbr[title], abbr[data-original-title] {
    text-decoration: none;
    cursor: auto;
  }
  .quick-filter-list {
    font-size: 14px;
    line-height: 18px;
    li {
      &::after {
        content: " | ";
      }
      &:last-child {
        &::after {
          content: "";
        }
      }
    }
  }
  .filter-select {
    .vs__dropdown-toggle {
      padding: 14px;
    }
    .vs__open-indicator {
      cursor: pointer;
      fill: #000;
    }
    .vs__search,
    .vs__selected {
      font-family: 'Gotham Bold', sans-serif;
    }
  }
</style>