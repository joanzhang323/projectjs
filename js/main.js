/**
 * Created by sungmin on 9/20/16.
 */

var allData = [];


// Variable for the visualization instance
var racialComparison;
var codeBook;


// Counter for AAPI Button
var counterAAPIButton = 0;


// Load data asynchronously
queue()
    .defer(d3.csv,"data/DataJS.csv")
    .defer(d3.json,"data/code.json")
    .await(createVis);


function createVis(error, mainData, metaData) {
    if (error) { console.log(error); }

    // Remove participants of mixed race backgrounds
    allData = mainData.filter(function (person) { return (person.NEWRACE2 !== "6"); });

    // Clean data
    allData.forEach(function(person) {
        // Recode in NEWRACE2 Hispanic as 4 and Pacific Islander as 6
        switch (person.NEWRACE2) {
            case "7":
                person.NEWRACE2 = "4";
                break;
            case "4":
                person.NEWRACE2 = "6";
        }

        // Convert numeric values to 'numbers'
        for (var variable in person) { person[variable] = +person[variable];}

        // Add new racial category (combine AA and PI),
        if (person.NEWRACE2 < 6) {
            person.RACEGRP = person.NEWRACE2;
        } else {
            person.RACEGRP = 5;
        }
        //Debug - console.log("newrace2: " + person.NEWRACE2 + " racegrp: " + person.RACEGRP);

        // Create new age category
        if (person.AGE2 <= 6) {
            person.AGECAT = 1;
        } else if ((person.AGE2 >= 7) && (person.AGE2 <= 11)) {
            person.AGECAT = 2;
        } else if ((person.AGE2 == 12) || (person.AGE2 == 13)) {
            person.AGECAT = 3;
        } else if (person.AGE2 >= 14) {
            person.AGECAT = person.AGE2 - 10;
        }

    });
    // Debug - console.log(allData);


    // Assign code data to codeBook
    codeBook = metaData;


    // Instantiate Visualization
    racialComparison = new RacialComparison("racialComparison", allData, metaData);

}



/*
 * Filters - Age slider
 * Borrowed and modified from https://www.youtube.com/watch?v=reNLCuaxFF8
 */
$("#sliderAge").slider({
    range: true,
    min: 18,
    max: 100,
    values: [18, 100],
    slide: function (event, ui) {
        $("#rangeSlider").html(ui.values[0] + " - " + ui.values[1] + " Years");
    },
    stop: function (event, ui) {
        $("#rangeSlider").on("sliderchange", selectionChanged());
    }
});

$("#rangeSlider")
    .html($("#sliderAge").slider("values", 0) + " - " + $( "#sliderAge").slider("values", 1) + " Years");



/*
 * Get values from checkboxes
 * Borrowed and modified from http://www.dyn-web.com/tutorials/forms/checkbox/group.php
*/
function selectionChanged () {

    // get reference to checkboxes
    var filters = $("#filtersRacialComparison input");
    console.log(filters);

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

    // Add age filters
    var ageCodes = [];
    var minAge = $("#sliderAge").slider("values", 0);
    var maxAge = $("#sliderAge").slider("values", 1);
    var minAgeCode = 1;
    var maxAgeCode = 7;
    var filteredAgeCodes = [];
    for (var code in codeBook["AGECAT"]["code"]) { ageCodes.push(codeBook["AGECAT"]["code"][code]); }
    for (var j = 0; j < ageCodes.length; j++) {
        if ((ageCodes[j][0] <= minAge) && (ageCodes[j][1] >= minAge)) {
            minAgeCode = j+1;
            break;
        }
    }
    for (j; j < ageCodes.length; j++) {
        if ((ageCodes[j][0] <= maxAge) && (ageCodes[j][1] >= maxAge)) {
            maxAgeCode = j+1;
            break;
        }
    }
    for (var k = minAgeCode; k <= maxAgeCode; k++) {
        filteredAgeCodes.push(k);
    }
    checked.ageSlider = filteredAgeCodes;


    console.log(checked);


    // Update visualizations
    racialComparison.onSelectionChange(checked);
}



/*
 * Filter for AAPI button
 */
function buttonChanged () {
    // Update counter
    if (counterAAPIButton == 0) { counterAAPIButton = 1; } else { counterAAPIButton = 0; }
    console.log(counterAAPIButton);

    // Update visualizations
    racialComparison.updateVis();
}