import { expect } from 'chai';

import templateFactory, { TEST, methodTwo } from '../../src/template-factory';

describe('Template factory', () => {
  it('should do something', () => {
    expect(templateFactory().methodOne()).to.equal('method one');
    return Promise.resolve();
  });

  it('should export a constant', () => {
    expect(TEST).to.equal(1);
    return Promise.resolve();
  });

  it('should export non default method', () => {
    expect(methodTwo()).to.equal('method two');
    return Promise.resolve();
  });
});
