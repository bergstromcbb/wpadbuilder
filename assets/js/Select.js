import React from "react";
import Formsy from "formsy-react-es6";

class Select extends React.Component {

	render() {
		//const divClassName = 'form-group ' + (this.props.className || ' ') +
		const divClassName = "form-group" + (this.props.showRequired() 
			? " required" : this.props.showError() ? " error" : "");
		const errorMessage = this.props.getErrorMessage();

		const options = this.props.options.map((option, i) => (
			<option key={option.title+option.value} value={option.value}>
				{option.title}
			</option>
		));

		return (
			<div className={divClassName}>
				<select name={this.props.name} className={this.props.className} onChange={(e) => this.props.setValue(e.target.value)} value={this.props.getValue()}>
					{options}
				</select>
				<span className='validation-error'>{errorMessage}</span>
			</div>
		);
	}
}

export default Formsy.Wrapper(Select);