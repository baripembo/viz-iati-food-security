<template>
  <div>
    <DoughnutChart
      :data="chartData"
      :options="doughnutChartOptions"
      class="doughnut-chart"
    />
  </div>
</template>

<style scoped>
.doughnut-chart {
  height: 180px;
  width: 180px;
}
</style>

<script>
import ChartDataLabels from 'chartjs-plugin-datalabels'
import DoughnutChart from '~/components/Charts/doughnut-chart'
export default {
  name: 'SummaryDoughnutChart',
  components: {
    DoughnutChart
  },
  props: [
    'doughnutChartData',
    'colors'
  ],
  data () {
    return {}
  },
  computed: {
    plugins () {
      return {
        ChartDataLabels
      }
    },
    doughnutChartOptions () {
      return {
        maintainAspectRatio: false,
        legend: false,
        plugins: {
          datalabels: {
            color (context) {
              const index = context.dataIndex
              const bgColor = context.dataset.backgroundColor[index]
              const fontColor = (bgColor === '#EEE') ? '#000' : '#FFF'
              return fontColor
            },
            formatter (value, context) {
              return value + '%'
            }
          }
        },
        tooltips: {
          callbacks: {
            label (tooltipItem, data) {
              return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%'
            }
          }
        }
      }
    },
    chartData () {
      return {
        datasets: [{
          borderWidth: 0,
          backgroundColor: this.colors,
          data: this.doughnutChartData.values
        }],
        labels: this.doughnutChartData.labels
      }
    }
  }
}
</script>
