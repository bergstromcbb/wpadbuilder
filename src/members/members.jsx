import React from "react";
import axios from "axios";
import Noty from "noty";
import { slide as FormSlider } from "react-burger-menu";
import { Form } from "formsy-react-es6";
import Input from "../../assets/js/Input";
import Select from "../../assets/js/Select";
import Paginate from "react-paginate";
import { Loader } from "semantic-ui-react";
import Ribbon from "./components/ribbon";
import MembersRepeat from "./components/membersRepeat";
import { Dropdown } from "semantic-ui-react";
import ReactPlaceholder from "react-placeholder";
import PropTypes from "prop-types";

class Members extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: [],
			listId: "",
			// search
			searchString: "",
			// pagination
			offset: 0,
			// side panel
			isOpen: false,
			sliderMode: "Add",
			// formsy
			canSubmit: false,
			inputValue: "",
			editRecord: [],			
			// list dropdown
			datalist: []
		};
	}

	componentDidMount() {
		this.setState({ listId: this.props.params.listid }, () => {
			// get page data
			this.getRemoteData();
		});
	}

	// Perform the remote ajax call
	getRemoteData = () => {
		this.setState({ loading: true });

		// Append optional search to the request url if exists
		const searchquery = (this.state.searchString == "") ? ""
			: `?q=${encodeURIComponent(this.state.searchString)}`;
		
		const listId = this.state.listId;
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/lists/${listId}/members${searchquery}`;
		
		axios.get(url,
			{
				limit: 10,
				offset: this.state.offset
			}
		).then(response => {
			// update this.state.data to store these records
			this.setState({
				data: response.data.members,
				pageCount: Math.ceil(response.data.paging.total / 10),
				loading: false
			});

			// get list data for dropdown
			this.getRemoteListData();
			
		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not perform the search at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		}
		);
	}

	// Callback triggered when the user clicks a paging link
	handlePagingClick = (page) => {
		let selectedpage = page.selected;
		let offset = Math.ceil(selectedpage * this.props.perPage);

		this.setState({ offset: offset }, () => {
			this.getRemoteData();
		});
	};

	// Callback triggered when the user types in the search field
	onSearchChange = (e) => {
		if (e.key === "Enter" && e.shiftKey === false) {
			// Handle the remote request and update state with the current search string
			if (this.searchterm.value.length > 0) {
				this.setState({ searchString: this.searchterm.value }, () => {
					this.getRemoteData();
				});
			}
		}
	}

	// Callback triggered when the user "clears' the search results
	onSearchClear = () => {
		/*
		 * Handle the remote request to get original non-search data onto page
		 */
		this.setState({ searchString: "" }, () => {
			this.getRemoteData();
		});
	}
	
	// Updates the state of the Menu slideout panel to open
	onMemberClick = () => {
		this.setState({
			isOpen: true,
			sliderMode: "Add"
		});
	}

	// Formsy form submitted, collect form data and makes API call
	onAddMemberFormSubmit = (data) => {
		this.setState({ loading: true });
		const listid = this.state.listId;
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/lists/${listid}/members`;
		const formData = {
			first_name: data.first_name,
			last_name: data.last_name,
			company: data.company,
			address_1: data.address_1,
			address_2: data.address_2,
			address_city: data.city,
			address_state: data.state,
			address_zip: data.zip,
			email_address: data.email_address
			//, doNotContact: this.state.doNotContact;
		};

		// submit form data to api
		axios.post(url, {
			formData
		}).then(response => {
			// prepend new member to front of "data" array in state (and show in table on page)
			this.setState({
				data: [response.data, ...this.state.data]
			});

			// Show success notification
			new Noty({
				text: "Your list member was added",
				type: "success",
				timeout: "3500"
			}).show();
			
		}).catch(error => {
			console.log("Error adding the list member", error);

			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
		
		this.setState({ loading: false });
	}

	// update the input value in the virtual DOM
	handleFormItemChange = (event) => {
		this.setState({
			inputValue: event.target.value
		});
	}
	
	// Updates the state of the Menu slideout panel to open
	onEditMemberClick = (memberid) => {
		const selMember = [this.state.data.filter(function (member) {
			return member.id == memberid;
		})];

		this.setState({
			isOpen: true,
			sliderMode: "Edit",
			editRecord: selMember[0][0]
		});
	}

	// Formsy form submitted, collect form data and makes API call
	onEditMemberFormSubmit = (data) => {
		this.setState({ loading: true });
		const listid = this.state.listId;
		const memberid = data.member_id;
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/lists/${listid}/members/${memberid}`;
		const formData = {
			first_name: data.first_name,
			last_name: data.last_name,
			company: data.company,
			address_1: data.address_1,
			address_2: data.address_2,
			address_city: data.city,
			address_state: data.state,
			address_zip: data.zip,
			email_address: data.email_address
			//, doNotContact: this.state.doNotContact;
		};

		// submit form data to api
		axios.patch(url, {
			formData
		}).then(response => {
			// Get all other members from "data" array
			const allOtherMembers = this.state.data.filter(function (member) {
				return member.id != memberid;
			});

				// prepend updated member to front of "data" array in state (and show in table on page)
			this.setState({
				isOpen: false,
				data: [response.data, ...allOtherMembers]
			});

			// Show success notification
			new Noty({
				text: "Your list member was updated",
				type: "success",
				timeout: "3500"
			}).show();
		}).catch(error => {
			console.log("Error updating the list member", error);
	
			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
		
		this.setState({ loading: false });
	}
	
	// Update the state of the Formsy form
	enableFormButton = () => {
		this.setState({ canSubmit: true });
	}
	disableFormButton = () => {
		this.setState({ canSubmit: false });
	}

	// Collect form data and make API call
	// this method is passed to child as a property
	onInactiveMember = (id) => {
		this.setState({ loading: true });
		const listid = this.state.listId;
		const memberid = id;
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/lists/${listid}/members/${memberid}`;

		axios.patch(url)
			.then(response => {
				console.log(response);
				// remove member from data array in state (and remove from table on page)
				this.setState({
					data: this.state.data.filter(function (member) {
						return member.id != memberid;
					})
				});

				// Show success notification
				new Noty({
					text: "The list member was marked inactive",
					type: "success",
					timeout: "3500"
				}).show();
			})
			.catch(error => {
				console.log("Error marking list member inactive", error);

				// Show error notification
				new Noty({
					text: "We could not perform your request at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			});
		
		this.setState({ loading: false });		
	}

	// Get lists for dropdown
	getRemoteListData = () => {
		// Define the request url
		const url = "https://private-8e550-directmail.apiary-mock.com/v1/lists";
		
		axios.get(url,
			{
				limit: 10,
				offset: 0
			}
		).then(response => {
			// Convert into smaller array with only elements the dropdown needs ('label and 'value' only)
			/* [
					{ key: 1, text: 'Choice 1', value: 1 },
					{ key: 2, text: 'Choice 2', value: 2, disabled: true },
					{ key: 3, text: 'Choice 3', value: 3 }
					// ]
				*/
			var resultArr = [],
				i = 0;
			
			for (var k in response.data.lists) {
				var row = { key: `${i}`, text: `${response.data.lists[k].name}`, value: `${response.data.lists[k].id}` };
				resultArr.push(row);
				i++;
			}

			this.setState({
				datalist: resultArr
			});
			
		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ error: error });

			// Show error notification
			new Noty({
				text: "We could not get your lists at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// User selected a different list
	handleListChange = (e,list) => {
		this.setState({listId: list.value}, () => {
			this.getRemoteData();
		});
	};

	render() {
		// search component 
		function SearchInput(props) {
			return (
				<input type="text" className="prompt" ref={props.searchterm} placeholder="Type search" />
			);
		}

		// search results header
		let searchResultsHeading = null,
			searchterm = this.state.searchString;

		if (searchterm.length > 0) {
			searchResultsHeading = <div className="col-sm-12">
				<h6>Your search results for <strong>{searchterm}</strong>. &nbsp;
					<span className="small text-muted">
						<a onClick={this.onSearchClear}>clear</a>
					</span>
				</h6>
			</div>;
		}

		var isSliderOpen = function (state) {
			return state.isOpen;
		};

		if (this.state.loading) {
			return <section><Loader active inline='centered' /></section>;
		}
		else if (this.state.error !== null) {
			console.log("error", this.state.error);
			new Noty({
				text: "Error loading your data",
				type: "error",
				closeWith: ["click", "button"]
			}).show();

			return <section>error: {this.state.error.message}</section>;
		}
		else {

			return (
				<div className="m-t-60 m-l-20">
					{this.state.loading ? <Loader active inline='centered' /> : ""}
					
					<div className="topHeaderContainer ribbon row p-0">
						<Ribbon
							onMemberClick={this.onMemberClick}
						/>

					</div>
					<div className="full-height p-r-50">
						<div className="col-sm-12 full-height">
							<div className="p-t-30">
								<span className="categorytitle">
									<i className="fa fa-address-card teal"></i>
									<span className="p-l-10 small text-muted">
										<Dropdown inline header='Switch list'
											options={this.state.datalist}
											onChange={this.handleListChange}
											defaultValue={this.state.listId}
										/>
									</span>
								</span>
							</div>
							<div className="container-fixed-lg bg-white555">
								<div className="panel panel-transparent">
									<div className="panel-heading">
										<div className="row">
											<div className="row col-sm-12">
												<div className="col-sm-9">
													<div className="pull-right p-t-10 p-r-30">
														<Dropdown text='Download'>
															<Dropdown.Menu>
																<Dropdown.Item>
																	<span className='text'>Excel</span>
																</Dropdown.Item>
																<Dropdown.Item>
																	<span className='text'>CSV</span>
																</Dropdown.Item> 																
															</Dropdown.Menu>
														</Dropdown>
													</div>
												</div>
												<div className="col-sm-3">
													<div className="text-right">
														<div className="search pull-right">
															<form onKeyDown={(e) => { this.onSearchChange(e); }}>
																<div className="ui search">
																	<div className="ui icon input">
																		<SearchInput
																			searchterm={input => this.searchterm = input}
																		/>
																		<i aria-hidden="true" className="search icon"></i>
																	</div>
																</div>
															</form>
														</div>
													</div>
												</div>

												<div className="panel-body">

													{searchResultsHeading} {/* visible if showing search results */}

													<div id="detailedTable_wrapper" className="dataTables_wrapper form-inline no-footer">
														<div className="row col-sm-12 memberRow">
															<ReactPlaceholder
																rows={7}
																ready={!this.state.loading}
																color={"#ececec"}
																className={"p-t-30 p-b-30 clear"}
															>
																<MembersRepeat
																	data={this.state.data}
																	onInactiveMember={this.onInactiveMember}
																	onEditMemberClick={this.onEditMemberClick}
																/>
															</ReactPlaceholder>	
														</div>
													</div>
												</div>

											</div>
										</div>
									</div>

									<div>
										<Paginate
											previousLabel={"previous"}
											nextLabel={"next"}
											breakLabel={<a href="">...</a>}
											breakClassName={"break-me"}
											pageCount={this.state.pageCount}
											marginPagesDisplayed={2}
											pageRangeDisplayed={5}
											onPageChange={this.handlePagingClick}
											containerClassName={"pagination"}
											subContainerClassName={"pages pagination"}
											activeClassName={"active"}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<FormSlider id={"sidebar"}
						right
						isOpen={this.state.isOpen}
						width={400}
						onStateChange={isSliderOpen}
						noOverlay
					>
						<div className="bm-title">
							<h5><span className="semi-bold">{this.state.sliderMode.toUpperCase()}</span> MEMBER</h5>
						</div>

						<Form className="form"
							onSubmit={(this.state.sliderMode == "Add") ? this.onAddMemberFormSubmit : this.onEditMemberFormSubmit}
							onValid={this.enableFormButton}
							onInvalid={this.disableFormButton}
						>
							<Input type="hidden" name="member_id" value={this.state.editRecord.id} />
							
							<div className="panel-title">FULL NAME</div>

							<div className="form-group">
								<label htmlFor="first_name" className="col-sm-4 text-right">First Name</label>
								<div className="col-sm-8">
									<Input type="text" name="first_name"
										value={this.state.editRecord.first_name}
										onChange={this.state.handleFormItemChange}
										placeholder="First name" required
									/>
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="last_name" className="col-sm-4 text-right">Last Name</label>
								<div className="col-sm-8">
									<Input type="text" name="last_name"
										value={this.state.editRecord.last_name}
										onChange={this.state.handleFormItemChange}										
										placeholder="Last name" required />
								</div>
							</div>

							<br />
							<hr />

							<div className="panel-title">CONTACT INFORMATION</div>

							<div className="form-group">
								<label htmlFor="company" className="col-sm-4 text-right">Company</label>
								<div className="col-sm-8">
									<Input type="text" name="company"
										value={this.state.editRecord.company}
										onChange={this.state.handleFormItemChange}									
										placeholder="(optional)" />
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="address_1" className="col-sm-4 text-right">Address</label>
								<div className="col-sm-8">
									<Input type="text" name="address_1"
										value={this.state.editRecord.address_1}
										onChange={this.state.handleFormItemChange}									
										placeholder="Address" required />
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="address_2" className="col-sm-4 text-right">Address 2</label>
								<div className="col-sm-8">
									<Input type="text" name="address_2"
										value={this.state.editRecord.address_2}
										onChange={this.state.handleFormItemChange}										
										placeholder="(optional)" />
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="city" className="col-sm-4 text-right">City</label>
								<div className="col-sm-8">
									<Input type="text" name="city"
										value={this.state.editRecord.address_city}
										onChange={this.state.handleFormItemChange}									
										placeholder="City" required />
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="state" className="col-sm-4 text-right">State</label>
								<div className="col-sm-8">
									<Select name="state"
										value={this.state.editRecord.address_state}
										onChange={this.state.handleFormItemChange}
										required
										options={statelist}
									/>
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="zip" className="col-sm-4 text-right">Zip</label>
								<div className="col-sm-8">
									<Input type="text" name="zip"
										value={this.state.editRecord.address_zip}
										onChange={this.state.handleFormItemChange}									
										placeholder="Zip" validations="isNumeric" validationError="Enter a valid zip code" required />
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="email_address" className="col-sm-4 text-right">Email</label>
								<div className="col-sm-8">
									<Input name="email_address"
										value={this.state.editRecord.email_address}
										onChange={this.state.handleFormItemChange}										
										placeholder="(optional)" validations="isEmail" validationError="Enter a valid email" />
								</div>
							</div>

							<br />
							{/*
							<hr />
							<div className="panel-title">ADDITIONAL INFORMATION</div>
							<div className="form-group">
								<div className="col-sm-12">
									<div className="checkbox check-success">
										<input
											type="checkbox"
											value="1"
											id="dnc_checkbox"
											value={this.state.doNotContact}
											onChange={this.handleFormItemChange}/>
										<label htmlFor="dnc_checkbox">Do Not Contact</label>
									</div>
								</div>
							</div>
							*/}

							<br />
							<div>
								<div className="col-sm-offset-3 col-sm-9">
									<button type="submit"
										disabled={!this.state.canSubmit}
										className="ui button btn-primary"
									>
										{this.state.sliderMode.toUpperCase()}
									</button>
								</div>
							</div>
						</Form>
					</FormSlider>
				</div>
			);
		}
	}
}

Members.propTypes = {
	params: React.PropTypes.object,
	perPage: PropTypes.number,
	text: PropTypes.string
};

const statelist = [
	{title: "State", value: ""},
	{title: "Alabama", value: "AL"},
	{title: "Alaska", value: "AK"},
	{title: "Arizona", value: "AZ"},
	{title: "Arkansas", value: "AR"},
	{title: "California", value: "CA"},
	{title: "Colorado", value: "CO"},
	{title: "Connecticut", value: "CT"},
	{title: "Delaware", value: "DE"},
	{title: "District Of Columbia", value: "DC"},
	{title: "Florida", value: "FL"},
	{title: "Georgia", value: "GA"},
	{title: "Hawaii", value: "HI"},
	{title: "Idaho", value: "ID"},
	{title: "Illinois", value: "IL"},
	{title: "Indiana", value: "IN"},
	{title: "Iowa", value: "IA"},
	{title: "Kansas", value: "KS"},
	{title: "Kentucky", value: "KY"},
	{title: "Louisiana", value: "LA"},
	{title: "Maine", value: "ME"},
	{title: "Maryland", value: "MD"},
	{title: "Massachusetts", value: "MA"},
	{title: "Michigan", value: "MI"},
	{title: "Minnesota", value: "MN"},
	{title: "Mississippi", value: "MS"},
	{title: "Missouri", value: "MO"},
	{title: "Montana", value: "MT"},
	{title: "Nebraska", value: "NE"},
	{title: "Nevada", value: "NV"},
	{title: "New Hampshire", value: "NH"},
	{title: "New Jersey", value: "NJ"},
	{title: "New Mexico", value: "NM"},
	{title: "New York", value: "NY"},
	{title: "North Carolina", value: "NC"},
	{title: "North Dakota", value: "ND"},
	{title: "Ohio", value: "OH"},
	{title: "Oklahoma", value: "OK"},
	{title: "Oregon", value: "OR"},
	{title: "Palau", value: "PW"},
	{title: "Pennsylvania", value: "PA"},
	{title: "Puerto Rico", value: "PR"},
	{title: "Rhode Island", value: "RI"},
	{title: "South Carolina", value: "SC"},
	{title: "South Dakota", value: "SD"},
	{title: "Tennessee", value: "TN"},
	{title: "Texas", value: "TX"},
	{title: "Utah", value: "UT"},
	{title: "Vermont", value: "VT"},
	{title: "Virgin Islands", value: "VI"},
	{title: "Virginia", value: "VA"},
	{title: "Washington", value: "WA"},
	{title: "West Virginia", value: "WV"},
	{title: "Wisconsin", value: "WI"},
	{title: "Wyoming", value: "WY"}
];

export default Members;