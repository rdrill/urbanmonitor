<template>
  <v-app id="inspire">
    <!-- <v-navigation-drawer v-model="drawer" app clipper>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <!-- <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar> -->

    <v-content>
      <v-container class="fill-height" fluid >
          <ReviewCards msg="review cards page"/>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; <strong>Andrii Yaremych</strong>, 2020</span>
    </v-footer>
  </v-app>
</template>
<script>

import ReviewCards from './components/ReviewCards.vue'
// import UpdateTextCards from './components/UpdateTextCards.vue'
// import UpdateGaugeCards from './components/UpdateGaugeCards.vue'

export default {
  name: 'App',
   components: {
     ReviewCards,
   },
   props: {
     source: String,
   },

   data: () => ({
     drawer: null,
   }),

   created () {
     this.$vuetify.theme.dark = true
   },
}

</script>

<style>
.chartcontainer {
  margin: auto;
  width: 90%;
}
.chartjs-render-monitor{
  height:250px!important;
}
</style>
