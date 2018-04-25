require("fabric");
const Store = require("../../common/store/index.js");

/*----------------------*/
// postcard object
/* ---------------------
  descr: "Blank postcard"
  postcardid: null|0  - the postcard_id 
  templateid: null|0  - the template
  mailtypeid: 12
  product_type_code: "EDDM"
  numpanels: 2
  sizeid: 22
  sizename: "4.5 x 11"
  height: 1050
  width: 3600
  asset_id: 1234
  sessionid: 123456789
  url: https://www.amplifiedmail.com/index.cfm?view=site.editor&t=2&p=162
*/

// canvas functions
export function initCanvas(postcardid, templateid, layoutid) {
	//showLoader();
	
	// see if stored val exists and interogate them for comparison
	var sessionExists = storageExists("postcard");
	if (sessionExists) {
		var obj = JSON.parse(readFromStorage("postcard"));
		if (obj.length) {
			sessionExists = true;
			var sess_templateid = obj[0].templateid;
		}
	}
	
	if ((sessionExists && postcardid == undefined && templateid == sess_templateid) ||
		(sessionExists && postcardid == undefined && templateid == undefined)
	) {
		//-------------------------------------
		// grab template_id from storage
		// 1) user left editor to login and is back now
		// 2) user left editor and returned w/o ever logging in (or reloaded editor page)
		//-------------------------------------
		//console.log('initCanvas. inside #0');
		objPostcard = JSON.parse(readFromStorage("postcard"));
	
		// redundant call to getPostcardDetails to make sure we populate
		// session.ampulator values and adbuilder object (happens in getPostcardDetails())
		getPostcardDetails(objPostcard[0].templateid, postcardid).done(function(resp){});
	
		if (!postcardid) {
			//--------------------------
			// visitor using the editor left and is returning to editor
			//--------------------------
			templateid = objPostcard[0].templateid;
	
			// create new postcard_id
			createPostcard(userid, templateid).done(function(resp){
				// get new postcard_id
				var obj = $.parseJSON(resp);
				objPostcard[0].postcardid = obj.postcardid;
	
				$("#showsize").html(objPostcard[0].sizename); // show on page
				$("#showmailtype").html(objPostcard[0].product_type_code); // show on page
				$("#showpostcardid").html(objPostcard[0].postcardid); // show on page
				document.getElementById("PostcardId").value = objPostcard[0].postcardid;  // save to hidden form var for dataswitch page
	
				savePanelsToDatabase();
	
				deleteFromStorage("newlogin");
	
				etCanvasDirty(true);
	
				var action = 3;
				drawCanvas(templateid, layoutid, action);        
			});
	
		} else if (loggedin && !postcardid) {
			//--------------------------
			// logged in and no postcardid
			//--------------------------
			templateid = objPostcard[0].templateid;
		
			// create new postcard_id
			createPostcard(userid, templateid).done(function(resp){
				// get new postcard_id
				var obj = $.parseJSON(resp);
				objPostcard[0].postcardid = obj.postcardid;
		
				$("#showsize").html(objPostcard[0].sizename); // show on page
				$("#showmailtype").html(objPostcard[0].product_type_code); // show on page
				$("#showpostcardid").html(objPostcard[0].postcardid); // show on page
				document.getElementById("PostcardId").value = objPostcard[0].postcardid;  // save to hidden form var for dataswitch page
		
				savePanelsToDatabase();
		
				setCanvasDirty(true);
		
				var action = 3;
				drawCanvas(templateid, layoutid, action);        
			});  
	
		} else {
	
			templateid = objPostcard[0].templateid;
	
			$("#showsize").html(objPostcard[0].sizename); // show on page
			$("#showmailtype").html(objPostcard[0].product_type_code); // show on page
			$("#showpostcardid").html(objPostcard[0].postcardid); // show on page 
			document.getElementById("PostcardId").value = objPostcard[0].postcardid;  // save to hidden form var for dataswitch page
	
			var action;
	
			if (storageExists("postcard")) {
				action = 3;
				setCanvasDirty(true);
			} else {
				action = 2;
				setCanvasDirty(false);
			}
	
			drawCanvas(templateid, layoutid, action);  
		}
	
	} else {
	
		//-------------------------------------
		// No stored data found or new postcard is different than stored data
		// 1) user is new and not logged in (may have some params)
		// 2) user is coming from account section with a postcard_id
		//-------------------------------------    
		if (sessionExists) {
			//-------------------------------------
			// delete storage postcard
			// 1) user changed size (or mailtype), so the storage data is old
			//-------------------------------------
			//console.log('initCanvas. session exists but ols so delete storage');
			deleteFromStorage("postcard");
		}
	
		// get all required params so we can draw canvas
		if (postcardid && !objPostcard.length) {
	
			//-------------------------------------
			// if postcardid not null then user is editing existing postcard
			//-------------------------------------
			//console.log('initCanvas. inside #1');
			getPostcardDetails(templateid, postcardid).done(function(resp){
				// populate global object
				objPostcard = $.parseJSON(resp);
		
				if (objPostcard.length) {
					templateid = objPostcard[0].templateid;
					
					$("#showsize").html(objPostcard[0].sizename); // show on page
					$("#showmailtype").html(objPostcard[0].product_type_code); // show on page
					$("#showpostcardid").html(postcardid);  // show on page
					document.getElementById("PostcardId").value = objPostcard[0].postcardid;  // save to hidden form var for dataswitch page
		
					// set canvas dirty
					setCanvasDirty(true);
		
					// Save objPostcard data to storage (cookie)
					var today = new Date();
					var nextyear = today.setFullYear(today.getFullYear() + 1);
					writeToStorage("postcard", objPostcard, nextyear);
		
					var action = 2;
					drawCanvas(templateid, layoutid, action);
				}
			});
	
		} else if (templateid) {
	
			//-------------------------------------
			// populate global objPostcard object using the templateid
			//-------------------------------------
			//console.log('initCanvas. inside #3');
			//console.log('inside initCanvas #3. drawCanvas(' + templateid + '). postcardid=' + postcardid + ', layoutid=' + layoutid);
			getPostcardDetails(templateid, postcardid).done(function(resp){
				objPostcard = $.parseJSON(resp);
	
				if (objPostcard.length) {
					templateid = objPostcard[0].templateid;
	
					// Save objPostcard data to storage (cookie)
					var today = new Date();
					var nextyear = today.setFullYear(today.getFullYear() + 1);
					writeToStorage("postcard", objPostcard, nextyear);
	
					var action = 2; // default
	
					// if layout_id is passed in then load that layout instead
					if (layoutid)
						action = 4;
	
					setCanvasDirty(true);
	
					drawCanvas(templateid, layoutid, action);
	
				} else {
				
					// error no params passed in
					swal({
						title: "Welcome!",
						text: "Let's get started, select the size and type of postcard you want to build.",
						html: true,
						showConfirmButton: true,
						showCancelButton: false,
						confirmButtonText: "Get started",
						confirmButtonColor: "#337ab7"
					},
					function(isConfirm){
						if (isConfirm) {
							location.replace("/index.cfm?view=site.letsGo");
						}
					});
				}
			});
		}
	}
	
	//-------------------------------------
	// no params passed in so send to letsGo to get params
	//-------------------------------------
	if (templateid == undefined) {
		swal({
			title: "Welcome!",
			text: "Let's get started, select the size and type of postcard you want to build.",
			html: true,
			showConfirmButton: true,
			showCancelButton: false,
			confirmButtonText: "Get started",
			confirmButtonColor: "#337ab7"
		},
		function(isConfirm){
			if (isConfirm) {
				location.replace("/index.cfm?view=site.letsGo");
			}
		});
	}
}

export function drawCanvas(templateid, layoutid, action) {
	console.log("inside drawCanvas");
	/// create canvas on page
	const canvas = Store.default.getState().EditorReducer.canvas;
	canvas.clear();

	/*
	// get all layout codes for this template
	var defaultlayoutcode = 'FRONT';  
	getLayoutCodes(templateid).done(function(resp){
		// populate objLayoutCodeList object
		var objLayoutCodeList = $.parseJSON(resp);
	
		// display the layout codes dropdown
		updateLayoutCodesDropdown(objLayoutCodeList);
	
		// Identify default option in dropdown
		$('#layoutcode').val(defaultlayoutcode);
		$('#layoutcode').niceSelect('update');
	});  
	
	// get all layouts for this code
	getLayoutsByCode(templateid, defaultlayoutcode).done(function(resp){
		// populate global objLayoutList object
		objLayoutList = $.parseJSON(resp);
	
		// update layouts for this code
		showLayouts(objLayoutList);
	
		bindLayoutSelectedEvent();
	
		// get panels and display on page
		getPanelData(templateid, layoutid, action);
	
		// Save objPostcard data to storage (cookie)
		var today = new Date();
		var nextyear = today.setFullYear(today.getFullYear() + 1);
		writeToStorage('postcard', objPostcard, nextyear);  
	});
	
	// get all background categories for dropdown
	getBackgroundCategories(templateid).done(function(resp){
		// populate objCatList object
		var objCatList = $.parseJSON(resp);
	
		// display the categories dropdown
		updateCategoryDropdown(objCatList);    
	}); 
	
	// get all background images for this industry/category and size
	getBackgroundsByCategory(industry, templateid).done(function(resp){
		// populate objBackgroundList object
		var objBackgroundList = $.parseJSON(resp);
	
		// display backgrounds for this size
		showBackgrounds(objBackgroundList); 
	
		bindBackgroundSelectedEvent();
		bindBackgroundColorSelectedEvent();
	});   
	
	// get user uploaded images
	getUploadedImages(userid).done(function(resp){
		// populate objUploadedImages object
		var objUploadedImages = $.parseJSON(resp);
	
		// display uploaded images
		showUploadedImages(objUploadedImages);
		
		bindUploadSelectedEvent();
	});
	*/

	// turn on the auto-saving feature
	//startAutoSave();
}
		
export function getPanelData(templateid, layoutid, action) {
	if (action == 2) {
		//------------------------------
		// Scenarios include:
		//  1) New logged in user editing a prev session (postcard_id is known)
		//  2) Not logged (postcard_id is not known)
		//------------------------------
		// get all the template panels
		getAllTemplatePanels(templateid, objPostcard[0].postcardid).done(function(resp){
			// create resp obj if empty
			var isObjectEmpty = (resp.length > 2) ? false : true;
			if (isObjectEmpty) {
				var front = new panelObj(1, "{\"objects\": [{}]}", 0);
				var back = new panelObj(2, "{\"objects\": [{}]}", 1);
				var arr = [];
				arr.push(front);
				arr.push(back);
		
				resp = arr;
				resp = JSON.stringify(arr);
			}
		
			// populate global objPanels object
			objPanels = $.parseJSON(resp);
		
			loadJsonToCanvas(objPanels[0].json);      
		});

	} else if (action == 3) {
		//------------------------------
		// Scenarios include:
		//  1) editing storage postcard (clicked login or save link after editing a postcard). Just logged in user
		//------------------------------    
		// get postcard info from cookie, then get panels from session table in database
		readPanelsFromPermStorage(objPostcard[0].sessionid).done(function(resp){
			// create resp obj if empty
			var isObjectEmpty = (resp.length > 2) ? false : true;
			if (isObjectEmpty) {
				var front = new panelObj(1, "{\"objects\": [{}]}", 0);
				var back = new panelObj(2, "{\"objects\": [{}]}", 1);
				var arr = [];
				arr.push(front);
				arr.push(back);
	
				resp = arr;
				resp = JSON.stringify(arr);
			}
	
			// populate global objPanels object
			objPanels = $.parseJSON(resp);
		
			loadJsonToCanvas(objPanels[0].json);
		});
	
	} else if (action == 4) {
		//------------------------------
		// Scenarios include:
		//  1) Not logged (postcard_id is not known and layout_id is passed in)
		//------------------------------
		// get all the template panels
		getAllTemplatePanels(templateid, objPostcard[0].postcardid).done(function(resp){
			// create resp obj if empty
			var isObjectEmpty = (resp.length > 2) ? false : true;
			if (isObjectEmpty) {
				var front = new panelObj(1, "{\"objects\": [{}]}", 0);
				var back = new panelObj(2, "{\"objects\": [{}]}", 1);
				var arr = [];
				arr.push(front);
				arr.push(back);

				resp = arr;
				resp = JSON.stringify(arr);
			}

			// populate global objPanels object
			objPanels = $.parseJSON(resp);

			var json = "";
			if (objLayoutList.length) {
				$.each(objLayoutList, function(i) {
					if (objLayoutList[i].id == layoutid) {
						json = objLayoutList[i].json;
					}
				});
			}

			// Overwrite default json to use passed in layout json
			objPanels[0].json = json;

			// Load json into editor
			loadJsonToCanvas(objPanels[0].json);   
		});
	}  
	
	// get editor url and save to objPostcard
	objPostcard[0].url = location.href;  
	
	// show tour ballon tip #1
	$(".tour1").grumble({
		text: "Select and change your postcard design at any time", 
		angle: 90, 
		distance: 50, 
		showAfter: 3000,
		hideAfter: 3000,
		type: "alt-",
		hideOnClick: true
	});

	hideLoader();
}
	
export function panelObj(panel, json, indicia) {
	this.panelnum = panel;
	this.json = json;
	this.indicia = indicia;
}

export function loadJsonToCanvas(json, resolve, reject) {
	// make sure jason is object then loop over and clean up
	var serialized = (typeof json === "string") ? JSON.parse(json) : json;
	//console.log("serialized",serialized);

	if (Object.keys(serialized).length > 0) {
		// loop over keys and prep and cleanup data
		for (var key in serialized) {
			if (serialized.hasOwnProperty(key)) {			
				// Cleanup #1:
				// Look for escaped new line and unescape them
				// (they are stored in db as escaped '\\n' but need to be '\n')
				if (key == "text") {
					serialized[key] = serialized[key].replace(/\\n/g, "\n");
				}

				// Cleanup #2:
				// Assign cross-origin attribute for all images
				if (key == "crossOrigin") {
					serialized[key] = "anonymous";
				}
			}
		}
		
		// pointer to canvas obj
		const canvas = Store.default.getState().EditorReducer.canvas;

		// load json to canvas (deserialize json object with enlivenObjects())
		fabric.util.enlivenObjects([serialized], function(objects) {
			objects.forEach(function (o) {
				// textbox and all other types
				//console.log("loadJsonToCanvas. o=",o);
				canvas.add(o);
				canvas.renderAll();
				canvas.bringToFront(o);

				// return promise status
				return resolve();	
			});
		});
		
	} else {
		// error invalid json
		errorHandler("postcard");

		// return promise status
		return reject();
	}
}

export function getActiveObj() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var obj = canvas.getActiveObject();
	return obj;
}

export function makeActiveObject(obj) {
	const canvas = Store.default.getState().EditorReducer.canvas;

	// get all objs on canvas
	var allCanvasObjs = canvas.getObjects();

	// find matching obj from canvas by id
	let index = allCanvasObjs.map(obj => obj.id).indexOf(obj.id);
	
	if (index >= 0)
		canvas.setActiveObject(canvas.item(index));
	else
		console.log("Error finding matching object on canvas");
}

export function AddBleedLineMarkers() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	// add bleed print-area dashed lines (starting x/y  and then ending x/y)
	var bleedRectTop = new fabric.Rect(
		{
			left: 0,
			top: 0,
			width: canvas.width,
			height: 15,
			fill: "#E3E5E9",
			opacity: 0.4,
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true        
		});
	var bleedRectRight = new fabric.Rect(
		{
			left: canvas.width - 15,
			top: 15,
			width: 15,
			height: canvas.height - 15,
			fill: "#E3E5E9",
			opacity: 0.4,
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true        
		});
	var bleedRectBottom = new fabric.Rect(
		{
			left: 15,
			top: canvas.height - 15,
			width: canvas.width - 30,
			height: 15,
			fill: "#E3E5E9",
			opacity: 0.4,
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true        
		});
	var bleedRectLeft = new fabric.Rect(
		{
			left: 0,
			top: 15,
			width: 15,
			height: canvas.height - 15,
			fill: "#E3E5E9",
			opacity: 0.4,
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true        
		});        

	var bleedLineTop = new fabric.Line([15, 15, canvas.width - 15, 15], 
		{
			strokeDashArray: [1, 3],
			stroke: "#717c8c",
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true
		});
	var bleedLineRight = new fabric.Line([canvas.width - 15, 15, canvas.width - 15, canvas.height - 15], 
		{
			strokeDashArray: [1, 3],
			stroke: "#717c8c",
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true
		});
	var bleedLineBottom = new fabric.Line([15, canvas.height - 15, canvas.width - 15, canvas.height - 15], 
		{
			strokeDashArray: [1, 3],
			stroke: "#717c8c",
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true
		});
	var bleedLineLeft = new fabric.Line([15, 15, 15, canvas.height - 15], 
		{
			strokeDashArray: [1, 3],
			stroke: "#717c8c",
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true
		});

	// Add print-area bleed text
	var bleedText = new fabric.Textbox("Outside the print area", 
		{
			width: 120,
			height: 15,
			top: 2,
			left: (canvas.width / 2) - 60,
			fontFamily: "arial",
			fontSize: 9,
			fill: "#717c8c",
			textAlign: "center",
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true
		});
	var bleedTextLower = new fabric.Textbox("Outside the print area", 
		{
			width: 120,
			height: 15,
			top: canvas.height - 13,
			left: (canvas.width / 2) - 60,
			fontFamily: "arial",
			fontSize: 9,
			fill: "#717c8c",
			textAlign: "center",
			selectable: false,
			editable: false,
			name: "guide",
			excludeFromExport: true
		});  

	// add to canvas
	canvas.add(bleedRectTop);
	canvas.add(bleedRectRight);
	canvas.add(bleedRectBottom);
	canvas.add(bleedRectLeft);  
	canvas.add(bleedLineTop);
	canvas.add(bleedLineRight);
	canvas.add(bleedLineBottom);
	canvas.add(bleedLineLeft);
	canvas.add(bleedText);
	canvas.add(bleedTextLower);
}

export function RemoveBleedLineMarkers() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var objects = canvas.getObjects();
	for (var i = 0; i < objects.length; ) {
		if (objects[i].name == "guide") {
			canvas.remove(objects[i]);
			i = 0;
		} else {
			i++;
		}
	}
}

export function AddCropLineMarkers(canvas){
	// add top crop lines (starting x/y  and then ending x/y)
	var cropTopVertLeftLineTop = new fabric.Line([10, 0, 10, 20], 
		{
			stroke: "#000000",
			selectable: false,
			name: "croplines"
		});
	var cropTopVertRightLineRight = new fabric.Line([canvas.width - 10, 0, canvas.width - 10, 20], 
		{
			stroke: "#000000",
			selectable: false,
			name: "croplines"
		});
	var cropTopHorzLeftLineTop = new fabric.Line([0, 10, 20, 10], 
		{
			stroke: "#000000",
			selectable: false,
			name: "croplines"
		});
	var cropTopHorzRightLineTop = new fabric.Line([canvas.width, 10, canvas.width - 20, 10], 
		{
			stroke: "#000000",
			selectable: false,
			name: "croplines"
		});    

	// add bottom crop lines (starting x/y  and then ending x/y)
	var cropBottomVertLeftLineTop = new fabric.Line([10, canvas.height, 10, canvas.height - 20], 
		{
			stroke: "#000000",
			selectable: false,
			name: "croplines"
		});
	var cropBottomVertRightLineRight = new fabric.Line([canvas.width - 10, canvas.height, canvas.width - 10, canvas.height - 20], 
		{
			stroke: "#000000",
			selectable: false,
			name: "croplines"
		});
	var cropBottomHorzLeftLineTop = new fabric.Line([0, canvas.height - 10, 20, canvas.height - 10], 
		{
			stroke: "#000000",
			selectable: false,
			name: "croplines"
		});
	var cropBottomHorzRightLineTop = new fabric.Line([canvas.width, canvas.height - 10, canvas.width - 20, canvas.height - 10], 
		{
			stroke: "#000000",
			selectable: false,
			name: "croplines"
		}); 

	canvas.add(cropTopVertLeftLineTop);
	canvas.add(cropTopVertRightLineRight);
	canvas.add(cropTopHorzLeftLineTop);
	canvas.add(cropTopHorzRightLineTop);

	canvas.add(cropBottomVertLeftLineTop);
	canvas.add(cropBottomVertRightLineRight);
	canvas.add(cropBottomHorzLeftLineTop);
	canvas.add(cropBottomHorzRightLineTop);
}

function canvasRendered() {
	//hideLoader();
  
	// show icons after a delay to prevent user from changing panels
	// before the first panel finishes loading
	// else it loads panel i data onto panel 2 canvas
	setTimeout(function() {
		// Setup panel icons on editor page
		//createPanelIcons(objPanels);   
	}, 1500);
}

export function createPanelIcons(obj) {
	// Display panels icons on editor page
	$("#panelicon-links").empty();

	if (obj.length) {
		$.each(obj, function(i) {
			var str = "<li>";
			str += "<a href='javascript:void(0);' id='" + obj[i].panelnum + "' class='panelicon show-panel-button showloader'><img src='/images/editor/panel-icon.png' border='0' height='20'/></a>";
			if (i < (obj.length - 1)) {
				str += "<img src='/images/editor/panel-divider.png' class='divider' height='25'/>";
			}
			str += "</li>";
        
			$("#panelicon-links").append(str);
		});
	}

	$("#panelicon-links" ).fadeIn("slow");

	// mark appropriate panel active
	if (viewingPanelNum == 1)
		$("#panelicon-links li:first-child a").addClass("active");
	else
		$("#panelicon-links li:last-child a").addClass("active");

	//bindPanelSelectedEvent(); // moved to canvasRendered();
}

export function AddTextBlock(id) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	switch(id) {
	case "1":
		var textblock = new fabric.Textbox("Add your own text tttttttt", 
			{
				width: 200,
				height: 30,
				fontFamily: "arial",
				fontSize: 14,
				fontWeight: "normal",
				lineHeight: 1,
				fill: "#000000",
				textAlign: "left",
				left: (canvas.getWidth() / 2) - 100,
				top: (canvas.getHeight() / 2) - 15
			});
		canvas.add(textblock);
		canvas.setActiveObject(textblock);
		textblock.enterEditing();
		break;
  
	case "2":
		var textblock = new fabric.Textbox("Your Name\nTitle\n\nOffice: 800-123-4567\nFax: 800-123-4567\n\nyou@email.com\nwww.website.com", 
			{
				width: 200,
				height: 130,
				fontFamily: "roboto",
				fontSize: 14,
				fontWeight: "normal",
				lineHeight: 1,
				fill: "#000000",
				textAlign: "left",
				left: (canvas.getWidth() / 2) - 100,
				top: (canvas.getHeight() / 2) - 70
			});
		canvas.add(textblock);
		canvas.setActiveObject(textblock);
		textblock.enterEditing();        
		break;

	case "3":
		var textblock = new fabric.Textbox("www.website.com\nyou@facebook.com\nyou@twitter.com", 
			{
				width: 200,
				height: 130,
				fontFamily: "roboto",
				fontSize: 14,
				fontWeight: "normal",
				lineHeight: 1.2,
				fill: "#000000",
				textAlign: "left",
				left: (canvas.getWidth() / 2) - 100,
				top: (canvas.getHeight() / 2) - 70
			});
		canvas.add(textblock);
		canvas.setActiveObject(textblock);
		textblock.enterEditing();
		break;

	case "4":
		var textblock = new fabric.Textbox("Phone: 800-123-4567\nyou@email.com\nwww.website.com", 
			{
				width: 200,
				height: 130,
				fontFamily: "roboto",
				fontSize: 14,
				fontWeight: "normal",
				lineHeight: 1.2,
				fill: "#000000",
				textAlign: "left",
				left: (canvas.getWidth() / 2) - 100,
				top: (canvas.getHeight() / 2) - 70
			});

		canvas.Image.fromURL("http://localhost:8000/images/image_placeholder.gif", function(myImg) {
			canvas.add(img);
		});
		canvas.add(textblock);
		break;

	case "5":
		var rect = new fabric.Rect({width:100, height: 100, fill: "#eeeeee" });
		var group1 = new fabric.Group([ rect ], { left: xcenter, top: ycenter });
		canvas.add(group1);

		group1.clipTo = function(ctx) {
			ctx.rect(50,50,150,200);
		};

		canvas.add(new fabric.Rect({width:150, height: 200, fill: "", stroke: "#eeeeee", strokeWidth:"1", selectable: false, left: (canvas.getWidth() / 2) - 75, top: (canvas.getHeight() / 2) - 100 }));
		canvas.moveTo(group1, 1);

		break;

	default:
		json = "";
		break;
	}

	canvas.trigger("object:modified", {target: this}); 
}

export function deletePostcard(postcardid) {
	var url = "Ajax/editor.cfc?method=deletePostcard&postcard_id=" + postcardid;
	var promise = $.get(url,function(data){
	  ////console.log('inside deletePostcard');
	  ////console.log(data);
	});
	return promise;
}
  
export function createPostcard(userid, templateid) {
	var url = "Ajax/editor.cfc?method=createPostcard&user_id=" + userid + "&template_id=" + templateid;
	var promise = $.get(url,function(data){
	  ////console.log('inside createPostcard');
	  ////console.log(data);
	});
	return promise;
}

export function handleContentTypeClick(obj) {
	var contenttype = obj.content;

	switch(contenttype) {
	case "coupon":
		couponClicked(obj);
		break;
	case "somethingelse":
		// do something
		break;
	}
}


// save canvas
export function updateSessionObj() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	// Get current canvas json so we have the latest changes
	var json = canvas.toJSON(["name","content","editable","selectable","excludeFromExport","lockMovementX","lockMovementY","lockScalingX","lockScalingY"]);
  
	// parse json into object so we can loop over
	var serialized = (typeof json === "string") ? JSON.parse(json) : json;
	
	// Ensure the indiciamarker obj is not selectable ('selectable:false')
	// Sometimes reverts to true allowing user to delete it
	if (Object.keys(json).length > 0) {
		for (var i = 0, len = serialized.objects.length; i < len; i++) {
			// assign 'selectable:false' for indicia
			if (serialized.objects[i] && serialized.objects[i].name == "indiciamarker") {
				serialized.objects[i].selectable = false;
			}
		}
	}

	// update saved objPanel obj json with new json
	//objPanels[viewingPanelNum - 1].json = JSON.stringify(json);
	objPanels[viewingPanelNum - 1].json = JSON.stringify(serialized);
	
	// Save new entire objPanels data to storage (db)
	writePanelsToPermStorage(objPanels, objPostcard[0].sessionid);
} 

export function writePanelsToPermStorage(data, sessionid) {
	// This is used to store postcard panels json to database.
	// Works this way for logged in or not logged in users.
	// Returns a session_id that is assigned and stored in postcard cookie on user's pc.
	var formData = new FormData();
	formData.append("data", JSON.stringify(data));
	formData.append("session_id", sessionid);

	$.ajax({
		type: "POST",
		url:  "Ajax/editor.cfc?method=insertSessionPostcardPanels",
		data: formData,
		contentType: false,
		processData: false,
		success: function(resp) {
			var obj = $.parseJSON(resp);

			if (obj.sessionid != "") {
				// return new session_id and assign to objPostcard if  new id
				if (sessionid != obj.sessionid) {
					deleteFromStorage("postcard");
					objPostcard[0].sessionid = obj.sessionid;
				}

				var today = new Date();
				var nextyear = today.setFullYear(today.getFullYear() + 1);
				writeToStorage("postcard", objPostcard, nextyear);

			} else {
				// error returned from ajax call
				errorHandler("postcardsave");
			}

			setCanvasDirty(false);
		},
		error: function() {
			errorHandler("postcardsave");
		}
	});  
}

export function readPanelsFromPermStorage(sessionid) {
	// This is used to read postcard panels json from database.
	// Works this way for logged in or not logged in users.
	var url = "Ajax/editor.cfc?method=getSessionPostcardPanels&session_id=" + sessionid;
	var promise = $.get(url,function(data){
	////console.log('inside readPanelsFromPermStorage');
	////console.log(data);
	});
	return promise;
}

export function storageExists(name) {
  	var exists = (docCookies.hasItem(name)) ? true : false;
	return exists;
}

export function writeToStorage(name, data, expires) {
	// This is used to store postcard obj to cookie.
	// works this way for logged in or not logged in users.
	data = JSON.stringify(data);

	// delete any existing cookies
	deleteFromStorage(name);

	docCookies.setItem(name, data, expires);
}

export function readFromStorage(name) {
	// This is used to read postcard obj from cookie.
	// Works this way for logged in or not logged in users.
	var data = docCookies.getItem(name);
	return data;
}

export function deleteFromStorage(name) {
	docCookies.removeItem(name);
}

export function stripIndiciaFromCanvas(canv) {
	var objects = canv.getObjects();
	for (var i = 0; i < objects.length; ) {
		if (objects[i].name == "indiciamarker") {
			// add a new white rectangle exactly where the indicia was to keep the space blank
			var rect = new fabric.Rect({
				top: objects[i].top,
				left: objects[i].left,
				width: objects[i].width,
				height: objects[i].height,
				fill: "#ffffff"
			});
			canv.add(rect);

			// delete inidicia image from canvas
			canv.remove(objects[i]);

			i = 0;
		} else {
			i++;
		}
	}
}

export function quickSave(showpopup) {
	$("#order-button").attr("disabled",true);
  
	// reset toolbar
	hideActiveTools();
	
	updateSessionObj();
  
	// show user of action if directed to (onpage unload event we don't show popup)
	if (showpopup) {
	  swal({
			title: "Great work!",
			text: "We're saving your postcard now...<br/><br/>You can view your saved postcards by clicking 'My Account' in the top right corner.",
			imageUrl: "../images/editor/loading.gif",    
			html: true,
			showCancelButton: false,
			showConfirmButton: false
	  });
	}
  
	// create new postcard_id if doesn't exist yet
	if (objPostcard[0].postcardid == "" || objPostcard[0].postcardid == undefined) {
	  createPostcard(userid, objPostcard[0].templateid).done(function(resp){
		// get new postcard_id
			var obj = $.parseJSON(resp);
			objPostcard[0].postcardid = obj.postcardid;
			$("#showsize").html(objPostcard[0].sizename); // show on page
			$("#showmailtype").html(objPostcard[0].product_type_code); // show on page
			$("#showpostcardid").html(objPostcard[0].postcardid); // show on page
			document.getElementById("PostcardId").value = objPostcard[0].postcardid;  // save to hidden form var for dataswitch page
  
			savePanelsToDatabase();
	  });
  
	} else {
		savePanelsToDatabase();
	}
}

export function savePanelsToDatabase(obj) {
	if (obj.length) {
		// loop each panel
		$.each(obj, function (i) {
			var panelid = obj[i].panel_id;
			var sections = obj[i].section;

			// loop and save each section
			$.each(sections, function (s) {
				var json = JSON.stringify(s.json);

				// save to db
				updateDatabase(panelid, json);
			});
		});
	}
}

export function updateDatabase(thumbnail, postcardid, panelnum, json) {
	if (postcardid == "" || postcardid == undefined) {
		// log error
		errorHandler("savepostcard");
		return;

	} else {

		// post data
		var promise = $.post("Ajax/editor.cfc?method=savePostcardPanel", 
			{ "postcard_id": postcardid, "panel_num": panelnum, "json": json, "thumbnail_image": thumbnail },
			function( data ) {
			////console.log('inside updateDatabase ajax');
			////console.log(data);
			}, "json");

		return promise;
	}
}

export function createFinishedTemplateImageOnServer(panelnum, imgstr, quality) {
	if (objPostcard[0].postcardid == "" || objPostcard[0].postcardid == undefined) {
		// log error
		errorHandler("createimage");  

	} else {

		// pass base64 string to backend to save on filesystem
		var formData = new FormData();
		formData.append("image", imgstr);
		formData.append("panelnum", panelnum);
		formData.append("postcardid", objPostcard[0].postcardid);
		formData.append("resolution", quality);

		$.ajax({
			type: "POST",
			url:  "Ajax/editor.cfc?method=generatePostcardImage",
			data: formData,
			contentType: false,
			processData: false,
			success: function(resp) {
				var obj = $.parseJSON(resp);

				if (obj.status == "success") {
					// when generating last image (the highres) - hide the loading sweetalert popup and enable DONE button
					if (panelnum == 2 && quality == "hires"){
						swal.close();
						$("#order-button").attr("disabled",false);
					}

				} else {
				// error returned from ajax call
					errorHandler("postcardthumb");
				}
			},
			error: function () {
				errorHandler("postcardthumb");
			}
		});
	}
}

export function startAutoSave() {
	// auto-save the panels every 4 seconds
	var msg = setInterval(function() {
		savePanelsToDatabase();
	}, 40000);
}

export function globalEventHandler() {
	// event is triggered manually on preselected actions within the editor
	// update working session obj to store the current
	updateSessionObj();
}

export function setCanvasDirty(val) {
	// set canvas ready flag
	canvasDirty = val;
}

// ------------------------
// toolbar actions
// ------------------------
export function deleteHandler() {
	// Handler for the delete and backspace keys
	$(document).keyup(function(e) {
		if(e.which == 46 || e.which == 8) {
			// Block the functionality if user is entering text
			var active = $(document.activeElement);
			if (active.is("input,textarea,text,password,file,email,search,tel,date")) {
				return;
			}

			deleteSelected();
			e.preventDefault();
		}
	});
}

export function hideActiveTools() {
	$("#active-tools").addClass("noshow");
}

export function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export function showCurrentFont() {
	var font = toTitleCase(getFont());
	if (font.length > 9) {
		font = font.substring(0,10) + "...";
	}
	$("#current-font").text(font);
}

function getFontSize() {
	return getActiveStyle("fontSize");
}
  
export function setFontSize(value) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	setActiveStyle("fontSize", parseInt(value, 10));
	canvas.renderAll();
}

export function setFont(font) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	canvas.getActiveObject().fontFamily = font.toLowerCase();
	canvas.renderAll();
}

function getFont() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var fontFamily = canvas.getActiveObject().fontFamily;
	return fontFamily ? fontFamily.toLowerCase() : "";
}

function getActiveStyle(styleName, object) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	object = object || canvas.getActiveObject();
  
	if (typeof object !== "object" || object === null) {
		return "";
	}
  
	// Don't change part of text
	/*
	return (object.getSelectionStyles && object.isEditing) ? (object.getSelectionStyles()[styleName] || '') : (object[styleName] || '');
	*/
  
	return (object[styleName] || "");
}
  
function setActiveStyle(styleName, value, object) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	object = object || canvas.getActiveObject();
  
	// Don't change part of text
	/*
	if (object.setSelectionStyles && object.isEditing) {
	  var style = { };
	  style[styleName] = value;
	  object.setSelectionStyles(style);
	} else {
	  object[styleName] = value;
	}
	*/
	object[styleName] = value;
}

export function showActiveTools() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	//console.log("inside showActiveTools. canvas",canvas);
	//if (isAppLoading === true) {
	//	return;
	//}
	var tools = $("#active-tools");
	var obj = canvas.getActiveObject();

	//if (canvas.getActiveGroup() !== null && canvas.getActiveGroup() !== undefined) {
	//	$("#active-tools > div").addClass("noshow");
	//	tools.removeClass("noshow");
	//	$("div.group", tools).removeClass("noshow");
	
	//} else if (obj !== null && obj !== undefined) {
	if (obj !== null && obj !== undefined) {

		$("#active-tools > div").addClass("noshow");
		tools.removeClass("noshow");

		var type = canvas.getActiveObject().type;
		//if (type === "i-text") {
		if (type === "i-text" || type === "textbox") {
			$("div.text", tools).removeClass("noshow");

			// bind event to font-size slider
			//$("#font-size-slider").on("input change", function() {
			//	var newsize = $("#font-size-slider")[0].value;
			//	setFontSize(newsize);
			//});

			// set slider to match current text selection font size
			//$("#font-size-slider").val(getFontSize());

			// set font-face dropdown to match current selection font-face
			//showCurrentFont();

		} else if (type === "svg") {
			$("div.svg", tools).removeClass("noshow");
		} else {
			$("div.shape", tools).removeClass("noshow");
		}

		/* TODO
		// Init fill color picker
		fillColorPicker();
		var color = getFillColor();
		if (color && color !== "") {
			$("#toolbar-fill-color").spectrum("set", color);
		}

		// Init outline color picker
		outlineColorPicker();
		var outlineColor = getOutlineColor();
		if (outlineColor && outlineColor !== "") {
			$("#toolbar-outline-color").spectrum("set", outlineColor);
		}
		*/
	} else {
		hideActiveTools();
	}
}

function getFillColor() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var object = canvas.getActiveObject();
	if (object.customFillColor !== undefined) {
		return object.customFillColor;
	} else if (object.type === "line") {
		return getActiveStyle("stroke");
	} else {
		return getActiveStyle("fill");
	}
}
  
export function setFillColor(hex) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var object = canvas.getActiveObject();
	if (object) {
		if (object.type === "i-text") {
			setActiveStyle("fill", hex);
		} else if (object.type === "line") {
			setActiveStyle("stroke", hex);
		} else {
			if (!object.paths) {
				object.setFill(hex);
			} else if (object.paths) {
				for (var i = 0; i < object.paths.length; i++) {
					object.paths[i].setFill(hex);
				}
			}
		}
  
		object.customFillColor = hex;
	}
}

function getOutlineColor() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var object = canvas.getActiveObject();
	if (object.customOutlineColor !== undefined) {
		return object.customOutlineColor;
	}
  
	return getActiveStyle("stroke");
}
  
function setOutlineColor(hex) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var object = canvas.getActiveObject();
	if (object) {
		if (object.type === "i-text" || object.type === "line") {
			setActiveStyle("stroke", hex);
		} else {
			if (!object.paths) {
				object.setStroke(hex);
			} else if (object.paths) {
				for (var i = 0; i < object.paths.length; i++) {
					object.paths[i].setStroke(hex);
				}
			}
		}
  
		object.customOutlineColor = hex;
	}
}

export function rightClick() {
	// Setup right-click context menu
	$.contextMenu({
		selector: ".canvas-container",
		trigger: "right",
		animation: { duration: 0 },
		callback: function(itemKey, opt){
			if (itemKey === "delete") {
				deleteSelected();
			} else if (itemKey === "forward") {
				sendForward();
			} else if (itemKey === "front") {
				sendToFront();
			} else if (itemKey === "backward") {
				sendBackward();
			} else if (itemKey === "back") {
				sendToBack();
			} else if (itemKey === "clone") {
				clone();
			}
		},
		items: {
			"forward": {name: "Bring Forward"},
			"front": {name: "Bring to Front"},
			"backward": {name: "Send Backward"},
			"back": {name: "Send to Back"},
			"sep1": "---------",
			"clone": {name: "Clone"},
			"sep2": "---------",
			"delete": {name: "Delete"}
		}
	});

	// Bind right-click menu
	$(".canvas-container").bind("contextmenu.custom", function (e) {
		const canvas = Store.default.getState().EditorReducer.canvas;
		var target = canvas.findTarget(e);
		if (target !== null && target !== undefined) {
			canvas.setActiveObject(target);
			return true;
		}
		return false;
	});
}

function selectAll(objs) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	canvas.deactivateAll();
  
	if (objs === undefined) {
		objs = canvas.getObjects();
	}
  
	objs.map(function(o) {
		return o.set("active", true);
	});
	var group = new fabric.Group(objs, {
		originX: "center",
		originY: "center"
	});
  
	canvas.setActiveGroup(group.setCoords());
}
  
export function clone() {
	var object = null;
	const canvas = Store.default.getState().EditorReducer.canvas;
	if (canvas.getActiveGroup() !== null) {
		var objects = canvas.getActiveGroup().objects;
  
		// Fabric.js bug getting an object's coordinates when a group is selected
		canvas.deactivateAll();
  
		var cloned = [];
		for (var i = 0; i < objects.length; i++) {
			object = objects[i].clone();
			object.set("top", object.top + 20);
			object.set("left", object.left + 20);
			canvas.add(object);
			cloned.push(object);
		}
  
		selectAll(cloned);

	} else if (canvas.getActiveObject() !== null) {
		object = canvas.getActiveObject().clone();
		object.set("top", object.top + 20);
		object.set("left", object.left + 20);
		canvas.add(object);

		// select new object
		canvas.deactivateAll();
		canvas.setActiveObject(object);
	}
  
	canvas.renderAll();
  
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
  
export function sendForward() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	//TODO
	//if (canvas.getActiveGroup() !== null) {
	//	sendGroupForward(canvas.getActiveGroup(), false);
	//} else if (canvas.getActiveObject() !== null) {
	if (canvas.getActiveObject() !== null) {
		canvas.bringForward(canvas.getActiveObject());
	}
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
  
export function sendBackward() {
	const canvas = Store.default.getState().EditorReducer.canvas;

	// TODO
	//if (canvas.getActiveGroup() !== null) {
	//	sendGroupBackward(canvas.getActiveGroup(), false);
	//} else if (canvas.getActiveObject() !== null) {
	if (canvas.getActiveObject() !== null) {
		canvas.sendBackwards(canvas.getActiveObject());
	}
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
  
export function sendToFront() {
	const canvas = Store.default.getState().EditorReducer.canvas;

	//TODO
	//if (canvas.getActiveGroup() !== null) {
	//	sendGroupForward(canvas.getActiveGroup(), true);
	//} else if (canvas.getActiveObject() !== null) {
	if (canvas.getActiveObject() !== null) {
		canvas.bringToFront(canvas.getActiveObject());
	}
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
  
export function sendToBack() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	
	//TODO
	//if (canvas.getActiveGroup() !== null) {
	//	sendGroupBackward(canvas.getActiveGroup(), true);
	//} else if (canvas.getActiveObject() !== null) {
	if (canvas.getActiveObject() !== null) {
		canvas.sendToBack(canvas.getActiveObject());
	}
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}

// TODO Fabric.js might do this for us now that we've on version >1.5
function sendGroupForward(group, top) {
	// Copy object references
	var sorted = group.objects.slice();
	const canvas = Store.default.getState().EditorReducer.canvas;
  
	// Sort the array
	var objects = canvas.getObjects();
	sorted.sort(function(a, b){
		var z1 = objects.indexOf(a);
		var z2 = objects.indexOf(b);
		return a-b;
	});
  
	// Change layer of objects one-by-one
	var obj;
	if (top === true) {
		for (var i = sorted.length - 1; i >= 0; i--) {
			obj = sorted[i];
			canvas.bringToFront(obj);
		}
	} else {
		for (var j = 0; j < sorted.length; j++) {
			obj = sorted[j];
			canvas.bringForward(obj);
		}
	}
}

// TODO Fabric.js might do this for us now that we've on version >1.5
function sendGroupBackward(group, bottom) {
	// Copy object references
	var sorted = group.objects.slice();
  
	// Sort the array
	const canvas = Store.default.getState().EditorReducer.canvas;
	var objects = canvas.getObjects();
	sorted.sort(function(a, b){
		var z1 = objects.indexOf(a);
		var z2 = objects.indexOf(b);
		return a-b;
	});
  
	// Change layer of objects one-by-one
	var obj;
	if (bottom === true) {
		for (var i = 0; i < sorted.length; i++) {
			obj = sorted[i];
			canvas.sendToBack(obj);
		}
	} else {
		for (var j = sorted.length - 1; j >= 0; j--) {
			obj = sorted[j];
			canvas.sendBackwards(obj);
		}
	}
}
  
export function deleteSelected() {
	// Delete the current object(s)
	const canvas = Store.default.getState().EditorReducer.canvas;
	
	// TODO
	//if(canvas.getActiveGroup() !== null && canvas.getActiveGroup() !== undefined){
	//	canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o); });
	//	canvas.discardActiveGroup().renderAll();
		
	//} else if (canvas.getActiveObject() !== null && canvas.getActiveObject() !== undefined) {
	// && !canvas.getActiveObject().lockMovementX
	if (canvas.getActiveObject() !== null
		&& canvas.getActiveObject() !== undefined
		&& canvas.getActiveObject().allowDelete) {
		canvas.remove(canvas.getActiveObject());
	}
}

/* --- Color Pickers --- */

var changedFillColor;
var changedOutlineColor;

function handleFillColorChangeEvent(color) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	if (canvas.getActiveObject() === null || canvas.getActiveObject() === undefined) {
		// no object selected
		return;
	}

	var hex = color;
	if (typeof(hex) === "object") {
		hex = color.toHexString();
	}

	if (hex === getFillColor()) {
		// same color
		return;
	}

	setFillColor(hex);
	canvas.renderAll();
	changedFillColor = true;
}

function fillColorPicker() {
	$("#toolbar-fill-color").spectrum({
		preferredFormat: "hex",
		showInput: true,
		color: "white",
		showButtons: false,
		clickoutFiresChange: false,
		show: function(color) {
			changedFillColor = false;
		},
		hide: function(color) {
			if (changedFillColor === true) {
				// Push the canvas state to history
				const canvas = Store.default.getState().EditorReducer.canvas;
				canvas.trigger("object:statechange");
			}
			$("#toolbar-fill-color").removeClass("toolbar-item-active");
			$(".mdl-tooltip").removeClass("noshow");
		}
	});

	$("#toolbar-fill-color").unbind("dragstop.spectrum");
	$("#toolbar-fill-color").bind("dragstop.spectrum", function(e, color) {
		handleFillColorChangeEvent(color);
		return false;
	});

	$("#toolbar-fill-color").spectrum("container").find(".sp-input").on("keydown", function(evt) {
		var key = evt.keyCode || evt.which;
		if (key === 13) {
			handleFillColorChangeEvent($(this).val());
		}
	});
}

function handleOutlineColorChangeEvent(color) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	if (canvas.getActiveObject() === null || canvas.getActiveObject() === undefined) {
		// no object selected
		return;
	}

	if (color === null) {
		// Transparent outline color
		setOutlineColor(null);
		canvas.renderAll();
		changedOutlineColor = true;
		return;
	}

	var hex = color;
	if (typeof(hex) === "object") {
		hex = color.toHexString();
	}

	if (hex === getOutlineColor()) {
		// same color
		return;
	}

	setOutlineColor(hex);
	canvas.renderAll();
	changedOutlineColor = true;
}

function outlineColorPicker() {
	$("#toolbar-outline-color").spectrum({
		preferredFormat: "hex",
		showInput: true,
		color: "white",
		showButtons: false,
		clickoutFiresChange: false,
		show: function(color) {
			changedOutlineColor = false;
		},
		hide: function(color) {
			if (changedOutlineColor === true) {
				// Push the canvas state to history
				const canvas = Store.default.getState().EditorReducer.canvas;
				canvas.trigger("object:statechange");
			}
			$("#toolbar-outline-color").removeClass("toolbar-item-active");
			$(".mdl-tooltip").removeClass("noshow");
		},
		move: function(color) {
			if (color === null) {
				// User selected transparent option
				handleOutlineColorChangeEvent(color);
			}
		},
		allowEmpty:true
	});

	$("#toolbar-outline-color").unbind("dragstop.spectrum");
	$("#toolbar-outline-color").bind("dragstop.spectrum", function(e, color) {
		handleOutlineColorChangeEvent(color);
		return false;
	});

	$("#toolbar-outline-color").spectrum("container").find(".sp-input").on("keydown", function(evt) {
		var key = evt.keyCode || evt.which;
		if (key === 13) {
			handleOutlineColorChangeEvent($(this).val());
		}
	});
}

// log errors in db
export function log(msg, browser, url){
	var formData = new FormData();
	formData.append("message", msg);
	formData.append("browser", browser);
	formData.append("url", url);

	$.ajax({
		type: "POST",
		url:  "Ajax/Editor.cfc?method=insertLog",
		data: formData,
		contentType: false,
		processData: false,
		success: function(resp) {
			//var id = $.parseJSON(resp);
		},
		error: function (e) {
			console.log("error inside log function: ", e);
		}
	});
}
  
export function getBrowser(){
	var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
	if(/trident/i.test(M[1])){
		tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
		return "IE"+" "+(tem[1]||"");
	}   
	if(M[1]==="Chrome"){
		tem=ua.match(/\bOPR\/(\d+)/);
		if(tem!=null) 
			return "Opera"+tem[1];
	}   
	M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, "-?"];
	if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
	return M[0]+" "+ M[1];
}
  
export function errorHandler(statusCode){
	// get message from statusCode
	var msg = "";
	switch(statusCode) {
	case "postcard":
		msg = "Your postcard could not be loaded for some reason. Please try again or contact us so we can help get you going again.";
		break;
	case "postcardsave":
		msg = "Your postcard could not be saved for some reason. Please try again or contact us so we can help get you going again.";
		break;
	case "postcardthumb":
		msg = "Your postcard image could not be created for some reason. Please try again or contact us so we can help get you going again.";
		break;          
	case "imageupload":
		msg = "We could not upload your image.";
		break;
	case "imagedelete":
		msg = "Your uploaded image could not be deleted for some reason. Please try again or contact us so we can help get you going again.";
		break;
	case "coupon":
		msg = "We had an issue with the coupon. Please try again or contact us so we can help get you going again.";
		break;
	case "savepostcard":
		msg = "We had an issue saving your postcard. Please contact us so we can help get you going again.";
		break;
	case "createimage":
		msg = "We had an issue saving your postcard. Please contact us so we can help get you going again.";
		break;           
	default:
		msg = "We're sorry for the inconvenience. Please call us at 855-330-3578 so we can get you going again.";
	}

	swal({
		title: "Oh no, we've had a hiccup",
		text: msg,
		html: true,
		showConfirmButton: true
	});

	// log error
	var browserDetails = getBrowser();
	var url = location.pathname;
	log(statusCode + ": " + msg, browserDetails, url);
}


// coupons
export function couponNextStep(templateid) {
	console.log("couponNextStep. templateid=" + templateid);
  
	// determine next step (either edit coupon template or add existing coupon to postcard)
	var filepath = "/images/editor/library/coupons/";

	// get fullsize image version (they clicked on the thumbnail)
	var backgroundimage = filepath + objCoupons[i].filename;

	// use an Image Object to get full-size template width/height (overwrite thumbnail dimensions)
	var img = new Image();
	img.src = backgroundimage;
	img.onload = function() {
		objCoupons[i].width = this.width;
		objCoupons[i].height = this.height;

		// Create coupon canvas
		drawCouponCanvas(objCoupons[i]);
	};

	// coupon_type is USER. User selected existing coupon so add to postcard now
	drawCouponCanvas();

}
  
export function drawCouponCanvas(obj) {
	// open coupon editor overlay
	//openOverlay("editcoupon");

	// get coupon details
	var width = obj.width;
	var height = obj.height;
	var json = obj.json;
	var filepath = "/images/editor/library/coupons/";
	
	// get fullsize image version (they clicked on the thumbnail)
	var backgroundimage = filepath + obj.filename;
	
	// create fabric coupon canvas on page
	var couponcanvas = new fabric.Canvas("coupon_canvas");

	// add class to center canvas after drawing it
	$(".canvas-container").css("margin","0 auto");

	couponcanvas.clear();
	couponcanvas.setWidth(width);
	couponcanvas.setHeight(height);
	//var ctx = couponcanvas.getContext("2d");
	couponcanvas.setBackgroundColor("#ffffff", couponcanvas.renderAll.bind(couponcanvas));

	// load json to canvas
	couponcanvas.loadFromJSON(json, function() {
		// add delay to allow any images to load
		setTimeout(function() {
			couponcanvas.renderAll();
		}, 2000);        
		//couponcanvas.renderAll.bind(couponcanvas);
		//couponcanvas.setBackgroundImage(backgroundimage, couponcanvas.renderAll.bind(couponcanvas));
	});
	
	// bind event to "save" button on coupon editor overlay
	$("#btnCouponSave").click(function() {
		if (loggedin) {
		// get selected coupon and save it - also add to postcard after saving it
			saveCouponImage(couponid, width, height, obj.name);
		} else {
		// add to postcard
			addCouponToPostcard(obj.name, backgroundimage);
		}

		// close all coupons overlay
		var overlay = document.getElementById("allcoupons");
		openCloseOverlay(overlay);

		// close coupon editor overlay
		overlay = document.getElementById("editcoupon");
		openCloseOverlay(overlay);
	});
}

export function ReplaceImageOnCanvas(obj, resolve, reject) {
	console.log("inside ReplaceImageOnCanvas. obj",obj);
	var filepath = obj.highres;

	const canvas = Store.default.getState().EditorReducer.canvas;
	var activeObject = canvas.getActiveObject();
	console.log("ReplaceImageOnCanvas. activeObject",activeObject);
	
	//activeObject.visible = false;	// hide original image while we update with new image
	activeObject.filters[0].scaleX = obj.filters[0].scaleX;
	activeObject.filters[0].scaleY = obj.filters[0].scaleY;
	activeObject.scaleX = obj.scaleX;
	activeObject.scaleY = obj.scaleY;
	activeObject.id = obj.id;
	activeObject.src = filepath;
	activeObject.lockMovementX = obj.lockMovementX;
	activeObject.lockMovementY = obj.lockMovementY;
	activeObject.lockScalingX = obj.lockScalingX;
	activeObject.lockScalingY = obj.lockScalingY;
	activeObject.crossOrigin = "anonymous";
	activeObject.allowDelete = obj.allowDelete;
	activeObject.active = false;
	//activeObject.scale(1);
	//activeObject.visible = true;	// show new image
	activeObject.setSrc(filepath, function () {
		canvas.renderAll();	
	});

	console.log("ReplaceImageOnCanvas. new activeObject",activeObject);

	// return promise
	return resolve();
}

export function createImageAssetOnServer(couponlayoutid, imgstr, finalwidth, finalheight, userid, objname) {
	return "00000000111111111";
}

export function createCouponImageOnServer(couponlayoutid, imgstr, finalwidth, finalheight, userid, objname) {
	// pass base64 string to backend to save on filesystem
	var formData = new FormData();
	formData.append("image", imgstr);
	formData.append("coupon_layout_id", couponlayoutid);
	formData.append("output_width", finalwidth);
	formData.append("output_height", finalheight);
	formData.append("user_id", userid);

	$.ajax({
		type: "POST",
		url:  "Ajax/editor.cfc?method=generateCouponImage",
		data: formData,
		contentType: false,
		processData: false,
		success: function(resp) {
			var obj = $.parseJSON(resp);

			if (obj.status == "success") {
				// insert new coupon image into postcard canvas
				ReplaceImageOnPostcard(objname, obj.filename);

			} else {
			// error returned from ajax call
				errorHandler("coupon");
			}
		},
		error: function () {
			errorHandler("coupon");
		}
	});
}

export function saveCouponImage(couponlayoutid, finalwidth, finalheight, objname) {
	console.log("inside saveCouponImage");
	var couponcanvas = document.getElementById("couponcanvas");
	console.log(couponcanvas);

	var imgstr = couponcanvas.toDataURL({ format: "png", multiplier: 1 });  
	console.log(imgstr);

	// call server code to generate image on server
	createCouponImageOnServer(couponlayoutid, imgstr, finalwidth, finalheight, userid, objname);
}

// grab current canvas objects into json
export function grabPanelData() {
	const canvas = Store.default.getState().EditorReducer.canvas;

	// Define special attributes to collect else Fabric ignores these ones
	var json = canvas.toJSON(["id","name","contentType", "allowDelete", "selectable", "excludeFromExport",
		"lockMovementX", "lockMovementY", "lockScalingX", "lockScalingY"]);
  
	// parse json into object so we can loop over
	var serialized = (typeof json === "string") ? JSON.parse(json) : json;
	//var serialized = JSON.parse(json);
	
	// Ensure the indiciamarker obj is not selectable ('selectable:false')
	// Sometimes reverts to true allowing user to delete it
	/*
	if (Object.keys(json).length > 0) {
		for (var i = 0, len = serialized.objects.length; i < len; i++) {
			// assign 'selectable:false' for indicia
			if (serialized.objects[i] && serialized.objects[i].name == "indiciamarker") {
				serialized.objects[i].selectable = false;
			}
		}
	}
	*/

	// update saved objPanel obj json with new json
	//objPanels[viewingPanelNum - 1].json = JSON.stringify(json);
	//objPanels[viewingPanelNum - 1].json = JSON.stringify(serialized);
	
	// Save new entire objPanels data to storage (db)
	//writePanelsToPermStorage(objPanels, objPostcard[0].sessionid);

	//return JSON.stringify(serialized);
	return serialized;
} 

export function getImageString(multiplierVal) {
	console.log("inside saveCouponImage");
	const canvas = Store.default.getState().EditorReducer.canvas;

	var imgstr = canvas.toDataURL({ format: "png", multiplier: multiplierVal });

	return imgstr;
}