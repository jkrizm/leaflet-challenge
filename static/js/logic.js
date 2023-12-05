let geojsonurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Performing a GET request to the geojson url/
d3.json(geojsonurl).then(function (data) {
    console.log(data)
    // sending the data.features object to the createFeatures function.
    createFeatures(data.features);
});




// get the features and assign them to the appropriate metrics (e.g., depth to color)
function createFeatures(earthquakeData) {


  // Set marker color by earthquake depth so deeper ones have darker markers
  function setMarkerColor(depth){
    if (depth<11){
      color = "#eddcf2";
    }
    else if(depth<31){
      color = "#cabccf";
    }
    else if(depth<51){
      color = "#a396a8";
    }
    else if(depth<71){
      color = "#726875";
    }
    else if(depth<91){
      color = "#504952";
    }
    else {
      color = "#161517";
    }
    return color;
  }
 

  // make geojson layer with the earthquake data and bind popup
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p><b>Magnitude:</b> ${feature.properties.mag}; <b>Depth:</b> ${feature.geometry.coordinates[2]} Km</p>`);
    },
    pointToLayer: function(feature, coords) {
      
      var setMarkerOptions = {
        radius: (feature.properties.mag)*2.25,
        fillColor: setMarkerColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "gray",
        weight: 1,
        opacity: 1
      };

      return L.circleMarker(coords, setMarkerOptions);
      
    }
  })
  
   
  // send earthquake layer
  createMap(earthquakes);
  

 
  //createMap function
  function createMap(earthquakes) {
    // Creating the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

  
    // Creating a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
 
    // Defining a map object.
    let myMap = L.map("map", {
      center: [10.9330, -21.5133],
      zoom: 2.5,
      layers: [
        street, 
        earthquakes
      ]
    });
  
    // creating the legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend")
      let depth = [5, 11, 31, 51, 71, 91];
      let labels =['<10', '10-29', '30-49', '50-69', '70-89', '90+' ];
      // set the legend colors by depth
      function setLegendColor(depth){
        if (depth<11){
          color = "#fbedff";
        }
        else if(depth<31){
          color = "#c7bacc";
        }
        else if(depth<51){
          color = "#a396a8";
        }
        else if(depth<71){
          color = "#726875";
        }
        else if(depth<91){
          color = "#504952";
        }
        else {
          color = "#161517";
        }
        return color;
      }
      div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
       
      // loop to make square and depth label corresponding to depth colors defined for markers
      for (var i = 0; i < depth.length; i++) {
        console.log(depth[i])
        div.innerHTML +=
            '<p style="font-size: 14px; padding: 0px; margin: 0px;"><i style="background-color:' + setLegendColor(depth[i]) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            labels[i]+ '</p>';
      }

      return div;
    };

    legend.addTo(myMap);

  }}