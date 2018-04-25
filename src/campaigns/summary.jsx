import React, { Component } from "react";
import { Accordion, Icon } from "semantic-ui-react";
import RibbonPiece from "./component/ribbonpiece";
import StepsMenu from "./component/stepsmenu";
import { Link } from "react-router"; 
import PropTypes from "prop-types";
import { connect } from "react-redux";

class CampaignSummaryAccordian extends Component {
    state = { activeIndex: 0 }

    handleClick = (e, titleProps) => {
    	const { index } = titleProps;
    	const { activeIndex } = this.state;
    	const newIndex = activeIndex === index ? -1 : index;

    	this.setState({ activeIndex: newIndex });
    }
	
    formatDate(day) {
    	if (day == null) {
    		return "--/--/----";
    	} else {
    		return day.toDateString();
    	}
    }
 
    render() {
    	const { activeIndex } = this.state;

    	return (
  
    		<div className="m-t-60">
    			<div className="topHeaderContainer flex ribbon m-r-0">
    				<RibbonPiece progressAmount="100%"/>
    			</div>
    			
    			<div className="full-height">
    				<div className="full-height flex hundred">	
    					<div className="col-sm-9 p-t-25 p-l-30">
    							<i className="pg-layouts4 fs-20"></i>
    							<span className="semi-bold p-l-5">
									Campaign Summary
    							</span>
    							<p>
									Lorem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem orem ipsolr dolem
    							</p>
    						<Accordion className="p-t-20">
    							<Accordion.Title className="accord-title transparent" active={activeIndex === 0} index={0} onClick={this.handleClick}>
    									<Icon name='dropdown' className=""/>
    								<span className="all-caps ">
										Campaign Name:  {this.props.campaignName}

    								</span>
    								</Accordion.Title>

    							<Accordion.Content className="accord-content" active={activeIndex === 0}>
    								<span className="bold col-lg-3 col-md-4 col-sm-5 p-l-65">Campaign Name</span>
    									<span className="col-lg-9 col-md-8 col-sm-7 p-l-65">My Campaign name here</span>
    									<span className="bold col-lg-3 col-md-4 col-sm-5 p-l-65">Campaign Type</span>
    									<span className="col-lg-9 col-md-8 col-sm-7 p-l-65">Promo</span>
    									<span className="bold col-lg-3 col-md-4 col-sm-5 p-l-65">From Address</span>
    									<span className="col-lg-9 col-md-8 col-sm-7 p-l-65">
    									<address className="margin-bottom-20 margin-top-10">
    										<strong>Revox, Inc.</strong>
    										<br />Joseph Smith
    										<br />795 Folsom Ave, Suite 600
    										<br />San Francisco, CA 94107
    					 				</address>
    								</span>
    									<span className="pull-right m-b-15 f-l col-lg-12 col-md-12 col-sm-12">
    									<Link to="/newcampaign" className="ui button btn-primary inline m-l-65">
											Edit
    									</Link>
    								</span>
    							</Accordion.Content>

    								<Accordion.Title active={activeIndex === 1} className="accord-title transparent" index={1} onClick={this.handleClick}>
    									<Icon name='dropdown' className="" />
    									<span className="all-caps">
										Template being used:  {this.props.templateName}
    								</span>
    							</Accordion.Title>
    							<Accordion.Content className="accord-content-small" active={activeIndex === 1}>
    								<span className="bold col-lg-3 col-md-4 col-sm-5 p-l-65">Template</span>
    								<span className="col-lg-9 col-md-8 col-sm-7 p-l-65">Using the {this.props.templateName} template 
    								<Link className="p-l-10" to="/newcampaign">
												View a preview
    								</Link>
    								</span>
    							</Accordion.Content>

    								<Accordion.Title active={activeIndex === 2} index={2} className="accord-title transparent" onClick={this.handleClick}>
    									<Icon name='dropdown' className="" />
    									<span className="all-caps">
										How many are receiving this?  {this.props.recipientsNum}   
    								</span>
    								</Accordion.Title>
 
    								<Accordion.Content className="accord-content-small" active={activeIndex === 2}>
    									<span className="bold col-lg-3 col-md-4 col-sm-5 p-l-65">List</span>
    									<span className="col-lg-9 col-md-8 col-sm-7 p-l-65">Using the {this.props.recipientsNum} list
    										<Link className="p-l-10" to="/newcampaign">
												View members
    										</Link>
    									</span>
    									<span className="bold col-lg-3 col-md-4 col-sm-5 p-l-65"></span>
    									<span className="col-lg-9 col-md-8 col-sm-7 p-l-65 bold">Total recipients xx,xxx
    									</span>
    							</Accordion.Content>
    							<Accordion.Title active={activeIndex === 3} index={3} className="accord-title transparent" onClick={this.handleClick}>
    									<Icon name='dropdown'/>
    									<span className="all-caps">
										Delivery Scheduled for {this.formatDate(this.props.deliveryDate)}
    								</span>
    							</Accordion.Title>

    							<Accordion.Content className="accord-content" active={activeIndex === 3}>
    									<span className="bold col-lg-3 col-md-4 col-sm-5 p-l-65">Scheduled</span>
    									<span className="col-lg-9 col-md-8 col-sm-7 p-l-65">To be inhome by April 12, 2017
    										<Link className="p-l-10" to="/newcampaign">
												UnSchedule 
    										</Link>
    									</span>
    									<span className="bold col-lg-3 col-md-4 col-sm-5 p-l-65">Mail Delivery Type</span>
    									<span className="col-lg-9 col-md-8 col-sm-7 p-l-65">Promo</span>
    									<span className="bold col-lg-3 col-md-4 col-sm-5 p-l-65">Options</span>
    									<span className="col-lg-9 col-md-8 col-sm-7 p-l-65">
    										<address className="margin-bottom-20 margin-top-10">
    											<strong>Revox, Inc.</strong>
    											<br />Joseph Smith
    											<br />795 Folsom Ave, Suite 600
    											<br />San Francisco, CA 94107
    										</address>
    									</span>
    									<span className="pull-right m-b-15 f-l col-lg-12 col-md-12 col-sm-12">
    									<Link to="/newcampaign" className="ui button btn-primary inline m-l-65">
											Edit
    										</Link>
    									</span>
    								</Accordion.Content>

    						</Accordion>
    					</div>
    					<div className="col-sm-3 p-l-0 m-t-0">
    						<StepsMenu StepOne=" completed" StepTwo=" completed" StepThree=" completed" StepFour=" completed" StepFive=" completed" StepSix=" active"/>
    					</div>
    				</div>
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
		deliveryDate: state.CampaignReducer.deliveryDate,
	};
}

CampaignSummaryAccordian.propTypes = {
	campaignName: PropTypes.string,
	recipientsNum: PropTypes.string,
	templateName: PropTypes.string,
	deliveryDate: PropTypes.instanceOf(Date)

};

export default connect(mapStateToProps)(CampaignSummaryAccordian);