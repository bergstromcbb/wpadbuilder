import * as React from "react";
import { hashHistory } from "react-router";
import { connect } from "react-redux";
import * as campaignActions from "../campaigns/actions/campaignActions";
import axios from "axios";
import Noty from "noty";
import { Dropdown, Loader } from "semantic-ui-react";
import Ribbon from "../campaigns/component/RibbonPiece";
import StepsMenu from "../campaigns/component/stepsmenu";
import TemplatesRepeat from "./components/templatesRepeat";
import Paginate from "react-paginate";
import ReactPlaceholder from "react-placeholder";
import PropTypes from "prop-types";
import { Link } from "react-router";

type Props = {
	params: Object,
	perPage: number,
	text?: string,
	setTemplateName: Function,
	setTemplateId: Function,
};

type State = {
	loading: boolean,
	error: Object,
	data: [],
	folderdata: [],
	templateId: string,
	templateTypeName: string,
	templateTypeValue: string,
	folderId: string,
	folderName: string,
	datafolder: [],
	searchString: string,
	offset?: number,
	pageCount: number,
};

class Templates extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: {},
			data: [],
			folderdata: [],
			templateId: "",
			// template types
			templateTypeName: "Direct Mail",
			templateTypeValue: "directmail",
			// folder
			folderId: "",
			folderName: "All",
			datafolder: [],
			// search
			searchString: "",
			// pagination
			offset: 0,
			pageCount: 0
		};
	}

	static defaultProps = {
		perPage: 0,
		text: "",
	};

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

		// Append optional search to the request url if exists
		const searchquery = (this.state.searchString == "") ? ""
			: `?q=${encodeURIComponent(this.state.searchString)}`;

		let url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/types/${this.state.templateTypeValue}${searchquery}`;

		// If folder is known get templates from that folder instead of all folders
		if (this.state.folderId != undefined) {
			url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/types/${this.state.templateTypeValue}/folders/${this.state.folderId}${searchquery}`;
		}

		// If template id is known get that template
		if (this.state.templateId != "") {
			url = `https://private-8e550-directmail.apiary-mock.com/v1/templates/${this.state.templateId}`;
		}

		axios.get(url, {
			limit: 12,
			offset: this.state.offset
		}
		).then(response => {
			// update this.state.data to store these records
			this.setState({
				data: response.data.templates,
				pageCount: Math.ceil(response.data.paging.total / 12),
				loading: false
			});

			// get folder data for dropdown
			this.getRemoteFolderData();

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
			// prepend folders data to template data
			//const combinedData = { ...this.state.data, ...response.data.folders };
			//console.log("inside getRemoteFolderData",combinedData);
			//this.setState({ data: combinedData });
			//console.log("inside getRemoteFolderData",this.state.data);
			this.setState({ folderdata: response.data.folders });

			// Convert into smaller array with only elements the dropdown needs ('label and 'value' only)
			/* [
					{ key: 1, text: 'Choice 1', value: 1 },
					{ key: 2, text: 'Choice 2', value: 2, disabled: true },
					{ key: 3, text: 'Choice 3', value: 3 }
				]
			*/
			var resultArr = [],
				i = 0;

			for (var k in response.data.folders) {
				var row = { key: `${i}`, text: `${response.data.folders[k].name}`, value: `${response.data.folders[k].id}` };
				resultArr.push(row);
				i++;
			}

			this.setState({
				datafolder: resultArr
			});
		}).catch(error => {
			console.log("Error loading the page", error);
			this.setState({ error: error });

			// Show error notification
			new Noty({
				text: "We could not get your template folders at this time.",
				type: "error",
				closeWith: ["click", "button"]
			}).show();
		});
	}

	// show templates in user selected folder
	onInlineFolderChange = (e, item) => {
		const folderid = item.value;
		const foldername = (item.text === null) ? "All" : item.text;
		this.setState({
			loading: true,
			folderName: foldername
		});

		// redirect to the selected folder if different
		if (folderid != this.state.folderId)
			hashHistory.push((folderid === null) ? "/templates" : "/templates/" + folderid);
	}

	// callback function in templatesRepeat.jsx
	onFolderChange = (item) => {
		const folderid = item.id;
		const foldername = (item.name === null) ? "All" : item.name;
		this.setState({
			loading: true,
			folderId: folderid,
			folderName: foldername
		});

		// redirect to the selected folder if different
		if (folderid != this.state.folderId)
			hashHistory.push("/templates/" + folderid);
	}

	// show template type dropdown change (directmail/email)
	onTemplateTypeChange = (e, item) => {
		console.log("onTemplateTypeChange. item", item);
		const typeid = item.value;
		const typename = (item.text === null) ? "Direct Mail" : item.text;

		this.setState({
			loading: true,
			templateTypeName: typename,
			templateTypeValue: typeid
		}, function () {
			// Get templates of the user selected type
			this.getRemoteData();
		});
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
		console.log("onSearchChange. e", e);
		console.log("onSearchChange. this", this);
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

	// Template clicked in templatesRepeat component
	onUseTemplateClick = (obj) => {
		// dispatch redux action
		this.props.setTemplateName(obj.template_name);
		this.props.setTemplateId(obj.id);

		// redirect to editor page
		hashHistory.push("/editor/" + obj.id);
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
					<span className="text-muted">
						<a onClick={this.onSearchClear}>clear</a>
					</span>
				</h6>
			</div>;
		}

		if (this.state.loading) {
			return <section><Loader active inline='centered' /></section>;
		}
		//else if (this.state.error !== null) {
		if (Object.keys(this.state.error).length) {
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

					<div className="topHeaderContainer flex ribbon m-r-0">
						<Ribbon progressAmount="40%" />
					</div>

					<div className="full-height p-r-50xx">
						<div className="col-xs-12 col-sm-9 full-height">
							<div className="p-t-30">
								<span className="categorytitle title-main">
									<i className="pg-layouts teal m-t-20"></i>
									<span className="p-l-10 p-t-20">
										Templates
									</span>
									<span className="pull-right">
										<Link to="/listnaming">
											bypass editor
										</Link>
									</span>
								</span>

								<p className="grey p-t-20 clear">
									Looking to start a new mailer but not sure where to start?
									Here is where you can choose your template and then go through
									the step by step creation and even choose who it will go to.
								</p>
							</div>

							<div className="container-fixed-lg bg-white555">
								<div className="panel panel-transparent">
									<div className="panel-heading">
										<div className="row v-align-middle">

											<div className="row col-xs-12 col-sm-2 float-left">
												<Dropdown text={this.state.templateTypeName} className="float-left p-t-10">
													<Dropdown.Menu>
														<Dropdown.Menu scrolling>
															{templateTypes.map(option =>
																<Dropdown.Item key={option.value} {...option}
																	onClick={this.onTemplateTypeChange}>
																</Dropdown.Item>
															)}
														</Dropdown.Menu>
													</Dropdown.Menu>
												</Dropdown>
											</div>

											<div className="row col-xs-12 col-sm-6">
												<Dropdown text={this.state.folderName} className="float-left p-t-10">
													<Dropdown.Menu>
														<Dropdown.Menu scrolling>
															<Dropdown.Item onClick={this.onInlineFolderChange} scrolling text="All folders" value="" />
															{this.state.datafolder.map(option =>
																<Dropdown.Item key={option.value} {...option}
																	onClick={this.onInlineFolderChange}
																	defaultValue={this.state.folderId}>
																</Dropdown.Item>
															)}
														</Dropdown.Menu>
													</Dropdown.Menu>
												</Dropdown>
											</div>

											<div className="col-xs-4 text-right">
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

										<div className="panel-body clear">

											{searchResultsHeading} {/* visible if showing search results */}

											<div id="detailedTable_wrapper" className="form-inline no-footer p-t-30 ">
												<div className="row col-sm-12x memberRow">
													<ReactPlaceholder
														rows={7}
														ready={!this.state.loading}
														color={"#ececec"}
														className={"p-t-30 p-b-30 clear"} >
														<TemplatesRepeat
															data={this.state.data}
															folderdata={this.state.folderdata}
															folderId={this.state.folderId}
															templateId={this.state.templateId}
															chooseTemplateClick={this.onUseTemplateClick}
															chooseFolderClick={this.onFolderChange} />
													</ReactPlaceholder>
												</div>
											</div>
										</div>

									</div>
								</div>

								<div className="p-t-80">
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
						<div className="col-xs-12 col-sm-3 p-l-0">
							<StepsMenu StepOne=" completed" StepTwo=" active" StepThree="" StepFour="" StepFive="" StepSix="" />
						</div>
					</div>
				</div>
			);
		}
	}
}

const templateTypes = [
	{ key: 1, text: "Direct Mail", value: "directmail" },
	{ key: 2, text: "Email", value: "emails" },
	{ key: 3, text: "Coupons", value: "coupons" },
	{ key: 4, text: "Facebook Ad", value: "facebookads" },
];

const mapDispatchToProps = {
	setTemplateName: campaignActions.setTemplateName,
	setTemplateId: campaignActions.setTemplateId
};
export default connect(null, mapDispatchToProps)(Templates);