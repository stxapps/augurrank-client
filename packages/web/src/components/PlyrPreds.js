'use client';
import { useSelector, useDispatch } from 'react-redux';

import { fetchPlyrMore } from '@/actions/chunk';
import { PredList } from '@/components/PredList';
import { getPlyrDesc, getPlyrPredsWthSts, getPlyrPredsHasMore } from '@/selectors';
import { isObject, isFldStr } from '@/utils';

export function PlyrPreds() {
  const stxAddr = useSelector(state => state.plyr.stxAddr);
  const didFetch = useSelector(state => state.plyr.didFetch);
  const desc = useSelector(state => getPlyrDesc(state));
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
  } else if (!isObject(desc)) {
    return null;
  } else if (desc.noPlyrPg === true) {
    return null;
  } else {
    return renderPdsPane();
  }
}
