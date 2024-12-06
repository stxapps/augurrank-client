import { useSelector } from 'react-redux';

import { getSafeAreaFrame, getSafeAreaInsets } from '@/selectors';

export const useSafeAreaFrame = () => {
  return useSelector(state => getSafeAreaFrame(state));
};

export const useSafeAreaInsets = () => {
  return useSelector(state => getSafeAreaInsets(state));
};