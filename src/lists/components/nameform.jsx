import { Link } from "react-router";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";


class NameForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			campaignName: "",
			listName: "",
			senderName: "",
			streetAddress: "",
			streetAddress2: "",
			senderCity: "",
			senderState: "",
			senderZip: "",
			senderEmail: ""
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			campaignName: nextProps.campaignName,
			senderName: nextProps.userInfo.first_name + " " + nextProps.userInfo.last_name,
			streetAddress: nextProps.accountInfo.address && nextProps.accountInfo.address.address_1,
			streetAddress2: nextProps.accountInfo.address && nextProps.accountInfo.address.address_2,
			senderCity: nextProps.accountInfo.address && nextProps.accountInfo.address.address_city,
			senderState: nextProps.accountInfo.address && nextProps.accountInfo.address.address_state,
			senderZip: nextProps.accountInfo.address && nextProps.accountInfo.address.address_zip,
			senderEmail: nextProps.userInfo.email_address
		})
	}

	handleChange = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	}

	handleSubmit = (evt) => {
		alert("you submitted: " + this.state.campaignName + ", " + this.state.listName + ", " + this.state.senderName + ", " + this.state.streetAddress + ", " + this.state.streetAddress2 + ", " + this.state.senderCity + ", " + this.state.senderState + ", " + this.state.senderZip + ", " + this.state.senderEmail);
		evt.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div className="whitebox">
					<div className="ribbonTitle center teal">
						Create Your New List
					</div>

					<div className="listForm">
						<div className="listFormRow">
							<div className="listFormField">
								<label>Campaign Name</label>
							</div>
							<div className="listFormField">
								<input
									className="formInput"
									type="text"
									placeholder={this.props.campaignName}
									name="campaignName"
									value={this.state.campaignName}
									onChange={this.handleChange}
								/>
							</div>
						</div>

						<div className="listFormRow">
							<div className="listFormField">
								<label>List Name</label>
							</div>
							<div className="listFormField">
								<input
									className="formInput"
									type="text"
									name="listName"
									value={this.state.listName}
									onChange={this.handleChange}
								/>
							</div>
						</div>

						<div className="listFormRow">
							<div className="listFormField">
								<label>Default Sender Name</label>
							</div>
							<div className="listFormField">
								<input
									placeholder={this.props.userInfo.first_name + " " + this.props.userInfo.last_name}
									className="formInput"
									type="text"
									name="senderName"
									value={this.state.senderName}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="listFormRow">
							<div className="listFormField">
								<label>Default Street Address</label>
							</div>
							<div className="listFormField">
								<input
									className="formInput"
									type="text"
									name="streetAddress"
									value={this.state.streetAddress}
									onChange={this.handleChange}
								/>
							</div>
						</div>

						<div className="listFormRow">
							<div className="listFormField">
								<label></label>
							</div>
							<div className="listFormField">
								<input
									className="formInput"
									type="text"
									name="streetAddress2"
									value={this.state.streetAddress2}
									onChange={this.handleChange}
								/>
							</div>
						</div>

						<div className="listFormRow">
							<div className="listFormField">
								<label>City</label>
							</div>
							<div className="listFormField">
								<input
									placeholder={this.props.accountInfo.address && this.props.accountInfo.address.address_city}
									className="formInput"
									type="text"
									name="senderCity"
									value={this.state.senderCity}
									onChange={this.handleChange}
								/>
							</div>
						</div>

						<div className="listFormRow">
							<div className="listFormField">
								<label>State</label>
							</div>
							<div className="listFormField">
								<input
									placeholder={this.props.accountInfo.address && this.props.accountInfo.address.address_state}
									className="formInput"
									type="text"
									name="senderState"
									value={this.state.senderState}
									onChange={this.handleChange}
								/>
							</div>
						</div>

						<div className="listFormRow">
							<div className="listFormField">
								<label>Zip</label>
							</div>
							<div className="listFormField">
								<input
									placeholder={this.props.accountInfo.address && this.props.accountInfo.address.address_zip}
									className="formInput"
									type="text"
									name="senderZip"
									value={this.state.senderZip}
									onChange={this.handleChange}
								/>
							</div>
						</div>

						<div className="listFormRow">
							<div className="listFormField">
								<label>Default Sender Email</label>
							</div>
							<div className="listFormField">
								<input
									placeholder={this.props.userInfo.email_address}
									className="formInput"
									type="text"
									name="senderEmail"
									value={this.state.senderEmail}
									onChange={this.handleChange}
								/>
							</div>
						</div>
					</div>

					<div className="center p-b-20 p-t-10">
						<button type="submit" className="ui button btn-primary">
							NEXT
						</button>
					</div>
					<div>
						<Link to="/importfile">
							<span>Next Page</span>
						</Link>
					</div>
				</div>

			</form>
		);
	}
}
function mapStateToProps(state) {
	return {
		campaignName: state.CampaignReducer.campaignName,
		userInfo: state.CampaignReducer.userInfo,
		accountInfo: state.CampaignReducer.accountInfo,
	};
}

NameForm.propTypes = {
	campaignName: PropTypes.string,
	userInfo: PropTypes.object,
	accountInfo: PropTypes.object
};

export default connect(mapStateToProps)(NameForm);
