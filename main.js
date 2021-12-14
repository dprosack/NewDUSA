    
    require([ "esri/Map",
      "esri/views/MapView",
      "esri/widgets/Sketch",
      "esri/layers/GraphicsLayer",
      "vue",
      "vuetify",
      "esri/geometry/geometryEngine"], (
        Map,
        MapView,
        Sketch,
        GraphicsLayer,
        Vue,
        Vuetify,
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

        //mapView.when(() => {
          Vue.use(Vuetify);
          // const nav = new Vue({
          //   el:"#nav",
          //   data: 
          //   {
          //     test: "some text"
          //   }

          // });
          const info = new Vue({
            el: "#mileage",
            //components: {bbutton: "b-button"},
            data: 
              {
                addButton: 'Add Road',
                countyTotal: 120999,
                previousTotal: 0,
                lineLength: {},
                editType: "New Roadbed",
                county: "Tejas",
                username: "DPROSACK",
                newMiles: '',
                result: 0,
                dialog: false,
                // isSidebarOpen: true

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
                  }
                });
              },
              openDialog: function(){
                return this.dialog = false;
              }
              
            },
            watch:{
              previousTotal: function(x,y){
                sketch.on('update', (event) => {
                  if(event.state === "start"){
                    oldlengthMile = geometryEngine.geodesicLength(event.graphics[0].geometry, "miles")
                  }
                  if(event.state === "complete"){
                    let newlengthMiles = geometryEngine.geodesicLength(event.graphics[0].geometry, "miles")
                    deltaLength = oldlengthMile - newlengthMiles
    
                    if(newlengthMiles > oldlengthMile){
                      Vue.set(info.lineLength, 'length', this.previousTotal += parseFloat(deltaLength.toFixed(3)))
                    }
                    else{
                      Vue.set(info.lineLength, 'length', this.previousTotal -= parseFloat(deltaLength.toFixed(3)))
                    }
                  }
               })
                console.log("new: ",x, "old: ",y)
              }
            },
          });
          
          
          console.log(Vuetify);
        //});
    });
