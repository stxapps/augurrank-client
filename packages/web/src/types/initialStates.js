export const initialMeEditorState = {
  username: null,
  avatar: null,
  bio: null,
  renderCode: null,
  didFthAvlbUsns: null, // null: not yet, true: fetched, false: error
  avlbUsns: null,
  didFthAvlbAvts: null, // null: not yet, true: fetched, false: error
  avlbAvts: null,
  nftOffset: null,
  nftLimit: null,
  nftTotal: null,
  fthgAvlbAvtsMore: null, // null: not fetching, true: fetching, false: error
  saving: null, // null: not saving, true: saving, false: error
};
