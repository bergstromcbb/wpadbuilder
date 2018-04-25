const defaultState = {
	campaignName: "--",
	templateName: "--",
	templateId:"",
	recipientsNum: "--",
	userInfo: {},
	accountInfo: {},
	deliveryDate: null,
};

export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case "setCampaignName":
		return Object.assign({}, state, { campaignName: action.campaignName });
	case "setTemplateId":
		return Object.assign({}, state, {templateId: action.templateId});		
	case "setTemplateName":
		return Object.assign({}, state, {templateName: action.templateName});
	case "setRecipientsNum":
		return Object.assign({}, state, {recipientsNum: action.recipientsNum});
	case "setUserInfo":
		return Object.assign({}, state, {userInfo: action.userInfo});
	case "setAccountInfo":
		return Object.assign({}, state, {accountInfo: action.accountInfo});
	case "setDeliveryDate":
		return Object.assign({}, state, {deliveryDate: action.deliveryDate});
	default:
		return state;
	}
} 
