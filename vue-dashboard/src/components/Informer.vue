<template>
        <v-list-item-content>
          <div class="overline mb-4"><v-icon>mdi-thermometer</v-icon> {{title}}</div>
          <v-list-item-title class="display-2 mb-1">{{value}} <p class="title inline">{{unit}}</p></v-list-item-title>
          <v-list-item-subtitle>
            динаміка:  <b>{{delta}}</b> {{unit}} на годину
            <v-icon v-if="delta < 0" class="subtitle-1"> mdi-arrow-down</v-icon>
            <v-icon v-if="delta > 0" class="subtitle-1"> mdi-arrow-up</v-icon>
            <v-icon v-if="delta == 0" class="subtitle-1"> mdi-arrow-up-down</v-icon>
          </v-list-item-subtitle>
        </v-list-item-content>
</template>

<script>
  export default {
    name: 'Informer',
    props: ["value","delta","unit","icon","title"],
    data () {
      return {
        textData:{},
      }
    },
    mounted () {
//      this.textUpdate();
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
