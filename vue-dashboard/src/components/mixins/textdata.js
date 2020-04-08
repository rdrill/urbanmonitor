import {dataRef} from './../../firedb';
let data = dataRef;
export const mixintext = {
  methods: {
    textUpdate: function(){
      data.orderByKey().limitToLast(11).on('value', snapshot => {
        const shot_A = snapshot.val()[Object.keys(snapshot.val())[0]];
        const shot_B = snapshot.val()[Object.keys(snapshot.val())[10]];
        const dataset = {
          lastudate: shot_B.timestamp,
          temperature: {
            value: (shot_B.temperature).toFixed(2),
            delta: (shot_B.temperature-shot_A.temperature).toFixed(2),
          },
          humidity: {
            value: (shot_B.humidity).toFixed(2),
            delta: (shot_B.humidity-shot_A.humidity).toFixed(2),
          },
          pressure: {
            value: (shot_B.pressure).toFixed(2),
            delta: (shot_B.pressure-shot_A.pressure).toFixed(2),
          },
          pm_1_0: {
            value: (shot_B.PM_1_0).toFixed(2),
            delta: (shot_B.PM_1_0-shot_A.PM_1_0).toFixed(2),
          },
          pm_2_5: {
            value: (shot_B.PM_2_5).toFixed(2),
            delta: (shot_B.PM_2_5-shot_A.PM_2_5).toFixed(2),
          },
          pm_10_0: {
            value: (shot_B.PM_10_0).toFixed(2),
            delta: (shot_B.PM_10_0-shot_A.PM_10_0).toFixed(2),
          },
          dioxide: {
            value: (shot_B.PPM_CO2),
            delta: (shot_B.PPM_CO2-shot_A.PPM_CO2),
          },
        }
        this.textData = dataset;
      });
    },
  },
  watch: {
    textData: ()=>{
      console.log("text updated!");
    }
  }
}
