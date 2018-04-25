import React from "react";
import { Button, Modal, Icon, Checkbox, Dropdown, Popup } from "semantic-ui-react";
import Moment from "react-moment";
import DayPicker from "react-day-picker";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

class MailingRepeat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// modal
			openModal: false,
			// datepicker
			selectedDay: new Date(),
			// more tools
			isMoreToolsHovered: false,
			activeToolRowId: null
		};
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

	renderItem = (item) => {

		// More tools icon
		const moreToolIcon = (
			<span>
				<Button circular icon='chevron down' />
			</span>
		);

		const sentDateVal = (item.status === "completed")
			? <Moment format="M/D/YY">
				{item.actual_send_datetime}
			</Moment>
			: <span className="group-container middle">
				<a onClick={this.showModal("inverted")}><Icon name='calendar' size='large' />
					<Moment format="M/D/YY">
						{item.scheduled_send_datetime}
					</Moment>
				</a>
			</span>;

		const itemRows = [
			<tr key={"row-data-" + item.id}
				onMouseEnter={e => this.handleMoreToolsEnter(e, item.id)}
				onMouseLeave={this.handleMoreToolsLeave}
			>
				<td className="v-align-middle">
					<p className="m-b-0 teal">{item.name}</p>
					<p className="text-muted small">Edited&nbsp;
						<Moment fromNow>
							{item.last_changed}
						</Moment>
					</p>
				</td>
				<td className="v-align-middle center"><span className="label all-caps">{item.campaign_type}</span></td>
				<td className="v-align-middle center"><p>{item.order_id}</p></td>
				<td className="v-align-middle center"><p>{<NumberFormat value={item.recipient_count} displayType={"text"} thousandSeparator={true} />}</p></td>
				<td className="v-align-middle center"><p>{sentDateVal}</p></td>
				<td className="v-align-middle text-right p-r-30">
					{
						(this.state.activeToolRowId == item.id)
							? <Dropdown trigger={moreToolIcon} icon={null}>
								<Dropdown.Menu>
									<Dropdown.Item>
										<span className='text'>Create copy</span>
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

	// Date picker
	handleDatePickerClick = day => {
		this.setState({selectedDay: day}, () => {
			this.updateRemoteData();
		});    
	};

	updateRemoteData = () => {
	/*
		let formData = {
		scheduled_send_date: data.first_name,
		scheduled_send_time: data.last_name
		};

			let url = `https://private-8e550-directmail.apiary-mock.com/v1/campaigns/${campaign_id}`;
	
			axios.patch(url,
				{
					limit: 10,
					offset: this.state.offset
				}
			)
			.then(response => {
		// Filter all todos except the one to be removed
		const remainder = this.state.data.filter((response) => {
			if(response.id !== id) return response;
		});
		// Update state with filter
		this.setState({data: remainder});
			
		//EDIT:
		// call setState after the call to map is complete:
		this.setState({people: newPeople}):
		
					// Show success notification
					new Noty({
			text: 'Your changes were saved',
			type: 'success',
			timeout: '3500'
		}).show();      
			})
			.catch(error => {
				console.log('Error updating the record the page', error);
				this.setState({ loading: false, error: error });

				// Show error notification
				new Noty({
					text: 'We could not save your changes at this time.',
					type: 'error',
					closeWith: ['click', 'button']
				}).show();
		});
	*/
	}

	// modal
	showModal = dimmer => () => this.setState({ dimmer, openModal: true })
	closeModal = () => this.setState({ openModal: false })

	render() {
		// modal
		const { openModal, dimmer } = this.state;

		// datepicker
		const weekends = { 
			daysOfWeek: [0,6],
		};

		let allItemRows = [];
		var records = this.props.data;
		records.forEach(item => {
			const perItemRows = this.renderItem(item);
			allItemRows = allItemRows.concat(perItemRows);
		});
		return (
			<div>
				<div className={this.props.data.length > 0 ? "show" : "hide"}>
					<table id="table-mailings" className="table table-condensed table-responsive-block no-footer" role="grid">
						<thead>
							<tr role="row">
								<th className="w-50-p">Name</th>
								<th>Type</th>
								<th>Order #</th>
								<th>Quantity</th>
								<th>Send Date</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							{allItemRows}
						</tbody>
					</table>
				</div>

				<div className={this.props.data.length == 0 ? "show center clear" : "hide center clear"}>
					<h3>Create your first campaign in minutes</h3>
					<p>Engage with your customers with targeted direct mail to increase loyalty and drive revenue.</p>
					<p className="p-t-20">
						<img src="../../../assets/img/blank_state.png" />
					</p>	
				</div>	

				<Modal dimmer={dimmer} open={openModal} onClose={this.closeModal}>
					<Modal.Header>Schedule Delivery</Modal.Header>
					<Modal.Content>
						<p>Lorem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem </p>

						<div className="p-t-20">
							<div className="col-md-7">
								<label>Choose In-Home Date</label>
								<div>
									<DayPicker
										onDayClick={this.handleDatePickerClick}
										selectedDays={this.state.selectedDay}
										disabledDays={weekends}
									/>
								</div>
							</div>

							<div className="col-md-5">
								<label>Mail Delivery Type 
									<Popup
										trigger={<Icon link name='help circle' />}
										content="Standard Presort (3rd Class) can take up to three weeks for delivery and is $0.10 less expensive per mailer."
										basic
									/>
								</label><br />

								<div>
									<Button.Group>
										<Button>First Class</Button>
										<Button.Or />
										<Button>Standard Presort</Button>
									</Button.Group>
								</div>

								<div className="p-t-40">
									<div className="checkbox check-primary">
										<input type="checkbox" value="Y" id="checkbox9" />
										<Checkbox label='Send within 3 business days' />
									</div>
								</div>
							</div>
						</div>
						<br className="clear" /><br />
					</Modal.Content>
					<Modal.Actions>
						<Button className="btn-default" onClick={this.closeModal}>
							Cancel
						</Button>
						<Button className="btn-primary" onClick={this.closeModal}>
							Save	
						</Button>
					</Modal.Actions>
				</Modal>
			</div>
		);
	}
}

MailingRepeat.propTypes = {
	data: PropTypes.array
};

export default MailingRepeat;