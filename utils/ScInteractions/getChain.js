export const getRequiredChain = (nfts, fts) => {
    var chain = -1;
    if (nfts.length > 0) {
        chain = nfts[0].nft_chain
    } else if (fts.length > 0) {
        chain = fts[0].ft_chain
    }
    return chain;
};