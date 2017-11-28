import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import proxyModule from '../modules/proxy';
import { SET_PROXY_RESPONSE } from '../modules/proxy/constants';


class Proxy extends Component {

  static propTypes = {
    responses: PropTypes.shape().isRequired,
    setResponse: PropTypes.func.isRequired,
  };
  state = {}

  render() {
    const { setResponse, responses } = this.props;
    const { currentResponse } = this.state;
    const saveResponse = (e, url) => {
      setResponse(e, url, currentResponse);
      this.setState({ currentResponse: null });
    };

    return (
      <div>
        <h1>Proxy</h1>

        { currentResponse && (
          <div className="form-group">
            <textarea rows="20" className="form-control" onChange={(e) => this.setState({ currentResponse: e.target.value })} value={currentResponse} />

          </div>) }

        <ul className="list-group form-group">
          {Object.keys(responses).map((url) => {
            const status = responses[url].savedResponse ? 'Overwritten' : 'Normal';
            const statusClass = responses[url].savedResponse ? 'badge-warning' : 'badge-success';

            return (
              <li className="list-group-item" key={url}>
                <div>{url}</div>
                <div className={`ml-auto badge ${statusClass}`}>{status}</div>
                <button className="" onClick={(e) => setResponse(e, url)}>Use this response</button>
                {!currentResponse && (<button onClick={() => this.setState({ currentResponse: responses[url].cachedResponse })}>Edit</button>)}
                {currentResponse && (<button onClick={(e) => saveResponse(e, url, currentResponse)}>Save</button>)}
              </li>
            );
          }
          )}
        </ul>
      </div>);
  }
}

const mapStateToProps = (state) => ({
  responses: proxyModule.getAll(state),
});

const mapDispatchToProps = (dispatch) => ({
  setResponse: (e, url, response) => {
    e.preventDefault();
    dispatch({
      type: SET_PROXY_RESPONSE,
      payload: { url, response },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Proxy);
