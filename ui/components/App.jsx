
const React = require('react')
const Exploration = require('./Exploration')

export default React.createClass({
  getInitialState() {
    return {
      params: {
        query: "buying|VERB",
        limit: 2000,
        num_clusters: 30
      }
    }
  },
  render() {
    return (
      <div className="app">
        <div className="filters panel panel-default">
          <div className="panel-body">
            <form className="form-inline" onSubmit={this._explore}>
              <div className="form-group">
                <label htmlFor="queryInput">Query:</label>
                <input id="queryInput" ref="queryInput" className="form-control" type="text" defaultValue={this.state.params.query}></input>
              </div>
              <div className="form-group">
                <label htmlFor="limitInput">Num Vectors:</label>
                <input id="limitInput" ref="limitInput" className="form-control" type="text" defaultValue={this.state.params.limit}></input>
              </div>
              <div className="form-group">
                <label htmlFor="limitInput">Num Clusters:</label>
                <input id="numClustersInput" ref="numClustersInput" className="form-control" type="text" defaultValue={this.state.params.num_clusters}></input>
              </div>
              <input type="submit" className="btn btn-primary" value="Explore"/>
            </form>
          </div>
        </div>
        <Exploration ref="exploration" params={this.state.params} onDrillOut={this._onDrillOut}></Exploration>
      </div>
    )
  },
  _explore(e) {
    e && e.preventDefault()
    var query = this.refs.queryInput.value
    var limit = parseInt(this.refs.limitInput.value, 10)
    var numClusters = parseInt(this.refs.numClustersInput.value, 10)
    var params = this.state.params
    params.query = query
    params.limit = limit
    params.num_clusters = numClusters
    this.setState({params})
    this.refs.exploration.setState({params})
    this.refs.exploration.explore()
  },
  _onDrillOut(params) {
    console.log('onDrillOut')
    this.refs.queryInput.value = params.query
    this._explore();
  }
});
