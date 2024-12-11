import lsgApi from '@/apis/localSg';
import { DID_AGREE_TERMS } from '@/types/const';

const getExtraUserData = () => {
  const str = lsgApi.getItemSync(DID_AGREE_TERMS);

  let didAgreeTerms = null;
  if (str === 'true') didAgreeTerms = true;
  else if (str === 'false') didAgreeTerms = false;

  return { didAgreeTerms };
};

const deleteExtraUserData = () => {
  lsgApi.removeItemSync(DID_AGREE_TERMS);
};

const saveExtraUserData = (didAgreeTerms) => {
  lsgApi.setItemSync(DID_AGREE_TERMS, didAgreeTerms ? 'true' : 'false');
};

const index = { getExtraUserData, deleteExtraUserData, saveExtraUserData };

export default index;
