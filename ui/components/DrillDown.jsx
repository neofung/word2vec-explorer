
const React = require('react')

export default React.createClass({
  getInitialState() {
    return {
      result: null,
      error: null
    }
  },
  render() {
    return (
      <div className="drill-down panel panel-default">
        <div className="panel-body">
          <a href="#" className="pull-right" onClick={this._onClose}><span onClick={this._onClose} className="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
          <h5>{this.props.query}</h5>
          <button className="btn btn-primary btn-xs">Compare</button>
        </div>
      </div>
    )
  },
  fetch: function() {
    this.setState({loading: true, error: null, result: null})
    Api.request('GET', '/explore', {
      query: this.props.query,
      limit: 20
    }, (error, result) => {
      let loading = false;
      this.setState({error, result, loading})
    })
  },
  _onClose: function(e) {
    e && e.preventDefault()
    this.props.onClose();
  }
});
