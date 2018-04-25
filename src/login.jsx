import React from "react"
import {
	Link,
} from "react-router"

class Login extends React.Component{
	render() {
		return (
			<div className="login-wrapper ">
				<div className="bg-pic">
					<img src="pages/img/new-york-city-buildings-sunrise-morning-hd-wallpaper.jpg" data-src="pages/img/new-york-city-buildings-sunrise-morning-hd-wallpaper.jpg" data-src-retina="pages/img/new-york-city-buildings-sunrise-morning-hd-wallpaper.jpg" alt="" className="lazy"/>
					<div className="bg-caption pull-bottom sm-pull-bottom text-white p-l-20 m-b-20">
						<h2 className="semi-bold text-white">Send beautiful direct mail and get more customers</h2>
						<p className="small">
						</p>
					</div>
				</div>
				<div className="login-container bg-white login-block">
					<div className="p-l-20 m-l-20 p-r-20 m-r-20 p-t-50 m-t-30 sm-p-l-15 sm-p-r-15 sm-p-t-40">
						<img src="images/logo-white.png" alt="logo" data-src="images/logo-white.png" data-src-retina="assets/img/logo_2x-white.png"/>
						<p className="p-t-35">Sign into your DirectMail account</p>

						<form id="form-login" className="p-t-50" role="form" action="index.html">
							<div className="form-group form-group-defaultx">
								<label>Login</label>
								<div className="controls">
									<input type="text" name="username" placeholder="User Name" className="form-control"/>
								</div>
							</div>
							<div className="form-group form-group-defaultx">
								<label>Password</label>
								<div className="controls">
									<input type="password" className="form-control" name="password" placeholder="Type password"x/>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6 no-padding">
									<div className="checkbox ">
										<input type="checkbox" value="1" id="checkbox1"/>
										<label htmlFor="checkbox1">Keep Me Signed in</label>
									</div>
								</div>
								<div className="col-md-6 text-right">
									<a href="#" className="text-info small">Help? Contact Support</a>
								</div>
							</div>
							<Link to="#">
								<button className="ui button btn-primary btn-cons m-t-10" type="submit">Sign in</button></Link>
						</form>

						<div className="pull-bottom sm-pull-bottom">
							<div className="m-b-30 p-r-80xx sm-m-t-20 sm-p-r-15xx sm-p-b-20xxs clearfix">
								<div className="col-sm-3 col-md-2 no-padding">
								</div>
								<div className="col-sm-12 no-padding m-t-10">
									<p><Link to="/register" activeClassName="active" className="p-l-20 teal">Register for account</Link></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		);
	}
}
export default Login;
