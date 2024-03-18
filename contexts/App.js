import { useEffect, createContext, useContext, useState } from "react";
import { useSDK } from "../hooks/useSDK";
import axios from "axios";

const AppContext = createContext();

export const AppWrapper = ({ children }) => {
  const {
    data: sdk,
    getSDK
  } = useSDK();

  const [tokenList, setTokenList] = useState();
  const [erc20AddressToDecimal, setErc20AddressToDecimal] = useState();
  const [clientSide, setClientSide] = useState(false);

  const getTokenList = async () => {
    const response = await axios.get('/api/get/getFts')
    const fts = response.data.data

      const _data = {
        1: [],
        5: [],
        137: [],
        80001: [],
      };

      const _erc20AddressToDecimal = {
        1: {},
        5: {},
        137: {},
        80001: {},
      };

      for (let i of fts) {
        if (i.chain === "1") _data[1].push(i);
        else if (i.chain === "5") _data[5].push(i);
        else if (i.chain === "137") _data[137].push(i);
        else if (i.chain === "80001") _data[80001].push(i);
      }

      _data[1].forEach((i) => {
        _erc20AddressToDecimal[1][i?.contract] = i?.decimals;
      });
      _data[5].forEach((i) => {
        _erc20AddressToDecimal[5][i?.contract] = i?.decimals;
      });
      _data[137].forEach((i) => {
        _erc20AddressToDecimal[137][i?.contract] = i?.decimals;
      });
      _data[80001].forEach((i) => {
        _erc20AddressToDecimal[80001][i?.contract] = i?.decimals;
      });

      setTokenList(_data);
      setErc20AddressToDecimal(_erc20AddressToDecimal);
  }

  const getCollection = async (contractAddress) => {
    const response = await axios.get('/api/get/getCollections')
    const collections = response.data.data

    const collection = collections?.collections?.filter(
      (i) => i.contract.toLowerCase() === contractAddress?.toLowerCase()
    );

    return collection;
  };

  const getToken = (chainId, contractAddress) => {
    const token = tokenList?.[chainId]?.filter(
      (i) => i?.contract?.toLowerCase() === contractAddress?.toLowerCase()
    );

    return token;
  };

  const settings = {
    erc20AddressToDecimal,
    getToken,
    getCollection,
    tokenList,
    sdk,
    getSDK
  };

  useEffect(() => {
    if (sdk) {
      getTokenList();
    }
  }, [sdk])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientSide(true);
    }
  }, []);

  if (!clientSide) {
    return <></>;
  }

  return <AppContext.Provider value={settings}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
