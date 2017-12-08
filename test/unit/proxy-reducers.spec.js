import reducers from '../../src/common/modules/proxy/reducers';
import { RESPONSE_LOGGED, ALL_LOGS_DELETED } from '../../src/common/modules/proxy/constants';

describe('Proxy reducers', () => {
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
