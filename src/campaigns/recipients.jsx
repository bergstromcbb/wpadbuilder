import React from "react";
import {
	Link,
} from "react-router";
import {connect} from "react-redux";
import RibbonPiece from "./component/RibbonPiece";
import * as campaignActions from "./actions/campaignActions";
import PropTypes from "prop-types";
import StepsMenu from "./component/stepsmenu";

class MailingWizardThree extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
		};
		this.handleListChange = this.handleListChange.bind(this);
	}

	componentDidMount() {
		$.getJSON("https://private-8e550-directmail.apiary-mock.com/v1/lists/list_id/members?q=").then(
			value => this.setState({loading: false, data: value}),
			error => this.setState({loading: false, error: error})
		);
	}

	handleListChange(event) {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
		this.props.setRecipientsNum(value);
	}

	render() {

		return (

			<div className="m-t-60">
				<div className="topHeaderContainer flex ribbon m-r-0">
					<RibbonPiece progressAmount="60%" />	
				</div>
				<div className="full-height">
					<div className="full-height flex hundred">
						<div className="col-sm-9">
							<h6><i className="pg-layouts4"></i>  <span className="semi-bold p-l-5">Choose the Recipients</span></h6>
							<p>Lorem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem </p>

							<div className="col-md-12xx">
								<form role="form">
									<div className="form-group-attached">
										<div className="form-group radios">
											<div className="radio radio-success col-sm-12 row bg-white">
												<div className="col-sm-5">
													<input
														onChange={this.handleListChange}
														type="radio"
														value="1"
														checked={this.state.Listtype === "1"}
														name="Listtype"
														id="individual"
													/>
													<span className="p-l-20 bold">
														One of my lists
													</span>
													<span className="p-l-15">
														<Link to="/templates" id="btnSave" className="btn btn-primary ">(new list)</Link>
													</span>
												</div>
												<div className="col-sm-7 p-l-25">
													<select className="full-width" data-init-plugin="select2">
														<option value="">select one</option>
														<option value="1234">Your List One (12,334)</option>
														<option value="2345">Your List Two (10,564)</option>
														<option value="3456">Your List Three (8,034)</option>
														<option value="4567">Your List Four (12,995)</option>
													</select>
												</div>
											</div>

											<div className="radio radio-success col-sm-12 row bg-white">
												<div className="col-sm-5">
													<input
														type="radio"
														value="2"
														checked={this.state.Listtype === "2"}
														onChange={this.handleListChange}
														name="Listtype"
														id="individual"
													/>
													<span className="p-l-20 bold">
														Customer data source
													</span>
												</div>
												<div className="col-sm-7 p-l-25">
                                                    Includes Coin, RO, and Conquest owners assigned to your area
												</div>
											</div>

											<div className="radio radio-success col-sm-12 row bg-white">
												<div className="col-sm-5">	
													<input
														type="radio"
														value="3"
														checked={this.state.Listtype === "3"}
														onChange={this.handleListChange}
														name="Listtype"
														id="individual"
													/>
													<span className="p-l-20 bold">
														Standard Promo list
													</span>
												</div>
												<div className="col-sm-7 p-l-25">
                                                    Define the criteria used for a customer list
												</div>
											</div>
										</div>
									</div>

									<div className="p-t-30 clear">
										<Link to="/delivery" id="btnNext" className="ui button btn-primary">Next</Link>
									</div>
								</form>
							</div>
						</div>
			
						<div className="col-sm-3 p-l-0">
							<StepsMenu StepOne=" completed" StepTwo=" completed" StepThree=" completed" StepFour=" active" StepFive="" StepSix="" />
						</div>		
					</div>
				</div>
			</div>

		);
	}
}

const mapDispatchToProps = {
	setCampaignName: campaignActions.setCampaignName,
	setRecipientsNum: campaignActions.setRecipientsNum,
};

MailingWizardThree.propTypes = {
	setCampaignName: PropTypes.func,
	setRecipientsNum: PropTypes.func,

};

export default connect(null, mapDispatchToProps)(MailingWizardThree);
