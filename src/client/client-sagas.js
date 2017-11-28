import { eventChannel } from 'redux-saga';
import { call, take, put, cancelled, select } from 'redux-saga/effects';
import { HAS_REACHED_PAGE_BOTTOM, SCROLL_ERROR, HAS_PASSED_HEIGHT_THRESHOLD } from '../common/modules/ui/constants';
import { getHasReachedPageBottom, getHasPassedHeightThreshold } from '../common/modules/ui/selectors';

function registerScroll() {
  return eventChannel((emitter) => {
    window.addEventListener('scroll', () => { emitter(window.scrollY); });
    const unsubscribe = () => { window.removeEventListener('scroll'); };
    return unsubscribe;
  });
}

function* scroll() {
  const scrollHandler = yield call(registerScroll);
  const forever = true;
  try {
    while (forever) {
      const scrollY = yield take(scrollHandler);

      const { innerHeight, document: { body: { offsetHeight } } } = window;

      const hasReachedPageBottom = scrollY + innerHeight + 100 >= offsetHeight;
      const previsousHasReachedPageBottom = yield select(getHasReachedPageBottom);
      if (previsousHasReachedPageBottom !== hasReachedPageBottom) {
        yield put({ type: HAS_REACHED_PAGE_BOTTOM, hasReachedPageBottom });
      }

      const hasPassedHeightThreshold = scrollY >= innerHeight * 0.9;
      const previsousHasPassedHeightThreshold = yield select(getHasPassedHeightThreshold);
      if (previsousHasPassedHeightThreshold !== hasPassedHeightThreshold) {
        yield put({ type: HAS_PASSED_HEIGHT_THRESHOLD, hasPassedHeightThreshold });
      }
    }
  } catch (err) {
    if (yield cancelled()) {
      scrollHandler.close();
    } else {
      yield put({ type: SCROLL_ERROR, err });
    }
  }
}

export default function* rootSaga() {
  yield [
    scroll(),
  ];
}
