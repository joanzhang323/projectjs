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

    vis.margin = { top: 10, right: 10, bottom: 10, left: 10 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 525 - vis.margin.top - vis.margin.bottom;

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

AggregateChart.prototype.wrangleData = function() {
    var vis = this;


    /*
     // Filter data for Asians
     vis.displayData = vis.data.filter(function (person) {
     return person.NEWRACE2 == 5;
     });
     */


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

    // Add circles to chart
    var circles = vis.svg.selectAll(".aggregateCircles").data(vis.displayData);

    var circlesPerRow = 10;
    var radius = 5;

    circles.enter().append("circle")
        .attr("class", "aggregateCircles")
        .attr("cx", function (d, index) { return (index%circlesPerRow)*2*radius + radius; })
        .attr("cy", function (d, index) { return vis.height - Math.floor(index/circlesPerRow)*2*radius + radius; })
        .attr("r", radius)
        .attr("fill", function (person) { if (person.AMIYR_U == 1) { return "red"} else {return "gray"} })
        .attr("opacity", 0.5);

    circles.exit().remove();

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

