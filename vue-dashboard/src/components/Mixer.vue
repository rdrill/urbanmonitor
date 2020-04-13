<template>
      <div justify="center" align="center" class="main">
        <v-row justify="center" align="center" >
          <v-col cols='3' md='12' lg='2'>
            <div v-for="item in chartSets.groupdata.whole.datasets" :key="item.sensor">
              <v-slider v-model="scaler" :id="item.sensor" max="100" min="1" :label="item.sensor" v-on:change="signalChange(item.sensor)" ></v-slider>

            </div>
          </v-col>
          <v-col cols='9' md='12' lg='10'>
            <v-card>
              <v-card-text>
                <line-chart :chart-data="chartData.whole"  :options="withLegend"></line-chart>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
</template>

<script>
  import LineChart from './LineChart.js'
  import { mixinchart } from './mixins/chartdata'
  export default {
    mixins:[mixinchart],
    components: {
      LineChart,
    },
    data () {
      return {
        scaler: [],
        withoutLegend:{responsive: true, maintainAspectRatio: false, legend: {display: false}, elements:{point:{radius:0}}},
        withLegend:{responsive: true, maintainAspectRatio: false, legend: {display: true}, elements:{point:{radius:0}}},
        chartData:{},
        saveLocally:true,
        textData:{},
        firstload: true,
        chartSets: {
          groupopts:{
            limit : 50,
            sample: 2,
          },
          groupdata:{
            whole:{
              name  : "whole",
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
                {
                  sensor: "temperature",
                  label: "Temperature",
                  color: 'rgba(255, 54, 0, 1)',
                  dlist: [],
                },
                {
                  sensor: "humidity",
                  label: "Humidity",
                  color: 'rgba(0, 186, 255, 1)',
                  dlist: [],
                },
                {
                  sensor: "pressure",
                  label: "Pressure",
                  color: 'rgba(130, 65, 217, 1)',
                  dlist: [],
                },
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
      //  this.baseUpdate(this.chartSets, "auto");
    },
      signalChange: function(sensor){
        this.chartScale(this.scaler,sensor);
        console.log(sensor,this.scaler);
      }
    },
  }
</script>
<style>
  .main{
    width:90%;
    margin:auto;
  }
  .chartjs-render-monitor{
    height:80vh;
  }
</style>
