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
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // Filter data for Asians
    vis.displayData = vis.data.filter(function (person) {
        return person.NEWRACE2 == 5;
    });


    vis.wrangleData();
}


/*
 *  Data wrangling
 */

AggregateChart.prototype.wrangleData = function() {
    var vis = this;

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

    var circlesPerRow = Math.ceil(Math.sqrt(vis.displayData.length));
    var radius = vis.height/(circlesPerRow*2);

    circles.enter().append("circle")
        .attr("class", "aggregateCircles")
        .attr("cy", function (d, index) { return (index%circlesPerRow)*2*radius + radius; })
        .attr("cx", function (d, index) { return Math.floor(index/circlesPerRow)*2*radius + radius; })
        .attr("r", radius)
        .attr("fill", "gray")
        .attr("opacity", 0.5);

    circles.exit().remove();

    // User filtering
    $("#ageFilter").change(function() {
        $("select option:selected").each(function(d) {
            var option = $(this).text();

            console.log(option);

            circles.attr("fill", function(person) {
                var age = person["AGE2"];

                if (vis.metaData["AGE2"]["code"][age] == option) {
                    return "green";
                }
            })
        });
    });


}

