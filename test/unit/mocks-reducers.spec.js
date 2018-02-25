import reducers from '../../src/common/modules/mocks/reducers';
import { RESPONSE_MOCKED, MOCK_DELETED, ALL_MOCKS_DELETED } from '../../src/common/modules/mocks/constants';

describe('Mocks reducers', () => {
  it('mocks a new response', () => {
    const proxyId = 'some proxy id';
    const url = '/some-url';
    const timestamp = '2017-12-08T12:01:40.957Z';
    const responseBody = 'some mock response';

    const existingUrl = 'i was here before';
    const existingMock = 'so was i';

    const initialState = {
      mocks: {
        [proxyId]: {
          [existingUrl]: existingMock,
        },
      },
    };

    const state = reducers(initialState, {
      type: RESPONSE_MOCKED,
      payload: {
        proxyId,
        url,
        timestamp,
        responseBody,
      },
    });
    expect(state.mocks).toEqual({
      [proxyId]: {
        [existingUrl]: existingMock,
        [url]: {
          url,
          timestamp,
          responseBody,
          proxyId,
        },
      },
    });
  });

  it('updates an existing mock', () => {
    const proxyId = 'some proxy id';
    const url = '/some-url';
    const timestamp = '2017-12-08T12:01:40.957Z';
    const responseBody = 'some mock response';

    const initialState = {
      mocks: {
        [proxyId]: {
          [url]: 'i was here before',
        },
      },
    };

    const state = reducers(initialState, {
      type: RESPONSE_MOCKED,
      payload: {
        proxyId,
        url,
        timestamp,
        responseBody,
      },
    });
    expect(state.mocks).toEqual({
      [proxyId]: {
        [url]: {
          url,
          timestamp,
          responseBody,
          proxyId,
        },
      },
    });
  });

  it('deletes a mock', () => {
    const proxyId = 'some proxy id';
    const url = '/some-url';

    const anotherUrl = '/another url';
    const anotherMock = 'another mock';

    const initialState = {
      mocks: {
        [proxyId]: {
          [url]: 'i am going to be deleted :(',
          [anotherUrl]: anotherMock,
        },
      },
    };

    const state = reducers(initialState, {
      type: MOCK_DELETED,
      payload: { proxyId, url },
    });
    expect(state.mocks).toEqual({
      [proxyId]: {
        [anotherUrl]: anotherMock,
      },
    });
  });

  it('deletes all mocks for a proxy', () => {
    const proxyId = 'some proxy id';
    const url = '/some-url';

    const anotherUrl = '/another url';
    const anotherMock = 'another mock';

    const initialState = {
      mocks: {
        [proxyId]: {
          [url]: 'i am going to be deleted :(',
          [anotherUrl]: anotherMock,
        },
      },
    };

    const state = reducers(initialState, {
      type: ALL_MOCKS_DELETED,
      payload: { proxyId, url },
    });
    expect(state.mocks).toEqual({
      [proxyId]: {},
    });
  });
});
