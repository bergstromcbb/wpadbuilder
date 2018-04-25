import React from "react";
import { Modal, Accordion, Popup } from "semantic-ui-react";
import PropTypes from "prop-types";

class TemplatesRepeat extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			// accordion
			activeIndex: "",
			// modal
			openModal: false,
			dimmer: "blurring",
			// pagination
			offset: 0,
			previewTemplateObj: {}
		};
	}

	// modal
	showModal = dimmer => () => this.setState({ dimmer, openModal: true })
	closeModal = () => this.setState({ openModal: false })

	// Previewing a template
	onPreviewTemplateClick = (id) => {
		const viewTemplate = this.props.data.filter((item) => {
			if(item.id === id) return item;
		});

		this.setState({
			previewTemplateObj: viewTemplate[0],
			openModal: true
		});
		
		this.showModal("blurring");
	}

	onPriceClick = (e, titleProps) => {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;
	
		this.setState({ activeIndex: newIndex });
	}

	onTemplateClick = (obj) => {
		// callback function
		this.props.chooseTemplateClick(obj);
		
		this.closeModal();
	}

	onFolderClick = (obj) => {
		// callback
		this.props.chooseFolderClick(obj);
	}

	// format icons
	renderFormatIcon = (item) => {
		let friendlyName = "",
			fontIconClass = "";
		
		switch (item.format) {
		case "directmail":
			friendlyName = "Mailed to your list";
			fontIconClass = "fa fa-paper-plane";
			break;
		case "printship":
			friendlyName = "Shipped to you";
			fontIconClass = "fa fa-male";
			break;
		case "download":
			friendlyName = "Download immediately";
			fontIconClass = "fa fa-cloud-download";
			break;
		}
		
		const icon = [
			<Popup inverted
				key={item.format}
				trigger={<span className="templateCircle btn"><i className={fontIconClass}></i></span>}
				content={friendlyName}
			/>
		];
		return icon;
	}
			
	// templates
	renderItem = (item) => {
		// get format options icons for each template
		let allFormatOptionsIcons = [];
		const formats = item.options;
		formats.forEach(item => {
			const iconItem = this.renderFormatIcon(item);
			allFormatOptionsIcons = allFormatOptionsIcons.concat(iconItem);
		});

		const itemRows = [
			<div className="col-xs-12 col-sm-5 col-md-4 col-lg-3 gallery-image" key={item.id}>
				<div className={(this.props.templateId == item.id) ? "border active" : "border"}>	
					<div className="bg-white center">	
						<a title={item.template_name} onClick={() => this.onPreviewTemplateClick(item.id)}>
							<img src={item.thumbnail} className="img-responsive" />
						</a>
					</div>	
					<div className="bg-white" style={{ padding: "5px" }}>
						<div className="all-caps font-montserrat fs-12 no-padding truncate-overflow-text">
							{item.template_name}
						</div>
					</div>
					<div className="bg-white" style={{ padding: "5px" }}>
						<div className="all-caps font-montserrat fs-12 full-height padding-10 text-muted border-top">
							{item.size}
					
							<span className="pull-right">
								{allFormatOptionsIcons}
							</span>
						</div>
					</div>
				</div>	
			</div>
		];
		return itemRows;
	}

	// folders
	renderFolderItem = (item) => {
		const itemRows = [
			<div className="col-xs-12 col-sm-5 col-md-4 col-lg-3 folder-image" key={item.id}>
				<div className={(this.props.folderId == item.id) ? "border active" : "border"}>	
					<div className="bg-white center" style={{ padding: "10px" }}>
						<a title={item.name} onClick={() => this.onFolderClick(item)}>
							<img src={`../../assets/img/templates/folders/${item.image}`} />
						</a>
					</div>	
					<div className="bg-white" style={{ padding: "5px" }}>
						<div className="all-caps font-montserrat fs-12 no-padding truncate-overflow-text">
							{item.name}
						</div>
					</div>
				</div>	
			</div>
		];
		return itemRows;
	}	
	
	render() {
		// get templates
		let allTemplateItemRows = [];
		const templates = this.props.data;
		templates.forEach(item => {
			const perItemRows = this.renderItem(item);
			allTemplateItemRows = allTemplateItemRows.concat(perItemRows);
		});	

		// get folders
		let allFolderItemRows = [],
			folders = [];
		if (this.props.folderId === undefined) {
			folders = this.props.folderdata.filter((item) => {
				if (item.parent_id === "") return item;
			});
		} else {
			folders = this.props.folderdata.filter((item) => {
				if (item.parent_id === this.props.folderId) return item;
			});
		}
		folders.forEach(item => {
			const perFolderItemRows = this.renderFolderItem(item);
			allFolderItemRows = allFolderItemRows.concat(perFolderItemRows);
		});		

		const { activeIndex } = this.state;
		return (
			<div>
				<div className="alltemplates p-t-20">
					<div className={this.props.data.length > 0 ? "show" : "hide"}>
						{allFolderItemRows}

						{allTemplateItemRows}
					</div>

					<div className={this.props.data.length == 0 ? "show center clear" : "hide center clear"}>
						<h3>Your templates will be here</h3>
						<p>Once you have created your templates, you can use them in your campaigns</p>
						<p className="p-t-20">
							<img src="../../../assets/img/blank_state.png" />
						</p>	
					</div>					
				</div>

				<Modal dimmer={this.state.dimmer} open={this.state.openModal} onClose={this.closeModal} size="large">
					<Modal.Header>Template Details</Modal.Header>
					<Modal.Content>
						<div className="row dialog__overview">
							<div className="col-sm-7 no-padding item-slideshow-wrapper full-height bg-master-lighter">
								<div className="item-slideshow full-height owl-carousel owl-theme owl-loaded">

									<div className="owl-stage-outer">
										<div className="owl-stage" style={{ width: "100%" }}>
											<div className="owl-item active" style={{width: "100%"}}> {/*  margin-right: "0px" */}
												<img src={this.state.previewTemplateObj.preview} className="img-responsive border" />
											</div>
										</div>
									</div>

									<br className="clear"/><br/>									
								</div>
							</div>

							<div className="col-sm-5 p-l-30 p-r-30 full-height border-leftx">
								<span className="font-montserrat all-caps fs-11">TEMPLATE NAME</span>
								<h5 className="semi-bold no-margin font-montserrat">
									{this.state.previewTemplateObj.template_name}
								</h5>

								<div className="m-t-20">
									<div className="font-montserrat all-caps fs-11">TYPE</div>
									<div className="all-caps">{this.state.previewTemplateObj.template_type}</div>
								</div>
								
								<div className="m-t-20">
									<div className="font-montserrat all-caps fs-11">SIZE</div>
									<div>{this.state.previewTemplateObj.size}</div>
								</div>

								{this.state.previewTemplateObj.template_type == "directmail" ?
									<div className="m-t-20">
										<div className="font-montserrat all-caps fs-11">AVAILABLE FORMATS</div>
										<div className="table steps">
											<Accordion>
												<Accordion.Title active={activeIndex === 0} index={0} onClick={this.onPriceClick}>
													<div className="table-row">
														<div className="table-cell nopadding middle" style={{ width: "1%" }}>
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
																	<th className="bg-master-lighter" style={{ width: "50%" }} rowSpan="1" colSpan="1">Qty</th>
																	<th className="bg-master-lighter" style={{ width: "50%" }} rowSpan="1" colSpan="1">Price</th>
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


												<Accordion.Title active={activeIndex === 1} index={1} onClick={this.onPriceClick}>
													<div className="table-row">
														<div className="table-cell nopadding middle" style={{ width: "1%" }}>
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
																	<th className="bg-master-lighter" style={{ width: "50%" }} rowSpan="1" colSpan="1">Qty</th>
																	<th className="bg-master-lighter" style={{ width: "50%" }} rowSpan="1" colSpan="1">Price</th>
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
												

												<Accordion.Title active={activeIndex === 2} index={2} onClick={this.onPriceClick}>
													<div className="table-row">
														<div className="table-cell nopadding middle" style={{ width: "1%" }}>
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
																	<th className="bg-master-lighter" style={{ width: "50%" }} rowSpan="1" colSpan="1">Qty</th>
																	<th className="bg-master-lighter" style={{ width: "50%" }} rowSpan="1" colSpan="1">Price</th>
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
									</div> : <div className="m-t-20"></div>
								}

								<div className="clear">
									<button className="ui button btn-default" onClick={this.closeModal}>Cancel</button>&nbsp;
									
									<button className="ui button btn-primary"
										onClick={() => this.onTemplateClick(this.state.previewTemplateObj)}>Open in Designer
									</button>
								</div>
								<br className="clear" /><br />
							</div>
						</div>
					</Modal.Content>
				</Modal>  				
			</div>
		);
	}
}

TemplatesRepeat.propTypes = {
	folderId: PropTypes.string,
	templateId: PropTypes.string,
	data: PropTypes.array,
	folderdata: PropTypes.array,
	chooseTemplateClick: PropTypes.func,
	chooseFolderClick: PropTypes.func
};

export default TemplatesRepeat;

// "btn circle-step-grey step-size-18 step-circle"