/**
 * Created by sungmin on 11/13/16.
 */

/*
 *  NAME - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- ???
 */

SuicideChart =  function(_parentElement, _data, _metaData) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.metaData = _metaData;

    this.initVis();
};



/*
 *  Initialize visualization (static content, e.g. SVG area or axes)
 */

SuicideChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = { top: 10, right: 10, bottom: 30, left: 50 };

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

SuicideChart.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData_SuicideThink = vis.data.filter(function (person) {
        return person.MHSUITHK == 1;
    });
    vis.displayData_SuicidePlan = vis.data.filter(function (person) {
        return person.MHSUIPLN == 1;
    });
    vis.displayData_SuicideAttempt = vis.data.filter(function (person) {
        return person.MHSUITRY == 1;
    });



    // Sort data for mental illness - yes mental illness to no mental illness
    vis.displayData_SuicideThink.sort(function (a,b) { return b.MHSUIPLN - a.MHSUIPLN });

    // Sort data for mental illness - yes mental illness to no mental illness
    //vis.displayData_SuicideThink.sort(function (a,b) { return b.MHSUITRY - a.MHSUITRY });

    // Currently no data wrangling/filtering needed
    // vis.displayData = vis.data;

    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */

SuicideChart.prototype.updateVis = function() {
    var vis = this;

    console.log(vis.displayData_SuicideThink);
    console.log(vis.displayData_SuicidePlan);
    console.log(vis.displayData_SuicideAttempt);

    // Add circles to chart
    vis.cells = vis.svg.selectAll(".suicideCells")
        .data(vis.displayData_SuicideThink);

    var circlesPerRow = 7;
    var radius = 10;

   vis.cells.enter().append("rect")
        .attr("class", "suicideCells")
        .attr("x", function (d, index) { return (index%circlesPerRow)*2*radius + radius; })
        .attr("y", function (d, index) { return Math.floor(index/circlesPerRow)*2*radius + radius; })
        .attr("width", 10)
        .attr("height",10)
        .attr("fill", "red")
        .attr("opacity", 0.2);

    // Add circles to chart
    vis.cells2 = vis.svg.selectAll(".suicideCells2")
        .data(vis.displayData_SuicidePlan);

    vis.cells2.enter().append("rect")
        .attr("class", "suicideCells2")
        .attr("x", function (d, index) { return 200+(index%circlesPerRow)*2*radius + radius; })
        .attr("y", function (d, index) { return Math.floor(index/circlesPerRow)*2*radius + radius; })
        .attr("width", 10)
        .attr("height",10)
        .attr("fill", "red")
        .attr("opacity", 0.5);


    // Add circles to chart
    vis.cells3 = vis.svg.selectAll(".suicideCells3")
        .data(vis.displayData_SuicideAttempt);

    vis.cells3.enter().append("rect")
        .attr("class", "suicideCells3")
        .attr("x", function (d, index) { return 400+(index%circlesPerRow)*2*radius + radius; })
        .attr("y", function (d, index) { return Math.floor(index/circlesPerRow)*2*radius + radius; })
        .attr("width", 10)
        .attr("height",10)
        .attr("fill", "red")
        .attr("opacity", 0.9);
}

SuicideChart.prototype.onSelectionChange = function(button){
    var vis = this;

    if (button == 1) {
        vis.cells
            .transition()
            .duration(2000)
            .attr("opacity", 0);
        vis.cells2
            .transition()
            .duration(3000)
            .attr("opacity",function(d){
                if(d.MHSUITHK == 1){
                    return 0;
                }
                else
                    return 0.5;
            })
        vis.cells3
            .transition()
            .duration(4000)
            .attr("opacity",function(d){
                if(d.MHSUITHK == 1){
                    return 0;
                }
                else
                    return 0.9;
            })
    }

    else if (button == 2)
    {
        vis.cells2
            .transition()
            .duration(2000)
            .attr("opacity",0);

        vis.cells3
            .transition()
            .duration(3000)
            .attr("opacity",function(d){
                if(d.MHSUIPLN == 1){
                    return 0;
                }
                else
                    return 0.9;
            })
    }
    else if (button == 3)
        vis.cells3
            .transition()
            .duration(2000)
            .attr("opacity",0);
}
