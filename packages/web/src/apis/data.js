import idxApi from '@/apis';
import lsgApi from '@/apis/localSg';
import {
  BTC_PRICE_OBJ, BURN_HEIGHT_OBJ, GAME_URL, ME_URL, PREDS_URL, PRED_URL, VALID,
  UNSAVED_PREDS, ERR_INVALID_ARGS, ERR_NOT_FOUND, ERR_INVALID_RES, N_PREDS,
} from '@/types/const';
import { isObject, isString, isNumber, getStatusText } from '@/utils';

const _fetchBtcPrice = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    if (!res.ok) {
      throw new Error(getStatusText(res));
    }
    const obj = await res.json();
    const price = obj.bitcoin.usd;
    return price;
  } catch (error) {
    // Ignore to try another api
  }

  const res = await fetch('https://api.blockchain.info/ticker');
  if (!res.ok) {
    throw new Error(getStatusText(res));
  }
  const obj = await res.json();
  const price = obj.USD.last;
  return price;
};

const fetchBtcPrice = async () => {
  const str = lsgApi.getItemSync(BTC_PRICE_OBJ);
  if (isString(str)) {
    try {
      const obj = JSON.parse(str);
      if (Date.now() - obj.createDate < 9 * 60 * 1000) {
        return obj.price;
      }
    } catch (error) {
      // Ignore if cache value invalid
    }
  }

  const price = await _fetchBtcPrice();

  lsgApi.setItemSync(
    BTC_PRICE_OBJ, JSON.stringify({ price, createDate: Date.now() })
  );
  return price;
};

const _fetchBurnHeight = async () => {
  try {
    const res = await fetch('https://api.hiro.so/extended');
    if (!res.ok) {
      throw new Error(getStatusText(res));
    }
    const obj = await res.json();
    const height = obj.chain_tip.burn_block_height;
    return height;
  } catch (error) {
    // Ignore to try another api
  }

  const res = await fetch('https://blockstream.info/api/blocks/tip/height');
  if (!res.ok) {
    throw new Error(getStatusText(res));
  }
  const text = await res.text();
  const height = parseInt(text, 10);
  return height;
};

const fetchBurnHeight = async () => {
  const str = lsgApi.getItemSync(BURN_HEIGHT_OBJ);
  if (isString(str)) {
    try {
      const obj = JSON.parse(str);
      if (Date.now() - obj.createDate < 9 * 60 * 1000) {
        return obj.height;
      }
    } catch (error) {
      // Ignore if cache value invalid
    }
  }

  const height = await _fetchBurnHeight();

  lsgApi.setItemSync(
    BURN_HEIGHT_OBJ, JSON.stringify({ height, createDate: Date.now() })
  );
  return height;
};

const fetchTxInfo = async (txId) => {
  const res = await fetch(`https://api.hiro.so/extended/v1/tx/${txId}`);
  if (res.status === 404) {
    throw new Error(ERR_NOT_FOUND);
  }
  if (!res.ok) {
    throw new Error(getStatusText(res));
  }
  const obj = await res.json();
  return obj;
};

const getAuthData = () => {
  const { stxAddr, stxTstStr, stxPubKey, stxSigStr } = idxApi.getLocalUser();
  return { stxAddr, stxTstStr, stxPubKey, stxSigStr };
};

const fetchGame = async (game) => {
  const authData = getAuthData();

  const res = await fetch(GAME_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'strict-origin',
    body: JSON.stringify({ ...authData, game }),
  });
  if (!res.ok) {
    throw new Error(getStatusText(res));
  }

  const obj = await res.json();
  if (obj.status !== VALID) {
    throw new Error(ERR_INVALID_RES);
  }

  return obj;
};

const fetchMe = async () => {
  const authData = getAuthData();

  const res = await fetch(ME_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'strict-origin',
    body: JSON.stringify({ ...authData }),
  });
  if (!res.ok) {
    throw new Error(getStatusText(res));
  }

  const obj = await res.json();
  if (obj.status !== VALID) {
    throw new Error(ERR_INVALID_RES);
  }

  return obj;
};

const fetchPreds = async (
  ids, game, createDate, operator, excludingIds, fthMeStsIfVrfd = false
) => {
  // 1. fetch per ids for an update i.e. verifiable to verified.
  // 2. fetch previous items.
  const authData = getAuthData();

  let reqData;
  if (Array.isArray(ids) && ids.length > 0 && ids.length <= N_PREDS) {
    reqData = { ids, fthMeStsIfVrfd };
  } else if (
    isString(game) && isNumber(createDate) &&
    isString(operator) && Array.isArray(excludingIds)
  ) {
    reqData = { game, createDate, operator, excludingIds, fthMeStsIfVrfd };
  } else {
    console.log(`In fetchPreds, invalid args: ${ids}, ${game}, ${createDate}, ${operator}, ${excludingIds}`);
    throw new Error(ERR_INVALID_ARGS);
  }

  const res = await fetch(PREDS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'strict-origin',
    body: JSON.stringify({ ...authData, ...reqData }),
  });
  if (!res.ok) {
    throw new Error(getStatusText(res));
  }

  const obj = await res.json();
  if (obj.status !== VALID) {
    throw new Error(ERR_INVALID_RES);
  }

  return obj;
};

const putPred = async (pred) => {
  const authData = getAuthData();

  const res = await fetch(PRED_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'strict-origin',
    body: JSON.stringify({ ...authData, pred }),
  });
  if (!res.ok) {
    throw new Error(getStatusText(res));
  }

  const obj = await res.json();
  if (obj.status !== VALID) {
    throw new Error(ERR_INVALID_RES);
  }

  return obj;
};

const getUnsavedPreds = (game) => {
  const keys = lsgApi.listKeysSync();

  const preds = [];
  for (const key of keys) {
    if (!key.startsWith(`${UNSAVED_PREDS}/`)) continue;
    const str = lsgApi.getItemSync(key);

    let pred;
    try {
      pred = JSON.parse(str);
    } catch (error) {
      console.log('In getUnsavedPreds, invalid str:', str);
      continue;
    }
    if (!isObject(pred)) {
      console.log('In getUnsavedPreds, invalid pred:', pred);
      continue;
    }
    if (pred.game === game) preds.push(pred);
  }

  return preds;
};

const putUnsavedPred = (pred) => {
  lsgApi.setItemSync(`${UNSAVED_PREDS}/${pred.id}`, JSON.stringify(pred));
};

const deleteUnsavedPred = (id) => {
  lsgApi.removeItemSync(`${UNSAVED_PREDS}/${id}`);
};

const data = {
  fetchBtcPrice, fetchBurnHeight, fetchTxInfo, fetchGame, fetchMe, fetchPreds, putPred,
  getUnsavedPreds, putUnsavedPred, deleteUnsavedPred,
};

export default data;
