
const React = require('react')
const d3 = require('d3')

export default React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data
    }
  },
  componentDidMount() {
    this._renderD3()
  },
  componentWillUpdate() {
    this._updateD3()
  },
  render() {
    return (
      <div ref="scatterPlot2dElement" id="scatter-plot-2d" className="scatter-plot-2d full-height">
      </div>
    )
  },
  _renderD3() {
    var dataset = this.state.data.reduction

    var colors = this.props.color
    var $scatterPlot2dElement = $(this.refs.scatterPlot2dElement)
    var width = $scatterPlot2dElement.width()
    var height = $scatterPlot2dElement.height()
    var padding = 30

    console.log(`ScatterPlot2d width=${width}, height=${height}, dataset.length=${dataset.length}`)

    var xScale = d3.scale.linear()
      .domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])])
      .range([padding, width - padding]);

    var yScale = d3.scale.linear()
      .domain([d3.min(dataset, d => d[1]), d3.max(dataset, d => d[1])])
      .range([height - padding, padding]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(5);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(5);

    var svg = d3.select("#scatter-plot-2d")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScale(d[1]))
      .attr("fill", (d, i) => colors(this.state.data.clusters[i]))
      .attr("r", 2);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - padding) +")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding +",0)")
      .call(yAxis);

    function update() {
       var self = this;
       var dataset = this.state.data.reduction
       var numValues = dataset.length

       console.log(`ScatterPlot2d update, dataset.length=${dataset.length}`)

       xScale.domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])])
       yScale.domain([d3.min(dataset, d => d[1]), d3.max(dataset, d => d[1])])

       // Update data for existing nodes
       var nodes = svg.selectAll("circle")
         .data(dataset)

       // Change existing nodes
       nodes
         .transition()
         .duration(1000)
         .delay((d, i) => i / dataset.length * 500)
         .attr("cx", d => xScale(d[0]))
         .attr("cy", d => yScale(d[1]))
         .attr("fill", (d, i) => colors(this.state.data.clusters[i]))

       // Render new nodes
       nodes
         .enter()
         .append("circle")
         .transition()
         .duration(1000)
         .delay((d, i) => i / dataset.length * 500)
         .each("start", function() {
            d3.select(this)
              .attr("fill", "white")
         })
         .each("end", function(d, i) {
           d3.select(this)
             .attr("fill", () => colors(self.state.data.clusters[i]))
         })
         .attr("cx", d => xScale(d[0]))
         .attr("cy", d => yScale(d[1]))
         .attr("fill", (d, i) => colors(this.state.data.clusters[i]))
         .attr("r", 2);

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
  }
});
