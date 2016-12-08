/**
 * Created by sungmin on 12/05/16.
 */

/*
 *  RacialComparison - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- data
 */

RacialComparison = function(_parentElement, _data, _meta) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.meta = _meta;
    this.filteredData = _data;

    this.initVis();
}


/*
 *  Initialize visualization
 */

RacialComparison.prototype.initVis = function() {
    var vis = this;

    vis.margin = { top: 20, right: 10, bottom: 20, left: 10 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 650 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.wrangleData();
}


/*
 *  Data wrangling
 */

RacialComparison.prototype.wrangleData = function() {
    var vis = this;
    var indexHeight = 6;

    // Initialize displayData;
    vis.displayData = [];

    /*
     * Find the percent of people with mental health issues for each race within the filtered population
     */
    // Add default AAPI object to vis.displayData
    var aapiDefault = {
        name: "AAPI",
        numMH: 0,
        percent: 0,
        total: 0,
        data: []
    };
    vis.displayData.push(aapiDefault);

    console.log(vis.filteredData.length);

    // Add up number of people with mental health and not
    var nestedByRace = d3.nest()
        .key(function (person) {return person.NEWRACE2; })
        .key(function (person) {return person.AMIYR_U; })
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.filteredData);
    console.log(nestedByRace);

    // Helper function to produce an array of n length of a number num
    function produceData (n) {
        var array = [];

        for (var i = 0; i < (n*indexHeight); i++) { array.push(1); }
        for (var j = 0; j < ((100*indexHeight) - (n*indexHeight)); j++) { array.push(0); }

        return array;
    }

    // Add to displayData the data on people with mental health in each racial group
    nestedByRace.forEach(function (race) {
        var objStorage = {};

        objStorage.name = vis.meta["NEWRACE2"][race.key];
        objStorage.numMH = 0;
        race.values.forEach(function (mhcode) {
            if (mhcode.key == "1") {
                objStorage.numMH = mhcode.values;
            }
        });
        objStorage.total = 0;
        for (var i = 0; i < race.values.length; i++) {
            objStorage.total += race.values[i].values;
        }
        objStorage.percent = objStorage.numMH/objStorage.total * 100;
        objStorage.data = produceData(Math.round(objStorage.percent));

        // If AA or PI, then add value to AAPI object as well
        if (race.key >= 5) {
            vis.displayData[0].numMH += objStorage.numMH;
            vis.displayData[0].total += objStorage.total;
        }

        vis.displayData.push(objStorage);
    });


    // Update AAPI object info
    vis.displayData[0].percent = vis.displayData[0].numMH/vis.displayData[0].total * 100;
    vis.displayData[0].data = produceData(Math.round(vis.displayData[0].percent));
    // Debug - console.log(vis.displayData);



    // Update the visualization
    vis.updateVis();
}


/*
 *  The drawing function
 */

RacialComparison.prototype.updateVis = function() {
    var vis = this;
    var radius = 5,
        circlesPerRow = 10,
        circlesPerColumn = 60,
        spaceBetweenCharts = radius * circlesPerRow * 2.5,
        numOfCharts = vis.displayData.length;

/*
    // If AAPi button is not pressed, then display only AAPI. Else, display, AAPI, AA, and PI.
    var objToRemove = [];
    var objRemoved = [];

    if (counterAAPIButton == 0) {
        vis.displayData.forEach(function (race, index) {
            if ((race.name == "Asian American") || (race.name == "Pacific Islander")) {
                objToRemove.push(index);
            }
        });

        objToRemove.reverse().forEach(function (code) {
            objRemoved.push(vis.displayData.splice(code,1));
        });
    }
*/

    // Append group-elements for the visualizations for each race
    var raceChart = vis.svg.selectAll(".raceChart")
        .data(vis.displayData, function(race){ return race.name; });

    var raceChartEnter = raceChart.enter().append("g")
        .attr("class", "raceChart");

    raceChart.exit().remove();

    raceChart
        .transition()
        .duration(1500)
        .attr("transform", function (d, index) {
            return "translate(" + (index * spaceBetweenCharts) + ",0)";
        });

    // Append group-elements for each cell in race chart
    var raceCircle = raceChart.selectAll(".raceCircle")
        .data(function(d) { return d.data; });

    raceCircle.enter().append("circle")
        .attr("class", "raceCircle")
        .attr("opacity", 0.5)
        .attr("r", radius);

    raceCircle.exit().remove();

    raceCircle
        .transition()
        .duration(1500)
        .attr("cy", function (d, index) { return vis.height - Math.floor((index/circlesPerRow))*2*radius - radius; })
        .attr("cx", function (d, index) { return index%circlesPerRow*2*radius + radius; })
        .attr("fill", function (d) { if (d == 1) { return "lightgreen"} else {return "gray"} });
        //.on("mouseover", function(d) {})
        //on("mouseout", function(d) {});

    // Append labels
    var raceLabel = raceChartEnter.append("text")
        .attr("class", "raceLabel");

    raceChart.select(".raceLabel")
        .text(function (d) { return d.name; })
        .attr("text-anchor", "middle")
        .attr("y", vis.height + 15)
        .attr("x", radius*circlesPerRow);

/*
    // Add AA and PI back if removed earlier
    objRemoved.forEach(function (obj) { vis.displayData.push(obj[0]); });
*/


    // Append line to indicate national mental health line
    var natMH = vis.svg.selectAll(".natMH")
        .data([nationalMHAvg]);

    var natMHEnter = natMH.enter().append("g")
        .attr("class", "natMH");

    natMH.exit().remove();

    var natMHLine = natMHEnter.append("line")
        .attr("class", "natMHLine")
        .attr("x1", 0)
        .attr("y1", vis.height)
        .attr("y2", vis.height)
        .attr("stroke-width", 2)
        .attr("stroke", "black");

    natMH.select(".natMHLine")
        .attr("x2", spaceBetweenCharts*numOfCharts)
        .attr("transform", function (d) {
            return "translate(0," + (-1*vis.height*d) + ")";
        });


    var natMHLineLabel = natMHEnter.append("text")
        .attr("class", "natMHLineLabel");

    natMHLine.select(".natMHLineLabel")
        .attr("x", spaceBetweenCharts*numOfCharts + 7)
        .attr("y", function (d) { return vis.height - vis.height*d + 5; })
        .text(function (d) { return "National Average: " + (d*100).toFixed(2) + "%";});

}


/*
 *  Function when selection changed, so update visualization
 */

RacialComparison.prototype.onSelectionChange = function(checked) {
    var vis = this;

    console.log(checked);

    /*
     * Debug
     *
    var testing = d3.nest()
        .key(function (d) {return d.EDUCCAT2})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.data);

    console.log(testing);
    */

    // Filter data for checked selections
    vis.filteredData = vis.data.filter(function(person) {
        var variables = [
            ["IRSEX", "genderCheckBox", false],
            ["EDUCCAT2", "educationCheckBox", false],
            ["IRFAMIN3", "incomeCheckBox", false],
            ["AGECAT", "ageSlider", false]
        ];

        for (var i = 0; i < variables.length; i++) {
            if (checked.hasOwnProperty(variables[i][1])) {
                checked[variables[i][1]].forEach(function (d) {
                    variables[i][2] = (variables[i][2] || (person[variables[i][0]] == d));
                });
            } else {
                variables[i][2] = true;
                //console.log(person.AGECAT);
            }
        }

        var boolTotal = variables.reduce(function(a, b) { return a && b[2]; }, true);

        return boolTotal;
    });

    /*
     * Debug
     *
    var testing = d3.nest()
        .key(function (d) {return d.EDUCCAT2})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.filteredData);

    console.log(testing);
    */

    /* Optional - decide
    // If no data for selections, then display error dialog
    if (vis.filteredData.length == 0) {
        $("#dialogRacialComparison").removeClass("hidden");
    }
    */

    vis.wrangleData();
}
