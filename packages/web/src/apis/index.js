import lsgApi from '@/apis/localSg';
import { DID_AGREE_TERMS, UNSAVED_PREDS } from '@/types/const';

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

const deleteAllLocalFiles = () => {
  deleteExtraUserData();

  const keys = lsgApi.listKeysSync();
  for (const key of keys) {
    if (!key.startsWith(`${UNSAVED_PREDS}/`)) continue;
    lsgApi.removeItemSync(key);
  }

  // Delete files in IndexedDB here if needed
};

const index = {
  getExtraUserData, putExtraUserData, deleteExtraUserData, deleteAllLocalFiles,
};

export default index;
