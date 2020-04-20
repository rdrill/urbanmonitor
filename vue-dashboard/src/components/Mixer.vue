<template>
      <div justify="center" align="center" class="main">
        <v-row justify="center" align="center" >
          <v-col cols='3' md='12' lg='3'>
            <span>Масштабування часу</span>
            <v-subheader class="pl-2 mt-n6 mb-n7 overline">Зсув</v-subheader>
            <v-slider color="#4ccb92" track-color="#dfdfdf" thumb-color="#ffffff" v-model="timeposition" v-on:change="signalChangeTime" :max="maxdata.whole/2-40" min="2" ></v-slider>
            <v-subheader class="pl-2 mt-n6 mb-n7 overline">Діапазон</v-subheader>
            <v-slider color="#4ccb92" track-color="#dfdfdf" thumb-color="#ffffff" v-model="diapasone" v-on:change="signalChangeTime" :max="maxdata.whole/2" min="2" ></v-slider>

            <span>Масштабування даних</span>
            <v-switch v-model="switcher"></v-switch>
            <div  v-for="item in chartSets.groupdata.whole.datasets" :key="item.sensor">
              <v-subheader class="pl-2 mt-n6 mb-n7 overline">{{item.label}}</v-subheader>
              <v-slider v-if="switcher"  color="#a45d43" track-color="#43a48a" thumb-color="#ffffff" v-model="scaler[item.sensor]"  v-on:change="signalChange" :id="item.sensor" max="100" min="-100" ></v-slider>
              <v-slider v-else disabled  color="#a45d43" track-color="#43a48a" thumb-color="#ffffff" v-model="scaler[item.sensor]"  v-on:change="signalChange" :id="item.sensor" max="100" min="-100" ></v-slider>
            </div>

          </v-col>
          <v-col cols='9' md='12' lg='9'>
            <v-card>
              <v-card-text>
                <line-chart :chart-data="chartData.whole"  :options="withLegend"></line-chart>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <download-csv
            class   = "btn btn-default"
            :data   = "exporter"
            name    = "filename.csv">

            Download CSV (This is a slot)

        </download-csv>
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
        exporter:[],
        maxdata: {},
        scaler: {},
        diapasone: 1,
        timeposition: 1,
        switcher: false,
        withoutLegend:{responsive: true, maintainAspectRatio: false, legend: {display: false}, elements:{point:{radius:0}}},
        withLegend:{responsive: true, animation:false, maintainAspectRatio: false, legend: {display: true}, elements:{point:{radius:0}}},
        chartData:{},
        textData:{},
        firstload: true,
        buffered: false,
        chartSets: {
          groupopts:{
            limit : 10000,
            sample: 1,
            axis  : "datetime",
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
                  label: "Температура",
                  color: 'rgba(255, 54, 0, 1)',
                  dlist: [],
                },
                {
                  sensor: "humidity",
                  label: "Вологість",
                  color: 'rgba(0, 186, 255, 1)',
                  dlist: [],
                },
                {
                  sensor: "pressure",
                  label: "Атм. Тиск",
                  color: 'rgba(130, 65, 217, 1)',
                  dlist: [],
                },
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
      localStorage.chart_Time_Buffer = localStorage.chartBuffer;
    //  this.chartScale(this.scaler,"init");
      //this.getJSON();
    },
    methods: {
      initCharts: function(){
        this.getChartData(this.chartSets,true);
      //  this.baseUpdate(this.chartSets, "auto");
    },
      signalChange: function(){
        this.chartScale(this.scaler,"scale");
      },
      signalChangeTime: function(){
        this.timeScale(this.timeposition,this.diapasone);
        if (this.switcher){
          this.chartScale(this.scaler,"scale");
        }
      }
    },
    watch:{
      switcher:function(){
        if (!this.switcher){
          localStorage.chart_Scale_Buffer = localStorage.chartBuffer;
          this.timeScale(this.timeposition,this.diapasone);
        }else{
          this.chartScale(this.scaler,"zero");
        }
      },
      buffered:function(){
        if (this.buffered){
          console.log("buffering done!");
          this.diapasone=this.maxdata.whole/2-40;
          this.timeposition=1;
          this.timeScale(this.timeposition,this.diapasone);

        }
      }
    }
  }
</script>
<style>
  .main{
    width:90%;
    margin:auto;
  }
  .chartjs-render-monitor{
    height:80vh!important;
  }
  .chartcontainer {
    margin: auto;
    width: 90%;
  }
</style>
