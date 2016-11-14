/**
 * Created by sungmin on 11/13/16.
 */

/*
 *  NAME - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- ???
 */

NAME = function(_parentElement, _data) {

    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}


/*
 *  Initialize visualization (static content, e.g. SVG area or axes)
 */

NAME.prototype.initVis = function() {
    var vis = this;

    vis.wrangleData();
}


/*
 *  Data wrangling
 */

NAME.prototype.wrangleData = function() {
    var vis = this;

    // Currently no data wrangling/filtering needed
    // vis.displayData = vis.data;

    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */

NAME.prototype.updateVis = function() {
    var vis = this;

}
