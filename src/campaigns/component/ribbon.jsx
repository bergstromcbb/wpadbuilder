import React from "react";
import { Link } from "react-router";

export default class campaignsRibbon extends React.Component{

	render() {
		return (

			<div className="flex hundred">
				<div className="headerItemLeft col-sm-9">
					<ul className="inline_list">
						<li className="ribbonNav"><a className="" href="index.html">Home</a></li>
						<li className="ribbonNav"><Link to="/campaigns" activeClassName="active">&#62; Campaigns</Link></li>
					</ul>
					<p className="panel-title teal all-caps p-l-10 threeHundred">Campaigns</p>
				</div>
				<div className="headerItemRight border-left p-t-17 newList col-sm-3">
					<div className="center">	
						<Link to="/newcampaign" className="ui button btn-primary"><i className="fa fa-plus"></i> NEW CAMPAIGN</Link>
					</div>	
				</div>
			</div>
		);
	}
}