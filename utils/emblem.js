import { useAccount } from "wagmi";

export const useEmblemContractTemplate = () => {
  const { address } = useAccount();

  return {
    // contractTemplate: {
    //   fromAddress: address,
    //   toAddress: address,
    //   chainId: 1,
    //   experimental: true,
    //   targetContract: {
    //     1: "0x345eF9d7E75aEEb979053AA41BB6330683353B7b",
    //     name: "Bitcoin DeGods",
    //     description:
    //       "Bitcoin DeGods is a collection of 535 Bitcoin Ordinals inscribed in the 77236 to 77770 range. This collection is curated by Emblem Vault. ",
    //   },
    //   targetAsset: {
    //     image: "https://emblem.finance/btcdegods.jpg",
    //     name: "Loading...",
    //     xtra: "anything else you need here",
    //   },
    // },
    contractTemplate: {
      fromAddress: address,
      toAddress: address,
      chainId: 1,
      experimental: true,
      targetContract: {
        1: "0xEAD67175CDb9CBDeA5bDDC36015e52f4A954E3fD",
        name: "BitcoinOrdinals",
      },
      targetAsset: {
        name: "Loading...",
        image: "https://emblem.finance/ordinals.png",
        xtra: "anything you want to store in vault metadata",
      },
    },
  };
};
