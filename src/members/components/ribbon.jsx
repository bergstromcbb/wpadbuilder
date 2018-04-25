import React from "react";
import {
	Link
} from "react-router";
import PropTypes from "prop-types";

export default class MembersRibbon extends React.Component{
    
	// passing as prop
	render() {
		return (

			<div className="flex hundred row">
				<div className="headerItemLeft col-sm-9">
					<ul className="inline_list">
						<li className="ribbonNav"><a className="" href="index.html">Home</a></li>
						<li className="ribbonNav"><Link to="/lists" activeClassName="active">&#62; Lists</Link></li>
						<li className="ribbonNav"> &#62; Members</li>
					</ul>
					<h5 className="panel-title teal p-l-10 all-caps">List Members</h5>
				</div>
				<div className="headerItemRight border-left p-t-17 col-sm-3 newList">
					<a onClick={ this.props.onMemberClick } className="ui button btn-primary"><i className="fa fa-plus"></i> NEW MEMBER</a>
				</div>
			</div>
		);
	}
}

MembersRibbon.propTypes = {
	onMemberClick: PropTypes.func
};