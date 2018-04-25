import React from "react";
import { hashHistory } from "react-router";
import AccountTabs from "../../account/components/accountTabs";
import axios from "axios";
import Noty from "noty";
import { Form } from "formsy-react-es6";
import Input from "../../../assets/js/Input";
import Radio from "../../../assets/js/Radio";
import Textarea from "../../../assets/js/Textarea";
import { Link } from "react-router";

class Invite extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			// formsy
			canSubmit: false,
			inputValue: ""		
		};
	}

	// Send invite, collect form data and makes API call
	onSendInvite = (data) => {
		this.setState({ loading: true });
		const accountid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		const url = `https://private-8e550-directmail.apiary-mock.com/accounts/${accountid}/users/invite`;
		const formData = {
			first_name: data.first_name,
			last_name: data.last_name,
			email_address: data.email_address,
			role: data.role,
			account_id: accountid,
			message: data.message
		};

		// submit form data to api
		axios.post(url, {
			formData
		}).then(response => {
			if (response.status == 200) {
				// send to members page for this list
				hashHistory.push("/users");
					
				// Show success notification
				new Noty({
					text: `The invitation was sent to ${data.first_name}`,
					type: "success",
					timeout: "3500"
				}).show();
			} else {
				// Show error notification
				throw "API error";
			}
			
		}).catch(error => {
			console.log("Error sending the invitation", error);
	
			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
		
		this.setState({ loading: false });
	}
	
	// Update the state of the Formsy form
	enableFormButton = () => {
		this.setState({ canSubmit: true });
	}
	disableFormButton = () => {
		this.setState({ canSubmit: false });
	}	
	
	render() {
		return (
			<div className="content m-t-70">
				<div className="content">
					<div className="ribbon p-l-10">
						<ul className="breadcrumb">
							<li><Link to="Home">Home</Link></li>
							<li><Link to="users">Users</Link></li>
							<li>Invite User</li>
						</ul>
						<h5 className="page-title">Invite User</h5>
					</div>

				</div>

				<div className="p-t-30 p-l-10 p-r-30">
					<p>Your mailings may show your dealership name,
						address and hours of operation on templates.
					</p>
					<div className="p-t-20 clear">
						<AccountTabs activeTab="1" />

						<Form className="form"
							onSubmit={this.onSendInvite}
							onValid={this.enableFormButton}
							onInvalid={this.disableFormButton}
						>
							<div className="p-t-30">
								<div className="padding-20">

									<div className="col-md-6">
										<div className="panel panel-white">			
											<div className="panel-heading">
												<div className="panel-title" id="invitecontact">CONTACT INFORMATION</div>
											</div>
											<div className="panel-body p-t-30">

												<div className="form-group">
													<label htmlFor="first_name" className="col-sm-4">First Name</label>
													<div className="col-sm-8">
														<Input type="text" name="first_name"
															onChange={this.state.handleFormItemChange}
															placeholder="First name" required
														/>
													</div>
												</div>

												<div className="form-group">
													<label htmlFor="last_name" className="col-sm-4">Last Name</label>
													<div className="col-sm-8">
														<Input type="text" name="last_name"
															onChange={this.state.handleFormItemChange}										
															placeholder="Last name" required />
													</div>
												</div>

												<div className="form-group">
													<label htmlFor="email_address" className="col-sm-4">Email Address</label>
													<div className="col-sm-8">
														<Input type="text" name="email_address"
															onChange={this.state.handleFormItemChange}
															placeholder="Email address" validations="isEmail"
															validationError="Enter a valid email" required />
													</div>
												</div>
												
												<div className="clear p-t-30 p-l-20">
													<div className="form-group">
														<label>A message from you (optional)</label><br/>
														<Textarea name="message"
															rows={5} cols={80}
															className="form-control"
															placeholder="Join us on AMP Direct Mail"></Textarea>
													</div>
													<br className="clear" /><br />
												</div>
											</div>
										</div>
										
										<div className="p-t-30">												
											<button type="submit"
												disabled={!this.state.canSubmit}
												className="ui button btn-primary"
											>Send</button>
										</div>
									</div>

									<div className="col-md-6">
										<div className="panel panel-white">
											<div className="panel-heading">
												<div className="panel-title">PERMISSIONS</div>
											</div>
											<div className="panel-body p-t-20 p-l-30 p-r-30">
												<div className="form-group">
													<div className="radio radio-primary">
														<Radio name="role" item={{ label: "Viewer", value: "viewer" }} value="viewer" />
														<p className="p-l-5">Can only access reports.</p>
													</div>
													<div className="radio radio-primary p-t-20">
														<Radio name="role" item={{label:"Author",value:"author"}} />
														<p className="p-l-5">Can notify managers and admins when a campaign is ready to go. They can create, design, and edit campaigns, but not send them.</p>
													</div>
													<div className="radio radio-primary p-t-20">
														<Radio name="role" item={{label:"Manager",value:"manager"}} />
														<p className="p-l-5">Can design templates, send campaigns, manage mailing lists, and view reports.</p>
													</div>
													<div className="radio radio-primary p-t-20">
														<Radio name="role" item={{label:"Admin",value:"admin"}} />
														<p className="p-l-5">Have total access to all features. Only Admins can handle billing and assign user privileges.</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Form>
						<br className="clear" /><br />
					</div>
				</div>
			</div>
		);
	}
}
export default Invite;
