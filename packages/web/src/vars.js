const btcPrice = {
  didFetch: false,
  timeId: null,
};

const burnHeight = {
  didFetch: false,
  timeId: null,
};

const gameBtc = {
  didFetch: false,
};

const me = {
  didFetch: false,
};

const agreeTerms = {
  pred: null,
};

const refreshPreds = {
  isRunning: false,
  timeId: null,
  seq: 0,
};

const vars = { btcPrice, burnHeight, gameBtc, me, agreeTerms, refreshPreds };

export default vars;
