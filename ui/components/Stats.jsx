
const React = require('react')

export default React.createClass({
  render() {
    let data = this.props.data
    let format = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    let numVectors = format(data.num_vectors)
    let vocabSize = format(data.vocab_size)
    let sampleRate = data.sample_rate && (Math.round(data.sample_rate * 100)/100)
    return (
      <div className="stats">
        Showing {numVectors} out of {vocabSize} vectors. { sampleRate && (<span>Sample Rate = {sampleRate}</span>)}
      </div>
    )
  }
});
