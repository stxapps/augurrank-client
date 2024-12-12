import lsgApi from '@/apis/localSg';
import { DID_AGREE_TERMS, GAME_BTC, UNSAVED_PREDS } from '@/types/const';
import { isObject } from '@/utils';

const getExtraUserData = () => {
  const str = lsgApi.getItemSync(DID_AGREE_TERMS);

  let didAgreeTerms = null;
  if (str === 'true') didAgreeTerms = true;
  else if (str === 'false') didAgreeTerms = false;

  return { didAgreeTerms };
};

const putExtraUserData = (didAgreeTerms) => {
  lsgApi.setItemSync(DID_AGREE_TERMS, didAgreeTerms ? 'true' : 'false');
};

const deleteExtraUserData = () => {
  lsgApi.removeItemSync(DID_AGREE_TERMS);
};

const getUnsavedPreds = () => {
  const keys = lsgApi.listKeysSync();

  const gameBtcPreds = []
  for (const key of keys) {
    if (!key.startsWith(UNSAVED_PREDS + '/')) continue;
    const str = lsgApi.getItemSync(key);

    let pred;
    try {
      pred = JSON.parse(str);
    } catch (error) {
      console.log('In getUnsavedPreds, invalid str:', str);
    }
    if (isObject(pred) && pred.game === GAME_BTC) {
      gameBtcPreds.push(pred);
    } else {
      console.log('In getUnsavedPreds, invalid pred:', pred);
    }
  }

  return { gameBtcPreds };
};

const putUnsavedPred = (pred) => {
  lsgApi.setItemSync(`${UNSAVED_PREDS}/${pred.id}`, JSON.stringify(pred));
};

const deleteUnsavedPred = (id) => {
  lsgApi.removeItemSync(`${UNSAVED_PREDS}/${id}`);
};

const deleteAllUnsavedPreds = () => {
  const keys = lsgApi.listKeysSync();
  for (const key of keys) {
    if (!key.startsWith(UNSAVED_PREDS + '/')) continue;
    lsgApi.removeItemSync(key);
  }
};

const deleteAllLocalFiles = () => {
  deleteExtraUserData();
  deleteAllUnsavedPreds();
};

const index = {
  getExtraUserData, putExtraUserData, deleteExtraUserData, getUnsavedPreds,
  putUnsavedPred, deleteUnsavedPred, deleteAllUnsavedPreds, deleteAllLocalFiles,
};

export default index;
