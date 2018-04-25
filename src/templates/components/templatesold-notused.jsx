import React from "react";
import RibbonPiece from "../../component/RibbonPiece";
import Newtemplates from "./newTemplates";
import TemplatesList from "../../components/templates/TemplatesList";
import StepsMenu from "./component/stepsmenu";

class Templates extends React.Component{
	render() {
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
									All Templates
								</span>
							</span>
							<TemplatesList promise={$.getJSON("https://private-8e550-directmail.apiary-mock.com/v1/templates/categories")} />

							<Newtemplates />	
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
export default Templates;