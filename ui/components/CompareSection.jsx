
const React = require('react')
const Api = require('./../utils/Api')
const ScatterPlot2d = require('./ScatterPlot2d')

export default React.createClass({
    getInitialState() {
      return {
        error: null,
        loading: false,
        data: null,
        queryA: 'buying|VERB',
        queryB: 'selling|VERB'
      }
    },
    componentDidMount() {
      $('.navbar-nav li').removeClass('active')
      $('.navbar-nav li.compare').addClass('active')
    },
    render() {
      const result = this.state.result
      const queryA = this.state.queryA
      const queryB = this.state.queryB
      return (
        <div className="row">
          <div className="query-column col-md-2">
            <div className="filters">
              <form className="form" onSubmit={this._onCompareSubmit}>
                <div className="form-group">
                  <label htmlFor="queryAInput">Query A:</label>
                  <input id="queryAInput" ref="queryAInput" className="form-control" type="text" defaultValue={queryA}></input>
                </div>
                <div className="form-group">
                  <label htmlFor="queryBInput">Query B:</label>
                  <input id="queryBInput" ref="queryBInput" className="form-control" type="text" defaultValue={queryB}></input>
                </div>
                <div className="form-group">
                  <input type="submit" className="btn btn-primary" value="Compare"/>
                </div>
              </form>
            </div>
          </div>
          <div className="result comparison">
            <div className="center-pane col-md-10">
              { result && (
                <ScatterPlot2d ref="plot" labels={result.labels} points={result.comparison} axes={[queryA, queryB]} showLabels={true}></ScatterPlot2d>
              )}
            </div>
          </div>
        </div>
      )
    },
    compare() {
      this.setState({loading: true, error: null})
      Api.request('GET', '/compare', {
        queries: [this.state.queryA, this.state.queryB],
        limit: 30
      }, (error, result) => {
        let loading = false
        this.setState({error, result, loading})
      })
    },
    _onCompareSubmit(e) {
      e && e.preventDefault()
      var queryA = this.refs.queryAInput.value
      var queryB = this.refs.queryBInput.value
      this.setState({queryA, queryB})
      this.compare()
    },
});
