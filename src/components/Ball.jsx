var React = require('react');

require('./Ball.less');

module.exports = React.createClass({
  render: function() {
    return <div className={"ball-" + this.props.color}></div>;
  }
});
