import { fetchCallReadOnlyFunction, Cl } from '@stacks/transactions/dist/esm';
import { signECDSA } from '@stacks/encryption/dist/esm';
import { STACKS_MAINNET } from '@stacks/network/dist/esm';

import userSession from '@/userSession';
import lsgApi from '@/apis/localSg';
import {
  BTC_PRICE_OBJ, BURN_HEIGHT_OBJ, GAME_URL, ME_URL, PREDS_URL, PRED_URL, VALID,
  TEST_STRING, UNSAVED_PREDS, NOT_FOUND_ERROR,
} from '@/types/const';
import { isObject, isString, isNumber, getUserStxAddr } from '@/utils';

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

  const userData = userSession.loadUserData();
  const stxAddr = getUserStxAddr(userData);

  const opts = {
    contractAddress: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM',
    contractName: 'amm-pool-v2-01',
    functionName: 'get-helper-a',
    functionArgs: [
      Cl.principal('SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-abtc'),
      Cl.principal('SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wstx-v2'),
      Cl.principal('SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt'),
      Cl.uint(100000000),
      Cl.uint(100000000),
      Cl.uint(1),
    ],
    network: STACKS_MAINNET,
    senderAddress: stxAddr,
  };
  const price = await fetchCallReadOnlyFunction(opts);

  lsgApi.setItemSync(
    BTC_PRICE_OBJ, JSON.stringify({ price, createDate: Date.now() })
  );
  return price;
};

const _fetchBurnHeight = async () => {
  try {
    const res = await fetch('https://api.hiro.so/extended');
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const obj = await res.json();
    const height = obj.chain_tip.burn_block_height;
    return height;
  } catch (error) {
    // Ignore to try another api
  }

  const res = await fetch('https://blockstream.info/api/blocks/tip/height');
  if (!res.ok) {
    throw new Error(res.statusText);
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
  const res = await fetch(`https://api.hiro.so/extended/v1/tx/{txId}`);
  if (res.status === 404) {
    throw new Error(NOT_FOUND_ERROR);
  }
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const obj = await res.json();
  return obj;
};

const getAuthData = () => {
  const userData = userSession.loadUserData();
  const sigObj = signECDSA(userData.appPrivateKey, TEST_STRING);
  const stxAddr = getUserStxAddr(userData);
  return { appPubKey: sigObj.publicKey, appSigStr: sigObj.signature, stxAddr };
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
    throw new Error(res.statusText);
  }

  const obj = await res.json();
  if (obj.status !== VALID) {
    throw new Error('Invalid reqBody');
  }

  return obj;
};

const fetchMe = async () => {

};

const fetchPreds = async (ids, game, createDate, doDescendingOrder) => {
  // 1. fetch per ids for an update i.e. verifiable to verified.
  // 2. fetch previous items.
  const authData = getAuthData();

  let reqData;
  if (Array.isArray(ids)) {
    reqData = { ids };
  } else if (
    isString(game) && isNumber(createDate) && [true, false].includes(doDescendingOrder)
  ) {
    reqData = { game, createDate, doDescendingOrder };
  } else {
    const msg = `Invalid args: ${ids}, ${game}, ${createDate}, ${doDescendingOrder}`;
    throw new Error(msg);
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
    throw new Error(res.statusText);
  }

  const obj = await res.json();
  if (obj.status !== VALID) {
    throw new Error('Invalid reqBody');
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
    throw new Error(res.statusText);
  }

  const obj = await res.json();
  if (obj.status !== VALID) {
    throw new Error('Invalid reqBody');
  }

  return obj;
};

const getUnsavedPreds = (game) => {
  const keys = lsgApi.listKeysSync();

  const preds = []
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
