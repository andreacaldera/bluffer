import { expect } from 'chai';

import template from '../../src/template';

const templateAgain = require('../../src/template');

describe('Template', () => {
  it('should do something', () => {
    expect(template.methodTwo()).to.equal('method two');
    return Promise.resolve();
  });

  it('should do something again', () => {
    expect(templateAgain.methodTwo()).to.equal('method two');
    return Promise.resolve();
  });
});
