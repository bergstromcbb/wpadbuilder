import React from "react";
import ImportRibbon from "./importribbon";
import SearchField from "../../core/searchpiece";
import NameForm from "./nameform";
import RibbonPiece from "../../campaigns/component/RibbonPiece";

class ListNaming extends React.Component {
  render() {
    return (
      <div className="m-t-60 m-l-20">
        <div className="topHeaderContainer ribbon row p-0">
          <RibbonPiece />
          <ImportRibbon onCreateList={this.onCreateList} />
        </div>

        <div className="row">
          <div className="col-sm-12">
            <SearchField />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <NameForm />
          </div>
        </div>
      </div>
    );
  }
}

export default ListNaming;
