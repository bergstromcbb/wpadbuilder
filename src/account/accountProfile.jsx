import React from "react";
import { Link } from "react-router";
import axios from "axios";
import Noty from "noty";
import { Loader, List, Button, Icon } from "semantic-ui-react";
import { Form } from "formsy-react-es6";
import Input from "../../assets/js/Input";
import RadioGroup from "../../assets/js/RadioGroup";
import AccountTabs from "../account/components/accountTabs";
import Dropzone from "react-dropzone";
import * as Utils from "../../assets/js/Utils";

class AccountProfile extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: {},
			// formsy
			canSubmit: false,
			inputValue: "",
			editRecord: [],
			// file upload
			filesPreview: [],
			filesToBeSent: [],
			rejectedFiles: [],
			// form editable
			canEdit: false
		};
	}

	componentDidMount() {
		// determine user role
		const userRole = "admin";	// TODO: get from JWT token
		if (["manager","admin"].indexOf(userRole) >= 0) {
			this.setState({ canEdit: true });
		}

		// get page data
		this.getRemoteData();
	}

	// Perform the remote ajax call
	getRemoteData = () => {
		this.setState({ loading: true });
		const accountid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/accounts/${accountid}`;
		
		axios.get(url).then(response => {
			// update this.state.data to store the data
			this.setState({
				data: response.data,
				loading: false
			});
			
		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ loading: false, error: error });

			// Show error notification
			new Noty({
				text: "We could not retrieve your data at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	handleDeleteContactClick = (data) => {
		//TODO: delete when real api is active.
		// update this.data.state to remove the contact (property)
		const dataCopy = Object.assign({}, this.state.data);
		const newData = Object.assign({}, dataCopy, {
			organization: {
				...dataCopy.organization,
				org_contacts: Utils.getAllPropertiesExceptId(
					dataCopy.organization.org_contacts,
					data.id
				)
			}
		});

		this.setState({ data: { ...this.state.data, ...newData } });
		
		// Show success notification
		new Noty({
			text: "The contact was deleted",
			type: "success",
			timeout: "3500"
		}).show();
		//TODO: END delete when real api is active.
		
		/*  TODO: uncomment when real api is active. The apiary server does not allow delete methods
		this.setState({ loading: true });
		const accountid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/accounts/${accountid}`;
		const formData = {
			organization: { org_contacts: data.id }
		};

		// submit form data to api
		axios({
			method: "delete",
			url: url,
			data: { formData },
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Max-Age": 10
				,"Access-Control-Allow-Methods": "DELETE"
				,"Access-Control-Request-Method": "DELETE"
				,"Access-Control-Allow-Headers": "X-Requested-With"
			}
		})
			.then(response => {
				if (response.data.result === true) {
					// update this.data.state to remove the contact (property)
					const dataCopy = Object.assign({}, this.state.data);
					const newData = Object.assign({}, dataCopy, {
						organization: {
							...dataCopy.organization,
							org_contacts: Utils.GetAllPropertiesExceptId(
								dataCopy.organization.org_contacts,
								data.id
							)
						}
					});

					this.setState({ data: { ...this.state.data, ...newData } });

					// Show success notification
					new Noty({
						text: "The contact was deleted",
						type: "success",
						timeout: "3500"
					}).show();
					
				} else {
					// Show error notification
					throw "API error";
				}
			})
			.catch(error => {
				console.log("Error saving your changes", error);

				// Show error notification
				new Noty({
					text: "We could not perform your request at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			});
		
		this.setState({ loading: false });
		*/
	}

	handleWebsiteChange = (data) => {
		const formData = {
			organization: { org_website: data.website }
		};

		// call api and pass callback function
		this.patchRemoteCall(formData);
	}

	handleHoursChange = (data) => {
		const formData = {
			organization: {
				org_hours: {
					line_1: data.line_1,
					line_2: data.line_2,
					line_3: data.line_3,
					line_4: data.line_4,
					line_5: data.line_5,
					line_6: data.line_6,
					line_7: data.line_7
				}
			}
		};

		// call api and pass callback function
		this.patchRemoteCall(formData);
	}

	handleDefaultPhoneChange = (data) => {
		const formData = {
			organization: {
				org_phones: {
					primary_org_phone_id: data.id
				}
			}
		};
		
		this.patchRemoteCall(formData);
	}

	handleDefaultAddressChange = (data) => {
		const formData = {
			organization: {
				org_address: {
					primary_org_address_id: data.id
				}
			}
		};
		
		this.patchRemoteCall(formData);
	}
	
	// Button clicked, collect form data and makes API call
	// this function handles all "patch" calls in the form
	patchRemoteCall = (data) => {
		this.setState({ loading: true });
		const accountid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/accounts/${accountid}`;
		
		// submit form data to api
		axios.patch(url, {
			data
		}).then(response => {
			// update the state data to show changes on page
			this.setState({ data: { ...this.state.data, ...response.data } });

			// Show success notification
			new Noty({
				text: "Your changes were saved",
				type: "success",
				timeout: "3500"
			}).show();
		}).catch(error => {
			console.log("Error saving your changes", error);

			// Show error notification
			new Noty({
				text: "We could not perform your request at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
		
		this.setState({ loading: false });
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
						console.log("response.data", response.data);
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

	render() {
		const handleFileUploadDropRejected = (...args) => console.log("reject", args);

		function AccountInformation(props) {
			return (
				<div>
					<div className="social-user-profile col-xs-height text-center col-top">
						<div className="thumbnail-wrapper d48 circularx bordered">
							<img alt="Logo" src={props.data.organization.logo_image_path} />
						</div>
						<br />
						<Dropzone className="nodropzone"
							onDrop={(files) => this.handleFileUploadDrop(files)}
							accept="image/jpeg,image/jpg,image/gif,image/png"
							disablePreview={true}
							multiple={false}
							maxSize={100000}
							minSize={0}
							onDropRejected={handleFileUploadDropRejected}
						>
							<span className="textlink">Upload</span>
						</Dropzone>
					</div>
					<div className="col-xs-height p-l-20">
						<h5 className="no-margin">{props.data.organization.org_name}</h5>
						<p className="no-margin fs-14"><span className="bold">Code</span> {props.data.organization.code}</p>
						<p className="no-margin fs-14"><span className="bold">Business Center</span> {props.data.organization.region}</p>
						<p className="no-margin fs-14"><span className="bold">District</span> {props.data.organization.district}</p>
					</div>
				</div>	
			);
		}

		function AccountAddress(props) {
			// build object array of radio options
			var arrRadioOptions = [];
			arrRadioOptions = props.data.organization.org_addresses.map((option) => {
				return {
					"label": `${option.address_title}: ${option.address_1} ${option.address_2} ${option.address_city}, ${option.address_state} ${option.address_zip}`,
					"value": option.id
				};
			});

			return (
				<div className="panel-body fs-14">
					<Form className="form" onSubmit={(data) => { props.handleDefaultAddressChange(data); }}>
						<div>
							<RadioGroup
								name="org_address"
								items={arrRadioOptions}
								value={props.data.organization.primary_org_address_id}
								disabled={props.canEdit ? false : true}
								className="showprimarylabel"
							/>
						</div>

						{props.canEdit ?
							<div className="p-t-5 p-b-20">
								<button type="submit" className="ui button btn-default btn-small">Save</button>
							</div> : null
						}	
					</Form>
				</div>
			);
		}

		function AccountContactInfo(props) {
			// build object array of radio options
			var arrRadioOptions = [];
			arrRadioOptions = props.data.organization.org_phones.map((option) => {
				return {
					"label": `${option.phone_title}: ${Utils.formatPhoneNumber(option.phone)}`,
					"value": option.id
				};
			});

			return (		
				<div className="row">
					<div className="col-sm-6">
						<div className="panel panel-transparent">
							<div className="panel-body">
								<h6 className="semi-bold">Website</h6>

								{props.canEdit ?
									<div>	
										<Form className="form" onSubmit={(data) => { props.handleWebsiteChange(data);}}>
											<div className="form-group">
												<Input type="text" name="website"
													value={props.data.organization.org_website}
													placeholder="Website"
												/>
											</div>
											<div className="p-t-5 p-b-20">
												<button type="submit" className="ui button btn-default btn-small">Save</button>
											</div>
										</Form>
									</div> :
									<div>
										<p>{props.data.organization.org_website}</p>
									</div>
								}

								<div className="p-t-20">
									<h6 className="semi-bold">Phone Number</h6>
									
									<Form className="form" onSubmit={(data) => { props.handleDefaultPhoneChange(data); }}>
										<div>
											<RadioGroup name="org_phones"
												items={arrRadioOptions}
												value={props.data.organization.primary_org_phone_id}
												disabled={props.canEdit ? false : true}
												className="showprimarylabel"
											/>
										</div>

										{props.canEdit ?
											<div className="p-t-5 p-b-20">
												<button type="submit" className="ui button btn-default btn-small">Save</button>
											</div> : null
										}										
									</Form>	
									
									<div className="p-t-20">
										<h6 className="semi-bold">Contacts</h6>
										<List divided verticalAlign='middle'>
											{props.data.organization.org_contacts.map((option, i) =>
												<List.Item key={i}
													onClick={() => props.handleDeleteContactClick(option)}>
													<List.Content floated='right'>
														<Button className="ui button btn-default btn-small">
															<Icon name='trash' />
														</Button>
													</List.Content>
													<List.Content>
														<span className="bold">{option.title}</span>: {option.name}
													</List.Content>															
												</List.Item>
											)}	
										</List>
									</div>									
								</div>
							</div>
						</div>
					</div>

					<div className="col-sm-6">
						<div className="panel-body">
							<h6 className="semi-bold">Hours of Operation</h6>
							
							{props.canEdit ?
								<div>
									<Form className="form" onSubmit={(data) => { props.handleHoursChange(data); }}>
										<div className="form-group">
											<div><Input type="text" name="line_1" value={props.data.organization.org_hours.line_1} placeholder="Line 1" /></div>
											<div className="p-t-5"><Input type="text" name="line_2" value={props.data.organization.org_hours.line_2} placeholder="Line 2" /></div>
											<div className="p-t-5"><Input type="text" name="line_3" value={props.data.organization.org_hours.line_3} placeholder="Line 3" /></div>
											<div className="p-t-5"><Input type="text" name="line_4" value={props.data.organization.org_hours.line_4} placeholder="Line 4" /></div>
											<div className="p-t-5"><Input type="text" name="line_5" value={props.data.organization.org_hours.line_5} placeholder="Line 5" /></div>
											<div className="p-t-5"><Input type="text" name="line_6" value={props.data.organization.org_hours.line_6} placeholder="Line 6" /></div>
											<div className="p-t-5"><Input type="text" name="line_7" value={props.data.organization.org_hours.line_7} placeholder="Line 7"/></div>
										</div>
										<button type="submit" className="ui button btn-default btn-small">Save</button>
									</Form>
								</div> :
								<div>
									<p className="no-margin">{props.data.organization.org_hours.line_1}</p>
									<p className="no-margin">{props.data.organization.org_hours.line_2}</p>
									<p className="no-margin">{props.data.organization.org_hours.line_3}</p>
									<p className="no-margin">{props.data.organization.org_hours.line_4}</p>
									<p className="no-margin">{props.data.organization.org_hours.line_5}</p>
									<p className="no-margin">{props.data.organization.org_hours.line_6}</p>
									<p className="no-margin">{props.data.organization.org_hours.line_7}</p>
								</div>
							}
						</div>
					</div>
				</div>
			);
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
				<div className="m-t-60">
					<div className="topHeaderContainer ribbon row p-0">
						<div className="headerItemLeft ">
							<ul className="breadcrumb">
								<li><Link to="Home">Home</Link></li>
								<li>Dealer Profile</li>
							</ul>
							<p className="panel-title teal all-caps threeHundred">Dealer Profile</p>
						</div>
						<div className="headerItemRight p-t-17 newList">
						</div>
					</div>

					<div className="p-t-30 p-l-10 p-r-30">
						<p>Your mailings may show your dealership name,
							address and hours of operation on templates.
						</p>
						<div className="p-t-20 clear">
							<AccountTabs activeTab="0" />
								
							<div className="p-t-30">
								<div className="padding-20">
									<div className="col-md-6">
										<div className="container-xs-height">
											<div className="row-xs-height">
												<AccountInformation data={this.state.data} />
											</div>
										</div>
									</div>

									<div className="col-md-6">
										<AccountAddress
											data={this.state.data}
											canEdit={this.state.canEdit}
											handleDefaultAddressChange={this.handleDefaultAddressChange}
										/>
									</div>

									<br className="clear" /><br />
								</div>
							</div>
							<div className="padding-20 m-t-30 bg-white">
								<div className="panel-heading bold p-l-0">
									<div className="panel-title">CONTACT INFORMATION</div>
								</div>
								<div className="panel-body p-t-20">
									<AccountContactInfo
										data={this.state.data}
										canEdit={this.state.canEdit}
										handleDeleteContactClick={this.handleDeleteContactClick}
										handleWebsiteChange={this.handleWebsiteChange}
										handleDefaultPhoneChange={this.handleDefaultPhoneChange}
										handleHoursChange={this.handleHoursChange}
									/>
								</div>
								<br className="clear" /><br />
							</div>
						</div>
					</div>
				</div>
			);
		}	
	}
}
export default AccountProfile;