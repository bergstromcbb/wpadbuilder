import React from "react";
import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";

class DoughnutComponent extends React.Component {
  render() {
    const data = {
      labels: ["Red", "Green", "Yellow"],
      datasets: [
        {
          data: [300, 200, 100],
          backgroundColor: ["#46a2ab", "#a5abb9", "#FFCE56"],
          hoverBackgroundColor: ["#46a2ab", "#a5abb9", "#FFCE56"]
        }
      ]
    };
    return (
      <div className="overallDonutContainer col-md-12">
        <div className="donutContainer col-md-4">
          <div className="donuts">
            <span className="title-2">Dollars per RO</span>
            <Doughnut data={data} />
          </div>
        </div>
        <div className="donutContainer col-md-4">
          <div className="donuts">
            <span className="title-2">Response Rate</span>
            <Doughnut data={data} />
          </div>
        </div>
        <div className="donutContainer col-md-4">
          <div className="donuts">
            <span className="title-2">ROI per $ Spent</span>
            <Doughnut data={data} />
          </div>
        </div>
      </div>
    );
  }
}

DoughnutComponent.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

export default DoughnutComponent;
