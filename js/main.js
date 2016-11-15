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
    d3.csv("data/DataJS.csv", function(error, csvData) {
        if (!error) {
            allData = csvData;
            //console.log(allData);

            // Convert numeric values to 'numbers'
            allData.forEach(function(d) {
                for (var variable in d) { d[variable] = +d[variable];}
            });
            //console.log(allData);



            createVis();
        }
    });
}

function createVis() {

    // Instantiate Visualization
    aggregateChart = new AggregateChart("aggregate-chart", allData);

}