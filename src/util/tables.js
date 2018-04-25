
// Initialize a basic dataTable with row selection option
var initBasicTable = function() {

	var table = $("#basicTable");

	var settings = {
		"sDom": "t",
		"destroy": true,
		"paging": false,
		"scrollCollapse": true,
		"aoColumnDefs": [{
			"bSortable": false,
			"aTargets": [0]
		}],
		"order": [
			[1, "desc"]
		]

	};

	table.dataTable(settings);

	$("#basicTable input[type=checkbox]").click(function() {
		if ($(this).is(":checked")) {
			$(this).closest("tr").addClass("selected");
		} else {
			$(this).closest("tr").removeClass("selected");
		}

	});

};

// Initialize a dataTable having bootstrap's stripes style
var initStripedTable = function() {

	var table = $("#stripedTable");

	var settings = {
		"sDom": "t",
		"destroy": true,
		"paging": false,
		"scrollCollapse": true

	};
	table.dataTable(settings);

};

// Initialize a dataTable with collapsible rows to show more details
export var initDetailedViewTable = function() {

	var _format = function(d) {
		console.log(d);
		// `d` is the original data object for the row
		return "<div class=\"drawer p-b-20\">" +
    "<div class=\"col-sm-3\">" +
    "  <address class=\"margin-bottom-20 margin-top-10\">" +
    "  <strong>Revox, Inc.</strong>" +
    "  <br>Joseph Smith" +
    "  <br>795 Folsom Ave, Suite 600" +
    "  <br>San Francisco, CA 94107" +
    "  <br><br>(123) 456-7890" +
    "  <br>jsmith@smither.com" +
    "  </address>" +
    "</div>" +
    "<div class=\"col-sm-3\">" +
    "  <div>Response rate all campaigns" +
    "    <div class=\"progress\">" +
    "        <div class=\"progress-bar progress-bar-warning\" style=\"width:65%\"></div>" +
    "    </div>" +
    "    <div class=\"small hint-text\"><a href=\"#\" class=\"text-muted small\">View all campaigns sent to this user</a></div>" +
    "  </div>" +
    "  <div class=\"p-t-20\">"  +
    "    <div class=\"checkbox check-danger\">" +
    "      <input type=\"checkbox\" value=\"1\" id=\"checkbox6\">" +
    "      <label for=\"checkbox6\">Mark Do Not Contact</label>" +
    "    </div>" +
    "  </div>" +
    "</div>" +
    "<div class=\"col-sm-3 pull-right text-right\">" +
    "  <div class=\"btn-group dropdown-default\">" +
    "    <a class=\"btn dropdown-toggle\" id=\"pop_down_menu\" data-toggle=\"dropdown\" href=\"javascript:void(0);\" aria-expanded=\"false\"> Action <span class=\"caret\"></span> </a>" +
    "    <ul class=\"dropdown-menu\">" +
    "    <li><a href=\"javascript:void(0);\" data-toggle=\"modal\" data-target=\"#addMemberModal\">Edit</a></li>" +
    "    <li><a href=\"javascript:void(0);\" data-toggle=\"modal\" data-target=\"#confirmModal\">Make inactive</a></li>" +
    "    </ul>" +
    "  </div>" +
    "</div>" +
    "</div>";
	};


	var table = $("#detailedTable");

	table.DataTable({
		"sDom": "t",
		"scrollCollapse": true,
		"paging": false,
		"bSort": false
	});

	// Add event listener for opening and closing details
	$("#detailedTable tbody tr td").on("click", function() {
		console.log("hello");
		var _this = $(this).closest("tr");
		if ($(_this).hasClass("shown") && $(_this).next().hasClass("row-details")) {
			$(_this).removeClass("shown");
			$(_this).next().remove();
			return;
		}
		var row = table.DataTable().row(_this);
		$(_this).parents("tbody").find(".shown").removeClass("shown");
		$(_this).parents("tbody").find(".row-details").remove();

		row.child(_format(row.data())).show();
		_this.addClass("shown");
		_this.next().addClass("row-details");
	});
};

// Initialize a condensed table which will truncate the content
// if they exceed the cell width
var initCondensedTable = function() {
	var table = $("#condensedTable");


	var settings = {
		"sDom": "t",
		"destroy": true,
		"paging": false,
		"scrollCollapse": true
	};

	table.dataTable(settings);
};
