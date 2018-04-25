import React from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";
import { Dropdown } from "semantic-ui-react";

class TemplatesList extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: null,
			data: null
		}; 
	}

	componentDidMount() {
		this.props.promise.then(
			value => this.setState({loading: false, data: value}),
			(jqXHR, textStatus, error) => this.setState({loading: false, error: error}));
	}

	render() {
		if (this.state.loading) {
			return <span>Loading...</span>;
		}
		else if (this.state.error !== null) {
			return <span>Error: {this.state.error.message}</span>;
		}
		else {
			var Categories = this.state.data.categories;
			var categoryList = Categories.map(function (category, index) {
				return (
					<div className="p-r-20" key={index}>
						<Dropdown text={category.name} scrolling>
							<Dropdown.Menu>
								{category.subcategories.map(option =>
									<Dropdown.Item key={option.id}>
										<Link to={"category/" + category.id + "/subcategory/" + option.id} activeClassName="active">{option.name}</Link>	
									</Dropdown.Item>
								)}
							</Dropdown.Menu>
						</Dropdown>
					</div>
				);
			});
			return (
				<div>
					<main>
						<div className="overallcontainer">
							<div className="flex hundred">
								{categoryList}
							</div>
						</div>
					</main>
				</div>
			);
		}
	}
}

TemplatesList.propTypes = {
	promise: PropTypes.object
};
export default TemplatesList;