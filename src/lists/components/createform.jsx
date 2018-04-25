import React from "react";
// import Input from "semantic-ui-react";

class CreateForm extends React.Component {

	render() {

		return (
			<div className="whitebox">
				<div className="ribbonTitle center teal">
					Create Your New List
				</div>
				<div className="listForm">
					<div className="listFormRow">
						<div className="listFormField">
							Campaign Names
						</div>
						<div className="listFormField">
							<input className="formInput" />
						</div>
					</div>
					<div className="listFormRow">
						<div className="listFormField">
							List Name
						</div>
						<div className="listFormField">
							<input className="formInput" />
						</div>
					</div>
					<div className="listFormRow">
						<div className="listFormField">
							Default Sender Name
						</div>
						<div className="listFormField">
							<input className="formInput" />
						</div>
					</div>
					<div className="listFormRow">
						<div className="listFormField">
							Default Sender Address
						</div>
						<div className="listFormField">
							<input className="formInput" />
						</div>
					</div>
					<div className="listFormRow">
						<div className="listFormField">
						</div>
						<div className="listFormField">
							<input className="formInput" />
							<br />
							<input className="formInput" />
							<br />
							<input className="formInput" />
						</div>

					</div>
					<div className="listFormRow">
						<div className="listFormField">
							Default Sender Email
						</div>
						<div className="listFormField">
							<input className="formInput" />
						</div>
					</div>
				</div>
				<div className="center p-b-20 p-t-10">
					<button type="submit" className="ui button btn-primary">
						NEXT
					</button>
				</div>
			</div>
		);
	}
}


export default CreateForm;