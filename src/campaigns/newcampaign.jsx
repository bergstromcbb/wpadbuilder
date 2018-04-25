import React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import * as campaignActions from "./actions/campaignActions";
import RibbonPiece from "./component/RibbonPiece";
import PropTypes from "prop-types";
import StepsMenu from "./component/stepsmenu";


class MailingWizard extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleName = this.handleName.bind(this);
	}

	// componentDidMount() {
	// 	$.getJSON("https://private-8e550-directmail.apiary-mock.com/v1/lists/list_id/members?q=").then(
	// 		value => this.setState({loading: false, data: value}),
	// 		error => this.setState({loading: false, error: error})
	// 	);
	// }


	handleInputChange(event) {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	handleName(event) {
		this.props.setCampaignName(event.target.value);
	}

	renderNewCampaignForm() {
		if (this.state.campaigntype === "1"){
			return (
				<div>
					<div className="panel-body">

						<div className="form-group-attached">
							<div className="form-group form-group-defaultx required">
								<label>From Name</label>
								<input type="text" className="form-control" placeholder="From Name" required="" defaultValue="All Star Automotive Group" />
							</div>
						</div>
						<div className="form-group-attached">
							<div className="form-group form-group-defaultx required">
								<label>Address</label>
								<input type="text" className="form-control" placeholder="From Address" required="" defaultValue="4951 W Chester Pike" />
							</div>
						</div>
						<div className="form-group-attached">
							<div className="form-group form-group-defaultx required">
								<label>Address 2</label>
								<input type="text" className="form-control" placeholder="From Address 2" required="" />
							</div>
						</div>                      
						<div className="form-group-attached">
							<div className="row clearfix">
								<div className="col-sm-6">
									<div className="form-group form-group-defaultx">
										<label>City</label>
										<input type="text" className="form-control" placeholder="From City" defaultValue="Newtown Square" />
									</div>
								</div>

								<div className="col-sm-6">
									<div className="form-group form-group-defaultx form-group-defaultx-select2 required">
										<label className="">State</label>
										<select className="full-width" style={{height: "42px"}} data-placeholder="State" defaultValue="Michigan">
											<option value="AL">Alabama </option>
											<option value="AK">Alaska </option>
											<option value="AZ">Arizona </option>
											<option value="AR">Arkansas </option>
											<option value="CA">California </option>
											<option value="CO">Colorado </option>
											<option value="CT">Connecticut </option>
											<option value="DE">Delaware </option>
											<option value="FL">Florida </option>
											<option value="GA">Georgia </option>
											<option value="HI">Hawaii </option>
											<option value="ID">Idaho </option>
											<option value="IL">Illinois </option>
											<option value="IN">Indiana </option>
											<option value="IA">Iowa </option>
											<option value="KS">Kansas </option>
											<option value="KY">Kentucky </option>
											<option value="LA">Louisiana </option>
											<option value="ME">Maine </option>
											<option value="MD">Maryland </option>
											<option value="MA">Massachusetts </option>
											<option value="MI">Michigan </option>
											<option value="MN">Minnesota </option>
											<option value="MS">Mississippi </option>
											<option value="MO">Missouri </option>
											<option value="MT">Montana </option>
											<option value="NE">Nebraska</option>
											<option value="NV">Nevada </option>
											<option value="NH">New Hampshire </option>
											<option value="NJ">New Jersey </option>
											<option value="NM">New Mexico </option>
											<option value="NY">New York </option>
											<option value="NC">North Carolina </option>
											<option value="ND">North Dakota </option>
											<option value="OH">Ohio </option>
											<option value="OK">Oklahoma </option>
											<option value="OR">Oregon </option>
											<option value="PA">Pennsylvania </option>
											<option value="RI">Rhode Island </option>
											<option value="SC">South Carolina </option>
											<option value="SD">South Dakota </option>
											<option value="TN">Tennessee </option>
											<option value="TX">Texas </option>
											<option value="UT">Utah </option>
											<option value="VT">Vermont </option>
											<option value="VA">Virginia </option>
											<option value="WA">Washington </option>
											<option value="WV">West Virginia </option>
											<option value="WI">Wisconsin </option>
											<option value="WY">Wyoming</option>
										</select>
									</div>
								</div>                                    
							</div>
						</div>
						<div className="form-group-attached">
							<div className="row clearfix">
 
								<div className="col-sm-4">
									<div className="form-group form-group-defaultx">
										<label>Zip Code</label>
										<input type="text" className="form-control" placeholder="From Zip" defaultValue="19073" />
									</div>
								</div>                                                                  
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}

	render() {

		return (

			<div className="m-t-60">
				<div className="topHeaderContainer flex ribbon m-r-0">
					<RibbonPiece progressAmount="15%"/>	
				</div>

				<div className="full-height">
					<div className="full-height flex hundred">
						<div className="col-sm-9 p-t-20">
							<span className="title-main"><i className="pg-layouts4"></i> <span className="semi-bold">Campaign Details</span></span>
							<br />
							<p>
								Lorem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr
								dolem orem ipsolr dolem
							</p>
							
							<form role="form">
								<div className="form-group-attached">
									<div className="form-group form-group-defaultx required">
										<label className="title-2">Campaign Name</label>
										<input onChange={this.handleName} name="campaignName" type="text" className="form-control" placeholder="Type name of campaign" required=""/>
									</div>
								</div>
								
								<div className="form-group-attached">	
									<div className="form-group form-group-defaultx required">	
										<label className="teal title-2 p-t-10">Campaign Type</label>
										<div className="radio radio-success">
											<input 
												type="radio" 
												value="1" 
												checked={this.state.campaigntype === "1"} 
												name="campaigntype" 
												id="individual"
												onChange={this.handleInputChange}
											/>
											{/* <label htmlFor="individual"> */}
											<span className="semi-bold teal m-l-20">Individual Mailing</span> 
											{/* </label> */}
											<br/>
											<input 
												type="radio" 
												value="2" 
												checked={this.state.campaigntype === "2"} 
												name="campaigntype" 
												id="promo"
												onChange={this.handleInputChange}
											/>
											{/* <label htmlFor="promo"> */}
											<span className="semi-bold teal m-l-20">Promo Mailing</span>
											{/* </label> */}
										</div>
									</div>
								</div>
							</form>
								
							{this.renderNewCampaignForm()}

							<div className="p-t-20 p-b-20">
								<Link to="/templates" id="" className="ui button btn-primary ">Next</Link>
							</div>
						</div>
						<div className="col-sm-3 p-l-0">
							<StepsMenu StepOne=" active" StepTwo=" " StepThree="" StepFour="" StepFive="" StepSix="" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}


const mapDispatchToProps = {
	setCampaignName: campaignActions.setCampaignName,
};

MailingWizard.propTypes = {
	setCampaignName: PropTypes.func,
};
export default connect(null, mapDispatchToProps)(MailingWizard);