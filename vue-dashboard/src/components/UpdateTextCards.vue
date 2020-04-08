<template>
  <div>
    <v-col cols='12'>
      <v-card align="center" justify="center">
        <Informer :value="textData.temperature.value" :delta="textData.temperature.delta" unit="°C" icon="mdi-thermometer" title="ТЕМПЕРАТУРА" ></Informer>
      </v-card>
    </v-col>
    <v-col cols='12'>
      <v-card height="cards_height"  align="center" justify="center">
        <v-list-item-content>
          <div class="overline mb-4"><v-icon>mdi-water-percent</v-icon>ВІДНОСНА ВОЛОГІСТЬ</div>
          <v-list-item-title class="display-2 mb-1">{{textData.humidity.value}} <p class="title inline">%</p></v-list-item-title>
          <v-list-item-subtitle>
            динаміка:  <b>{{textData.humidity.delta}}</b> % на годину
            <v-icon v-if="textData.humidity.delta < 0" class="subtitle-1"> mdi-arrow-down</v-icon>
            <v-icon v-if="textData.humidity.delta > 0" class="subtitle-1"> mdi-arrow-up</v-icon>
            <v-icon v-if="textData.humidity.delta == 0" class="subtitle-1"> mdi-arrow-up-down</v-icon>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-card>
    </v-col>
    <v-col cols='12'>
      <v-card height="cards_height"  align="center" justify="center">
        <v-list-item-content>
          <div class="overline mb-4"><v-icon>mdi-weather-windy</v-icon> АТМОСФЕРНИЙ ТИСК</div>
          <v-list-item-title class="display-2 mb-1">{{textData.pressure.value}} <p class="title inline">hPa</p></v-list-item-title>
          <v-list-item-subtitle>
            динаміка:  <b>{{textData.pressure.delta}}</b> hPa на годину
            <v-icon v-if="textData.pressure.delta < 0" class="subtitle-1"> mdi-arrow-down</v-icon>
            <v-icon v-if="textData.pressure.delta > 0" class="subtitle-1"> mdi-arrow-up</v-icon>
            <v-icon v-if="textData.pressure.delta == 0" class="subtitle-1"> mdi-arrow-up-down</v-icon>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-card>
    </v-col>
  </div>
</template>

<script>
  import { mixintext } from './mixins/textdata'
  import Informer from './Informer.vue'
  export default {
    mixins:[mixintext],
    components: {
      Informer
    },
    data () {
      return {
        textData:{},
      }
    },
    mounted () {
      this.textUpdate();
    },

    methods: {
    }
  }
</script>
<style>
.inline{
  display:inline-block;
}
</style>
