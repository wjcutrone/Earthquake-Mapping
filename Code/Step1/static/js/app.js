//Store API endpoint inside variable queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

//Perform a GET request to the queryURL
d3.json(queryURL, function(data) {
    createFeatures(data.features);

    function formatCircles(feature) {
        var geojsonMarkerOptions = {
            opacity: 1,
            color: "#FFFFFF",
            fillColor: setColor(feature.geometry.coordinates[2]),
            radius: setRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5,
            type: "Circle"
        };
        var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
        // console.log(feature);
        console.log(feature.geometry.coordinates);
        var marker =  L.circleMarker(latlng, geojsonMarkerOptions);
        marker.bindPopup("<h3>Location: "+feature.properties.place+"</h3><hr><h3>Magnitude: "
                            +feature.properties.mag+"</h3>");
        return marker;
    }

    var max = data.features[0]
    var min = data.features[0]

    data.features.forEach((feature) => {
        var current = feature.geometry.coordinates[2];
        if(current < min.geometry.coordinates[2]) min = feature;
        if(current > max.geometry.coordinates[2]) max = feature;
    })

    var upperThreshold = max.geometry.coordinates[2];
    var lowerThreshold = min.geometry.coordinates[2];

    var midThreshold = (upperThreshold - lowerThreshold) / 2;
    var upperQuartile = (upperThreshold - midThreshold) / 2;
    var lowerQuartile = (midThreshold - lowerThreshold) / 2;

    function setColor(depth) {
        switch (true) {
            case depth > 70:
              return "#FF0000";
            case depth >40:
                return "#00FF00";
            case depth > 25:
                return "#0000FF";
            default:
                return "#000000";
        }
    }

    function setRadius(mag) {
        return mag * 5;
    }

// });

//Build function createFeatures function
function createFeatures(earthquakeData) {


    //Assign each feature a popup describing time and place of earthquake
    // function onEachFeature(feature, layer) {
    //     layer.bindPopup("<h3>Location: "+feature.properties.place+"</h3><hr><h3>Time: "
    //                     +feature.properties.time+"</h3>")
    // };
    // console.log(earthquakeData);
    //Create earthquakedata object, and run the onEachFeature function
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: formatCircles
    });

    //Send the earthquake layer into a createMap function
    createMap(earthquakes)

};

//CreateMap function
function createMap(earthquakes) {

    //Background Layer
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

    //Define baseMaps
    var baseMaps = {
        "Light Map": lightMap
    };

    //Create overlay object to hold the overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    //Render Map in browser window
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [lightMap, earthquakes]
    });

    //Create layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({
        position: "bottomleft"
    });

    legend.onAdd = function(map){
        var div = L.DomUtil.create("div", "info legend");
        var labels = ["<strong>Depth</strong>"];
        var categories = [">70", ">40",">25", "<=25"];
        var colors = ["#FF0000", "#00FF00", "#0000FF", "#000000"]
        for(var i=0; i < categories.length; i++) {
            div.innerHTML += labels.push('<div class="circle" style="background-color: ' + colors[i] + '"></div><span class="cat">  ' + categories[i] + '</span>')
        }
        div.innerHTML = labels.join("<br>");
        return div;
    }

    legend.addTo(myMap);
}

});