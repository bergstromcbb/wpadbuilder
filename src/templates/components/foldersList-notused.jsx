import React from "react";
import {
	Link,
	hashHistory
} from "react-router";
import axios from "axios";
import Noty from "noty";
import { Dropdown } from "semantic-ui-react";
import PropTypes from "prop-types";

class FolderLists extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: null,
			// folder
			folderId: "",
			folderName: "All folders",
			// folder dropdown
			datafolder: []			
		}; 
	}

	componentDidMount() {
		this.setState({ folderId: this.props.params.folderid }, () => {
			// get page data
			this.getRemoteData();
		});
	}

	// used to re-render components when folder route parameter changes
	componentWillReceiveProps(nextProps) {
		// respond to route parameter change
		if (nextProps.params.folderid !== this.state.folderId) {
			this.setState({ folderId: nextProps.params.folderid }, () => {
				this.getRemoteData();
			});
		}
	}

	// Perform the remote ajax call
	getRemoteData = () => {
		this.setState({ loading: true });

		const url = "https://private-8e550-directmail.apiary-mock.com/v1/templates/folders";
		
		axios.get(url
		).then(response => {
			// update this.state.data to store these records
			this.setState({
				data: response.data.folders,
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
		}
		);
	}

	// Get template folders for dropdown
	getRemoteFolderData = () => {
		// Define the request url
		const url = "https://private-8e550-directmail.apiary-mock.com/v1/templates/folders";
		
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
			
			for (var k in response.data.folders) {
				var row = { key: `${i}`, text: `${response.data.folders[k].name}`, value: `${response.data.folders[k].id}` };
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
				text: "We could not get your template categories at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// show templates in user selected folder
	handleFolderChange = (e, item) => {
		const folderid = item.value;
		const foldername = (item.text === null) ? "All folders" : item.text;
		this.setState({
			loading: true,
			folderName: foldername,
			selectedItems: []
		});
		
		// redirect to the selected folder if different
		if(folderid != this.state.folderId)
			hashHistory.push((folderid === null) ? "/templates" : "/templates/" + folderid);
	}
	
	// show template type dropdown change (directmail/email)
	handleTemplateTypeChange = (e, item) => {
		const typeid = item.value;
		const typename = (item.text === null) ? "Direct Mail" : item.text;
		this.setState({
			loading: true,
			assetTypeName: typename,
			assetTypeId: typeid
		});
		
		// Get asset types
		this.getRemoteData();
	}
	
	render() {
		if (this.state.loading) {
			return <span>Loading...</span>;
		}
		else if (this.state.error !== null) {
			return <span>Error: {this.state.error.message}</span>;
		}
		else {

			return (
				<div>
					<div className="row col-xs-12 p-t-15 v-align-middle p-l-30">
						<div className="row col-xs-12 col-sm-3">
							<Dropdown text={this.state.assetTypeName} className="float-left p-t-10 p-l-30">
								<Dropdown.Menu>
									<Dropdown.Menu scrolling>
										{templateType.map(option =>
											<Dropdown.Item key={option.value} {...option}
												onClick={this.handleTemplateTypeChange}>
											</Dropdown.Item>
										)}
									</Dropdown.Menu>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					
						<div className="row col-xs-12 col-sm-2">
							<Dropdown text={this.state.folderName} className="float-left p-t-10 p-l-30">
								<Dropdown.Menu>
									<Dropdown.Menu scrolling>
										<Dropdown.Item onClick={this.handleFolderChange} scrolling text="All folders" value="" />	
										{this.state.datafolder.map(option =>
											<Dropdown.Item key={option.value} {...option}
												onClick={this.handleFolderChange}
												defaultValue={this.state.folderId}>
											</Dropdown.Item>
										)}
									</Dropdown.Menu>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</div>				
				</div>
			);
		}
	}
}

FolderLists.propTypes = {
	categoryid: PropTypes.string
};
export default FolderLists;