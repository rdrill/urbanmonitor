<template>
  <div class="main" justify="center" align="center">
    <div v-if="loaded">
      <v-row align="center" >
        <v-col cols='12' md='12' lg='4'>
          <v-card>
            <v-card-text>
              <v-row align="center" justify="center" >
                <v-col align="center" justify="center"  cols='4' lg='5'>
                  <Informer v-if="infoisready" :data="textData.temperature" icon="mdi-thermometer" title="ТЕМПЕРАТУРА" ></Informer>
                </v-col>
                <v-col class="dashboardchart"  cols='8' lg='7'>
                  <line-chart :chart-data="chartData.temperature"  :options="withoutLegend"></line-chart>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols='12' md='12' lg='4'>
          <v-card>
            <v-card-text>
              <v-row align="center" justify="center" >
                <v-col align="center" justify="center"   cols='4' lg='5'>
                  <Informer v-if="infoisready" :data="textData.humidity" icon="mdi-water-percent" title="ВІДН. ВОЛОГІСТЬ" ></Informer>
                </v-col>
                <v-col class="dashboardchart" cols='8' lg='7'>
                  <line-chart :chart-data="chartData.humidity"  :options="withoutLegend"></line-chart>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols='12' md='12' lg='4'>
          <v-card>
            <v-card-text>
              <v-row align="center" justify="center" >
                <v-col align="center" justify="center"   cols='4' lg='5'>
                  <Informer v-if="infoisready" :data="textData.pressure" icon="mdi-weather-windy" title="АТМ. ТИСК" ></Informer>
                </v-col>
                <v-col class="dashboardchart"  cols='8' lg='7'>
                  <line-chart :chart-data="chartData.pressure"  :options="withoutLegend"></line-chart>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row align="center" >
        <v-col cols='12' md='12' lg='6'>
          <v-card>
            <v-card-text>
              <v-row align="center" justify="center" >
                <v-col align="center" justify="center"  cols='4' lg='4'>
                  <Informer v-if="infoisready" :multiple="true" :data="[textData.pm_1_0, textData.pm_2_5, textData.pm_10_0]" icon="mdi-scatter-plot-outline" title="ЗАПИЛЕНІСТЬ" ></Informer>
                </v-col>
                <v-col class="dashboardchart"  cols='8' lg='8'>
                  <line-chart :chart-data="chartData.pollution"  :options="withLegend"></line-chart>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols='12' md='12' lg='6'>
          <v-card>
            <v-card-text>
              <v-row align="center" justify="center" >
                <v-col align="center" justify="center"   cols='4' lg='4'>
                  <Informer v-if="infoisready" :multiple="true" :data="[textData.dioxide]" icon="mdi-air-filter" title="ДІОКСИД ВУГЛЕЦЮ" ></Informer>
                </v-col>
                <v-col  class="dashboardchart"  cols='8' lg='8'>
                  <line-chart :chart-data="chartData.dioxide"  :options="withoutLegend"></line-chart>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <circle8 v-else></circle8>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'
  import Informer  from './Informer.vue'
//  import Gauge     from './Gauge.vue'
  import { mixinchart } from './mixins/chartdata'
  import { mixintext } from './mixins/textdata'
  import {Circle8} from 'vue-loading-spinner'
  export default {
    mixins:[mixinchart,mixintext],
    components: {
      LineChart,
      Informer,
      Circle8
    //  Gauge
  //    Chart
    },
    data () {
      return {
        loaded:false,
        infoisready: false,
        withoutLegend:{responsive: true, maintainAspectRatio: false, legend: {display: false}, elements:{point:{radius:0}}},
        withLegend:{responsive: true, maintainAspectRatio: false, legend: {display: true}, elements:{point:{radius:0}}},
        chartData:{},
        textData:{},
        chartSets: {
          groupopts:{
            limit : 50,
            sample: 1,
            axis:"time"
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
            temperature : {
              name  : "temperature",
              datasets: [
                {
                  sensor: "temperature",
                  label: "Температура",
                  color: 'rgba(255, 54, 0, 1)',
                  dlist: [],
                },
              ]
            },
            humidity : {
              name  : "humidity",
              datasets: [
                {
                  sensor: "humidity",
                  label: "Вологість",
                  color: 'rgba(0, 186, 255, 1)',
                  dlist: [],
                },
              ]
            },
            pressure : {
              name  : "pressure",
              datasets: [
                {
                  sensor: "pressure",
                  label: "Атм. Тиск",
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
                  label: "Діоксид вуглецю",
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
      this.textUpdate();
    },
    methods: {
      initCharts: function(){
        this.getChartData(this.chartSets,false);
        this.baseUpdate(this.chartSets, "auto");
      }
    }
  }
</script>
<style>
.dashboardchart div .chartjs-render-monitor{
  height:32vh;
}
.chartcontainer {
  margin: auto;
  width: 90%;
}
/* .dashboardchart{
  width: 30vh;
} */
.main{
  width:90%;
  margin:auto;
}
</style>
