import {
  ArrowForwardIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useEmblemContractTemplate } from "../../utils/emblem";
import { useMutation, useQuery } from "react-query";
import EmblemVaultSDK from "emblem-vault-sdk";
import { EMBLEM_VAULT_API_KEY } from "../../constants/emblem";
import { useProvider, useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";
import VaultKeys from "./VaultKeys";

// This component in afterCreate is either tab 1 or 2
const VaultMint = ({
  vaultData,
  onTransfer,
  afterCreation,
  onSuccess,
  refetchVaults,
}) => {
  const content = useColorModeValue("content.light", "content.dark");
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const surface = useColorModeValue("surface.light", "surface.dark");
  const border = useColorModeValue("bg.dark", "bg.light");

  const provider = useProvider();

  const sdk = new EmblemVaultSDK(EMBLEM_VAULT_API_KEY);

  const { contractTemplate } = useEmblemContractTemplate();

  const { data: vaultBalance, isLoading: isLoadingVaultBalance } = useQuery({
    queryKey: ["vaultBalance", vaultData.tokenId],
    queryFn: async () => {
      const vaultBalance = await sdk
        .refreshBalance(vaultData.tokenId)
        .catch((err) => console.error(err));

      if (vaultBalance.length > 0) {
        if (onTransfer) onTransfer();
        return vaultBalance;
      }
    },
    enabled: Boolean(vaultData),
    refetchInterval: (data) => (data && data.length >= 1 ? false : 1000),
  });

  const { data: vaultMetadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ["vaultMetadata", vaultData.tokenId, "mint"],
    queryFn: async () => {
      const vaultMetadata = await sdk
        .fetchMetadata(vaultData.tokenId)
        .catch((err) => console.error(err));

      if (vaultMetadata) {
        return vaultMetadata;
      }
    },
    enabled: Boolean(vaultBalance && vaultBalance.length > 0),
  });

  const depositAddress = useMemo(
    () =>
      vaultData.addresses.find((address) => {
        return address.coin == "TAP";
      })?.address,
    [vaultData]
  );

  const [copied, setCopied] = useState(false);
  const copyAddress = useCallback(async () => {
    if (depositAddress) {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [depositAddress, setCopied]);

  const {
    data: claimData,
    mutate: performClaimChain,
    isLoading: isLoadingClaimChain,
  } = useMutation({
    mutationFn: async () => {
      await sdk.loadWeb3();

      try {
        const data = await sdk.performClaimChain(web3, vaultData.tokenId, null);

        return data;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    },
  });

  const [mintTransactionHash, setMintTransactionHash] = useState(null);

  const { mutate: performMint, isLoading: isLoadingMint } = useMutation({
    mutationFn: async () => {
      await sdk.loadWeb3();

      if (!vaultBalance) return;

      if (vaultBalance.length > 0) {
        let contractObject = await sdk.fetchCuratedContractByName(
          contractTemplate.targetContract.name
        );

        let mintable = contractObject.allowed(vaultBalance, contractObject);

        if (mintable) {
          if (vaultData.tokenId) {
            try {
              const transactionHash = await sdk.performMintChain(
                web3,
                vaultData.tokenId,
                contractTemplate.targetContract.name,
                (action, result) => {
                  console.log(`${action}: ${result}`);

                  if (action.includes("Hash")) setMintTransactionHash(result);
                }
              );

              return transactionHash;
            } catch (error) {
              console.error(error);
              toast.error(error.message);
            }
          } else {
            toast.error("Vault not found");
          }
        }
      } else {
        toast.error("Vault is empty");
      }
    },
  });

  const [warningOpen, setWarningOpen] = useState(false);

  const { isLoading: isMintTransactionPending, isSuccess: isMintSuccess } =
    useWaitForTransaction({
      hash: mintTransactionHash,
    });

  const isAwaitingTransfer =
    (isLoadingVaultBalance || !vaultBalance || vaultBalance.length === 0) &&
    !vaultData.ownership?.balances?.[0] &&
    vaultData.targetAsset.name.includes("Loading"); // This happens when vault data does not contain target asset

  const isMinting = mintTransactionHash && isMintTransactionPending;

  useEffect(() => {
    if (isMintSuccess) {
      if (onSuccess) onSuccess();
      if (refetchVaults) refetchVaults();
    }
  }, [isMintSuccess, onSuccess, refetchVaults]);

  return (
    <Box
      w="full"
      h="full"
      display={"flex"}
      justifyContent={"center"}
      pt={afterCreation ? "110px" : "16px"}
    >
      {isAwaitingTransfer ? (
        <Flex flexDir={"column"} alignItems={"center"}>
          {afterCreation && <Box h={"calc(100vh - 1080px)"} maxH={20} />}

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

          <Box textAlign={"center"}>
            {afterCreation && (
              <>
                <CheckCircleIcon
                  color={"#00FF15"}
                  width={"24px"}
                  height={"24px"}
                />

                <Text fontWeight={"bold"} fontSize={"24px"} pt={3} pb={5}>
                  Vault Created!
                </Text>
              </>
            )}

            <Text fontSize={"14px"} pb={4}>
              This is your Vault Address, Send your Ordinal here to continue
            </Text>

            <Flex
              alignItems={"center"}
              py={1}
              px={3}
              border={"1px"}
              borderColor={"grayer"}
              borderRadius={"8px"}
              mb={8}
            >
              <Text fontSize={"12px"}>{depositAddress}</Text>

              <Button
                ml={6}
                onClick={copyAddress}
                backgroundColor={"transparent"}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </Flex>

            <Flex justifyContent={"center"} alignItems={"center"}>
              <CircularProgress
                isIndeterminate
                size={"12px"}
                color="#E89900"
                trackColor="transparent"
                mr={2}
              />
              <Text color="#E89900">Awaiting ordinal to reach vault</Text>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Flex flexDir={"column"} alignItems={"center"}>
          <Box
            position={"relative"}
            width={"30vh"}
            maxW={300}
            aspectRatio={1}
            mb={5}
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
            <Box textAlign={"center"}>
              {(afterCreation || isMintSuccess) && (
                <CheckCircleIcon
                  color={"#00FF15"}
                  width={"24px"}
                  height={"24px"}
                />
              )}
              {vaultMetadata ? (
                <Text fontWeight={"bold"} fontSize={"24px"} pt={3} pb={2}>
                  {vaultMetadata.name}
                  {isMintSuccess
                    ? " Vault Minted!"
                    : afterCreation && " Received in Vault"}
                </Text>
              ) : (
                <Box h={"56px"} />
              )}

              <Text fontSize={"14px"} pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac
                risus pretium, efficitur magna sit amet, dapibus dolor.
              </Text>

              <Flex flexDir={"column"} alignItems={"center"} gap={3} mt={3}>
                {isMinting ? (
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
                      isExternal
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                      href={`https://etherscan.io/tx/${mintTransactionHash}`}
                    >
                      <Flex alignItems={"center"} gap={1}>
                        <Text>{mintTransactionHash}</Text>
                        <ExternalLinkIcon mb={"2px"} />
                      </Flex>
                    </Link>
                  </Box>
                ) : isMintSuccess ? (
                  <Link
                    color="#F73"
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                    href={"/p2p"}
                  >
                    <Flex alignItems={"center"} gap={1}>
                      <Text>Link me there</Text>
                      <ArrowForwardIcon />
                    </Flex>
                  </Link>
                ) : (
                  <>
                    <Button
                      w="308px"
                      h="48px"
                      backgroundColor={"transparent"}
                      border="1px solid #F73"
                      color="#F73"
                      _disabled={{ opacity: 0.8, cursor: "not-allowed" }}
                      _hover={{ opacity: 0.9 }}
                      _active={{ opacity: 0.8 }}
                      onClick={() => setWarningOpen(true)}
                      isDisabled={
                        isLoadingMint || !vaultBalance || isLoadingClaimChain
                      }
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
                        "UNVAULT ORDINAL"
                      )}
                    </Button>

                    {!claimData && (
                      <Button
                        w="308px"
                        h="48px"
                        backgroundColor={"transparent"}
                        border="1px solid #F73"
                        color="#F73"
                        _disabled={{ opacity: 0.8, cursor: "not-allowed" }}
                        _hover={{ opacity: 0.9 }}
                        _active={{ opacity: 0.8 }}
                        onClick={performMint}
                        isDisabled={
                          isLoadingMint || !vaultBalance || isLoadingClaimChain
                        }
                      >
                        {isLoadingMint ? (
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
                          "MINT VAULT ON ETH"
                        )}
                      </Button>
                    )}
                  </>
                )}
              </Flex>
            </Box>
          )}
        </Flex>
      )}

      <Modal
        isOpen={warningOpen}
        onClose={() => setWarningOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={bg} borderRadius={"12px"} py="8">
          <ModalHeader
            fontSize="32px"
            lineHeight={"38px"}
            fontWeight="bold"
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"2"}
          >
            Are you sure?
          </ModalHeader>
          <ModalBody>
            <Text textAlign={"center"}>
              The vault will be opened and you will be shown the <br />
              keys. Vaults that are opened can no longer be minted. You can find
              the vault in the &quot;Unlocked&quot; tab.
            </Text>

            <Flex justify="center" align="center" gap="5" pt="8">
              <Button
                bg={bg}
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 0.8 }}
                borderRadius="8px"
                border="1px solid"
                borderColor={border}
                py="4"
                px="6"
                fontSize="14px"
                fontWeight="bold"
                cursor="pointer"
                w="231px"
                h="40px"
                textAlign="center"
                onClick={() => setWarningOpen(false)}
              >
                CANCEL
              </Button>
              <Button
                bg="#F73"
                color="whiter"
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 0.8 }}
                borderRadius="8px"
                py="4"
                px="6"
                fontSize="14px"
                fontWeight="bold"
                cursor="pointer"
                w="231px"
                h="40px"
                textAlign="center"
                onClick={() => {
                  setWarningOpen(false);
                  performClaimChain();
                }}
                loadingText="Wait"
              >
                YES, UNVAULT ORDINAL
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default VaultMint;
