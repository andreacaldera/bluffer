import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';

import meta from '../modules/meta';

import metaActions from '../modules/meta/actions';

class App extends Component {
  static propTypes = {
    activePage: PropTypes.string.isRequired,
    setActivePage: PropTypes.func.isRequired,
    changeRoute: PropTypes.func.isRequired,
  };

  state = {
    isMenuOpen: false,
  }

  toggleMenu = (e) => {
    e.preventDefault();
    const { isMenuOpen } = this.state;
    this.setState({ isMenuOpen: !isMenuOpen });
  }

  navigate = (page) => (e) => {
    e.preventDefault();
    this.props.changeRoute(`/${page}`);
    this.props.setActivePage(page);
    this.setState({ isMenuOpen: false });
  }

  render() {
    const { activePage } = this.props;

    return (
      <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse fixed-top">
        <button className="navbar-toggler navbar-toggler-right" type="button" onClick={this.toggleMenu}>
          <span className="navbar-toggler-icon" />
        </button>
        <Link className="navbar-brand" to="/" href="/">Bluffer</Link>

        <div className={`collapse navbar-collapse ${this.state.isMenuOpen ? 'show' : 'collapse'}`}>
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item ${activePage === 'home' ? 'active' : ''}`}>
              <Link className="nav-link" to="/" href="/" onClick={this.navigate('home')}>Home</Link>
            </li>
            <li className={`nav-item ${activePage === 'about' ? 'active' : ''}`}>
              <Link className="nav-link" to="/about" href="/about" onClick={this.navigate('about')}>About</Link>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="text" placeholder="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  activePage: meta.getActivePage(state),
});

export default connect(mapStateToProps, metaActions)(App);
