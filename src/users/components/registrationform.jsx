import React from "react";

class SignInForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: ""
		};
	}

	onChange(key, value) {
		this.setState({ [key]: value});
	}

	onSubmit(ev) {
		ev.preventDefault();
		const username = this.state.username;
		const password = this.state.password;
		alert (`You submitted username=${username} password=${password}`);
	}

	render() {
		const onUsernameChange = ev => this.onChange("username", ev.target.value);
		const onPasswordChange = ev => this.onChange("password", ev.target.value);
		return (
			<form className="p-t-70" onSubmit={ev => this.onSubmit(ev)}>
				<p>Username: <input name="username" type="text" value={this.state.username} onChange={onUsernameChange} /></p>
				<p>Password: <input name="password" type="password" value={this.state.password} onChange={onPasswordChange} /></p>
				<button type="submit">Sign In</button>
			</form>
		);
	}
}


export default SignInForm;
