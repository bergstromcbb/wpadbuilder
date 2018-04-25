import { Link } from "react-router";
import { connect } from "react-redux";
import * as campaignActions from "./actions/campaignActions";
import { Button, Icon, Checkbox, Popup } from "semantic-ui-react";
// import Moment from "react-moment";
import PropTypes from "prop-types";
import React from "react";
import DayPicker from "react-day-picker";
import RibbonPiece from "./component/RibbonPiece";
import StepsMenu from "./component/stepsmenu";

export class MailingWizardFour extends React.Component {
	constructor(props) {
		super(props);
		this.handleDatePickerClick = this.handleDatePickerClick.bind(this);
	}

	handleDatePickerClick = day => {
		this.props.setDeliveryDate(day);
	}

	render() {
		const weekends = {
			daysOfWeek: [0, 6],
		};
		return (
			<div className="m-t-60">
				<div className="topHeaderContainer flex ribbon m-r-0">
					<RibbonPiece progressAmount="72%"/>
				</div>

				<div className="full-height">
					<div className="full-height flex hundred">
						<div className="col-sm-9">
							<h6>
								<i className="pg-layouts4"></i>  
								<span className="semi-bold p-l-5">
									Schedule Delivery
								</span>
							</h6>
							<p>Lorem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem </p>
							<br />
							<div className="half">
								<div className="col-sm-12">			
									<div className="col-sm-3"></div>
									<div className="col-sm-6">
										<p className="text-center">Choose In-Home Date</p>			
										<DayPicker 
											onDayClick={this.handleDatePickerClick}
											selectedDays={this.props.deliveryDate}
											disabledDays={weekends}
										/></div>
									<div className="col-sm-3"></div>
								</div>
								
								<div className="col-sm-12">
									<p className="text-center">Mail Delivery Type
									<Popup inverted
										trigger={<Icon link name='help ' />}
										content="Standard Presort (3rd Class) can take up to three weeks for delivery and is $0.10 less expensive per mailer."
										basic
									/>
									</p>
									<br />
									<div className="text-center">
										<Button.Group>
											<Button>First Class</Button>
											<Button.Or />
											<Button>Standard Presort</Button>
										</Button.Group>
									</div>

									<div className="checkbox check-primary p-t-40 text-center">
										<input type="checkbox" value="Y" id="checkbox9" />
										<Checkbox label='Send within 3 business days' />
									</div>
								</div>
								
								<div className="clear col-xs-12">
									<Link to="/Summary">
										<Button className="ui button btn-primary">Next</Button>
									</Link>		
								</div>	
							</div>
							
						</div>
						<div className="col-sm-3">				
							<StepsMenu StepOne=" completed" StepTwo=" completed" StepThree=" completed" StepFour=" completed" StepFive=" active" StepSix="" />
						</div>
					</div>
				</div>						
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		deliveryDate: state.deliveryDate,
	};
}

const mapDispatchToProps = {
	setDeliveryDate: campaignActions.setDeliveryDate,
};

MailingWizardFour.propTypes = {
	setDeliveryDate: PropTypes.func,
	deliveryDate: PropTypes.instanceOf(Date),
};

export default connect(mapStateToProps, mapDispatchToProps)(MailingWizardFour);
