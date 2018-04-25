import React from "react";
import PropTypes from "prop-types";
import * as canvasModule from "./canvasModule.js";
import { Loader } from "semantic-ui-react";

require("fabric");

class CanvasBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {		
			canvas: null,
			loading: true
		};

		this.canvasContainer = null;
	}

	componentDidMount() {
		// define canvas
		this.setupCanvas(this.props);
	}

	// dispatching an action based on state change
	componentDidUpdate(nextProps) {
		if (nextProps.data != this.props.data) {
			this.loadCanvas(this.state.canvas);
		}
	}	

	// Setup canvas
	setupCanvas = (props) => {
		//TODO - get from API
		//const postcardWidth = 2550;
		//const postcardWHeight = 1812;
		//console.log("setupCanvas. props",props);
		const postcardWidth = props.data[0].dimensions.width;
		const postcardWHeight = props.data[0].dimensions.height;		

		const canvasReducePct = 33.3; // scale canvas down %
		const canvasWidth = (Math.round(postcardWidth / Math.round(canvasReducePct / 10), 0));
		const canvasHeight = (Math.round(postcardWHeight / Math.round(canvasReducePct / 10), 0));
		//const imageReducePct = Math.round((canvasReducePct / 100), 0); // scale all manually added images down %
				
		// setup fabric canvas size
		const canvas = new fabric.Canvas("canvas");
		canvas.backgroundColor = "#ffffff";
		canvas.setHeight(canvasHeight);
		canvas.setWidth(canvasWidth);
		canvas.renderAll();

		// assign custom settings for canvas object selector box
		fabric.Object.prototype.set({
			transparentCorners: false,
			cornerStyle: "circle",
			cornerColor: "rgba(156,176,184,1)",
			borderColor: "rgba(156,176,184,1)",
			cornerSize: 13,
			borderDashArray:[5,3]
		});	

		// load canvas to Redux store
		this.props.setActiveCanvas(canvas);

		// load canvas to local state
		this.setState({ canvas: canvas });
		
		// load canvas into state and load canvas with template panel data
		this.loadCanvas(canvas);		
	}

	// Setup canvas event listeners
	addEventListeners(canvas, props) {
		canvas.on({
			"object:selected": function () {
				//console.log("object:selected");
				
				// show the appropriate floating toolbar
				canvasModule.showActiveTools();
				
				// get selected object from canvas
				const selCanvasObj = canvasModule.getActiveObj();
				//console.log("addEventListeners. object:selected event selCanvasObj",selCanvasObj);

				// callback to editor.js
				props.handleClick(selCanvasObj);

				// redux clear hover object since object was selected above
				//props.setHoverObject();
			},
			"selection:cleared": function () {
				//console.log("selection:cleared");
				canvasModule.showActiveTools();
			},
			"mouse:down": function () {
				//console.log("mouse:down");
			},
			"mouse:over": function (e) {
				// dim the editable item if selectable obj
				if (e.hasOwnProperty("target")) {
					if (e.hasOwnProperty("target.selectable")) {
						//console.log("mouse:over. a selectable object");
						e.target.set("opacity", 0.7);
						props.setHoverObject(e.target);

						canvas.renderAll();
					}	
				}
			},
			"mouse:out": function (e) {
				// undim the editable item
				if (e.hasOwnProperty("target")) {
					if (e.hasOwnProperty("target.selectable")) {
						//console.log("mouse:out. a selectable object");
						e.target.set("opacity", 1);
						props.setHoverObject("");

						canvas.renderAll();
					}
				}	
			},
			"after:render": function () {
				//console.log("after:render");
			},			
		});

		// setup delete listener
		canvasModule.deleteHandler();
	}

	loadCanvas = (canvas) => {
		this.setState({ loading: true });

		// add fabric canvas event listeners
		this.addEventListeners(canvas, this.props);

		canvas.clear();

		// Setup initial blank canvas
		let blank_panel_json = "{\"objects\": [], \"background\":\"#ffffff\"}";
		canvas.loadFromJSON(blank_panel_json, function() {
			canvas.renderAll.bind(canvas);
		});

		// async-await for-loop to add each section sequentially and synchronously 
		// using promises to ensure each section loads before moving to the 
		// next (important for slow-loading images)
		(async () => {
			for (let i=0; i<this.props.data[0].section.length; i++) {
				//console.log("loadCanvas async loop. this.props.data.section[" + i + "]", this.props.data[0].section[i]);
				
				await createPromise(this.props.data[0].section[i]);

				// promise returned so do next steps
				if (i == (this.props.data[0].section.length - 1)) {
					this.setState({ loading: false });
				}
			}
		})();
		
		// create promise for this section while writing to the canvas
		function createPromise(section) {
			return new Promise((resolve, reject) => {
				// call function to add to canvas
				canvasModule.loadJsonToCanvas(section.json, resolve, reject);
			});
		}

			
		//, () => {
		// set object active
		//console.log("loadJsonToCanvas. then canvas.item(1)",canvas.item(1));
		//canvas.setActiveObject(canvas.item(1));
		//canvas.setActiveObject(this.props.id);
		//});
	}

	render() {

		return (
			<div>
				<div className={this.props.className} ref={(container) => { this.canvasContainer = container; }}>
					{this.state.loading ? <Loader active inline='centered' /> : ""}	
					<canvas id="canvas" />
				</div>
			</div>	
		);
	}
}

CanvasBox.defaultProps = {
	setActiveCanvas: null,
	activeObject: {},
	className: "",
	data: [],
	handleClick: null
};

CanvasBox.propTypes = {
	className: PropTypes.string,
	setActiveCanvas: PropTypes.func,
	activeObject: PropTypes.object,
	hoverObject: PropTypes.object,
	data: PropTypes.array,
	handleClick: PropTypes.func
};

export default CanvasBox;