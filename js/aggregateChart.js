/**
 * Created by sungmin on 11/13/16.
 */


/*
 *  AggregateChart - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- ???
 */

AggregateChart = function(_parentElement, _data, _metaData) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.metaData = _metaData;

    this.initVis();
}


/*
 *  Initialize visualization (static content, e.g. SVG area or axes)
 */

AggregateChart.prototype.initVis = function() {
    var vis = this;

    // Total number of Asian Americans between ages 18 and 23
    vis.totalPopulation = vis.data.length;


    // Margins, width, height
    vis.margin = { top: 30, right: 30, bottom: 50, left: 60 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 525 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // Y-Axis
    var y = d3.scale.linear()
        .domain([0, vis.totalPopulation + 10])
        .range([vis.height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickPadding(10)
        .ticks(5)
        .tickValues([100,200,300,400,500]);

    vis.svg.append("g")
        .attr("class", "y-axis axis")
        .call(yAxis);

    vis.svg.append("text")
        .attr("class", "axis-title")
        .attr("x", 0)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + -50 + ", " + vis.height/2 +")rotate(-90)")
        .text("Total number of College-Aged Asian Americans");


    // X-axis
    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, 100]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickPadding(10)
        .ticks(4)
        .tickValues([.25,.50,.75,1])
        .tickFormat(d3.format(".0%"));

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(xAxis);


    vis.wrangleData();
}


/*
 *  Data wrangling
 */

AggregateChart.prototype.wrangleData = function() {
    var vis = this;


    // Filtered number of Asian Americans between ages 18 and 23
    vis.filteredPopulation = vis.displayData.length;


    // Sort data for mental illness - yes mental illness to no mental illness
    vis.displayData.sort(function (a,b) { return b.AMIYR_U - a.AMIYR_U });


    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */

AggregateChart.prototype.updateVis = function() {
    var vis = this;

    // Initialize variables

    var circlesPerRow = 10,
        circlesPerColumn = Math.floor(vis.filteredPopulation/circlesPerRow),
        radius = (vis.height * (vis.filteredPopulation/vis.totalPopulation))/circlesPerColumn/2;


    // Add circles to chart
    var circles = vis.svg.selectAll(".aggregateCircles").data(vis.displayData);

    circles.enter().append("circle")
        .attr("class", "aggregateCircles")
        .attr("opacity", 0.5);

    circles.exit().remove();

    circles
        .transition()
        .duration(1000)
        .attr("cy", function (d, index) { return vis.height - (index%circlesPerColumn)*2*radius - radius; })
        .attr("cx", function (d, index) { return Math.floor(index/circlesPerColumn)*2*radius + radius; })
        .attr("r", radius)
        .attr("fill", function (person) { if (person.AMIYR_U == 1) { return "red"} else {return "gray"} });
}

AggregateChart.prototype.onSelectionChange = function (checked) {
    var vis = this;


    // Filter data for checked selections
    vis.displayData = vis.data.filter(function(person) {
        var gender = false,
            age = false;

        if (checked.hasOwnProperty("genderCheckBox")) {
            checked.genderCheckBox.forEach(function (d) {
                gender = (gender || (person.IRSEX == d));
            });
        } else {
            gender = true;
        }

        if (checked.hasOwnProperty("ageCheckBox")) {
            checked.ageCheckBox.forEach(function (d) {
                age = (age || (person.AGE2 == d));
            });
        } else {
            age = true;
        }

        return age && gender;
    });


    vis.wrangleData();
}

