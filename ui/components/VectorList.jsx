
const React = require('react')

export default React.createClass({
  getInitialState() {
    return {
      selected: null
    }
  },
  render() {
    let data = this.props.data
    let labels = data.labels.slice(0, this.props.limit || 20)
    let itemsHtml = []
    for (let i=0; labels.length>i; i++) {
      let className = 'list-group-item'
      if (this.state.selected == labels[i]) className += ' active'
      itemsHtml.push(<a href="#" className={className} key={i} onClick={this._onClick} data-index={i}>{labels[i]}</a>)
    }
    return (
      <div className="vector-list panel panel-default full-height">
        <div className="panel-heading">{this.props.title}</div>
        <div className="list-group">
          {itemsHtml}
        </div>
      </div>
    )
  },
  _onClick: function(e) {
    e && e.preventDefault()
    var query = $(e.target).text()
    var index = parseInt($(e.target).attr('data-index'), 10)
    this.setState({selected: query})
    this.props.onSelect && this.props.onSelect({query, index})
  }
});
