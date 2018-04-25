import React from "react";
import {
	IndexLink,
	Link,
	hashHistory
} from "react-router";
import axios from "axios";
import Noty from "noty";
import { Dropdown, Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as CampaignActions from "../campaigns/actions/campaignActions";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: []
		};
	}

	componentDidMount() { 
		$.Pages.init();

		this.getRemoteData();
	}

	// Perform the remote ajax call
	getRemoteData = () => {
		this.setState({ loading: true });
		const accountid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		const userid = "1234a1234a1234a1234a1234a";	// TODO get from JWT token
		const url = `https://private-8e550-directmail.apiary-mock.com/v1/accounts/${accountid}/users/${userid}`;
		const accountUrl = `https://private-8e550-directmail.apiary-mock.com/v1/accounts/${accountid}`;
		
		Promise.all([axios.get(url), axios.get(accountUrl)])
			.then(([userResponse, accountResponse]) => {
				// determine if user avatar photo exists
				const avatar = (userResponse.data.profile_pic_string !== "") ?
					userResponse.data.profile_pic_string :
					"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADJUExURejs9MnP4Nrf6+bq883T48HI28rQ4b7F2eXp8r/G2svR4cLJ3NHX5dbb6N3i7dDW5cbM3uTo8cDH2tjd6s7U49TZ58fN3+Po8efr88/V5NHW5dPY5t7j7tTa58DH28PK3Nvg7Ofr9MTL3d3h7d/k7uDl7+Dk77/G2dfc6czS4sjO38fO39PZ59ne68HH287U5Nzh7dLY5sXM3uHl7+Ln8OLm8OHm8MjO4OPn8ebq8s3T4uTp8uTo8svR4tDV5MPJ3N7j7dXb6MjP4BvOJLoAAAMeSURBVHja7dyJkppAEIBhRKABDxC8XXW9dXXv+8r1/g8Vs6lKpZKIM610T6X6f4KvXBiaAdayJEmSJEmSJEmSJEmSJEmSJNZG8zQK41IA24JSHEbpfGSO7nXpJfBXibd8NYI3CWFn4YSdV21CZs0qK6+2gr2tany+KxcUcq+4fBVQrMLja4ByfaN/P6bfsApakZ/MfkkPWPKJgQ5o5tD6pqDdlBRY0AcWKH0zQDQjBHYwwA4h0MUAXTrfF0B1YuJF7vcaZMAQBwzJgDc44I3Z5wjlWQLIyIADnG9ABhzigEMy4CMO+GjurEU9cV3jgNdkwBQHTMmAJ6Zfi99wwDe6cSbB+BLCebCJATYJgXUMsE4I/IoBUu4uTDBAys3MHga4ofMtccvMkspXvMABL4pEQBs7sNpEwDIWWDZ72qKbt1ZY4Er+xIjdaY5rSRULpNqoLi5wvgXVOojZX6XdY7XNXqe3eRifRzjNFBETa71oUXareRwWbi3q1jq+M4s+29Dz41e+DtBnAFpjdd+Yw6czddVZgOfqwHMWoB+o+gKWQ9Cy3lWB7zw+9bGL7eWeM3NX6Z8pPnefsgHVtkB6FmOeWVPWP+aueJ8vLrICrdaeB4tuy2IuNeXRw67amT+h22YHZj9+D/l92a+ofDIAGGUBI9N/wY4BwJcs4IsBwG/GvFG2o8w3HT/z+3wDb+d0bo9tdqBj1Juh+ndOAfffuGf0uLqdtvbeega885bCJhzrUqj0xKTM5+sb/KnBj7qmPWH6Y4HR2En3GBabU62vDUqnxLw77fdswztCXq0bgHZBl+rrq1aE4H0QI4pFe+4geR9EZ57zTkfahANrpvnthZzUEzhCST2XFwlrjTEcrXHjyCdM2/bgyHn28XZFHiIXcsiNHo5zyShAbhUOvsD4/SHk2rDvH3TFSCD3EvQV5v4yAJKCy3sE78kBwpwn3WOvHABpQVnnWBxVBkDeoKL8jw9mMbAUK3672FgAUwuVD9uePWDMe957dsTAWrznXGmvgbl19gyxAfY2+P1cmkqZQDAgAQpQgAIUoAAFKMD/CfgdDUX2ZSQqPyMAAAAASUVORK5CYII=";
				// reassign user avatar photo if none defined
				userResponse.data.profile_pic_string = avatar;

				this.props.setUserInfo(userResponse.data);

				this.props.setAccountInfo(accountResponse.data);

				// update this.state to store the data
				this.setState({
					user: userResponse.data,
					userRole: userResponse.data.role,
					loading: false
				});

			})
			.catch((error) => {
				console.log("Error loading the page", error);
				this.setState({ loading: false, error: error });

				// Show error notification
				new Noty({
					text: "We could not retrieve your data at this time.",
					type: "error",
					closeWith: ["click", "button"]
				}).show();
			});
	}

	// redirect user to selected route
	onUserBlockLinkClick = (e,item) => {
		// send to user selected route if not the
		// same as existing route, else push complains
		if (this.props.location.pathname.replace("\/", "") != item.value)
			hashHistory.push(item.value);
	}

	render() {
		// user dropdown menu options ("value" should match the router route name)
		const userMenuItems = [
			{ key: "profile", text: "Profile", icon: "user circle", value: "AccountProfile" },
			{ key: "users", text: "Users", icon: "users", value: "Users" },
			{ key: "logout", text: "Logout", icon: "sign out", value: "logout" }
		];

		function UserBlock(props) {
			const output = <div>
				<div className="pull-left p-r-10 p-t-5 text-right">
					<div>
						<span className="fs-16 font-heading bold">{props.user.first_name}</span>
						<span className="p-l-5 fs-16 font-heading text-master">{props.user.last_name}</span>
					</div>
					<div className="m-t-m5">
						<span className="small">{props.user.org_name}</span>
					</div>
				</div>

				<div className="pull-right p-r-10">
					<span className="thumbnail-wrapper d32 circular inline m-t-10">
						<Image avatar src={props.user.profile_pic_string} />
					</span>
				</div>
			</div>;

			return (
				<Dropdown trigger={output}
					options={userMenuItems}
					onChange={(e,item) => props.onUserBlockLinkClick(e,item)}
				>
				</Dropdown>				
			);
		}

		return (
			<div className="full-height">
				<div className="page-sidebar" data-pages="sidebar">
					<div id="appMenu" className="sidebar-overlay-slide from-top"></div>
					<div className="sidebar-header ">
						<div className="sidebar-header-controls">
							<button className="ui button btn-xs sidebar-slide-toggle btn-link m-l-20" type="button"><i className="fa fa-angle-down fs-16"></i></button>
							<button data-toggle-pin="sidebar" className="ui button btn-link visible-lg-inline" type="button"><i className="fa fs-12"></i></button>
						</div>
					</div>
					<div className="sidebar-menu">
						<ul className="menu-items">
							<li className="m-t-10 navFont"><IndexLink to="/" activeClassName="active">Dashboard</IndexLink>
								<span className="icon-thumbnail"><i className="pg-charts"></i></span>
							</li>
							<li className="navFont"><Link to="/campaigns" activeClassName="active">Campaigns</Link>
								<span className="icon-thumbnail "><i className="fa fa-send"></i></span>
							</li>
							<li className="navFont">
								<a href="javascript:;">
									<span className="title">Templates</span>
									<span className=" arrow"></span>
								</a>
								<span className="icon-thumbnail"><i className="pg-layouts"></i></span>
								<ul className="sub-menu">
									<li className="navFont">
										<Link to="/templates">Templates</Link>
										<span className="icon-thumbnail"><i className="pg-layouts"></i></span>
									</li>
									<li className="navFont">
										<Link to="/assets">Asset Library</Link>
										<span className="icon-thumbnail"><i className="pg-image"></i></span>
									</li>
								</ul>
							</li>
							<li className="navFont"><Link to="/lists" activeClassName="active">Lists</Link>
								<span className="icon-thumbnail "><i className="pg-layouts4"></i></span>
							</li>
							<li className="navFont"><Link to="/lists" activeClassName="active">Reports</Link>
								<span className="icon-thumbnail "><i className="fa fa-archive"></i></span>
							</li>
						</ul>
						<div className="clearfix"></div>
					</div>
				</div>
				<div className="page-container">
					<div className="topbar">

						{/* small screen responsive */}
						{/*}
						<div className="container-fluid relative">
							<div className="pull-left full-height visible-sm visible-xs">
								<div className="header-inner">
								</div>
							</div>
							<div className="pull-left visible-sm visible-xs">
								<div className="header-inner">
									<div className="brand inline">
										<img src="images/logo.png" alt="logo" data-src="images/logo.png" data-src-retina="assets/img/logo_2x.png" />
									</div>
								</div>
							</div>
							<div id="userblock" className="pull-right">
								<div className="visible-lg visible-md m-t-10">
									<Dropdown trigger={userBlock}
										options={userMenuItems}
										onChange={this.userLinks}
									></Dropdown>
								</div>	
							</div>
						</div>
						*/}


						{/* large screen responsive */}
						<div className=" pull-left sm-table hidden-xs hidden-sm">
							<div className="header-inner">
								<div className="brand inline">
									<img src="images/logo.png" className="logo m-l-20" alt="logo" data-src="images/logo.png" data-src-retina="assets/img/logo_2x.png"  />
								</div>
							</div>
						</div>
						<div className="pull-right">
							<div className="header-inner">
							</div>
						</div>
						<div id="userblock" className="pull-right">
							<div className="visible-lg visible-md m-t-10">
								<UserBlock user={this.state.user}
									onUserBlockLinkClick={this.onUserBlockLinkClick}
								/>
							</div>	
						</div>
					</div>

					{this.props.children}
				</div>
			</div>
		);
	}
}

App.propTypes = {
	setUserInfo: PropTypes.func,
	setAccountInfo: PropTypes.func,
	children: PropTypes.element.isRequired,
	onUserBlockLinkClick: PropTypes.func
};

function mapStateToProps(state) {
	return {
		userInfo: state.userInfo,
	};
}

const mapDispatchToProps = {
	setUserInfo: CampaignActions.setUserInfo,
	setAccountInfo: CampaignActions.setAccountInfo,

};

export default connect(mapStateToProps, mapDispatchToProps)(App);
