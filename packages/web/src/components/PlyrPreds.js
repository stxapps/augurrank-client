'use client';
import { useSelector, useDispatch } from 'react-redux';

import { fetchPlyrMore } from '@/actions/chunk';
import { PredList } from '@/components/PredList';
import { getPlyrPredsWthSts, getPlyrPredsHasMore } from '@/selectors';
import { isObject, isFldStr } from '@/utils';

export function PlyrPreds() {
  const stxAddr = useSelector(state => state.plyr.stxAddr);
  const didFetch = useSelector(state => state.plyr.didFetch);
  const data = useSelector(state => state.plyr.data);
  const predsWthSts = useSelector(state => getPlyrPredsWthSts(state));
  const hasMore = useSelector(state => getPlyrPredsHasMore(state));
  const fetchingMore = useSelector(state => state.plyr.fetchingMore);
  const dispatch = useDispatch();

  const onMoreBtnClick = () => {
    dispatch(fetchPlyrMore());
  };

  const onRetryMoreBtnClick = () => {
    dispatch(fetchPlyrMore(true));
  };

  const renderEmpty = () => {
    return null;
  };

  const renderPdsPane = () => {
    return (
      <PredList predsWthSts={predsWthSts} hasMore={hasMore} fetchingMore={fetchingMore} onMoreBtnClick={onMoreBtnClick} onRetryMoreBtnClick={onRetryMoreBtnClick} renderEmpty={renderEmpty} />
    );
  };

  if (stxAddr === null) {
    return null;
  } else if (!isFldStr(stxAddr)) {
    return null;
  } else if (didFetch === null) {
    return null;
  } else if (didFetch === false) {
    return null;
  } else if (!isObject(data)) {
    return null;
  } else {
    return renderPdsPane();
  }
}
