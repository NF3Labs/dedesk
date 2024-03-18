import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Avatar,
  InputGroup,
  InputLeftElement,
  Input,
  TabList,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { Search } from "../Icons/Search";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NFT } from "./NFT";
import { getBeautifulAddress } from "../../utils/formatters";
import { SelectToken } from "./SelectToken";
import { AddButtons } from "./AddButtons";
import { useUserContext } from "../../contexts/User";
import { Verified } from "../Icons/Verified";
import { Flag } from "../Icons/Flag";
import { Logo } from "../Icons/Logo";
import { useAccount, useNetwork, useSwitchNetwork, useDisconnect } from "wagmi";
import { POLYGON_CHAIN } from "../../constants/chain";
import { CHAIN } from "../../constants/chain";
import { NF3Spinner } from "../Spinner/NF3Spinner";
import { useRouter } from "next/router";
import axios from "axios";

export const Step2Me = ({ callback }) => {
  const userContext = useUserContext();

  const { chain } = useNetwork();
  const { switchNetwork, chains } = useSwitchNetwork();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const surface = useColorModeValue("surface.light", "surface.dark");
  const border = useColorModeValue("border.light", "border.dark");
  const header = useColorModeValue("header.light", "header.dark");
  const title = useColorModeValue("title.light", "title.dark");
  const titleHover = useColorModeValue("titleHover.light", "titleHover.dark");
  const input = useColorModeValue("input.light", "input.dark");
  const realBg = useColorModeValue("bg.light", "bg.dark");
  const h = useColorModeValue("placeholder.light", "placeholder.dark");

  const [nftSearch, setNFTSearch] = useState("");
  const [nftSelect, setNFTSelect] = useState(0);
  const { address } = useAccount();

  const [tempTokens, setTempTokens] = useState([]);
  const [tokenHeaders, setTokenHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [tokens, setTokens] = useState([]);

  const getList = async (address, isEth) => {
    try {
      if (address === "") return;

      setIsLoading(true);
      const response = await axios.get("/api/get/getWalletNfts", {
        params: {
          address: address,
        },
      });

      const returnedData = response.data.data;
      let cleanedERCData = [];
      let cleanedHeaderData = [];

      returnedData?.collections.forEach((i) => {
        let tokensTemp = [];
        i.ownerships.forEach((x) => {
          let temp = { nft: x.nft, quantity: x.quantity };
          tokensTemp.push(temp);
        });
        cleanedERCData.push({
          type: i.type,
          nfts: tokensTemp,
          Amount: i.ownerships.length,
          name: i.name,
          total: i.token_count,
          whitelisted: i.is_whitelisted,
        });
        cleanedHeaderData.push({
          name: i.name,
          type: i.type,
        });
      });

      setTokenHeaders(
        [{ name: "Collections(All)", type: "all" }].concat(cleanedHeaderData)
      );
      setTempTokens(cleanedERCData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (
        error?.response?.status === 401 &&
        window.localStorage.getItem("CSRF")
      ) {
        router.push("/dashboard");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");
      }
    }
  };

  useEffect(() => {
    if (userContext?.selectedActionsState?.p2p_me) {
      getList(
        userContext?.selectedActionsState?.p2p_me.address,
        userContext?.selectedActionsState?.p2p_me.isEth
      );
    }
  }, [userContext?.selectedActionsState?.p2p_me]);

  useEffect(() => {
    if (tempTokens.length > 0 && tokenHeaders.length > 0) {
      if (nftSelect === 0) {
        let temp = [];
        tempTokens.forEach((i) => {
          let tempList = [];
          tempList =
            nftSearch === ""
              ? i.nfts
              : i.nfts.filter((item) =>
                  item.nft.name.toLowerCase().includes(nftSearch.toLowerCase())
                );
          tempList.forEach((j) => {
            temp.push({ ...j, ["is_whitelisted"]: i.whitelisted });
          });
        });

        setTokens(temp);
      } else {
        tempTokens
          .filter((i) => i.name === tokenHeaders[nftSelect].name)
          .forEach((j) => {
            setTokens(
              nftSearch === ""
                ? j.nfts.map((item) => ({
                    ...item,
                    ["is_whitelisted"]: j.whitelisted,
                  }))
                : j.nfts
                    .filter((item) =>
                      item.nft.name
                        .toLowerCase()
                        .includes(nftSearch.toLowerCase())
                    )
                    .map((item) => ({
                      ...item,
                      ["is_whitelisted"]: j.whitelisted,
                    }))
            );
          });
      }
    } else {
      setTokens([]);
    }
  }, [nftSelect, nftSearch, tempTokens, tokenHeaders]);

  const emptyData = () => {
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_NFT",
      payload: [],
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_FT",
      payload: [],
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_MY_NFT",
      payload: [],
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_MY_FT",
      payload: [],
    });
  };

  const handleContinue = () => {
    if (
      userContext?.selectedActionsState?.p2p_my_nfts.length === 0 &&
      userContext?.selectedActionsState?.p2p_my_fts.length === 0
    )
      return;

    callback(3);
  };

  const handleBack = () => {
    callback(-1);
  };

  const handlePrev = () => {
    callback(1);
  };

  const handleTabsChange = (index) => {
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_ME",
      payload: {
        ...userContext?.selectedActionsState?.p2p_me,
        ["isEth"]: index,
      },
    });

    emptyData();

    setNFTSelect(0);
  };

  const handleNft = (e) => {
    setNFTSearch(e.target.value);
  };

  const handleFTRemove = (index) => {
    const newData = userContext?.selectedActionsState?.p2p_my_fts.filter(
      (i, idx) => idx !== index
    );
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_MY_FT",
      payload: newData,
    });
  };

  const handleNFTRemove = (index) => {
    const newData = userContext?.selectedActionsState?.p2p_my_nfts.filter(
      (i, idx) => idx !== index
    );
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_MY_NFT",
      payload: newData,
    });
  };

  return (
    <>
      <Box w="full" h="full" display={"flex"} justifyContent={"center"}>
        <Grid
          width="full"
          maxWidth={"1250px"}
          pt="110px"
          templateColumns="repeat(7, 1fr)"
          height="full"
          overflow="hidden"
        >
          <GridItem
            colSpan={2}
            height="full"
            flex="1 1 0%"
            overflow="hidden"
            display={"flex"}
            flexDirection={"column"}
          >
            {/* <Tabs variant="unstyled" isFitted>
              <TabList
                bg={bg}
                borderRadius="12px"
              >
                <Tab
                  py="3"
                  borderLeftRadius="8px"
                  borderRightRadius="8px"
                  fontSize="14px"
                  onClick={() => {
                    handleTabsChange(0);
                  }}
                  bg={
                    userContext?.selectedActionsState?.p2p_me?.isEth === 0
                      ? "secondary"
                      : ""
                  }
                  color={
                    userContext?.selectedActionsState?.p2p_me?.isEth === 0 &&
                    "primary"
                  }
                  isDisabled={chains.findIndex((i) => i.id === chain.id) !== 0}
                >
                  Ethereum
                </Tab>
              </TabList>
            </Tabs>
            <Box
              mt="12px"
              borderRadius="16px"
              px="24px"
              py="24px"
              backgroundColor={bg}
            >
              <Flex alignItems="center">
                <Verified />
                <Text fontSize="12px">&nbsp;: Verified Collection</Text>
              </Flex>
              <Flex mt="5px" alignItems="center">
                <Flag />
                <Text ml="2px" fontSize="12px">
                  &nbsp;: Flagged Asset
                </Text>
              </Flex>
            </Box> */}
            <Box
              // mt="12px"
              borderRadius="24px"
              px="24px"
              py="24px"
              backgroundColor={bg}
              overflow={"hidden"}
              display={"flex"}
              flexDirection={"column"}
            >
              <Text fontSize="14px" color={title} fontWeight="bold">
                Your Wallet
              </Text>
              <Box py="12px">
                <Flex
                  px="10px"
                  py="12px"
                  backgroundColor={surface}
                  borderRadius="8px"
                  border={`1px solid`}
                  borderColor={border}
                >
                  <Avatar name="" width={8} height={8} />
                  <Box
                    flex="1"
                    ml="12px"
                    w="5%"
                    display={"flex"}
                    alignItems={"center"}
                    gap="4px"
                    alignSelf="center"
                  >
                    <Text
                      fontSize="14px"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {getBeautifulAddress(address)}
                    </Text>

                    <Text
                      fontWeight="bold"
                      fontSize="14px"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {"(You)"}
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Box
                pt="4"
                overflowY={"scroll"}
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "3px",
                    borderRadius: "2px",
                    backgroundColor: "transparent",
                    display: "none",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: input,
                    borderRadius: "2px",
                  },
                }}
              >
                <Box flex="1 1 0%" overflow={"hidden"}>
                  <Text fontWeight="bold" fontSize="14px">
                    Tokens (
                    {userContext?.selectedActionsState?.p2p_my_fts.length})
                  </Text>
                  {userContext?.selectedActionsState?.p2p_my_fts.length ===
                  0 ? (
                    <Text fontWeight="bold" fontSize="14px" height="32px">
                      -
                    </Text>
                  ) : (
                    <SimpleGrid
                      minChildWidth="38px"
                      overflow="hidden"
                      spacing="12px"
                      pt="5"
                    >
                      {userContext?.selectedActionsState?.p2p_my_fts.map(
                        (item, index) => {
                          return (
                            <SelectToken
                              key={index}
                              isEdit={true}
                              m="auto"
                              type="ft"
                              handleRemove={(i) => {
                                handleFTRemove(i);
                              }}
                              index={index}
                              tokenId={item.symbol}
                              tokenName={item.amount}
                              tokenLogo={item.logo}
                              tokenImage={""}
                            />
                          );
                        }
                      )}
                      <Box height="100%" />
                      <Box height="100%" />
                    </SimpleGrid>
                  )}
                </Box>
                <Box pt="20px" flex="1 1 0%">
                  <Text fontWeight="bold" fontSize="14px">
                    NFTs (
                    {userContext?.selectedActionsState?.p2p_my_nfts.length})
                  </Text>
                  {userContext?.selectedActionsState?.p2p_my_nfts.length ===
                  0 ? (
                    <Text fontWeight="bold" fontSize="14px" height="32px">
                      -
                    </Text>
                  ) : (
                    <SimpleGrid
                      minChildWidth="80px"
                      overflow="hidden"
                      spacingX="4px"
                      spacingY="12px"
                      pt="5"
                      pb="5"
                    >
                      {userContext?.selectedActionsState?.p2p_my_nfts.map(
                        (item, index) => {
                          return (
                            <SelectToken
                              key={index}
                              index={index}
                              isEdit={true}
                              type="nft"
                              handleRemove={(i) => {
                                handleNFTRemove(i);
                              }}
                              tokenId={item?.nft?.token}
                              tokenName={item?.nft?.collection_name}
                              tokenImage={item.image_url}
                              chainId={item?.nft?.chain}
                            />
                          );
                        }
                      )}
                      <Box height="100%" />
                      <Box height="100%" />
                      <Box height="100%" />
                    </SimpleGrid>
                  )}
                </Box>
              </Box>
              <Box
                mt="12px"
                bg={
                  userContext?.selectedActionsState?.p2p_my_nfts.length === 0 &&
                  userContext?.selectedActionsState?.p2p_my_fts.length === 0
                    ? "pinkerHover"
                    : "pinker"
                }
                _hover={{ bg: "pinkerHover" }}
                color={
                  userContext?.selectedActionsState?.p2p_my_nfts.length === 0 &&
                  userContext?.selectedActionsState?.p2p_my_fts.length === 0
                    ? "whiter"
                    : "whiter"
                }
                cursor={
                  userContext?.selectedActionsState?.p2p_my_nfts.length === 0 &&
                  userContext?.selectedActionsState?.p2p_my_fts.length === 0
                    ? "not-allowed"
                    : "pointer"
                }
                textAlign="center"
                w="full"
                py="14px"
                borderRadius="8px"
                fontSize="14px"
                fontWeight="bold"
                onClick={handleContinue}
              >
                CONTINUE
              </Box>
            </Box>
            <Flex>
              <Text
                as="u"
                fontSize="14px"
                cursor="pointer"
                color={"secondary"}
                _hover={{ color: titleHover }}
                m="auto"
                mt="20px"
                mb="40px"
                onClick={handlePrev}
              >
                Back
              </Text>
            </Flex>
          </GridItem>
          <GridItem
            colSpan={5}
            height="full"
            flex="1 1 0%"
            overflow="hidden"
            display={"flex"}
            flexDirection={"column"}
            px="40px"
          >
            <Text fontSize="20px" fontWeight="bold">
              {"Select NFTs from your wallet"}
            </Text>
            <Grid pt="10px" gridTemplateColumns="repeat(4, 1fr)" gap="12px">
              <GridItem colSpan={2}>
                <InputGroup flex="1" mr="10px">
                  <InputLeftElement color={title} pl="1.5" pointerEvents="none">
                    <Search />
                  </InputLeftElement>
                  <Input
                    type="text"
                    color={input}
                    bg={bg}
                    fontSize="14px"
                    border="none"
                    placeholder="Search collections or assets"
                    _focus={{ boxShadow: "none", border: "none" }}
                    _placeholder={{ color: h }}
                    onChange={handleNft}
                    value={nftSearch}
                  />
                </InputGroup>
              </GridItem>
              <Menu>
                <MenuButton
                  bg={bg}
                  fontSize="14px"
                  as={Button}
                  _active={{ bg: bg }}
                  _hover={{ bg: bg }}
                  rightIcon={<ChevronDownIcon />}
                >
                  {tokenHeaders.length > 0
                    ? tokenHeaders[nftSelect].name
                    : "Collections (All)"}
                </MenuButton>
                <MenuList bg={realBg}>
                  {tokenHeaders.map((item, idx) => {
                    return (
                      <MenuItem
                        bg={realBg}
                        key={idx}
                        onClick={() => {
                          setNFTSelect(idx);
                        }}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
              <AddButtons
                address={userContext?.selectedActionsState?.p2p_me?.address}
                type={true}
              />
            </Grid>
            <Box overflow="hidden" display={"flex"} justifyContent={"center"}>
              {isLoading ? (
                <Flex>
                  <Box m="auto" mt="100px">
                    <NF3Spinner />
                  </Box>
                </Flex>
              ) : tokens?.length === 0 && !isLoading ? (
                <Flex mt="200px" justify="center">
                  <Box textAlign={"center"}>No Items Found</Box>
                </Flex>
              ) : (
                <Box
                  flex="1 1 0%"
                  overflowY="hidden"
                  display={"flex"}
                  pt="16px"
                >
                  <Box
                    flex="1 1 0%"
                    overflowY={"scroll"}
                    overflowX="hidden"
                    sx={{
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: input,
                        borderRadius: "2px",
                      },
                    }}
                  >
                    <Grid
                      height={"fit-content"}
                      pb="16px"
                      // flex="1 1 0%"
                      // overflowY="auto"
                      // overflowX="hidden"
                      templateColumns="repeat(4, 1fr)"
                      gap="12px"
                      sx={{
                        "&::-webkit-scrollbar": {
                          width: "3px",
                          borderRadius: "2px",
                          backgroundColor: "transparent",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: input,
                          borderRadius: "2px",
                        },
                      }}
                    >
                      {isLoading ? (
                        <Flex>
                          <Box m="auto">
                            <NF3Spinner />
                          </Box>
                        </Flex>
                      ) : (
                        tokens.map((item, index) => {
                          return (
                            <GridItem key={index}>
                              <NFT
                                type={true}
                                item={item}
                                isEdit={true}
                                is1155={true}
                              />
                            </GridItem>
                          );
                        })
                      )}
                    </Grid>
                  </Box>
                </Box>
              )}
            </Box>
          </GridItem>
        </Grid>
        {/* <Box display={"flex"} justifyContent={"center"} mt="30px" mb='20px'>
          <Logo />
          <Text fontSize="12px" fontWeight="400" px="10px" py="15px">
            Copyright DeDesk {(new Date()).getFullYear()}, All rights reserved
          </Text>
        </Box> */}
      </Box>
    </>
  );
};
