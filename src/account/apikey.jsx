import React from "react";
import { Link } from "react-router";

class ApiKey extends React.Component {
	render() {
		return (
			<div className="m-t-60 m-l-20">
				<div className="topHeaderContainer ribbon row p-0">
					<div className="headerItemLeft ">
						<ul className="breadcrumb">
							<li className=""><a className="small semi-bold" href="index.html">Home</a></li>
							<li><Link to="/apikey" activeClassName="active">API Key</Link></li>
						</ul>
						<p className="panel-title teal all-caps threeHundred">API Key</p>
					</div>
					<div className="headerItemRight border-left p-t-17 newList">
						<button id="btnAdd" type="button" className="ui button btn-primary">Create a key</button>
					</div>
				</div>
				<div className="container-fixed-lg">
					<div className="panel panel-transparent m-t-10">
						<div className="panel-heading">
							<div className="panel-title semi-bold teal">
								<span className="categorytitle">
									<i className="fa fa-send teal">
									</i>
									<span className="p-l-10">Create A New API Key</span>
								</span>
							</div>
						</div>
						<div className="panel-body">
							<div className="container-fluid container-fixed-lg bg-white">
								<div className="row">
									<div className="col-md-12">

										<div className="panel">
											<ul className="nav nav-tabs nav-tabs-simple hidden-xs" role="tablist" data-init-reponsive-tabs="collapse">
												<li><a href="AccountProfile.html">Profile</a></li>
												<li role="presentation" className="dropdown active">
													<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                                          Account
													</a>
													<ul className="dropdown-menu">
														<li><a href="settings.html">Settings</a></li>
														<li><a href="users.html">Users</a></li>
														<li><a href="apikey.html" className="active">API Key</a></li>
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

											<div className="tab-content55 hidden-xs555">
												<div className="row p-t-40 clear">
													<div className="col-xs-12">
														<div className="container-xs-height">
															<div className="row-xs-height">

																<div id="nokey">
																	<form role="form">
																		<div className="row">
																			<p>{"You don't have an active API key yet. "}<a href="javascript:void(0)" id="btnAdd">Create one now</a>.</p>
																		</div>
																	</form>
																</div>

																<div id="tableWithSearch_wrapper" className="dataTables_wrapper form-inline no-footer">
																	<div>
																		<table id="table-mailings" className="table table-hover555 demo-table-search table-responsive-block dataTable no-footer" role="grid">
																			<thead>
																				<tr role="row">
																					<th tabIndex="0" rowSpan="1" colSpan="1" aria-sort="ascending" aria-label="Created: activate to sort column descending">Created</th>
																					<th tabIndex="0" rowSpan="1" colSpan="1">User</th>
																					<th tabIndex="0" rowSpan="1" colSpan="1">Label</th>
																					<th tabIndex="0" rowSpan="1" colSpan="1">API Key</th>
																					<th tabIndex="0" rowSpan="1" colSpan="1">Status</th>
																				</tr>
																			</thead>
																			<tbody>
																				<tr role="row" className="odd">
																					<td className="v-align-middle sorting_1">
																						<p>Feb 21, 2017</p>
																					</td>
																					<td className="v-align-middle">
																						<p>Jim Champion</p>
																					</td>
																					<td className="v-align-middle">
																						<p>None set</p>
																					</td>
																					<td className="v-align-middle">
																						<input id="apikey" type="text" value="74b68ba6792c451c3a641f43acc03c90-us14" className="form-control"/>
																					</td>
																					<td>
																						<input type="checkbox" data-init-plugin="switchery" data-color="primary" checked="checked" />
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</div>
																</div>

															</div>
														</div>
													</div>
												</div>
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
export default ApiKey;
