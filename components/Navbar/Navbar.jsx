import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  Tooltip,
  Image,
  Text,
  Button,
} from "@chakra-ui/react";
import { Plus } from "../Icons/Plus";
import Link from "next/link";
import { useRouter } from "next/router";
import { Logo } from "../Icons/Logo";
import { Connect } from "../Connect/Connect";
import { useAccount, useDisconnect } from "wagmi";
import { ENABLE_BTC } from "../../constants/emblem";

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { toggleColorMode, colorMode } = useColorMode();
  const router = useRouter();
  const color = useColorModeValue("title.light", "title.dark");
  const border = useColorModeValue("header.light", "header.dark");
  const lightBg = useColorModeValue("lightBg.light", "lightBg.dark");
  const bg = useColorModeValue("bg.light", "bg.dark");
  const notCurrentPageColor = useColorModeValue("header.light", "header.dark");

  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleCreate = () => {
    window.sessionStorage.setItem("dashboard-p2p", true);
    router.push("/p2p");
  };

  return (
    <Box
      bg={useColorModeValue("bg.light", "bg.dark")}
      py="1rem"
      fontSize="14px"
      top="0"
      width="100%"
      pos="fixed"
      className="z-index2"
      borderBottom={"1px solid"}
      borderColor={useColorModeValue("border.light", "border.dark")}
    >
      <Flex
        alignItems="center"
        px="20px"
        justifyContent={{
          base: isConnected ? "flex-end" : "space-between",
          md: "space-between",
        }}
        gap="3"
      >
        <Flex
          alignItems="center"
          gap="20px"
          display={{ base: isConnected ? "none" : "flex", md: "flex" }}
        >
          <Box px={{ base: 0, md: "25px" }} py="5px" mb="-2px">
            <Logo />
          </Box>
        </Flex>

        <Flex
          alignItems="center"
          gap={ENABLE_BTC ? { base: "12px", md: "15px" } : "15px"}
        >
          {isConnected && (
            <>
              <NavLink
                link="/dashboard"
                text="Dashboard"
                currentPath={router.pathname.split("/")[1].replace(/^/, "/")}
                disable={false}
              />
              {/* <Link href="/p2p"> */}
              {ENABLE_BTC && (
                <Button
                  bg="bitcoin"
                  borderRadius="8px"
                  px="12px"
                  height={10}
                  cursor={"pointer"}
                  display={"flex"}
                  alignItems={"center"}
                  gap={"4px"}
                  onClick={() => router.push("/vault")}
                  _disabled={{ opacity: 0.8, cursor: "not-allowed" }}
                  _hover={{ opacity: 0.8 }}
                  _active={{ opacity: 0.8 }}
                >
                  <Text
                    fontWeight="bold"
                    display={{ base: "block", md: "none" }}
                  >
                    Ordinals
                  </Text>
                  <Text
                    fontWeight="bold"
                    display={{ base: "none", md: "block" }}
                  >
                    Vault Ordinals
                  </Text>
                </Button>
              )}

              <Box
                bg="pinker"
                borderRadius="8px"
                px="12px"
                height={10}
                cursor={"pointer"}
                display={"flex"}
                alignItems={"center"}
                gap={"4px"}
                onClick={handleCreate}
              >
                <Plus width="23px" height="23px" mx="auto" color={"whiter"} />
                <Text fontWeight="bold" display={{ base: "block", md: "none" }}>
                  {ENABLE_BTC ? "Swap" : "New Swap"}
                </Text>
                <Text fontWeight="bold" display={{ base: "none", md: "block" }}>
                  New Swap
                </Text>
              </Box>
            </>
          )}
          {/* </Link> */}
          <Flex align="center" h="full" gap="8" ml="4">
            {isConnected ? (
              <Box
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
                sx={{ display: "contents" }}
              >
                <Menu isOpen={isOpen}>
                  <MenuButton>
                    <Connect />
                  </MenuButton>
                  <MenuList
                    zIndex="11"
                    onMouseLeave={onClose}
                    minW="250px"
                    bg={lightBg}
                  >
                    <MenuItem
                      onClick={() => {
                        disconnect();
                        onClose();
                        window.localStorage.setItem("wallet-address", "");
                        window.localStorage.setItem(
                          "nf3marketplace-connector-choice",
                          null
                        );
                      }}
                      fontWeight="bold"
                      pr="2"
                      bg={lightBg}
                    >
                      Disconnect
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            ) : (
              <Connect />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

const NavLink = ({
  link,
  text,
  currentPath,
  color,
  border,
  borderColor,
  disable = false,
  notCurrentPageColor,
}) => {
  const bg = useColorModeValue("bg.light", "bg.dark");
  const bgTool = useColorModeValue("bg.light", "bg.dark");
  const colorTool = useColorModeValue("title.dark", "title.light");
  const borderTool = useColorModeValue("placeholder.light", "placeholder.dark");
  const borderColorTool = useColorModeValue(
    "placeholder.light",
    "placeholder.dark"
  );

  if (disable)
    return (
      <Tooltip
        hasArrow
        placement="top"
        label={
          <Box display="flex" gap={1}>
            <Box>Coming Soon!!</Box>
            <Image
              alt="no logo"
              src={"/images/eyes.png"}
              h="12px"
              w="13px"
              m={"auto"}
            />
          </Box>
        }
        bg={bgTool}
        color={colorTool}
        border={"2px solid"}
        borderColor={borderColor}
        borderRadius="8px"
        fontSize="12px"
        p="8px 10px"
        sx={{
          "--popper-arrow-shadow-color": borderColorTool,
        }}
      >
        <Box>
          <Box
            cursor={"not-allowed"}
            border={
              currentPath === link.split("/")[1].replace(/^/, "/") ? border : ""
            }
            color={
              currentPath === link.split("/")[1].replace(/^/, "/")
                ? color
                : notCurrentPageColor
            }
            borderBottom={
              currentPath === link.split("/")[1].replace(/^/, "/")
                ? "0px"
                : border
            }
            pt={
              currentPath === link.split("/")[1].replace(/^/, "/")
                ? "14px"
                : "16px"
            }
            pb={
              currentPath === link.split("/")[1].replace(/^/, "/")
                ? "14px"
                : "12px"
            }
            bg={bg}
            borderTopRadius="8px"
            px={
              currentPath === link.split("/")[1].replace(/^/, "/")
                ? "12px"
                : "14px"
            }
            opacity=".6"
            mb={"-2px"}
            fontWeight="bold"
            className="border-fix"
          >
            <Text opacity=".5">{text}</Text>
          </Box>
        </Box>
      </Tooltip>
    );
  else
    return (
      <Link href={link} passHref>
        <Box
          cursor={"pointer"}
          border={
            currentPath === link.split("/")[1].replace(/^/, "/") ? border : ""
          }
          borderColor={borderColor}
          color={
            currentPath === link.split("/")[1].replace(/^/, "/")
              ? color
              : notCurrentPageColor
          }
          borderBottom={
            currentPath === link.split("/")[1].replace(/^/, "/")
              ? "0px"
              : border
          }
          pt={
            currentPath === link.split("/")[1].replace(/^/, "/")
              ? "14px"
              : "16px"
          }
          pb={
            currentPath === link.split("/")[1].replace(/^/, "/")
              ? "14px"
              : "12px"
          }
          bg={bg}
          borderTopRadius="8px"
          px={
            currentPath === link.split("/")[1].replace(/^/, "/")
              ? "12px"
              : "6px"
          }
          mb={"-2px"}
          fontWeight="bold"
          className="border-fix"
        >
          {text}
        </Box>
      </Link>
    );
};
