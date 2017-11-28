import React from 'react';

import { shallow } from 'enzyme';
// TODO differences between shallow, mount, render?

import { expect } from 'chai';
import { FeatureToggles } from '../../src/common/components/FeatureToggles';

describe('FeatureToggles', () => {
  it('should render without throwing an error', () => {
    const wrapper = shallow(<FeatureToggles featureToggles={[]} />);

    expect(wrapper.find('.t-no-active-features-message').text()).to.contain('No feature toggle selected');
  });

  // it('should be selectable by class "foo"', () => {
  //   expect(shallow(<FeatureToggles />).is('.foo')).toBe(true);
  // });
  //
  // it('should mount in a full DOM', () => {
  //   expect(mount(<FeatureToggles />).find('.foo').length).toBe(1);
  // });
  //
  // it('should render to static HTML', () => {
  //   expect(render(<FeatureToggles />).text()).toEqual('Bar');
  // });
});
