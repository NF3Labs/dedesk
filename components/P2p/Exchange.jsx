import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Avatar,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { NFT } from "./NFT";
import { SelectToken } from "./SelectToken";
import { Exchange as ExchangeIcon } from "../Icons/Exchange";
import { CHAIN } from "../../constants/chain";
import Image from "next/image";
import { getBeautifulAddress } from "../../utils/formatters";
import { useWindowSize } from "../../hooks/useWindowSize";

export const Exchange = ({
  isSent,
  isEdit,
  callback,
  isOwner,
  leftNFT,
  leftFT,
  leftOwner,
  rightNFT,
  rightFT,
  rightOwner,
}) => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const surface = useColorModeValue("surface.light", "surface.dark");
  const border = useColorModeValue("border.light", "border.dark");
  const title = useColorModeValue("title.light", "title.dark");
  const titleHover = useColorModeValue("titleHover.light", "titleHover.dark");
  const input = useColorModeValue("input.light", "input.dark");

  const handleEdit = (type) => {
    callback(type === 1 ? 1 : 2, true);
  };

  const { windowSize } = useWindowSize();
  const isSmall = false;

  return (
    <>
      <Flex gap="80px" height={"fit-content"} position={"relative"}>
        <Box flex="1 1 0%" display={"flex"} flexDirection={"column"}>
          <Text
            display={"flex"}
            width={"full"}
            justifyContent={"left"}
            alignItems={"center"}
            textAlign="center"
            fontSize="20px"
            fontWeight="bold"
            color={input}
            px={4}
          >
            To Send{" "}
            <Image
              src="/images/up-arrow.svg"
              width="24px"
              height="24px"
              style={{ rotate: "45deg" }}
            />
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            mt="12px"
            borderRadius="24px"
            px="24px"
            py="24px"
            backgroundColor={bg}
            flex="1 1 0%"
          >
            <Text fontSize="14px" color={title} fontWeight="bold">
              {!isOwner ? "Your Wallet" : `Their Wallet`}
            </Text>
            <Box mt="12px" backgroundColor={surface} borderRadius="8px">
              <Flex px="12px" py="10px" borderRadius="8px">
                <Avatar
                  name={rightOwner?.name}
                  src={rightOwner?.image}
                  width="32px"
                  height="32px"
                />
                <Box flex="1" ml="12px" w="5%" alignSelf="center">
                  {/* <Text
                    fontWeight='bold'
                    fontSize='16px'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{rightOwner.name}</Text> */}
                  <Text
                    fontSize="14px"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${getBeautifulAddress(rightOwner?.address)} (You)`}
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box
              flex="1 1 0%"
              overflowY="auto"
              overflowX="hidden"
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
              <Box mt="20px">
                {rightFT.length !== 0 && (
                  <>
                    <Text fontWeight="bold" fontSize="14px">
                      Tokens ({rightFT.length})
                    </Text>
                    <SimpleGrid
                      minChildWidth="50px"
                      overflow="hidden"
                      spacing="12px"
                      pt="5"
                    >
                      {rightFT.map((item, index) => {
                        return (
                          <SelectToken
                            key={index}
                            isEdit={false}
                            m="auto"
                            type="ft"
                            handleRemove={(i) => {
                              handleFTRemove(i);
                            }}
                            index={index}
                            tokenId={isEdit ? item.symbol : item.ft.symbol}
                            tokenName={item.amount}
                            tokenLogo={item.ft ? item.ft.logo : item.logo}
                            tokenImage={""}
                          />
                        );
                      })}
                    </SimpleGrid>
                  </>
                )}
              </Box>
              <Box mt="20px">
                {rightNFT.length !== 0 && (
                  <>
                    <Text fontWeight="bold" fontSize="14px">
                      NFTs ({rightNFT.length})
                    </Text>
                    <Grid
                      minChildWidth="50px"
                      gridTemplateColumns={
                        isSmall ? "repeat(3, 1fr)" : "repeat(5, 1fr)"
                      }
                      gap="12px"
                      pt="5"
                      pb="5"
                    >
                      {rightNFT.map((item, index) => {
                        return (
                          <GridItem key={index}>
                            <NFT
                              isEth={item.nft.chain === CHAIN.toString()}
                              width={"50px"}
                              isEdit={false}
                              collectionName={""}
                              item={item}
                            />
                          </GridItem>
                        );
                      })}
                    </Grid>
                  </>
                )}
              </Box>
            </Box>
            {isEdit && (
              <Box
                mt="12px"
                border={`1px solid`}
                borderColor={border}
                _hover={{ border: `1px solid`, borderColor: titleHover }}
                color={title}
                cursor="pointer"
                textAlign="center"
                w="full"
                py="14px"
                borderRadius="4px"
                fontSize="14px"
                fontWeight="bold"
                onClick={() => {
                  handleEdit(2);
                }}
              >
                EDIT
              </Box>
            )}
          </Box>
        </Box>

        <Flex
          position={"absolute"}
          h="full"
          w="full"
          top={"32px"}
          justifyContent={"center"}
          alignItems={"center"}
          pointerEvents={"none"}
        >
          <Flex
            width={"60px"}
            height={"60px"}
            justifyContent={"center"}
            alignItems={"center"}
            border="3px solid"
            borderColor={border}
            backgroundColor={"#1D1D1D"}
            borderRadius={"full"}
            p="3"
          >
            <ExchangeIcon />
          </Flex>
        </Flex>

        <Box flex="1 1 0%" display={"flex"} flexDirection={"column"}>
          <Text
            display={"flex"}
            width={"full"}
            justifyContent={"left"}
            px={4}
            alignItems={"center"}
            textAlign="center"
            fontSize="20px"
            fontWeight="bold"
            color={input}
          >
            To Receive{" "}
            <Image
              src="/images/down-arrow.svg"
              width="24px"
              height="24px"
              style={{ rotate: "45deg" }}
            />
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            mt="12px"
            borderRadius="24px"
            px="24px"
            py="24px"
            backgroundColor={bg}
            flex="1 1 0%"
          >
            <Text fontSize="14px" color={title} fontWeight="bold">
              {!isSent ? "Other User" : `Their Wallet`}
            </Text>
            <Box mt="12px" backgroundColor={surface} borderRadius="8px">
              <Flex px="12px" py="10px" borderRadius="8px">
                <Avatar
                  name={isOwner ? "You" : leftOwner.name}
                  src={leftOwner.image}
                  width="32px"
                  height="32px"
                />
                <Box flex="1" ml="12px" w="5%" alignSelf="center">
                  {/* <Text
                    fontWeight='bold'
                    fontSize='16px'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{isOwner ? 'You' : leftOwner.name}</Text> */}
                  <Text
                    fontSize="14px"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${getBeautifulAddress(leftOwner.address)}${
                      isOwner ? " (You)" : leftOwner.name ?? ""
                    }`}
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box
              flex="1 1 0%"
              overflowY="auto"
              overflowX="hidden"
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
              <Box mt="20px">
                {leftFT.length !== 0 && (
                  <>
                    <Text fontWeight="bold" fontSize="14px">
                      Tokens ({leftFT.length})
                    </Text>
                    <Grid
                      childWidth="38px"
                      gridTemplateColumns={
                        isSmall ? "repeat(3, 1fr)" : "repeat(5, 1fr)"
                      }
                      overflow="hidden"
                      gap="12px"
                      pt="5"
                      pb="5"
                    >
                      {leftFT.map((item, index) => {
                        return (
                          <SelectToken
                            key={index}
                            isEdit={false}
                            m="auto"
                            type="ft"
                            handleRemove={(i) => {
                              handleFTRemove(i);
                            }}
                            index={index}
                            tokenId={isEdit ? item.symbol : item.ft.symbol}
                            tokenName={item.amount}
                            tokenLogo={item.ft ? item.ft.logo : item.logo}
                            tokenImage={""}
                          />
                        );
                      })}
                    </Grid>
                  </>
                )}
              </Box>
              <Box mt="20px">
                {leftNFT.length !== 0 && (
                  <>
                    <Text fontWeight="bold" fontSize="14px">
                      NFTs ({leftNFT.length})
                    </Text>
                    <Grid
                      minChildWidth="50px"
                      gridTemplateColumns={
                        isSmall ? "repeat(3, 1fr)" : "repeat(5, 1fr)"
                      }
                      gap="12px"
                      pt="5"
                      pb="5"
                    >
                      {leftNFT.map((item, index) => {
                        return (
                          <GridItem key={index}>
                            <NFT
                              isEth={item.nft.chain === CHAIN.toString()}
                              key={index}
                              width={"50px"}
                              isEdit={false}
                              collectionName={""}
                              item={item}
                            />
                          </GridItem>
                        );
                      })}
                    </Grid>
                  </>
                )}
              </Box>
            </Box>
            {isEdit && (
              <Box
                mt="12px"
                border={`1px solid`}
                borderColor={border}
                _hover={{ border: `1px solid`, borderColor: titleHover }}
                color={title}
                cursor="pointer"
                textAlign="center"
                w="full"
                py="14px"
                borderRadius="4px"
                fontSize="14px"
                fontWeight="bold"
                onClick={() => {
                  handleEdit(1);
                }}
              >
                EDIT
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  );
};
