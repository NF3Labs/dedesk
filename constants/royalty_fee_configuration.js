// Case 0: No royalty & No Fees
// Case 1: Fees only for all swaps
// Case 2: Roaylty only for NFT <> ETH && NFT + NFT + .. <> ETH.  Other cases have no fees and royalties
// Case 3: Fees and Royalties. Roaylty only for NFT <> ETH && NFT + NFT + .. <> ETH.  Other cases have fees

export const FeeConfiguration = {
  case: 0,
  royalty_to: [""], // Royalty to address
  royalty_percentage: [0], // Royalty percentage. Current is 6%.
  fee_to: "", // Fee to address
  fee_tokenContract: "", // Fee token contract
  fee_amount: "0", // Fee amount
  fee_rate: 0, // Fee rate. Current is 3%. If this value is set, then fee should be bigger value between fixed fee_amount and listed token fee_rate percentage.
};

export const ETHContract = "0x0000000000000000000000000000000000000000";
