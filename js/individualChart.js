/**
 * Created by joan on 11/22/16.
 */


/*
 *  AggregateChart - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- ???
 */

IndividualChart = function(_parentElement, _data, _metaData) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.metaData = _metaData;

    this.initVis();
};


/*
 *  Initialize visualization (static content, e.g. SVG area or axes)
 */

IndividualChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = { top: 10, right: 10, bottom: 50, left: 50 };

    vis.width =$("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;


    vis.svg = d3.select("#individual-chart").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.wrangleData();
}


/*
 *  Data wrangling
 */

IndividualChart.prototype.wrangleData = function() {
    var vis = this;

    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */

IndividualChart.prototype.updateVis = function() {
    var vis = this;


    //Compute Prevalence for Depression
    vis.depressionData = d3.nest()
        .key(function(d){return d.AMDEYR;})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);

    var depPrev = Math.round((vis.depressionData[0].values / vis.displayData.length)*100);

    //Compute Prevalence for Suicidal Thoughts (Also Ideation and Planning)
    vis.suicideData = d3.nest()
        .key(function(d){return d.MHSUITHK;})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);


    var suicideIdeationPrev = Math.round((vis.suicideData[1].values / vis.displayData.length)*100);

    //Compute Prevalence for Illicit Drug + Alcohol Dependence and Abuse
    vis.drugData = d3.nest()
        .key(function(d){return d.ABODILAL;})
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);

    var drugPrev = Math.round((vis.drugData[1].values / vis.displayData.length)*100);

    //Bar Chart Data Begins
    var shelter_data = [

        {
            shelter_type: "Depression",
            percentage: depPrev
        },
        {
            shelter_type: "Suicidal Thoughts",
            percentage: suicideIdeationPrev
        },
        {
            shelter_type: "Substance Abuse",
            percentage: drugPrev
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
        });

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

IndividualChart.prototype.onSelectionChange = function (checked) {
    var vis = this;

    // Filter data for checked selections
    vis.displayData = vis.data.filter(function (person) {
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
