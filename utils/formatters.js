export const cleanImageUrl = (imageUrl) => {
  if (imageUrl?.includes("ipfs://ipfs/") && !imageUrl?.includes("https://")) {
    return (
      imageUrl.replace(
        "ipfs://ipfs/",
        "https://ipfs.io/ipfs/"
      ) + `?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`
    );
  }
  if (imageUrl?.includes("ipfs://") && !imageUrl?.includes("https://")) {
    return (
      imageUrl.replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      ) + `?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`
    );
  }
  return imageUrl;
};

export const getTimeInSecondsFromTimeString = (timeString) => {
  const date = new Date(timeString);
  const seconds = date.getTime() / 1000;
  return seconds;
};

export const getTimeSlash = (timeString) => {
  const date = new Date(timeString);
  return date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear().toString().slice(2,4);
};

export const getBeautifulAddress = (address) => {
  return address === undefined ? '' : address.slice(0, 6) + "..." + address.slice(address.length - 6, address.length + 6);
}

export function sortListingResponse(responseBody) {
  if (!responseBody) return;
  responseBody.nfts = responseBody?.nfts?.sort((i, j) => i.id - j.id);
  responseBody.fts = responseBody?.fts?.sort((i, j) => i.id - j.id);

  const sortedSwaps = responseBody?.swaps?.sort(
    (i, j) => i.index_in_listing - j.index_in_listing
  );
  const swaps = [];
  for (let swap of sortedSwaps) {
    swap.nfts = swap.nfts?.sort((i, j) => i.id - j.id);
    swap.fts = swap.fts?.sort((i, j) => i.id - j.id);
    swaps.push(swap);
  }
  responseBody.swaps = swaps;
  const reservations = [];
  for (let reservation of responseBody.reservations) {
    reservation.deposit_fts = reservation.deposit_fts?.sort(
      (i, j) => i.id - j.id
    );
    reservation.deposit_nfts = reservation.deposit_nfts?.sort(
      (i, j) => i.id - j.id
    );
    reservation.remaining_fts = reservation.remaining_fts?.sort(
      (i, j) => i.id - j.id
    );
    reservation.remaining_nfts = reservation.remaining_nfts?.sort(
      (i, j) => i.id - j.id
    );

    reservations.push(reservation);
  }
  responseBody.reservations = reservations;

  return responseBody;
}

