export const CHAIN = process.env.NEXT_PUBLIC_NETWORK === "ETH_MAINNET" ? 1 : 5;
export const POLYGON_CHAIN =
  process.env.NEXT_PUBLIC_NETWORK === "ETH_MAINNET" ? 137 : 80001;

export const CHAIN_NAME_BY_ID = {
  1: "Ethereum",
  5: "Goërli",
  137: "Polygon",
  80001: "Mumbai Testnet",
};
