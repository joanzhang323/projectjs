/**
 * Created by sungmin on 11/13/16.
 */

/*
 *  NAME - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- ???
 */

PhysicalChart= function(_parentElement, _data, _metaData) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.metaData = _metaData;

    this.initVis();
}


/*
 *  Initialize visualization (static content, e.g. SVG area or axes)
 */

PhysicalChart.prototype.initVis = function() {
    var vis = this;


    vis.margin = { top: 50, right: 50, bottom: 50, left: 50 };

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
        return person.NEWRACE2 == 5 && (person.HEALTH2 != "-9") && (person.K6SCMON !="-9");
    });


    vis.wrangleData();
}


/*
 *  Data wrangling
 */

PhysicalChart.prototype.wrangleData = function() {
    var vis = this;

    // Returns the min. and max. value in a given array (= [6900,25000])
    var extent_overallHealth = d3.extent(vis.displayData, function(d) {
        return d.HEALTH2;
    });

    // Returns the min. and max. value in a given array (= [6900,25000])
    var extent_mentalHealth = d3.extent(vis.displayData, function(d) {
        return d.K6SCMON;
    });

    console.log(extent_overallHealth);
    console.log(extent_mentalHealth);

    var overallHealthScale = d3.scale.linear()
        .domain(extent_overallHealth)
        .range([0,vis.width]);


    var mentalHealthScale= d3.scale.linear()
        .domain(extent_mentalHealth)
        .range([vis.height, 0]);

    // Create a generic axis function
    var xAxis = d3.svg.axis();
    var yAxis = d3.svg.axis();

    // Pass in the scale function
    yAxis.scale(mentalHealthScale);
    xAxis.scale(overallHealthScale);

    // Specify orientation (top, bottom, left, right)
    xAxis.orient("bottom")
        .ticks(4)

    yAxis.orient("left")
        .ticks(4)

    var group = vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(xAxis)
        .append('text')
        .attr("class","axis-label")
        .attr('text-anchor', 'end')
        .attr("y", -15)
        .attr("x",vis.width)
        .attr("dy",".71em")
        .text('Overall Health Rating')

   vis.svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis)
        .append('text')
        .attr("class","axis-label")
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90), translate(-60,15)')
        .text('Mental Health Score');

    var padding = 10;

    //Compute Prevalence for Depression
    vis.overallHealthData = d3.nest()
        .key(function(d){return d.HEALTH2;})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);

    console.log(vis.overallHealthData);

    //Compute Prevalence for Depression
    vis.mentalHealthData = d3.nest()
        .key(function(d){return d.K6SCMON;})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);

    console.log(vis.mentalHealthData);

    console.log(vis.displayData);

    var circle = vis.svg.selectAll("circle")
        .data(vis.displayData)
        .enter()
        .append("circle")
        .attr("fill",function(d) {
            if (d.HEALTH2 == 1)
                return "#FDEDEC";
            else if (d.HEALTH2 == 2)
                return "#F5B7B1";
            else if (d.HEALTH2 == 3)
                return "#EC7063";
            else
                return "#943126";
            }
        )
        .attr("stroke","gray")
        .attr("stroke-width",1)
        .attr("r", function(d){
            return (d.K6SCMON/2);
        })
        .attr("cy", function(d){
            if (d.K6SCMON > 18) {
                var min = 0;
                var max = vis.height/4;
                return Math.random() * (max - min) + min;
            }
            else if (d.K6SCMON > 12 && d.K6SCMON <= 18) {
                var min = vis.height / 4;
                var max = 2 * vis.height/ 4;
                return Math.random() * (max - min) + min;
            }
            else if (d.K6SCMON > 6 && d.K6SCMON <= 12) {
                var min = 2*vis.height / 4;
                var max = 3* vis.height / 4;
                return Math.random() * (max - min) + min;
            }
            else
            {
                var min = 3*vis.height /4;
                var max = vis.height ;
                return Math.random() * (max - min) + min;
            }
        })
        .attr("cx", function(d){
            if (d.HEALTH2 == 1) {
                var min = 0;
                var max = vis.width/4;
                return Math.random() * (max - min) + min;
            }
            else if (d.HEALTH2 == 2) {
                var min = vis.width / 4;
                var max = 2 * vis.width / 4;
                return Math.random() * (max - min) + min;
            }
            else if (d.HEALTH2 == 3) {
                var min = 2*vis.width / 4;
                var max = 3* vis.width / 4;
                return Math.random() * (max - min) + min;
            }
            else
            {
                var min = 3*vis.width/4;
                var max = vis.width;
                return Math.random() * (max - min) + min;
            }
        })

    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */

PhysicalChart.prototype.updateVis = function() {
    var vis = this;

}
