import React from 'react';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: 0,
      show: false,
      fileName: '',
      report: {},
      isLoading:false
    };

    this.genrate = this.genrate.bind(this);
    this.report = this.report.bind(this);
  }
  genrate() {
    this.setState({ isLoading: true, report: {}, show: false});

    axios.get("http://localhost:4000/genrate", {})
      .then((response) => {

        this.setState({ link: response.data.link, show: true, fileName: response.data.fileName, report: {},isLoading:false });
      })
      .catch((err) => {
        console.log(err);

      });
  }
  report() {

    axios.get("http://localhost:4000/report/" + this.state.fileName, {})
      .then((response) => {
        let res = Object.values(response.data.res)


        let report = {};
        report['realNumbers'] = res[0]
        report['integers'] = res[1]
        report['alphabetical'] = res[2]
        report['alphanumerics'] = res[3]

        this.setState({ report: report });

      })
      .catch((err) => {
        console.log(err);

      });
  }
  render() {
    const { show, link, report, isLoading } = this.state;
    var listItems = Object.entries(report).map(function (k, v) {
      return (
        <li key={v}>
          <span className='button' >{k[0] + " " + k[1]}</span>
        </li>
      );
    });
    return (
      <div>
        <button type="button" onClick={this.genrate} disabled={isLoading} >genrate</button>
        <br></br>
        <br></br>
        {show && <div>
          <a disabled={this.state.show} href={link}>{link}</a>
          <br></br>
          <button type="button" onClick={this.report}  >report</button>
        </div>}
        {show && <div>
          {listItems}
        </div>}
      </div>
    )
  }
}