import { createContext, useContext } from "react";
import { useToken } from "../hooks/useToken";

const TokenContext = createContext();

export const TokenWrapper = ({ children }) => {
  const {
    txnHash,
    setTxnHash,
  } = useToken();

  const settings = {
    txnHash,
    setTxnHash,
  };

  return (
    <TokenContext.Provider value={settings}>{children}</TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  return useContext(TokenContext);
};
