import {
  Box,
  Button,
  CircularProgress,
  Flex,
  IconButton,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import EmblemVaultSDK from "emblem-vault-sdk";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { EMBLEM_VAULT_API_KEY } from "../../constants/emblem";
import { useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";
import {
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import Script from "next/script";
import axios from "axios";
import VaultKeys from "./VaultKeys";

const VaultClaim = ({ vaultData, step, refetchVaults, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(step);

  const content = useColorModeValue("content.light", "content.dark");
  const surface = useColorModeValue("surface.light", "surface.dark");

  const sdk = new EmblemVaultSDK(EMBLEM_VAULT_API_KEY);

  const { data: vaultMetadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ["vaultMetadata", vaultData.tokenId, "claim"],
    queryFn: async () => {
      const vaultMetadata = await sdk
        .fetchMetadata(vaultData.tokenId)
        .catch((err) => console.error(err));

      if (vaultMetadata) {
        return vaultMetadata;
      }
    },
  });

  const [burnTransactionHash, setBurnTransactionHash] = useState(null);

  const { mutate: performBurn, isLoading: isLoadingBurn } = useMutation({
    mutationFn: async () => {
      await sdk.loadWeb3();

      try {
        const transactionHash = await sdk.performBurn(
          web3,
          vaultData.tokenId,
          (action, result) => {
            console.log(`${action}: ${result}`);

            if (action.includes("Hash")) setBurnTransactionHash(result);
          }
        );

        return transactionHash;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    },
  });

  const { isLoading: isBurnTransactionPending, isSuccess: isBurnSuccess } =
    useWaitForTransaction({
      hash: burnTransactionHash,
      onSuccess: () => {
        setCurrentStep("claimed");
        if (refetchVaults) refetchVaults();
      },
    });

  const isBurning = burnTransactionHash && isBurnTransactionPending;

  const {
    data: claimData,
    mutate: performClaimChain,
    isLoading: isLoadingClaimChain,
  } = useMutation({
    mutationFn: async () => {
      await sdk.loadWeb3();

      try {
        const claimData = await sdk.performClaimChain(
          web3,
          vaultData.tokenId,
          null
        );

        return claimData;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    },
  });

  const {
    data: signedPsbt,
    mutate: sweepVaultUsingPhrase,
    isLoading: isLoadingSweepVaultUsingPhrase,
  } = useMutation({
    mutationFn: async () => {
      await sdk.loadWeb3();

      try {
        const claimData = await sdk.performClaimChain(
          web3,
          vaultData.tokenId,
          null
        );

        const currentFees = await axios.get(
          "https://api.blockchain.info/mempool/fees"
        );

        const signedPsbt = await sdk.sweepVaultUsingPhrase(
          claimData.phrase,
          currentFees?.data?.regular ?? 20,
          true
        );

        toast.success(
          `${vaultMetadata.name} will arrive in your XVerse wallet shortly!`
        );

        if (onSuccess) onSuccess();

        return signedPsbt;
      } catch (error) {
        console.error(error);
        toast.error(
          error.message.includes(
            "Cannot read properties of undefined (reading 'txid')"
          )
            ? "Vault contents already sent to wallet!"
            : error.message
        );
      }
    },
  });

  return (
    <Box
      w="full"
      h="full"
      minH="800px"
      display={"flex"}
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {currentStep === "unclaimed" ? (
        <>
          <Text fontSize={"24px"} fontWeight={"bold"}>
            Confirm Unlocking Vault
          </Text>
          <Text color={content} fontSize={"14px"}>
            Lorem Ipsum dolor sit amet.
          </Text>
          <Box
            mt={5}
            position={"relative"}
            width={"30vh"}
            maxW={300}
            aspectRatio={1}
            mb={7}
            borderRadius={"32px"}
            overflow={"clip"}
          >
            {!vaultMetadata || isLoadingMetadata ? (
              <Flex
                w="full"
                h="full"
                bg={surface}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CircularProgress
                  isIndeterminate
                  size={"12px"}
                  color="#E89900"
                  trackColor="transparent"
                />
              </Flex>
            ) : (
              <Image src={vaultMetadata.image} layout="fill" alt="vault" />
            )}
          </Box>
          {isBurning ? (
            <Box>
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                gap={2}
                mb={1}
              >
                <CircularProgress
                  isIndeterminate
                  size={"12px"}
                  color="#F73"
                  trackColor="transparent"
                />
                <Text color="#F73">
                  Transaction Pending. Please do not close this page.
                </Text>
              </Flex>

              <Link
                fontSize={"12px"}
                color="#F73"
                isExternal
                display={"flex"}
                alignItems={"center"}
                gap={1}
                href={`https://etherscan.io/tx/${burnTransactionHash}`}
              >
                <Flex alignItems={"center"} gap={1}>
                  <Text>{burnTransactionHash}</Text>
                  <ExternalLinkIcon mb={"2px"} />
                </Flex>
              </Link>
            </Box>
          ) : (
            <Button
              bg="#FF6B00"
              w={300}
              _disabled={{ opacity: 0.8, cursor: "not-allowed" }}
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 0.8 }}
              onClick={performBurn}
              isDisabled={isLoadingBurn || !vaultMetadata}
            >
              {isLoadingBurn ? (
                <>
                  <CircularProgress
                    isIndeterminate
                    size={"12px"}
                    color="#fff"
                    trackColor="transparent"
                    mr={2}
                  />
                  <Text>Waiting...</Text>
                </>
              ) : (
                "UNLOCK"
              )}
            </Button>
          )}
        </>
      ) : (
        <>
          {!claimData && (
            <>
              <Text fontSize={"24px"} fontWeight={"bold"}>
                Vault Unlocked!
              </Text>
              <Text color={content} fontSize={"14px"}>
                Lorem Ipsum dolor sit amet.
              </Text>
            </>
          )}

          <Box
            mt={5}
            position={"relative"}
            width={"30vh"}
            maxW={300}
            aspectRatio={1}
            mb={7}
            borderRadius={"32px"}
            overflow={"clip"}
          >
            {!vaultMetadata || isLoadingMetadata ? (
              <Flex
                w="full"
                h="full"
                bg={surface}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CircularProgress
                  isIndeterminate
                  size={"12px"}
                  color="#E89900"
                  trackColor="transparent"
                />
              </Flex>
            ) : (
              <Image src={vaultMetadata.image} layout="fill" alt="vault" />
            )}
          </Box>

          {claimData && (
            <>
              <CheckCircleIcon
                color={"#00FF15"}
                width={"24px"}
                height={"24px"}
              />

              <Text fontWeight={"bold"} fontSize={"24px"} pt={3} pb={5}>
                Vault Keys Revealed
              </Text>
            </>
          )}

          {claimData ? (
            <VaultKeys claimData={claimData} />
          ) : (
            <>
              <Button
                bg="#FF6B00"
                w={300}
                _disabled={{ opacity: 0.8, cursor: "not-allowed" }}
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 0.8 }}
                onClick={sweepVaultUsingPhrase}
                isDisabled={isLoadingSweepVaultUsingPhrase}
                mb={3}
              >
                {isLoadingSweepVaultUsingPhrase ? (
                  <>
                    <CircularProgress
                      isIndeterminate
                      size={"12px"}
                      color="#fff"
                      trackColor="transparent"
                      mr={2}
                    />
                    <Text>Waiting...</Text>
                  </>
                ) : (
                  "IMPORT VAULT TO XVERSE"
                )}
              </Button>

              <Button
                w={300}
                color="#F73"
                backgroundColor={"transparent"}
                border="1px solid #F73"
                _disabled={{ opacity: 0.8, cursor: "not-allowed" }}
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 0.8 }}
                onClick={performClaimChain}
                isDisabled={isLoadingSweepVaultUsingPhrase}
              >
                {isLoadingClaimChain ? (
                  <>
                    <CircularProgress
                      isIndeterminate
                      size={"12px"}
                      color="#F73"
                      trackColor="transparent"
                      mr={2}
                    />
                    <Text>Waiting...</Text>
                  </>
                ) : (
                  "REVEAL KEYS"
                )}
              </Button>
            </>
          )}
        </>
      )}

      <Script src="https://emblemcompany.github.io/emblem-vault-sdk/bitcoinjs-lib.js" />
    </Box>
  );
};

export default VaultClaim;
