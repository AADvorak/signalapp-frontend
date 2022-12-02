<template>
  <Chart :options="chartOptions"></Chart>
</template>

<script>
import SignalUtils from "../utils/signal-utils";
import StringUtils from "../utils/string-utils";
import { Chart } from 'highcharts-vue'

export default {
  name: "chart-drawer",
  props: {
    signals: {
      type: Array,
      required: true
    }
  },
  components: {
    Chart
  },
  data() {
    return {
      chartOptions: {
        chart: {
          zoomType: 'xy'
        },
        title: {
          text: ''
        },
        series: [],
        xAxis: {
          categories: []
        }
      }
    }
  },
  computed: {
    chartTitle() {
      return this.signals.length > 1
          ? `Selected ${this.signals.length} signals`
          : StringUtils.restrictLength(this.signals[0].name, 50)
    }
  },
  watch: {
    signals() {
      this.makeChartParamsFromSignals()
    }
  },
  methods: {
    makeChartParamsFromSignals() {
      if (!this.signals || !this.signals.length) {
        return
      }
      for (let signal of this.signals) {
        if (!signal.data) {
          return
        }
      }
      SignalUtils.calculateSignalsParams(this.signals)
      let commonGrid = SignalUtils.makeCommonSignalsValueGrid(this.signals)
      let categories = []
      for (let x of commonGrid) {
        categories.push(x.toFixed(2))
      }
      let series = []
      for (let signal of this.signals) {
        let data = []
        for (let x of commonGrid) {
          data.push(SignalUtils.getSignalValue(signal, x))
        }
        series.push({
          name: StringUtils.restrictLength(signal.name, 50),
          data
        })
      }
      this.chartOptions.xAxis.categories = categories
      this.chartOptions.series = series
      this.chartOptions.title.text = this.chartTitle
    }
  },
  mounted() {
    this.makeChartParamsFromSignals()
  }
}
</script>

<style scoped>

</style>