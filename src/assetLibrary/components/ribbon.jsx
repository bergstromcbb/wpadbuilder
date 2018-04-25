import React from "react";
import { Link } from "react-router";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";

export class AssetsRibbon extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {

		const handleFileUploadDropRejected = (...args) => console.log("reject", args);

		return (

			<div className="flex hundred row">
				<div className="headerItemLeft col-sm-8  ">
					<ul className="inline_list">
						<li className="ribbonNav"><a className="" href="index.html">Home</a></li>
						<li className="ribbonNav"><Link to="/assets" activeClassName="active">Assets</Link></li>
					</ul>
					<h5 className="panel-title teal p-l-10 all-caps">Assets</h5>
				</div>
				<div className="headerItemRight border-left p-t-17 col-sm-4 newList">
					<Dropzone className="nodropzone"
						onDrop={(files) => this.props.handleFileUploadDrop(files)}
						accept="image/jpeg,image/jpg,image/gif,image/png"
						disablePreview={true}
						multiple={false}
						maxSize={100000}
						minSize={0}
						onDropRejected={handleFileUploadDropRejected}
					>
						<span className="ui button btn-primary"><i className="fa fa-plus"></i> NEW IMAGE</span>
					</Dropzone>
				</div>
			</div>
		);
	}
}

AssetsRibbon.propTypes = {
	handleFileUploadDrop: PropTypes.func	
};