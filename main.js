
let mainFunc = () => {
    require([ "esri/Map",
      "esri/views/MapView",
      "esri/widgets/Sketch",
      "esri/layers/GraphicsLayer",
      "esri/geometry/Polyline",
      "vue",
      "esri/geometry/geometryEngine"], (
        Map,
        MapView,
        Sketch,
        GraphicsLayer,
        Polyline, 
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
            data: 
              {
                addButton: 'Add Road',
                countyTotal: 120999,
                previousTotal: 0,
                lineLength: {},
                editType: "New Roadbed",

              },
            methods:{
              status: function (){
                sketch.create("polyline",{mode:"click", hasZ: true})
                sketch.on('create', (event) => {
                  let newLength;
                  if(event.state === "complete"){
                    newline = new Polyline ({
                      paths: event.graphic.geometry.paths
                    });
                    console.log("This is the previous total length: ",this.previousTotal)
                    let lengthMiles = geometryEngine.geodesicLength(newline, "miles")
                    newLength = lengthMiles;
                    console.log("This is the current line length: ", parseFloat(lengthMiles.toFixed(3)));
                    Vue.set(info.lineLength, 'length', this.previousTotal += parseFloat(newLength.toFixed(3)))
                    
                  }
                });
              },
            },
            
          });
        });
    });
}
