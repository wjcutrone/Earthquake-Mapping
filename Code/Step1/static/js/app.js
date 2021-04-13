//Store API endpoint inside variable queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

//Perform a GET request to the queryURL
d3.json(queryURL, function(data) {
    createFeatures(data.features);
});

//Build function createFeatures function
function createFeatures(earthquakeData) {

    //Assign each feature a popup describing time and place of earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Location: "+feature.properties.place+"</h3><hr><h3>Time: "
                        +feature.properties.time+"</h3>")
    };

    //Create earthquakedata object, and run the onEachFeature function
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
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

}