<template>
    <line-chart :chart-data="chartData"  :options="{responsive: true, maintainAspectRatio: false}"></line-chart>
</template>

<script>
  import LineChart from './LineChart.js'
  export default {
    name: 'Chart',
    props: ["dataframe"],
    components: {
      LineChart
    },
    data () {
      return {
        chartData: {},
      }
    },
    mounted () {
      this.datainit();
    },
    methods: {
      datainit: function(){
      //  this.chartData = this.dataframe;
        this.chartData = Object.assign({}, this.chartData, this.dataframe)
    //    this.$set(this, 'chartData', this.dataframe)
      }
    }
  }
</script>
