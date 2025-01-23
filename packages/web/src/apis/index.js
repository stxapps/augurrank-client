import lsgApi from '@/apis/localSg';
import { USER_OBJ, UNSAVED_PREDS, STX_TST_STR } from '@/types/const';
import { isString } from '@/utils';

const getLocalUser = () => {
  const data = {
    stxAddr: '', stxTstStr: STX_TST_STR, stxPubKey: '', stxSigStr: '',
    username: null, avatar: null, bio: null, didAgreeTerms: null,
  };

  const str = lsgApi.getItemSync(USER_OBJ);
  if (isString(str)) {
    try {
      const obj = JSON.parse(str);
      if (isString(obj.stxAddr)) data.stxAddr = obj.stxAddr;
      if (isString(obj.stxPubKey)) data.stxPubKey = obj.stxPubKey;
      if (isString(obj.stxSigStr)) data.stxSigStr = obj.stxSigStr;
      if (isString(obj.username)) data.username = obj.username;
      if (isString(obj.avatar)) data.avatar = obj.avatar;
      if (isString(obj.bio)) data.bio = obj.bio;
      if (obj.didAgreeTerms === true) data.didAgreeTerms = obj.didAgreeTerms;
    } catch (error) {
      // Ignore if cache value invalid
    }
  }

  return data;
};

const putLocalUser = (user) => {
  lsgApi.setItemSync(USER_OBJ, JSON.stringify(user));
};

const deleteLocalFiles = () => {
  const keys = lsgApi.listKeysSync();
  for (const key of keys) {
    if (!key.startsWith(`${UNSAVED_PREDS}/`)) continue;
    lsgApi.removeItemSync(key);
  }

  // Delete files in IndexedDB here if needed
};

const index = { getLocalUser, putLocalUser, deleteLocalFiles };

export default index;
