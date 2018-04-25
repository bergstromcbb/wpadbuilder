import React from "react";
import Formsy from "formsy-react-es6";

class Input extends React.Component {

	render() {
		// Set a specific className based on the validation
		// state of this component. showRequired() is true
		// when the value is empty and the required prop is
		// passed to the input. showError() is true when the
		// value typed is invalid
		//const className = 'form-group ' + (this.props.className || ' ') +
		const divClassName = (this.props.showRequired() ? "required" :
			this.props.showError() ? "error" : "");

		// An error message is returned ONLY if the component is invalid
		// or the server has returned an error message
		const errorMessage = this.props.getErrorMessage();

		return (
			<div className={divClassName}>
				<input
					type={this.props.type || "text"}
					name={this.props.name}
					onChange={(e) => this.props.setValue(e.target.value)}
					value={this.props.getValue()}
					placeholder={this.props.placeholder}
					checked={this.props.type === "checkbox" && this.props.getValue() ? "checked" : null}
				/>
				<span className='validation-error'>{errorMessage}</span>
			</div>
		);
	}
}
export default Formsy.Wrapper(Input);