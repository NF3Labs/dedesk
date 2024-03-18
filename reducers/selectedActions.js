export const initialSelectedActionsState = {
  p2p_nfts: [],
  p2p_fts: [],
  p2p_my_nfts: [],
  p2p_my_fts: [],
  p2p_trader: undefined,
  p2p_me: undefined,
};

export const selectedActions = (state, action) => {
  switch (action.type) {
    case "HANDLE_P2P_TRADER":
      return {
        ...state,
        p2p_trader: action.payload,
      };
    case "HANDLE_P2P_ME":
      return {
        ...state,
        p2p_me: action.payload,
      };
    case "HANDLE_P2P_NFT":
      return {
        ...state,
        p2p_nfts: action.payload,
      };
    case "HANDLE_P2P_FT":
      return {
        ...state,
        p2p_fts: action.payload,
      };
    case "HANDLE_P2P_MY_NFT":
      return {
        ...state,
        p2p_my_nfts: action.payload,
      };
    case "HANDLE_P2P_MY_FT":
      return {
        ...state,
        p2p_my_fts: action.payload,
      };
    case "RESET":
      return {
        ...state,
        p2p_trader: state.p2p_trader,
        p2p_me: undefined,
        p2p_nfts: [],
        p2p_fts: [],
        p2p_my_nfts: [],
        p2p_my_fts: [],
      };
    default:
      throw new Error();
  }
};
