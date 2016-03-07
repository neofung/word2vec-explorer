
const React = require('react')
const Api = require('./../utils/Api')
const ScatterPlot2d = require('./ScatterPlot2d')

export default React.createClass({
  getInitialState() {
    return {
      error: null,
      loading: false,
      data: null
    }
  },
  componentWillMount() {
    this.compare()
  },
  componentDidMount() {
    $(this.refs.modal).modal('show')
  },
  componentWillUmount() {
    $(this.refs.modal).modal('hide')
  },
  render() {
    const result = this.state.result
    const queries = this.props.queries
    const title = queries.join(' VS ')
    return (
      <div ref="modal" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog comparison modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Compare {title}</h4>
            </div>
            <div className="modal-body">
              { result && (
                <ScatterPlot2d ref="plot" labels={result.labels} points={result.comparison} axes={queries} showLabels={true}></ScatterPlot2d>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  },
  compare() {
    this.setState({loading: true, error: null})
    Api.request('GET', '/compare', {
      query: this.props.queries.join(' AND '),
      limit: 30
    }, (error, result) => {
      let loading = false;
      console.log('resutl', result)
      this.setState({error, result, loading})
    })
  }
});
