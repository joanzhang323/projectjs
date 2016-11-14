/**
 * Created by sungmin on 9/20/16.
 */

var allData = [];

// Variable for the visualization instance
var aggregateChart;

// Start application by loading the data
loadData();


function loadData() {

    // For test.csv
    d3.json("data/test.csv", function(error, jsonData) {
        if (!error) {
            allData = jsonData;

            console.log(allData);


        }
    });

}

function createVis() {

    // Instantiate Visualization
    aggregateChart = new StationMap("station-map", allData, [42.360082, -71.058880]);

}