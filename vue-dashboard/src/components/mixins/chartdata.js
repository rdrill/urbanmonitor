import {dataRef} from './../../firedb';
let data = dataRef;
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const mixinchart = {
  methods: {
    objectRefresher: function(dataobj){
      var updated = {};
                                                        // chart data transformerer hack
      for (const ia in dataobj) {                       // it is needed to provide the chart's autoupdate
        updated[ia] = {};                               // it shold be replaced by anything less ugly
        for (const ib in dataobj[ia]) {                 // the main idea to make a difference between old and new object
          if(ib=="datasets"){                           // to trigg the chart's mixin data watcher
            updated[ia][ib] = [];
            for (const ic in dataobj[ia][ib]) {
              updated[ia][ib].push({});
              for (const id in dataobj[ia][ib][ic]) {
                if(id!="_meta"){
                  updated[ia][ib][ic][id] = dataobj[ia][ib][ic][id];
                }
              }
            }
          }else{
              updated[ia][ib] = dataobj[ia][ib];
          }
        }
      }
      return updated
    },
    objectModify: function(dataobj, snapshot, chartoptions){
      var updated = this.objectRefresher(dataobj);
      const axis       = chartoptions.groupopts.axis;
      const shot = snapshot.val()[Object.keys(snapshot.val())[0]];
       for (const property in chartoptions.groupdata) {

        if(axis=="time")     updated[property].labels.push(shot.timestamp.split("T")[1].slice(0, -4));
        if(axis=="date")     updated[property].labels.push(shot.timestamp.split("T")[0]);
        if(axis=="datetime") updated[property].labels.push(shot.timestamp.split("T")[0].slice(5)+ " " + shot.timestamp.split("T")[1].slice(0, -4));
        var ln = updated[property].datasets.length;
        for (var i = 0; i < ln; i++) {
          const sensorname = updated[property].datasets[i].sname;
          updated[property].datasets[i].data.push((shot[sensorname]).toFixed(3));
        }
       }
      return updated;
    },
    baseUpdate: function(chartoptions, updOption = "auto") {
      switch (updOption) {
        case "auto":
          data.orderByKey().limitToLast(1).on('value', snapshot => {
            try {
              this.chartData = this.objectModify(this.chartData, snapshot, chartoptions);
            } catch (e) {
              console.log("first autoupdate init");
            }
          });
          break;
        default:
          if(!isNaN(updOption)){
            const msecs = updOption*1000*60; // converting minutes to msecs
            setInterval(()=>{
              try {
                data.orderByKey().limitToLast(1).once('value', snapshot => {
                  this.chartData = this.objectModify(this.chartData, snapshot, chartoptions);
                });
              } catch (e) {
                console.log("first timer update init");
              }

            },msecs);
          }
          break;

      }
    },
    chartScale: function(scaler,init) {
      let dataobj = {};

      if (localStorage.chart_Time_Buffer) {
        dataobj = JSON.parse(localStorage.chart_Time_Buffer);
      }else{
        dataobj = this.chartData;
      }

      for (const sc in scaler) {
        if(init=="zero"){
          scaler[sc] = 1;
        }
        if(init=="init"){
          scaler[sc] = 0;
        }
    //    else{
          for (const u in dataobj) {
            for (const i in dataobj[u]) {
              for (const o in dataobj[u][i]) {
                if(dataobj[u][i][o].sname==sc){
                  const max = Math.max(...dataobj[u][i][o].data),
                        min = Math.min(...dataobj[u][i][o].data),
                        delta = max-min;
                  console.log(max,min,delta);
                  for (var p = 0; p < dataobj[u][i][o].data.length; p++) {
                    if(scaler[sc]>=1){
                      dataobj[u][i][o].data[p] = (dataobj[u][i][o].data[p]-min+1)*scaler[sc];
                    }
                    if(scaler[sc]<0){
                      dataobj[u][i][o].data[p] = (dataobj[u][i][o].data[p]-min+1)/Math.abs(scaler[sc]);
                    }
                  }
                }
              }
            }
          }
      //  }
      }
      this.chartData = dataobj;
      localStorage.chart_Scale_Buffer = JSON.stringify(dataobj,getCircularReplacer());
    },
    timeScale: function(selector,step) {

      let dataobj = {};

      if (localStorage.chartBuffer) {
        dataobj = JSON.parse(localStorage.chartBuffer);
      }else{
        dataobj = this.chartData;
      }

          for (const u in dataobj) {
            let ln =  dataobj[u].labels.length;


            let scaler = parseInt((10/ln)*step,10);
            console.log("dbg", scaler, ln, step);
            if(scaler<2)  scaler = 2;
            this.maxdata[u] = ln;
            //let scaler = 2;
            for (const i in dataobj[u].datasets) {

              //    console.log("dramatic debug: ",scaler);
                  let sum = 0;
                  let hold = [];
                  for (let p = 0; p < ln; p++) {
                    if ( p % scaler !== 0) {
                      sum += parseFloat(dataobj[u].datasets[i].data[p],10);

                    //  if(p == scaler-1) console.log("selector:",selector, "step:", step, "selector+step:", selector+step, "ln", ln);
                    }else{

                      hold.push(sum/scaler);
                      sum = 0;
                    }
                  }
              //  console.log(hold);
                //dataobj[u].datasets[i].data.slice(0, dataobj[u].datasets[i].data.length);
                dataobj[u].datasets[i].data = hold;
              //  dataobj[u].datasets[i].data = dataobj[u].datasets[i].data.slice(0, selector);
                dataobj[u].datasets[i].data = dataobj[u].datasets[i].data.slice(selector, selector+step);
              }

              for (let f = 0; f < ln; f++) {
                if ( f % scaler !== 0 ) {
                  dataobj[u].labels.splice(f, scaler);
                 }
                }

          //  console.log("length before:", dataobj[u].labels.length);
            // dataobj[u].labels = dataobj[u].labels.slice(0, selector);
             dataobj[u].labels = dataobj[u].labels.slice(selector, selector+step);

        //    console.log("length after:", dataobj[u].labels.length)
            }

      this.chartData = dataobj;
      localStorage.chart_Time_Buffer = JSON.stringify(dataobj,getCircularReplacer());

    },
    getJSON: function() {
      data.orderByKey().once('value', snapshot => {
        const snapdata = snapshot.val();
        let compiled_json = [];
        for (const o in snapdata) {
        //  console.log(snapdata[o])
          compiled_json.push({
            timestamp  :snapdata[o].timestamp,
            temperature:snapdata[o].temperature,
            humidity   :snapdata[o].humidity,
            pressure   :snapdata[o].pressure,
            vibration  :snapdata[o].vibration,
            PM_1_0     :snapdata[o].PM_1_0,
            PM_2_5     :snapdata[o].PM_2_5,
            PM_10_0    :snapdata[o].PM_10_0,
            PPM_CO2    :snapdata[o].PPM_CO2,
          });
        }
        this.exporter = compiled_json;
      });
    },
    getChartData: function(opts,locally) {
      const readlimit  = opts.groupopts.limit;
      const readsample = opts.groupopts.sample;
      const axis       = opts.groupopts.axis;
      data.orderByKey().limitToLast(readlimit).once('value', snapshot => {

        const snapdata = snapshot.val();
        var compiled_object = {};
        for (const o in opts.groupdata) {
          var timelabels = [];
          var counter = 0;

          for (const i in snapdata) {
            counter+=1;

            let item = snapdata[i];
            if(counter%readsample==0){
              if(axis=="time")     timelabels.push(item.timestamp.split("T")[1].slice(0, -4));
              if(axis=="date")     timelabels.push(item.timestamp.split("T")[0]);
              if(axis=="datetime") timelabels.push(item.timestamp.split("T")[0].slice(5)+ " " + item.timestamp.split("T")[1].slice(0, -4));
              for (const u in opts.groupdata[o].datasets) {

                 const sname = opts.groupdata[o].datasets[u].sensor;
              //   console.log(o,snapdata[i],sname);
                 if (sname=="PPM_CO2"){
                   if(parseInt(item[sname],10)<250){
                     item[sname] = 400;
                   }
                 }
                 opts.groupdata[o].datasets[u].dlist.push((item[sname]).toFixed(3))
              }
            }
          }
          var chartdataset = [];
          for (const property in opts.groupdata[o].datasets) {
            const dataobj =  opts.groupdata[o].datasets[property];
            const set = {
              sname: dataobj.sensor,
              label: dataobj.label,
              borderColor: dataobj.color,
              borderWidth: 1,
              backgroundColor: dataobj.color.split(")")[0].slice(0, -1)+"0.1)",
              data: dataobj.dlist,
            }
            chartdataset.push(set);
          }
          var confObj= {
            labels: timelabels,
            datasets: chartdataset
          }
          compiled_object[o]= confObj;

          if(this.maxdata)this.maxdata[o]=confObj.labels.length

        }
        if(!this.loaded)this.loaded=true;
        if(locally){
          console.log("Object has been buffered",compiled_object);
          localStorage.chartBuffer = JSON.stringify(compiled_object,getCircularReplacer());
          this.buffered = true;
        }else{
          console.log("Object has been rendered directly");
          this.chartData = compiled_object;

        }
      });
    }
  }
}
