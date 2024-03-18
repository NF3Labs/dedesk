import {
  Box,
  Button,
  CircularProgress,
  Flex,
  IconButton,
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
import { CheckIcon, CopyIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const VaultKeys = ({ claimData }) => {
  const content = useColorModeValue("content.light", "content.dark");
  const surface = useColorModeValue("surface.light", "surface.dark");

  const [revealPhrase, setRevealPhrase] = useState(false);

  const [copiedPhrase, setCopiedPhrase] = useState(false);
  const copyPhrase = useCallback(async () => {
    if (claimData) {
      await navigator.clipboard.writeText(claimData.phrase);
      setCopiedPhrase(true);
      setTimeout(() => setCopiedPhrase(false), 400);
    }
  }, [claimData, setCopiedPhrase]);

  const [revealPrivateKey, setRevealPrivateKey] = useState(false);

  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);
  const copyPrivateKey = useCallback(async () => {
    if (claimData) {
      await navigator.clipboard.writeText(claimData.key);
      setCopiedPrivateKey(true);
      setTimeout(() => setCopiedPrivateKey(false), 400);
    }
  }, [claimData, setCopiedPrivateKey]);

  return (
    <Flex flexDir={"column"} gap={7}>
      <Box>
        <Flex alignItems={"center"} gap={1} mb={2}>
          <Text fontSize={"14px"} color={content}>
            Seed Phrase
          </Text>
          <IconButton
            icon={revealPhrase ? <ViewIcon /> : <ViewOffIcon />}
            bg="transparent"
            p={0}
            isRound
            size="sm"
            onClick={() => setRevealPhrase(!revealPhrase)}
          />
        </Flex>
        <Flex
          position="relative"
          flexWrap={"wrap"}
          justifyContent={"center"}
          w="529px"
          border="1px solid #3D3D3D"
          borderRadius={"8px"}
          py={4}
          px={6}
          gap={2}
        >
          {!revealPhrase && (
            <Box
              position="absolute"
              filter={"blur(0.3rem)"}
              w="full"
              h="full"
              top={0}
              bg={surface}
              zIndex={99}
            />
          )}

          {claimData.phrase.split(" ").map((word, index) => (
            <Box key={index} bg={surface} py={1} px={3} borderRadius={24}>
              <Text fontSize={"14px"}>{word}</Text>
            </Box>
          ))}
          <Button
            px={1}
            h={"29px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            onClick={copyPhrase}
            backgroundColor={"transparent"}
          >
            {copiedPhrase ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </Flex>
      </Box>

      <Box>
        <Flex alignItems={"center"} gap={1} mb={2}>
          <Text fontSize={"14px"} color={content}>
            Vault Private Key
          </Text>
          <IconButton
            icon={revealPrivateKey ? <ViewIcon /> : <ViewOffIcon />}
            bg="transparent"
            p={0}
            isRound
            size="sm"
            onClick={() => setRevealPrivateKey(!revealPrivateKey)}
          />
        </Flex>
        <Flex
          position="relative"
          alignItems={"center"}
          justifyContent={"center"}
          w="529px"
          border="1px solid #3D3D3D"
          borderRadius={"8px"}
          py={4}
          px={6}
          gap={2}
        >
          {!revealPrivateKey && (
            <Box
              position="absolute"
              filter={"blur(0.3rem)"}
              w="full"
              h="full"
              top={0}
              bg={surface}
              zIndex={99}
            />
          )}

          <Text fontSize={"14px"} whiteSpace={"break-spaces"} w="95%">
            {claimData.key}
          </Text>
          <Button
            px={1}
            h={"29px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            onClick={copyPrivateKey}
            backgroundColor={"transparent"}
          >
            {copiedPrivateKey ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default VaultKeys;
