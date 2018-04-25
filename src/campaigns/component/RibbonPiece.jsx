import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//import { Progress } from "semantic-ui-react";
import ProgressBar from "./progressBar";

class RibbonPiece extends React.Component {

	formatDate(day) {
		if (day == null) {
			return "--/--/----";
		} else {
			return day.toDateString();
		}
	}

	render() {
		return (
			<div className="flex hundred">
				<div className="messagesSent col-sm-3 p-t-15">
					<span className="semi-bold ribbonSections">Campaign Name</span>
					<section className="semi-bold dashNumbers p-t-5">
						{this.props.campaignName}
					</section>
				</div>
				<div className="received border-left col-sm-2 p-t-15">
					<span className="ribbonSections semi-bold">Template</span>
					<section className="semi-bold dashNumbers p-t-5">
						{this.props.templateName}
					</section>
				</div>
				<div className="roi border-left col-sm-2 p-t-15">
					<span className="ribbonSections semi-bold">Recipients</span>
					<section className="semi-bold dashNumbers p-t-5">
						{this.props.recipientsNum}
					</section>
				</div>
				<div className="roi border-left col-sm-2 p-t-15">
					<span className="ribbonSections semi-bold">Delivery Date</span>
					<section className="semi-bold dashNumbers p-t-5">
						{this.formatDate(this.props.deliveryDate)}
					</section>
				</div>
				<div className="headerItemRight border-left col-sm-3 p-t-15" >
					<span>YOUR PROGRESS</span>
					<ProgressBar progressAmount={this.props.progressAmount} />
				</div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		campaignName: state.CampaignReducer.campaignName,
		recipientsNum: state.CampaignReducer.recipientsNum,
		templateName: state.CampaignReducer.templateName,
		deliveryDate: state.CampaignReducer.deliveryDate
	};
}

RibbonPiece.propTypes = {
	campaignName: PropTypes.string,
	recipientsNum: PropTypes.string,
	templateName: PropTypes.string,
	deliveryDate: PropTypes.instanceOf(Date),
	progressAmount: PropTypes.string
};

export default connect(mapStateToProps)(RibbonPiece);
