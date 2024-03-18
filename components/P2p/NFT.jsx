import {
  Box,
  Flex,
  Text,
  Skeleton,
  Image,
  AspectRatio,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckNFT } from "../Icons/CheckNFT";
import { CHAIN } from "../../constants/chain";
import { useUserContext } from "../../contexts/User";
import { Verified } from "../Icons/Verified";
import { useLoadImage } from "../../hooks/useLoadImage";

import { FlagP2P } from "../Icons/FlagP2P";
import { PolyP2P } from "../Icons/PolyP2P";
import { EthP2P } from "../Icons/EthP2P";
import { Minus } from "../Icons/Minus";
import { CheckIcon } from "@chakra-ui/icons";

export const NFT = ({ item, width, isEdit, type, is1155 = false }) => {
  const bg = useColorModeValue("surface.light", "surface.dark");
  const userContext = useUserContext();
  const selectedLength = !item
    ? item
    : item.nft.type !== "ERC721"
    ? !type
      ? userContext?.selectedActionsState?.p2p_nfts.filter(
          (i) =>
            i.nft.contract.toLowerCase() === item.nft.contract?.toLowerCase() &&
            i.nft.token === item.nft.token
        )
      : userContext?.selectedActionsState?.p2p_my_nfts.filter(
          (i) =>
            i.nft.contract.toLowerCase() === item.nft.contract?.toLowerCase() &&
            i.nft.token === item.nft.token
        )
    : !type
    ? userContext?.selectedActionsState?.p2p_nfts.find(
        (i) =>
          i.nft.contract.toLowerCase() === item.nft.contract?.toLowerCase() &&
          i.nft.token === item.nft.token
      )
    : userContext?.selectedActionsState?.p2p_my_nfts.find(
        (i) =>
          i.nft.contract.toLowerCase() === item.nft.contract?.toLowerCase() &&
          i.nft.token === item.nft.token
      );

  const handleSelectNFT = (item) => {
    let data = type
      ? userContext?.selectedActionsState?.p2p_my_nfts
      : userContext?.selectedActionsState?.p2p_nfts;
    const fts = type
      ? userContext?.selectedActionsState?.p2p_my_fts
      : userContext?.selectedActionsState?.p2p_fts;
    const isIn = data.filter((i) => {
      return (
        i.nft.contract === item.nft.contract &&
        i.nft.token === item.nft.token &&
        i.nft.name === item.nft.name
      );
    });
    if (isIn.length > 0) {
      const newData = data.filter(
        (i) =>
          i.nft.contract !== item.nft.contract ||
          i.nft.token !== item.nft.token ||
          i.nft.name !== item.nft.name
      );
      userContext?.dispatchSelectedActions({
        type: type ? "HANDLE_P2P_MY_NFT" : "HANDLE_P2P_NFT",
        payload: newData,
      });
      return;
    }
    if (data.length + 1 + fts.length > 16) {
      infoToast("Max Reached", "16 is the maximum able to be listed.");
      return;
    }
    data.push({
      ...item,
      ["image_url"]: item.nft.image_url,
    });

    userContext?.dispatchSelectedActions({
      type: type ? "HANDLE_P2P_MY_NFT" : "HANDLE_P2P_NFT",
      payload: data,
    });
  };

  const handleQuantityChange = (item, quantity, length) => {
    let data = type
      ? userContext?.selectedActionsState?.p2p_my_nfts
      : userContext?.selectedActionsState?.p2p_nfts;

    if (quantity === length) {
      const newData = data.filter(
        (i) =>
          i.nft.contract !== item.nft.contract ||
          i.nft.token !== item.nft.token ||
          i.nft.name !== item.nft.name
      );
      userContext?.dispatchSelectedActions({
        type: type ? "HANDLE_P2P_MY_NFT" : "HANDLE_P2P_NFT",
        payload: newData,
      });
      return;
    }
    let isIn = data.filter((i) => {
      return (
        i.nft.contract === item.nft.contract &&
        i.nft.token === item.nft.token &&
        i.nft.name === item.nft.name
      );
    });
    if (isIn.length > length) {
      const newData = data.filter(
        (i) =>
          i.nft.contract !== item.nft.contract ||
          i.nft.token !== item.nft.token ||
          i.nft.name !== item.nft.name
      );
      newData.push(isIn[0]);
      userContext?.dispatchSelectedActions({
        type: type ? "HANDLE_P2P_MY_NFT" : "HANDLE_P2P_NFT",
        payload: newData,
      });
    } else {
      data.push({
        ...item,
        ["image_url"]: item.nft.image_url,
      });

      userContext?.dispatchSelectedActions({
        type: type ? "HANDLE_P2P_MY_NFT" : "HANDLE_P2P_NFT",
        payload: data,
      });
    }
  };

  const handleRemoveNft = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let data = type
      ? userContext?.selectedActionsState?.p2p_my_nfts
      : userContext?.selectedActionsState?.p2p_nfts;
    const multi = data.filter(
      (i) =>
        i.nft.contract === item.nft.contract && i.nft.token === item.nft.token
    );
    let newData = data.filter(
      (i) =>
        i.nft.contract !== item.nft.contract || i.nft.token !== item.nft.token
    );
    if (multi?.length > 1) {
      for (let i = 0; i < multi?.length - 1; i++) newData.push(multi?.[0]);
    }
    userContext?.dispatchSelectedActions({
      type: type ? "HANDLE_P2P_MY_NFT" : "HANDLE_P2P_NFT",
      payload: newData,
    });
  };

  const { isLoaded } = useLoadImage(item ? item.nft.image_url : "");

  return (
    <>
      {item.nft.type === "ERC721" ? (
        <Flex
          cursor={isEdit ? "pointer" : ""}
          borderColor={isEdit && selectedLength ? "secondary" : bg}
          backgroundColor={bg}
          borderRadius={"12px"}
          onClick={() => {
            if (!isEdit) return;

            if (item.nft.type === "ERC721") {
              handleSelectNFT(item);
            } else {
              handleQuantityChange(item, item.quantity);
            }
          }}
        >
          <Box
            m="auto"
            py="8px"
            px="8px"
            minW={width}
            w="full"
            position="relative"
          >
            <Box>
              <Skeleton isLoaded={isLoaded} w="full" borderRadius="8px">
                <AspectRatio ratio={1}>
                  <Box
                    bgImage={item.nft.image_url}
                    backgroundPosition={"center"}
                    backgroundRepeat={"no-repeat"}
                    backgroundSize={"cover"}
                    borderRadius="8px"
                    style={{ filter: "blur(1px)" }}
                  >
                    <Image
                      src={item.nft.image_url}
                      alt=""
                      onLoad={(event) => {
                        event.target.parentElement.style.filter = "none";
                        event.target.style.display = "block";
                      }}
                      loading="lazy"
                      style={{
                        display: "none",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </AspectRatio>
              </Skeleton>
            </Box>
            <Flex mt="12px" alignItems="center">
              <Box fontSize="12px" fontWeight={"bold"} textAlign="center">
                {item ? item.nft.collection_name + " #" + item.nft.token : ""}
              </Box>
            </Flex>
            <Flex alignItems="center">
              <Box fontSize="12px" fontWeight={"semibold"} textAlign="center">
                {item ? item.nft.collection_name : ""}
              </Box>
              {item &&
                (!isEdit ? item.nft.is_whitelisted : item.is_whitelisted) && (
                  <>
                    &nbsp;
                    <Verified />
                  </>
                )}
            </Flex>
            {isEdit && selectedLength && (
              <Box position="absolute" top={"16px"} right={"16px"}>
                <Flex
                  m="auto"
                  borderRadius="4px"
                  bg={"grayer"}
                  w="16px"
                  h="16px"
                  p="2px"
                >
                  <CheckIcon
                    m="auto"
                    color={"whiter"}
                    width="12px"
                    height="12px"
                  />
                </Flex>
              </Box>
            )}
            <Box
              position="absolute"
              top={"16px"}
              left={"16px"}
              w="full"
              h="full"
            >
              {item && item.nft.chain === CHAIN.toString() ? (
                <EthP2P />
              ) : (
                <PolyP2P />
              )}
              <Box h="3px" />
              {item && item.nft.is_flagged && <FlagP2P />}
            </Box>
          </Box>
        </Flex>
      ) : (
        <Flex
          cursor={isEdit ? "pointer" : ""}
          border={`2px solid`}
          borderColor={isEdit && selectedLength.length > 0 ? "secondary" : bg}
          borderRadius="8px"
          onClick={() => {
            if (!isEdit) return;

            if (item.nft.type === "ERC721") {
              handleSelectNFT(item);
            } else {
              handleQuantityChange(item, item.quantity, selectedLength.length);
            }
          }}
        >
          <Box
            m="auto"
            py="10px"
            px="14px"
            minW={width}
            w="full"
            position="relative"
          >
            {is1155 && (
              <Box position="absolute" bottom="20px" right="20px">
                <Text color="secondary" fontSize={"10px"} textAlign="right">
                  max count: {item.quantity}
                </Text>
                <Text color="secondary" fontSize={"10px"} textAlign="right">
                  select: {selectedLength.length}
                </Text>
              </Box>
            )}
            <Box>
              <Skeleton isLoaded={isLoaded} w="full" borderRadius="8px">
                <AspectRatio ratio={1}>
                  <Box
                    bgImage={item.nft.image_url}
                    backgroundPosition={"center"}
                    backgroundRepeat={"no-repeat"}
                    backgroundSize={"cover"}
                    borderRadius="8px"
                    style={{ filter: "blur(1px)" }}
                  >
                    <Image
                      src={item.nft.image_url}
                      alt=""
                      onLoad={(event) => {
                        event.target.parentElement.style.filter = "none";
                        event.target.style.display = "block";
                      }}
                      loading="lazy"
                      style={{
                        display: "none",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </AspectRatio>
              </Skeleton>
            </Box>
            <Flex mt="5px" alignItems="center">
              <Box fontSize="10px" textAlign="center">
                {item ? item.nft.collection_name + " " + item.nft.token : ""}
              </Box>
            </Flex>
            <Flex mt="5px" alignItems="center">
              <Box fontSize="10px" textAlign="center">
                {item ? item.nft.collection_name : ""}
              </Box>
              {item &&
                (!isEdit ? item.nft.is_whitelisted : item.is_whitelisted) && (
                  <>
                    &nbsp;
                    <Verified />
                  </>
                )}
            </Flex>
            {isEdit && selectedLength.length !== 0 && (
              <Box position="absolute" top={"16px"} right={"16px"}>
                <CheckNFT />
              </Box>
            )}
            {isEdit && selectedLength.length !== 0 && (
              <Box
                position="absolute"
                top={"11px"}
                left={"16px"}
                zIndex={2}
                borderRadius="full"
                onClick={(e) => handleRemoveNft(e)}
              >
                <Minus width="30px" height="30px" />
              </Box>
            )}
            <Box
              position="absolute"
              top={"16px"}
              left={"16px"}
              w="full"
              h="full"
            >
              {item && item.nft.chain === CHAIN.toString() ? (
                <EthP2P />
              ) : (
                <PolyP2P />
              )}
              <Box h="3px" />
              {item && item.nft.is_flagged && <FlagP2P />}
            </Box>
          </Box>
        </Flex>
      )}
    </>
  );
};
