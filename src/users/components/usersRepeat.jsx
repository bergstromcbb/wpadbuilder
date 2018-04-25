import React from "react";
import { Button, Header, Modal, Dropdown } from "semantic-ui-react";
import Moment from "react-moment";
import PropTypes from "prop-types";

class UsersRepeat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// more tools
			isMoreToolsHovered: false,
			activeToolRowId: null,
			// confirm Inactive member
			openConfirmInactive: false,
			// selected user id
			selUserId: ""			
		};
	}

	handleCancelInactive = () => this.setState({ openConfirmInactive: false })

	// confirm Inactive user
	showConfirmInactive = (e, item) => {
		this.setState({
			openConfirmInactive: true,
			selUserId: item
		});
	}

	// handle the Inactive user
	handleConfirmInactive = () => {
		this.setState({openConfirmInactive: false});

		// call api to Inactive User (method exists in parent component)
		this.props.onInactiveUser(this.state.selUserId);
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

		// default user avatar photo
		const defaultAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADJUExURejs9MnP4Nrf6+bq883T48HI28rQ4b7F2eXp8r/G2svR4cLJ3NHX5dbb6N3i7dDW5cbM3uTo8cDH2tjd6s7U49TZ58fN3+Po8efr88/V5NHW5dPY5t7j7tTa58DH28PK3Nvg7Ofr9MTL3d3h7d/k7uDl7+Dk77/G2dfc6czS4sjO38fO39PZ59ne68HH287U5Nzh7dLY5sXM3uHl7+Ln8OLm8OHm8MjO4OPn8ebq8s3T4uTp8uTo8svR4tDV5MPJ3N7j7dXb6MjP4BvOJLoAAAMeSURBVHja7dyJkppAEIBhRKABDxC8XXW9dXXv+8r1/g8Vs6lKpZKIM610T6X6f4KvXBiaAdayJEmSJEmSJEmSJEmSJEmSJNZG8zQK41IA24JSHEbpfGSO7nXpJfBXibd8NYI3CWFn4YSdV21CZs0qK6+2gr2tany+KxcUcq+4fBVQrMLja4ByfaN/P6bfsApakZ/MfkkPWPKJgQ5o5tD6pqDdlBRY0AcWKH0zQDQjBHYwwA4h0MUAXTrfF0B1YuJF7vcaZMAQBwzJgDc44I3Z5wjlWQLIyIADnG9ABhzigEMy4CMO+GjurEU9cV3jgNdkwBQHTMmAJ6Zfi99wwDe6cSbB+BLCebCJATYJgXUMsE4I/IoBUu4uTDBAys3MHga4ofMtccvMkspXvMABL4pEQBs7sNpEwDIWWDZ72qKbt1ZY4Er+xIjdaY5rSRULpNqoLi5wvgXVOojZX6XdY7XNXqe3eRifRzjNFBETa71oUXareRwWbi3q1jq+M4s+29Dz41e+DtBnAFpjdd+Yw6czddVZgOfqwHMWoB+o+gKWQ9Cy3lWB7zw+9bGL7eWeM3NX6Z8pPnefsgHVtkB6FmOeWVPWP+aueJ8vLrICrdaeB4tuy2IuNeXRw67amT+h22YHZj9+D/l92a+ofDIAGGUBI9N/wY4BwJcs4IsBwG/GvFG2o8w3HT/z+3wDb+d0bo9tdqBj1Juh+ndOAfffuGf0uLqdtvbeega885bCJhzrUqj0xKTM5+sb/KnBj7qmPWH6Y4HR2En3GBabU62vDUqnxLw77fdswztCXq0bgHZBl+rrq1aE4H0QI4pFe+4geR9EZ57zTkfahANrpvnthZzUEzhCST2XFwlrjTEcrXHjyCdM2/bgyHn28XZFHiIXcsiNHo5zyShAbhUOvsD4/SHk2rDvH3TFSCD3EvQV5v4yAJKCy3sE78kBwpwn3WOvHABpQVnnWBxVBkDeoKL8jw9mMbAUK3672FgAUwuVD9uePWDMe957dsTAWrznXGmvgbl19gyxAfY2+P1cmkqZQDAgAQpQgAIUoAAFKMD/CfgdDUX2ZSQqPyMAAAAASUVORK5CYII=";

		const itemRows = [
			<tr key={"row-data-" + item.id}
				onMouseEnter={e => this.handleMoreToolsEnter(e, item.id)}
				onMouseLeave={this.handleMoreToolsLeave}
			>
				<td>
					<span className="thumbnail-wrapper d32 circular inline">
						<img className="ui avatar image"
							src={(item.profile_pic_string !== "") ?
								item.profile_pic_string : defaultAvatar}
						/>
					</span>
				</td>	
				<td className="v-align-middle">
					<p className="bold m-b-0">
						{item.first_name} {item.last_name}
						{/* TODO: get logged in userid from JWT token  */}
						{item.id === "852aaa9532cb36adfb5e9fef7a4206a9" ? <span className="label m-l-5">You</span> : null}
					</p>
					
					<p className="text-muted small">
						{item.accepted_invitation ? "Created" : "Invitation pending"}
						&nbsp;
						<Moment fromNow>
							{item.date_created}
						</Moment>
					</p>
				</td>
				<td className="v-align-middle center"><p>{item.email_address}</p></td>
				<td className="v-align-middle center"><p>{item.accepted_invitation ? item.user_name : "(pending)"}</p></td>
				<td className="v-align-middle text-right p-r-30">
					{this.state.activeToolRowId == item.id
						?
						(item.accepted_invitation ?
							<Dropdown trigger={moreToolIcon} icon={null}>
								<Dropdown.Menu>
									<Dropdown.Item value={item.id} onClick={() => this.props.onEditUserClick(item.id)}>
										<span className='text'>Edit</span>
									</Dropdown.Item>
									<Dropdown.Item value={item.id} onClick={e => this.showConfirmInactive(e, item.id)}>
										<span className='text'>Revoke access</span>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							:
							<Button className="ui button btn-default btn-small"
								onClick={() => this.props.onSendInvite(item)}>Resend
							</Button>)
						: null}	
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
					<table id="table-users" className="table table-condensed table-responsive-block no-footer" role="grid">
						<thead>
							<tr role="row">
								<th style={{width:"30px"}}>&nbsp;</th>	
								<th className="w-50-p">Name</th>
								<th className="center">Email</th>
								<th className="center">Username</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							{allItemRows}
						</tbody>
					</table>
				</div>

				<div className={this.props.data.length == 0 ? "show center clear" : "hide center clear"}>
					<h3>Create your first user</h3>
					<p>Invite team members and more to accept access to the website. Simply provide their email address to send them an invitation</p>
					<p className="p-t-20">
						<img src="../../../assets/img/blank_state.png" />
					</p>
				</div>

				{/* Confirm Inactive user */}
				<Modal
					open={this.state.openConfirmInactive}
					basic size='small'
				>
					<Header icon='thumbs up' content='Are you sure?' />
					<Modal.Content>
						<p>Confirm you want to revoke access for this user?</p>
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

UsersRepeat.propTypes = {
	data: PropTypes.array,
	onEditUserClick: PropTypes.func,
	onInactiveUser: PropTypes.func,
	onSendInvite: PropTypes.func
};

export default UsersRepeat;