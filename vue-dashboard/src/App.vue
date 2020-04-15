<template>
  <v-app id="inspire">
    <nav>
     <router-link to='/'>main</router-link>
     <router-link to='/mixer'>mixer</router-link>
   </nav>
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
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar> -->

    <v-content>
      <v-container class="fill-height" fluid >
          <router-view />
      </v-container>
    </v-content>

    <v-footer align="center" app>
      <span>&copy; <strong>Andrii Yaremych</strong>, 2020</span>
    </v-footer>
  </v-app>
</template>
<script>

//import Mixer from './components/Mixer.vue'
//import ReviewCards from './components/ReviewCards.vue'
// import UpdateGaugeCards from './components/UpdateGaugeCards.vue'

export default {
  name: 'App',
   components: {
     //Mixer,
    // ReviewCards
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
