import React from "react";
import { Link } from "react-router";


class Settings extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			isGoing1: true,
			isGoing2: false,
			isGoing3: false,
		};

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	render() {
		return (
			<div className="m-t-60 m-l-20">
				<div className="topHeaderContainer ribbon row p-0">
					<div className="headerItemLeft ">
						<ul className="breadcrumb">
							<li><a className="small semi-bold" href="index.html">Home</a></li>
							<li><a href="settings.html" activeClassName="active">Settings</a></li>
						</ul>
						<p className="panel-title teal all-caps threeHundred">Settings</p>
					</div>
					<div className="col-sm-3 full-height border-left p-t-20 text-center">
						&nbsp;
					</div>
				</div>

				<div className="bg-white padding-30">
					<div className="bg-white">
						<div className="row">
							<div className="col-md-12">
								<p>Company or organization information. Information about this account, such as campaign send notifications, will be sent to the email address listed here.
									This is also the information we have associated with your payment method.</p>
							</div>

							<div className="col-md-12">
								<ul className="nav nav-tabs nav-tabs-simple hidden-xs" role="tablist" data-init-reponsive-tabs="collapse">
									<li><Link to="/AccountProfile" activeClassName="active" className="p-l-20 teal">Profile</Link></li>
									<li role="presentation" className="dropdown active">
										<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
											Account
										</a>
										<ul className="dropdown-menu">
											<li><Link to="/settings" activeClassName="active" className="p-l-20 teal">Settings</Link></li>
											<li><Link to="/users" activeClassName="active" className="p-l-20 teal">Users</Link></li>
											<li><Link to="/apikey" activeClassName="active" className="p-l-20 teal">API Key</Link></li>
										</ul>
									</li>
									<li role="presentation" className="dropdown">
										<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
										Billing
										</a>
										<ul className="dropdown-menu">
											<li><Link to="/history" activeClassName="active" className="p-l-20 teal">History</Link></li>
										</ul>
									</li>
								</ul>
								<div className="panel-group visible-xs" id="V1a5s-accordion"></div>

								<div className="row p-t-40">
									<div className="col-md-6">
										<div className="panel panel-dark">
											<div className="panel-heading">
												<div className="panel-title">ACCOUNT INFORMATION
												</div>
											</div>
											<div className="panel-body">
												<form role="form">

													<div className="row form-group-attachedx">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>Account Name</label>
																<input id="accountname" type="text" className="form-control" placeholder="Type account name" />
															</div>
														</div>
													</div>

													<div className="row form-group-attachedx">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx form-group-defaultx-select2 required">
																<label className="">Timezone</label>
																<select className="full-width" data-placeholder="Select timezone" data-init-plugin="select2">
																	<option value="AK">Alaskan/Hawaiian Time Zone</option>
																	<option value="HI">Pacific Time Zone</option>
																</select>
															</div>
														</div>
													</div>

													<div>
														<div className="col-sm-12">
															<button id="btnSave" type="button" className="ui button btn-primary pull-left inline">Update</button>
														</div>
													</div>
												</form>
											</div>
										</div>
									</div>

									<div className="col-md-6">
										<div className="panel panel-dark">
											<div className="panel-heading">
												<div className="panel-title">COMPANY CONTACT</div>
											</div>
											<div className="panel-body">
												<form role="form">
													<div className="row">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>Contact Name</label>
																<input id="contactname" type="text" className="form-control" placeholder="Type contact name" />
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>Address</label>
																<input id="address1" type="text" className="form-control" placeholder="Type address 1" />
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>Address 2</label>
																<input id="address2" type="text" className="form-control" placeholder="Type address 2" />
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-sm-6">
															<div className="form-group form-group-defaultx">
																<label>City</label>
																<input id="city" type="text" className="form-control" placeholder="Type city" />
															</div>
														</div>
														<div className="col-sm-3">
															<div className="form-group form-group-defaultx form-group-defaultx-select2 required">
																<label className="">State</label>
																<select className="full-width" data-placeholder="Select state" data-init-plugin="select2">
																	<optgroup label="Alaskan/Hawaiian Time Zone">
																		<option value="AK">Alaska</option>
																		<option value="HI">Hawaii</option>
																	</optgroup>
																	<optgroup label="Pacific Time Zone">
																		<option value="CA">California</option>
																		<option value="NV">Nevada</option>
																		<option value="OR">Oregon</option>
																		<option value="WA">Washington</option>
																	</optgroup>
																</select>
															</div>
														</div>
														<div className="col-sm-3">
															<div className="form-group form-group-defaultx">
																<label>Zip</label>
																<input id="zip" type="text" className="form-control" placeholder="Type zip" />
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>Email</label>
																<input id="email" type="text" className="form-control" placeholder="Type email" />
															</div>
														</div>
													</div>

													<div>
														<button id="btnSave2" type="button" className="ui button btn-primary pull-left inline">Update</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default Settings;
