import {
  Box,
  Flex,
  useColorModeValue,
  Spacer,
  Text,
  GridItem,
  Grid,
  AvatarGroup,
  Avatar,
} from "@chakra-ui/react";
import { Exchange } from "../Icons/Exchange";
import { getBeautifulAddress } from "../../utils/formatters";
import { useCountDown } from "../../hooks/useCountDown";
import {
  getTimeInSecondsFromTimeString,
  getTimeSlash,
} from "../../utils/formatters";
import { useAppContext } from "../../contexts/App";
import Image from "next/image";
import { ExchangeGray } from "../Icons/ExchangeGray";

export const P2PItem = ({ index, tabIndex, item, onCheck }) => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const appContext = useAppContext();
  const { minutes, hours, days } = useCountDown({
    endTime: getTimeInSecondsFromTimeString(item.end_time),
  });

  const date = getTimeSlash(item.end_time);

  const leftOwner = item.is_sent ? item.rightOwner : item.leftOwner;
  const rightOwner = item.is_sent ? item.leftOwner : item.rightOwner;

  const leftNFT = item.is_sent ? item.rightNFT : item.leftNFT;
  const leftFT = item.is_sent ? item.rightFT : item.leftFT;

  const rightNFT = item.is_sent ? item.leftNFT : item.rightNFT;
  const rightFT = item.is_sent ? item.leftFT : item.rightFT;

  return (
    <>
      <Box
        px="33px"
        py="20px"
        mb="15px"
        bg={bg}
        borderRadius="8px"
        position="relative"
      >
        <Flex>
          <Flex
            fontSize="16px"
            fontWeight="bold"
            color={
              tabIndex === 0
                ? "secondary"
                : tabIndex === 1
                  ? "greener"
                  : "oranger"
            }
            sx={{ textTransform: "uppercase" }}
            alignItems={"center"}
            gap="1"
          >
            {tabIndex === 0
              ? item.is_sent
                ? <>
                  <Text>SWAP OFFER SENT</Text><Image src="/images/up-arrow.svg" width="24px" height="24px" style={{ rotate: "45deg" }} />
                </>
                : <>
                  <Text>SWAP OFFER RECEIVED</Text><Image src="/images/down-arrow.svg" width="24px" height="24px" style={{ rotate: "45deg" }} />
                </>
              : tabIndex === 1
                ? "COMPLETED"
                : item.status}
          </Flex>
          <Spacer />
          {tabIndex !== 0 ? (
            <Text fontSize="16px" fontWeight="bold">
              DATE :&nbsp;{date}
            </Text>
          ) : (
            <Text fontSize="16px" fontWeight="bold">
              Expiry :&nbsp;
              {(days !== 0 ? days + (days === 1 ? " day" : " days") : "") +
                " " +
                (hours !== 0 ? hours + (hours === 1 ? " hr" : " hrs") : "") +
                " " +
                (minutes !== 0
                  ? minutes + (minutes === 1 ? " min" : " mins")
                  : "")}
              &nbsp;left
            </Text>
          )}
        </Flex>
        <Grid mt="12px" templateColumns="repeat(2, 1fr)">
          <GridItem colSpan={1}>
            <Flex>
              <Flex alignItems={"center"}>
                <Avatar
                  name={item.is_sent ? "You" : leftOwner.name}
                  src={leftOwner.image}
                  width={"32px"}
                  height={"32px"}
                />
                <Box flex="1" ml="12px" minWidth={"150px"}>
                  <Text
                    fontWeight="bold"
                    fontSize="14px"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Created by
                  </Text>
                  {/* <Text
                    fontSize="14px"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.is_sent ? "You" : leftOwner.name}
                  </Text> */}
                  <Text
                    fontSize="14px"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${getBeautifulAddress(leftOwner.address)}${item.is_sent ? " (You)" : leftOwner.name ? ` (${leftOwner.name})` : ""}`}
                  </Text>
                </Box>
              </Flex>
              <Box m="auto" mx="26px">
                <ExchangeGray width={"12px"} height="12px" />
              </Box>
              <Flex alignItems={"center"}>
                <Avatar
                  name={!item.is_sent ? "You" : rightOwner.name}
                  src={rightOwner.image}
                  width={"32px"}
                  height={"32px"}
                />
                <Box flex="1" ml="12px">
                  <Text
                    fontWeight="bold"
                    fontSize="14px"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Offered to
                  </Text>
                  {/* <Text
                    fontSize="14px"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {!item.is_sent ? "You" : rightOwner.name}
                  </Text> */}
                  <Text
                    fontSize="14px"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${getBeautifulAddress(rightOwner.address)}${!item.is_sent ? " (You)" : rightOwner.name ? ` (${rightOwner.name})` : ""}`}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem colSpan={1}>
            <Flex>
              <Flex flex="1">
                <Flex m="auto">
                  <AvatarGroup size="md" max={2} borderRadius={"8px"}>
                    {leftNFT.map((item, index) => {
                      return (
                        <Avatar
                          key={index}
                          name={item.nft.name}
                          src={item.nft.image_url}
                          borderRadius={"8px"}
                        />
                      );
                    })}
                    {leftFT.map((item, index) => {
                      return (
                        <Avatar
                          key={leftNFT.length + index}
                          name={item.ft.logo ? item.ft.logo : item.ft.name}
                          src={item.ft.logo}
                          borderRadius={"8px"}
                        />
                      );
                    })}
                  </AvatarGroup>
                  <Box m="auto" mx="26px">
                    <ExchangeGray />
                  </Box>
                  <AvatarGroup size="md" max={2} borderRadius={"8px"}>
                    {rightNFT.map((item, index) => {
                      return (
                        <Avatar
                          key={index}
                          name={item.nft.name}
                          src={item.nft.image_url}
                          borderRadius={"8px"}
                        />
                      );
                    })}
                    {rightFT.map((item, index) => {
                      return (
                        <Avatar
                          key={rightFT.length + index}
                          name={item.ft.logo ? item.ft.logo : item.ft.name}
                          src={item.ft.logo}
                          borderRadius={"8px"}
                        />
                      );
                    })}
                  </AvatarGroup>
                </Flex>
              </Flex>
              <Box my="auto" ml="12px">
                <Box
                  px="16px"
                  py="6px"
                  fontSize="14px"
                  fontWeight="bold"
                  borderRadius="8px"
                  border="1px solid"
                  color="pinker"
                  borderColor="pinker"
                  _hover={{ bg: "pinkerHover" }}
                  cursor="pointer"
                  onClick={() => {
                    onCheck(index);
                  }}
                >
                  Check Swap
                </Box>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};
