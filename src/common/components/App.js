import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { renderRoutes } from 'react-router-config';

import meta from '../modules/meta';
import { SET_ACTIVE_PAGE, DISPLAY_INFO, DISPLAY_ERROR } from '../modules/meta/constants';

const App = ({ route, activePage, setActivePage, info, error, closeInfo, closeError }) => (
  <div>
    <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse fixed-top">
      <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <Link className="navbar-brand" to="/ui">Bluffer</Link>

      <div className="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul className="navbar-nav mr-auto">
          <li className={`nav-item ${activePage === 'home' ? 'active' : ''}`}>
            <Link className="nav-link" to="/ui" onClick={() => setActivePage('home')}>Home</Link>
          </li>
          <li className={`nav-item ${activePage === 'about' ? 'active' : ''}`}>
            <Link className="nav-link" to="/ui/about" onClick={() => setActivePage('about')}>About</Link>
          </li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <input className="form-control mr-sm-2" type="text" placeholder="Search" />
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
    <div className="container">
      {info && (<div className="alert alert-info">
        {info}
        <a role="link" onClick={closeInfo} className="float-right"><i className="fa fa-close fa-lg" /></a>
      </div>)}
      {error && (<div className="alert alert-danger">
        {error}
        <a role="link" onClick={closeError} className="float-right"><i className="fa fa-close fa-lg" /></a>
      </div>)}
      {renderRoutes(route.routes)}
    </div>
  </div>
);

App.propTypes = {
  route: PropTypes.shape().isRequired,
  activePage: PropTypes.string.isRequired,
  setActivePage: PropTypes.func.isRequired,
  closeInfo: PropTypes.func.isRequired,
  closeError: PropTypes.func.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
};

const mapStateToProps = (state) => ({
  activePage: meta.getActivePage(state),
  info: meta.getInfo(state),
  error: meta.getError(state),
});

const mapDispatchToProps = (dispatch) => ({
  setActivePage(activePage) {
    dispatch({ type: SET_ACTIVE_PAGE, activePage });
  },
  closeInfo: (e) => {
    e.preventDefault();
    dispatch({
      type: DISPLAY_INFO,
      payload: null,
    });
  },
  closeError: (e) => {
    e.preventDefault();
    dispatch({
      type: DISPLAY_ERROR,
      payload: null,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
