import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import { getBeautifulAddress } from "../../utils/formatters";
import VaultMint from "./VaultMint";
import VaultClaim from "./VaultClaim";
import { useQuery } from "react-query";

const VaultDashboardCard = ({ vault, type, refetchVaults }) => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const content = useColorModeValue("content.light", "content.dark");

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderModalContent = () => {
    switch (type) {
      case "unclaimed":
        return (
          <VaultClaim
            vaultData={vault}
            step="unclaimed"
            refetchVaults={refetchVaults}
          />
        );
      case "claimed":
        return (
          <VaultClaim
            vaultData={vault}
            step="claimed"
            refetchVaults={refetchVaults}
            onSuccess={handleClose}
          />
        );
      case "unminted":
        return (
          <VaultMint
            vaultData={vault}
            onSuccess={handleClose}
            refetchVaults={refetchVaults}
          />
        );
    }
  };

  const vaultItem = vault.ownership.balances?.[0];

  return (
    <Card borderRadius={"16px"} bg={bg}>
      <CardBody
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        position={"relative"}
        width="full"
        gap={3}
        px={3}
      >
        {type === "unminted" ? (
          <Box
            position={"relative"}
            w="full"
            maxW={vaultItem ? 125 : 160}
            aspectRatio={vaultItem ? 1 : 1.43}
            my={2}
            h={125}
          >
            <Image
              src={vaultItem?.image ?? "/images/vault/vault-graphic.png"}
              layout="fill"
              alt="vault"
            />
          </Box>
        ) : (
          <Box
            position={"relative"}
            w="full"
            maxW={160}
            aspectRatio={vaultItem ? 1 : 1.43}
          >
            <Image
              src={vaultItem?.image ?? "/images/vault/vault-graphic.png"}
              layout="fill"
              alt="vault"
            />
          </Box>
        )}
        <Box w="full" maxW={160} mb={1}>
          <Text fontSize={"12px"}>
            {type === "unminted" || !vaultItem
              ? getBeautifulAddress(
                  vault.addresses.find((address) => {
                    return address.coin == "TAP";
                  })?.address
                )
              : vaultItem.name}
          </Text>
          {type === "unminted" || !vaultItem ? (
            <Text fontSize={"12px"} color={content}>
              Assets in Vault:&nbsp;
              {vault?.ownership.balances ? vault.ownership.balances.length : 0}
            </Text>
          ) : (
            <Text fontSize={"12px"} color={content}>
              {vaultItem.project}
            </Text>
          )}
        </Box>

        <Button
          w="full"
          onClick={() => setIsOpen(true)}
          backgroundColor={"bitcoin"}
          boxShadow="0px 0px 5.5px 0px #B64C00 !important"
          _disabled={{ opacity: 0.8, cursor: "not-allowed" }}
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 0.8 }}
        >
          {type === "unminted"
            ? vaultItem
              ? "MINT VAULT"
              : "DEPOSIT ORDINAL"
            : type === "claimed"
            ? "VIEW KEYS"
            : "UNLOCK VAULT"}
        </Button>
      </CardBody>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bgColor={bg}
          borderRadius={"12px"}
          p="8"
          gap={0}
          w="85vw"
          maxW="1044px"
        >
          <ModalBody px="6" borderRadius={"12px"}>
            {renderModalContent()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default VaultDashboardCard;
