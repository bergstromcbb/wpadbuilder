import React from "react";
import TemplatesList from "./templatesList";
import RibbonPiece from "././campaigns/component/RibbonPiece";
import SubCategory from "../../views/templates/subCategory";
import StepsMenu from "././campaigns/component/stepsmenu";

function findSubcategory(categories, categoryId, subcategoryId) {
	const category = categories.filter(category => category.id == categoryId)[0];
	const subcategory = category.subcategories.filter(subcategory => subcategory.id == subcategoryId)[0];
	return subcategory;
}

class subCategorypage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: null,
		};
	}

	componentDidMount() {
		var categoryPull = $.getJSON("https://private-8e550-directmail.apiary-mock.com/v1/templates/categories");
		categoryPull.then(
			value => this.setState({ loading: false, data: value }),
			(jqXHR, textStatus, error) => this.setState({ loading: false, error: error }));
	}

	render() {
		if (this.state.loading) {
			return <span>Loading...</span>;
		} else if (this.state.error !== null) {
			return <span>Error: {this.state.error.message}</span>;
		} else {
			var categories = this.state.data.categories;
			var { categoryId, subcategoryId } = this.props.params;
			var subcategory = findSubcategory(categories, categoryId, subcategoryId);

			return (
				<div className="m-t-60">
					<div className="topHeaderContainer flex ribbon m-r-0">
						<RibbonPiece progressAmount="40%"/>
					</div>
					<div className="full-height">
						<div className="full-height flex hundred">
							<div className="col-sm-9">
								<span className="categorytitle title-main">
									<i className="pg-layouts teal m-t-20"></i>
									<span className="p-l-10 p-t-20">
										{subcategory.name}
									</span>
								</span>

								<p className="grey p-t-20 clear">
									Looking to start a new mailer but not sure where to start?
									Here is where you can choose your template and then go through
									the step by step creation and even choose who it will go to.
								</p>

								<TemplatesList promise={$.getJSON("https://private-8e550-directmail.apiary-mock.com/v1/templates/categories")} />
								
								<div>
									<SubCategory subcategoryId={this.props.params.subcategoryId} />
								</div>
							</div>
							<div className="col-sm-3 p-l-0">
								<StepsMenu />
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}

subCategorypage.propTypes = {
	params: React.PropTypes.object,
	promise: React.PropTypes.object,
};

export default subCategorypage;
