import React, { Component } from 'react';
// import moment from 'moment';
import { string } from 'prop-types';

export default class Log extends Component {
  static propTypes = {
    url: string.isRequired,
  }

  render() {
    const { url } = this.props;

    return (
      <li className="list-group-item Response" key={url}>
        <div className="col-5" title={url}>{url}</div>
        { /*
        <div className="col-3">{dateTime}</div>
        <div className={`col badge ${statusClass}`}>{status}</div>
        <div className="col-2">
          <button className="float-right btn btn-primary ml-1" onClick={(e) => deleteResponse(e, response.url)}>Delete</button>
          <button className="float-right btn btn-primary" onClick={(e) => selectResponse(e, response.url)}>Edit</button>
        </div>
        */ }
      </li>
    );

    // {selectedResponse && (
    //   <div className="form-group mt-1">
    //     <div className="row">
    //       <textarea rows="10" className="col form-control" onChange={(e) => this.setState({ currentResponse: e.target.value })} value={currentResponse} />
    //     </div>
    //     <div className="row mt-1">
    //       <div className="col">
    //         <button className="btn btn-primary" onClick={(e) => saveResponse(e, selectedUrl, currentResponse)}>Save</button>
    //         <button className="btn btn-primary ml-1" onClick={(e) => cancelEditing(e)}>Cancel</button>
    //       </div>
    //     </div>
    //   </div>
    // )}
    //
    //   if (selectedUrl && selectedUrl !== response.url) {
    //     return null;
    //   }
    //   const status = response.savedResponse ? 'Overwritten' : 'Normal';
    //   const statusClass = response.savedResponse ? 'badge-warning' : 'badge-success';
    //   const dateTime = response.timestamp ? moment(response.timestamp).format('MMM Do YYYY, HH:mm:ss') : null;
  }
}


// #2
//   if (selectedUrl && selectedUrl !== response.url) {
//     return null;
//   }
//   const status = response.savedResponse ? 'Overwritten' : 'Normal';
//   const statusClass = response.savedResponse ? 'badge-warning' : 'badge-success';
//   const dateTime = response.timestamp ? moment(response.timestamp).format('MMM Do YYYY, HH:mm:ss') : null;
//
//   return (
//     <li className="list-group-item Response" key={response.url}>
//       <div className="col-5" title={response.url}>{response.url}</div>
//       <div className="col-3">{dateTime}</div>
//       <div className={`col badge ${statusClass}`}>{status}</div>
//       <div className="col-2">
//         <button className="float-right btn btn-primary ml-1" onClick={(e) => deleteResponse(e, response.url)}>Delete</button>
//         <button className="float-right btn btn-primary" onClick={(e) => selectResponse(e, response.url)}>Edit</button>
//       </div>
//     </li>
//   );
// }
// )}


        // {selectedResponse && (
        //   <div className="form-group mt-1">
        //     <div className="row">
        //       <textarea rows="10" className="col form-control" onChange={(e) => this.setState({ currentResponse: e.target.value })} value={currentResponse} />
        //     </div>
        //     <div className="row mt-1">
        //       <div className="col">
        //         <button className="btn btn-primary" onClick={(e) => saveResponse(e, selectedUrl, currentResponse)}>Save</button>
        //         <button className="btn btn-primary ml-1" onClick={(e) => cancelEditing(e)}>Cancel</button>
        //       </div>
        //     </div>
        //   </div>
        // )}
