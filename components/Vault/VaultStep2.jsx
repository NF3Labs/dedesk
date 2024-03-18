import { CheckCircleIcon, CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { useEmblemContractTemplate } from "../../utils/emblem";
import { useQuery } from "react-query";
import EmblemVaultSDK from "emblem-vault-sdk";
import { EMBLEM_VAULT_API_KEY } from "../../constants/emblem";
import VaultMint from "./VaultMint";

const VaultStep2 = ({ vaultData, handleTabChange }) => {
  return (
    <VaultMint
      vaultData={vaultData}
      onTransfer={() => handleTabChange(2)}
      afterCreation
    />
  );
};

export default VaultStep2;
