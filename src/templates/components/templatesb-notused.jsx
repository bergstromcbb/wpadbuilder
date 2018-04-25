import TemplatesList from "./TemplatesList"
import React from "react"
import Noty from "noty"
import {
	IndexLink,
} from "react-router"
import RibbonPiece from "./RibbonPiece"
// import { friendOptions } from '../common'
import axios from "axios"
import { Dropdown } from "semantic-ui-react"

// const TemplateSubcatDropdown = () => (
// 	<Dropdown placeholder='Select Friend' fluid selection options={friendOptions} />
// )

class Templates extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			error: null,
			data: [],
			listId: "",
			// list dropdown
			datalist: []
		}
		this.getRemoteTemplateData = this.getRemoteTemplateData.bind(this)
	}

	componentDidMount() {
		this.setState({ listId: this.props.params.listid }, () => {
			// get page data
			this.getRemoteData()
		})
	}
	getRemoteTemplateData = () => {
		// Define the request url
		let url = "https://private-8e550-directmail.apiary-mock.com/v1/templates/categories"

		axios.get(url,
			{
				limit: 10,
				offset: 0
			}
		)
			.then(response => {
				/*
				// Get current list name for state
				let currListId = this.state.listId;
				const selListName = response.data.lists.filter(function (list) {			
					return list.id == currListId;
				}).map(function(match){
					return match.name;
				});
	
				// Convert into smaller array with only elements the dropdown needs ('label and 'value' only)
				/* [
					{ key: 1, text: 'Choice 1', value: 1 },
					{ key: 2, text: 'Choice 2', value: 2, disabled: true },
					{ key: 3, text: 'Choice 3', value: 3 }
					// ]
				*/
				var resultArr = [],
					i = 0

				for (var k in response.data.lists) {
					var row = { key: `${i}`, text: `${response.data.lists[k].name}`, value: `${response.data.lists[k].id}` }
					resultArr.push(row)
					i++
				}

				this.setState((state) => ({
					datalist: resultArr
				}))
			})
				// get list data for dropdown
				this.getRemoteListData()
			})
			.catch(error => {
				console.log("Error loading the page", error)
				this.setState({ loading: false, error: error })

				
			}
			)

		
			
	};

// friendOptions = [
//   {
//     text: 'Jenny Hess',
//     value: 'Jenny Hess',
//     image: { avatar: true, src: '/assets/images/avatar/small/jenny.jpg' },
//   },
//  ...
// ]
	
	render() {
	
		if (this.state.loading) {
			return <span>Loading...</span>
		}
		else if (this.state.error !== null) {
			return <span>Error: {this.state.error.message}</span>
		}
		else {
			var Categories = this.state.data.categories
			console.log(this.state.data)
			var categoryList = Categories.map(function (category, index) {

				return (
					<div className="templates " key={index}>
						<img className="img-responsive tempImg" src={category.image} />
						<div className="tempcategorytitle tempbox whitelink" >{category.name}</div>
						<div className="tempsizebox fs-13">
							<div className="dropdown">
								{category.subcategories.map(function (subcategory, index2) {
									return (
										<div className="dropdown-content p-l-15" key={index2}>
											<IndexLink to={"/subcategoryrepeat/" + subcategory.id} activeClassName="active"><span>{subcategory.name}</span></IndexLink>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				)
			})

			return (
			<div className="m-t-60">
					<div className="topHeaderContainer flex ribbon row p-l-10 m-r-0">
							<RibbonPiece/>					
						{/*<div className="headerItemRight border-left p-t-17 newList">
							<Link to="/importTemplate" activeClassName="active" className="btn btn-primary"><i className="fa fa-plus"></i> NEW TEMPLATES</Link>
						 </div>*/}
					</div>
					<div className="container-fixed-lg">
						<div className="panel panel-transparent m-t-10">
							<div className="panel-heading ">
								<div className="panel-title semi-bold">
									<span className="categorytitle">
										<i className="pg-layouts teal">
										</i>
										<span className="p-l-10">All Templates</span>
									</span>
								</div>
							</div>
						</div>
					</div>
					{/*<div>
					<div role="listbox" aria-expanded="false" className="ui fluid selection dropdown" tabIndex="0">
						<div className="default text" role="alert" aria-live="polite">{category.name}</div>
						<i aria-hidden="true" className="dropdown icon"></i>
						<div className="menu transition">
							<div role="option" aria-checked="false" aria-selected="true" className="selected item">
								<img className="ui avatar image" src="/assets/images/avatar/small/jenny.jpg" />
								<span className="text">Jenny Hess</span>
							</div>
							<div role="option" aria-checked="false" aria-selected="false" className="item">
								<img className="ui avatar image" src="/assets/images/avatar/small/elliot.jpg" />
								<span className="text">Elliot Fu</span>
							</div>
							<div role="option" aria-checked="false" aria-selected="false" className="item">
								<img className="ui avatar image" src="/assets/images/avatar/small/stevie.jpg" />
								<span className="text">Stevie Feliciano</span>
							</div>
							<div role="option" aria-checked="false" aria-selected="false" className="item">
								<img className="ui avatar image" src="/assets/images/avatar/small/christian.jpg" />
								<span className="text">Christian</span>
							</div>
							<div role="option" aria-checked="false" aria-selected="false" className="item">
								<img className="ui avatar image" src="/assets/images/avatar/small/matt.jpg" />
								<span className="text">Matt</span>
							</div>
							<div role="option" aria-checked="false" aria-selected="false" className="item">
								<img className="ui avatar image" src="/assets/images/avatar/small/justen.jpg" />
								<span className="text">Justen Kitsune</span>
							</div>
						</div>
					</div>
					</div>*/}
					<TemplatesList/>
					{categoryList}
			</div>
		)
		}
	}
}
export default Templates
