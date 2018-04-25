import React from "react";
import { Link } from "react-router";
import { Button, Modal, Icon } from "semantic-ui-react";
import { Form } from "formsy-react-es6";
import Input from "../../../assets/js/Input";

export default class ListsRibbon extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			// modal new list
			openModal: false,
			// formsy
			canSubmit: false
		};
	}

	// modal new list
	showModal = dimmer => () => this.setState({ dimmer, openModal: true })
	closeModal = () => this.setState({ openModal: false })
	
	// Formsy form submitted
	onFormSubmit = (data) => {
		//this.closeModal
		
		// call api to create list (method exists in parent component)
		this.props.onCreateList(data.list_name);		
	}

	// Update the state of the Formsy form
	enableFormButton = () => {
		this.setState({canSubmit: true});
	}
	disableFormButton = () => {
		this.setState({canSubmit: false});
	}

	render() {
		return (
			<div className="flex hundred row">
				<div className="headerItemLeft col-sm-9">
					<ul className="inline_list">
						<li className="ribbonNav"><a className="" href="index.html">Home</a></li>
						<li className="ribbonNav"><Link to="/lists" activeClassName="active">&#62; Lists</Link></li>
					</ul>
					<p className="panel-title p-l-10 teal all-caps threeHundred">Lists</p>
				</div>
				<div className="headerItemRight border-left p-t-17 newList col-sm-3">
					<Button className="ui button btn-primary" onClick={this.showModal("blurring")}>
						<Button.Content visible>
							<Icon name='plus' /> NEW LIST
						</Button.Content>
					</Button>
				
					<Modal
						dimmer={this.state.dimmer}
						open={this.state.openModal}
						onClose={this.closeModal}
						size='tiny'
					>
						<Modal.Header>Create a new list</Modal.Header>
						<Modal.Content>
							<Form onSubmit={this.onFormSubmit} onValid={this.enableFormButton} onInvalid={this.disableFormButton} className="form">

								<p>Lorem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem </p>

								<div className="p-t-20">
									<div className="col-md-12xx">
										<div className="form-group">
											<label htmlFor="list_name">What would you like to name your list?</label>
											<div>
												<Input type="text" name="list_name" value="" placeholder="Type list name"
													validationError="Type a name for your list" required
												/>
											</div>
										</div>
									</div>

									<div className="actions">
										<button type="button" onClick={this.closeModal} className="ui button btn-default btn-cons">Cancel</button>
										<button type="submit" disabled={!this.state.canSubmit} className="ui button btn-primary btn-cons">Save</button>
									</div>
								</div>
							</Form>
						</Modal.Content>
					</Modal>

				</div>	
			</div>	
		);
	}
}

ListsRibbon.propTypes = {
	onCreateList: React.PropTypes.func
};