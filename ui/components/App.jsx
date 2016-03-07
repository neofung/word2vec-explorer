
const React = require('react')
const Exploration = require('./Exploration')
const Comparison = require('./Comparison')

export default React.createClass({
  getInitialState() {
    return {
      params: {
        query: "",
        limit: 1000,
        num_clusters: 30
      },
      canCompare: false,
      compareQueries: null
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
                <input id="queryInput" ref="queryInput" onChange={this._onQueryChange} className="form-control" type="text" defaultValue={this.state.params.query}></input>
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
              {this.state.canCompare && (
                <input type="submit" className="btn btn-default" value="Compare" onClick={this._compare} />
              )}
            </form>
          </div>
        </div>
        <Exploration ref="exploration" params={this.state.params} onDrillOut={this._onDrillOut}></Exploration>
        {this.state.compareQueries && (
          <Comparison queries={this.state.compareQueries}></Comparison>
        )}
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
    this.refs.queryInput.value = params.query
    this._explore();
  },
  _onQueryChange() {
    let value = this.refs.queryInput.value
    if (value.match(/NOT /)) return
    value = value.split(' AND ')
    if (value.length > 1) {
      this.setState({canCompare: true})
    } else {
      this.setState({canCompare: false})
    }
  },
  _compare(e) {
    e && e.preventDefault()
    let value = this.refs.queryInput.value
    this.setState({compareQueries: value.split(' AND ')})
  }
});
