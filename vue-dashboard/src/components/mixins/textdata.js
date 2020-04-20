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
            name : "Температура",
            unit : "°C",
          },
          humidity: {
            value: (shot_B.humidity).toFixed(2),
            delta: (shot_B.humidity-shot_A.humidity).toFixed(2),
            name : "Вологість",
            unit : "%",
          },
          pressure: {
            value: (shot_B.pressure).toFixed(2),
            delta: (shot_B.pressure-shot_A.pressure).toFixed(2),
            name : "Тиск",
            unit : "hPa",
          },
          pm_1_0: {
            value: (shot_B.PM_1_0).toFixed(2),
            delta: (shot_B.PM_1_0-shot_A.PM_1_0).toFixed(2),
            name : "pm1.0  ",
            unit : "μg/m³",
          },
          pm_2_5: {
            value: (shot_B.PM_2_5).toFixed(2),
            delta: (shot_B.PM_2_5-shot_A.PM_2_5).toFixed(2),
            name : "pm2.5  ",
            unit : "μg/m³",
          },
          pm_10_0: {
            value: (shot_B.PM_10_0).toFixed(2),
            delta: (shot_B.PM_10_0-shot_A.PM_10_0).toFixed(2),
            name : "pm10.0",
            unit : "μg/m³",
          },
          dioxide: {
            value: (shot_B.PPM_CO2),
            delta: (shot_B.PPM_CO2-shot_A.PPM_CO2),
            name : "CO₂",
            unit : "ppm",
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
