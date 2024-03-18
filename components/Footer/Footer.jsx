import {
  Box,
  Flex,
  Image,
  Stack,
  Spacer,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { Search } from "../Icons/Search";
import { Plus } from "../Icons/Plus";
import { useRouter } from "next/router";
import { Logo } from "../Icons/Logo";
import { Discord } from "../Icons/Discord";
import { Mail } from "../Icons/Mail";
import { Twitter } from "../Icons/Twitter";

export const Footer = () => {
  const router = useRouter();
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const header = useColorModeValue("header.light", "header.dark");

  return (
    <Flex
      bg={bg}
      bottom="0"
      right="0"
      h="60px"
      w="full"
      py="20px"
      px="40px"
      borderTop={`1px solid ${header}`}
      alignItems="center"
      // zIndex={"50"}
      position={router.pathname === "/" ? "relative" : "fixed"}
    >
      <Link href="https://discord.gg/dexyz" target="_blank" mr="21px" display={{ base: "none", md: "block" }}>
        <Discord />
      </Link>
      <Link href="https://twitter.com/delabsxyz" target="_blank" mr="21px" display={{ base: "none", md: "block" }}>
        <Twitter />
      </Link>
      <Link href="mailto:hello@nf3x.io" target="_blank" display={{ base: "none", md: "block" }}>
        <Mail />
      </Link>
      <Spacer />
      {/* <Logo /> */}
      <Text fontSize="12px" fontWeight="bold">
        Copyright de[desk] {(new Date()).getFullYear()}, All rights reserved.
      </Text>
      <Spacer />
      <Box flexDirection={"column"} gap="1" display={{ base: "none", md: "flex" }}>
        <Link href="https://twitter.com/nf3exchange" target="_blank" mr="21px" display={"flex"} alignItems={"center"} gap="2" fontSize={"14px"}>
          Powered by <Image src="/images/nf3x.svg" width={"46px"} height={"20px"} />
        </Link>
        {/* <Box display="flex" alignItems="center">
          <Text fontSize="9px">Audited by:&nbsp;</Text>
          <Link
            href="https://skynet.certik.com/projects/nf3x"
            target="_blank"
            mr="32px"
            display="flex"
          >
            <Text color="bluer" as="u" fontSize="9px">
              Certik
            </Text>
          </Link>
        </Box> */}
      </Box>
    </Flex>
  );
};
