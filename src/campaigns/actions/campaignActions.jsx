export function setCampaignName(campaignName) {
	return {type: "setCampaignName", campaignName};
}

export function setTemplateId(templateId) {
	return { type: "setTemplateId", templateId };
}

export function setTemplateName(templateName) {
	return { type: "setTemplateName", templateName };
}

export function setRecipientsNum(recipientsNum) {
	return { type: "setRecipientsNum", recipientsNum };
}

export function setUserInfo(userInfo) {
	return { type: "setUserInfo", userInfo };
}

export function setAccountInfo(accountInfo) {
	return { type: "setAccountInfo", accountInfo };
}

export function setDeliveryDate(deliveryDate) {
	return { type: "setDeliveryDate", deliveryDate };
}