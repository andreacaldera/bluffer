import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { string, func, instanceOf } from 'prop-types';
import testClass from '../testClass';

import { MOCK_RESPONSE } from '../modules/proxy/constants';

class Log extends Component {
  static propTypes = {
    url: string.isRequired,
    responseBody: string.isRequired,
    client: string.isRequired,
    prettyResponseBody: string,
    timestamp: instanceOf(Date).isRequired,
    saveMockResponse: func.isRequired,
  };

  defaultProps = {
    prettyResponseBody: null,
  };

  state = {
    isEditMode: false,
  };

  toggleMockForm = e => {
    e.preventDefault();
    this.setState({ isEditMode: !this.state.isEditMode });
  };

  cancelEdit = e => {
    e.preventDefault();
    this.setState({ isEditMode: false });
    this.textarea.value =
      this.props.prettyResponseBody || this.props.responseBody;
  };

  mockResponse = e => {
    e.preventDefault();
    const { saveMockResponse, url } = this.props;
    saveMockResponse(url, this.textarea.value);
    this.setState({ isEditMode: false });
  };

  render() {
    const {
      url,
      timestamp,
      responseBody,
      prettyResponseBody,
      client,
    } = this.props;
    const { isEditMode } = this.state;
    const dateTime = moment(timestamp).format('DD-MMM HH:mm:ss');

    const detailsPanel = isEditMode && (
      <li className="list-group-item response-details" key={`${url}-details`}>
        <div className="w-100 form-group">
          <label className="response-details--label" htmlFor="url">
            URL:
          </label>
          <div id="url">{url}</div>
        </div>
        <div className="w-100 form-group">
          <label className="response-details--label" htmlFor="responseBody">
            Response body:
          </label>
          <textarea
            id="responseBody"
            ref={r => {
              this.textarea = r;
            }}
            rows="10"
            className="col form-control"
            defaultValue={prettyResponseBody || responseBody}
          />
        </div>
        <div className="w-100">
          <button
            className={`btn btn-primary ${testClass('mockBtn')}`}
            onClick={this.mockResponse}
          >
            Mock
          </button>
          <button
            onClick={this.cancelEdit}
            className="ml-1 btn btn-primary"
            alt="cancel"
          >
            Cancel
          </button>
        </div>
      </li>
    );

    return (
      <div
        className={`mt-1 ${testClass('response')}`}
        onClick={this.toggleMockForm}
      >
        <li
          className="list-group-item response-header t-response-header"
          key={`${url}-header`}
        >
          <div className="row w-100">
            <div className="col-8 url" title={url}>
              {url}
            </div>
            <div className="col-2">{client}</div>
            <div className="col-2">{dateTime}</div>
          </div>
        </li>
        {detailsPanel}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveMockResponse: (url, responseBody) => {
    dispatch({
      type: MOCK_RESPONSE,
      payload: { url, responseBody },
    });
  },
});

export default connect(null, mapDispatchToProps)(Log);
