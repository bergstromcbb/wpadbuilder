import React from "react";
// import { hashHistory } from "react-router";
import { Loader } from "semantic-ui-react";
import PropTypes from "prop-types";

class Mapdropdown extends React.Component {
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
				{this.state.loading ? <Loader active inline='centered' /> : ""}
					
				
			</div>
		);
		
	}
}

Mapdropdown.propTypes = {
	perPage: PropTypes.func,
	onDeleteList: PropTypes.func,
};

export default Mapdropdown;
