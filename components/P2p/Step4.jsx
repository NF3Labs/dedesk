import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { CheckGreen } from "../Icons/CheckGreen";
import { Logo } from "../Icons/Logo";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useUserContext } from "../../contexts/User";
import Image from "next/image";

export const Step4 = () => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const title = useColorModeValue("title.light", "title.dark");

  const router = useRouter();
  const { address } = useAccount();
  const userContext = useUserContext();

  const handleContinue = () => {
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_TRADER",
      payload: undefined,
    });
    router.push({
      pathname: `/dashboard`,
    });
  };

  return (
    <>
      <Box w="full" h="full" display={"flex"} justifyContent={"center"}>
        <Flex width="full" maxWidth={"700px"} height="full" overflow="hidden">
          <Box
            m="auto"
            pt="100px"
            height="full"
            flex="1 1 0%"
            overflow="hidden"
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <Flex justify="center" marginBottom={"-62px"}>
              {/* <CheckGreen width="100px" height="100px" /> */}

              <Image
                src="/images/check-glow.png"
                width="160px"
                height="160px"
              />
            </Flex>
            <Flex mt="30px">
              <Text m="auto" fontSize="24px" fontWeight="bold" color={title}>
                Swap offer submitted to
              </Text>
            </Flex>
            <Flex
              border={`2px solid`}
              borderColor={"grayer"}
              px="12px"
              py="12px"
              mt="12px"
              borderRadius="8px"
              maxWidth={"383px"}
              width="full"
            >
              <Avatar
                name={
                  userContext?.selectedActionsState?.p2p_trader
                    ? userContext?.selectedActionsState?.p2p_trader.name
                    : ""
                }
                width={"32px"}
                height={"32px"}
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
                  {userContext?.selectedActionsState?.p2p_trader
                    ? userContext?.selectedActionsState?.p2p_trader.name
                    : ""}
                </Text>
                <Text
                  fontSize="14px"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userContext?.selectedActionsState?.p2p_trader
                    ? userContext?.selectedActionsState?.p2p_trader.address
                    : ""}
                </Text>
              </Box>
            </Flex>
            <Flex mt="30px">
              <Text
                m="auto"
                textAlign="center"
                fontSize="12px"
                color={title}
                display={"flex"}
                flexDirection={"column"}
                gap="8px"
              >
                <Text>
                  Please use the P2P dashboard to check if your offer has been
                  accepted.
                </Text>
                {/* <Text>
                  As we are in beta, we are working on getting notifications set up.
                </Text>
                <Text>
                  Until then, please use the P2P dashboard to check if your offer
                  has been accepted.
                </Text> */}
              </Text>
            </Flex>
            <Flex width="full" maxWidth={"336px"} marginTop="31px">
              <Box
                m="auto"
                mt="24px"
                bg={1 === -2 ? "pinkerHover" : "pinker"}
                _hover={{ bg: "pinkerHover" }}
                color={"whiter"}
                cursor="pointer"
                textAlign="center"
                w="full"
                py="12px"
                borderRadius="8px"
                fontSize="14px"
                fontWeight="bold"
                onClick={handleContinue}
              >
                GO TO P2P DASHBOARD
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
