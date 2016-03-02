
const React = require('react')
const Api = require('./../utils/Api')
const ScatterPlot2d = require('./ScatterPlot2d')

export default React.createClass({
  getInitialState() {
    return {
      params: this.props.params,
      loading: false,
      result: null,
      error: null
    }
  },
  componentWillMount() {
    this.explore()
  },
  componentWillUpdate() {
  },
  render() {
    let result = this.state.result
    console.log('this.state.result', this.state.result)
    return (
      <div className="exploration">
        { (!result || this.state.loading) && (
          <div className="loader"><div className="spinner"></div></div>
        )}
        { (result) && (
          <ScatterPlot2d ref="plot" data={result}></ScatterPlot2d>
        )}
      </div>
    )
  },
  explore: function() {
    let params = this.state.params
    this.setState({loading: true})
    Api.request('GET', '/explore', {
      query: params.query,
      limit: (params.limit || 1000)
    }, (error, result) => {
      this.refs.plot && this.refs.plot.setState({data: result})
      let loading = false;
      this.setState({error, result, loading})
    })
  }
});
