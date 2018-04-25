
import React from "react";
import * as TextModule from "../Fabric/textModule.js";
import * as CanvasModule from "../Fabric/canvasModule.js";
import { Grid, Popup } from "semantic-ui-react";

class FloatingToolbar extends React.Component {
	constructor() {
		super();
		this.state = {};		
	}

	render() {

		return (
			<div id="active-tools" className="floatingToolbar">
				<div className="text noshow">
					<div className="menu-section" onClick={() => { TextModule.toggleBold(); }}>
						<i className="fa fa-bold" aria-hidden="true"></i>
					</div>

					<div className="menu-section" onClick={() => { TextModule.toggleItalics(); }}>
						<i className="fa fa-italic" aria-hidden="true"></i>
					</div>

					<div className="menu-section">
						<Popup className="dark" trigger={<i className="fa fa-align-left" aria-hidden="true"></i>} on='click'>
							<Grid divided columns='equal'>
								<Grid.Column>
									<div className="menu-section" onClick={() => { TextModule.textAlignLeft(); }}>
										<i className="fa fa-align-left" aria-hidden="true"></i>
									</div>
								</Grid.Column>
								<Grid.Column>
									<div className="menu-section" onClick={() => { TextModule.textAlignCenter(); }}>
										<i className="fa fa-align-center" aria-hidden="true"></i>
									</div>
								</Grid.Column>
								<Grid.Column>
									<div className="menu-section" onClick={() => { TextModule.textAlignRight(); }}>
										<i className="fa fa-align-right" aria-hidden="true"></i>
									</div>
								</Grid.Column>					
							</Grid>
						</Popup>
					</div>

					<div className="menu-section">
						<Popup className="dark" trigger={<i className="fa fa-text-width" aria-hidden="true"></i>} on='click'>
							<Grid>
								<Grid.Column>
									<div className="menu-section">
										<div className="slider-container">
											<input id="char-spacing-slider" type="range" className="istyle"
												min="0" max="200" step="20" value="0"
												onChange={() => { TextModule.textAlignRight(); }}
											/>										
										</div> 
									</div>	
								</Grid.Column>			
							</Grid>
						</Popup>				
					</div>
					
					<div className="menu-section">
						<Popup className="dark" trigger={<i className="fa fa-text-height" aria-hidden="true"></i>} on='click'>
							<Grid>
								<Grid.Column>
									<div className="menu-section">
										<div className="slider-container">
											<input id="line-height-slider" type="range" className="istyle"
												min="0.7" max="2.0" step="0.1" value="1.0"
												onChange={() => { TextModule.textAlignRight(); }}
											/>
										</div>
									</div>	
								</Grid.Column>			
							</Grid>
						</Popup>
					</div>
				</div>

				<div className="text shape group svg">
					<div className="menu-section">
						<Popup className="dark" trigger={<i className="fa fa-reorder" aria-hidden="true"></i>} on='click' position='right center'>
							<Grid reversed='computer vertically'>
								<Grid.Row>
									<Grid.Column>
										<Popup
											trigger={<div className="menu-section" onClick={() => { CanvasModule.sendToBack(); }}><i className="fa fa-angle-double-down p-l-5 p-r-5" aria-hidden="true"></i></div>}
											content='Send to Back'
											position='top center'
											size='tiny'
											inverted
										/>										
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>
										<Popup
											trigger={<div className="menu-section" onClick={() => { CanvasModule.sendBackward(); }}><i className="fa fa-angle-down p-l-5 p-r-5" aria-hidden="true"></i></div>}
											content='Send Backward'
											position='top center'
											size='tiny'
											inverted
										/>											
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>
										<Popup
											trigger={<div className="menu-section" onClick={() => { CanvasModule.sendForward(); }}><i className="fa fa-angle-up p-l-5 p-r-5" aria-hidden="true"></i></div>}
											content='Bring Forward'
											position='top center'
											size='tiny'
											inverted
										/>											
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>
										<Popup
											trigger={<div className="menu-section" onClick={() => { CanvasModule.sendToFront(); }}><i className="fa fa-angle-double-up p-l-5 p-r-5" aria-hidden="true"></i></div>}
											content='Bring to Front'
											position='top center'
											size='tiny'
											inverted
										/>										
									</Grid.Column>
								</Grid.Row>
							</Grid>							

						</Popup>
						
						{/*
							<Grid divided columns='equal'>
								<Grid.Column>
									<Popup
										trigger={<div className="menu-section"><i className="fa fa-angle-double-down p-l-5 p-r-5" aria-hidden="true"></i></div>}
										content='Send to Back'
										position='top center'
										size='tiny'
										inverted
									/>									
								</Grid.Column>
								<Grid.Column>
									<Popup
										trigger={<div className="menu-section"><i className="fa fa-angle-down p-l-5 p-r-5" aria-hidden="true"></i></div>}
										content='Send Backward'
										position='top center'
										size='tiny'
										inverted
									/>	
								</Grid.Column>
								<Grid.Column>
									<Popup
										trigger={<div className="menu-section"><i className="fa fa-angle-up p-l-5 p-r-5" aria-hidden="true"></i></div>}
										content='Bring Forward'
										position='top center'
										size='tiny'
										inverted
									/>	
								</Grid.Column>
								<Grid.Column>
									<Popup
										trigger={<div className="menu-section"><i className="fa fa-angle-double-up p-l-5 p-r-5" aria-hidden="true"></i></div>}
										content='Bring to Front'
										position='top center'
										size='tiny'
										inverted
									/>	
								</Grid.Column>								
							</Grid>
*/}
					</div>	

					<div className="menu-section" onClick={() => { CanvasModule.deleteSelected(); }}>
						<i className="fa fa-trash-o" aria-hidden="true"></i>
					</div>
				</div>
			</div>
		);
	}
}

export default FloatingToolbar;			