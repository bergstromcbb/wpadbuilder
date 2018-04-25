import React from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";

export default class StepsMenu extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			value: ""
		};
	}

	handleChange(e) {
		const s = this;
		s.setState({
			value: e.target.value
		});
	}

	render() {

		return (
			<div className="col-xs-12 bg-white border-left border-bottom full-height p-t-20">

				<div className="ui vertical steps ordered">
					<div className={"step" + (this.props.StepOne)}>
						<div className="content">
							<Link to="/newcampaign">
								<div className="stepTitle">Campaign Details</div>
							</Link>
							<div className="small">{"Let's name your campaign and setup the details"}</div>
						</div>
					</div>
					<div className={"step" + (this.props.StepTwo)}>
						<div className="content">
							<Link to="/templates">
								<div className="stepTitle">Select a Template</div>
							</Link>
							<div className="small">{"Let's name your campaign and setup the details"}</div>
						</div>
					</div>
					<div className={"step" + (this.props.StepThree)}>
						<div className="content">
							<Link to="/editor">
								<div className="stepTitle">Set the Content</div>
							</Link>
							<div className="small">{"Let's name your campaign and setup the details"}</div>
						</div>
					</div>
					<div className={"step" + (this.props.StepFour)}>
						<div className="content">
							<Link to="/listnaming">
								<div className="stepTitle">Choose the Recipients</div>
							</Link>
							<div className="small">{"Let's name your campaign and setup the details"}</div>
						</div>
					</div>
					<div className={"step" + (this.props.StepFive)}>
						<div className="content">
							<Link to="/delivery">
								<div className="stepTitle">Schedule Delivery</div>
							</Link>
							<div className="small">{"Let's name your campaign and setup the details"}</div>
						</div>
					</div>
					<div className={"step" + (this.props.StepSix)}>
						<div className="content">
							<Link to="/Summary">
								<div className="stepTitle">Campaign Summary</div>
							</Link>
							<div className="small">{"Let's name your campaign and setup the details"}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

StepsMenu.propTypes = {
	StepOne: PropTypes.string,
	StepTwo: PropTypes.string,
	StepThree: PropTypes.string,
	StepFour: PropTypes.string,
	StepFive: PropTypes.string,
	StepSix: PropTypes.string,
};