import React from "react";

class UserProfile extends React.Component{
	render() {
		return (
			<div className="m-t-60 m-l-20">
				<div className="topHeaderContainer ribbon row p-t-10">
					<div className="headerItemLeft ">
						<ul className="breadcrumb">
							<li><a href="index.html">Home</a></li>
							<li><a href="profile.html" className="active">Profile</a></li>
						</ul>
						<h5 className="page-title">Profile</h5>
					</div>
					<div className="col-sm-3 full-height border-left p-t-50 text-center">
                &nbsp;
					</div>
				</div>

				<div className="bg-white padding-30">
					<div className="bg-white">
						<div className="row">
							<div className="col-md-12">
								<div>
									<p>Company or organization information. Information about this account, such as campaign send notifications, will be sent to the email address listed here.
                      This is also the information we have associated with your payment method.</p>
								</div>
							</div>

							<div className="col-md-12">
								<ul className="nav nav-tabs nav-tabs-simple hidden-xs" role="tablist" data-init-reponsive-tabs="collapse">
									<li role="presentation" className="dropdown active">
										<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                                Profile
										</a>
										<ul className="dropdown-menu">
											<li><a href="profile.html">User</a></li>
											<li><a href="dealer_profile.html">Dealer</a></li>
										</ul>
									</li>
									<li role="presentation" className="dropdown">
										<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                                Account
										</a>
										<ul className="dropdown-menu">
											<li><a href="settings.html">Settings</a></li>
											<li><a href="users.html">Users</a></li>
											<li><a href="apikey.html">API Key</a></li>
										</ul>
									</li>
									<li role="presentation" className="dropdown">
										<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                                Billing
										</a>
										<ul className="dropdown-menu">
											<li><a href="billinginfo.html">Information</a></li>
											<li><a href="history.html">History</a></li>
										</ul>
									</li>
								</ul>
								<div className="panel-group visible-xs" id="V1a5s-accordion"></div>

								<div className="row p-t-40 clear">
									<div className="col-md-12">
										<div className="container-xs-height">
											<div className="row-xs-height">
												<div className="social-user-profile col-xs-height text-center col-top">
													<div className="thumbnail-wrapper d48 circular bordered b-white">
														<img alt="Avatar" width="55" height="55" data-src-retina="assets/img/profiles/avatar_small2x.jpg" data-src="assets/img/profiles/avatar.jpg" src="assets/img/profiles/avatar_small2x.jpg"/>
													</div>
												</div>
												<div className="col-xs-height p-l-20">
													<h3 className="no-margin">Jim Champion</h3>
													<p className="p-t-10">
														<button id="upload" type="button" className="ui button btn-default btn-short pull-left inline">Upload photo</button>
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="row p-t-40">
									<div className="col-md-6">
										<div className="panel panel-dark">
											<div className="panel-heading">
												<div className="panel-title">YOUR PROFILE</div>
											</div>
											<div className="panel-body">
												<form role="form">
													<div className="row">
														<div className="col-sm-6">
															<div className="form-group form-group-defaultx">
																<label>First Name</label>
																<input id="firstname" type="text" defaultValue="Jim" className="form-control" placeholder="Type first name"/>
															</div>
														</div>
														<div className="row col-sm-6">
															<div className="form-group form-group-defaultx">
																<label>Last Name</label>
																<input id="lastname" type="text" defaultValue="Champion" className="form-control" placeholder="Type last name"/>
															</div>
														</div>
													</div>

													<div className="row">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>Username</label>
																<input id="username" type="text" className="form-control" defaultValue="ghowe"/>
															</div>
														</div>
													</div>

													<div className="row">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>Email</label>
																<input id="email" type="text" defaultValue="jim@champion.com" className="form-control" placeholder="Type email"/>
															</div>
														</div>
													</div>

													<div>
														<button id="btnSave" type="button" className="ui button btn-primary pull-left inline">Update</button>
													</div>
												</form>
											</div>
										</div>
									</div>

									<div className="col-md-6">
										<div className="panel panel-dark">
											<div className="panel-heading">
												<div className="panel-title">CHANGE PASSWORD</div>
											</div>
											<div className="panel-body">
												<form role="form">
													<div className="row">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>Current Password</label>
																<input id="pass" type="text" className="form-control" placeholder="Type password"/>
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>New Password</label>
																<input id="newpass" type="text" className="form-control" placeholder="Type new password"/>
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-sm-12">
															<div className="form-group form-group-defaultx">
																<label>Confirm Password</label>
																<input id="newpass2" type="text" className="form-control" placeholder="Cofirm password"/>
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
export default UserProfile;
