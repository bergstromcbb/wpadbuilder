import React from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
// import { Progress } from "semantic-ui-react";

class ProgressBar extends React.Component {

	render() {
		return (
			<div className="ui progress">
				<div className="bar m-t-10" style={{ width: this.props.progressAmount }}>
				</div>
				{/*<div>{this.props.progressAmount}</div>*/}
			</div>
		);
	}
}

ProgressBar.propTypes = {
	progressAmount: PropTypes.string,
};

export default ProgressBar;
