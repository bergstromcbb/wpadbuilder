import React from "react";
import DashRibbonPiece from "./dashboard/DashRibbonPiece";
import DoughnutComponent from "./dashboard/doughnutcomponent";


class Home extends React.Component {

	render() {

		return (
			<div>
				<div className="m-t-60 p-l-10">
					<div className="topHeaderContainer flex ribbon m-r-0">
						<DashRibbonPiece/>
					</div>
					<div className="container-fixed-lg">
						<div className="panel panel-transparent m-t-10">
							<div className="panel-heading ">
								<div className="title-main m-l-20">Your Campaigns
								</div>
							</div>
						</div>
					</div>
					<div className="panel-body">
						<DoughnutComponent 
							width={100}
							height={50}
							options={{
								maintainAspectRatio: false
							}}
						/>						
					</div>
				</div>


				<div className="container-fluid container-fixed-lg m-b-30">
					<div className="col-sm-12">
						<div className="panel panel-defaultx col-md-6 full-height panel-dark">
							<div className="panel-heading ">
								<div className="indvTitles">
									{/* Recent Activity */}
								</div>
							</div>
							<div className=" m-b-10 bg-white bordered">
								<div className="widget-11-2 panel no-border panel-condensed no-margin widget-loader-circle">
									<div className="panel-heading top-right">
										<div className="panel-controls">
											<ul>
												<li className="">
													<div className="dropdown">
														<a data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
															<i className="portlet-icon portlet-icon-settings"></i>
														</a>
														<ul className="dropdown-menu pull-right" role="menu">
															<li><a href="#">Campaigns</a></li>
															<li><a href="#">Promos</a></li>
															<li><a href="#">Recalls</a></li>
														</ul>
													</div>
												</li>
												<li><a data-toggle="refresh" className="portlet-refresh text-black" href="#"><i className="portlet-icon portlet-icon-refresh"></i></a></li>
											</ul>
										</div>
									</div>
									<div className="p-r-10 p-l-10">
										<div className="pull-left">
											<h4 className="title-2">Delivered Campaigns</h4>
											<p className="m-t-7"></p>
										</div>
										<div className="clearfix"></div>
									</div>
									<div className="auto-overflow widget-11-2-table">
										<table className="table table-condensed table-hover">
											<thead>
												<tr className="bg-white">
													<td className="all-caps teal fs-12 col-md-6">
														Mailing Name
													</td>
													<td className="all-caps teal fs-12 col-md-2 text-center">
														Date
													</td>
													<td className="all-caps teal fs-12 col-md-2 text-right">
														Order #
													</td>
													<td className="all-caps teal fs-12 col-md-2 text-right">
														Total
													</td>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className="all-caps fs-12 col-lg-6">Spring Sale</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/12/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="hint-text small">#14002</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="hint-text small">$210.34</span>
													</td>
												</tr>
												<tr>
													<td className="all-caps fs-12 col-lg-6">Brake Special</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/10/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="small">#13998</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="small">$345.45</span>
													</td>
												</tr>
												<tr>
													<td className="all-caps fs-12 col-lg-6">Diesel Maintenance</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/7/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="small">#13986</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="small">$252.15</span>
													</td>
												</tr>
												<tr>
													<td className="all-caps fs-12 col-lg-6">Jeep Wave</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/5/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="small">#13982</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="small">$567.22</span>
													</td>
												</tr>
												<tr>
													<td className="all-caps fs-12 col-lg-6">Tire Center</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/2/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="small">#13967</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="small">$69.34</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
									<div className="padding-15">
										<p className="small no-margin">
											<a href="mailings.html"><i className="fa m-r-10 fs-16 fa-arrow-circle-o-down text-success"></i>
												<span className="hint-text fs-12">View more campaigns</span></a>
										</p>
									</div>
								</div>
							</div>
						</div>


						<div className="panel panel-default col-md-6 full-height panel-dark">
							<div className="panel-heading ">
								<div className="panel-title indvTitles">
									{/* Scheduled */}
								</div>
							</div>
							<div className="m-b-10 bg-white bordered">
								<div className="widget-11-2 panel no-border panel-condensed no-margin widget-loader-circle">
									<div className="panel-heading top-right">
										<div className="panel-controls">
											<ul>
												<li className="">
													<div className="dropdown">
														<a data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
															<i className="portlet-icon portlet-icon-settings"></i>
														</a>
														<ul className="dropdown-menu pull-right" role="menu">
															<li><a href="#">Campaigns</a></li>
															<li><a href="#">Promos</a></li>
															<li><a href="#">Recalls</a></li>
														</ul>
													</div>
												</li>
												<li><a data-toggle="refresh" className="portlet-refresh text-black" href="#"><i className="portlet-icon portlet-icon-refresh"></i></a></li>
											</ul>
										</div>
									</div>
									<div className="p-r-10 p-l-10">
										<div className="pull-left">
											<span className="title-2">Scheduled Campaigns</span>
											<p className="m-t-7"></p>
										</div>
										<div className="clearfix"></div>
									</div>
									<div className="auto-overflow widget-11-2-table">
										<table className="table table-condensed table-hover">
											<tbody>
												<tr>
													<td className="all-caps teal fs-12 col-md-6">
												Mailing Name
													</td>
													<td className="all-caps teal fs-12 col-md-2 text-center">
														Date
													</td>
													<td className="all-caps teal fs-12 col-md-2 text-right">
														Order #
													</td>
													<td className="all-caps teal fs-12 col-md-2 text-right">
														Total
													</td>
												</tr>
												<tr>
													<td className="  all-caps fs-12 col-lg-6">Spring Sale</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/12/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="small">#14002</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="small">$210.34</span>
													</td>
												</tr>
												<tr>
													<td className="  all-caps fs-12 col-lg-6">Brake Special</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/10/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="small">#13998</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="small">$345.45</span>
													</td>
												</tr>
												<tr>
													<td className="all-caps fs-12 col-lg-6">Diesel Maintenance</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/7/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="small">#13986</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="small">$252.15</span>
													</td>
												</tr>
												<tr>
													<td className="all-caps fs-12 col-lg-6">Jeep Wave</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/5/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="small">#13982</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="small">$567.22</span>
													</td>
												</tr>
												<tr>
													<td className="all-caps fs-12 col-lg-6">Tire Center</td>
													<td className="text-center col-lg-3">
														<span className="hint-text small">3/2/17</span>
													</td>
													<td className="text-right hidden-lgx">
														<span className="small">#13967</span>
													</td>
													<td className="col-lg-3 text-right b-r b-dashed b-grey">
														<span className="small">$69.34</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
									<div className="padding-15">
										<p className="small no-margin">
											<a href="mailings.html"><i className="fa fs-16 m-r-10 fa-arrow-circle-o-down text-success"></i>
												<span className="hint-text fs-12">View more campaigns</span></a>
										</p>
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
export default Home;
