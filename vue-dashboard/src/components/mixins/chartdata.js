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

      const shot = snapshot.val()[Object.keys(snapshot.val())[0]];
       for (const property in chartoptions.groupdata) {
        updated[property].labels.push(shot.timestamp.split("T")[1].slice(0, -4));
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

      
      const dataobj = JSON.parse(localStorage.chartBuffer);

      for (const sc in scaler) {
        if(init=="init"){
          scaler[sc] = 0;
        }else{
          for (const u in dataobj) {
            for (const i in dataobj[u]) {
              for (const o in dataobj[u][i]) {
                if(dataobj[u][i][o].sname==sc){
                  const max = Math.max(...dataobj[u][i][o].data),
                        min = Math.min(...dataobj[u][i][o].data),
                        delta = max-min;
                  console.log(max,min,delta);
                  for (var p = 0; p < dataobj[u][i][o].data.length; p++) {
                    if(scaler[sc]>1){
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
        }
      }
      this.chartData = dataobj;

    },
    getChartData: function(opts) {
      const readlimit  = opts.groupopts.limit;
      const readsample = opts.groupopts.sample;
      data.orderByKey().limitToLast(readlimit).once('value', snapshot => {

        const snapdata = snapshot.val();
        var compiled_object = {};
        for (const o in opts.groupdata) {
          var timelabels = [];
          var counter = 0;

          for (const i in snapdata) {
            counter+=1;
            const item = snapdata[i];
            if(counter%readsample==0){
              timelabels.push(item.timestamp.split("T")[1].slice(0, -4));
              for (const u in opts.groupdata[o].datasets) {
                 const sname = opts.groupdata[o].datasets[u].sensor;
                 if (sname=="PPM_CO2"){
                   if(item[sname]<200){
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
        }
        console.log("LOG ",compiled_object);
        this.chartData = compiled_object;
        if(this.saveLocally){
          localStorage.chartBuffer = JSON.stringify(compiled_object,getCircularReplacer());
        }
      });
    }
  }
}
