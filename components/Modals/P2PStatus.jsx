import {
  Box,
  Flex,
  Text,
  Spacer,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
  Link,
  Image,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Exchange } from "../P2p/Exchange";
import { useCountDown } from "../../hooks/useCountDown";
import { getTimeInSecondsFromTimeString } from "../../utils/formatters";
import { useEffect, useState } from "react";
import { useERC20Balance } from "../../hooks/useERC20Balance";
import { CHAIN } from "../../constants/chain";
import { useTokenContext } from "../../contexts/Token";
import axios from "axios";
import { ethers, constants } from "ethers";
import { FeeConfiguration, ETHContract } from "../../constants/royalty_fee_configuration";
import { useWindowSize } from "../../hooks/useWindowSize";

export const P2PStatus = ({
  handleGoBack,
  handleContinue,
  handleDecline,
  isProcessingAccept,
  isProcessingCancel,
  item,
  chain,
  isOpen,
  onClose,
  trade,
  handleCancelTrade,
  handleAcceptTrade,
  setBuyerFee,
  setSellerFee,
  setRoyalty,
}) => {
  const title = useColorModeValue("title.light", "title.dark");
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const border = useColorModeValue("border.light", "border.dark");
  const cover = useColorModeValue("titleHover.light", "titleHover.dark");
  const input = useColorModeValue("input.light", "input.dark");
  
  const tokenContext = useTokenContext();

  const { isLoaded, minutes, hours, days } = useCountDown({
    endTime: getTimeInSecondsFromTimeString(item?.end_time),
  });

  const [isFlag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusAssets, setStatusAssets] = useState(0); // 0 normal 1 owner 2 trader
  const [statusFts, setStatusFts] = useState(0);

  const { getERC20BalanceLocal } = useERC20Balance();
  
  

  const checkFlaggedToken = () => {
    let data = [];

    item?.rightNFT.forEach((item) => {
      if (item.nft.is_flagged) {
        data.push(item);
      }
    });

    item?.leftNFT.forEach((item) => {
      if (item.nft.is_flagged) {
        data.push(item);
      }
    });

    return data;
  };

  const getList = async (address, nfts) => {
    try {
      let nRet = 0;

      if (address === "" || nfts.length === 0) return 0;

      // setIsLoading(true);
      const response = await axios.get('/api/get/getWalletNfts', {
        params: {
          address: address,
        }
      });

      const returnedData = response.data.data;

      returnedData?.collections.forEach((i) => {
        i.ownerships.forEach((x) => {
          let temp = nfts.filter((item) => item.nft.token === x.nft.token);

          if (temp.length > 0) {
            if (x.nft.type === 'ERC1155') {
              if (x.quantity < temp.length) {
                nRet = 0;
              } else {
                nRet += temp.length;
              }
            } else {
              nRet++;
            }
          }
        });
      });

      // setIsLoading(false);
      return nRet;
    } catch (error) {
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
    let data = checkFlaggedToken();
    setIsLoading(true)
    if (item?.is_tab1 && item) {
      setFlag(data.length !== 0);
      Promise.all([checkAssets(),checkFts()]).then(()=>setIsLoading(false))
    }

    tokenContext?.setTxnHash(undefined);
  }, [item]);


  // useEffect(() => {
  //   if (item?.is_tab1) {
  //     checkFts();
  //     console.log("check FTS done")
  //   }
  // }, [item, rightErc20Balance, leftErc20Balance]);


  const checkFts = async () => {
    if (!item) return;
    const rightCount = await getFtCount(0, item?.rightFT);
    const leftCount = await getFtCount(1, item?.leftFT);

    if (rightCount !== 0) {
      setStatusFts(1);
    } else if (leftCount !== 0) {
      setStatusFts(2);
    } else {
      setStatusFts(0);
    }
  };



  const getFtCount = async (type, fts) => {
    let nRet = 0;


    
    const right = (await getERC20BalanceLocal(item?.rightOwner.address))[1]
    const left = (await getERC20BalanceLocal(item?.leftOwner.address))[1]
    if (type === 0) {
      right?.forEach((item) => {
        if (
          fts.filter(
            (i) =>
            { 
              return item.contract === i.ft_contract && item.balanceFormatted < i.amount
            }
            ).length > 0
            ) {
              nRet++;
              return;
            }
          });
          // setIsLoading(false);
          return nRet;
      } else {
        left?.forEach((item) => {
        if (
          fts.filter(
            (i) =>
              {
                return item.contract === i.ft_contract && item.balanceFormatted < i.amount
              }
          ).length > 0
        ) {
          nRet++;
          return;
        }
      });
      // setIsLoading(false);
      return nRet;
    }
  };


  const checkAssets = async () => {
    if (!item) return;

    const rightCount = await getList(item?.rightOwner.address, item?.rightNFT);
    const leftCount = await getList(item?.leftOwner.address, item?.leftNFT);

    if (rightCount < item?.rightNFT.length) {
      setStatusAssets(1);
    } else if (leftCount < item?.leftNFT.length) {
      setStatusAssets(2);
    } else {
      setStatusAssets(0);
    }
  };

  const { windowSize } = useWindowSize();
  const isSmall = false

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="1330px"
        bgColor={useColorModeValue("modal.light", "modal.dark")}
        position="relative"
        borderRadius={"16px"}
        border="1px solid"
        borderColor={border}
        pt="8px"
        pb="16px"
      >
        <Box w="full" h="full" p="25px" position={"relative"}>
          <Flex position={"absolute"} top={3} left={0} paddingRight={5} width={"full"}>
            <Spacer />
            <Box onClick={onClose} cursor={"pointer"}>
              <CloseIcon />
            </Box>
          </Flex>
          <Box height="full" display={"flex"} alignItems={"center"} flexDirection={"column"}>
            <Box w="full" mt="12px" maxWidth={isSmall ? "900px" : "1250px"}>
              {item && (
                <Exchange
                  isOwner={false}
                  // leftNFT={item.is_sent ? item.rightNFT : item.leftNFT}
                  // leftFT={item.is_sent ? item.rightFT : item.leftFT}
                  // leftOwner={item.is_sent ? item.rightOwner : item.leftOwner}
                  // rightNFT={item.is_sent ? item.leftNFT : item.rightNFT}
                  // rightFT={item.is_sent ? item.leftFT : item.rightFT}
                  // rightOwner={item.is_sent ? item.leftOwner : item.rightOwner}
                  leftNFT={item.leftNFT}
                  leftFT={item.leftFT}
                  leftOwner={item.leftOwner}
                  rightNFT={item.rightNFT}
                  rightFT={item.rightFT}
                  rightOwner={item.rightOwner}
                  isEdit={false}
                  isSent={item.is_sent}
                  index={item.is_tab1 ? 0 : item.is_tab2 ? 1 : 2}
                />
              )}
            </Box>
          </Box>
          {item?.is_tab1 ? (
            <Flex>
              <Box m="auto">
                <Flex>
                  <Text
                    fontWeight="bold"
                    fontSize="12px"
                    color={title}
                    mx="auto"
                    mt="16px"
                    mb="10px"
                  >
                    Expiry Period: {(days !== 0 ? days + " days" : "") +
                      " " +
                      (hours !== 0 ? hours + " hr" : "") +
                      " " +
                      (minutes !== 0 ? minutes + " min" : "")}
                  </Text>
                </Flex>
                {FeeConfiguration?.case !== 0 ?
                  <Text textAlign={"center"} fontSize="12px" fontWeight={500}>
                    {
                      item?.is_sent ? FeeConfiguration?.case === 1 ?
                        FeeConfiguration?.fee_amount > (item?.rightFT?.reduce((total, i) => {
                          return total + Number(i?.amount)
                        }, 0) / 100) * FeeConfiguration?.fee_rate ?
                          `Platform Fee amount: ${FeeConfiguration?.fee_amount}wETH` :
                          `Platform Fee rate: ${FeeConfiguration?.fee_rate} %` :
                        FeeConfiguration?.case === 2 ? "Royalty:" + FeeConfiguration?.royalty_percentage?.map((i) => {
                          return item?.leftFT?.reduce((total, i) => {
                            return total + Number(i?.amount)
                          }, 0) * i / 100 + "wETH";
                        }) : FeeConfiguration?.case === 3 && item?.rightFT?.length === 0 &&
                          item?.rightNFT?.length &&
                          item?.rightNFT?.reduce((total, i) => {
                            if (i?.nft?.contract === item?.rightNFT?.[0]?.nft?.contract) {
                              return total & true;
                            } else {
                              return total & false;
                            }
                          }, true) &&
                          item?.leftNFT?.length === 0 &&
                          item?.leftFT?.length === 1 &&
                          item?.leftFT?.[0]?.ft?.contract === ETHContract ? "Royalty:" + FeeConfiguration?.royalty_percentage?.map((i) => {
                            return item?.leftFT?.reduce((total, i) => {
                              return total + Number(i?.amount)
                            }, 0) * i / 100 + "wETH";
                          }) : FeeConfiguration?.fee_amount > (item?.rightFT?.reduce((total, i) => {
                            return total + Number(i?.amount)
                          }, 0) / 100) * FeeConfiguration?.fee_rate ?
                          `Platform Fee amount: ${FeeConfiguration?.fee_amount}wETH` :
                          `Platform Fee rate: ${FeeConfiguration?.fee_rate} %` :
                        FeeConfiguration?.case === 1 ?
                          FeeConfiguration?.fee_amount > (item?.leftFT?.reduce((total, i) => {
                            return total + Number(i?.amount)
                          }, 0) / 100) * FeeConfiguration?.fee_rate ?
                            `Platform Fee amount: ${FeeConfiguration?.fee_amount}wETH` :
                            `Platform Fee rate: ${FeeConfiguration?.fee_rate} %` :
                          FeeConfiguration?.case === 2 ? "Royalty:" + FeeConfiguration?.royalty_percentage?.map((i) => {
                            return item?.rightFT?.reduce((total, i) => {
                              return total + Number(i?.amount)
                            }, 0) * i / 100 + "wETH";
                          }) : FeeConfiguration?.case === 3 && item?.leftFT?.length === 0 &&
                            item?.leftNFT?.length &&
                            item?.leftNFT?.reduce((total, i) => {
                              if (i?.nft?.contract === item?.leftNFT?.[0]?.nft?.contract) {
                                return total & true;
                              } else {
                                return total & false;
                              }
                            }, true) &&
                            item?.rightNFT?.length === 0 &&
                            item?.rightFT?.length === 1 &&
                            item?.rightFT?.[0]?.ft?.contract === ETHContract ? "Royalty:" + FeeConfiguration?.royalty_percentage?.map((i) => {
                              return item?.rightFT?.reduce((total, i) => {
                                return total + Number(i?.amount)
                              }, 0) * i / 100 + "wETH";
                            }) :
                            FeeConfiguration?.fee_amount > (item?.leftFT?.reduce((total, i) => {
                              return total + Number(i?.amount)
                            }, 0) / 100) * FeeConfiguration?.fee_rate ?
                              `Platform Fee amount: ${FeeConfiguration?.fee_amount}wETH` :
                              `Platform Fee rate: ${FeeConfiguration?.fee_rate} %`
                    }
                  </Text>
                  : <Text textAlign={"center"} fontSize="12px" fontWeight={500} mt="15px">No Fee and No Royalty</Text>}
                {!isLoading &&
                  (statusAssets === 1 || statusFts === 1 ? (
                    <Box mt="12px" textAlign="center">
                      {!isLoading && (
                        <Box
                          mb="20px"
                          fontSize="14px"
                          color="oranger"
                          textAlign="center"
                        >
                          {!item?.is_sent ? (
                            <>
                              You do not have the required assets in your
                              wallet, so the swap cannot be completed.
                              <br />
                              You can cancel the swap or move your assets back,
                              if you move them back please refresh.
                            </>
                          ) : (
                            <>
                              You do not have the required assets in your
                              wallet, so the swap cannot be completed. <br />
                              You can cancel the swap or move your assets back,
                              if you move them back please refresh.
                            </>
                          )}
                        </Box>
                      )}
                      {tokenContext?.txnHash && (
                        <Flex mt="3px" mb="34px">
                          <Flex mx="auto" alignItems={"center"}>
                            <Image
                              src={`/images/transaction.png`}
                              h="20px"
                              backgroundPosition={"center"}
                              backgroundRepeat={"no-repeat"}
                              backgroundSize={"contain"}
                              borderRadius="8px"
                            />
                            {/* <Link href={chain !== CHAIN ? `https://polygonscan.com/tx/${tokenContext?.txnHash}` : `https://etherscan.io/tx/${tokenContext?.txnHash}`} target="_blank"> */}
                            <Link
                              href={
                                chain !== CHAIN
                                  ? `https://mumbai.polygonscan.com/tx/${tokenContext?.txnHash}`
                                  : `https://goerli.etherscan.io/tx/${tokenContext?.txnHash}`
                              }
                              target="_blank"
                            >
                              <Text
                                ml="12px"
                                fontSize="12px"
                                color={input}
                                noOfLines={1}
                              >
                                {tokenContext?.txnHash}
                              </Text>
                            </Link>
                          </Flex>
                        </Flex>
                      )}
                      <Text
                        as="u"
                        fontSize="14px"
                        color="oranger"
                        textAlign="center"
                        cursor={
                          isProcessingCancel || isProcessingAccept
                            ? "not-allowed"
                            : "pointer"
                        }
                        opacity={
                          isProcessingCancel || isProcessingAccept ? ".6" : "1"
                        }
                        onClick={() => {
                          if (!item?.is_sent) {
                            handleDecline();
                          } else {
                            if (!isProcessingCancel && !isProcessingAccept)
                              handleCancelTrade(item, trade);
                          }
                        }}
                      >
                        {isProcessingCancel && (
                          <>
                            <Spinner size="xs" m="-1px" />
                            &nbsp;
                          </>
                        )}
                        {!item?.is_sent ? "Decline Offer" : "Cancel Offer"}
                      </Text>
                    </Box>
                  ) : statusAssets === 2 || statusFts === 2 ? (
                    <Box mt="24px" textAlign="center">
                      {!isLoading && (
                        <Box
                          mb="20px"
                          fontSize="14px"
                          color="oranger"
                          textAlign="center"
                        >
                          {!item?.is_sent ? (
                            <>
                              The other user does not have the required assets,
                              you cannot complete the
                              <br />
                              swap right now.
                              <br />
                              You can decline the swap.
                            </>
                          ) : (
                            <>
                              Your chosen user doesnt have the required assets
                              to complete the swap right now. You
                              <br />
                              can wait for them to add the assets or cancel the
                              offer.
                            </>
                          )}
                        </Box>
                      )}
                      {tokenContext?.txnHash && (
                        <Flex mt="3px" mb="34px">
                          <Flex mx="auto" alignItems={"center"}>
                            <Image
                              src={`/images/transaction.png`}
                              h="20px"
                              backgroundPosition={"center"}
                              backgroundRepeat={"no-repeat"}
                              backgroundSize={"contain"}
                              borderRadius="8px"
                            />
                            {/* <Link href={chain !== CHAIN ? `https://polygonscan.com/tx/${tokenContext?.txnHash}` : `https://etherscan.io/tx/${tokenContext?.txnHash}`} target="_blank"> */}
                            <Link
                              href={
                                chain !== CHAIN
                                  ? `https://mumbai.polygonscan.com/tx/${tokenContext?.txnHash}`
                                  : `https://goerli.etherscan.io/tx/${tokenContext?.txnHash}`
                              }
                              target="_blank"
                            >
                              <Text
                                ml="12px"
                                fontSize="12px"
                                color={input}
                                noOfLines={1}
                              >
                                {tokenContext?.txnHash}
                              </Text>
                            </Link>
                          </Flex>
                        </Flex>
                      )}
                      <Text
                        as="u"
                        fontSize="14px"
                        color="oranger"
                        textAlign="center"
                        cursor={
                          isProcessingCancel || isProcessingAccept
                            ? "not-allowed"
                            : "pointer"
                        }
                        opacity={
                          isProcessingCancel || isProcessingAccept ? ".6" : "1"
                        }
                        onClick={() => {
                          if (!item?.is_sent) {
                            handleDecline();
                          } else {
                            if (!isProcessingCancel && !isProcessingAccept)
                              handleCancelTrade(item, trade);
                          }
                        }}
                      >
                        {isProcessingCancel && (
                          <>
                            <Spinner size="xs" m="-1px" />
                            &nbsp;
                          </>
                        )}
                        {!item?.is_sent ? "Decline Offer" : "Cancel Offer"}
                      </Text>
                    </Box>
                  ) : (
                    <>
                      {!item?.is_sent && isFlag && (
                        <Flex mt="24px">
                          {!isLoading && (
                            <Text
                              m="auto"
                              fontSize="14px"
                              color="oranger"
                              textAlign="center"
                            >
                              This swap contains flagged assets. Are you sure
                              you want to continue with this swap ?
                            </Text>
                          )}
                        </Flex>
                      )}
                      {tokenContext?.txnHash && (
                        <Flex mt="27px">
                          <Flex mx="auto" alignItems={"center"}>
                            <Image
                              src={`/images/transaction.png`}
                              h="20px"
                              backgroundPosition={"center"}
                              backgroundRepeat={"no-repeat"}
                              backgroundSize={"contain"}
                              borderRadius="8px"
                            />
                            {/* <Link href={chain !== CHAIN ? `https://polygonscan.com/tx/${tokenContext?.txnHash}` : `https://etherscan.io/tx/${tokenContext?.txnHash}`} target="_blank"> */}
                            <Link
                              href={
                                chain !== CHAIN
                                  ? `https://mumbai.polygonscan.com/tx/${tokenContext?.txnHash}`
                                  : `https://goerli.etherscan.io/tx/${tokenContext?.txnHash}`
                              }
                              target="_blank"
                            >
                              <Text
                                ml="12px"
                                fontSize="12px"
                                color={input}
                                noOfLines={1}
                              >
                                {tokenContext?.txnHash}
                              </Text>
                            </Link>
                          </Flex>
                        </Flex>
                      )}
                      <Flex justify="center">
                        <Flex
                          justify="center"
                          bg="oranger"
                          borderRadius="4px"
                          w="200px"
                          h="36px"
                          mt="24px"
                          cursor={
                            isProcessingCancel || isProcessingAccept
                              ? "not-allowed"
                              : "pointer"
                          }
                          opacity={
                            isProcessingCancel || isProcessingAccept
                              ? ".6"
                              : "1"
                          }
                          _hover={
                            !isProcessingCancel &&
                            !isProcessingAccept && { opacity: "60%", }
                          }
                          color={"whiter"}
                          onClick={() => {
                            if (!item?.is_sent) {
                              handleDecline();
                            } else {
                              if (!isProcessingCancel && !isProcessingAccept)
                                handleCancelTrade(item, trade);
                            }
                          }}
                        >
                          <Box m="auto" fontSize="16px" fontWeight={"bold"}>
                            {isProcessingCancel && (
                              <>
                                <Spinner size="xs" m="-1px" />
                                &nbsp;&nbsp; &nbsp;
                              </>
                            )}
                            {!item?.is_sent ? "DECLINE OFFER" : "CANCEL OFFER"}
                          </Box>
                        </Flex>
                        {!item?.is_sent && (
                          <Flex
                            justify="center"
                            bg="greener"
                            borderRadius="4px"
                            w="200px"
                            h="36px"
                            mt="24px"
                            ml="24px"
                            cursor={
                              isProcessingAccept || isProcessingCancel
                                ? "not-allowed"
                                : "pointer"
                            }
                            _hover={
                              !isProcessingAccept &&
                              !isProcessingCancel && {
                                opacity: "60%",
                              }
                            }
                            color={"secondary"}
                            opacity={
                              isProcessingAccept || isProcessingCancel
                                ? ".6"
                                : "1"
                            }
                            onClick={() => {
                              if (!isProcessingAccept && !isProcessingCancel)
                                handleAcceptTrade(trade);
                            }}
                          >
                            <Box m="auto" fontSize="16px" fontWeight={"bold"}>
                              {isProcessingAccept && (
                                <>
                                  <Spinner size="xs" m="-1px" />
                                  &nbsp;&nbsp;
                                </>
                              )}
                              APPROVE SWAP
                            </Box>
                          </Flex>
                        )}
                      </Flex>
                    </>
                  ))}
              </Box>
            </Flex>
          ) : item?.is_tab2 ? (
            <Box mt="32px">
              {item?.transactions?.length > 0 && (
                <Flex mt="3px" mb="12px">
                  <Flex mx="auto" alignItems={"center"}>
                    <Image
                      src={`/images/transaction.png`}
                      h="20px"
                      backgroundPosition={"center"}
                      backgroundRepeat={"no-repeat"}
                      backgroundSize={"contain"}
                      borderRadius="8px"
                    />
                    {/* <Link href={chain !== CHAIN ? `https://polygonscan.com/tx/${item?.transactions[0]}` : `https://etherscan.io/tx/${item?.transactions[0]}`} target="_blank"> */}
                    <Link
                      href={
                        chain !== CHAIN
                          ? `https://mumbai.polygonscan.com/tx/${item?.transactions[0]}`
                          : `https://goerli.etherscan.io/tx/${item?.transactions[0]}`
                      }
                      target="_blank"
                    >
                      <Text
                        ml="12px"
                        fontSize="12px"
                        color={input}
                        noOfLines={1}
                      >
                        {item?.transactions[0]}
                      </Text>
                    </Link>
                  </Flex>
                </Flex>
              )}
              <Text
                m="auto"
                textAlign={"center"}
                fontSize="14px"
                fontWeight="bold"
                color="greener"
              >
                Completed
              </Text>
            </Box>
          ) : (
            <Box mt="17px">
              {item?.status !== "declined" &&
                item?.transactions?.length > 0 && (
                  <Flex mt="10px" mb="24px">
                    <Flex mx="auto" alignItems={"center"}>
                      <Image
                        src={`/images/transaction.png`}
                        h="20px"
                        backgroundPosition={"center"}
                        backgroundRepeat={"no-repeat"}
                        backgroundSize={"contain"}
                        borderRadius="8px"
                      />
                      <Link
                        href={
                          chain !== CHAIN
                            ? `https://mumbai.polygonscan.com/tx/${item?.transactions[0]}`
                            : `https://goerli.etherscan.io/tx/${item?.transactions[0]}`
                        }
                        target="_blank"
                      >
                        <Text
                          ml="12px"
                          fontSize="12px"
                          color={input}
                          noOfLines={1}
                        >
                          {item?.transactions[0]}
                        </Text>
                      </Link>
                    </Flex>
                  </Flex>
                )}
              <Text
                m="auto"
                textAlign="center"
                fontSize="14px"
                fontWeight="bold"
                color="oranger"
                sx={{ textTransform: "uppercase" }}
              >
                {item?.status}
              </Text>
            </Box>
          )}
        </Box>
        {isLoading && (
          <Flex
            position="absolute"
            w="full"
            h="full"
            top="0"
            left="0"
            bg={cover}
            borderRadius={"16px"}
          >
            <Spinner m="auto" size="xl" />
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
};
