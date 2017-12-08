import reducers from '../../src/common/modules/proxy/reducers';
import { RESPONSE_LOGGED, ALL_LOGS_DELETED, RESPONSE_MOCKED, MOCK_DELETED, ALL_MOCKS_DELETED } from '../../src/common/modules/proxy/constants';

describe('Proxy reducers', () => {
  describe('logs reducer', () => {
    it('logs a response', () => {
      const proxyId = 'some proxy id';
      const loggedResponse = 'some logged response';

      const state = reducers({}, { type: RESPONSE_LOGGED, payload: { proxyId, loggedResponse } });
      expect(state.logs).toEqual({
        [proxyId]: [loggedResponse],
      });
    });

    it('adds most recent response in the correct order', () => {
      const existingLoggedResponse = 'i was here before';
      const proxyId = 'some proxy id';
      const loggedResponse = 'some logged response';
      const initialState = {
        logs: {
          [proxyId]: [existingLoggedResponse],
        },
      };

      const state = reducers(initialState, { type: RESPONSE_LOGGED, payload: { proxyId, loggedResponse } });
      expect(state.logs).toEqual({
        [proxyId]: [loggedResponse, existingLoggedResponse],
      });
    });

    it('clears logs', () => {
      const proxyId = 'some proxy id';
      const initialState = {
        logs: {
          [proxyId]: ['some logged response'],
        },
      };

      const state = reducers(initialState, { type: ALL_LOGS_DELETED, payload: { proxyId } });
      expect(state.logs).toEqual({
        [proxyId]: [],
      });
    });
  });

  describe('mocks reducer', () => {
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
});
