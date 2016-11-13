/**
 * Created by sungmin on 9/20/16.
 */

var allData = [];

// Variable for the visualization instance
var aggregateChart;

// Start application by loading the data
loadData();


function loadData() {

}

function createVis() {

    // Instantiate Visualization
    aggregateChart = new StationMap("station-map", allData, [42.360082, -71.058880]);

}