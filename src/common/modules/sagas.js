import proxySagas from './proxy/sagas';

export default function* rootSaga() {
  yield [
    proxySagas.map((saga) => saga()),
  ];
}
