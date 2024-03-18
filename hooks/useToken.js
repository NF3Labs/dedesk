import { useState } from "react";

export const useToken = () => {
  const [txnHash, setTxnHash] = useState(undefined);

  return {
    txnHash,
    setTxnHash
  };
};
