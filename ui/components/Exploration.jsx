
const React = require('react')
const Api = require('./../utils/Api')
const ScatterPlot2d = require('./ScatterPlot2d')
const VectorList = require('./VectorList')
const ClusterList = require('./ClusterList')
const d3 = require('d3')

export default React.createClass({
  getInitialState() {
    return {
      params: this.props.params,
      loading: false,
      result: null,
      error: null,
      color: d3.scale.category20c()
    }
  },
  componentWillMount() {
    this.explore()
  },
  componentWillUpdate() {
  },
  render() {
    let result = this.state.result
    return (
      <div className="exploration">
        { (!result || this.state.loading) && (
          <div className="loader"><div className="spinner"></div></div>
        )}
        { (result) && (
          <div className="row">
            <div className="col-md-2 left-pane">
              <VectorList ref="mostSimilarList" title="Most Similar" data={result} onSelect={this._onDrillDown}></VectorList>
            </div>
            <div className="col-md-8 center-pane">
              <ScatterPlot2d ref="plot" color={this.state.color} data={result}></ScatterPlot2d>
            </div>
            <div className="col-md-2 right-pane">
              <ClusterList ref="clusterList" color={this.state.color} title="K-Means Centroids" data={result}></ClusterList>
            </div>
          </div>
        )}
      </div>
    )
  },
  explore: function() {
    let params = this.state.params
    this.setState({loading: true})
    Api.request('GET', '/explore', {
      query: params.query,
      limit: (params.limit || 1000),
      enable_clustering: true,
      num_clusters: params.num_clusters
    }, (error, result) => {
      this.refs.plot && this.refs.plot.setState({data: result})
      this.refs.mostSimilarList && this.refs.mostSimilarList.setState({selected: null})
      let loading = false;
      this.setState({error, result, loading})
    })
  },
  _onDrillDown: function(params) {
    this.props.onDrillOut(params);
  }
});
