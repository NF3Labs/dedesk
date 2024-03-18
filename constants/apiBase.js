import { Network } from "nf3-sdk";

export const Config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  network: Network[process.env.NEXT_PUBLIC_NETWORK],
  contracts: process.env.NEXT_PUBLIC_CONTRACTS,
  JsonRpcProvider: undefined,
};


export const ProviderConfig = {
  providerURL: process.env.NEXT_PUBLIC_PROVIDER_URL,
  providerKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
}