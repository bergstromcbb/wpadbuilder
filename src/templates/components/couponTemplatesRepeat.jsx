import React from "react";
import PropTypes from "prop-types";

class CouponTemplatesRepeat extends React.Component{
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleTemplateClick = (obj) => {
		// callback function from editorMenu.js
		this.props.chooseTemplateClick(obj);
	}

	handleFolderClick = (obj) => {
		// callback function from editorMenu.js
		this.props.chooseFolderClick(obj);
	}

	// coupon templates
	renderItem = (item) => {
		const itemRows = [
			<div className="col-xs-12 col-sm-3 coupon-gallery-image" key={item.id}>
				<div className={(this.props.templateId == item.id) ? "border active" : "border"}>	
					<div className="bg-white center">	
						<a title={item.template_name} onClick={() => this.handleTemplateClick(item)}>
							<img src={item.thumbnail} className="img-responsive" />
						</a>
					</div>	
					<div className="bg-white" style={{ padding: "5px" }}>
						<div className="all-caps font-montserrat fs-12 no-padding truncate-overflow-text">
							{item.template_number} {item.template_name}
						</div>
					</div>
				</div>	
			</div>
		];
		return itemRows;
	}

	// folders
	renderFolderItem = (item) => {
		const itemRows = [
			<div className="col-xs-12 col-sm-5 col-md-4 folder-image" key={item.id}>
				<div className={(this.props.folderId == item.id) ? "border active" : "border"}>	
					<div className="bg-white center" style={{ padding: "10px" }}>
						<a title={item.name} onClick={() => this.handleFolderClick(item)}>
							<img src={`../../assets/img/templates/folders/${item.image}`} />
						</a>
					</div>	
					<div className="bg-white" style={{ padding: "5px" }}>
						<div className="all-caps font-montserrat fs-12 no-padding truncate-overflow-text">
							{item.name}
						</div>
					</div>
				</div>	
			</div>
		];
		return itemRows;
	}	

	render() {
		// get templates
		let allTemplateItemRows = [];
		const templates = this.props.data;
		templates.forEach(item => {
			const perItemRows = this.renderItem(item);
			allTemplateItemRows = allTemplateItemRows.concat(perItemRows);
		});

		// get folders
		let allFolderItemRows = [],
			folders = [];
		if (this.props.folderId === undefined) {
			folders = this.props.folderdata.filter((item) => {
				if (item.parent_id === "") return item;
			});
		} else {
			folders = this.props.folderdata.filter((item) => {
				if (item.parent_id === this.props.folderId) return item;
			});
		}
		folders.forEach(item => {
			const perFolderItemRows = this.renderFolderItem(item);
			allFolderItemRows = allFolderItemRows.concat(perFolderItemRows);
		});

		return (
			<div>
				<div className="alltemplates p-t-20">
					<div className={this.props.data.length > 0 ? "show" : "hide"}>
						{allTemplateItemRows}
					</div>

					<div className={this.props.data.length == 0 ? "show center clear" : "hide center clear"}>
						<h3>Your coupon templates will be here</h3>
						<p>Once you have created your coupon templates, you can use them in your campaigns</p>
						<p className="p-t-20">
							<img src="../../../assets/img/blank_state.png" />
						</p>	
					</div>					
				</div>				
			</div>
		);
	}
}

CouponTemplatesRepeat.propTypes = {
	folderId: PropTypes.string,
	data: PropTypes.array,
	folderdata: PropTypes.array,
	chooseTemplateClick: PropTypes.func,
	chooseFolderClick: PropTypes.func
};
export default CouponTemplatesRepeat;