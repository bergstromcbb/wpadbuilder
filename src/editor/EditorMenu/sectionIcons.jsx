import React from "react";
import PropTypes from "prop-types";
import { Popup } from "semantic-ui-react";

class SectionIcons extends React.Component {
	constructor(props) {
		super(props);
	}

	renderItem = (item, index) => {
		item = JSON.parse(item.json);
		const iconItem = [
			<Popup key={index}
				trigger={<a key={item.id} onClick={() => { this.props.handleClick(item); }}>
					<span key={item.id} className={(this.props.activeObject.id === item.id) ? "circle active" : "circle"}>
						<i aria-hidden="true"
							className={(this.props.activeObject.id === item.id) ? "fa fa-check" : "fa"}>
						</i>
					</span>
				</a>}
				content={item.name}
				inverted
			/>
		];
		return iconItem;
	}

	render() {
		//console.log("sectionicons. panelData", this.props.data);

		let allIcons = [];
		const records = this.props.data[0].section.filter(function (item) {
			let json = JSON.parse(item.json);
			return json.selectable;
		});
		records.forEach((item,index) => {
			const icon = this.renderItem(item,index);
			allIcons = allIcons.concat(icon);
		});
		return (
			<div>
				<span className="edit-items">
					<span className="small color1 p-r-10">
						CUSTOMIZE
					</span>
					{allIcons}
				</span>
			</div>
		);
	}
}

SectionIcons.defaultProps = {
	data: [],
	handleClick: null,
	activeObject: { id: null },
	hoverObject: {},
	setHoverObject: null	
};

SectionIcons.propTypes = {
	data: PropTypes.array,
	handleClick: PropTypes.func,
	hoverObject: PropTypes.object,
	activeObject: PropTypes.object,
	setHoverObject: PropTypes.func
};

export default SectionIcons;