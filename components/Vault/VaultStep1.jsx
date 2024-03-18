import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import EmblemVaultSDK from "emblem-vault-sdk";
import { EMBLEM_VAULT_API_KEY } from "../../constants/emblem";
import { useEmblemContractTemplate } from "../../utils/emblem";
import toast from "react-hot-toast";
import { NF3Spinner } from "../Spinner/NF3Spinner";

const VaultStep1 = ({ handleTabChange, handleVaultData }) => {
  const content = useColorModeValue("content.light", "content.dark");
  const { contractTemplate } = useEmblemContractTemplate();

  const [isLoading, setIsLoading] = useState(false);

  const sdk = new EmblemVaultSDK(EMBLEM_VAULT_API_KEY);

  const createVault = async () => {
    setIsLoading(true);
    // Create a vault
    try {
      const vaultData = await sdk
        .createCuratedVault(contractTemplate)
        .catch((err) => console.error(err));

      if (!vaultData || vaultData.err) {
        toast.error(vaultData.err);
        throw new Error(vaultData.err);
      } else {
        handleVaultData(vaultData);
        handleTabChange(1);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      w="full"
      h="full"
      display={"flex"}
      justifyContent={"center"}
      pt={"110px"}
    >
      <Flex flexDir={"column"} alignItems={"center"}>
        <Box h={"calc(100vh - 1080px)"} maxH={20} />

        <Box
          position={"relative"}
          width={"30vh"}
          maxW={362}
          aspectRatio={1.43}
          mb={8}
        >
          <Image
            src="/images/vault/vault-graphic.png"
            layout="fill"
            alt="vault"
          />
        </Box>

        <Box textAlign={"center"} mb={8}>
          <Text fontWeight={"bold"} fontSize={"24px"} pb={3}>
            Create a BTC vault to secure your Ordinal
          </Text>

          <Text fontSize={"14px"} color={content}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac
            risus pretium,
            <br />
            efficitur magna sit amet, dapibus dolor.
          </Text>
        </Box>

        <Button
          backgroundColor={"bitcoin"}
          width={"370px"}
          height={"48px"}
          boxShadow="0px 0px 49.2px 0px rgba(255, 107, 0, 0.49) !important"
          _disabled={{ opacity: 0.8, cursor: "not-allowed" }}
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 0.8 }}
          fontSize={"14px"}
          cursor={"pointer"}
          onClick={createVault}
          isDisabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress
                isIndeterminate
                size={"12px"}
                color="white"
                trackColor="transparent"
                mr={2}
              />
              <Text>Waiting...</Text>
            </>
          ) : (
            "CREATE VAULT"
          )}
        </Button>
      </Flex>
    </Box>
  );
};

export default VaultStep1;
