
    require([ "esri/Map",
      "esri/views/MapView",
      "esri/widgets/Sketch",
      "esri/layers/GraphicsLayer",
      "vue",
      "esri/geometry/geometryEngine"], (
        Map,
        MapView,
        Sketch,
        GraphicsLayer,
        Vue,
        geometryEngine
      ) => {
        const gLayer = new GraphicsLayer();
        const map = new Map({
            basemap: "topo-vector",
            layers: [gLayer]
        });
  
        const mapView = new MapView({
          container: "viewDiv",
          map: map,
          center: [-96.883923635, 30.9685011535],
          zoom: 9
        });

        const sketch = new Sketch({
          view: mapView,
          layer: gLayer,     
        });

        mapView.when(() => {
          const info = new Vue({
            el: "#mileage",
            components: {bbutton: "b-button"},
            data: 
              {
                addButton: 'Add Road',
                countyTotal: 120999,
                previousTotal: 0,
                lineLength: {},
                editType: "New Roadbed",
                county: "Tejas",
                username: "DPROSACK",
                newMiles: ''
                

              },
            methods:{
              complete: function (){
                sketch.create("polyline",{mode:"click", hasZ: false})
                sketch.on('create', (event) => {
                  if(event.state === "complete"){
                    console.log("This is the previous total length: ",this.previousTotal)
                    let lengthMiles = geometryEngine.geodesicLength(event.graphic.geometry, "miles")
                    console.log("This is the current line length: ", parseFloat(lengthMiles.toFixed(3)));
                    Vue.set(info.lineLength, 'length', this.previousTotal += parseFloat(lengthMiles.toFixed(3)))
                    Vue.set(info.lineLength, 'info', "created")   
                  }
                });
              }
            },
            watch:{
              previousTotal: function(x,y){
                sketch.on('update', (event) => {
                  if(event.state === "start"){
                    oldlengthMile = geometryEngine.geodesicLength(event.graphics[0].geometry, "miles")
                  }
                  let newlengthMiles;
                  if(event.state === "complete"){
                    newlengthMiles = geometryEngine.geodesicLength(event.graphics[0].geometry, "miles")
                  }

                  console.log(oldlengthMile,newlengthMiles)
                  deltaLength = oldlengthMile - newlengthMiles
                  console.log(Math.abs(deltaLength));
                  
                  if(oldlengthMile < newlengthMiles){
                    Vue.set(info.lineLength, 'length', this.previousTotal += Math.abs(parseFloat(deltaLength.toFixed(3))))
                    console.log('add')
                    Vue.set(info.lineLength, 'info', "updated")  
                  }
                  else if (oldlengthMile > newlengthMiles){
                    Vue.set(info.lineLength, 'length', this.previousTotal -= Math.abs(parseFloat(deltaLength.toFixed(3))))
                    console.log('subtract')
                    Vue.set(info.lineLength, 'info', "updated")  
                  }
               });
                console.log("new: ",x, "old: ",y)
              }
            },
          });
        });
    });
