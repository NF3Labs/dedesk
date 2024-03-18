import { Config, ProviderConfig } from "../constants/apiBase";
import { SDK } from "nf3-sdk";
import { ethers } from 'ethers'

let backendSDK;

export const getBackendSDK = async () => {
  try {
    if (!backendSDK) {
      const config = { ...Config };
      config.contracts = JSON.parse(
        process.env.NEXT_PUBLIC_CONTRACTS.replace(";", "")
      );
      const url = ProviderConfig.providerURL + ProviderConfig.providerKey
      const provider = new ethers.providers.JsonRpcProvider(url)

      backendSDK = new SDK({ ...config, JsonRpcProvider: provider });
      await backendSDK.initializeBackend();
    }
    
    return backendSDK;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to initialize Backend SDK");
  }
};