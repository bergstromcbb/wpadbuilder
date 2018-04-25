import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { fieldOptions } from './dropdownvalues'

class MappingDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  handleOpen = () => this.setState({ modalOpen: true })

  render() {

    return (
      <div>
        <Dropdown
          placeholder='Select Field Name'
          fluid
          selection
          onClick={this.handleOpen}
          options={fieldOptions}
        />
      </div>

    )
  }
}
export default MappingDropDown;