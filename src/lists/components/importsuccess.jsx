import React from "react";
import { Loader } from "semantic-ui-react";
import PropTypes from "prop-types";
import RibbonPiece from "../../campaigns/component/RibbonPiece";
import ImportRibbon from "./importribbon";
import SearchField from "../../core/searchpiece";
import { Link, } from "react-router";


class ImportSuccess extends React.Component {
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


	render() {

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

				<div className="vertCenterBox">
					<div className="vertCenterDiv">
						<span className="vertCenterSpan">
							<div>
								<img src="/images/clipboard-with-check-marks.png" alt="inbox-out" className="icon largeIcon" />
							</div>
							<h1>Success</h1>
							<p>
								Your List has been Uploaded!
							</p>
						</span>
					</div>
					<div className="center" id="proceed">
						<Link to="/importsuccess" className="ui button center btn-primary "> Proceed</Link>
					</div>
				</div>
			</div>
		);
	}
}

ImportSuccess.propTypes = {
	perPage: PropTypes.func,
	onDeleteList: PropTypes.func,
};

export default ImportSuccess;
