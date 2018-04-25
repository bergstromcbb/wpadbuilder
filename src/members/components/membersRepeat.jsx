import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { Button, Header, Modal, Dropdown } from "semantic-ui-react";
import NumberFormat from "react-number-format";

class MembersRepeat extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			// drawer
			expandedRows: [],
			activeExpandId: null,
			// more tools
			isMoreToolsHovered: false,
			activeToolRowId: null,
			// confirm Inactive member
			openConfirmInactive: false,
			// selected member id
			selMemberId: ""
		};
	}

	handleCancelInactive = () => this.setState({ openConfirmInactive: false })

	// confirm Inactive member
	showConfirmInactive = (e, item) => {
		this.setState({
			openConfirmInactive: true,
			selMemberId: item
		});
	}

	// handle the Inactive member
	handleConfirmInactive = () => {
		this.setState({openConfirmInactive: false});

		// call api to Inactive Member (method exists in parent component)
		this.props.onInactiveMember(this.state.selMemberId);
	}

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
	
	// Highlight the row that is clicked and open drawer under row with more details
	handleRowClick(rowId) {
		const currentExpandedRows = this.state.expandedRows;
		const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

		const newExpandedRows = isRowCurrentlyExpanded ?
			currentExpandedRows.filter(id => id !== rowId) :
			currentExpandedRows.concat(rowId);
 
		this.setState({ expandedRows: newExpandedRows });

		// Add or remove highlight class depending if new or closed the open one
		const currentId = (isRowCurrentlyExpanded) ? null : rowId; 
		this.setState({activeExpandId: currentId});
	}

	renderItem(item) {
		// More tools icon
		const moreToolIcon = (
			<span>
				<Button circular icon='chevron down' />
			</span>
		);
		
		const clickCallback = () => this.handleRowClick(item.id);
		const itemRows = [
			<tr onClick={clickCallback} className={item.id === this.state.activeExpandId ? "shown" : ""} key={"row-data-" + item.id}>
				<td className="pointer v-align-middle semi-bold">{item.first_name} {item.last_name}</td>
				<td>{item.address_1}</td>
				<td className="v-align-middle">{item.address_city}</td>
				<td className="v-align-middle">{item.address_state}</td>
				<td className="v-align-middle">
					<Moment fromNow>
						{item.date_created}
					</Moment>
				</td>
			</tr>
		];
    
		if (this.state.expandedRows.includes(item.id)) {
			itemRows.push(
				<tr className="row-details" key={"row-expanded-" + item.id}
					onMouseEnter={e => this.handleMoreToolsEnter(e, item.id)}
					onMouseLeave={this.handleMoreToolsLeave}
				>
					<td colSpan="5">
						<div className="drawer p-b-20">
							<div className="col-sm-3">
								<address className="margin-bottom-20 margin-top-10">
									{item.company}<br />
									{item.first_name} {item.last_name}<br />
									{item.address_1} {item.address_2}<br />
									{item.address_city}, {item.address_state} {item.address_zip}<br /><br />
									{<NumberFormat value={item.work_phone} displayType={"text"} format="(###) ###-####" />}<br />
									{item.email_address}
								</address>
							</div>
							<div className="col-sm-3">
								<div>Response rate all campaigns
									<div className="progress"><div className="progress-bar progress-bar-warning"></div></div>
									<div className="small hint-text"><a href="#" className="text-muted small">View all</a> campaigns sent to this user</div>
								</div>
								<div className="p-t-20">
									<div className="checkbox check-danger">
										<input type="checkbox" value="1" id="checkbox6" />
										<label>Mark Do Not Contact</label>
									</div>
								</div>
							</div>
							<div className="col-sm-3 pull-right text-right">
								{
									(this.state.activeToolRowId == item.id)
										? <Dropdown trigger={moreToolIcon} icon={null}>
											<Dropdown.Menu>
												<Dropdown.Item value={item.id} onClick={e => this.props.onEditMemberClick(item.id)}>
													<span className='text'>Edit</span>
												</Dropdown.Item>
												<Dropdown.Item value={item.id} onClick={e => this.showConfirmInactive(e, item.id)}>
													<span className='text'>Make inactive</span>
												</Dropdown.Item>												
											</Dropdown.Menu>
										</Dropdown>
										: null
								}
							</div>
						</div>
					</td>
				</tr>
			);
		}
		return itemRows;    
	}

	render() {
		let allItemRows = [];
		const members = this.props.data;
		members.forEach(item => {
			const perItemRows = this.renderItem(item);
			allItemRows = allItemRows.concat(perItemRows);
		});
		return (
			<div>
				<div className="allmembers">
					<div className={this.props.data.length > 0 ? "show" : "hide"}>
						<table id="table-members" className="table table-condensed table-detailed table-responsive-block no-footer" role="grid">
							<thead>
								<tr role="row">
									<th>Name</th>
									<th>Address</th>
									<th>City</th>
									<th>State</th>
									<th>Date Added</th>
								</tr>
							</thead>
							<tbody>
								{allItemRows}
							</tbody>
						</table>
					</div>

					<div className={this.props.data.length == 0 ? "show center clear" : "hide center clear"}>
						<h3>It's easy to import your customers</h3>
						<p>Once you've populated your list, you can use it in your campaigns</p>
						<p className="p-t-20">
							<img src="../../../assets/img/blank_state.png" />
						</p>	
					</div>					
				</div>

				{/* Confirm Inactive member */}
				<Modal
					open={this.state.openConfirmInactive}
					basic size='small'
				>
					<Header icon='thumbs up' content='Are you sure?' />
					<Modal.Content>
						<p>Confirm you want to make this list member inactive?</p>
					</Modal.Content>
					<Modal.Actions>
						<Button inverted className="btn-default" onClick={this.handleCancelInactive}>
							No
						</Button>
						<Button inverted className="btn-primary" onClick={this.handleConfirmInactive}>
							Yes
						</Button>
					</Modal.Actions>
				</Modal>   				
			</div>
		);
	}
}

MembersRepeat.propTypes = {
	data: PropTypes.array,
	onInactiveMember: PropTypes.func,
	onEditMemberClick: PropTypes.func
};

export default MembersRepeat;