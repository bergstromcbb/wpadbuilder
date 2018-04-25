import React from "react";
import { hashHistory } from "react-router";
import { Tab } from "semantic-ui-react";
import PropTypes from "prop-types";

class AccountTabs extends React.Component{
	constructor(props){
		super(props);
		this.state={};
	}

	// redirect user to selected route
	onTabClick = (e, data) => {
		// get new route value from data.pane obj activeIndex value
		const route = data.panes.filter(pane => pane.index == data.activeIndex);
		
		// send to user selected route
		hashHistory.push(route[0].value);
	}
	
	renderTabs = (tabs) => (
		<Tab menu={{ secondary: true, pointing: true }}
			panes={tabs}
			defaultActiveIndex={this.props.activeTab}
			onTabChange={(e,data) => this.onTabClick(e,data)}
		/>
	)
    
	render() {
		const tabs = [
			{ menuItem: "Profile", value: "AccountProfile", index: 0 },
			{ menuItem: "Users", value: "Users", index: 1 }
		];

		return (
			<div>
				{this.renderTabs(tabs)}
			</div>
		);
	}
}

AccountTabs.propTypes = {
	activeTab: PropTypes.string
};

export default AccountTabs;