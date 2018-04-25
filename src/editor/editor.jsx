import React from "react";
import { hashHistory } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setActiveCanvas, setActiveObject, setHoverObject } from "./actions/editorActions.js";
import { setTemplateId } from "../campaigns/actions/campaignActions";
import axios from "axios";
import Noty from "noty";
import { Loader, Button, Header, Modal, Popup } from "semantic-ui-react";
import Canvas from "./Fabric/Canvas";
import * as CanvasModule from "./Fabric/canvasModule.js";
import FloatingToolbar from "./EditorMenu/floatingToolbar";
import EditorMenu from "./EditorMenu/editorMenu";
import SectionIcons from "./EditorMenu/sectionIcons";
import PropTypes from "prop-types";

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			templateId: "",
			templateData: [],
			activePanelData: [],
			panelsData: [],
			callerSectionData: {},
			inlineTemplateFlag: false,
			selectedItems: [],
			openConfirmLeaveEditor: false,
			sectionUpdatePending: false
		};
	}

	componentDidMount() {
		this.setState({ templateId: this.props.params.templateid }, () => {
			// Redux store should have templateId, but if null then reassign 
			// it to Redux store just in case user bookmarked this page 
			// or has reloaded browser while on this page.
			if (this.props.templateId === "") {
				this.props.setTemplateId(this.props.params.templateid);
			}

			// get this template details
			this.getRemoteTemplateData();

			// get template sections
			this.getRemoteTemplateSectionsData();
		});
	}

	/*
		// used to re-render components when editor route parameter changes
		componentWillReceiveProps(nextProps) {
			console.log("componentWillReceiveProps");
			// respond to route parameter change
			if (nextProps.params.templateid !== this.state.templateId) {
				this.setState({ templateId: nextProps.params.templateid }, () => {
					console.log("componentWillReceiveProps. getRemoteTemplateData and getRemoteTemplateSectionsData");
					// get this template details
					this.getRemoteTemplateData();

					// get template sections
					this.getRemoteTemplateSectionsData();
				});
			}
		}
	*/

	// Perform the remote ajax call to get this specific template data
	getRemoteTemplateData = () => {
		this.setState({ loading: true });
		const template_id = this.state.templateId;
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/${template_id}`;

		// TODO: delete me I'm only used to fake a coupon
		if (template_id == "000000000000000000406") 
			url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/coupons/${template_id}`;

		axios.get(url).then(response => {
			// update this.state.data
			this.setState({
				templateData: response.data,
				inlineTemplateFlag: (this.props.templateId == template_id) ? false : true
			});

		}).catch(error => {
			this.setState({
				loading: false,
				error: error
			});

			// Show error notification
			new Noty({
				text: "We could not perform the request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// Perform the remote ajax call to get template sections data
	getRemoteTemplateSectionsData = () => {
		
		this.setState({ loading: true });
		const template_id = this.state.templateId;
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/${template_id}/sections`;

		// TODO: delete me I'm only used to fake a coupon editor
		if (template_id == "000000000000000000406") 
			url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/coupons/${template_id}/sections`;

		//console.log("getRemoteTemplateSectionsData template_id", template_id);
		//console.log("getRemoteTemplateSectionsData state", this.state);

		axios.get(url).then(response => {
			console.log("getRemoteTemplateSectionsData response", response.data);
			let allPanels = [...response.data.panel];

			// if returning from inline template determine
			// which panel to display by seq else seq 1
			let panelObj = {};
			let seq = (template_id === this.state.callerSectionData.id) ?
				this.state.callerSectionData.panel.seq : 1;

			// TODO: delete me. this is pretending an update to parent happened in database from patchTemplateSectionRemoteCall()
			if (template_id === this.state.callerSectionData.id) {
				// get index of existing section that matches pending section (callerSectionData object)
				var foundIndex = allPanels[this.state.callerSectionData.panel.seq-1].section.findIndex(x =>
					x.id === this.state.callerSectionData.panel.section.id);

				// replace the section in response obj
				const objPanelData = [...allPanels];
				objPanelData[this.state.callerSectionData.panel.seq - 1].section[foundIndex] =
					this.state.callerSectionData.panel.section;
				
				//this.state.callerSectionData.panel.section.json

				// push new updated panel (containing the updated section) to state
				allPanels = [...objPanelData];

				console.log("getRemoteTemplateSectionsData. this.state.callerSectionData",this.state.callerSectionData);
				console.log("getRemoteTemplateSectionsData. new faked allPanels",allPanels);
			}
			// TODO: END delete me. this is pretending an update to parent from child that is faked

			// load specific panel into designer in-case coming from inline template editing
			panelObj = allPanels.filter(function (panel) {
				return panel.seq === seq;
			});			
			
			// update this.state.panelsData to store the panels
			this.setState({
				loading: false,
				//panelsData: response.data.panel,
				panelsData: allPanels,
				activePanelData: panelObj
			});

			//console.log("inside getRemoteTemplateSectionsData, activePanelData", panelObj);
			//console.log("inside getRemoteTemplateSectionsData, this.state.panelsData", response.data.panel);

			// Replace a section if an update is pending and template_id matches. Happens if user 
			// finished editing an inline template and here reloading parent template
			//if (this.state.sectionUpdatePending &&
			//	template_id === this.state.callerSectionData.id) {
			//	this.handleUpdateSectionOnTemplate();
			//}		

		}).catch(error => {
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not perform the request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// Highlight the section that is clicked
	handleSectionIconClick = (selCanvasObj) => {
		//console.log("handleSectionIconClick. passed in selCanvasObj",selCanvasObj);

		// update Redux store with activeobject
		this.props.setActiveObject(selCanvasObj);

		// push panel to target state only if is the parent template (not inline template)
		if (!this.state.inlineTemplateFlag) {
			this.storeCallerSection();
		}

		// make object active
		//console.log("calling makeActiveObject");
		CanvasModule.makeActiveObject(selCanvasObj);
	}

	// User clicked a section, so update in Redux store
	handleSectionClick = (selCanvasObj) => {
		// passing in selected obj from canvas
		//console.log("handleSectionClick. passed in selCanvasObj", selCanvasObj);
		
		// update Redux store with activeobject
		this.props.setActiveObject(selCanvasObj);

		// push panel to target state only if is the parent template (not inline template)
		//console.log("handleSectionClick. this.state.inlineTemplateFlag", this.state.inlineTemplateFlag);	
		if (!this.state.inlineTemplateFlag) {
			this.storeCallerSection();
		}

		// set flag to indicate there is a pending update
		this.setState({ sectionUpdatePending: true });
	}

	onChangePanelClick = (id) => {
		//console.log("onChangePanelClick. next panelid", id);
		//console.log("onChangePanelClick. activePanelData",this.state.activePanelData);

		// update state with previous panel json 
		// (includes the most current objects on canvas)
		this.scrapePanelData(this.state.activePanelData[0].panel_id, id);
	}

	scrapePanelData = (currId, nextId) => {
		// grab all objects on canvas panel as is now (most current)
		let canvasJson = CanvasModule.grabPanelData();

		// setup state vars to change panels
		this.pushStateDataForPanelChange(currId, nextId, canvasJson);
	}

	pushStateDataForPanelChange = (currId, nextId, canvasJson) => {
		// get user newly selected panel so we can load update panelsData state data
		let arrNewPanel = this.state.panelsData.filter(function (panel) {
			return panel.panel_id === nextId;
		});
		
		// get seq of old Panel
		let arrOldPanel1 = this.state.panelsData.filter(function (panel) {
			return panel.panel_id === currId;
		});

		// break apart canvas json string into templateDate obj
		var objCurPanelData = Object.create(null);
		typeof (obj2);
		objCurPanelData.panel_id = currId;
		objCurPanelData.seq = arrOldPanel1[0].seq;
		objCurPanelData.dimensions = arrOldPanel1[0].dimensions;	
		let updatedTemplateDataObj = canvasJson.objects.map(function (object) {
			const section = { json: JSON.stringify(object) };
			return section;
		});
		objCurPanelData.section = updatedTemplateDataObj;
		console.log("pushStateDataForPanelChange. old panel obj", objCurPanelData);
		
		// update json for this panel with json from canvas
		const objNextPanelData = [...this.state.panelsData];
		var foundIndex = this.state.panelsData.findIndex(x => x.panel_id == currId);
		objNextPanelData[foundIndex] = objCurPanelData;

		// get next panel so we can load into state and pass to components
		let panelObj = objNextPanelData.filter(function (panel) {
			return panel.seq === arrNewPanel[0].seq;
		});
		console.log("pushStateDataForPanelChange. next panel array", panelObj);		

		// push new updated panel.json to state
		this.setState({
			panelsData: objNextPanelData,
			activePanelData: panelObj,
			setActiveObject: "",
			setHoverObject: ""			
		});		
	}

	storeCallerSection = () => {
		/* populate a new panel object that holds new changes. Format:
		{
			id: "insert template id",
			panel: {
				panel_id: "100111222333444555666",
				section: { 
					id: "100111222333444555666",
					json: "stringified json string here"
				},
				seq: 1
			}
		}
		*/

		// get clicked section json from panel
		const activeJsonId = this.props.activeObject.id;
		let objMatch = this.state.activePanelData[0].section.filter(function (section) {
			return section.id == activeJsonId;
		});
		let matchingJson = objMatch[0].json;

		// construct new Panel obj to hold the section that was clicked "caller"
		var objCallerData = Object.create(null);
		typeof (obj);
		objCallerData.id = this.state.templateData.id;
		const panel = {
			panel_id: this.state.activePanelData[0].panel_id,
			dimensions: {
				"width": this.state.activePanelData[0].dimensions.width,
				"height": this.state.activePanelData[0].dimensions.height
			},
			section: {
				id: this.props.activeObject.id,
				json: matchingJson
				//json: JSON.stringify(matchingJson)
			},
			seq: this.state.activePanelData[0].seq			
		};
		objCallerData.panel = panel;

		// push new updated target info to state
		this.setState({ callerSectionData: objCallerData });		
	}

	// replace the pending "updated" section on panel data in state
	handleUpdateSectionOnTemplate = (obj) => {
		console.log("inside handleUpdateSectionOnTemplate. pre this.state", this.state);
		console.log("inside handleUpdateSectionOnTemplate. obj", obj);

		// determine if editing an inline template or parent template
		if (this.state.inlineTemplateFlag) {
			//------------------------
			// editing inline template
			//------------------------
			// push new updated panel (containing the updated section) to be saved to database next.

			// loop and product an image for each (thumb, preview, highres)

			let quality = "highres";
			//let filepath = "..\\assets\\img\\coupons\\";
			let filepath = `..\\assets\\img\\coupons\\${quality}\\`;
			//let reg = new RegExp("\\\\\\\\\\\\", "g");
			//let reg = replace(/\\/g,"/");
			//filepath = filepath.replace(reg,"\\");	// strip extra "\"
			//filepath = filepath.replace(/\\/g, "\\");
			//filepath = filepath.replace(/\//gi, "");
			//filepath = filepath.replace(/\\\\/g, "\\");
			//filepath = filepath.replace(/\/+/g, "/");
			filepath = filepath.replace(/\/\//g, "/");
			
			// generate custom file name using template number and type
			let filename = this.state.templateData.template_number + "_" +
				this.state.templateData.template_type + ".png";
			
			// create thumbnail image of this finished inline template
			let canvasAsString = CanvasModule.getImageString(0.1);
			this.createTemplateImage(filename, filepath, canvasAsString, "thumbnail");

			// create preview image of this finished inline template
			canvasAsString = CanvasModule.getImageString(0.75);
			this.createTemplateImage(filename, filepath, canvasAsString, "preview");

			// create high-res image of this finished inline template
			canvasAsString = CanvasModule.getImageString(2.25);
			this.createTemplateImage(filename, filepath, canvasAsString, "highres");

			// end loop

			// get index of existing section that matches pending section (callerSectionData object)
			var foundIndex = this.state.panelsData.findIndex(x =>
				x.section.id === this.state.callerSectionData.panel.section.id);

			// do the update to callerSectionData json
			const objCallerData = Object.assign({}, this.state.callerSectionData);
			let newJson = JSON.parse(objCallerData.panel.section.json);
			let newImgPath = filepath + filename;
			newJson.src = newImgPath;
			objCallerData.panel.section.json = JSON.stringify(newJson);

			// replace the existing section in Caller object with new updated (pending) section
			const objPanelData = [...this.state.panelsData];
			objPanelData[0].section[foundIndex] = objCallerData.panel.section;
			
			// save changes to section object on parent template in database
			this.patchTemplateSectionRemoteCall(this.state.callerSectionData);			

		} else {
			//------------------------
			// editing parent template
			//------------------------	
			// push new updated panel (containing the updated section) on screen immediately

			// do the update to callerSectionData json
			const objCallerData = Object.assign({}, this.state.callerSectionData);
			let sectionJson = JSON.parse(objCallerData.panel.section.json);
			let newImgPath = obj.file_name;
			sectionJson.src = newImgPath;
			objCallerData.panel.section.json = JSON.stringify(sectionJson);
			
			// replace the existing section in Caller object with new updated (pending) section
			const objPanelData = [...this.state.panelsData];
			objPanelData[this.state.callerSectionData.panel.seq - 1].section[foundIndex] =
				this.state.callerSectionData.panel.section;

			this.setState({
				panelsData: objPanelData,
				sectionUpdatePending: false
			});
		}	
	}

	onLeaveEditor = () => {
		// get index of current panel
		var foundIndex = this.state.panelsData.findIndex(x =>
			x.panel_id === this.state.activePanelData[0].panel_id);

		// determine if viewing the last panel
		if (foundIndex < (this.state.panelsData.length - 1)) {
			this.onChangePanelClick(this.state.panelsData[foundIndex+1].panel_id);
		} else {
			// no mpre panels so open leave-editor confirmation modal
			this.setState({ openConfirmLeaveEditor: true });
		}	
	}

	onCancelLeaveEditor = () => {
		//console.log("onCancelLeaveEditor. this.state",this.state);

		// user cancelled customizing template
		this.setState({ sectionUpdatePending: false });
		
		if (this.state.inlineTemplateFlag &&
			this.state.templateData.id != this.state.callerSectionData.id) {
			// coming from inline template so send to save method
			// but state.sectionUpdatePending will be false
			this.onHandleSave();

		} else {
			// close confirmation modal and stay on page
			this.setState({ openConfirmLeaveEditor: false });
		}	
	}	

	onHandleSave = () => {
		//console.log("onCancelLeaveEditor. this.state",this.state);
	
		// determine if editing an inline template or parent template
		if (this.state.inlineTemplateFlag) {
			//------------------------
			// editing inline template
			//------------------------
			// place new asset on template if pending change exists
			if(this.state.sectionUpdatePending) {
				this.handleUpdateSectionOnTemplate();
			}
			
			// reload caller template and also place new asset
			// on template in remote call if pending change exists
			this.handleTemplateChange(this.state.callerSectionData.id);

		} else {
			//------------------------
			// editing parent template
			//------------------------			
			// place new asset on template if pending change exists
			if(this.state.sectionUpdatePending) {
				this.handleUpdateSectionOnTemplate();

				this.saveCanvas();
			}
		}
	}

	onHandleSaveAsTemplate = () => {
		console.log("onHandleSaveAsTemplate. this.state.inlineTemplateFlag", this.state.inlineTemplateFlag);
		console.log("onHandleSaveAsTemplate. this.state.callerSectionData", this.state.callerSectionData);
		console.log("onHandleSaveAsTemplate. this.state.activeObject", this.state.activeObject);

		// TODO save as new template

		// TODO
				
		// TODO: save template to database

	}

	createTemplateImage = (name, path, base64Str, quality) => {
		///console.log("inside createTemplateImage. base64Str", base64Str);
		console.log("inside createTemplateImage. quality", quality);
		console.log("inside createTemplateImage. path", path);
		console.log("inside createTemplateImage. name", name);

		// TODO: api call to post data to server

	}

	saveCanvas = () => {
		// save the canvas to database
		console.log("saveCanvas...");

		let filepath = "..\\assets\\img\\templates\\";
		let filename = this.state.templateData.template_number + "_" +
			this.state.templateData.template_type + ".png";

		// create thumbnail image of this finished template
		let canvasAsString = CanvasModule.getImageString(0.1);
		this.createTemplateImage(filename, filepath, canvasAsString, "thumbnail");
		console.log("saveCanvas. thumbnail canvasAsString",canvasAsString);
		
		// create prview image of this finished template
		canvasAsString = CanvasModule.getImageString(0.75);
		this.createTemplateImage(filename, filepath, canvasAsString, "preview");
		console.log("saveCanvas. preview canvasAsString",canvasAsString);
					
		// create high-res image of this finished template
		canvasAsString = CanvasModule.getImageString(2.25);
		this.createTemplateImage(filename, filepath, canvasAsString, "highres");
		console.log("saveCanvas. highres canvasAsString", canvasAsString);

		this.setState({ loading: false });
		
		// TODO determine next page. if another media item in 
		// queue for this campaign do it else goto next step in wizard.
		//if (this.state.inlineTemplateFlag) {
		// do nothing
		//} else {
		//if (noOtherMedia && inCampaignWizard) {
		hashHistory.push("mailingwizardthree/");
			
		// Show success notification
		new Noty({
			text: "Your changes were saved",
			type: "success",
			timeout: "3500"
		}).show();
	}

	// load new template into editor designer
	handleTemplateChange = (id) => {
		//console.log("handleTemplateChange. id", id);
		if (id === "") {
			console.log("handleTemplateChange and passed in template id is empty!!!");
		} else {
			this.setState({ templateId: id },
				function () {
					// get this template details
					this.getRemoteTemplateData();

					// get template sections
					this.getRemoteTemplateSectionsData();
				}
			);
		}
	}

	// load new image onto postcard
	handleImageChange = (obj) => {
		console.log("handleImageChange. obj", obj);

		// set flag to indicate there is a pending update
		this.setState({ sectionUpdatePending: true }, () => {
			// update the image on postcard
			this.handleUpdateSectionOnTemplate(obj);
		});

	}
	
	// update section for a template
	patchTemplateSectionRemoteCall = (obj) => {
		console.log("patchTemplateSectionRemoteCall",obj);
		/*  TODO: uncomment when API ready. Patch method returns 405 on Apiary.
		let template_id = this.state.templateId;
		let section_id = obj.panel.section.id;
	
		const url = `/v1/templates/${template_id}/sections/${section_id}`;
		
		let formData = {
			json: JSON.stringify(this.state.callerSectionData.panel.section.json)
		};

		
		// submit form data to api
		axios.patch(url, { formData }
		).then(response => {

			console.log("patchTemplateSectionRemoteCall. response",response);

		}).catch(error => {
			console.log("Error saving your changes", error);

			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
		*/
	}

	// render the clickable panel icons
	renderItem = (item) => {
		const clickCallback = () => this.onChangePanelClick(item.panel_id);

		const itemRows = [
			<span key={item.id} className="small" style={{ margin: "0 5px 0 0" }}>
				<a className={((this.state.activePanelData[0].panel_id) == item.panel_id) ? "circle active" : "circle"}
					onClick={clickCallback}>{item.seq}</a>
			</span>
		];
		return itemRows;
	}

	render() {
	
		let allIPaneltems = [];
		var records = this.state.panelsData;
		records.forEach(item => {
			const perItemRows = this.renderItem(item);
			allIPaneltems = allIPaneltems.concat(perItemRows);
		});

		if (this.state.loading) {
			return <section><Loader active inline='centered' /></section>;
		}
		else if (this.state.error !== null) {
			console.log("error", this.state.error);
			new Noty({
				text: "Error loading your data",
				type: "error",
				closeWith: ["click", "button"]
			}).show();

			return <section>error: {this.state.error.message}</section>;
		}
		else {

			let editorButtons = <span className="pull-right">
				<a className="ui button btn-primary btn-small"
					onClick={() => { this.onLeaveEditor(); }}>NEXT</a>		
			</span>;

			if (this.state.templateData.template_type == "coupon") {
				editorButtons = <span className="pull-right">
					<a className="ui button white btn-default btn-small" onClick={() => { this.onCancelLeaveEditor(); }}>CANCEL</a>

					<Popup key="1"
						trigger={ <a className="ui button btn-primary btn-small m-l-5" onClick={() => { this.onHandleSave(); }}>SAVE</a> }
						content="Save for one-time use"
						inverted
					/>
					
					{(!this.state.inlineTemplateFlag) ?
						<Popup key="2"
							trigger={<a className="ui button btn-primary btn-small m-l-5" onClick={() => { this.onHandleSaveAsTemplate(); }}>SAVE AS TEMPLATE</a>}
							content="Save as a new template in your library of ready-to-use coupons"
							inverted
						/> : null
					}
				</span>;
			}
			
			return (
				<div className="full-height m-t-65">
					<div className="full-height flex">
						<div className="full-width">

							{this.state.loading ? <Loader active inline='centered' /> : ""}
											
							<div className="wrapper">
								<div className="row">

									{(this.state.inlineTemplateFlag) ? 
										<div className="col-xs-11 bgcolor1 p-l-30 p-r-30">
											<span>You are editing a {this.state.templateData.template_type} within your template</span>	
											{/*<span className="pull-right">
												<a className="ui button white btn-default btn-small" onClick={() => { this.onCancelLeaveEditor(); }}>CANCEL</a>
												<a className="ui button white btn-primary btn-small m-l-5" onClick={() => { this.saveCanvas("one-time"); }}>DONE</a>
											</span>*/}
										</div> : ""
									}
									
									<div className="column col-xs-11 bg-master-darker full-height" id="main">

										<div className="p-t-10 clear" style={{ height: "50px" }}>
											<div className="col-sm-3 p-t-10">
												<span id="panellabel">
													<span className="small color1 p-r-10">PANEL</span>
													{allIPaneltems}
												</span>
											</div>

											<div className="col-sm-6">
												<SectionIcons
													data={this.state.activePanelData}
													activeObject={this.props.activeObject}
													setActiveObject={this.props.setActiveObject}
													setHoverObject={this.props.setHoverObject}
													handleClick={this.handleSectionIconClick}/>
											</div>

											<div className="col-sm-3 pull-right text-right p-t-10">
												<span id="savedmsg" className="hide statusmessage p-r-30 text-muted small">
													Saved <i className="glyphicon glyphicon-ok-circle"></i>
												</span>

												{editorButtons}	
											</div>
										</div>

										<FloatingToolbar />

										<div className="tab-pane fade in active m-t-30 clear" id="position-bar">
											<Canvas	
												className="canvasContainer"
												setActiveCanvas={this.props.setActiveCanvas}
												data={this.state.activePanelData}
												activeObject={this.props.activeObject}
												setActiveObject={this.props.setActiveObject}
												setHoverObject={this.props.setHoverObject}
												handleClick={this.handleSectionClick} />
										</div>
									</div>

									<div className="column center col-xs-1" id="sidebar">
										<EditorMenu
											activeObject={this.props.activeObject}
											templateId={this.state.templateId}
											handleTemplateChange={this.handleTemplateChange}
											handleImageChange={this.handleImageChange} />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Confirm leave editor */}
					<Modal
						open={this.state.openConfirmLeaveEditor}
						basic size='small'>
						<Header icon='thumbs up' content='Are you sure?' />
						<Modal.Content>
							<p>Confirm you want to leave the designer. You can save your changes and return at anytime.</p>
							<p className="p-t-20 p-b-40">Remember you are responsible for all coupon offers and 
							information communicated in your mailing.
							</p>
						</Modal.Content>
						<Modal.Actions>
							<Button inverted className="btn-default" onClick={() => this.onCancelLeaveEditor()}>
								No
							</Button>
							{/*<Button inverted className="btn-primary" onClick={() => this.onLeaveEditor("no-save")}>
								Exit without saving
								</Button>*/}
							{(this.state.templateData.template_type == "coupon") ?
								<Button inverted className="btn-primary" onClick={() => this.onHandleSaveAsTemplate()}>
									Save as template
								</Button> : null
							}
							<Button inverted className="btn-primary" onClick={() => this.onHandleSave()}>
								Yes, save and exit
							</Button>
						</Modal.Actions>
					</Modal>					
				</div>
			);
		}
	}
}

Editor.propTypes = {
	setActiveCanvas: PropTypes.func.isRequired,
	setActiveObject: PropTypes.func.isRequired,
	setHoverObject: PropTypes.func.isRequired,
	selectedItems: PropTypes.array,
	activeObject: PropTypes.object,
	canvas: PropTypes.object,
	templateId: PropTypes.string,
	setTemplateId: PropTypes.func,
	params: PropTypes.object
};
Editor.defaultProps = {
	setActiveCanvas: null,
	setActiveObject: null,
	setHoverObject: null,
	activeObject: {},
	selectedItems: [],
	canvas: null
};

function mapStateToProps(state) {
	return {
		canvas: state.EditorReducer.canvas,
		activeObject: state.EditorReducer.activeObject,
		hoverObject: state.EditorReducer.hoverObject,
		templateId: state.CampaignReducer.templateId
	};
}
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setActiveCanvas: setActiveCanvas,
		setActiveObject: setActiveObject,
		setHoverObject: setHoverObject,
		setTemplateId: setTemplateId
	}, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Editor);