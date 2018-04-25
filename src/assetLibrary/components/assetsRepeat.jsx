import React from "react";
import PropTypes from "prop-types";

class AssetsRepeat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	
	renderItem = (item) => {
		const clickCallback = () => this.props.handleAssetClick(item);
		let imageSource = (item.thumbnail != "") ? item.thumbnail : item.asset_string;

		const itemRows = [
			<div key={item.id} className="col-xs-12 col-sm-6 col-lg-2">
				<span
					className={this.props.selectedItems.includes(item.id) ?
						"assets assetsGraphicContainer highlight" :
						"assets assetsGraphicContainer"}
					onClick={clickCallback}>
					<img className="img-responsive v-align-middle assetsimg" src={imageSource} />

					<span className={this.props.selectedItems.includes(item.id) ? "fauxCheckmark" : ""}></span>
				</span>
				<span className="clear"><small className="text-muted">{item.file_name}</small></span>
			</div>
		];
		return itemRows;
	}
	
	render() {
		let allItemRows = [];
		var records = this.props.data;
		records.forEach(item => {
			const perItemRows = this.renderItem(item);
			allItemRows = allItemRows.concat(perItemRows);
		});
		return (
			<div>
				<div className={this.props.data.length > 0 ? "show" : "hide"}>
					{allItemRows}
				</div>
			
				<div className={this.props.data.length == 0 ? "show center clear" : "hide center clear"}>
					<h3>Upload your assets</h3>
					<p>This is a place to store your images and coupons so you can use them in your campaigns</p>
					<p className="p-t-20">
						<img src="../../../assets/img/blank_state.png" />
					</p>
				</div>
			</div>
		);
	}
}

AssetsRepeat.propTypes = {
	data: PropTypes.array,
	selectedItems: PropTypes.array,
	handleAssetClick: PropTypes.func,
	handleImageAssetClick: PropTypes.func,
	handleCouponAssetClick: PropTypes.func,
	handleCouponTemplateAssetClick: PropTypes.func
};

export default AssetsRepeat;