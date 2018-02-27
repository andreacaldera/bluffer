import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { string, func, instanceOf, oneOfType } from 'prop-types';
import testClass from '../testClass';

import proxyActions from '../modules/proxy/actions';
import mocksActions from '../modules/mocks/actions';

class Log extends Component {
  static propTypes = {
    url: string.isRequired,
    responseBody: string.isRequired,
    client: string.isRequired,
    prettyResponseBody: string,
    httpMethod: string.isRequired,
    contentType: string.isRequired,
    timestamp: oneOfType([instanceOf(Date), string]).isRequired,
    saveMockResponse: func.isRequired,
  };

  static defaultProps = {
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
    const {
      saveMockResponse,
      url,
      httpMethod,
      contentType,
    } = this.props;
    saveMockResponse({
      url,
      responseBody: this.textarea.value,
      httpMethod,
      contentType,
    });
    this.setState({ isEditMode: false });
  };

  render() {
    const {
      url,
      timestamp,
      responseBody,
      prettyResponseBody,
      client,
      httpMethod,
      contentType,
    } = this.props;
    const { isEditMode } = this.state;
    const dateTime = moment(timestamp).format('DD-MMM HH:mm:ss');

    const detailsPanel = isEditMode && (
      <li className="list-group-item response-details" key={`${url}-details`}>
        <div className="w-100 form-group">
          <div className="response-details--label">
            URL:
          </div>
          <div className="response-details--url">{url}</div>
        </div>
        <div className="w-50 form-group">
          <div className="response-details--label">
            HTTP method:
          </div>
          <div>{httpMethod}</div>
        </div>
        <div className="w-50 form-group">
          <div className="response-details--label">
            Content type:
          </div>
          <div>{contentType}</div>
        </div>
        <div className="w-100 form-group">
          <div className="response-details--label">
            Response body:
          </div>
          <textarea
            id="responseBody"
            ref={r => {
              this.textarea = r;
            }}
            className={`col form-control ${testClass('textarea')} response-details--body`}
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
      <div className={`mt-1 ${testClass('response')}`}>
        <li
          role="presentation"
          onClick={this.toggleMockForm}
          onKeyPress={this.toggleMockForm}
          className="list-group-item response-header"
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

export default connect(null, { ...proxyActions, saveMockResponse: mocksActions.saveMockResponse })(Log);
