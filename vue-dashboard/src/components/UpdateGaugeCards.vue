<template>
  <v-row align="center" justify="center">
    <v-col cols='3'>
      <v-card align="center" justify="center">
          <Gauge :value="textData.dioxide.value" maxval="1000" minval="400" units="ppm"></Gauge>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import Gauge from './Gauge.vue'
  import { mixintext } from './mixins/textdata'
  export default {
    mixins:[mixintext],
    components: {
      Gauge
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
