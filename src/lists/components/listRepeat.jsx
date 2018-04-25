import React from "react";
import { Link, hashHistory } from "react-router";
import Moment from "react-moment";
import { Button, Header, Modal, Dropdown } from "semantic-ui-react";
import { Form } from "formsy-react-es6";
import Input from "../../../assets/js/Input";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

class ListRepeat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// more tools
			isMoreToolsHovered: false,
			activeToolRowId: null,
			// formsy
			canSubmit: false,
			// modal copy list
			openModal: false,
			dimmer: "inverted",
			// confirm delete list
			openConfirmDelete: false,
			// selected list id
			selListId: ""
		};
	}

	// modal copy list
	showModal = dimmer => () => this.setState({dimmer, openModal: true})
	closeModal = () => this.setState({openModal: false})

	// confirm delete list
	showConfirmDelete = (e,item) => {
		this.setState({
			openConfirmDelete: true,
			selListId: item
		});
	}

	// handle the delete list
	handleConfirmDeleteList = () => {
		this.setState({openConfirmDelete: false});

		// call api to delete list (method exists in parent component)
		this.props.onDeleteList(this.state.selListId);
	}

	// Formsy form submitted
	onFormSubmit = (data) => {
		//this.closeModal
		
		// call api to create copy list (method exists in parent component)
		this.props.onCreateList(data.list_name);		
	}

	// Update the state of the Formsy form
	enableFormButton = () => {
		this.setState({canSubmit: true});
	}
	disableFormButton = () => {
		this.setState({canSubmit: false});
	}

	handleCancelDeleteList = () => this.setState({openConfirmDelete: false})
  
	// More tools button
	handleMoreToolsEnter = (e, rowId) => {
		this.setState({
			activeToolRowId: rowId,
			isMoreToolsHovered: true
		});
	}
	handleMoreToolsLeave = () => {
		this.setState({
			activeToolRowId: "",
			isMoreToolsHovered: false
		});
	}

	handleMoreTool_ManageMembers = (e, item) => {
		// send to members page for this list
		hashHistory.push("/members/" + item.value);
	}

	handleMoreTool_Import = (e, item) => {
		console.log("handleToolClick. item:", item.value);
	}

	handleMoreTool_Export = (e, item) => {
		console.log("handleToolClick. item:", item.value);
	} 

	renderItem = (item) => {
		// More tools icon
		const moreToolIcon = (
			<span>
				<Button circular icon='chevron down' />
			</span>
		);

		const itemRows = [
			<tr key={"row-data-" + item.id}
				onMouseEnter={e => this.handleMoreToolsEnter(e, item.id)}
				onMouseLeave={this.handleMoreToolsLeave}
			>
				<td className="v-align-middle">
					<p className="m-b-0">
						<Link to={"/members/" + item.id}>
							{item.name}
						</Link>
					</p>
					<p className="text-muted small">Created&nbsp;
					<Moment fromNow>
						{item.date_created}
					</Moment>
					</p>
				</td>
				<td className="v-align-middle center"><p>{<NumberFormat value={item.total_count} displayType={"text"} thousandSeparator={true} />}</p></td>
				<td className="v-align-middle center">
					<p>
						<Moment fromNow>
							{item.last_mem_add_date}
						</Moment>
					</p>
				</td>
				<td className="v-align-middle center">
					<p>
						<Moment fromNow>
							{item.campaign_last_sent}
						</Moment>
					</p>
				</td>
				<td className="v-align-middle text-right p-r-30">
					{
						(this.state.activeToolRowId == item.id)
							? <Dropdown trigger={moreToolIcon} icon={null}>
								<Dropdown.Menu>
									<Dropdown.Item value={item.id} onClick={this.handleMoreTool_ManageMembers}>
										<span className='text'>Manage contacts</span>
									</Dropdown.Item>
									<Dropdown.Item value={item.id} onClick={this.handleMoreTool_Import}>
										<span className='text'>Import</span>
									</Dropdown.Item>
									<Dropdown.Item value={item.id} onClick={this.handleMoreTool_Export}>
										<span className='text'>Export</span>
									</Dropdown.Item>
									<Dropdown.Item value={item.id} onClick={this.showModal("inverted")}>
										<span className='text'>Create copy</span>
									</Dropdown.Item>
									<Dropdown.Item value={item.id} onClick={e => this.showConfirmDelete(e, item.id)}>
										<span className='text'>Delete</span>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							: ""
					}              
				</td>
			</tr>
		];
		return itemRows;
	}
	render() {
		let allItemRows = [];
		var records = this.props.data;
		records.forEach(item => {
			const perItemRows = this.renderItem(item);
			allItemRows = allItemRows.concat(perItemRows);
		});

		return (
			<div>
				<div className={this.props.data.length > 0 ? "show" : "hide"}>
					<table id="table-lists" className="table table-condensed table-responsive-block no-footer" role="grid">
						<thead>
							<tr role="row">
								<th className="w-50-p">Name</th>
								<th className="center">Count</th>
								<th className="center">Last Activity</th>
								<th className="center">Last Used</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{allItemRows}
						</tbody>
					</table>
				</div>
				
				<div className={this.props.data.length == 0 ? "show center clear" : "hide center clear"}>
					<h3>Contact lists allow you to organize and group your contacts</h3>
					<p>You'll want to segment your contacts so you can send campaigns to specific groups</p>
					<p className="p-t-20">
						<img src="../../../assets/img/blank_state.png" />
					</p>
				</div>

				{/* Copy list */}
				<Modal
					dimmer={this.state.dimmer}
					open={this.state.openModal}
					onClose={this.closeModal}
					size='tiny'
				>
					<Modal.Header>Create a copy of your list</Modal.Header>
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

				{/* Confirm delete list */}
				<Modal
					open={this.state.openConfirmDelete}
					basic size='small'
				>
					<Header icon='thumbs up' content='Are you sure?' />
					<Modal.Content>
						<p>Confirm you want to delete this list?</p>
					</Modal.Content>
					<Modal.Actions>
						<Button inverted className="btn-default" onClick={this.handleCancelDeleteList}>
							No
						</Button>
						<Button inverted className="btn-primary" onClick={this.handleConfirmDeleteList}>
							Yes
						</Button>
					</Modal.Actions>
				</Modal>        
			</div>
		);
	}
}

ListRepeat.propTypes = {
	data: PropTypes.array,
	onDeleteList: PropTypes.func,
	onCreateList: PropTypes.func
};

export default ListRepeat;