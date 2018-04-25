import React from "react";
// import { hashHistory } from "react-router";
import { Loader, Button, Header, Modal, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import RibbonPiece from "../../campaigns/component/RibbonPiece";
import ImportRibbon from "./importribbon";
import MappingDropDown from "./mappingdropdown";
import SearchField from "../../core/searchpiece";
import { Link } from "react-router";
import { AddNewColumn } from "./addnewcolumn";

class DataMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: [],
			modalOpen: false,
			// search
			searchString: ""
		};

	}

	handleOpen = () => this.setState({ modalOpen: true })

	handleClose = () => this.setState({ modalOpen: false })



	render() {

		return (
			<div className="m-t-60 m-l-20">

				<div className="topHeaderContainer ribbon row p-0">
					<RibbonPiece />
					<ImportRibbon
						onCreateList={this.onCreateList}
					/>
				</div>
				<div className="row">
					<div className="col-sm-12">
						<SearchField />
					</div>
				</div>
				<div className="listmaptablemargin">
					<table className="mappingtable">
						<thead className="listheadertablebkgrd">
							<tr className="mappingheader">
								<th colSpan="4">
									<span className="m-l-10 heading">
										map your data
									</span>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="padding-10 text" colSpan="4">
									We've tried to match the data in your spreadsheet's columns (on the right) with the contact field in you accound (on your left).  Please check our work and map any fields we might have missed.  If your spreadsheet had a header row, make sure the "skip" box is checked below.  If you're incuding a date, the format may look different on this screen.  We'll fix itup when we import your data.
								</td>
							</tr>
							<tr>
								<td className="padding-10 subheading center">
									contact fields
								</td>
								<td colSpan="3" className="padding-10 subheading">
									field fields
								</td>
							</tr>
							<tr>
								<td className="padding-10 subheading mapdropfield">
									<button className="ui button btn-primary">
										Clear
									</button>
								</td>
								<td className="padding-10 subheading">
									Row 1
								</td>
								<td className="padding-10 subheading">
									Row 2
								</td>
								<td className="padding-10 subheading">
									Row 3
								</td>

							</tr>
							<tr>
								<td className="padding-10 mapdropfield">
									<MappingDropDown />
								</td>
								<td className="padding-10">
									Dealer ID
								</td>
								<td className="padding-10">
									3423
								</td>
								<td className="padding-10">
									3453
								</td>
							</tr>
							<tr>
								<td className="padding-10 mapdropfield">
									<MappingDropDown />
								</td>
								<td className="padding-10">
									First Name
								</td>
								<td className="padding-10">
									Christie
								</td>
								<td className="padding-10">
									Jackson
								</td>
							</tr>
							<tr>
								<td className="padding-10 mapdropfield">
									<MappingDropDown />
								</td>
								<td className="padding-10">
									Last Name
								</td>
								<td className="padding-10">
									Bergstrom
								</td>
								<td className="padding-10">
									Bergstrom
								</td>
							</tr>
							<tr>
								<td className="padding-10 mapdropfield">
									<MappingDropDown />
								</td>
								<td className="padding-10">
									Company
								</td>
								<td className="padding-10">
									Ford
								</td>
								<td className="padding-10">
									Chrysler
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="mappingbuttons">
					<Modal
						trigger={<Button onClick={this.handleOpen}>Show Modal</Button>}
						open={this.state.modalOpen}
						onClose={this.handleClose}
						className="half"
					>
						<Modal.Header >Add New Column</Modal.Header>
						<Modal.Content>
							<Modal.Description>
								<div className="listFormField">
									<p>New Column Name</p>
									<input
										className="formInput"
										type="text"
										name="campaignName"
										value={this.state.campaignName}
										onChange={this.handleChange} />
									<p>Field Type</p>
									<select className="m-l-10">
										<option placeholder="select a type"> select a type</option>
										<option> text</option>
										<option> number </option>
										<option> boolean </option>
										<option> string </option>
									</select>
									<br /> <br />
								</div>
							</Modal.Description>
						</Modal.Content>
						<Modal.Actions>
							<Button color='teal' onClick={this.handleClose} inverted>
								<Icon name='checkmark' /> Got it
          </Button>
						</Modal.Actions>
					</Modal>

					<Link to="/importallset" className="ui button btn-primary margin-22"> Continue</Link>
					<Link to="/#" className="ui button btn-secondary margin-22"> Cancel</Link>
				</div>
				{/* {this.state.loading ? <Loader active inline='centered' /> : ""} */}

			</div >
		);
	}

}

DataMap.propTypes = {
	perPage: PropTypes.func,
	onDeleteList: PropTypes.func,
};

export default DataMap;