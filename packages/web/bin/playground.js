import {
  getPublicKeyFromPrivate, publicKeyToBtcAddress, signECDSA,
} from '@stacks/encryption';
import { getAddressFromPrivateKey } from '@stacks/transactions';

const play = async () => {
  const appPrivKey = '';
  const appPubKey = getPublicKeyFromPrivate(appPrivKey);
  const appBtcAddr = publicKeyToBtcAddress(appPubKey);
  const appStxAddr = getAddressFromPrivateKey(appPrivKey, 'mainnet');
  console.log('appPubKey', appPubKey);
  console.log('appBtcAddr', appBtcAddr);
  console.log('appStxAddr', appStxAddr);

  const sigObj = signECDSA(appPrivKey, 'TEST_STRING');
  console.log('appPubKey', sigObj.publicKey);
  console.log('appSigStr', sigObj.signature);
};
play();
