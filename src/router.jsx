import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
  Redirect,
  Router,
  Route,
  IndexRoute,
  hashHistory
} from "react-router-dom";
import Home from "./home";
import App from "./core/app";
import Templates from "./templates/templates";
import ImportTemplate from "./templates/components/importTemplate";
import Editor from "./editor/editor";
import Members from "./members/members";
import Lists from "./lists/lists";
import DataMap from "./lists/components/datamap";
import ImportList from "./lists/components/importlist";
import ColumnModal from "./lists/components/addnewcolumn";
import ImportFile from "./lists/components/importfile";
import ImportAllSet from "./lists/components/importallset";
import ListNaming from "./lists/components/listnaming";
import ImportSuccess from "./lists/components/importsuccess";
import Mapdropdown from "./lists/components/mapdropdown";
import MappingDropDown from "./lists/components/mappingdropdown";
import Assets from "./assetLibrary/assets";
import Campaigns from "./campaigns/campaigns";
import NewCampaign from "./campaigns/newcampaign";
import Recipients from "./campaigns/recipients";
import Delivery from "./campaigns/delivery";
import Summary from "./campaigns/summary";
import AccountProfile from "./account/accountProfile";
import UserProfile from "./account/userProfile";
import Settings from "./account/settings";
import Users from "./users/users";
import Register from "./users/components/register";
import Invite from "./users/components/invite";
import SignInForm from "./users/components/registrationform";
import ApiKey from "./account/apikey";
import Login from "./login";
import ImportAsset from "./assetLibrary/importAsset";
import Page404 from "./core/Page404";
import SearchField from "./core/searchpiece";
import store from "./common/store/index.js";

var destination = document.querySelector("#container");

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="lists" component={Lists} />
        <Route path="mapdropdown" component={Mapdropdown} />
        <Route path="datamap" component={DataMap} />
        <Route path="importallset" component={ImportAllSet} />
        <Route path="importsuccess" component={ImportSuccess} />
        <Route path="addnewcolumn" component={ColumnModal} />
        <Route path="mappingdropdown" component={MappingDropDown} />
        <Route path="campaigns" component={Campaigns} />
        <Route path="templates(/:folderid)" component={Templates} />
        <Route path="editor/:templateid" component={Editor} />
        <Route path="members/:listid" component={Members} />
        <Route path="assets(/:folderid)" component={Assets} />
        <Route path="importlist" component={ImportList} />
        <Route path="listnaming" component={ListNaming} />
        <Route path="importfile" component={ImportFile} />
        <Route path="newcampaign" component={NewCampaign} />
        <Route path="recipients" component={Recipients} />
        <Route path="delivery" component={Delivery} />
        <Route path="summary" component={Summary} />
        <Route path="accountprofile" component={AccountProfile} />
        <Route path="userprofile" component={UserProfile} />
        <Route path="users" component={Users} />
        <Route path="apikey" component={ApiKey} />
        <Route path="login" component={Login} />
        <Route path="importTemplate" component={ImportTemplate} />
        <Route path="importAsset" component={ImportAsset} />
        <Route path="register" component={Register} />
        <Route path="invite" component={Invite} />
        <Route path="registrationform" component={SignInForm} />
        <Route path="settings" component={Settings} />
        <Route path="*" component={Page404} />
      </Route>
    </Router>
  </Provider>,
  destination
);
