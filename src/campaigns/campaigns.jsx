import React from "react";
import axios from "axios";
import Paginate from "react-paginate";
import Noty from "noty";
import { Loader } from "semantic-ui-react";
import CampaignRepeat from "./component/campaignsRepeat";
import Ribbon from "./component/ribbon";
import PropTypes from "prop-types";
import ReactPlaceholder from "react-placeholder";

class Mailings extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: [],
			// search
			searchString: "",
			// pagination
			offset: 0
		};
	}
	
	componentDidMount() {
		// get page data
		this.getRemoteData();
	}

	// Perform the remote ajax call
	getRemoteData = () => {
		this.setState({ loading: true });
		// Append optional search to the request url if exists
		const searchquery = (this.state.searchString == "") ? ""
			: `?q=${encodeURIComponent(this.state.searchString)}`;

		const url = `https://private-8e550-directmail.apiary-mock.com/v1/campaigns${searchquery}`;
		
		axios.get(url,{
			limit: 10,
			offset: this.state.offset
		}).then(response => {
			// update this.state.data to store these records
			this.setState({
				data: response.data.campaigns,
				pageCount: Math.ceil(response.data.paging.total / 10),
				loading: false
			});
			
		}).catch(error => {
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

	// Callback triggered when the user clicks a paging link
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
						<Ribbon />
					</div>
					<div className="full-height p-r-50">
						<div className="col-sm-12 full-height">
							<div className="p-t-30">
								<span className="categorytitle">
									<i className="fa fa-send teal"></i>
									<span className="p-l-10">Campaigns</span>
								</span>
							</div>
							<div className="container-fixed-lg bg-whiteXX">
								<div className="panel panel-transparent">
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
																<CampaignRepeat data={this.state.data} />
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
				</div>
			);
		}
	}
}

Mailings.propTypes = {
	perPage: PropTypes.number
};

export default Mailings;