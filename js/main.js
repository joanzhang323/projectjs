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


    // Mine data for ages 18-23 and for Asians
    allData = mainData.filter(function(d) {
        if (d.NEWRACE2 == "5") {
            for (var i = 7; i < 12; i++) {
                if (d.AGE2 == i) { return true; }
            }
            return false;
        } else {
            return false;
        }
    });

    // Convert numeric values to 'numbers'
    allData.forEach(function(d) {
        for (var variable in d) { d[variable] = +d[variable];}
    });

    //console.log(allData);


    // Instantiate Visualization
    aggregateChart = new AggregateChart("aggregate-chart", allData, metaData);

}

/*
 * Get values from checkboxes
 * Borrowed and modified from http://www.dyn-web.com/tutorials/forms/checkbox/group.php
 */
function selectionChanged () {
    // get reference to checkboxes
    var filters = $("#filters input");

    // object of arrays storing the checked Check Box values
    var checked = {};

    // Check if a check box is checked. If checked, then add values to the object called checked
    for (var i = 0 ; i < filters.length; i++) {
        if (( filters[i].type === 'checkbox' ) && (filters[i].checked)){
            // if a filter already exists as property in checked, then add to it. Else, create new property and add the value.
            if (checked.hasOwnProperty(filters[i].className)) {
                checked[filters[i].className].push(+filters[i].value);
            } else {
                checked[filters[i].className] = [+filters[i].value];
            }
        }
    }

    console.log(checked);


    // Update visualizations
    aggregateChart.onSelectionChange(checked);
    individualChart.onSelectionChange(checked);

}

function intervene (value) {

    suicideChart.onSelectionChange(value);
}
