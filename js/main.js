/**
 * Created by sungmin on 9/20/16.
 */

var allData = [];

// Variable for the visualization instance
var aggregateChart;


// Load data asynchronously
queue()
    .defer(d3.csv,"data/DataJS.csv")
    .defer(d3.json,"data/code.json")
    .await(createVis);


function createVis(error, mainData, metaData) {
    if (error) { console.log(error); }

    allData = mainData;

    // Convert numeric values to 'numbers'
    allData.forEach(function(d) {
        for (var variable in d) { d[variable] = +d[variable];}
    });
    //console.log(allData);


    // Instantiate Visualization
    aggregateChart = new AggregateChart("aggregate-chart", allData, metaData);

}

