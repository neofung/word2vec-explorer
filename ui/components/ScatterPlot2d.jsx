
const React = require('react')
const d3 = require('d3')

export default React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data
    }
  },
  componentDidMount() {
    console.log("this.state.data.reduction", this.state.data.reduction[0])
    this._renderD3()
  },
  componentWillUpdate() {
    console.log("this.state.data.reduction", this.state.data.reduction[0])
    this._updateD3()
  },
  componentWillUmount() {

  },
  render() {
    return (
      <div ref="scatterPlot2dElement" id="scatter-plot-2d" className="scatter-plot-2d full-height">
      </div>
    )
  },
  _renderD3() {
    console.log('_renderD3')
    var dataset = this.state.data.reduction

    var $scatterPlot2dElement = $(this.refs.scatterPlot2dElement)
    // Setup settings for graphic
    var canvas_width = $scatterPlot2dElement.width()
    var canvas_height = $scatterPlot2dElement.height()
    var padding = 30
    var colors = this.props.color

    console.log(`ScatterPlot2d canvas_width=${canvas_width}, canvas_height=${canvas_height}, dataset.length=${dataset.length}`)

    // Create scale functions
    var xScale = d3.scale.linear()  // xScale is width of graphic
       .domain([d3.min(dataset, function(d) {
           return d[0];  // input domain
       }), d3.max(dataset, function(d) {
           return d[0];  // input domain
       })])
       .range([padding, canvas_width - padding]); // output range

    var yScale = d3.scale.linear()  // yScale is height of graphic
       .domain([d3.min(dataset, function(d) {
           return d[1];  // input domain
       }), d3.max(dataset, function(d) {
           return d[1];  // input domain
       })])
       .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip

    // Define X axis
    var xAxis = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .ticks(5);

    // Define Y axis
    var yAxis = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(5);

    // Create SVG element
    var svg = d3.select("#scatter-plot-2d")  // This is where we put our vis
       .append("svg")
       .attr("width", canvas_width)
       .attr("height", canvas_height)

    // Create Circles
    svg.selectAll("circle")
     .data(dataset)
     .enter()
     .append("circle")  // Add circle svg
     .attr("cx", function(d) {
         return xScale(d[0]);  // Circle's X
     })
     .attr("cy", function(d) {  // Circle's Y
         return yScale(d[1]);
     })
     .attr("fill", (d, i) => {
       return colors(this.state.data.clusters[i])
     })
     .attr("r", 2);  // radius

    // Add to X axis
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + (canvas_height - padding) +")")
       .call(xAxis);

    // Add to Y axis
    svg.append("g")
       .attr("class", "y axis")
       .attr("transform", "translate(" + padding +",0)")
       .call(yAxis);

    // On click, update with new data
    function update() {
       var self = this;
       var dataset = this.state.data.reduction
       var numValues = dataset.length

       console.log(`ScatterPlot2d update, dataset.length=${dataset.length}`)

       // Update scale domains
       xScale.domain([d3.min(dataset, function(d) {
           return d[0]; }), d3.max(dataset, function(d) {
           return d[0]; })]);
       yScale.domain([d3.min(dataset, function(d) {
           return d[1]; }), d3.max(dataset, function(d) {
           return d[1]; })]);

       // Update data for existing nodes
       var nodes = svg.selectAll("circle")
         .data(dataset)  // Update with new data

       // Change existing nodes
       nodes
         .transition()  // Transition from old to new
         .duration(1000)  // Length of animation
         .delay(function(d, i) {
             return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
         })
         //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
         .attr("cx", function(d) {
             return xScale(d[0]);  // Circle's X
         })
         .attr("cy", function(d) {
             return yScale(d[1]);  // Circle's Y
         })
         .attr("fill", (d, i) => {
           return colors(this.state.data.clusters[i])
         })

       // Render new nodes
       nodes
         .enter()
         .append("circle")  // Add circle svg
         .transition()  // Transition from old to new
         .duration(1000)  // Length of animation
         .delay(function(d, i) {
             return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
         })
         .each("start", function() {  // Start animation
            d3.select(this)  // 'this' means the current element
              .attr("fill", "white")  // Change color
         })
         .each("end", function(d, i) {  // Start animation
           d3.select(this)
             .attr("fill", () => {
               return colors(self.state.data.clusters[i])
             })
         })
         .attr("cx", function(d) {
           return xScale(d[0]);  // Circle's X
         })
         .attr("cy", function(d) {  // Circle's Y
           return yScale(d[1]);
         })
         .attr("fill", (d, i) => {
           return colors(self.state.data.clusters[i])
         })
         .attr("r", 2);  // Change size

      // Remove old nodes
      nodes
        .exit()
        .remove();

       // Update X Axis
       svg.select(".x.axis")
         .transition()
         .duration(1000)
         .call(xAxis);

       // Update Y Axis
       svg.select(".y.axis")
         .transition()
         .duration(100)
         .call(yAxis);
    };

    this._updateD3 = update
    window.updateD3 = update
  }
});
