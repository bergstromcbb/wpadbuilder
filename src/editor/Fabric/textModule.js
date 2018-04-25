require("fabric");
const Store = require("../../common/store/index.js");
//const drawing = require('./drawing.js');

// original version
export function insertTextxxx() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	canvas.defaultCursor = "crosshair";
	
	// Esc key handler
	$(document).keyup(escHandler);
	
	canvas.selection = false;
	canvas.forEachObject(function(o) {
		o.selectable = false;
	});
	
	canvas.on("mouse:down", function(o){
		// Unregister escape key handler
		$(document).unbind("keyup", escHandler);
	
		//drawing.disableDraw();
	
		var pointer = canvas.getPointer(o.e);
		var text = new fabric.IText("Add your own text", {
			fontFamily: "arial",
			left: pointer.x,
			top: pointer.y
		});
	
		text.on("editing:exited", function(o){
			$("#toolbar-text").removeClass("toolbar-item-active ");
			if ($(this)[0].text.length === 0) {
				canvas.remove(text);
			} else {
				// Delete the event listener
				//text.__eventListeners["editing:exited"] = [];
	
				// Push the canvas state to history
				canvas.trigger("object:statechange");
			}
		});
	
		text.targetFindTolerance = 4;
	
		canvas.add(text);
		canvas.setActiveObject(text);
		canvas.defaultCursor = "auto";
		text.enterEditing();
	});
}
	
export function cancelInsert() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	canvas.defaultCursor = "auto";
	//drawing.disableDraw();
			
	$("#toolbar-text").removeClass("toolbar-item-active ");
}
	
// Cancel text insertion
export function escHandler(e) {
	if (e.keyCode == 27) {
		cancelInsert();

		// Unregister escape key handler
		$(document).unbind("keyup", escHandler);
	}
}
	
// Return focus to itext if user was editing text
export function returnFocus() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var o = canvas.getActiveObject();
	if (o === undefined || o === null || o.type !== "i-text") {
		return;
	}
	
	if (o.hiddenTextarea) {
		o.hiddenTextarea.focus();
	}
}
	
// Set object style
export function setStyle(object, styleName, value) {
	// Don't allow changing part of the text
	object[styleName] = value;
}
	
// Get object style
export function getStyle(object, styleName) {
	// Don't allow changing part of the text
	return object[styleName];
}
	
export function isItalics(obj) {
	return (getStyle(obj, "fontStyle") || "").indexOf("italic") > -1;
}
	
export function toggleItalics() {
	var button = $("#toolbar-italics");
	const canvas = Store.default.getState().EditorReducer.canvas;
	var obj = canvas.getActiveObject();
	var italics = !isItalics(obj);
	setStyle(obj, "fontStyle", italics ? "italic" : "normal");
	
	if (italics) {
		button.addClass("toolbar-item-active");
	} else {
		button.removeClass("toolbar-item-active");
	}
	canvas.renderAll();
	
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
	
export function isBold(obj) {
	return (getStyle(obj, "fontWeight") || "").indexOf("bold") > -1;
}
	
export function toggleBold() {
	var button = $("#toolbar-bold");
	const canvas = Store.default.getState().EditorReducer.canvas;
	var obj = canvas.getActiveObject();
	var bold = !isBold(obj);
	setStyle(obj, "fontWeight", bold ? "bold" : "");
	
	if (bold) {
		button.addClass("toolbar-item-active");
	} else {
		button.removeClass("toolbar-item-active");
	}
	canvas.renderAll();
	
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
	
export function isUnderline(obj) {
	return (getStyle(obj, "textDecoration") || "").indexOf("underline") > -1;
}
	
export function toggleUnderline() {
	var button = $("#toolbar-underline");
	const canvas = Store.default.getState().EditorReducer.canvas;
	var obj = canvas.getActiveObject();
	var underlined = !isUnderline(obj);
	setStyle(obj, "textDecoration", underlined ? "underline" : "");
	
	if (underlined) {
		button.addClass("toolbar-item-active");
	} else {
		button.removeClass("toolbar-item-active");
	}
	canvas.renderAll();
	
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
	
export function textAlignLeft() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var obj = canvas.getActiveObject();
	obj.set({
		textAlign: "left"
	});
	canvas.renderAll();
	
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
	
export function textAlignCenter() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var obj = canvas.getActiveObject();
	obj.set({
		textAlign: "center"
	});
	canvas.renderAll();
	
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
	
export function textAlignRight() {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var obj = canvas.getActiveObject();
	obj.set({
		textAlign: "right"
	});
	canvas.renderAll();
	
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
	
export function setLineHeight(value) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var obj = canvas.getActiveObject();
	obj.set({
		lineHeight: value
	});
	canvas.renderAll();
	
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}
	
export function setCharSpacing(value) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	var obj = canvas.getActiveObject();
	obj.set({
		charSpacing: value
	});
	canvas.renderAll();
	
	// Push the canvas state to history
	canvas.trigger("object:statechange");
}

export function AddText(obj) {
	const canvas = Store.default.getState().EditorReducer.canvas;
	console.log("AddText. obj",obj);

	var textblock = new fabric.Textbox(
		obj.text, {
			width: 200,
			height: 130,
			fontFamily: obj.fontFamily,
			fontSize: obj.fontSize,
			fontWeight: obj.fontWeight,
			fontStyle: obj.fontStyle,
			lineHeight: obj.lineHeight,
			charSpacing: obj.charSpacing,
			fill: obj.fill,
			textAlign: obj.textAlign,
			left: canvas.width / 2,
			top: canvas.height / 2
		});
	
	canvas.add(textblock);
	canvas.setActiveObject(textblock);
	textblock.enterEditing();
}