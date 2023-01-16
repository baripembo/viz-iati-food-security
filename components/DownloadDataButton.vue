<template>
  <div>
    <b-dropdown
      id="downloadDropdown"
      text="Download Data"
      block
      class="download-button"
      variant="outline-dark"
      @click="onClick($event)">
      <!--       <b-dropdown-item @click="downloadAllData()">
        View data on HDX
      </b-dropdown-item> -->

      <b-dropdown-item @click="downloadFilteredData()">
        View filtered data
      </b-dropdown-item>
    </b-dropdown>
    <div class="text-center pt-2">
      <!-- <a href="https://docs.google.com/forms/d/e/1FAIpQLScVyHQpbZcyc5l__q-X1GNrYzKWN2tUWqUUqjzQIPJ2uECbgg/viewform" target="_blank" class="feedback-link">Send us feedback <div class="icon-warning" /></a> -->
    </div>
  </div>
</template>

<style lang='scss'>
</style>

<script>
export default {
  name: 'DataDownloadButton',
  components: {},
  props: [
    'type',
    'filterParams',
    'selectedFilterDimension'
  ],
  data () {
    return {}
  },
  computed: {
    filePath () {
      return 'https://data.humdata.org/dataset/iati-covid19-funding'
      // return 'https://ocha-dap.github.io/hdx-scraper-iati-viz/' + this.type + '.csv'
    },
    isProd () {
      return this.$store.state.isProd
    }
  },
  methods: {
    downloadAllData () {
      this.$mixpanelTrackLink(this.filePath, 'download all data')
      window.open(this.filePath)
    },
    downloadFilteredData (event) {
      const param = (this.filterParams[this.selectedFilterDimension] === '*') ? null : this.filterParams[this.selectedFilterDimension]
      let dimension = this.selectedFilterDimension.split('#')[1]

      // normalize dimension for flows when dimension is org+id+reporting
      if (this.type === 'flows' && dimension.includes('org')) { dimension = 'org+id' }

      const humanitarian = this.filterParams.humanitarian !== 'off'
      const strict = this.filterParams.strict !== 'off'
      const url = (this.type === 'flows') ? this.proxyLinkFlows(param, dimension, humanitarian, strict) : this.proxyLinkTransactions(param, dimension, humanitarian, strict)

      this.$mixpanelTrackLink(url, 'download filtered data')
      window.open(url)
    },
    // safety check: raise an exception if a token is not in the list of allowed values
    checkToken (value, allowed, typeName) {
      if (!allowed.includes(value)) {
        throw new Error('Bad ' + typeName + ': ' + value + '. Expected one of ' + String(allowed))
      }
    },
    /**
     * Generate a link to the HXL Proxy for C19 IATI transactions data.
     *
     * Example:
     *
     *   let url = proxyLinkTransactions("Health", "sector", false, true);
     *
     * Params:
     *   selectionValue - the primary value selected, based on selectionType (e.g. a sector name or an org id); use null for all
     *   selectionType - type of primary selection: "org+id", "sector", or "country" (ignored if selectionValue is null)
     *   isHumanitarian (optional) - if truthy, include only humanitarian transactions
     *   isStrict (optional) - if truthy, include only strict transactions
     */
    proxyLinkTransactions (selectionValue, selectionType, isHumanitarian, isStrict) {
      // the GET parameters that we'll pass to the HXL Proxy
      const params = {
        url: 'https://ocha-dap.github.io/hdx-scraper-iati-viz/foodsecurity/transactions.csv'
      }

      // filter rows by the primary selector (a single org, sector, or country)
      if (selectionValue !== null) {
        this.checkToken(selectionType, ['org+id', 'country', 'sector'], 'selection type')
        params['filter01'] = 'select'
        params['select-query01-01'] = selectionType + '=' + selectionValue
      }

      // optionally filter by humanitarian status
      if (isHumanitarian) {
        params['filter02'] = 'select'
        params['select-query02-01'] = 'indicator+humanitarian=1'
      }

      // optionally filter by strictness
      if (isStrict) {
        params['filter03'] = 'select'
        params['select-query03-01'] = 'indicator+strict=1'
      }

      // aggregate the data
      params['filter04'] = 'count'
      params['count-tags04'] = 'date+month,org+id,org+name,org+type,sector,country,activity+code,x_transaction_type'

      params['count-header04-01'] = 'Net money (USD)'
      params['count-type04-01'] = 'sum'
      params['count-pattern04-01'] = params['count-column04-01'] = '#value+net'

      params['count-header04-02'] = 'Total money (USD)'
      params['count-type04-02'] = 'sum'
      params['count-pattern04-02'] = params['count-column04-02'] = '#value+total'

      // remove rows with a value of 0
      params['filter05'] = 'select'
      params['select-query05-01'] = 'value>0'

      // sort the final result by transaction type, then by total value (largest to smallest)
      params['filter06'] = 'sort'
      params['sort-tags06'] = 'date+month,org+name,x_transaction_type,value+total'

      // return the URL (change "data" to "data.csv" for a direct CSV download, without preview)
      return 'https://proxy.hxlstandard.org/data?' + new URLSearchParams(params).toString()
    },
    /**
     * Generate a link to the HXL Proxy for C19 IATI flows data.
     *
     * Example:
     *
     *   let url = proxyLinkFlows("Health", false, true);
     *
     * Params:
     *   reportingOrgId - the IATI id for the reporting organisation, or null if not filtered by org.
     *   isHumanitarian (optional) - if truthy, include only humanitarian transactions
     *   isStrict (optional) - if truthy, include only strict transactions
     */
    proxyLinkFlows (reportingOrgId, isHumanitarian, isStrict) {
      // the GET parameters that we'll pass to the HXL Proxy
      const params = {
        url: 'https://ocha-dap.github.io/hdx-scraper-iati-viz/foodsecurity/flows.csv'
      }

      // filter rows by the reporting org id (if supplied)
      if (reportingOrgId !== null) {
        params['filter01'] = 'select'
        params['select-query01-01'] = 'org+id+reporting=' + reportingOrgId
      }

      // optionally filter by humanitarian status
      if (isHumanitarian) {
        params['filter02'] = 'select'
        params['select-query02-01'] = 'indicator+humanitarian=1'
      }

      // optionally filter by strictness
      if (isStrict) {
        params['filter03'] = 'select'
        params['select-query03-01'] = 'indicator+strict=1'
      }

      // aggregate the data
      params['filter04'] = 'count'
      params['count-tags04'] = 'org+id+reporting,org+name+reporting,org+reporting+type,org+id+provider,org+name+provider,org+provider+type,org+id+receiver,org+name+receiver,org+receiver+type,x_transaction_direction'

      params['count-header04-01'] = 'Total money (USD)'
      params['count-type04-01'] = 'sum'
      params['count-pattern04-01'] = params['count-column04-01'] = '#value+total'

      // remove rows with a value of 0
      params['filter05'] = 'select'
      params['select-query05-01'] = 'value>0'

      // sort the final result by total value (largest to smallest)
      params['filter06'] = 'sort'
      params['sort-tags06'] = 'value+total'
      params['sort-reverse06'] = 'on'

      // return the URL (change "data" to "data.csv" for a direct CSV download, without preview)
      return 'https://proxy.hxlstandard.org/data?' + new URLSearchParams(params).toString()
    }
  }
}
</script>
