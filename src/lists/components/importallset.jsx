import React from "react";
import { Loader } from "semantic-ui-react";
import PropTypes from "prop-types";
import RibbonPiece from "../../campaigns/component/RibbonPiece";
import ImportRibbon from "./importribbon";
import SearchField from "../../core/searchpiece";
import { Link, } from "react-router";


class ImportAllSet extends React.Component {
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
				{/* {this.state.loading ? <Loader active inline='centered' /> : ""} */}

				<div className="allsetcontainer vertCenterBox">
					<div className="heading allsetheader dark">
						<h2>Map Your Data</h2>
					</div>
					<div className="allsetcell nobrdr vertCenterDiv">
						<span className="vertCenterSpan">
							<span className="bold fs-22 subheading p-t-20">
								You're all set to import!
							</span>
							<br />
							<section className="text">
								Please review your selections below before importing your data.
							</section>
						</span>
					</div>
					<div className="allsetcell vertCenterDiv">
						<span className="vertCenterSpan">
							<span className=" subheading bold italic">
								Import Method
							</span>
							<br />
							<section className="text">
								File
						  </section>
						</span>
					</div>
					<div className="allsetcell vertCenterDiv">
						<span className="vertCenterSpan">
							<span className="subheading bold italic">
								Importing 6 of 13 columns
							</span>
							<br />
							<span class="divider">asdfasdfsaf </span>
							<section className="text">
								name, address, city, state, zip
							</section>
						</span>
						<span className="vertCenterSpan">
							<div className="center" id="proceed">
								<Link to="/importsuccess" className="ui button center btn-secondary "> Edit</Link>
							</div>
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

ImportAllSet.propTypes = {
	perPage: PropTypes.func,
	onDeleteList: PropTypes.func,
};

export default ImportAllSet;