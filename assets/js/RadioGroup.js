import React from "react";
import Formsy from "formsy-react-es6";

class RadioGroup extends React.Component {
	state = {};

	componentDidMount() {
		const value = this.props.value;
		this.props.setValue(value);
		this.setState({ value });
	}

	changeValue = (value) => {
		this.props.setValue(value);
		this.setState({ value });
	}

	render() {
		const className = "form-group " + (this.props.className || " ") +
		(this.props.showRequired() ? "required" :
			this.props.showError() ? "error" : "");

		const errorMessage = this.props.getErrorMessage();
		const { name, title, items } = this.props;

		/*--------------
			The "prop.item" passed in is an object array similar to below.
			[
				{
					label: "Option Name I",
					value: "1234567"
				},
				{
					label: "Option Name 2",
					value: "7654321"
				}
			]
		---------------*/

		return (
			<div className={className}>
				{items.map((item, i) => (
					<div key={i}>
						<input type="radio"
							name={name}
							value={item.value}
							onChange={this.changeValue.bind(this, item.value)}
							checked={this.state.value === item.value}
						/>
						&nbsp;
						<span>{item.label.toString()}
							<span style={(this.props.className == "showprimarylabel" && this.state.value === item.value) ?
								{ display:"inline-block", paddingLeft:"5px" } : { display:"none" }}>
								<span className="badge">primary</span>
							</span>						
						</span>
					</div>
				))
				}
				<span className='validation-error'>{errorMessage}</span>
			</div>
		);
	}
}
export default Formsy.Wrapper(RadioGroup);