import React from "react";
import { Link } from "react-router";
// import { Button, Modal, Icon } from "semantic-ui-react";

export default class ImportRibbon extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="flex hundred row">
				<div className="col-sm-12">
					<ul className="inline_list">
						<li className="ribbonBreadcrumbs"><a className="" href="index.html">Home</a></li>
						<li className="ribbonNav"><Link to="/lists" activeClassName="active">&#62; Lists</Link></li>
					</ul>
					<div>
						<i className="icon fa-upload"></i>
						<span className="ribbonTitle">Import List</span>
					</div>
				</div>
			</div>	
		);
	}
}

