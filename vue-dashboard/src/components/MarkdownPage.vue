<template>
  <div class="main" justify="center" align="center">
    <div v-if="loaded">
      <v-row align="center" justify="center" >
        <v-col cols='12' md='12' lg='8'>
          <v-card align="left">
            <v-card-text>
              <vue-markdown :source="marksource" class="markdown"></vue-markdown>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <circle8 v-else></circle8>
  </div>
</template>

<script>
  import VueMarkdown from 'vue-markdown-v2'
  import markstring from '!raw-loader!../../ABOUT.md';
  import {Circle8} from 'vue-loading-spinner'
  export default {
    mixins:[],
    components: {
      VueMarkdown,
      Circle8
    },
    data () {
      return {
        loaded:true,
        marksource: markstring
      }
    },
    mounted () {

    },
    methods: {
    }
  }
</script>
<style>
.main{
  width:90%;
  margin:auto;
}
.markdown *{
  padding: 0px 0px 0px 0px;
  margin : 10px 0px 10px 0px;
}
.markdown h1, h2{
  margin : 40px 0px 15px 0px!important;
  text-align:center;
}
.markdown h3{
  margin : 5px 0px 20px 0px!important;
}
.markdown * code{
  background-color: rgb(19, 19, 19);
  color: rgb(65, 180, 196);
}
.markdown * img{
  width: 30%;
  margin : -10px 0px -5px 0px;
}
.markdown table{
  border-collapse: collapse;
}
.markdown table tr td{
  padding: 5px;
  border: 1px solid rgb(24, 24, 24);
}
.markdown pre code{
  padding: 5px;
  font-size: 0.5vw;
  line-height: 1em;
}
.markdown table th{
  padding: 5px;
  border: 1px solid rgb(24, 24, 24);
  background-color: #292a2e;
  color: white;
}
.markdown table tr:nth-child(even){
  background-color: #212020;
}
img[alt='License: MIT'] {
  width: 75px;
}
</style>
