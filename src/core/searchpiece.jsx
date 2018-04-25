import React from "react";
import { hashHistory } from "react-router";
import axios from "axios";
import Noty from "noty";
import { Loader } from "semantic-ui-react";

class SearchField extends React.Component {
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

    	const url = `https://private-8e550-directmail.apiary-mock.com/v1/lists${searchquery}`;

    	axios.get(url,
    		{
    			limit: 10,
    			offset: this.state.offset
    		}
    	).then(response => {
    		// update this.state.data to store these records
    		this.setState({
    			data: response.data.lists,
    			pageCount: Math.ceil(response.data.paging.total / 10),
    			loading: false
    		});

    	}).catch(error => {
    		console.log("Error loading the page", error);
    		this.setState({
    			loading: false,
    			error: error
    		});

    		// Show error notification
    		new Noty({
    			text: "We could not perform the search at this time.",
    			type: "error",
    			closeWith: ["click", "button"]
    		}).show();
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
    	this.setState({ searchString: "" }, () => {
    		this.getRemoteData();
    	});
    }

    // Collect form data and make API call
    // this method is passed to child as a property
    onDeleteList = (listid) => {
    	this.setState({ loading: true });
    	const url = `https://private-8e550-directmail.apiary-mock.com/v1/lists/${listid}`;

    	axios.delete(url).then(response => {
    		if (response.data.result === true) {
    			// remove list from data array in state (and remove from table on page)
    			this.setState({
    				data: this.state.data.filter(function (list) {
    					return list.id != listid;
    				})
    			});

    			// Show success notification
    			new Noty({
    				text: "Your list was deleted",
    				type: "success",
    				timeout: "3500"
    			}).show();

    		} else {
    			// Show error notification
    			throw "API error";
    		}
    	}).catch(error => {
    		console.log("Error deleting your list", error);

    		// Show error notification
    		new Noty({
    			text: "We could not perform your request at this time.",
    			type: "error",
    			closeWith: ["click", "button"]
    		}).show();
    	});
    	this.setState({ loading: false });
    }

    // Collect form data and make API call
    // this method is passed to child as a property
    onCreateList = (name) => {
    	this.setState({ loading: true });
    	const url = "https://private-8e550-directmail.apiary-mock.com/v1/lists";
    	const formData = {
    		"name": name,
    		"list_type": "mail",
    		"active": true
    	};

    	axios.post(url, {
    		formData
    	}).then(response => {
    		// prepend new list to front of "data" array in state (and show in table on page)
    		this.setState({
    			data: [response.data, ...this.state.data]
    		});

    		// Show success notification
    		new Noty({
    			text: "Your new list was created",
    			type: "success",
    			timeout: "3500"
    		}).show();

    		// send to members page for this list
    		hashHistory.push("/members/" + response.data.id);
    	}).catch(error => {
    		console.log("Error creating your list", error);

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
    			<input type="text" className="prompt" ref={props.searchterm} placeholder="SEARCH" />
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
    			<div className="p-t-20 p-b-20">
    				{this.state.loading ? <Loader active inline='centered' /> : ""}
    				<div className="row">
    					<div className="col-sm-12">
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

    						<div className="panel-body">
    							{searchResultsHeading} {/* visible if showing search results */}
    						</div>
    					</div>
    				</div>
    			</div>
    		);
    	}
    }
}

export default SearchField;