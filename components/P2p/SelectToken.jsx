import {
  Box,
  Flex,
  Image,
  AspectRatio,
  useColorModeValue
} from "@chakra-ui/react";
import { Eliminate } from "../Icons/Eliminate";
import { PolyP2P } from "../Icons/PolyP2P";
import { EthP2P } from "../Icons/EthP2P";
import { CHAIN } from "../../constants/chain";

export const SelectToken = ({
  isEdit,
  type,
  handleRemove,
  index,
  tokenId,
  tokenImage,
  tokenLogo,
  tokenName,
  chainId,
}) => {
  const surface = useColorModeValue("surface.light", "surface.dark");

  return (
    <Flex
      borderRadius="8px"
      position="relative"
      mr="4px"
      width={type === "ft" ? "64px" : ""}
      backgroundColor={type === "ft" ? "transparent" : surface}
    >
      <Box py={type === "ft" ? "0px" : "8px"} px={type === "ft" ? "0px" : "8px"} w='full'>
        <>
          {type === "ft" ? (
            <AspectRatio ratio={1}>
              <Box
                borderRadius="8px"
                bgColor={surface}
              >
                <Image
                  m="auto"
                  h="18px"
                  src={tokenLogo}
                />
              </Box>
            </AspectRatio>
          ) : (
            <AspectRatio ratio={1}>
              <Box
                bgImage={tokenImage}
                backgroundPosition={"center"}
                backgroundRepeat={"no-repeat"}
                backgroundSize={"cover"}
                borderRadius="8px"
              />
            </AspectRatio>
          )}
        </>
        <Box mt="6px" fontSize="10px" textAlign="center">
          {type === "ft" ? tokenName + " " + tokenId : tokenName}
        </Box>
        <Box position="absolute" top={"12px"} left={"12px"} width={"fit-content"} height={"fit-content"}>
          {type !== "ft" &&
            (chainId === CHAIN.toString() ? (
              <EthP2P width={"16"} />
            ) : (
              <PolyP2P width={"16"} />
            ))}
        </Box>
      </Box>
      {isEdit && (
        <Box
          zIndex={100}
          cursor='pointer'
          position="absolute"
          top={"-3px"}
          right={"-3px"}
          onClick={() => {
            handleRemove(index);
          }}
        >
          <Eliminate />
        </Box>
      )}
    </Flex>
  );
};
