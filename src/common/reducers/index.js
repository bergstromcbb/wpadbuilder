import { combineReducers } from "redux";
import EditorReducer from "../../editor/reducers/editorReducer.js";
import CampaignReducer from "../../campaigns/reducers/campaignReducer";

const allReducers = combineReducers({
	EditorReducer,
	CampaignReducer
});
export default allReducers;