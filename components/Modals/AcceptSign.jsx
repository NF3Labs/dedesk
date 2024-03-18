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
} from "@chakra-ui/react";

export const AcceptSign = ({
  isOpen,
  onClose,
  isLoading,
  handleGoBack,
  handleContinue,
}) => {
  const border = useColorModeValue("bg.dark", "bg.light");
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent bgColor={bg} borderRadius={"12px"} p="8">
        <ModalHeader
          fontSize="32px"
          lineHeight={"38px"}
          fontWeight="bold"
          display={"flex"}
          alignItems={"center"}
          gap={"2"}
          fontFamily={"off-bit-regular"}
        >
          Welcome
          <br />
          to de[desk]
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
              <>
                Swaps conducted via de[desk] can only be accessed through the
                dashboard once you&apos;ve connected to our site. We recommend
                bookmarking this page for easy access.
                {/* <br />
                <br />
                Please bookmark this page immediately. */}
                <br />
                <br />
                Click &quot;ACCEPT AND SIGN&quot; to connect to the de[desk]
                dApp. You will then be prompted to sign a message with your
                wallet. By selecting &quot;ACCEPT AND SIGN,&quot; you
                acknowledge the importance of not clicking on any links related
                to a swap with de[desk], as this is a common method for phishing
                attacks.
              </>
            </Box>
          </Flex>
          <Flex justify="center" align="center" gap="5" pt="8">
            <Button
              bg="pinker"
              color="whiter"
              _hover={{ bg: "pinkerHover" }}
              borderRadius="8px"
              py="4"
              px="6"
              fontSize="14px"
              fontWeight="bold"
              cursor="pointer"
              w="231px"
              h="40px"
              textAlign="center"
              onClick={handleContinue}
              isDisabled={isLoading}
              isLoading={isLoading}
              loadingText="Wait"
            >
              ACCEPT AND SIGN
            </Button>
            <Button
              bg={bg}
              _hover={bg}
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
              onClick={handleGoBack}
              isDisabled={isLoading}
            >
              CANCEL
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
