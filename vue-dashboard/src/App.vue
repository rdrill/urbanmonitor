<template>
  <v-app id="inspire">
     <!-- <router-link to='/'>main</router-link>
     <router-link to='/mixer'>mixer</router-link> -->
     <v-toolbar
          dense
          dark
          max-height="48"
          hide-on-scroll
        >

       <v-toolbar-title class="apptitle"><font color="#4bceff">UAQM</font></v-toolbar-title>

       <v-tabs color="#4bceff" class="tabscontainer" centered>
                 <v-tab to='/'>Панель моніторингу</v-tab>
                 <v-tab to='/mixer'>Мікшер даних</v-tab>
                 <v-tab to='/about'>Опис</v-tab>
       </v-tabs>

       <div v-if="dataisready">
         <JsonCSV
             class   = "btn btn-default"
             :data   = "exporter"
             :name    = "new Date().getFullYear()+ '_' + new Date().getMonth()+ '_' + new Date().getDate() +'_'+ new Date().getTime()+'.csv'">

             <v-btn color="green" class="ma-2 white--text" ref="downloader">
               Завантажити дані
               <v-icon right dark>mdi-cloud-download</v-icon>
             </v-btn>

         </JsonCSV>
       </div>
       <div v-else>
         <v-btn color="#43a0e3" class="ma-2 white--text" @click="prepareData">
           Підготувати дані
           <v-icon v-if="datainprocess" right dark>mdi-progress-clock</v-icon>
           <v-icon v-else right dark>mdi-cloud</v-icon>
         </v-btn>
       </div>
     </v-toolbar>

    <v-content>
      <v-container class="fill-height" fluid >
          <router-view />
      </v-container>
    </v-content>

    <v-footer padless class="densefooter">
    <div style="width:100%" align="center" centered >
      {{ new Date().getFullYear() }} — <strong>Andrii Yaremych, UKMA</strong>

       <v-tooltip top>
         <template v-slot:activator="{ on }">
           <v-btn href="https://github.com/rdrill/urbanmonitor" target="_blank" class="mx-4" dark icon v-on="on" >
              <v-icon size="24px">mdi-github</v-icon>
            </v-btn>
         </template>
         <span>Переглянути проект на GitHub</span>
       </v-tooltip>

    </div>
  </v-footer>
  </v-app>
</template>


<script>


import { mixinchart } from './components/mixins/chartdata'
import JsonCSV from 'vue-json-csv'
export default {
  name: 'App',
  mixins:[mixinchart],
   components: {
     JsonCSV,
   },
   props: {
     source: String,
   },

   data () {
     return {
       datainprocess:false,
       dataisready:false,
       exporter:[],
     }
   },
   methods:{
     prepareData: function(){
         this.getJSON();
         console.log("json!");
         this.datainprocess = true;
     }
   },
   watch:{
     exporter:function(){
       console.log("export is done!");
       this.dataisready = true;
      // this.$refs.downloader.$el.click()
    //   console.log(this.$refs);
     },

   },
   created () {
     this.$vuetify.theme.dark = true;
   },

}
</script>
<style>
.apptitle{
  width:200px;
  font-size:1.2em!important;
}
.densefooter{
  max-height:40px;
  font-size:0.8em;
}
</style>
