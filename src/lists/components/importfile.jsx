import React from "react";
// import { hashHistory } from "react-router";
// import { dropdown } from "semantic-ui-react";
import ImportRibbon from "./importribbon";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { Link, } from "react-router";
import RibbonPiece from "../../campaigns/component/RibbonPiece";
import SearchField from "../../core/searchpiece";


class ImportFile extends React.Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			files: []
		};
	}

	onDrop(files) {
		this.setState({
			files
		});
	}



	render() {

		onDrop: acceptedFiles => {
			acceptedFiles.forEach(file => {
				const reader = new FileReader();
				reader.onload = () => {
					const fileAsBinaryString = reader.result;
					// do whatever you want with the file content
				};
				reader.onabort = () => console.log('file reading was aborted');
				reader.onerror = () => console.log('file reading has failed');

				reader.readAsBinaryString(file);
			});
		}

		return (
			<div className="m-t-60 m-l-20">

				<div className="topHeaderContainer ribbon row p-0">
					<RibbonPiece />
					<ImportRibbon
						onCreateList={this.onCreateList}
					/>
				</div>
				<div className="row">
					<div className="col-sm-12">
						<SearchField />
					</div>
				</div>
				<div className="dropzonemargin">
					<Dropzone className="vertCenterBox dashgreyborder" onDrop={this.onDrop.bind(this)}>
						<div className="vertCenterDiv">
							<span className="vertCenterSpan white">
								<div>
									<Link to="/datamap" className="">
										<img src="/images/inbox.png" alt="inbox-out" className="icon largeIcon" />
									</Link>
								</div>
								<h2>Upload List</h2>
								<p>
									Drag and Drop your file in this box
									<br />
									or <span className="teal bold">CLICK HERE</span> to upload manually.
								</p>
							</span>
						</div>
					</Dropzone>
					<div className="center" id="proceed">
						<Link to="/datamap" className="ui button center btn-primary "> Upload</Link>
					</div>
				</div>
				<aside>
					{/* {this.state.loading ? <Loader active inline='centered' /> : ""} */}
					<ul>
						{
							this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
						}
					</ul>
				</aside>
			</div>
		);
	}
}


ImportFile.propTypes = {
	perPage: PropTypes.func,
	onDeleteList: PropTypes.func,
};

export default ImportFile;
