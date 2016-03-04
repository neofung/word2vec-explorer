
const React = require('react')
const d3 = require('d3')

export default React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data,
      viewOptions: {
        showLabels: false
      }
    }
  },
  componentDidMount() {
    this._renderD3()
  },
  componentWillUpdate() {
    this._updateD3()
  },
  render() {
    let viewOptions = this.state.viewOptions
    let scatterClasses = 'scatter-plot-2d'
    if (viewOptions.showLabels) scatterClasses += ' show-labels'
    this._updateD3 && this._updateD3()
    return (
      <div className="scatter-plot-2d-container">
        <div className="view-options">
          <div className="checkbox">
            <label>
              <input ref="showLabelsInput" type="checkbox" defaultValue="yes" checked={viewOptions.showLabels} onChange={this._setViewOptions} />
              Show Labels
            </label>
          </div>
        </div>
        <div id="scatter-plot-2d" ref="scatterPlot2dElement" className={scatterClasses}>
        </div>
      </div>
    )
  },
  _setViewOptions: function() {
    var viewOptions = {
      showLabels: this.refs.showLabelsInput.checked
    }
    this.setState({viewOptions: viewOptions})
  },
  _nodeRadius: function() {
    var nodeRadius = 2
    if (this.state.data.reduction.length > 5000) nodeRadius = 1
    if (this.state.data.reduction.length < 500) nodeRadius = 3
    if (this.state.data.reduction.length < 50) nodeRadius = 4
    return nodeRadius
  },
  _renderD3() {
    var dataset = this.state.data.reduction

    var colors = this.props.color
    var $scatterPlot2dElement = $(this.refs.scatterPlot2dElement)
    var width = $scatterPlot2dElement.width()
    var height = $scatterPlot2dElement.height()
    var padding = 30

    console.log(`ScatterPlot2d width=${width}, height=${height}, dataset.length=${dataset.length}`)

    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", zoomed);

    var drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", dragstarted)
      .on("drag", dragged)
      .on("dragend", dragended);

    function zoomed() {
      container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
      d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended(d) {
      d3.select(this).classed("dragging", false);
    }

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
      .append("g")
      .attr("transform", "translate(" + padding + "," + padding + ")")
      .call(zoom);

    var backdrop = svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "white")
      .style("pointer-events", "all");

    var container = svg.append("g");

    if (this.props.drawAxes) {
      container.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - padding) +")")
        .call(xAxis);

      container.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding +",0)")
        .call(yAxis);
    }

    function update() {
       let self = this;
       let dataset = this.state.data.reduction
       let numValues = dataset.length
       let viewOptions = this.state.viewOptions

       console.log(`ScatterPlot2d update, dataset.length=${dataset.length}`)

       xScale.domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])])
       yScale.domain([d3.min(dataset, d => d[1]), d3.max(dataset, d => d[1])])

       // Update data for existing nodes
       var nodes = container.selectAll("circle.node")
         .data(dataset)

       // Change existing nodes
       nodes
         .transition()
         .duration(1000)
         .delay((d, i) => i / dataset.length * 500)
         .attr("cx", d => xScale(d[0]))
         .attr("cy", d => yScale(d[1]))
         .attr("fill", (d, i) => colors(this.state.data.clusters[i]))
         .attr("r", this._nodeRadius());

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
         .attr("class", "node")
         .attr("cx", d => xScale(d[0]))
         .attr("cy", d => yScale(d[1]))
         .attr("fill", (d, i) => colors(this.state.data.clusters[i]))
         .attr("r", this._nodeRadius())

       console.log('viewOptions', viewOptions)

       if (viewOptions.showLabels) {
         var labelNodes = container.selectAll("text.node-label")
           .data(dataset)

         labelNodes
           .transition()
           .duration(1000)
           .delay((d, i) => i / dataset.length * 500)
           .attr("x", d => xScale(d[0]))
           .attr("y", d => yScale(d[1]))

         labelNodes
           .enter()
           .append("text")
           .attr("class", "node-label")
           .attr("text-anchor", "middle")
           .attr("x", d => xScale(d[0]))
           .attr("y", d => yScale(d[1]))
           .attr("dy", 0 - this._nodeRadius() - 1.5)
           .text((d, i) => this.state.data.labels[i])

         labelNodes
           .exit()
           .remove()
       } else {
         container.selectAll("text.node-label")
          .remove()
       }

      // Remove old nodes
      nodes
        .exit()
        .remove();

       // Update X Axis
       container.select(".x.axis")
         .transition()
         .duration(1000)
         .call(xAxis);

       // Update Y Axis
       container.select(".y.axis")
         .transition()
         .duration(100)
         .call(yAxis);
    };

    this._updateD3 = update.bind(this)
    this._updateD3()
  }
});
