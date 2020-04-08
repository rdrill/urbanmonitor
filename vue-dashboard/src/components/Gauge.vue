<template>
    <VueSvgGauge
                class="mini-gauge"
                :start-angle="-100"
                :end-angle="100"
                :value="scaledvalue"
                :separator-step="25"
                :gauge-color="[{ offset: 0, color: '#36de21'}, { offset: 50, color: '#f4c009'} , { offset: 100, color: '#8c1b0b'}]"
                :scale-interval="2"
                :inner-radius="80"
                base-color="#d0cdcd"
              >
                <div class="inner-text">
                  <p class="display-1" v-bind:style="{ 'color': styler }" >{{value}}</p><br/><br/>
                  <span v-bind:style="{ 'color': styler }" > {{units}}</span>
                </div>
    </VueSvgGauge>
</template>

<script>
  import { VueSvgGauge } from 'vue-svg-gauge'
  export default {
    name: 'Gauge',
    components: {
      VueSvgGauge
    },
    props: ["value", "maxval", "minval", "units"],
    data () {
      return {
        scaledvalue:0
      }
    },
    computed: {
      styler() {
        var data = 0
        try {
          data = this.scaledvalue;
        } catch (e) {
          data  = 23;
        }
        if (data < 25) {
          return "rgb(112, 255, 0)"
        }
        if (data < 50) {
          return "rgb(112, 255, 0)"
        }
        if (data < 75) {
          return "rgb(112, 255, 0)"
        }
        return "rgb(112, 255, 0)"
      },
    },
    mounted () {
      this.scale();
    },

    methods: {
      scale(){
        const scaled = 100/(this.maxval-this.minval)*(this.value-this.minval);
        this.scaledvalue = scaled;
      }
    }
  }
</script>
<style>
.inline{
  display:inline-block;
}
.mini-gauge{
  max-width:70%;
  padding:10px;
}
.inner-text {
       display: flex;
       justify-content: center;
       margin-top: 60px;
       font-size: 20px;
       font-weight: bold;
}
</style>
