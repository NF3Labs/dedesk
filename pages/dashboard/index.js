import {
  Stack,
  Flex,
  Spacer,
  Box,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Button,
  Text,
  Divider,
  TabPanels,
  TabPanel,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { P2PItem } from "../../components/P2p/P2PItem";
import { useRouter } from "next/router";
import { P2PStatus } from "../../components/Modals/P2PStatus";
import { useDisclosure } from "@chakra-ui/react";
import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useDisconnect,
  useSigner,
} from "wagmi";
import { NF3Spinner } from "../../components/Spinner/NF3Spinner";
import { sortListingResponse } from "../../utils/formatters";
import { errorToast, infoToast } from "./../_app";
import { getRequiredChain } from "../../utils/ScInteractions/getChain";
import { CHAIN } from "../../constants/chain";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SwapCompleted } from "../../components/Modals/SwapCompleted";
import { Approve } from "../../components/Modals/Approve";
import { useAppContext } from "../../contexts/App";
import axios from "axios";
import { ethers, constants } from "ethers";
import {
  FeeConfiguration,
  optional,
} from "../../constants/royalty_fee_configuration";
import Image from "next/image";
import VaultDashboard from "../../components/Vault/VaultDashboard";
import { ENABLE_BTC } from "../../constants/emblem";

export default function ActiveOptions() {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const hoverBg = useColorModeValue("content.dark", "lightBg.dark");
  const border = useColorModeValue("border.light", "border.dark");
  const realBg = useColorModeValue("bg.light", "bg.dark");
  const surface = useColorModeValue("surface.light", "surface.dark");
  const input = useColorModeValue("input.light", "input.dark");

  const appContext = useAppContext();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSwapApprove,
    onOpen: onSwapApproveOpen,
    onClose: onSwapApproveClose,
  } = useDisclosure();
  const {
    isOpen: isSwapOpen,
    onOpen: onSwapOpen,
    onClose: onSwapClose,
  } = useDisclosure();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: signer } = useSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAccept, setIsProcessingAccept] = useState(false);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [list, setList] = useState([]);
  const [listError, setListError] = useState(false);
  const [trades, setTrades] = useState([]);
  const [modalData, setModalData] = useState(undefined);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [sellerFee, setSellerFee] = useState({
    token: constants.AddressZero,
    amount: 0,
    to: constants.AddressZero,
  });
  const [buyerFee, setBuyerFee] = useState({
    token: constants.AddressZero,
    amount: 0,
    to: constants.AddressZero,
  });
  const [royalty, setRoyalty] = useState({ to: [], percentage: [] });

  const { chain } = useNetwork();
  const { switchNetwork, chains } = useSwitchNetwork({
    onError: () => {
      errorToast(
        "Failed to switch networks !",
        "To use NF3 on Polygon, switch the newtork in your wallet's setting"
      );
    },
  });

  const [transactionHash, setTH] = useState({ address: "", hash: "" });

  const filterList = [
    { name: "Goerli", value: 0 },
    { name: "Mumbai", value: 1 },
  ];

  const [user, setUser] = useState(
    localStorage.getItem("CSRF") && JSON.parse(localStorage.getItem("CSRF"))
  );

  useEffect(() => {
    if (router && router?.query?.walletAddress !== address) {
      const newUser =
        localStorage.getItem("CSRF") &&
        JSON.parse(localStorage.getItem("CSRF"));

      if (newUser?.access_token !== user?.access_token) {
        setUser(newUser);
        router.push(`/`);
      }
    }
  });

  useEffect(() => {
    setListError(false);
    if (!address) return;

    if (tabIndex === 0) {
      getList();
    } else if (tabIndex === 1) {
      getCompleted();
    } else if (tabIndex === 2) {
      getArchived();
    }
  }, [tabIndex, address, chain]);

  const getList = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("/api/get/getReceivedP2P", {
        params: {
          address: address,
        },
      });
      const _receivedResponse = response.data.data;
      const res = await axios.get("/api/get/getCreatedP2P", {
        params: {
          address: address,
        },
      });
      const _createdResponse = res.data.data;

      if (
        _createdResponse?.p2ps === undefined ||
        _receivedResponse?.p2ps === undefined
      ) {
        setListError(true);
        setList([]);
        setTrades([]);
        return;
      }

      const data = [];

      _receivedResponse.p2ps
        .filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .forEach((item) => {
          const temp = {};

          temp.leftFT = item.fts;
          temp.leftNFT = item.nfts;

          item.swaps.forEach((swap) => {
            temp.rightFT = swap.fts;
            temp.rightNFT = swap.nfts;
          });

          temp.leftOwner = item.created_by;
          temp.rightOwner = {
            image: item.targetted_to.image,
            name: "You",
            address: item.targetted_to.address,
            isEth:
              temp.leftNFT.length > 0
                ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                : true,
          };
          temp.duration = item.duration;
          temp.end_time = item.end_time;
          temp.id = item.id;
          temp.is_sent = false;
          temp.is_tab1 = true;

          data.push(temp);
        });

      _createdResponse.p2ps
        .filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .forEach((item) => {
          const temp = {};

          temp.rightFT = item.fts;
          temp.rightNFT = item.nfts;

          item.swaps.forEach((swap) => {
            temp.leftFT = swap.fts;
            temp.leftNFT = swap.nfts;
          });

          temp.leftOwner = item.targetted_to;
          temp.rightOwner = {
            image: item.created_by.image,
            name: "You",
            address: address,
            isEth:
              temp.leftNFT.length > 0
                ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                : true,
          };
          temp.duration = item.duration;
          temp.end_time = item.end_time;
          temp.id = item.id;
          temp.is_sent = true;
          temp.is_tab1 = true;

          data.push(temp);
        });
      const _trades = _receivedResponse?.p2ps
        ?.filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .concat(
          _createdResponse?.p2ps?.filter((i) =>
            i.fts.length
              ? i.fts[0]?.ft_chain === chain.id.toString()
              : i.nfts[0]?.nft_chain === chain.id.toString()
          )
        );
      setTrades(_trades);
      setList(data);

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

  const getCompleted = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get("/api/get/getCompletedP2P", {
        params: {
          address: address,
        },
      });
      const _response = res.data.data;

      if (_response?.p2ps === undefined) {
        setListError(true);
        setList([]);
        setTrades([]);
        return;
      }

      const data = [];
      _response?.p2ps
        ?.filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .forEach((item) => {
          const temp = {};

          if (address === item.targetted_to.address) {
            temp.leftFT = item.fts;
            temp.leftNFT = item.nfts;
            temp.transactions = item.transactions;

            item.swaps.forEach((swap) => {
              temp.rightFT = swap.fts;
              temp.rightNFT = swap.nfts;
            });

            temp.rightOwner = item.targetted_to;
            temp.leftOwner = {
              image: item.created_by.image,
              name: item.created_by.name,
              address: item.created_by.address,
              isEth:
                temp.leftNFT.length > 0
                  ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                  : true,
            };
          } else {
            temp.rightFT = item.fts;
            temp.rightNFT = item.nfts;
            temp.transactions = item.transactions;

            item.swaps.forEach((swap) => {
              temp.leftFT = swap.fts;
              temp.leftNFT = swap.nfts;
            });

            temp.leftOwner = item.targetted_to;
            temp.rightOwner = {
              image: item.created_by.image,
              name: "You",
              address: address,
              isEth:
                temp.leftNFT.length > 0
                  ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                  : true,
            };
          }
          temp.duration = item.duration;
          temp.end_time = item.closed_time;
          temp.id = item.id;
          temp.is_sent = address === item.created_by_address;
          temp.is_tab2 = true;

          data.push(temp);
        });

      const _trades = _response?.p2ps?.filter((i) =>
        i.fts.length
          ? i.fts[0]?.ft_chain === chain.id.toString()
          : i.nfts[0]?.nft_chain === chain.id.toString()
      );

      setList(data);
      setTrades(_trades);
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

  const getArchived = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get("/api/get/getArchivedP2P", {
        params: {
          address: address,
        },
      });
      const _response = res.data.data;

      if (_response?.p2ps === undefined) {
        setListError(true);
        setList([]);
        setTrades([]);
        return;
      }

      const data = [];

      _response.p2ps
        .filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .forEach((item) => {
          const temp = {};

          if (address === item.targetted_to.address) {
            temp.leftFT = item.fts;
            temp.leftNFT = item.nfts;
            temp.transactions = item.transactions;

            item.swaps.forEach((swap) => {
              temp.rightFT = swap.fts;
              temp.rightNFT = swap.nfts;
            });

            temp.rightOwner = item.targetted_to;
            temp.leftOwner = {
              image: item.created_by.image,
              name: item.created_by.name,
              address: item.created_by.address,
              isEth:
                temp.leftNFT.length > 0
                  ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                  : true,
            };
          } else {
            temp.rightFT = item.fts;
            temp.rightNFT = item.nfts;
            temp.transactions = item.transactions;

            item.swaps.forEach((swap) => {
              temp.leftFT = swap.fts;
              temp.leftNFT = swap.nfts;
            });

            temp.leftOwner = item.targetted_to;
            temp.rightOwner = {
              name: "You",
              address: address,
              image: item.created_by.image,
              isEth:
                temp.leftNFT.length > 0
                  ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                  : true,
            };
          }
          temp.duration = item.duration;
          temp.end_time = item.closed_time ? item.closed_time : item.end_time;
          temp.status = item.status;
          temp.id = item.id;
          temp.is_sent = address === item.created_by_address;
          temp.is_tab3 = true;

          data.push(temp);
        });

      const _trades = _response?.p2ps?.filter((i) =>
        i.fts.length
          ? i.fts[0]?.ft_chain === chain.id.toString()
          : i.nfts[0]?.nft_chain === chain.id.toString()
      );

      setList(data);
      setTrades(_trades);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (
        error?.response?.status === 401 &&
        window.localStorage.getItem("CSRF")
      ) {
        router.push("/p2p");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");
      }
    }
  };

  const declineP2P = async () => {
    setIsProcessingCancel(true);

    axios
      .post("/api/post/postDeclineP2P", {
        params: {
          address: address,
          listingId: list[selectIndex].id,
        },
      })
      // sdk.api.accounts.declineP2P(address, list[selectIndex].id)
      .then(() => {
        infoToast("The offer has been declined");
        onClose();
        setSelectIndex(-1);
        getList();
        setIsProcessingCancel(false);
      })
      .catch((err) => {
        setIsProcessingCancel(false);

        router.push("/p2p");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");

        console.log(err);
        errorToast("Action Failed", "Could not decline offer");
      });
  };

  const handleTabsChange = (index) => {
    if (isLoading) return;

    setTabIndex(index);
  };

  const handleCreate = () => {
    window.sessionStorage.setItem("dashboard-p2p", true);
    router.push("/p2p");
  };

  const handleCheck = (index) => {
    setSelectIndex(index);
    onOpen();
  };

  const handleDecline = async () => {
    if (isLoading) return;

    await declineP2P();
  };

  const handleChat = () => {};

  const handleCancelTrade = async (item, trade) => {
    if (!item.is_sent) {
      // decline trade
      await handleDecline();
    } else {
      // cancel trade
      try {
        setIsProcessingCancel(true);
        const sdk = await appContext?.getSDK();
        const _chainId = getRequiredChain(trade.nfts, trade.fts);
        if (Number(_chainId) !== Number(chain?.id)) {
          switchNetwork(Number(_chainId));
          setIsProcessingCancel(false);
          return;
        }
        const result = await sdk.sc.p2ps.cancelListing(signer, trade);

        setTimeout(async () => {
          infoToast("Your swap has been cancelled successfully");
          onClose();
          setSelectIndex(-1);
          setIsProcessingCancel(false);
          await getList();
        }, 1000);
      } catch (error) {
        setIsProcessingCancel(false);
        console.log(error);
        errorToast("Transaction Failed", error.reason);
      }
    }
  };

  const handleAcceptTrade = async (trade) => {
    try {
      setIsProcessingAccept(true);
      const sdk = await appContext?.getSDK();
      const _chainId = getRequiredChain(trade.nfts, trade.fts);
      if (Number(_chainId) !== Number(chain?.id)) {
        switchNetwork(Number(_chainId));
        setIsProcessingAccept(false);
        return;
      }

      trade.sellerFee = sellerFee;
      trade.buyerFee = buyerFee;
      trade.royalty = royalty;

      trade.reservations = trade.reservations ? trade.reservations : [];

      const sortedListing = sortListingResponse(trade);

      const result = await sdk.sc.p2ps.directSwap(
        signer,
        address,
        sortedListing
      );

      setTimeout(async () => {
        setTH({
          address: list[selectIndex].leftOwner.address,
          hash: result.transactionHash,
        });
        infoToast("Swap succesfull");
        onClose();
        setSelectIndex(-1);
        setIsProcessingAccept(false);
        onSwapOpen();
      }, 500);
    } catch (error) {
      setIsProcessingAccept(false);
      console.log(error);
      errorToast("Transaction Failed", error.reason);
    }
  };

  const handleOptionChange = (e) => {
    switchNetwork(chains[e].id);
  };

  return (
    <>
      <SwapCompleted
        isOpen={isSwapOpen}
        onClose={() => {
          onSwapClose();
          getList();
        }}
        chain={chain?.id}
        handleContinue={() => {
          setTabIndex(1);
          onSwapClose();
        }}
        data={transactionHash}
      />
      <P2PStatus
        isOpen={isOpen}
        onClose={onClose}
        item={list[selectIndex]}
        chain={chain?.id}
        trade={trades[selectIndex]}
        handleDecline={handleDecline}
        handleCancelTrade={handleCancelTrade}
        handleAcceptTrade={handleAcceptTrade}
        isProcessingAccept={isProcessingAccept}
        isProcessingCancel={isProcessingCancel}
        setBuyerFee={setBuyerFee}
        setSellerFee={setSellerFee}
        setRoyalty={setRoyalty}
      />
      <Flex justifyContent={"center"} w="full" h="full">
        <Stack
          spacing={3}
          px="47px"
          pt="12px"
          height="full"
          overflow={"hidden"}
          maxW="1398px"
          w="full"
        >
          <Text fontFamily={"off-bit-bold"} fontSize={"60px"} pt="5vh">
            Dashboard
          </Text>
          <Tabs
            display="flex"
            flexDir="column"
            flex="1 1 0%"
            overflow={"hidden"}
          >
            <TabList>
              <Tab>Activity</Tab>
              <Tooltip
                label="Coming soon"
                isDisabled={ENABLE_BTC}
                borderRadius={"8px"}
                bg={surface}
                color={input}
              >
                <Tab isDisabled={!ENABLE_BTC}>Ordinal Management</Tab>
              </Tooltip>
            </TabList>

            <TabPanels flex="1 1 0%" overflow={"hidden"}>
              <TabPanel
                h="full"
                display="flex"
                flexDir={"column"}
                gap={6}
                px={0}
                pb={0}
              >
                <Flex gap={5}>
                  <Tabs
                    variant="unstyled"
                    isFitted
                    index={tabIndex}
                    onChange={handleTabsChange}
                  >
                    <TabList bg={bg} borderRadius="8px">
                      <Tab
                        py="3"
                        borderRadius={"8px"}
                        fontSize="14px"
                        _selected={{
                          color: "whiter",
                          bg: "pinker",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        Active
                      </Tab>
                      <Flex alignItems={"center"}>
                        <Divider orientation="vertical" height="60%" />
                      </Flex>
                      <Tab
                        py="3"
                        borderRadius={"8px"}
                        fontSize="14px"
                        _selected={{
                          color: "whiter",
                          bg: "pinker",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        Completed
                      </Tab>
                      <Flex alignItems={"center"}>
                        <Divider orientation="vertical" height="60%" />
                      </Flex>
                      <Tab
                        py="3"
                        fontSize="14px"
                        borderRadius={"8px"}
                        _selected={{
                          color: "whiter",
                          bg: "pinker",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        Archived
                      </Tab>
                    </TabList>
                  </Tabs>
                  <Spacer />
                  {/* <Box
            px="24px"
            py="3"
            fontSize="14px"
            fontWeight="bold"
            borderRadius="8px"
            bg="pinker"
            _hover={{ bg: "pinkerHover" }}
            color="whiter"
            cursor={"pointer"}
            onClick={handleCreate}
          >
            CREATE NEW SWAP
          </Box> */}
                </Flex>
                <Box flex="1 1 0%" overflowY={"auto"}>
                  <Box height={"fit-content"}>
                    {isLoading ? (
                      <Box mt="32px">
                        <NF3Spinner />
                      </Box>
                    ) : listError ? (
                      <Flex py="10vh" justifyContent="center" align="center">
                        <Box textAlign={"center"}>
                          An Error Occurred Retrieving Items
                        </Box>
                      </Flex>
                    ) : list.length === 0 ? (
                      <Flex py="10vh" justifyContent="center" align="center">
                        <Box textAlign={"center"}>No Items Found</Box>
                      </Flex>
                    ) : (
                      list.map((item, index) => {
                        return (
                          <P2PItem
                            key={index}
                            tabIndex={tabIndex}
                            item={item}
                            index={index}
                            onChat={handleChat}
                            onCheck={handleCheck}
                          />
                        );
                      })
                    )}
                  </Box>
                </Box>
              </TabPanel>
              {ENABLE_BTC && (
                <TabPanel
                  h="full"
                  display="flex"
                  flexDir={"column"}
                  gap={6}
                  px={0}
                  pb={0}
                >
                  <VaultDashboard />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Stack>
      </Flex>

      {isSwapApprove && (
        <Approve
          data={modalData}
          isOpen={isSwapApprove}
          onClose={onSwapApproveClose}
          handleContinue={handleAcceptTrade}
        />
      )}

      <Box
        position="absolute"
        top="-86px"
        left="0"
        w="100vw"
        h="100vh"
        zIndex="-1"
      >
        <Image src="/images/dots.svg" layout="fill" />
      </Box>
    </>
  );
}
