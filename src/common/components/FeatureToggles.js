import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import meta from '../modules/meta';

export class FeatureToggles extends React.Component {
  render() {
    const toggleList = _.isEmpty(this.props.featureToggles) ?
      (<p className="t-no-active-features-message">No feature toggle selected, use ?feature-toggle[]=your-feature-toggle to enable feature toggles</p>) :
      (<div className="t-active-feature-toggles">
        <p>Active featureToggles:</p>
        <ul className="list-group">
          {this.props.featureToggles.map((featureToggle) => (<li className="list-group-item" key={`${featureToggle}-item`}>{featureToggle}</li>))}
        </ul>
      </div>);

    return (<div>{toggleList}</div>);
  }
}

FeatureToggles.propTypes = {
  featureToggles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  featureToggles: meta.getFeatureToggles(state),
});

export default connect(mapStateToProps, null)(FeatureToggles);
