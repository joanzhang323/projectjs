/**
 * Created by sungmin on 11/13/16.
 */


/*
 *  AggregateChart - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- ???
 */

AggregateChart = function(_parentElement, _data) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
}


/*
 *  Initialize visualization (static content, e.g. SVG area or axes)
 */

AggregateChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = { top: 10, right: 10, bottom: 10, left: 200 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    /*
    // Add the border of chart
    vis.svg.append("rect")
        .attr("id", "aggregateChartBorder")
        .attr("width", vis.height)
        .attr("height", vis.height);
    */

    vis.wrangleData();
}


/*
 *  Data wrangling
 */

AggregateChart.prototype.wrangleData = function() {
    var vis = this;

    // Filter for Asians


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
        .attr("cy", function (d) { return ((d.CASEID - 1)%circlesPerRow)*2*radius + radius; })
        .attr("cx", function (d) { return Math.floor((d.CASEID - 1)/circlesPerRow)*2*radius + radius; })
        .attr("r", radius)
        .attr("fill", "gray");

    circles.exit().remove();


}
