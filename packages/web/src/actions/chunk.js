

let _didFetch;
export const fetch = () => async (dispatch, getState) => {
  if (_didFetch) return;
  _didFetch = true;


  // Need appAddress, appPublicKey, signed message by app private key,
  //   stxAddr, 
};
