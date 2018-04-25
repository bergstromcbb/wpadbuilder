import React from "react";
import {
	Link,
} from "react-router";
import Dropzone from "react-dropzone";

class ImportAsset extends React.Component {

	constructor() {
		super();
		this.state = { files: [] };
	}
	
	onDrop(files) {
		this.setState({
			files
		});
	}

	render() {
		return (
			<div className="m-t-60 m-l-20">
				<div className="topHeaderContainer ribbon row p-0">
					<div className="headerItemLeft ">
						<ul className="breadcrumb">
							<li className=""><a className="small semi-bold" href="index.html">Home</a></li>
							<li><Link to="/assets" activeClassName="active">Assets</Link></li>
							<li><Link to="/importAsset" activeClassName="active">Import Asset</Link></li>
						</ul>
						<p className="panel-title teal all-caps threeHundred">Import Asset</p>
					</div>
					<div className="headerItemRight p-t-17 newList">
					</div>
				</div>
				<div className="container-fixed-lg">
					<div className="panel panel-transparent m-t-10">
						<div className="panel-heading ">
							<div className="panel-title semi-bold teal">
								<span className="categorytitle">
									<i className="pg-layouts4 teal">
									</i>
									<span className="p-l-10">Import your Asset</span>
								</span>
							</div>
						</div>
						<div className="panel-body">
							<div className="col-sm-6">
								<form id="form-work" role="form" autoComplete="off" noValidate="noValidate">
									<div className="form-group-attached">
										<div className="form-group form-group-defaultx required">
											<label className="invitelabel">Asset Name</label>
											<input type="text" className="form-control" id="fname" placeholder="Asset Name" name="name" required="required" aria-required="true" />
										</div>
									</div>
									<div className="form-group-attached">
										<div className="form-group form-group-defaultx required">
											<label className="invitelabel">File</label>
											<div className="radio radio-success">
												<input type="file" name="optionyes" id="male" />
											</div>
										</div>
									</div>
									<div className="form-group-attached">
										<div className="form-group form-group-defaultx required">
											<div className="checkbox check-success">
												<input type="checkbox" id="checkbox2" />
												<label htmlFor="checkbox2" className="small invitelabel">I certify that the list members are my customers</label>
											</div>
										</div>
									</div>

									<div className="p-t-20">
										<button type="button" id="btnImport" className="ui button btn-primary btn-cons">Import file</button>
									</div>
								</form>
							</div>

							<div className="col-sm-offset-1 col-md-5">
								<section>
									<div className="dropzone">
										<Dropzone onDrop={this.onDrop.bind(this)}>
											<p>Try dropping some files here, or click to select files to upload.</p>
										</Dropzone>
									</div>
									<aside>
										<ul>
											{
												this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
											}
										</ul>
									</aside>
								</section>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default ImportAsset;
