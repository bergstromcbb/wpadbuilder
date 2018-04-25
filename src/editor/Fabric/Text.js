require("fabric");
const Store = require("../../common/store/index.js");

class FabricText {
	constructor() {
		this.canvas = Store.default.getState().EditorReducer.canvas;

		console.log("inside FabricText. this.canvas", this.canvas);

		if (this.canvas) {
			const text = new fabric.Textbox("Click to type", {
				left: this.canvas.width / 2,
				top: this.canvas.height / 2,
				width: 200,
				originX: "center",
				originY: "center",
				textAlign: "center",
				fill: "#000000",
				fontSize: 20,
				scaleX: 2,
				scaleY: 2
			});
      
			this.canvas.add(text).renderAll();
			this.canvas.setActiveObject(text);
			text.enterEditing();
		}
	}
}
module.exports = FabricText;