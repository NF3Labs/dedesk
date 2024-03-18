import { Flex, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { SelectToken } from "../Modals/SelectToken";
import { useUserContext } from "../../contexts/User";
import { useAppContext } from "../../contexts/App";
import { infoToast } from "../../pages/_app";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useERC20Balance } from "../../hooks/useERC20Balance";
import { useNetwork, useAccount } from "wagmi";
import { constants } from "ethers";

export const AddButtons = ({ address, type, allowETH }) => {
  const {
    isOpen: isTokenOpen,
    onOpen: onTokenOpen,
    onClose: onTokenClose,
  } = useDisclosure();
  const userContext = useUserContext();
  const appContext = useAppContext();
  const { chain } = useNetwork();
  const { address: currentAddress } = useAccount();
  const ETH = constants.AddressZero;

  const chosenTokens = type
    ? userContext?.selectedActionsState?.p2p_my_fts
    : userContext?.selectedActionsState?.p2p_fts;

  const { data: _erc20Balance } = useERC20Balance(address);

  const erc20Balance = _erc20Balance && _erc20Balance[chain?.id];
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");

  const tokenOptions = erc20Balance
    ?.filter((i) => {
      if (allowETH) return true;
      return i.contract !== ETH;
    })
    .filter(
      (i) =>
        !chosenTokens?.find(
          ({ contract }) =>
            i.contract === contract && (allowETH || contract !== ETH)
        )
    );
  const tokenList = appContext?.tokenList?.[chain?.id];

  const handleConfirm = (contract, amount) => {
    let data = type
      ? userContext?.selectedActionsState?.p2p_my_fts
      : userContext?.selectedActionsState?.p2p_fts;
    const nfts = type
      ? userContext?.selectedActionsState?.p2p_my_nfts
      : userContext?.selectedActionsState?.p2p_nfts;
    const isIn = data.filter((i) => {
      return i.contract === contract;
    });
    if (isIn.length > 0) {
      return;
    }

    const token = tokenList?.filter(
      (i) => i.contract.toLowerCase() === contract.toLowerCase()
    );
    if (data.length + 1 + nfts.length > 16) {
      infoToast("Max Reached", "16 is the maximum able to be listed.");
      return;
    }
    data.push({
      contract: contract,
      amount: amount,
      symbol: token[0]?.symbol,
      logo: token[0]?.logo,
    });
    userContext?.dispatchSelectedActions({
      type: type ? "HANDLE_P2P_MY_FT" : "HANDLE_P2P_FT",
      payload: data,
    });
  };

  const handleRemoveERC20 = (contract, amount) => {
    let data = type
      ? userContext?.selectedActionsState?.p2p_my_fts
      : userContext?.selectedActionsState?.p2p_fts;
    const newData = data.filter(
      (i) => i.contract !== contract || i.amount !== amount
    );
    userContext?.dispatchSelectedActions({
      type: type ? "HANDLE_P2P_MY_FT" : "HANDLE_P2P_FT",
      payload: newData,
    });
  };

  return (
    <>
      <Flex
        p="8px"
        border={`2px solid`}
        borderColor={bg}
        borderRadius="8px"
        alignItems="center"
        backgroundColor={bg}
        height="40px"
        onClick={onTokenOpen}
        cursor={"pointer"}
      >
        <SmallAddIcon m="auto" w="4" h="4" />
        <Text pl="8px" flex="1" fontSize="14px" fontWeight="bold">
          Add a Token
        </Text>
        {/* <Flex
          bg="pinker"
          color="whiter"
          borderRadius="4px"
          w="32px"
          h="32px"
        >

        </Flex> */}
      </Flex>
      <SelectToken
        tokenOptions={tokenOptions}
        handleConfirm={handleConfirm}
        isOpen={isTokenOpen}
        selectedTokens={
          type
            ? userContext?.selectedActionsState?.p2p_my_fts
            : userContext?.selectedActionsState?.p2p_fts
        }
        handleRemove={handleRemoveERC20}
        onClose={onTokenClose}
        erc20Balance={erc20Balance}
        isUser={currentAddress === address}
      />
    </>
  );
};
