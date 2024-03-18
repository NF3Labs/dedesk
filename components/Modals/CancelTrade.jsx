import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";

export const CancelTrade = ({
  handleGoBack,
  handleContinue,
  isOpen,
  onClose,
}) => {
  const border = useColorModeValue("bg.dark", "bg.light");
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={bg} borderRadius={"12px"}>
        <Box py="6" px="8" pos="relative">
          <Text fontSize="20px" fontWeight="bold" textAlign="center">
            Are You Sure?
          </Text>
          <Text
            fontSize="14px"
            pt="20px"
            textAlign="center"
            color={useColorModeValue("content.light", "content.dark")}
          >
            Are you sure you want to cancel this swap? <br />
            Progress will not be saved.
          </Text>
          <Flex justify="center" align="center" pt="8" gap="6">
            <Box
              width={"165px"}
              display={"flex"}
              justifyContent={"center"}
              border={"1px solid"}
              borderColor={border}
              borderRadius="8px"
              py="3"
              fontSize="14px"
              fontWeight="bold"
              onClick={handleGoBack}
              cursor="pointer"
              _hover={{ opacity: "0.7" }}
            >
              NO,&nbsp;GO&nbsp;BACK
            </Box>
            <Box
              width={"165px"}
              display={"flex"}
              justifyContent={"center"}
              bg={"pinker"}
              color="whiter"
              borderRadius="8px"
              py="3"
              fontSize="14px"
              fontWeight="bold"
              cursor="pointer"
              onClick={handleContinue}
              _hover={{ opacity: "0.7" }}
            >
              YES,&nbsp;CANCEL&nbsp;SWAP
            </Box>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};
