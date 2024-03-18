import { useEffect, useState } from "react";
import { Config } from "../constants/apiBase";
import { useProvider } from "wagmi";
import { SDK } from "nf3-sdk";
import axios from "axios";

export const useSDK = () => {
  const [data, setData] = useState();
  const provider = useProvider();

  const getSDK = async () => {
    try {
      if (data === undefined) {
        const config = { ...Config, JsonRpcProvider: provider};
        config.contracts = JSON.parse(
          process.env.NEXT_PUBLIC_CONTRACTS.replace(";", "")
        );
        const frontendSDK = new SDK(config);
        const response = await axios.get('/api/get/getFts')
        const fts = response.data.data
        await frontendSDK.intializeFrontend(fts);

        setData(frontendSDK);

        return frontendSDK;
      } else {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSDK();
  }, [provider]);

  return {
    getSDK,
    data,
  };
};
