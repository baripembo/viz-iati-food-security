<template>
  <div>
    <TimeseriesChart
      :data="chartData"
      :options="timeseriesChartOptions"
      class="timeseries-chart"
    />
    <div class="timeseries-legend text-center" v-html="customLegend" />
  </div>
</template>

<script>
import numeral from 'numeral'
import TimeseriesChart from '~/components/Charts/timeseries-chart'
export default {
  name: 'SummaryTimeseriesChart',
  components: {
    TimeseriesChart
  },
  props: [
    'timeseriesChartData',
    'chartType'
  ],
  data () {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  },
  computed: {
    timeseriesChartOptions () {
      return {
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false
          }
        },
        scales: {
          yAxes: [
            {
              id: 'y-axis-left',
              scaleLabel: {
                display: true,
                labelString: this.chartType + ' (USD)'
              },
              gridLines: {
                color: '#EEE',
                drawBorder: false,
                drawOnChartArea: true,
                drawTicks: false
              },
              ticks: {
                beginAtZero: true,
                fontColor: '#333',
                fontFamily: 'Source Sans Pro',
                fontSize: 11,
                padding: 10,
                callback (value, index, values) {
                  return numeral(value).format('$0.0a').toUpperCase()
                }
              },
              position: 'left'
            }
          ],
          xAxes: [{
            barPercentage: 0.9,
            categoryPercentage: 0.3,
            gridLines: {
              color: '#000',
              drawOnChartArea: false,
              drawTicks: false
            },
            ticks: {
              fontColor: '#333',
              fontFamily: 'Source Sans Pro',
              fontSize: 11,
              padding: 10
            }
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label (item, data) {
              const groupLabel = (item.datasetIndex === 0 || item.datasetIndex === 1) ? 'Cumulative' : 'Yearly'
              return groupLabel + ' ' + data.datasets[item.datasetIndex].label + ': $' + numeral(item.value).format('0,0')
            }
          }
        }
      }
    },
    chartData () {
      const dates = this.timeseriesChartData.yearlyDates.map((date) => {
        // const dateStr = date.split('-')
        // const d = new Date(dateStr[0], dateStr[1] - 1)
        // return this.months[d.getMonth()] + ' ' + d.getFullYear()
        return date
      })
      const data = []
      if (this.chartType.includes('Cumulative')) {
        data.push(
          {
            type: 'line',
            borderColor: '#007CE1',
            borderDash: [4, 2],
            borderWidth: 1,
            data: this.timeseriesChartData.cumulative.commitments,
            fill: false,
            label: 'Commitments',
            pointBackgroundColor: '#FFF',
            pointRadius: 4,
            tension: 0,
            yAxisID: 'y-axis-left'
          },
          {
            type: 'line',
            borderColor: '#F2645A',
            borderDash: [4, 2],
            borderWidth: 1,
            data: this.timeseriesChartData.cumulative.spending,
            fill: false,
            label: 'Spending',
            pointBackgroundColor: '#FFF',
            pointRadius: 4,
            tension: 0,
            yAxisID: 'y-axis-left'
          }
        )
      }
      if (this.chartType.includes('Yearly')) {
        data.push(
          {
            label: 'Commitments',
            backgroundColor: '#007CE1',
            data: this.timeseriesChartData.yearly.commitments,
            yAxisID: 'y-axis-left'
          },
          {
            label: 'Spending',
            backgroundColor: '#F2645A',
            data: this.timeseriesChartData.yearly.spending,
            yAxisID: 'y-axis-left'
          }
        )
      }
      return {
        datasets: data,
        labels: dates
      }
    },
    customLegend () {
      const htmlLegend = []
      for (let i = 0; i < this.chartData.datasets.length; i++) {
        const item = this.chartData.datasets[i]
        if (this.chartData.datasets.length > 2) {
          if (i === 0) { htmlLegend.push('<div><h6 class="d-inline">Cumulative: </h6>') }
          if (i === 2) { htmlLegend.push('</div><div class="mr-lg-4"><h6 class="d-inline">Yearly: </h6>') }
        } else {
          if (i === 0 && this.chartType.includes('Cumulative')) { htmlLegend.push('<div><h6 class="d-inline">Cumulative: </h6>') }
          if (i === 0 && this.chartType.includes('Yearly')) { htmlLegend.push('<div><h6 class="d-inline">Yearly: </h6>') }
        }

        if (item.type === 'line') {
          htmlLegend.push('<div class="key key-circle mr-1 ml-2" style="border-color:' + item.borderColor + '">' + '</div>' + item.label)
        } else {
          htmlLegend.push('<div class="key key-square mr-1 ml-2" style="background-color:' + item.backgroundColor + '">' + '</div>' + item.label)
        }
      }
      htmlLegend.push('</div>')
      return htmlLegend.join('')
    }
  }
}
</script>

<style lang="scss">
.timeseries-legend {
  color: #333;
  display: flex;
  flex-direction: row-reverse;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
  justify-content: center;
  margin-top: 5px;
}
.key {
  display: inline-block;
  height: 10px;
  width: 10px;
  &.key-circle {
    border: 1px solid;
    border-radius: 50%;
  }
}
</style>
