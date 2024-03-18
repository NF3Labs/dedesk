import {
  Box,
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Text,
} from "@chakra-ui/react";
import React from 'react'

const BtcModal = ({
  isOpen,
  onClose,
}) => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent
        bgColor={bg}
        borderRadius={"12px"}
        p="8"
      >
        <ModalHeader
          fontSize="32px"
          lineHeight={"38px"}
          fontWeight="bold"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"2"}
        >
          Vault & Trade a <Text color="bitcoin">BTC NFT</Text>
        </ModalHeader>
        <ModalBody px="6" borderRadius={"12px"}>
          <Flex
            flexDirection={"column"}
            gap="8"
            w="full"
            justifyContent={"center"}
          >
            {/* <NF3Logo /> */}

            <Box w="450px" fontSize="14px">
              WIP  - not sure if video or text will be used
            </Box>
          </Flex>

        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default BtcModal