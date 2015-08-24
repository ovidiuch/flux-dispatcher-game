var React = require('react'),
    _ = require('lodash'),
    ReactAnimationLoop = require('react-animation-loop'),
    Buckets = require('./Buckets.jsx'),
    Pipe = require('./Pipe.jsx'),
    Ball = require('./Ball.jsx');

require('./Game.less');

var GAME_WIDTH = 800,
    GAME_HEIGHT = 600,
    BALL_COLORS = ['red', 'green', 'blue'],
    BALL_WIDTH = 75,
    BUCKETS_WIDTH = 470,
    BALL_STARTING_POSITION = 20,
    BALL_SPEED = 200; // pixels per second

module.exports = React.createClass({
  mixins: [ReactAnimationLoop],

  getInitialState: function() {
    return {
      score: 0,
      bucketsPosition: GAME_WIDTH / 2,
      ballPosition: {
        x: GAME_WIDTH / 2,
        y: BALL_STARTING_POSITION
      },
      ballColor: BALL_COLORS[0],
      animationLoopRunning: false
    };
  },

  render: function() {
    var bucketsStyles = {
      left: this.state.bucketsPosition
    };

    var ballStyles = {
      top: this.state.ballPosition.y,
      left: this.state.ballPosition.x
    };

    return <div className="game"
                onMouseMove={this.onMouseMove}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}>
      <div className="score">{this.state.score}</div>
      <div className="ball-container" style={ballStyles}>
        <Ball color={this.state.ballColor}></Ball>
      </div>
      <div className="pipe-container">
        <Pipe></Pipe>
      </div>
      <div ref="bucketsContainer"
           className="buckets-container"
           style={bucketsStyles}>
        <Buckets ref="buckets"></Buckets>
      </div>
    </div>;
  },

  onMouseMove: function(e) {
    var rootCoords = this.getDOMNode().getBoundingClientRect(),
        nextPosition = e.clientX - rootCoords.left;

    // Make sure the buckets don't go out of bounds
    nextPosition = Math.max(nextPosition, BUCKETS_WIDTH / 2);
    nextPosition = Math.min(nextPosition, GAME_WIDTH - BUCKETS_WIDTH / 2);

    this.setState({
      bucketsPosition: nextPosition
    });
  },

  onMouseOver: function(e) {
    this.setState({
      animationLoopRunning: true
    });
  },

  onMouseOut: function(e) {
    this.setState({
      animationLoopRunning: false
    });
  },

  onFrame: function(delta) {
    var hitArea = this.refs.buckets.refs[this.state.ballColor + 'HitArea'],
        rootCoords = this.getDOMNode().getBoundingClientRect(),
        hitAreaCoords = hitArea.getDOMNode().getBoundingClientRect(),
        hitAreaWidth = hitArea.getDOMNode().offsetWidth;

    var nextState = {
      ballPosition: {
        x: this.state.ballPosition.x,
        y: this.state.ballPosition.y + BALL_SPEED / 60 * delta
      }
    };

    var ballLandingPosition = hitAreaCoords.top - rootCoords.top;

    // If the ball goes below the bucket
    if (nextState.ballPosition.y > ballLandingPosition) {
      // Ball goes outside its corresponding bucket
      if (this.state.ballPosition.x - (BALL_WIDTH / 2) <
          hitAreaCoords.left - rootCoords.left ||
          this.state.ballPosition.x + (BALL_WIDTH / 2) >
          hitAreaCoords.left - rootCoords.left + hitAreaWidth) {
        nextState.score = 0;
      } else {
        nextState.score = this.state.score + 1;
      }

      nextState.ballPosition.y = BALL_STARTING_POSITION;
      nextState.ballColor = _.sample(BALL_COLORS);
    }

    this.setState(nextState);
  }
});
