
import React from "react";
//import { hashHistory } from "react-router";
import axios from "axios";
import Noty from "noty";
import PropTypes from "prop-types";
import SlidingPane from "react-sliding-pane";
import { Dropdown, Modal } from "semantic-ui-react";
import Canvas from "../Fabric/Canvas";
import * as CanvasModule from "../Fabric/canvasModule.js";
import * as TextModule from "../Fabric/textModule.js";
import AssetsRepeat from "../../assetLibrary/components/assetsRepeat";
import TemplatesRepeat from "../../templates/components/TemplatesRepeat";
//import CouponTemplatesRepeat from "../../Templates/CouponTemplatesRepeat";
import ReactPlaceholder from "react-placeholder";
import Paginate from "react-paginate";

class EditorMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			sectionMenuData: [],
			defaultMenuData: [],
			activeMenuData: [],
			imagesData: [],
			couponsData: [],
			couponTemplatesData: [],
			//couponPanelData: [],
			newTextObj: {},
			// panes
			isTextPaneOpen: false,
			isImagePaneOpen: false,
			// modals
			showSavedCouponModal: false,
			showSavedCouponEditorModal: false,
			showCouponTemplateModal: false,			
			dimmer: "blurring",
			// highlighted items
			//imagesSelectedItems: [],
			couponsSelectedItems: [],
			couponTemplatesSelectedItems: [],
			// folder dropdown
			imagesFolderData: [],
			couponsFolderData: [],
			couponTemplatesFolderData: [],
			// folder
			imageFolderId: "",
			imageFolderName: "All folders",
			couponFolderId: "",
			couponFolderName: "All folders",
			couponTemplateFolderId: "",
			couponTemplateFolderName: "All",			
			// search
			imagesSearchString: "",
			couponsSearchString: "",
			couponTemplatesSearchString: "",
			// pagination
			imagesOffset: 0,
			couponsOffset: 0,
			couponTemplatesOffset: 0,
			// search
			searchString: "",
			// pagination
			offset: 0
		};
	}

	componentDidMount() {
		// get menu options data
		this.getRemoteSectionMenuOptionsData();

		// get client default menu options data
		this.getRemoteClientMenuOptionsData();
		
		// get images and coupons
		this.getRemoteDataImages();
		this.getRemoteDataCoupons();
		this.getRemoteDataCouponTemplates();
	}

	componentWillReceiveProps(nextProps) {
		//console.log("componentWillReceiveProps. this.props.activeObject", this.props.activeObject);
		//console.log("componentWillReceiveProps. nextProps.activeObject",nextProps.activeObject);

		// if the activeObject is different value than current one
		// then update menu obj to use selected object settings		
		if (nextProps.activeObject !== this.props.activeObject) {
			let obj = {};
			if (nextProps.activeObject.id === undefined) {
				// user selected new object on template, so default options
				obj = this.state.defaultMenuData.menu;
			} else {
				// user selected an existing object on template so use options defined for section
				obj = this.state.sectionMenuData.menu.filter((section) =>
					section.id === nextProps.activeObject.id
				);
			}

			// populate the active menu based on obj selected
			this.setState({ activeMenuData: obj });
		}	
	}

	// dispatching an action based on state change
	componentDidUpdate(nextProps) {
		//console.log("editormenu.jsx. componentDidUpdate nextProps.activeObject",nextProps.activeObject + ", nextState",nextState);
		if (nextProps.activeObject != this.props.activeObject) {
			this.showModalWindow(this.props.activeObject);
		}
	}	

	showModalWindow = (obj) => {
		// open appropriate modal based on type (text/image/coupon)
		switch (obj.contentType) {
		case "text":
			this.setState({ isTextPaneOpen: true });
			break;
			
		case "image":
			this.setState({ isImagePaneOpen: true });
			break;
			
		case "coupon":
			this.setState({
				dimmer: "blurring",
				showSavedCouponModal: true
			});
			break;
			
		default:
			this.setState({ isTextPaneOpen: true });
		}		
	};
	
	// modal coupons
	showSavedCouponModal = dimmer => () => this.setState({dimmer, showSavedCouponModal: true})
	onCloseSavedCouponModal = () => this.setState({ showSavedCouponModal: false })
	showCouponTemplateModal = dimmer => () => this.setState({dimmer, showCouponTemplateModal: true})
	onCloseCouponTemplateModal = () => this.setState({ showCouponTemplateModal: false })
	showSavedCouponEditorModal = dimmer => () => this.setState({ dimmer, showSavedCouponEditorModal: true })
	closeSavedCouponEditorModal = () => this.setState({ openSavedCouponEditorModal: false })

	// Perform the remote ajax call to get each template sections menu options data
	getRemoteSectionMenuOptionsData = () => {
		this.setState({ loading: true });
		const template_id = this.props.templateId;
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/${template_id}/sections/settings/menu`;

		// TODO: delete me - only need to make fake API function for coupon templates
		if (this.props.templateId == "000000000000000000406") {
			url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/coupons/${template_id}/sections/settings/menu`;
		}

		axios.get(url).then(response => {
			//console.log("editorMenu. getRemoteSectionMenuOptionsData response", response);

			// Populate the template default values into "add text" obj in state
			const newData = Object.assign({}, {
				fontFamily: response.data.menu[0].text_settings.font_family.default,
				fontSize: response.data.menu[0].text_settings.font_size.default,
				fill: response.data.menu[0].text_settings.font_color.default,
				charSpacing: response.data.menu[0].text_settings.char_spacing,
				lineHeight: response.data.menu[0].text_settings.line_height,
				fontStyle: response.data.menu[0].text_settings.font_style,
				fontWeight: response.data.menu[0].text_settings.font_weight,
				textAlign: response.data.menu[0].text_settings.text_align,
				backgroundColor: ""
			});
				
			// update this.state.data to store the menu options for each section
			this.setState({
				sectionMenuData: response.data,
				loading: false,
				newTextObj: newData,
				//activeMenuData: response.data.menu
			});			
		}).catch(error => {
			console.log("Error fetching the menu options", error);
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not perform the request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// Perform the remote ajax call to get client-specifically defined menu options for each section
	getRemoteClientMenuOptionsData = () => {
		const account_id = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/accounts/${account_id}/templates/defaults`;

		axios.get(url).then(response => {
			//console.log("editorMenu. getRemoteClientMenuOptionsData response", response);

			// update this.state.defaultMenuData to store the menu options
			this.setState({
				defaultMenuData: response.data,
				activeMenuData: response.data.menu
			});
				
		}).catch(error => {
			console.log("Error fetching the menu options", error);
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not perform the request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	fontFaceDropdownOptions = () => {
		var resultArr = [],
			i = 0;

		//console.log("inside fontFaceDropdownOptions. this.state.activeMenuData", this.state.activeMenuData);
		//console.log("length", this.state.activeMenuData.length);
		if (this.state.activeMenuData.length > 0) {
			// Final object properties are { key: 1, text: "Anton", value: "anton" }
			for (var k in this.state.activeMenuData[0].text_settings.font_family.options) {
				var row = {
					key: 	 `${i}`,
					text: 	 `${this.state.activeMenuData[0].text_settings.font_family.options[k].value}`,
					value: 	 `${this.state.activeMenuData[0].text_settings.font_family.options[k].value}`
					//,default: `${this.state.activeMenuData[0].text_settings.font_family.default}`
				};
				resultArr.push(row);
				i++;
			}
		}
		return resultArr;
	}

	fontColorDropdownOptions = () => {
		var resultArr = [],
			i = 0;

		if (this.state.activeMenuData.length > 0) {
			// Final object properties are { key: 1, text: "#ffffff", value: "#ffffff" }
			for (var k in this.state.activeMenuData[0].text_settings.font_color.options) {
				var row = {
					key: 	 `${i}`,
					text: 	 `${this.state.activeMenuData[0].text_settings.font_color.options[k].value}`,
					value: 	 `${this.state.activeMenuData[0].text_settings.font_color.options[k].value}`
					//default: `${this.state.activeMenuData[0].text_settings.font_color.default}`
				};
				resultArr.push(row);
				i++;
			}
		}
		return resultArr;
	}

	fontSizeDropdownOptions = () => {
		var resultArr = [],
			i = 0;

		if (this.state.activeMenuData.length > 0) {
			// Final object properties are { key: 1, text: "22", value: "22" }
			for (var k in this.state.activeMenuData[0].text_settings.font_size.options) {
				var row = {
					key: 	 `${i}`,
					text: 	 `${this.state.activeMenuData[0].text_settings.font_size.options[k].value.toString()}`,
					value: 	 `${this.state.activeMenuData[0].text_settings.font_size.options[k].value.toString()}`
					//default: `${this.state.activeMenuData[0].text_settings.font_size.default.toString()}`
				};
				resultArr.push(row);
				i++;
			}
		}
		return resultArr;
	}

	charSpacingDropdownOptions = () => {
		var resultArr = [
			{ key: 1, text: "Condensed +", value: "0.50" },
			{ key: 2, text: "Condensed", value: "0.75" },
			{ key: 3, text: "Normal", value: "1" },
			{ key: 4, text: "Expanded", value: "1.25" },
			{ key: 5, text: "Expanded +", value: "1.5" }
		];

		return resultArr;
	}

	lineSpacingDropdownOptions = () => {
		var resultArr = [
			{ key: 1, text: "Compact", value: "0.50" },
			{ key: 2, text: "Tight", value: "0.75" },
			{ key: 3, text: "Normal", value: "1" },
			{ key: 4, text: "Relaxed", value: "1.2" },
			{ key: 5, text: "Double +", value: "1.5" }
		];

		return resultArr;
	}

	handleFontFamilyChange = (e, { value }) => {
		if (this.props.activeObject.id !== undefined) {
			CanvasModule.setFont(value);
		} else {
			// Add fontfamily to "add text" obj
			// update this.data.newTextObj to assign the fontfamily (property)
			const dataCopy = Object.assign({}, this.state.newTextObj);
			const newData = Object.assign({}, dataCopy, { fontFamily: value });

			this.setState({ newTextObj: newData });		
		}
	}

	handleFontColorChange = (e, { value }) => {
		if (this.props.activeObject.id !== undefined) {
			CanvasModule.setFillColor(value);
		} else {
			// Update fill in "add text" state obj
			const dataCopy = Object.assign({}, this.state.newTextObj);
			const newData = Object.assign({}, dataCopy, { fill: value });
			console.log("handleFontColorChange. newData",newData);

			this.setState({ newTextObj: newData });
			
			CanvasModule.setFillColor(value);
		}	
	}
	
	handleFontSizeChange = (e, { value }) => {
		if (this.props.activeObject.length == 0) {
			// update this.state.newTextObj to assign the fontsize property
			this.updateNewTextObjectInState("fontSize",value);
		} else {
			CanvasModule.setFontSize(value);
		}
	}
	
	handleCharSpacingChange = (e, { value }) => {
		if (this.props.activeObject.length == 0) {
			// update this.data.newTextObj to assign the charSpacing (property)
			const dataCopy = Object.assign({}, this.state.newTextObj);
			const newData = Object.assign({}, dataCopy, { charSpacing: value });

			this.setState({ newTextObj: newData });
		} else {
			TextModule.setCharSpacing(value);
		}
	}	

	handleLineHeightChange = (e, { value }) => {
		if (this.props.activeObject.length == 0) {
			// update this.data.newTextObj to assign the lineHeight (property)
			const dataCopy = Object.assign({}, this.state.newTextObj);
			const newData = Object.assign({}, dataCopy, { lineHeight: value });

			this.setState({ newTextObj: newData });
		} else {
			TextModule.setLineHeight(value);
		}
	}

	updateNewTextObjectInState = (prop, val) => {
		const dataCopy = Object.assign({}, this.state.newTextObj);
		const newData = Object.assign({}, dataCopy, { prop: val });
		console.log("updateNewTextObjectInState. newData",newData);

		this.setState({ newTextObj: newData });
	}

	onAddText = () => {
		//const text = new FabricText();

		// assign selected text settings to new text object
		var obj = Object.create(null);
		typeof (obj);
		
		// Set properties of object
		//obj.type = "textbox";
		obj.text = "Click to type";
		obj.fontFamily = this.state.newTextObj.fontFamily;
		obj.fill = this.state.newTextObj.fill;
		obj.fontStyle = this.state.newTextObj.fontStyle;
		obj.fontSize = this.state.newTextObj.fontSize;
		obj.fontWeight = this.state.newTextObj.fontWeight;
		obj.textAlign = this.state.newTextObj.textAlign;
		obj.charSpacing = this.state.newTextObj.charSpacing;
		obj.lineHeight = this.state.newTextObj.lineHeight;
		obj.backgroundColor = this.state.newTextObj.backgroundColor;

		// add text obj to canvas
		TextModule.AddText(obj);
		//TextModule.AddText(this.state.newTextObj);

		// Close the text pane
		this.setState({ isTextPaneOpen: false });
	}

	// Perform the remote ajax call to get image assets
	getRemoteDataImages = () => {
		this.setState({ loading: true });
		// Append optional search to the request url if exists
		const searchquery = (this.state.imagesSearchString == "") ? ""
			: `?q=${encodeURIComponent(this.state.imagesSearchString)}`;
		
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/types/images${searchquery}`;
		
		// If folder is known get assets from that folder instead of all folders
		if (this.state.imageFolderId != "") {
			url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/types/images/folders/${this.state.imageFolderId}${searchquery}`;
		}

		axios.get(url, {
			limit: 10,
			imagesOffset: this.state.imagesOffset
		})
			.then(response => {
				// update this.state.data to store these records
				this.setState({
					imagesData: response.data.assets,
					imagesPageCount: Math.ceil(response.data.paging.total / 10),
					loading: false
				});

				// get folder data for dropdown
				this.getRemoteImagesFolderData();
			})
			.catch(error => {
				console.log("Error loading the page", error);
				this.setState({ loading: false, error: error });

				// Show error notification
				new Noty({
					text: "We could not perform the request at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			});
	}

	// Perform the remote ajax call to get coupon templates
	getRemoteDataCoupons = () => {
		this.setState({ loading: true });

		// Append optional search to the request url if exists
		const searchquery = (this.state.couponsSearchString == "") ? ""
			: `?q=${encodeURIComponent(this.state.couponsSearchString)}`;
		
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/types/coupons${searchquery}`;

		// If folder is known get templates from that folder instead of all folders
		if (this.state.folderId != undefined) {
			url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/types/coupons/folders/${this.state.couponFolderId}${searchquery}`;
		}
		
		// If template id is known get that template
		if (this.state.templateId != undefined) {
			url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/${this.state.templateId}`;
		}

		axios.get(url, {
			limit: 10,
			couponsOffset: this.state.couponsOffset
		}).then(response => {
			// update this.state.data to store these records
			this.setState({
				couponsData: response.data.templates,
				couponsPageCount: Math.ceil(response.data.paging.total / 10),
				loading: false
			});

			// get folder data for dropdown
			this.getRemoteCouponsFolderData();

		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not perform the request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// Perform the remote ajax call to get coupon assets
	getRemoteDataCouponsASSETS = () => {
		this.setState({ loading: true });

		// Append optional search to the request url if exists
		const searchquery = (this.state.couponsSearchString == "") ? ""
			: `?q=${encodeURIComponent(this.state.couponsSearchString)}`;
		
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/types/coupons${searchquery}`;
		
		// If folder is known get assets from that folder instead of all folders
		if (this.state.couponFolderId != "") {
			url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/types/coupons/folders/${this.state.couponFolderId}${searchquery}`;
		}

		axios.get(url, {
			limit: 10,
			couponsOffset: this.state.couponsOffset
		}).then(response => {
			// update this.state.data to store these records
			this.setState({
				couponsData: response.data.assets,
				couponsPageCount: Math.ceil(response.data.paging.total / 10),
				loading: false
			});

			// get folder data for dropdown
			this.getRemoteCouponsFolderData();

		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not perform the request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// Perform the remote ajax call to get coupon templates
	getRemoteDataCouponTemplates = () => {
		this.setState({ loading: true });
		// Append optional search to the request url if exists
		const searchquery = (this.state.couponTemplatesSearchString == "") ? ""
			: `?q=${encodeURIComponent(this.state.couponTemplatesSearchString)}`;
		
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/types/coupons${searchquery}`;
		
		// If folder is known get templates from that folder instead of all
		if (this.state.couponTemplateFolderId != "") {
			url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/coupons/folders/${this.state.couponTemplateFolderId}${searchquery}`;
		}

		axios.get(url, {
			limit: 10,
			couponsOffset: this.state.couponTemplatesOffset
		}).then(response => {
			// update this.state.data to store these records
			this.setState({
				couponTemplatesData: response.data.templates,
				couponTemplatesPageCount: Math.ceil(response.data.paging.total / 10),
				loading: false
			});

			// get folder data for dropdown
			this.getRemoteCouponTemplatesFolderData();

		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not perform the request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// show image assets in selected folder
	onImageFolderChange = (e, item) => {
		const folderid = item.value;
		const foldername = (item.text === null) ? "All folders" : item.text;
		this.setState({
			loading: true,
			imageFolderId: folderid,
			imageFolderName: foldername
			//,imagesSelectedItems: []
		});
		
		// Get images with newly selected folder id
		this.getRemoteDataImages();
	}

	// show coupon assets in selected folder
	onCouponFolderChange = (e, item) => {
		const folderid = item.value;
		const foldername = (item.text === null) ? "Coupons" : item.text;
		this.setState({
			loading: true,
			couponFolderId: folderid,
			couponFolderName: foldername,
			couponsSelectedItems: []
		});
		
		// Get coupons with newly selected folder id
		this.getRemoteDataCoupons();
	}

	// show coupon templates in selected folder
	onCouponTemplateFolderChange = (e, item) => {
		const folderid = item.value;
		const foldername = (item.text === null) ? "Coupons" : item.text;
		this.setState({
			loading: true,
			couponFolderId: folderid,
			couponFolderName: foldername,
			couponsSelectedItems: []
		});
		
		// Get coupons with newly selected folder id
		this.getRemoteDataCoupons();
	}	
	
	// Image asset is clicked
	onImageAssetClick = (obj) => {
		console.log("onImageAssetClick. obj",obj);
		this.setState({
			//imagesSelectedItems: obj,
			isImagePaneOpen: false
		});

		// callback in editor.js to update image
		this.props.handleImageChange(obj);		
	}

	// User clicked a template in templatesRepeat component
	onTemplateClick = (obj) => {
		console.log("onTemplateClick. obj",obj);
		this.setState({
			showSavedCouponModal: false,		
			loading: true
			//panelData: [],
			//setActiveObject: {},
			//setHoverObject: {}			
		});

		// callback in editor.js to load and customize an inline template
		this.props.handleTemplateChange(obj.id);
	}

	onNewCouponClick = () => {
		// alert user that they are leaving the current editor
		this.setState({ showSavedCouponModal: false });
	}	

	applyCanvasEventHandlers = () => {
		console.log("inside applyCanvasEventHandlers");
		// rebind the event handlers since an object changed
		Canvas.addEventListeners(this.state.canvas, this.props);
	}

	// Callback triggered when the user click a images paging link
	handleImagesPagingClick = (page) => {
		const selectedpage = page.selected;
		const imagesOffset = Math.ceil(selectedpage * 12);

		this.setState({ imagesOffset: imagesOffset }, () => {
			this.getRemoteDataImages();
		});
	}

	// Callback triggered when the user click a coupons paging link
	handleCouponsPagingClick = (page) => {
		const selectedpage = page.selected;
		const couponsOffset = Math.ceil(selectedpage * 12);

		this.setState({ couponsOffset: couponsOffset }, () => {
			this.getRemoteDataCoupons();
		});
	}
	
	// Callback triggered when the user types in the images search field
	onImageSearchChange = (e) => {
		if (e.key === "Enter" && e.shiftKey === false) {
			// Handle the remote request and update state with the current search string
			if (this.searchterm.value.length > 0) {
				this.setState({ imagesSearchString: this.searchterm.value }, () => {
					this.getRemoteDataImages();
				});
			}
		}
	}

	// Callback triggered when the user types in the images search field
	onCouponSearchChange = (e) => {
		if (e.key === "Enter" && e.shiftKey === false) {
			// Handle the remote request and update state with the current search string
			if (this.searchterm.value.length > 0) {
				this.setState({ imagesSearchString: this.searchterm.value }, () => {
					this.getRemoteDataImages();
				});
			}
		}
	}
	
	// Callback triggered when the user types in the coupon templates search field
	onCouponTemplateSearchChange = (e) => {
		if (e.key === "Enter" && e.shiftKey === false) {
			// Handle the remote request and update state with the current search string
			if (this.searchterm.value.length > 0) {
				this.setState({ couponTemplatesSearchString: this.searchterm.value }, () => {
					this.getRemoteDataCouponTemplates();
				});
			}
		}
	}

	// Callback triggered when the user "clears' the coupons search results
	onImageSearchClear = () => {
		/*
			* Handle the remote request to get original non-search data onto page
		*/
		this.setState({ couponsSearchString: "" }, () => {
			this.getRemoteDataCoupons();
		});
	}

	// Callback triggered when the user "clears' the coupons search results
	onCouponSearchClear = () => {
		/*
			* Handle the remote request to get original non-search data onto page
		*/
		this.setState({ couponsSearchString: "" }, () => {
			this.getRemoteDataCoupons();
		});
	}
	
	// Get images folders for dropdown
	getRemoteImagesFolderData = () => {
		// Define the request url
		const url = "https://private-8e550-directmail.apiary-mock.com/v1/assets/types/images/folders";
		
		axios.get(url,
			{
				limit: 10,
				imagesOffset: 0
			}
		).then(response => {
			// Convert into smaller array with only elements the dropdown needs ('label and 'value' only)
			/* [
					{ key: 1, text: 'Choice 1', value: 1 },
					{ key: 2, text: 'Choice 2', value: 2, disabled: true },
					{ key: 3, text: 'Choice 3', value: 3 }
					// ]
				*/
			var resultArr = [],
				i = 0;
			
			for (var k in response.data.folders) {
				var row = { key: `${i}`, text: `${response.data.folders[k].name}`, value: `${response.data.folders[k].id}` };
				resultArr.push(row);
				i++;
			}

			this.setState({ imagesFolderData: resultArr });
		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ error: error });

			// Show error notification
			new Noty({
				text: "We could not get your image folders at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// Get coupons folders for dropdown
	getRemoteCouponsFolderData = () => {
		// Define the request url
		const url = "https://private-8e550-directmail.apiary-mock.com/v1/assets/types/coupons/folders";
		
		axios.get(url,
			{
				limit: 10,
				couponsOffset: 0
			}
		)
			.then(response => {
				// Convert into smaller array with only elements the dropdown needs ('label and 'value' only)
				/* [
					{ key: 1, text: 'Choice 1', value: 1 },
					{ key: 2, text: 'Choice 2', value: 2, disabled: true },
					{ key: 3, text: 'Choice 3', value: 3 }
					// ]
				*/
				var resultArr = [],
					i = 0;
			
				for (var k in response.data.folders) {
					var row = { key: `${i}`, text: `${response.data.folders[k].name}`, value: `${response.data.folders[k].id}` };
					resultArr.push(row);
					i++;
				}

				this.setState({ couponsFolderData: resultArr });
			})
			.catch(error => {
				console.log("Error loading the page", error);
				this.setState({ error: error });

				// Show error notification
				new Noty({
					text: "We could not get your coupon folders at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			});
	}
	
	// Get coupon template folders for dropdown
	getRemoteCouponTemplatesFolderData = () => {
		// Define the request url
		const url = "https://private-8e550-directmail.apiary-mock.com/v1/templates/folders";
		
		axios.get(url,
			{
				limit: 10,
				couponTemplatesOffset: 0
			}
		).then(response => {
			// Convert into smaller array with only elements the dropdown needs ('label and 'value' only)
			/* [
				{ key: 1, text: 'Choice 1', value: 1 },
				{ key: 2, text: 'Choice 2', value: 2, disabled: true },
				{ key: 3, text: 'Choice 3', value: 3 }
				// ]
			*/
			//console.log("getRemoteCouponTemplatesFolderData. response",response);
			var resultArr = [],
				i = 0;
			
			for (var k in response.data.folders) {
				var row = { key: `${i}`, text: `${response.data.folders[k].name}`, value: `${response.data.folders[k].id}` };
				resultArr.push(row);
				i++;
			}

			this.setState({ couponTemplatesFolderData: resultArr });

		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ error: error });

			// Show error notification
			new Noty({
				text: "We could not get the coupon template folders at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// Coupon template clicked in couponTemplatesRepeat component
	onUseTemplateClick = (obj) => { 
		console.log("inside onUseTemplateClick. selected coupon image. obj",obj);
	}

	// Callback triggered when the user clicks a paging link
	handlePagingClick = (page) => {
		let selectedpage = page.selected;
		let offset = Math.ceil(selectedpage * this.props.perPage);

		this.setState({ offset: offset }, () => {
			this.getRemoteData();
		});
	};

	// Callback triggered when the user types in the search field
	onSearchChange = (e) => {
		if (e.key === "Enter" && e.shiftKey === false) {
			// Handle the remote request and update state with the current search string
			if (this.searchterm.value.length > 0) {
				this.setState({ searchString: this.searchterm.value }, () => {
					this.getRemoteData();
				});
			}
		}
	}

	// Callback triggered when the user "clears' the search results
	onSearchClear = () => {
		/*
		 * Handle the remote request to get original non-search data onto page
		 */
		this.setState({ searchString: "" }, () => {
			this.getRemoteData();
		});
	}
	
	render() {
		// search component 
		function SearchInput(props) {
			return (
				<input type="text" className="prompt" ref={props.searchterm} placeholder="Type search" />
			);
		}

		// search results header
		let searchResultsHeading = null,
			searchterm = this.state.imagesSearchString;

		if (searchterm.length > 0) {
			searchResultsHeading = <div className="col-sm-12">
				<h6>Your search results for <strong>{searchterm}</strong>. &nbsp;
					<span className="small text-muted">
						<a onClick={this.onImageSearchClear}>clear</a>
					</span>
				</h6>
			</div>;
		}
		
		return (
			<div>
				<div className="p-t-30">
					<div className="bm-title">
						<h5>EDIT</h5>
					</div>
										
					<div className="icon-wrapper m-b-5" onClick={() => this.setState({ isTextPaneOpen: true, isImagePaneOpen: false, showSavedCouponModal: false })}>
						<i className={this.state.isTextPaneOpen ?
							"fa fa-text-width custom-icon active" :
							"fa fa-text-width custom-icon"}>
							<span className="fix-editor">&nbsp;</span>
						</i>
					</div>
										
					<div className="icon-wrapper m-b-5" onClick={() => this.setState({ isImagePaneOpen: true, isTextPaneOpen: false, showSavedCouponModal: false })}>
						<i className={this.state.isImagePaneOpen ?
							"fa fa-picture-o custom-icon active" :
							"fa fa-picture-o custom-icon"}>
							<span className="fix-editor">&nbsp;</span>
						</i>
					</div>

					<div className="icon-wrapper m-b-5" onClick={() => this.setState({ showSavedCouponModal: true, isTextPaneOpen: false, isImagePaneOpen: false })}>
						<i className={this.state.showSavedCouponModal ?
							"fa fa-tag custom-icon active" :
							"fa fa-tag custom-icon"}>
							<span className="fix-editor">&nbsp;</span>
						</i>
					</div>					
				</div>

				<SlidingPane
					className='m-r-100'
					overlayclassName='some-custom-overlay-className'
					isOpen={this.state.isTextPaneOpen}
					from='right'
					width='260px'
					onRequestClose={() => this.setState({ isTextPaneOpen: false })}>

					<div>
						<div id="contain">
							<div id="leftdiv">
								<div className="menu-section" onClick={() => { TextModule.toggleBold(); }}>
									<i className="fa fa-bold" aria-hidden="true"></i>
								</div>

								<div className="menu-section" onClick={() => { TextModule.toggleItalics(); }}>
									<i className="fa fa-italic" aria-hidden="true"></i>
								</div>

								<div className="menu-section" onClick={() => { TextModule.textAlignLeft(); }}>
									<i className="fa fa-align-left" aria-hidden="true"></i>
								</div>
												
								<div className="menu-section" onClick={() => { TextModule.textAlignCenter(); }}>
									<i className="fa fa-align-center" aria-hidden="true"></i>
								</div>
												
								<div className="menu-section" onClick={() => { TextModule.textAlignRight(); }}>
									<i className="fa fa-align-right" aria-hidden="true"></i>
								</div>												
							</div>

							<div id="rightdiv">
								<div className="menu-section tall">
									<div className="panel-title">
										FONT
									</div>
									<div className="menu-section-content">
										<span className="fs-14 bold">	
											<Dropdown inline
												options={this.fontFaceDropdownOptions()}
												onChange={this.handleFontFamilyChange}
												defaultValue={(this.state.activeMenuData.length > 0) ?
													this.state.activeMenuData[0].text_settings.font_family.default : null
												}
											/>
										</span>
									</div>
								</div>

								<div className="menu-section tall">
									<div className="panel-title">
										FONT COLOR
									</div>
									<div className="menu-section-content">
										<span className="fs-16 bold">	
											<Dropdown inline
												options={this.fontColorDropdownOptions()}
												onChange={this.handleFontColorChange}
												defaultValue={(this.state.activeMenuData.length > 0) ?
													this.state.activeMenuData[0].text_settings.font_color.default : null
												}
											/>
										</span>	
									</div>
								</div>

								<div className="menu-section tall">
									<div className="panel-title">
										FONT SIZE
									</div>
									<div className="menu-section-content">
										<span className="fs-18 bold">
											<Dropdown inline
												options={this.fontSizeDropdownOptions()}
												onChange={this.handleFontSizeChange}
												defaultValue={(this.state.activeMenuData.length > 0) ?
													this.state.activeMenuData[0].text_settings.font_size.default.toString() : null
												}
											/>
										</span>
									</div>
								</div>

								<div className="menu-section tall">
									<div className="panel-title">
										CHAR SPACING
									</div>
									<div className="menu-section-content">
										<span className="fs-14 bold">
											<Dropdown inline
												options={this.charSpacingDropdownOptions()}
												onChange={this.handleCharSpacingChange}
												defaultValue={(this.state.activeMenuData.length > 0) ?
													this.state.activeMenuData[0].text_settings.char_spacing : null
												}>
											</Dropdown>
										</span>
									</div>
								</div>
												
								<div className="menu-section tall">
									<div className="panel-title">
										LINE HEIGHT
									</div>
									<div className="menu-section-content">
										<span className="fs-14 bold">
											<Dropdown inline
												options={this.lineSpacingDropdownOptions()}
												onChange={this.handleLineHeightChange}
												defaultValue={(this.state.activeMenuData.length > 0) ?
													this.state.activeMenuData[0].text_settings.line_height : null
												}>
											</Dropdown>
										</span>
									</div>													
								</div>
							</div>
						</div>
						
						<div className="p-l-15 p-t-10 clear">
							<button onClick={() => { this.onAddText(); }}
								className="ui button btn-default btn-small">Add Text
							</button>
						</div>	
					</div>
				</SlidingPane>

				<SlidingPane
					className='m-r-100'
					overlayclassName='some-custom-overlay-className'
					isOpen={this.state.isImagePaneOpen}
					from='right'
					width='625px'
					onRequestClose={() => this.setState({ isImagePaneOpen: false })}>

					<div className="p-l-20 p-b-20 p-r-20 p-t-20">
						<button className=""></button>

						<div className="panel-body">											
							<div className="row col-xs-9">
								<Dropdown text={this.state.imageFolderName} className="float-left p-t-10 p-l-30">
									<Dropdown.Menu>
										<Dropdown.Menu scrolling>
											<Dropdown.Item onClick={this.onImageFolderChange} scrolling text="All folders" value="" />	
											{this.state.imagesFolderData.map(option =>
												<Dropdown.Item key={option.value} {...option}
													onClick={this.onImageFolderChange}
													defaultValue={this.state.imageFolderId}>
												</Dropdown.Item>
											)}
										</Dropdown.Menu>
									</Dropdown.Menu>
								</Dropdown>
							</div>

							<div className="col-xs-3 text-right">
								<div className="search pull-right">
									<form onKeyDown={(e) => { this.onImageSearchChange(e); }}>
										<div className="ui search">
											<div className="ui icon input">
												<SearchInput searchterm={input => this.searchterm = input} />
												<i aria-hidden="true" className="search icon"></i>
											</div>
										</div>
									</form>
								</div>
							</div>

							<div className="col-sm-12 clear">
								{searchResultsHeading} {/* visible if showing search results */}
							</div>

							<div className="row margin-b-2">
													
								<ReactPlaceholder
									type='media'
									rows={5}
									ready={!this.state.loading}
									color={"#505661"}
									className={"p-t-30 p-b-30 clear"} >
									<div className="p-t-20 clear">	
										<AssetsRepeat
											data={this.state.imagesData}
											selectedItems={[]}
											handleAssetClick={this.onImageAssetClick} />
									</div>	
								</ReactPlaceholder>

							</div>

							<div className="clear">
								<Paginate
									previousLabel={"previous"}
									nextLabel={"next"}
									breakLabel={<a href="">...</a>}
									breakClassName={"break-me"}
									pageCount={this.state.imagesPageCount}
									marginPagesDisplayed={2}
									pageRangeDisplayed={5}
									onPageChange={this.handleImagesPagingClick}
									containerClassName={"pagination"}
									subContainerClassName={"pages pagination"}
									activeClassName={"active"} />
							</div>
						</div>
					</div>
				</SlidingPane>

				{/* Saved coupons modal (templatesRepeater) */}
				<Modal
					dimmer={this.state.dimmer}
					open={this.state.showSavedCouponModal}
					onClose={this.onCloseSavedCouponModal}>
					<Modal.Header>
						Select one of your saved coupons or &nbsp;
						<span className="textLink" onClick={this.onNewCouponClick}>create a new one</span>
						<span className="pull-right">
							<button type="button" onClick={this.onNewCouponClick}
								className="ui button btn-primary btn-cons">New coupon
							</button>
						</span>
					</Modal.Header>
					<Modal.Content>
						<p>Select one of your saved coupons from your coupon library. 
							Or click the New Coupon button to use a blank coupon template.
						</p>

						<div className="p-t-20">
							<div className="row col-xs-9">
								<Dropdown text={this.state.couponFolderName} className="float-left p-t-10">
									<Dropdown.Menu>
										<Dropdown.Menu scrolling>
											<Dropdown.Item onClick={this.onCouponFolderChange} scrolling text="All folders" value="" />	
											{this.state.couponsFolderData.map(option =>
												<Dropdown.Item key={option.value} {...option}
													onClick={this.onCouponFolderChange}
													defaultValue={this.state.couponFolderId}>
												</Dropdown.Item>
											)}
										</Dropdown.Menu>
									</Dropdown.Menu>
								</Dropdown>
							</div>

							<div className="col-xs-3 text-right">
								<div className="search pull-right">
									<form onKeyDown={(e) => { this.onCouponSearchChange(e); }}>
										<div className="ui search">
											<div className="ui icon input">
												<SearchInput searchterm={input => this.searchterm = input} />
												<i aria-hidden="true" className="search icon"></i>
											</div>
										</div>
									</form>
								</div>
							</div>
											
							<div className="col-sm-12 clear">
								{searchResultsHeading} {/* visible if showing search results */}
							</div>
											
							<div className="row p-t-20 clear margin-b-2">
								<ReactPlaceholder
									type='media'
									rows={5}
									ready={!this.state.loading}
									color={"#ececec"}
									className={"p-t-30 p-b-30 clear"}>
									<TemplatesRepeat
										data={this.state.couponsData}
										folderdata={this.state.couponsFolderData}
										folderId={this.state.couponFolderId}
										templateId={null}
										chooseTemplateClick={this.onTemplateClick}
										chooseFolderClick={this.onCouponTemplateFolderChange} />
								</ReactPlaceholder>
							</div>

							<div className="clear">
								<Paginate
									previousLabel={"previous"}
									nextLabel={"next"}
									breakLabel={<a href="">...</a>}
									breakClassName={"break-me"}
									pageCount={this.state.couponTemplatesPageCount}
									marginPagesDisplayed={2}
									pageRangeDisplayed={5}
									onPageChange={this.handleCouponTemplatesPagingClick}
									containerClassName={"pagination"}
									subContainerClassName={"pages pagination"}
									activeClassName={"active"}
								/>
							</div>

							<div className="actions">
								<button type="button" onClick={this.onCloseSavedCouponModal}
									className="ui button btn-default btn-cons">Cancel
								</button>
							</div>
						</div>
					</Modal.Content>
				</Modal>				
			</div>
		);
	}
}
EditorMenu.defaultProps = {
	activeObject: {},
	templateId: ""
};

EditorMenu.propTypes = {
	activeObject: PropTypes.object,
	templateId: PropTypes.string,
	handleTemplateChange: PropTypes.func,
	handleImageChange: PropTypes.func,
	perPage: PropTypes.number
};

export default EditorMenu;