import React from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as campaignActions from "../../campaigns/actions/campaignActions";
import { Modal, Accordion } from "semantic-ui-react";
//import StepsMenu from "../../campaign/component/stepsmenu";
import axios from "axios";
import Noty from "noty";
import InfiniteScroll from "react-infinite-scroller";

class SubCategory extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: null,
			// accordion
			activeIndex: "",
			// inifinite scroll
			hasMoreItems: false,
			// modal
			openModal: false,
			dimmer: "inverted",
			// pagination
			offset: 0
		};
	}

	/*
	componentDidMount() {
		axios.get("https://private-8e550-directmail.apiary-mock.com/v1/templates").then(
			response  => this.setState({ loading: false, data: response.data })
		).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not retrieve your data at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}
	*/

	componentDidMount() {
		// get page data
		this.getRemoteData();
	}

	// Get templates within a category
	getRemoteData = () => {
		this.setState({ loading: true });
		// Define the request url
		const url = "https://private-8e550-directmail.apiary-mock.com/v1/templates";

		axios.get(url,{
			limit: 14,
			offset: this.state.offset
		}).then(response => {
			// update this.state.data to store these records
			this.setState({
				data: response.data.templates,
				pageCount: Math.ceil(response.data.paging.total / 14),
				loading: false,
				hasMoreItems: (response.data.paging.total > 0) ? true : false
			});
		}).catch(error => {
				console.log("Error loading the page", error);
				this.setState({ loading: false, error: error });

				// Show error notification
				new Noty({
					text: "We could not perform this action at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			});
	}

	// modal
	showModal = dimmer => () => this.setState({ dimmer, openModal: true })
	closeModal = () => this.setState({ openModal: false })

	handleClick = (e, titleProps) => {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;
	
		this.setState({ activeIndex: newIndex });
	}

	render() {
		if (this.state.loading) {
			return <span>Loading...</span>;
		}
		else if (this.state.error !== null) {
			return <span>Error: {this.state.error.message}</span>;
		}
		else {
			const { activeIndex } = this.state;
			var templates = this.state.data.subcategories[this.props.subcategoryId].templates;	
		
			{/*
			var categoryList = templates.map((template, index) => {
				return (
					<section className="subtemplates" key={index}>
						<Link to="/mailingwizardthree" onClick={() => this.props.setTemplateName(template.template_name)}>
							<img className="img-responsive subtempImg" src={template.thumbnail}/>
						</Link>

						<div className="fs-13 subtempbox" >{template.template_name}
						</div>
						<div className="all-caps fs-13 padding-5 text-muted border-top sizeBox">{template.size}
							<span className="pull-right">
								<span className="circle-step-grey step-size-18 step-circle" data-toggle="tooltip" data-placement="top" title="Mailed to Recipients">
									<span>
										<i className="fa fa-paper-plane"></i>
									</span>
								</span>&nbsp;
								<span className="circle-step-grey step-size-18 step-circle" data-toggle="tooltip" data-placement="top" title="Shipped to you">
									<span>
										<i className="fa fa-male"></i>
									</span>
								</span>&nbsp;
								<span className="circle-step-grey step-size-18 step-circle" data-toggle="tooltip" data-placement="top" title="Download immediately">
									<span>
										<i className="fa fa-cloud-download"></i>
									</span>
								</span>&nbsp;
							</span>
						</div>
					</section>
				);
			});
			*/}

			var categoryList = templates.map((template, index) => {
				return (
					<div className="gallery-image" key={index}>
						<a title="Template" onClick={this.showModal("inverted")}>
							<img src={template.thumbnail} className="img-responsive" />
						</a>
						<div className="bg-white" style={{ padding: "5px" }}>
							<div className="all-caps font-montserrat fs-10 no-padding">{template.template_name}</div>
						</div>
						<div className="bg-white" style={{ padding: "5px" }}>
							<div className="all-caps font-montserrat fs-10 full-height padding-5 text-muted border-top">
								{template.size}
								
								<span className="pull-right">
									<span className="btn circle-step-grey step-size-18 step-circle" data-toggle="tooltip" data-placement="top" title="" data-original-title="Mailed to Recipients">
										<span>
											<i className="fa fa-paper-plane"></i>
										</span>
									</span>&nbsp;
									<span className="btn circle-step-grey step-size-18 step-circle" data-toggle="tooltip" data-placement="top" title="" data-original-title="Shipped to you">
										<span>
											<i className="fa fa-male"></i>
										</span>
									</span>&nbsp;
									<span className="btn circle-step-grey step-size-18 step-circle" data-toggle="tooltip" data-placement="top" title="" data-original-title="Download immediately">
										<span>
											<i className="fa fa-cloud-download"></i>
										</span>
									</span>&nbsp;
								</span>
							</div>
						</div>
					</div>
				);
			});
			
			return (
				/*
				<main>
					<div className="overallcontainer">
						{categoryList}
					</div>
				</main>
				*/

				<div className="overallcontainer">
					<InfiniteScroll
						pageStart={0}
						loadMore={this.getRemoteData}
						hasMore={this.state.hasMoreItems}
						loader={<div className="loader">Loading ...</div>}
					>
						{categoryList}
					</InfiniteScroll>				

					<Modal dimmer={this.state.dimmer} open={this.state.openModal} onClose={this.closeModal} size="large">
						<Modal.Header>Template Details</Modal.Header>
						<Modal.Content>
							<div className="row dialog__overview">
								<div className="col-sm-7 no-padding item-slideshow-wrapper full-height bg-master-lighter">
									<div className="item-slideshow full-height owl-carousel owl-theme owl-loaded">

										<div className="owl-stage-outer">
											<div className="owl-stage" style={{ width: "100%" }}>
												<div className="owl-item active" style={{width: "100%"}}> {/*  margin-right: "0px" */}
													<img src="../images/thumbnail1.jpg" className="img-responsive" />
												</div>
											</div>
										</div>

									</div>
								</div>

								<div className="col-sm-5 p-l-30 p-r-30 full-height border-leftx">
									<span className="font-montserrat all-caps fs-11">TEMPLATE NAME</span>
									<h5 className="semi-bold no-margin font-montserrat">Holiday Travel 11x6</h5>

									<p className="fs-13 p-t-20">
									When it comes to digital design, the lines between functionality, aesthetics, and psychology are inseparably blurred.
									Without the constraints of the physical world, there’s no natural form to fall back on.
									</p>

									<div className="m-t-20">
										<div className="font-montserrat all-caps fs-11">Mailer Size</div>
										<div>11 x 6</div>
									</div>

									<div className="m-t-20">
										<div className="font-montserrat all-caps fs-11">AVAILABLE FORMATS</div>
										<div className="table steps">
											<Accordion>													
												<Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
													<div className="table-row">
														<div className="table-cell nopadding middle" style={{width:"1%"}}>
															<span className="btn circle-step-grey step-size-28 step-circle"><i className="fa fa-paper-plane"></i></span>
														</div>
														<div className="table-cell nopadding">
															<div>
																<span className="semi-bold">Mailed To Recipients</span>
																<span className="pull-right"><a role="button">Pricing <i className="fa fa-angle-down"></i></a></span>
															</div>
															<div className="color1 small">Sent directly to the recipients</div>
														</div>
													</div>
												</Accordion.Title>

												<Accordion.Content active={activeIndex === 0}>
													<div id="condensedTable_wrapper" className="dataTables_wrapper form-inline no-footer">
														<table className="table table-hoverx table-condensed dataTable bordered" id="condensedTable" role="grid">
															<thead>
																<tr role="row">
																	<th className="bg-master-lighter" style={{ width: "50%"}} rowSpan="1" colSpan="1">Qty</th>
																	<th className="bg-master-lighter" style={{ width: "50%"}} rowSpan="1" colSpan="1">Price</th>
																</tr>
															</thead>
															<tbody>
																<tr role="row" className="odd">
																	<td className="v-align-middle">1-10,000</td>
																	<td className="v-align-middle">$0.45/piece</td>
																</tr>
																<tr role="row" className="even">
																	<td className="v-align-middle">10,001-25,000</td>
																	<td className="v-align-middle">$0.39/piece</td>
																</tr>
																<tr role="row" className="odd">
																	<td className="v-align-middle">25,001-50,000</td>
																	<td className="v-align-middle">$0.28/piece</td>
																</tr>
																<tr role="row" className="even">
																	<td className="v-align-middle">50,001 +</td>
																	<td className="v-align-middle">$0.21/piece</td>
																</tr>
															</tbody>
														</table>
													</div>
												</Accordion.Content>


												<Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
													<div className="table-row">
														<div className="table-cell nopadding middle" style={{width:"1%"}}>
															<span className="btn circle-step-grey step-size-28 step-circle"><i className="fa fa-male"></i></span>
														</div>
														<div className="table-cell nopadding">
															<div>
																<span className="semi-bold">Shipped to You</span>
																<span className="pull-right"><a role="button">Pricing <i className="fa fa-angle-down"></i></a></span>
															</div>
															<div className="color1 small">All items are sent to you</div>
														</div>
													</div>
												</Accordion.Title>

												<Accordion.Content active={activeIndex === 1}>
													<div id="condensedTable_wrapper" className="dataTables_wrapper form-inline no-footer">
														<table className="table table-hoverx table-condensed dataTable bordered" id="condensedTable" role="grid">
															<thead>
																<tr role="row">
																	<th className="bg-master-lighter" style={{width: "50%"}} rowSpan="1" colSpan="1">Qty</th>
																	<th className="bg-master-lighter" style={{width: "50%"}} rowSpan="1" colSpan="1">Price</th>
																</tr>
															</thead>
															<tbody>
																<tr role="row" className="odd">
																	<td className="v-align-middle">1-20,000</td>
																	<td className="v-align-middle">$0.21/piece</td>
																</tr>
															</tbody>
														</table>
													</div>
												</Accordion.Content>
												

												<Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
													<div className="table-row">
														<div className="table-cell nopadding middle" style={{width:"1%"}}>
															<span className="btn circle-step-grey step-size-28 step-circle"><i className="fa fa-cloud-download"></i></span>
														</div>
														<div className="table-cell nopadding">
															<div>
																<span className="semi-bold">Download immediately</span>
																<span className="pull-right"><a role="button">Pricing <i className="fa fa-angle-down"></i></a></span>
															</div>
															<div className="color1 small">Download the item today</div>
														</div>
													</div>
												</Accordion.Title>
												
												<Accordion.Content active={activeIndex === 2}>
													<div id="condensedTable_wrapper" className="dataTables_wrapper form-inline no-footer">
														<table className="table table-hoverx table-condensed dataTable bordered" id="condensedTable" role="grid">
															<thead>
																<tr role="row">
																	<th className="bg-master-lighter" style={{width: "50%"}} rowSpan="1" colSpan="1">Qty</th>
																	<th className="bg-master-lighter" style={{width: "50%"}} rowSpan="1" colSpan="1">Price</th>
																</tr>
															</thead>
															<tbody>
																<tr role="row" className="odd">
																	<td className="v-align-middle">Any</td>
																	<td className="v-align-middle">$0.03/piece</td>
																</tr>
															</tbody>
														</table>
													</div>
												</Accordion.Content>
											</Accordion>
										</div>
									</div>

									<div className="clear">
										<Link to="/editor/1234567890" className="ui button btn-primary">Use this template</Link>
									</div>
								</div>
							</div>
						</Modal.Content>
					</Modal>					
				</div>
			);
		}
	}
}
const mapDispatchToProps = {
	setTemplateName: campaignActions.setTemplateName,
};

SubCategory.propTypes = {
	subcategoryId: PropTypes.string.isRequired,
	setTemplateName: PropTypes.func

};
export default connect(null, mapDispatchToProps)(SubCategory);