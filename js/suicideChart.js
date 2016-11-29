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
        return person.NEWRACE2 == 5 && (person.MHSUITHK != "-9") && (person.MHSUIPLN != "-9") && (person.MHSUITRY !="-9");
    });

    vis.wrangleData();
}


/*
 *  Data wrangling
 */

SuicideChart.prototype.wrangleData = function() {
    var vis = this;

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


    //Compute Prevalence for Suicidal Thoughts
    vis.suicideIdData = d3.nest()
        .key(function(d){return d.MHSUITHK;})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);

    console.log(vis.suicideIdData);

    var suicideIdPrev = Math.round((vis.suicideIdData[1].values / vis.displayData.length)*100);
    console.log(suicideIdPrev);

    /*
    //Compute Prevalence for Depression
    vis.suicidePlanData = d3.nest()
        .key(function(d){return d.MHSUIPLN;})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);

    console.log(vis.suicidePlanData);

    var suicidePlanPrev = Math.round((vis.suicidePlanData[1].values / vis.displayData.length)*100);
    console.log(suicidePlanPrev);
    */

    //Compute Prevalence for Suicide Attempt
    vis.suicideAttemptData = d3.nest()
        .key(function(d){return d.MHSUITRY;})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);

    console.log(vis.suicideAttemptData);

    var suicideAttemptPrev = Math.round((vis.suicideAttemptData[1].values / vis.displayData.length)*100);
    console.log(suicideAttemptPrev);


    //Bar Chart Data Begins
    var shelter_data = [

        {
            shelter_type: "Suicidal Thoughts",
            percentage: suicideIdPrev
        },
        {
            shelter_type: "Suicidal Plans",
            percentage: 0
        },
        {
            shelter_type: "Suicidal Attempts",
            percentage: suicideAttemptPrev
        }

    ];

    var shelterScale = d3.scale.ordinal()
        .domain(shelter_data.map(function(d) {
            return d.shelter_type;
        }))
        .rangeRoundBands([0, vis.width], .05);

    var percentScale = d3.scale.linear()
        .domain([0, 100])
        .range([vis.height, 0]);

    vis.xAxis = d3.svg.axis()
        .scale(shelterScale)
        .orient("bottom")

    vis.yAxis = d3.svg.axis()
        .scale(percentScale)
        .orient("left")
        .tickFormat(function(d) { return d + "%"; });

    vis.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.svg.append("g")
        .attr("class", "y axis")
        .call(vis.yAxis);



    var bar= vis.svg.selectAll(".bar")
        .data(shelter_data);

    bar.enter().append("rect")
        .attr("class","bar")
        .style("fill", "steelblue")
        .attr("x", function(d) {
            return shelterScale(d.shelter_type);
        })
        .attr("width", shelterScale.rangeBand());

    bar
        .transition()
        .duration(400)
        .attr("y", function(d) {
            return percentScale(d.percentage);
        })
        .attr("height", function(d) {
            return vis.height - percentScale(d.percentage);
        });

    var x_labelPadding = 80;
    var y_labelPadding = 10;

    var label = vis.svg.selectAll(".bartext")
        .data(shelter_data);

    label.enter().append("text")
        .attr("class","bartext")
        .attr("text-anchor","middle")
        .attr("fill","black")
        .attr("x", function(d,index){
            return shelterScale(d.shelter_type)+ x_labelPadding;
        })

    label
        .transition()
        .duration(400)
        .attr("y",function(d){
            return (percentScale(d.percentage)- y_labelPadding);
        })
        .text(function(d) {
            return (d.percentage + "%");
        });

    bar.exit().remove();
    label.exit().remove();

}
