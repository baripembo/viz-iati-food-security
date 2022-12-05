<template>
  <div>
    <template v-if="isBusy">
      <div class="custom-loader text-center text-secondary my-5">
        <b-spinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
    </template>
    <template v-if="!isBusy">
      <hr class="mt-4 mb-0">

      <div class="header-sticky">
        <div class="container">
          <h2>
            <b>{{ numberFormatter(activityCount) }}</b> <span v-if="activityCount > 1 || activityCount===0">transactions</span><span v-else>transaction</span> by <b>{{ selectedFilterLabel }}</b>
          </h2>
          <a class="anchor" @click="scrollTo('filters')">Customize filters</a>
        </div>
      </div>

      <hr class="mt-0 mb-4">

      <b-container>
        <b-row ref="filters">
          <b-col cols="12" lg="7">
            <b-form-group label="Filter:">
              <b-form-radio v-model="initFilterOption" name="filterOptionGroup" :value="filterOptions[0].value" @change="onFilterOptionSelect">
                {{ filterOptions[0].text }}
              </b-form-radio>
              <b-badge
                v-b-tooltip.hover
                class="info-icon p-0 ml-3 ml-md-0"
                variant="dark"
                pill
                :title="tooltips['filterPublishingOrg']">
                ?
              </b-badge><br>
              <b-form-radio v-model="initFilterOption" name="filterOptionGroup" :value="filterOptions[1].value" @change="onFilterOptionSelect">
                {{ filterOptions[1].text }}
              </b-form-radio>
              <b-badge
                v-b-tooltip.hover
                class="info-icon p-0 ml-3 ml-md-0"
                variant="dark"
                pill
                :title="tooltips['filterCountry']">
                ?
              </b-badge><br>
              <b-form-radio v-model="initFilterOption" name="filterOptionGroup" :value="filterOptions[2].value" @change="onFilterOptionSelect">
                {{ filterOptions[2].text }}
              </b-form-radio>
              <b-badge
                v-b-tooltip.hover
                class="info-icon p-0 ml-3 ml-md-0"
                variant="dark"
                pill
                :title="tooltips['filterSector']">
                ?
              </b-badge>
            </b-form-group>

            <v-select
              v-if="selectedFilterDimension==='#org+id'"
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

            <v-select
              v-if="selectedFilterDimension==='#country'"
              :value="selectedFilter"
              class="filter-select filter-select-country mb-3"
              :options="countries"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  v-bind="attributes"
                  placeholder="Type country or region name here"
                  v-on="events"
                >
              </template>
            </v-select>

            <v-select
              v-if="selectedFilterDimension==='#sector'"
              :value="selectedFilter"
              class="filter-select filter-select-sector mb-3"
              :options="sectors"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  v-bind="attributes"
                  placeholder="Type sector name here"
                  v-on="events"
                >
              </template>
            </v-select>
          </b-col>
          <b-col>
            <b-row>
              <b-col>
                Filter to activities that use "Food Security" text
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
            <hr class="my-3">
            <b-row>
              <b-col cols="12" md="8" class="mt-3">
                <DownloadDataButton
                  type="transactions"
                  :filter-params="filterParams"
                  :selected-filter-dimension="selectedFilterDimension"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <hr class="mt-4 mb-0">
      </b-container>

      <b-container>
        <h2 class="header">
          Outgoing Commitments and Spending Ranking&nbsp;
          <b-badge
            v-b-tooltip.hover
            class="info-icon p-0"
            variant="dark"
            pill
            :title="tooltips['rankingHeader']">
            ?
          </b-badge>
        </h2>

        <b-row>
          <b-col cols="12" lg="6">
            <b-form-select
              v-model="selectedRankingFilter"
              class="form-select px-2 ml-3 mb-3"
              :options="rankingFilter[getFilterID(selectedFilterDimension)]"
              @input="onSelectRanking"
            />
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <div class="key-figure-container">
              <DoughnutChart
                :doughnut-chart-data="commitmentsDonut"
                :colors="commitmentColors"
              />
              <div class="key-figure-breakdown w-lg-100 mx-lg-4">
                <h3>
                  Total Outgoing Commitments (USD)
                  <b-badge
                    v-b-tooltip.hover
                    class="info-icon p-0"
                    variant="dark"
                    pill
                    :title="tooltips['totalCommitments']">
                    ?
                  </b-badge>
                </h3>
                <div class="key-figure-num">
                  {{ currencyFormatter(totalCommitments) }}
                </div>

                <RankedList
                  :items="commitmentsTable"
                  :colors="commitmentColors"
                  :last-updated-date="lastUpdatedDate"
                />
              </div>
            </div>
          </b-col>
          <b-col>
            <div class="key-figure-container">
              <DoughnutChart
                :doughnut-chart-data="spendingDonut"
                :colors="spendingColors"
              />
              <div class="key-figure-breakdown w-lg-100 ml-lg-4 mr-lg-5">
                <h3>
                  Total Spending (USD)
                  <b-badge
                    v-b-tooltip.hover
                    class="info-icon p-0"
                    variant="dark"
                    pill
                    :title="tooltips['totalSpending']">
                    ?
                  </b-badge>
                </h3>
                <div class="key-figure-num">
                  {{ currencyFormatter(totalSpending) }}
                </div>

                <RankedList
                  :items="spendingTable"
                  :colors="spendingColors"
                  :last-updated-date="lastUpdatedDate"
                />
              </div>
            </div>
          </b-col>
        </b-row>

        <h2 class="header">
          Outgoing Commitments and Spending Over Time&nbsp;
          <b-badge
            v-b-tooltip.hover
            class="info-icon p-0"
            variant="dark"
            pill
            :title="tooltips['timelineHeader']">
            ?
          </b-badge>
        </h2>

        <b-row>
          <b-col cols="12" lg="6">
            <b-form-select
              v-model="timeseriesSelect"
              class="form-select pl-2 pr-4 ml-3 mt-0 mb-4"
              :options="timeseriesSelectOptions"
              @input="onSelectTimeline"
            />
          </b-col>
          <b-col />
        </b-row>

        <TimeseriesChart
          :timeseries-chart-data="timeseriesData"
          :chart-type="timeseriesSelect"
        />

        <div class="small text-muted mt-4 ml-4">
          {{ lastUpdatedDate }} | IATI
        </div>
        <hr>
      </b-container>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import csvtojson from 'csvtojson'
import numeral from 'numeral'
import config from '../nuxt.config'
import DoughnutChart from '~/components/DoughnutChart'
import TimeseriesChart from '~/components/TimeseriesChart'
import DownloadDataButton from '~/components/DownloadDataButton'
import RankedList from '~/components/RankedList'

export default {
  components: {
    DoughnutChart,
    TimeseriesChart,
    DownloadDataButton,
    RankedList
  },
  data () {
    return {
      initFilterOption: '#org+id',
      selectedFilterDimension: '#org+id',
      selectedFilter: '*',
      selectedFilterLabel: '',
      filterOptions: [
        { text: 'By Publishing Organization', value: '#org+id', label: 'publishing organizations' },
        { text: 'By Recipient Country or Region', value: '#country', label: 'recipient countries and regions' },
        { text: 'By Sector', value: '#sector', label: 'sectors' }
      ],
      selectedRankingFilter: '#country',
      rankingFilter: [
        [
          { text: 'By Recipient Country or Region', value: '#country' },
          { text: 'By Sector', value: '#sector' }
        ],
        [
          { text: 'By Publishing Org', value: '#org+id' },
          { text: 'By Sector', value: '#sector' }
        ],
        [
          { text: 'By Recipient Country or Region', value: '#country' },
          { text: 'By Publishing Org', value: '#org+id' }
        ]
      ],
      timeseriesSelect: 'Cumulative and Monthly Commitments/Spending',
      timeseriesSelectOptions: [
        'Cumulative and Monthly Commitments/Spending',
        'Cumulative Commitments/Spending',
        'Monthly Commitments/Spending'
      ],
      strictToggleOptions: [
        { label: 'Loose', value: 'off' },
        { label: 'Strict', value: 'on' }
      ],
      humanitarianToggleOptions: [
        { label: 'No', value: 'off' },
        { label: 'Yes', value: 'on' }
      ],
      commitmentColors: ['#007CE1', '#3393E2', '#65ABE3', '#98C3E4', '#CADAE5', '#EEE'],
      spendingColors: ['#C6382E', '#DC4E44', '#F2645A', '#F0948F', '#EDC4C3', '#EEE'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      fullData: [],
      filteredData: [],
      filterParams: {},
      orgNameIndex: [],
      lastUpdatedDate: '',
      skippedTransactions: 0,
      loaded: false
    }
  },
  head () {
    return {
      title: config.head.title + ': Commitments and Spending'
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
      let orgList = [...new Set(this.fullData.map(item => item['#org+id']))]
      orgList = orgList.map((item) => {
        const org = {}
        org.value = item
        org.text = this.getOrgName(item)
        return org
      })
      return this.populateSelect(orgList, 'All publishing organizations')
    },
    countries () {
      let countryList = [...new Set(this.fullData.map(item => item['#country']))]
      countryList = countryList.map((item) => {
        const country = {}
        country.value = item
        country.text = item
        return country
      })
      return this.populateSelect(countryList, 'All recipient countries and regions')
    },
    sectors () {
      let sectorList = [...new Set(this.fullData.map(item => item['#sector']))]
      sectorList = sectorList.map((item) => {
        const sector = {}
        sector.value = item
        sector.text = item
        return sector
      })
      return this.populateSelect(sectorList, 'All sectors')
    },
    commitments () {
      return this.filteredData.filter(item => item['#x_transaction_type'] === 'commitments')
    },
    spending () {
      return this.filteredData.filter(item => item['#x_transaction_type'] === 'spending')
    },
    commitmentsRanked () {
      return this.getRankedList(this.commitments)
    },
    spendingRanked () {
      return this.getRankedList(this.spending)
    },
    orgCount () {
      const orgs = [...new Set(this.fullData.map(item => item['#org+id']))]
      return orgs.length
    },
    countryCount () {
      const countries = [...new Set(this.fullData.map(item => item['#country']))]
      return countries.length
    },
    sectorCount () {
      const sector = [...new Set(this.fullData.map(item => item['#sector']))]
      return sector.length
    },
    activityCount () {
      const activities = [...new Set(this.filteredData.map(item => item['#activity+code']))]
      return activities.length
    },
    totalCommitments () {
      return this.getTotal(this.commitments)
    },
    totalSpending () {
      return this.getTotal(this.spending)
    },
    tagPattern () {
      return (this.selectedFilterDimension === '#org+id' && this.selectedFilter !== '*') ? '#value+total' : '#value+net'
    },
    commitmentsTable () {
      return this.populateList(this.commitmentsRanked)
    },
    spendingTable () {
      return this.populateList(this.spendingRanked)
    },
    commitmentsDonut () {
      return this.populateDonut(this.totalCommitments, this.commitmentsRanked)
    },
    spendingDonut () {
      return this.populateDonut(this.totalSpending, this.spendingRanked)
    },
    timeseriesData () {
      const ref = this
      const dates = [...new Set(this.filteredData.map(item => item['#date+month']))]

      const monthlyCommitments = Object.values(this.commitments.reduce((acc, item) => {
        let val = Number(item[ref.tagPattern])
        val = (val < 0) ? 0 : val
        acc[item['#date+month']] = acc[item['#date+month']] + val || val
        return acc
      }, []))

      const monthlySpending = Object.values(this.spending.reduce((acc, item) => {
        let val = Number(item[ref.tagPattern])
        val = (val < 0) ? 0 : val
        acc[item['#date+month']] = acc[item['#date+month']] + val || val
        return acc
      }, []))

      return {
        dates,
        monthly: {
          commitments: monthlyCommitments,
          spending: monthlySpending
        },
        cumulative: {
          commitments: this.getCumulativeSeries(monthlyCommitments),
          spending: this.getCumulativeSeries(monthlySpending)
        }
      }
    }
  },
  mounted () {
    this.toggleBodyClass('addClass', 'index')

    this.filterParams = {
      humanitarian: 'off',
      strict: 'off'
    }
    this.filterParams['#org+id'] = '*'
    this.filterParams['#country'] = '*'
    this.filterParams['#sector'] = '*'

    const dataPath = 'https://raw.githubusercontent.com/OCHA-DAP/hdx-scraper-iati-viz/gh-pages/foodsecurity/reporting_orgs.json'
    axios.get(dataPath)
      .then((response) => {
        this.orgNameIndex = response.data.data
        this.$store.commit('setOrgNameIndex', response.data.data)

        // this.selectedFilterLabel = this.orgNameIndex.length + ' publishing organizations'

        this.$nextTick(() => {
          if ('org' in this.$route.query) {
            this.filterParams['#org+id'] = this.$route.query.org
            this.querySetup('#org+id')
          }
          if ('country' in this.$route.query) {
            this.filterParams['#country'] = this.$route.query.country
            this.querySetup('#country')
          }
          if ('sector' in this.$route.query) {
            this.filterParams['#sector'] = this.$route.query.sector
            this.querySetup('#sector')
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
  updated () {
    this.createStickyHeader()
  },
  destroyed () {
    this.toggleBodyClass('removeClass', 'index')
  },
  methods: {
    async loadData () {
      const filePath = (config.dev) ? '' : '/viz-iati-food-security/'
      const dataPath = 'https://raw.githubusercontent.com/OCHA-DAP/hdx-scraper-iati-viz/gh-pages/foodsecurity/transactions.json'
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

          // process the transaction data
          this.fullData = response.data.data
          this.filteredData = this.filterData()

          // set intitial filter label
          if (Object.keys(this.$route.query).length < 1) {
            const count = this.orgCount
            this.selectedFilterLabel = count + ' publishing organizations'
          }
        })
    },
    urlQuery () {
      const _query = {}
      if (this.filterParams['#org+id'] !== '*') {
        _query.org = this.filterParams['#org+id']
      }
      if (this.filterParams['#country'] !== '*') {
        _query.country = this.filterParams['#country']
      }
      if (this.filterParams['#sector'] !== '*') {
        _query.sector = this.filterParams['#sector']
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
      this.$router.push({ name: 'index', query: this.urlQuery() })
    },
    querySetup (dimension) {
      this.initFilterOption = dimension
      this.selectedFilterDimension = dimension
      this.selectedFilter = this.filterParams[dimension]
      this.selectedFilterLabel = (dimension === '#org+id') ? this.getOrgName(this.selectedFilter) : this.selectedFilter
      const filterArray = this.rankingFilter[this.getFilterID(dimension)]
      this.selectedRankingFilter = filterArray[0].value
    },
    numberFormatter (value) {
      if (value === 0) { return '0' }
      return value
        ? numeral(value).format('0,0')
        : ''
    },
    currencyFormatter (value) {
      return numeral(value).format('$0.0a')
    },
    onFilterOptionSelect (selected) {
      this.selectedFilterDimension = selected
      const filterArray = this.rankingFilter[this.getFilterID(selected)]
      this.selectedRankingFilter = filterArray[0].value

      this.resetParams()
      this.setDefaultFilterLabel(selected)
      this.updateFilteredData()
      // this.$mixpanelTrackAction('change content', 'Commitments and Spending Breakdown radio filter', selected)
    },
    onSelect (value) {
      this.selectedFilter = value
      this.filterParams[this.selectedFilterDimension] = value
      if (value !== '*') {
        this.selectedFilterLabel = (this.selectedFilterDimension === '#org+id') ? this.getOrgName(value) : value
      } else {
        this.setDefaultFilterLabel(this.selectedFilterDimension)
      }
      this.updateFilteredData()
      // this.$mixpanelTrackAction('change content', 'Commitments and Spending Breakdown select filter', value)
    },
    onToggle (event) {
      this.filterParams[event.target.parentElement.id] = event.target.value
      this.updateFilteredData()
      // this.$mixpanelTrackAction('change content', 'Commitments and Spending Breakdown toggle filter', event.target.parentElement.id + ' ' + event.target.value)
    },
    onSelectRanking (value) {
      // this.$mixpanelTrackAction('change content', 'Commitments and Spending Ranking select filter', value)
    },
    onSelectTimeline (value) {
      // this.$mixpanelTrackAction('change content', 'Commitments and Spending Timeline select filter', value)
    },
    setDefaultFilterLabel (dimension) {
      const filterOption = this.filterOptions.filter(option => option.value === dimension)
      // this.selectedFilterLabel = filterOption[0].label.toLowerCase()

      let count = ''
      if (dimension === '#org+id') {
        count = this.orgCount
      } else if (dimension === '#country') {
        count = this.countryCount
      } else {
        count = this.sectorCount
      }
      this.selectedFilterLabel = count + ' ' + filterOption[0].label.toLowerCase()
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
        result = result.filter(item => item[filterDimension] === params[filterDimension])
      }
      if (params['humanitarian'] === 'on') {
        result = result.filter(item => item['#indicator+bool+humanitarian'] === 1)
      }
      if (params['strict'] === 'on') {
        result = result.filter(item => item['#indicator+bool+strict'] === 1)
      }
      return result
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
    populateList (data) {
      return data.reduce((list, item) => {
        list.push({ item: item[0], value: '$' + this.numberFormatter(item[1]) })
        return list
      }, []).sort((a, b) =>
        b.value - a.value
      )
    },
    populateDonut (total, rankedData) {
      const ranked = (rankedData.length > 5) ? rankedData.slice(0, 5) : rankedData
      // calculate sum of top 5 and append 'Other' value if sum < 100
      const sum = ranked.reduce((total, amount) => {
        return total + amount[1]
      }, 0)
      if (sum < total) { ranked.push(['Other or unspecified', total - sum]) }
      const ratios = ranked.reduce((list, item) => {
        const ratio = Number(((item[1] / total) * 100).toFixed(1))
        list.push(ratio)
        return list
      }, [])
      const labels = ranked.map(row => row[0])
      return { values: ratios, labels }
    },
    getOrgName (id) {
      const org = this.orgNameIndex.filter(org => org['#org+id+reporting'] === id)
      return org[0]['#org+name+reporting']
    },
    getOrgID (name) {
      const org = this.orgNameIndex.filter(org => org['#org+name+reporting'] === name)
      return org[0]['#org+id+reporting']
    },
    getCumulativeSeries (data) {
      let total = 0
      return data.reduce((cumulativeValues, value) => {
        total += value
        cumulativeValues.push(total)
        return cumulativeValues
      }, [])
    },
    getTotal (data) {
      const result = data.map(item => Number(item[this.tagPattern]))
      return (result.length > 0) ? result.reduce((total, value) => total + value) : 0
    },
    getRankedList (data) {
      const dimension = this.selectedRankingFilter
      const unspecifiedObject = {}
      const ranked = Object.entries(data.reduce((list, item, index) => {
        const value = Number(item[this.tagPattern])
        const key = (dimension === '#org+id') ? this.getOrgName(item[dimension]) : item[dimension]
        if (item[dimension].includes('Unspecified')) {
          unspecifiedObject[key] = unspecifiedObject[key] + value || value
        } else {
          list[key] = list[key] + value || value
        }
        return list
      }, {})).sort((a, b) =>
        b[1] - a[1]
      )

      // push unspecified item to bottom of list
      const unspecified = Object.entries(unspecifiedObject)[0]
      if (unspecified !== undefined) {
        // replace text for recipient countries
        if (unspecified[0] === '(Unspecified country)') { unspecified[0] = 'No country/region specified' }
        ranked.push(unspecified)
      }
      return ranked
    },
    getFilterID () {
      if (this.selectedFilterDimension === '#sector') { return 2 } else if (this.selectedFilterDimension === '#country') { return 1 } else { return 0 }
    },
    resetParams () {
      this.filterParams['#org+id'] = '*'
      this.filterParams['#country'] = '*'
      this.filterParams['#sector'] = '*'
      this.selectedFilter = '*'
    },
    toggleBodyClass (addRemoveClass, className) {
      const el = document.body

      if (addRemoveClass === 'addClass') {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
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
  .key-figure-container {
    border-bottom: 1px solid #CCC;
    display: flex;
    flex-direction: row;
    margin-bottom: 28px;
    padding: 20px 0;
  }
  .key-figure-num {
    font-family: 'Gotham Book', sans-serif;
    font-size: 42px;
    line-height: 49px;
    text-transform: uppercase;
  }

  @media only screen and (max-width: 992px) {
    .iati-viz {
      h2.header {
        .badge.info-icon.badge-pill {
          width: 20px;
        }
      }
    }
  }
</style>
