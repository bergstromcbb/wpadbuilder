import React from "react";
import { Link } from "react-router";
import axios from "axios";
import Paginate from "react-paginate";
import Noty from "noty";
import { slide as FormSlider } from "react-burger-menu";
import { Form } from "formsy-react-es6";
import Input from "../../assets/js/Input";
import RadioGroup from "../../assets/js/RadioGroup";
import { Loader } from "semantic-ui-react";
import UsersRepeat from "./components/usersRepeat";
import AccountTabs from "../account/components/accountTabs";
import PropTypes from "prop-types";
import ReactPlaceholder from "react-placeholder";

class Users extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: [],
			userId: "",
			// search
			searchString: "",
			// pagination
			offset: 0,
			// side panel
			isOpen: false,
			// formsy
			canSubmit: false,
			inputValue: "",
			editRecord: []			
		};
	}
	
	componentDidMount() {
		// get page data
		this.getRemoteData();
	}

	// Perform the remote ajax call
	getRemoteData = () => {
		this.setState({ loading: true });
		const accountid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		// Append optional search to the request url if exists
		const searchquery = (this.state.searchString == "") ? ""
			: `?q=${encodeURIComponent(this.state.searchString)}`;

		const url = `https://private-8e550-directmail.apiary-mock.com/v1/accounts/${accountid}/users${searchquery}`;
		
		axios.get(url,{
			limit: 10,
			offset: this.state.offset
		})
			.then(response => {
				// update this.state.data to store these records
				this.setState({
					data: response.data.users,
					pageCount: Math.ceil(response.data.paging.total / 10),
					loading: false
				});
			})
			.catch(error => {
				console.log("Error loading the page", error);
				this.setState({ loading: false, error: error });

				// Show error notification
				new Noty({
					text: "We could not perform the search at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			});
	}

	// Callback triggered when the user clisk a paging link
	handlePagingClick = (page) => {
		const selectedpage = page.selected;
		const offset = Math.ceil(selectedpage * this.props.perPage);

		this.setState({offset: offset}, () => {
			this.getRemoteData();
		});
	}

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
		this.setState({searchString: ""}, () => {
			this.getRemoteData();
		});
	}

	// Update the state of the Formsy form
	enableFormButton = () => {
		this.setState({ canSubmit: true });
	}
	disableFormButton = () => {
		this.setState({ canSubmit: false });
	}

	// Updates the state of the Menu slideout panel to open
	onEditUserClick = (userid) => {
		const selUser = [this.state.data.filter(function (user) {
			return user.id == userid;
		})];
		
		this.setState({
			isOpen: true,
			sliderMode: "Edit",
			editRecord: selUser[0][0]
		});
	}

	// Formsy form submitted, collect form data and makes API call
	onEditUserFormSubmit = (data) => {
		this.setState({ loading: true });
		const accountid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		const userid = data.user_id;
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/accounts/${accountid}/users/${userid}`;
		const formData = {
			active: data.active,
			first_name: data.first_name,
			last_name: data.last_name,
			email_address: data.email_address,
			user_name: data.user_name,
			role: data.role,
			account_id: accountid
		};

		// submit form data to api
		axios.patch(url, {
			formData
		}).then(response => {
			// Get all other users from "data" array
			const allOtherUsers = this.state.data.filter(function (user) {
				return user.id != userid;
			});

				// prepend updated user to front of "data" array in state (and show in table on page)
			this.setState({
				isOpen: false,
				data: [response.data, ...allOtherUsers]
			});

			// Show success notification
			new Noty({
				text: "The user was updated",
				type: "success",
				timeout: "3500"
			}).show();
			
		}).catch(error => {
			console.log("Error updating the user", error);
	
			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
		
		this.setState({ loading: false });
	}
	
	// Resend invite, collect form data and makes API call
	onSendInvite = (data) => {
		this.setState({ loading: true });
		const accountid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		const url = `https://private-8e550-directmail.apiary-mock.com${accountid}/users/invite`;
		const formData = {
			first_name: data.first_name,
			last_name: data.last_name,
			email_address: data.email_address,
			user_name: data.user_name,
			role: data.role,
			account_id: accountid
		};

		// submit form data to api
		axios.patch(url, {
			formData
		}).then(response => {
			if (response.status == 200) {
				// Show success notification
				new Noty({
					text: "The invitation was sent",
					type: "success",
					timeout: "3500"
				}).show();
			} else {
				// Show error notification
				throw "API error";
			}
			
		}).catch(error => {
			console.log("Error sending the invitation", error);
	
			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
		
		this.setState({ loading: false });
	}
	
	// revoke user access
	onInactiveUser = (id) => {
		console.log("onInactiveUser. id:", id);
		this.setState({ loading: true });
		const accountid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		const userid = id;
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/accounts/${accountid}/users/${userid}`;

		axios.patch(url).then(response => {
			// remove user from data array in state (and remove from table on page)
			this.setState({
				data: this.state.data.filter(function (user) {
					return user.id != userid;
				})
			});

			// Show success notification
			new Noty({
				text: "The user was marked inactive",
				type: "success",
				timeout: "3500"
			}).show();
		}).catch(error => {
			console.log("Error marking user inactive", error);

			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
		
		this.setState({ loading: false });		
	}

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
						<div className="flex hundred">
							<div className="headerItemLeft col-sm-8">
								<ul className="inline_list">
									<li className="ribbonNav"><a className="" href="index.html">Home</a></li>
									<li className="ribbonNav"><Link to="/users" activeClassName="active">&#62; Users</Link></li>
								</ul>
								<p className="panel-title teal all-caps p-l-10 threeHundred">Users</p>
							</div>
							<div className="headerItemRight border-left p-t-17 newList col-sm-4">
								<Link to="/invite" className="ui button btn-primary"><i className="fa fa-plus"></i> NEW USER</Link>
							</div>
						</div>
					</div>

					<div className="p-t-30 p-l-10 p-r-30">
						<p>Your mailings may show your dealership name,
							address and hours of operation on templates.
						</p>
						<div className="p-t-20 clear">
							<AccountTabs activeTab="1" />
									
							<div className="p-t-30">
								<div className="padding-20">
									
									<div className="panel-heading">
										<div className="row">
											<div className="col-sm-12">
												<div className="text-right">
													<div className="search pull-right">
														<form onKeyDown={(e) => { this.onSearchChange(e); }}>
															<div className="ui search">
																<div className="ui icon input">
																	<SearchInput searchterm={input => this.searchterm = input} />
																	<i aria-hidden="true" className="search icon"></i>
																</div>
															</div>
														</form>	
													</div>
												</div>
												<div className="panel-body">

													{searchResultsHeading} {/* visible if showing search results */}

													<div id="detailedTable_wrapper" className="form-inline no-footer">
														<div className="listRow">
															<ReactPlaceholder
																rows={7}
																ready={!this.state.loading}
																color={"#ececec"}
																className={"p-t-30 p-b-30 clear"}
															>
																<UsersRepeat data={this.state.data}
																	onEditUserClick={this.onEditUserClick}
																	onInactiveUser={this.onInactiveUser}
																	onSendInvite={this.onSendInvite}
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
							<h5><span className="semi-bold">EDIT</span> USER</h5>
						</div>

						<Form className="form"
							onSubmit={this.onEditUserFormSubmit}
							onValid={this.enableFormButton}
							onInvalid={this.disableFormButton}
						>
							<Input type="hidden" name="user_id" value={this.state.editRecord.id} />
							
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

							<div className="panel-title">PERMISSIONS</div>

							<div className="form-group">
								<label htmlFor="company" className="col-sm-4 text-right">User Type</label>
								<div className="col-sm-8">
									<RadioGroup name="role"
										items={rolelist}
										value={this.state.editRecord.role}
									/>
								</div>
							</div>

							<br /><br />
							<div>
								<div className="col-sm-offset-3 col-sm-9">
									<button type="submit"
										disabled={!this.state.canSubmit}
										className="ui button btn-primary"
									>Edit</button>
								</div>
							</div>
						</Form>
					</FormSlider>					
				</div>
			);
		}
	}
}

// build object array of radio options
const rolelist = [
	{ label: "Viewer", value: "viewer" },
	{ label: "Author", value: "author" },
	{ label: "Manager", value: "manager" },
	{ label: "Admin", value: "admin" }
];

Users.propTypes = {
	perPage: PropTypes.number
};

export default Users;
