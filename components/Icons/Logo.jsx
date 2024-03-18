import { Box, Image, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/">
    <Box minW="84px" cursor={"pointer"} display={"flex"} alignItems={"center"}>
      <Image
        src={useColorModeValue("/images/logo.png", "/images/logo-dark.png")}
        alt=""
        width="84px"
      />
    </Box>
  </Link>
);
