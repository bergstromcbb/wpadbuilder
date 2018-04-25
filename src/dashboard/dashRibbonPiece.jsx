import React from "react";
import {
	Link,
} from "react-router";

export default class DashRibbonPiece extends React.Component {

	render() {
		return (
			<div className="flex hundred row dashribbon">
				<div className="messagesSent ribbonNav col-sm-4 m-t-5 m-l-15">
					<span className="semi-bold ribbonSections teal">Message Sent</span>
					<section className="semi-bold dashNumbers">34,688</section>
				</div>
				<div className="received ribbonNav border-left col-sm-2 m-t-5">
					<span className="ribbonSections semi-bold">Received</span>
					<section className="semi-bold dashNumbers">26,890</section>
				</div>
				<div className="roi ribbonNav border-left col-sm-2 m-t-5">
					<span className="ribbonSections semi-bold">ROI</span>
					<section className="semi-bold dashNumbers">$424,122 / 24%</section>
				</div>
				<div className="headerItemRight ribbonNav border-left col-sm-4 m-t-10">
					<div className="center">
						<Link to="/newcampaign" className="ui button btn-primary inline"><i className="fa fa-plus"></i> New Campaign</Link>
					</div>
				</div>
			</div>
		);
	}

}