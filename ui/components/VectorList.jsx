
const React = require('react')

export default React.createClass({
  render() {
    let data = this.props.data
    let labels = data.labels.slice(0, this.props.limit || 20)
    let itemsHtml = []
    for (let i=0; labels.length>i; i++) {
      itemsHtml.push(<li className="list-group-item" key={i}>{labels[i]}</li>)
    }
    return (
      <div className="vector-list panel panel-default full-height">
        <div className="panel-heading">{this.props.title}</div>
        <ul className="list-group">
          {itemsHtml}
        </ul>
      </div>
    )
  }
});
