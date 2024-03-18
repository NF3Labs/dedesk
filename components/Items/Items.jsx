import { useColorModeValue, Flex, Image, Box } from "@chakra-ui/react";
import { Verified } from "../Icons/Verified";
import { MiniClose } from "../Icons/MiniClose";
import { useAppContext } from "../../contexts/App";
import { X } from "../Icons/X";
import { FlagP2P } from "../Icons/FlagP2P";
import { useNetwork } from "wagmi";

export const NFTItem = ({ tokenName, handleRemove, isFlagged, state, disabled }) => {
  const bg = useColorModeValue("lightBg.light", "hearder.dark");
  const color = useColorModeValue("title.dark", "title.light");

  return (
    <Flex
      color={color}
      px="8px"
      py="1.5px"
      className="whitespace-nowrap"
      align="center"
      borderRadius="4px"
      bg={bg}
      gap="2"
      w="min"
      fontSize="10px"
      pos="relative"
      opacity={disabled ? ".6" : '1'}
    >
      {tokenName}
      <Verified />
      {isFlagged && <FlagP2P width={"15px"} isborder={true} />}
      <Box pos="absolute" top="-10px" right="-10px">
        {disabled ? <MiniClose /> : <MiniClose cursor="pointer" onClick={handleRemove} />}
      </Box>
    </Flex>
  );
};

export const TokenItem = ({
  contractAddress,
  amount,
  hasRemoveOption,
  handleRemove,
  disabled,
  outside = false,
  state,
}) => {
  const bg = useColorModeValue("lightBg.light", "header.dark");
  const color = useColorModeValue("title.dark", "title.light");
  const { chain } = useNetwork();
  const appContext = useAppContext();
  const tokenList = appContext?.tokenList[chain?.id];
  const token = tokenList?.filter(
    (i) => i.contract.toLowerCase() === contractAddress?.toLowerCase()
  );

  return (
    <Flex
      color={color}
      px="8px"
      py="3px"
      className="whitespace-nowrap"
      align="center"
      borderRadius="4px"
      bg={bg}
      gap="2"
      w="fit-content"
      fontSize="10px"
      pos="relative"
      opacity={disabled ? '.6' : '1'}
    >
      {token && token[0]?.thumbnail ? (
        <Image alt="" src={token[0]?.thumbnail} w="15px" h="15px" />
      ) : (
        <Box>{token && token[0]?.symbol}</Box>
      )}
      {amount}
      {outside ? (
        <Box pos="absolute" top="-10px" right="-10px">
          {disabled ? <MiniClose fill="secondary" /> : <MiniClose fill="secondary" cursor="pointer" onClick={handleRemove} />}
        </Box>
      ) : (
        <Box pos="relative">
          <X
            cursor="pointer"
            onClick={handleRemove}
            width="12px"
            color="pinker"
          />
        </Box>
      )}
    </Flex>
  );
};
