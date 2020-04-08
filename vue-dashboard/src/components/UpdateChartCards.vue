<template>
  <v-row align="center" justify="center" >
    <v-col cols='12'>
      <v-card>
        <v-card-text>
          <!-- <Chart :dataframe="preparedData.climate"></Chart> -->
          <line-chart :chart-data="chartData.pollution"  :options="{responsive: true, maintainAspectRatio: false}"></line-chart>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols='12'>
      <v-card>
        <v-card-text>
          <line-chart :chart-data="chartData.climate"  :options="{responsive: true, maintainAspectRatio: false}"></line-chart>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import LineChart from './LineChart.js'
  //import Chart from './Chart.vue'
  import { mixinchart } from './mixins/chartdata'
  export default {
    mixins:[mixinchart],
    components: {
      LineChart,
  //    Chart
    },
    data () {
      return {
        chartData:{},
        chartSets: {
          groupopts:{
            limit : 1000,
            sample: 10,
          },
          groupdata:{
            pollution:{
              name  : "pollution",
              datasets: [
                {
                  sensor: "PM_1_0",
                  label: "PM 1.0",
                  color: 'rgba(255, 0, 115, 1)',
                  dlist: [],
                },
                {
                  sensor: "PM_2_5",
                  label: "PM 2.5",
                  color: 'rgba(13, 0, 255, 1)',
                  dlist: []
                },
                {
                  sensor: "PM_10_0",
                  label: "PM 10.0",
                  color: 'rgba(217, 168, 0, 1)',
                  dlist: []
                },
              ]
            },
            climate : {
              name  : "climate",
              datasets: [
                {
                  sensor: "temperature",
                  label: "Temperature",
                  color: 'rgba(255, 54, 0, 1)',
                  dlist: [],
                },
                {
                  sensor: "humidity",
                  label: "Humidity",
                  color: 'rgba(0, 56, 255, 1)',
                  dlist: []
                },
              ]
            },
            pressure : {
              name  : "pressure",
              datasets: [
                {
                  sensor: "pressure",
                  label: "Pressure",
                  color: 'rgba(130, 65, 217, 1)',
                  dlist: [],
                }
              ]
            },
            dioxide : {
              name  : "PPM_CO2",
              datasets: [
                {
                  sensor: "PPM_CO2",
                  label: "Carbon Dioxide",
                  color: 'rgba(87, 255, 119, 1)',
                  dlist: [],
                }
              ]
            }
          }
        }
      }
    },
    mounted () {
      this.initCharts();
    },
    methods: {
      initCharts: function(){
        this.getChartData(this.chartSets);
        this.baseUpdate(this.chartSets, "auto");
      }
    }
  }
</script>
