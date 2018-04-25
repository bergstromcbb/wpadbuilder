import React from "react";

class Register extends React.Component{
	render() {
		return (
			<div className="m-t-60 m-l-20">
				<div className="container-sm-height full-height">
					<div className="row row-sm-height">
						<div className="col-sm-12 col-sm-height col-middle m-t-50 p-t-20 register">
							<h3>Create your account</h3>
							<p>
								<small>
									Already have an account <a href="login.html">login now</a>. Sign in with your <a href="#" className="text-info">Facebook</a> or
									<a href="#" className="text-info">Google</a>.
								</small>
							</p>
							<form id="form-register" className="p-t-15" role="form" action="index.html">
								<div className="row">
									<div className="col-sm-6">
										<div className="form-group form-group-defaultx">
											<label>First Name</label>
											<input type="text" name="fname" placeholder="John" className="form-control" required/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-group form-group-defaultx">
											<label>Last Names</label>
											<input type="text" name="lname" placeholder="Smith" className="form-control" required/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-12">
										<div className="form-group form-group-defaultx">
											<label>User name</label>
											<input type="text" name="uname" placeholder="Type username" className="form-control" required/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-12">
										<div className="form-group form-group-defaultx">
											<label>Password</label>
											<input type="password" name="pass" placeholder="Minimum of 8 Charactors" className="form-control" required/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-12">
										<div className="form-group form-group-defaultx">
											<label>Email</label>
											<input type="email" name="email" placeholder="Type email address" className="form-control" required/>
										</div>
									</div>
								</div>
								<div className="row m-t-10">
									<div className="col-md-6">
										<p>I agree to the <a href="#" className="text-info small">Pages Terms</a> and <a href="#" className="text-info small">Privacy</a>.</p>
									</div>
									<div className="col-md-6 text-right">
										<a href="#" className="text-info small">Help? Contact Support</a>
									</div>
								</div>
								<button className="ui button btn-primary btn-cons m-t-10" type="submit">Create account</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default Register;
