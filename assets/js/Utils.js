/*
Utility functions

*/

// format string to phone number
export function formatPhoneNumber(val) {
	var str = val.toString();
	var matched = str.match(/\d+\.?\d*/g);

	// 10 digit
	if (matched.length === 3) {
		return "(" + matched[0] + ") " + matched[1] + "-" + matched[2];
		// 7 digit
	} else if (matched.length === 2) {
		return matched[0] + "-" + matched[1];
	}
	// no formatting attempted only found integers (i.e. 1234567890)
	else if (matched.length === 1) {
		// 10 digit
		if (matched[0].length === 10) {
			return "(" + matched[0].substr(0, 3) + ") " + matched[0].substr(3, 3) + "-" + matched[0].substr(6);
		}
		// 7 digit
		if (matched[0].length === 7) {
			return matched[0].substr(0, 3) + "-" + matched[0].substr(3);
		}
	}
	// Format failed, return number back
	return val;
}

// object helper to get properties of the passed in ID
export function getAllPropertiesById(obj, id) {
	console.log("getAllPropertiesById. id",id);
	// pull out the object matching the id and return it
	var newObj = obj.filter((option) => {
		if (option.id == id) {
			return obj;
		}
	});
	console.log("getAllPropertiesById. newObj",newObj);
	return newObj;
}

// object helper to get all properties except the passed in ID
export function getAllPropertiesExceptId(obj, id) {
	console.log("getAllPropertiesExceptId. id",id);
	// remove the object matching the id and return all others
	var newObj = obj.filter((option) => {
		if (option.id != id) {
			return obj;
		}
	});
	console.log("getAllPropertiesExceptId. newObj",newObj);
	return newObj;
}

// return a new obj with the property (key) removed
export function removeObjProperty(obj, key) {
	return Object.assign(
		{},
		...Object.entries(obj)
			.filter(([k]) => k!== key)
			.map(([k, v]) => ({ [k]: v }))
	);
}

// return a new obj with the property (key) removed
export function removeObjByProperty(obj, key) {
	return Object.keys(obj)
		.filter(p => p !== key)
		.reduce((result, current) => {
			result[current] = obj[current];
			return result;
		}, {}
		);
}