var React = require('react');

require('./Buckets.less');

module.exports = React.createClass({
  render: function() {
    return <div className="buckets">
      <div ref="redHitArea" className="hit-area"></div>
      <div ref="greenHitArea" className="hit-area"></div>
      <div ref="blueHitArea" className="hit-area"></div>
    </div>;
  }
});
