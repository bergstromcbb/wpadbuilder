function dateChange (iso8601String) {
	var converted_date = new Date(iso8601String);

	var word2 = converted_date.toDateString().substring(4);


	var formatted_date = word2.substring(0, word2.length-5) + "," + word2.substring(word2.length-5);
	return formatted_date;
}

export default dateChange;
