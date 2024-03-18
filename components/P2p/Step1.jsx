import { CheckIcon, InfoIcon } from "@chakra-ui/icons";
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
  Tooltip,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getBeautifulAddress } from "../../utils/formatters";
import { Search } from "../Icons/Search";
import { Logo } from "../Icons/Logo";
import { useUserContext } from "../../contexts/User";
import { useAccount, useNetwork, useSwitchNetwork, useDisconnect } from "wagmi";
import { useDebounce } from "use-hooks";
import { useRouter } from "next/router";
import axios from "axios";

export const Step1 = ({ callback }) => {
  const userContext = useUserContext();

  const { chain } = useNetwork();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const { chains } = useSwitchNetwork();

  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const surface = useColorModeValue("surface.light", "surface.dark");
  const border = useColorModeValue("border.light", "border.dark");
  const header = useColorModeValue("header.light", "header.dark");
  const title = useColorModeValue("title.light", "title.dark");
  const titleHover = useColorModeValue("titleHover.light", "titleHover.dark");
  const input = useColorModeValue("input.light", "input.dark");
  const h = useColorModeValue("placeholder.light", "placeholder.dark");

  const { address } = useAccount();

  const [selectHistory, setSelectHistory] = useState(-1);
  const [selectResult, setSelectResult] = useState(-1);

  const [history, setHistory] = useState([]);
  const [result, setResult] = useState([]);
  const [value, setValue] = useState("");

  const debounceValue = useDebounce(value, 500);

  useEffect(() => {
    if (address === undefined) return;

    getList();
  }, [address]);

  useEffect(() => {
    if (debounceValue !== "") {
      getSearchList(debounceValue);
    } else {
      setResult([]);
      setSelectResult(-1);
    }
  }, [debounceValue]);

  const getList = async () => {
    try {
      const response = await axios.get("/api/get/getP2PTraders", {
        params: {
          address: address,
        },
      });

      const returnedData = response.data.data;
      let cleanedData = [];

      returnedData?.forEach((i) => {
        cleanedData.push({
          address: i.address,
          name: i.name,
          image: i.image,
        });
      });

      setHistory(cleanedData);
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

  const getSearchList = async (key) => {
    try {
      if (address === undefined) return;

      const response = await axios.get("/api/get/getSearchAdd", {
        params: {
          key: key,
        },
      });

      const returnedData = response.data.data;
      let cleanedData = [];

      returnedData?.forEach((i) => {
        if (address !== i.address) {
          cleanedData.push({
            address: i.address,
            name: i.name,
            image: i.image,
          });
        }
      });

      setResult(cleanedData);
      setSelectResult(-1);
      setSelectHistory(-1);
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

  const handleOwner = (index, type) => {
    let temp = {};
    if (type === 2) {
      temp = result[index];
      setSelectResult(index);
      setSelectHistory(-1);
    } else {
      temp = history[index];
      setSelectHistory(index);
      setSelectResult(-1);
    }
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_TRADER",
      payload: {
        name: temp.name,
        address: temp.address,
        image: temp.image,
        isEth: chains.findIndex((i) => i.id === chain.id),
      },
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_ME",
      payload: {
        name: "You",
        address: address,
        isEth: 0,
      },
    });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleContinue = () => {
    if (selectHistory !== -1 || selectResult !== -1) {
      callback(1);
    }
  };

  const handleBack = () => {
    router.push("/");
    callback(-1);
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
            <Box
              borderRadius="24px"
              px="24px"
              py="24px"
              backgroundColor={bg}
              overflow={"hidden"}
              display={"flex"}
              flexDirection={"column"}
            >
              <Flex alignItems={"center"} gap={2}>
                <Text fontSize="14px" color={title} fontWeight="bold">
                  {`Recent Contacts`}
                </Text>
                <Tooltip
                  label="This a list of wallets you have recently traded with."
                  borderRadius={"8px"}
                  bg={surface}
                  color={input}
                  w={"190px"}
                >
                  <InfoIcon w={"14px"} h={"14px"} cursor={"pointer"} />
                </Tooltip>
              </Flex>

              <Box
                py="12px"
                minHeight="200px"
                overflowY="auto"
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
                {history.map((item, index) => {
                  return (
                    <Flex
                      cursor="pointer"
                      key={index}
                      mt={index > 0 ? "12px" : ""}
                      px="10px"
                      py="12px"
                      backgroundColor={surface}
                      borderRadius="8px"
                      onClick={() => {
                        handleOwner(index, 1);
                      }}
                      border="1px solid"
                      borderColor={
                        selectHistory === index ? "pinker" : "transparent"
                      }
                    >
                      <Avatar
                        name={item.name}
                        src={item.image}
                        width={8}
                        height={8}
                      />
                      <Box flex="1" ml="12px" w="5%" alignSelf="center">
                        <Text
                          fontWeight="bold"
                          fontSize="16px"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          fontSize="14px"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getBeautifulAddress(item.address)}
                        </Text>
                      </Box>
                      <Flex>
                        {/* {selectHistory === index ? (
                          <Flex
                            m="auto"
                            borderRadius="4px"
                            bg={"pinker"}
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
                        ) : (
                          <Box
                            m="auto"
                            borderRadius="4px"
                            bg={"grayer"}
                            w="16px"
                            h="16px"
                          ></Box>
                        )} */}
                      </Flex>
                    </Flex>
                  );
                })}
              </Box>
              <Box
                mt="12px"
                bg={
                  selectResult === -1 && selectHistory === -1
                    ? "pinkerHover"
                    : "pinker"
                }
                _hover={{ bg: "pinkerHover" }}
                color={
                  selectResult === -1 && selectHistory === -1
                    ? "whiter"
                    : "whiter"
                }
                cursor={
                  selectResult === -1 && selectHistory === -1
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
                onClick={handleBack}
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
              Who do you want to swap with?
            </Text>
            <Text fontSize="14px" color={h} mt="5px">
              {`Please enter the ENS or wallet address of the individual you wish to swap with.`}
            </Text>
            <InputGroup mt="24px">
              <InputLeftElement
                color={title}
                pl="12px"
                height={"full"}
                display={"flex"}
                alignItems={"center"}
                pointerEvents="none"
              >
                <Search />
              </InputLeftElement>
              <Input
                type="text"
                color={input}
                bg={bg}
                height="48px"
                borderRadius="full"
                fontSize="14px"
                border="none"
                pl="48px"
                placeholder="Search ENS or Wallet Address"
                _focus={{ boxShadow: "none", border: "none" }}
                _placeholder={{ color: h }}
                onChange={handleChange}
                value={value}
              />
            </InputGroup>
            {result.length > 0 && (
              <Text fontSize="12px" mb="12px" color={h} mt="30px">
                Is this the user you’re looking for?
              </Text>
            )}
            <Box
              pb="16px"
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
              {1 !== 1 ? (
                <Flex mt="100px" justify="center">
                  <Box textAlign={"center"}>
                    The address does not hold any NFTs
                  </Box>
                </Flex>
              ) : (
                result.map((item, index) => {
                  return (
                    <Flex
                      cursor="pointer"
                      key={index}
                      mt={index === 0 ? "" : "12px"}
                      border={`2px solid`}
                      borderColor={
                        selectResult === index ? "pinker" : "transparent"
                      }
                      px="12px"
                      py="16px"
                      borderRadius="8px"
                      onClick={() => {
                        handleOwner(index, 2);
                      }}
                      backgroundColor={surface}
                    >
                      <Avatar name={item.name} src={item.image} />
                      <Box flex="1" ml="12px" w="5%" alignSelf="center">
                        <Text
                          fontWeight="bold"
                          fontSize="16px"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          fontSize="14px"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.address}
                        </Text>
                      </Box>
                      {/* <Flex>
                        {selectResult === index ? (
                          <Flex
                            m="auto"
                            borderRadius="4px"
                            bg={"pinker"}
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
                        ) : (
                          <Box
                            m="auto"
                            borderRadius="4px"
                            bg={"grayer"}
                            w="16px"
                            h="16px"
                          ></Box>
                        )}
                      </Flex> */}
                    </Flex>
                  );
                })
              )}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};
