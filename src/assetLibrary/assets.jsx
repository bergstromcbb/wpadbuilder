import React from "react";
import { hashHistory } from "react-router";
import axios from "axios";
import { Checkbox, Dropdown, Button, Header, Modal, Loader, List, Icon } from "semantic-ui-react";
import Paginate from "react-paginate";
import Noty from "noty";
import AssetsRepeat from "./components/assetsRepeat";
import { Ribbon } from "./components/ribbon";
import PropTypes from "prop-types";
import ReactPlaceholder from "react-placeholder";
import { Form } from "formsy-react-es6";
import Input from "../../assets/js/Input";

class Assets extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: [],
			// search
			searchString: "",
			// pagination
			offset: 0,
			// file upload
			filesPreview: [],
			filesToBeSent: [],
			rejectedFiles: [],
			// asset types
			assetTypeName: "Images",
			assetTypeId: "images",
			// folder
			folderId: "",
			folderName: "All folders",
			// confirm delete assets
			openConfirmDelete: false,
			// highlighted items
			selectedItems: [],
			showToolbar: false,
			// folder dropdown
			datafolder: [],
			// formsy
			canSubmit: false,
			// modal folders
			openAddFolderModal: false,
			openDeleteFolderModal: false,
			showEditFolderNameTextbox: false,
			dimmer: "blurring"
		};
		this.handleFileUploadDrop = this.handleFileUploadDrop.bind(this);
	}

	componentDidMount() {
		this.setState({ folderId: this.props.params.folderid }, () => {
			// get page data
			this.getRemoteData();
		});
	}

	// used to re-render components when folder route parameter changes
	componentWillReceiveProps(nextProps) {
		console.log("componentWillReceiveProps");
		// respond to route parameter change
		if (nextProps.params.folderid !== this.state.folderId) {
			this.setState({ folderId: nextProps.params.folderid, showToolbar: false }, () => {
				console.log("componentWillReceiveProps. getRemoteData");
				this.getRemoteData();
			});
		}
	}

	// Perform the remote ajax call to get assets
	getRemoteData = () => {
		this.setState({ loading: true });

		// Append optional search to the request url if exists
		const searchquery = (this.state.searchString == "") ? ""
			: `?q=${encodeURIComponent(this.state.searchString)}`;
		
		let url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/types/${this.state.assetTypeId}${searchquery}`;
		
		// If folder is known get assets from that folder instead of all folders
		if (this.state.folderId != undefined) {
			url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/types/${this.state.assetTypeId}/folders/${this.state.folderId}${searchquery}`;
		}

		axios.get(url, {
			limit: 10,
			offset: this.state.offset
		}).then(response => {
			// update this.state.data to store these records
			this.setState({
				data: response.data.assets,
				pageCount: Math.ceil(response.data.paging.total / 10),
				loading: false
			});

			// get folder data for dropdown
			this.getRemoteFolderData();

		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not perform the request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// show asset type dropdown change
	handleAssetTypeChange = (e, item) => {
		console.log("handleAssetTypeChange. item",item);
		const typeid = item.value;
		const typename = (item.text === null) ? "Images" : item.text;

		this.setState({
			loading: true,
			assetTypeName: typename,
			assetTypeId: typeid }, function() {
			// Get assets by type
			this.getRemoteData();
		});
	}
	
	// modals for folder actions
	showAddFolderModal = dimmer => () => this.setState({ dimmer, openAddFolderModal: true })
	closeAddFolderModal = () => this.setState({ openAddFolderModal: false })
	showDeleteFolderModal = dimmer => () => this.setState({ dimmer, openDeleteFolderModal: true })
	closeDeleteFolderModal = () => this.setState({ openDeleteFolderModal: false })
	
	// show assets in selected folder
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
			hashHistory.push((folderid === null) ? "/assets" : "/assets/" + folderid);
	}

	// Callback triggered when the user clisk a paging link
	handlePagingClick = (page) => {
		const selectedpage = page.selected;
		const offset = Math.ceil(selectedpage * this.props.perPage);

		this.setState({ offset: offset }, () => {
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
		this.setState({ searchString: "" }, () => {
			this.getRemoteData();
		});
	}

	// File upload
	handleFileUploadDrop(acceptedFiles, rejectedFiles) {
		var filesToBeSent = this.state.filesToBeSent;
		filesToBeSent.push(acceptedFiles);
		this.setState({ filesToBeSent });
		this.setState({ rejectedFiles });

		this.uploadFiles();
	}

	// Perform the remote ajax call to upload files
	uploadFiles = () => {
		this.setState({ loading: true });
		const url = "https://private-8e550-directmail.apiary-mock.com/v1/assets";

		// "this" is different inside of axios promise
		// so assign context of "this" to "self"
		const self = this;

		// loop over each image
		this.state.filesToBeSent[0].forEach(file => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (e) {
				let fileAsBinaryString = e.target.result;
				let formData = {
					"asset_binary": fileAsBinaryString,
					"file_name": file.name,
					"size": file.size,
					"mime_type": file.type,
					"asset_type": "image",
					"image": [
						{
							"w": 800,
							"h": 320
						}
					],
					"folder_id": "124a764r234j544l998a"
				};

				axios({
					method: "post",
					url: url,
					data: { formData },
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Max-Age": 10
					}
				})
					.then(response => {
						// prepend new image to front of "data" array in state (and show first on page)
						self.setState({
							data: [response.data, ...self.state.data]
						});

						// Show success notification
						new Noty({
							text: `${file.name} was uploaded succesfully`,
							type: "success",
							timeout: "3500"
						}).show();
					})
					.catch(error => {
						console.log(`Error uploading image ${file.name}`, error);

						// Show error notification
						new Noty({
							text: `${file.name} could not be uploaded`,
							type: "error",
							closeWith: ["click", "button"]
						}).show();
					});
			};
			reader.onabort = () => {
				console.log("file reading was aborted");
				// Show error notification
				new Noty({
					text: "Your file upload was stopped",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			};
			reader.onerror = () => {
				console.log("file reading has failed");
				// Show error notification
				new Noty({
					text: "Your file could not be uploaded",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			};
		});
		this.setState({ loading: false });
	}

	// Formsy Add Folder form submitted
	onAddFolderFormSubmit = (data) => {
		this.closeAddFolderModal();
		
		// call api to create new folder
		this.onCreateFolder(data.folder_name);
	}

	// Formsy Edit Folder form submitted
	onEditFolderFormSubmit = (data) => {
		this.closeDeleteFolderModal();
		
		// call api to edit folders
		this.onEditFolder(data.folder_name);
	}

	// Update the state of the Formsy form
	enableFormButton = () => {
		this.setState({ canSubmit: true });
	}
	disableFormButton = () => {
		this.setState({ canSubmit: false });
	}

	// Collect form data and make API call
	onCreateFolder = (name) => {
		const url = "https://private-8e550-directmail.apiary-mock.com/v1/assets/folders";
		const formData = {
			"name": name
		};
		
		axios.post(url, {
			formData
		}).then(response => {
			// update "datafolder" array in state to include new folder
			this.setState({ datafolder: [] });
			this.getRemoteFolderData();

			// Show success notification
			new Noty({
				text: "Your new folder was created",
				type: "success",
				timeout: "3500"
			}).show();

			// send to new folder page
			hashHistory.push("/assets/" + response.data.id);
		}).catch(error => {
			console.log("Error creating your folder", error);

			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	handleEditFolderClick = (e, item) => {
		e.preventDefault();
		console.log("handleEditFolderClick", item);
		
		this.setState({ showEditFolderNameTextbox: true });
	}
		
	// Collect form data and make API call
	onEditFolder = (name) => {
		const url = "https://private-8e550-directmail.apiary-mock.com/v1/assets/folders";
		const formData = {
			"name": name
		};
		
		axios.post(url, {
			formData
		}).then(response => {
			// update "datafolder" array in state to include new folder
			this.setState({ datafolder: [] });
			this.getRemoteFolderData();

			// Show success notification
			new Noty({
				text: "Your new folder was created",
				type: "success",
				timeout: "3500"
			}).show();

			// send to new folder page
			hashHistory.push("/assets/" + response.data.id);
		}).catch(error => {
			console.log("Error creating your folder", error);

			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}	
	
	handleDeleteFolderClick = (folderid) => {
		this.closeDeleteFolderModal();

		if (folderid !== null)
			this.onDeleteFolder(folderid);
	}

	// Collect form data and make API call
	onDeleteFolder = (folderid) => {
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/folders/${folderid}`;
		axios({
			method: "delete",
			url: url,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Max-Age": 10
			}
		})
			.then(response => {
				if (response.data.result === true) {
					// update "datafolder" array in state to remove deleted folder
					this.setState({ datafolder: [] });
					this.getRemoteFolderData();

					// Show success notification
					new Noty({
						text: "Your folder was deleted",
						type: "success",
						timeout: "3500"
					}).show();

					// send to new folder page if user inside just deleted folder
					if (this.state.folderId == folderid)
						hashHistory.push("/assets");
				} else {
					// Show error notification
					throw "API error";
				}
			})
			.catch(error => {
				console.log("Error deleting your folder", error);

				// Show error notification
				new Noty({
					text: "We could not perform your request at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			});
	}	

	// Highlight the image that is clicked
	handleAssetClick = (obj) => {
		const currentSelectedItems = this.state.selectedItems;
		const isCurrentlySelected = currentSelectedItems.includes(obj.id);

		const newSelectedItems = isCurrentlySelected ?
			currentSelectedItems.filter(id => id !== obj.id) :
			currentSelectedItems.concat(obj.id);

		this.setState({
			selectedItems: newSelectedItems,
			showToolbar: (newSelectedItems.length==0) ? false : true
		});
	}

	// Toggle highlight of all the assets
	handleSelectAllAssets = (e, item) => {
		// get object array of the id only
		const checkedItems = this.state.data.map(function (item) {
			return item.id;
		});
		const newSelectedItems = (item.checked) ? checkedItems : [];

		this.setState({
			selectedItems: newSelectedItems,
			showToolbar: item.checked
		});	
	}

	// confirm delete asset
	showConfirmDeleteModal = () => {
		this.setState({
			openConfirmDelete: true
		});
	}

	// Delete assets API call
	// this method is passed to child as a property
	handleDeleteAsset = () => {
		this.setState({
			loading: true,
			openConfirmDelete: false
		});

		// loop each asset and delete it
		this.state.selectedItems.forEach(assetid => {
			const url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/${assetid}`;

			axios.delete(url).then(response => {
				if (response.data.result === true) {
					// get asset obj so we can get file_name, etc
					const assetObj = this.state.data.filter(item => item.id == assetid);

					// remove asset from selectedItems array in state since has been processed
					this.setState({
						selectedItems: this.state.selectedItems.filter(function (asset) {
							return asset != assetid;
						})
					});

					// remove asset from data array in state (and remove from table on page)
					this.setState({
						data: this.state.data.filter(function (asset) {
							return asset.id != assetid;
						})
					});
						
					// Show success notification
					new Noty({
						text: `Successfully deleted ${assetObj[0].file_name}`,
						type: "success",
						timeout: "3500"
					}).show();

				} else {
					// Show error notification
					throw "API error";
				}
				
			}).catch(error => {
				console.log("Error deleting your assets", error);

				// Show error notification
				new Noty({
					text: "We could not perform your request at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			});
		});
	}

	handleCancelDeleteAsset = () => {
		this.setState({ openConfirmDelete: false });
	}

	// move all records in this.state.selectedItems to selected folder
	handleMoveToFolderChange = (e, item) => {
		const folderid = item.value;
		if (folderid !== null) {
			this.setState({ loading: true });

			// loop each asset and re-assign the folder for it
			this.state.selectedItems.forEach(assetid => {
				const url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/${assetid}`;
				const formData = {
					"id": assetid,
					"folder_id": folderid
				};

				axios.patch(url, {
					formData
				}).then((response) => {
					console.log(response);

					// get asset obj so we can get file_name, etc
					const assetObj = this.state.data.filter(item => item.id == assetid);
						
					// remove asset from selectedItems array in state since has been processed
					this.setState({
						selectedItems: this.state.selectedItems.filter(function (asset) {
							return asset != assetid;
						})
					});
					
					// Show success notification
					new Noty({
						text: `Successfully moved ${assetObj[0].file_name}`,
						type: "success",
						timeout: "3500"
					}).show();
					
				}).catch(error => {
					console.log("Error moving your file", error);

					// Show error notification
					new Noty({
						text: "We could not perform your request at this time.",
						type: "error",
						closeWith: ["click", "button"]
					}).show();
				});
			});

			// get folder name from folder id
			const foldersObj = this.state.datafolder.filter(item => item.value == folderid);
		
			// clear the values from state
			this.setState({
				selectedItems: [],
				loading: false,
				folderName: foldersObj[0].text
			});

			// redirect to the selected folder if different (should be)
			if (folderid != this.state.folderId)
				hashHistory.push("/assets/" + folderid);
		}
	}

	// Get folders by asset type for dropdown
	getRemoteFolderData = () => {
		// Define the request url
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/assets/types/${this.state.assetTypeId}/folders`;
		
		axios.get(url,
			{
				limit: 10,
				offset: 0
			}
		)
			.then(response => {
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

				this.setState({ datafolder: resultArr });
			})
			.catch(error => {
				console.log("Error loading the page", error);
				this.setState({ error: error });

				// Show error notification
				new Noty({
					text: "We could not get your folders at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
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

			return <section>error: {this.state.error}</section>;
		}
		else {
			return (
				<div className="m-t-60 m-l-20">
					{this.state.loading ? <Loader active inline='centered' /> : ""}
					
					{/*<Ribbon handleFileUploadDrop={this.handleFileUploadDrop} />*/}
					
					<div className="content">
						<div className="topHeaderContainer ribbon row p-0">
						</div>
						<div className="container-fixed-lg">
							<div className="panel panel-transparent m-t-10">
								<div className="panel-heading ">
									<div className="panel-title semi-bold teal">
										<span className="categorytitle">
											<i className="pg-image teal"></i>
											<span className="p-l-10">Assets</span>
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="row col-xs-12 p-t-15 v-align-middle">

							<div className="row col-xs-3">
								<Checkbox onChange={this.handleSelectAllAssets}
									value={this.toggleAssetsChkboxValue}
									className="float-left"/>

								<Dropdown text={this.state.assetTypeName} className="float-left p-t-10 p-l-30">
									<Dropdown.Menu>
										<Dropdown.Menu scrolling>
											{assetTypes.map(option =>
												<Dropdown.Item key={option.value} {...option}
													onClick={this.handleAssetTypeChange}>
												</Dropdown.Item>
											)}
										</Dropdown.Menu>
									</Dropdown.Menu>
								</Dropdown>
							</div>

							<div className="row col-xs-2">
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
										<Dropdown.Divider />
										<Dropdown.Item icon='plus' text='Add folder' onClick={this.showAddFolderModal("inverted")} />
										<Dropdown.Item icon='trash' text='Manage folders' onClick={this.showDeleteFolderModal("inverted")} />
									</Dropdown.Menu>
								</Dropdown>
							</div>
							
							<div className="col-xs-4">
								<div className={this.state.showToolbar ? "show" : "hide"}>
									<Dropdown text="Move to" scrolling
										onChange={this.handleMoveToFolderChange}
										options={this.state.datafolder}
										value=""
										selectOnBlur={false}
										onBlur={() => this.setState({ selectedItems: [], showToolbar: false })}>
									</Dropdown>

									<span className="p-l-30">
										<button className="ui button btn-default btn-small" onClick={this.showConfirmDeleteModal}>Delete</button>
									</span>
								</div>
							</div>

							<div className="col-xs-3 text-right">
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
						</div>

						<div className="col-sm-12">
							{searchResultsHeading} {/* visible if showing search results */}
						</div>

						<ReactPlaceholder
							type='media'
							rows={5}
							ready={!this.state.loading}
							color={"#ececec"}
							className={"p-t-30 p-b-30 clear"}>
							<AssetsRepeat
								data={this.state.data}
								selectedItems={this.state.selectedItems}
								handleAssetClick={this.handleAssetClick}/>
						</ReactPlaceholder>
					</div>

					<div className="clear">
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
							activeClassName={"active"}/>
					</div>

					
					{/* Add new folder */}
					<Modal
						dimmer={this.state.dimmer}
						open={this.state.openAddFolderModal}
						onClose={this.closeAddFolderModal}
						size='tiny'>
						<Modal.Header>Create a new folder</Modal.Header>
						<Modal.Content>
							<Form onSubmit={this.onAddFolderFormSubmit} onValid={this.enableFormButton} onInvalid={this.disableFormButton} className="form">

								<p>Lorem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem </p>

								<div className="p-t-20">
									<div className="col-md-12xx">
										<div className="form-group">
											<label htmlFor="folder_name">What would you like to name your folder?</label>
											<div>
												<Input type="text" name="folder_name" value="" placeholder="Type folder name"
													validationError="Type a name for your folder" required
												/>
											</div>
										</div>
									</div>

									<div className="actions">
										<button type="button" onClick={this.closeAddFolderModal} className="ui button btn-default">Cancel</button>
										<button type="submit" disabled={!this.state.canSubmit} className="ui button btn-primary">Save</button>
									</div>
								</div>
							</Form>
						</Modal.Content>
					</Modal>


					{/* Manage folders */}
					<Modal
						dimmer={this.state.dimmer}
						open={this.state.openDeleteFolderModal}
						onClose={this.closeDeleteFolderModal}
						size='tiny'>
						<Modal.Header>Manage folders</Modal.Header>
						<Modal.Content scrolling>
							<p>Lorem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem </p>

							<div className="p-t-20">
								<div className="form-group">
									<List divided verticalAlign='middle'>
										{this.state.datafolder.map(option =>												
											<List.Item key={option.value}
												onClick={() => this.handleDeleteFolderClick(option.value)}>
												<List.Content floated='right'>
													<Button className="ui button btn-default btn-small">
														<Icon name='trash' />
													</Button>															
												</List.Content>
												<List.Content>{option.text}</List.Content>															
											</List.Item>)
										}	
									</List>
								</div>

								<div className="actions">
									<button type="button" onClick={this.closeDeleteFolderModal} className="ui button btn-default">Cancel</button>
								</div>
							</div>
						</Modal.Content>
					</Modal>
					

					{/* Confirm delete assets */}
					<Modal
						open={this.state.openConfirmDelete}
						basic size='small'>
						<Header icon='thumbs up' content='Are you sure?' />
						<Modal.Content>
							<p>Confirm you want to delete these item(s)?</p>
						</Modal.Content>
						<Modal.Actions>
							<Button inverted className="btn-default" onClick={this.handleCancelDeleteAsset}>
								No
							</Button>
							<Button inverted className="btn-primary" onClick={this.handleDeleteAsset}>
								Yes
							</Button>
						</Modal.Actions>
					</Modal>
				</div>
			);
		}
	}
}

const assetTypes = [
	{ key: 1, text: "Images", value: "images" },
	{ key: 2, text: "Coupons", value: "coupons" },
];

Assets.propTypes = {
	perPage: PropTypes.number,
	params: React.PropTypes.object
};

export default Assets;