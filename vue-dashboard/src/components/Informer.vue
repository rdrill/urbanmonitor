<template>
        <v-list-item-content>
          <div class="overline mb-4"><v-icon class="display-2">{{icon}}</v-icon><br/><br/> {{title}}</div>
          <div align="center" v-if="multiple">
            <div class="itemcontainer" v-for="item in data" :key="item.data">
              <span class="itemname"> {{ item.name }}: </span>
              <span class="itemvalue">{{ item.value }} </span>
              <span class="itemunit"> {{ item.unit  }} </span>
            </div>
          </div>
          <div v-else>
            <v-list-item-title class="display-1 mb-1">{{data.value}} <p class="title inline">{{data.unit}}</p></v-list-item-title>
            <v-list-item-subtitle>
              динаміка:  <br/><b>{{data.delta}}</b> {{data.unit}} / год.
              <v-icon v-if="delta < 0" class="subtitle-1"> mdi-arrow-down</v-icon>
              <v-icon v-if="delta > 0" class="subtitle-1"> mdi-arrow-up</v-icon>
              <v-icon v-if="delta == 0" class="subtitle-1"> mdi-arrow-up-down</v-icon>
            </v-list-item-subtitle>
          </div>

        </v-list-item-content>
</template>

<script>
  export default {
    name: 'Informer',
    props: ["data","icon","title","multiple"],
    data () {
      return {
        textData:{},
      }
    },
    mounted () {
    },

    methods: {
    }
  }
</script>
<style>
.inline{
  display:inline-block;
}
.itemcontainer{
  padding-bottom:7px;
}
.itemname{
  font-size:1em;
}
.itemvalue{
  font-size:1.5em;
  font-weight:600;
}
.itemunit{
  font-size:0.8em;
}
</style>
