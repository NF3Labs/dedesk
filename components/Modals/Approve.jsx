import {
  Box,
  Stack,
  HStack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Image,
  Button,
} from "@chakra-ui/react";
import { useAppContext } from "../../contexts/App";
import { NF3Spinner } from "../Spinner/NF3Spinner";

export const Approve = ({ data, isOpen, onClose, handleContinue }) => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const color = useColorModeValue("content.light", "content.dark");
  const stackColor = useColorModeValue("primary", "secondary");
  const appContext = useAppContext();

  const Instructions = () => {
    if (data?.isLoading) {
      return (
        <>
          <NF3Spinner />
        </>
      );
    } else {
      return (
        <Stack color={stackColor}>
          <Button
            bg={"secondary"}
            _hover={{ color: "primary" }}
            _focus={{ color: "primary" }}
            color="primary"
            borderRadius="4px"
            textAlign="center"
            py="5"
            px="10"
            fontWeight="bold"
            fontSize="12px"
            w={"150px"}
            onClick={handleContinue}
          >
            CONTINUE
          </Button>
        </Stack>
      );
    }
  };

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="lg"
    >
      <ModalOverlay />
      <ModalContent bgColor={bg} borderRadius={"12px"}>
        <ModalHeader
          pt="6"
          fontSize="24px"
          fontWeight="bold"
          textAlign="center"
        >
          {/* {title} */}
          {data?.title}
        </ModalHeader>
        {!data?.isLoading && <ModalCloseButton />}
        <Stack p="6" spacing={"6"}>
          <HStack fontSize={"12px"} justifyContent={"space-between"}>
            <HStack>
              <Box
                w="60px"
                h="60px"
                borderRadius="6px"
                bgColor={useColorModeValue("lightBg.light", "lightBg.dark")}
              >
                <Image
                  src={
                    data?.isNFT
                      ? appContext?.getCollection(data?.contractAddress)?.[0]
                        ?.image
                      : appContext?.getToken(5, data?.contractAddress)?.[0]
                        ?.logo
                  }
                  w="60px"
                  h={"full"}
                  alt=""
                  bg="transparent"
                />
              </Box>
              <Stack spacing="0">
                {data?.isNFT && (
                  <Box fontWeight={"bold"}>
                    {
                      appContext?.getCollection(data?.contractAddress)?.[0]
                        ?.name
                    } # {data?.token && data?.token}
                  </Box>
                )}
                {/* {data?.collectionName && <Box color={color}>{data?.collectionName}</Box>} */}
                {data?.isNFT ? (
                  <Box color={color}>{`Chain: Ethereum`}</Box>
                ) : (
                  <Box fontWeight={"bold"}>{`${appContext?.getToken(5, data?.contractAddress)?.[0]?.name
                    }`}</Box>
                )}
              </Stack>
            </HStack>
            {data?.count && data?.count > 1 && (
              <Box
                fontWeight={"bold"}
              >{`${data?.current} of ${data?.count}`}</Box>
            )}
          </HStack>
          <Box
            w="full"
            h="2px"
            bgColor={useColorModeValue("lightBg.light", "lightBg.dark")}
          />
          <Stack color={stackColor}>
            <Box fontSize={"16px"} fontWeight={"bold"}>
              Go to your wallet
            </Box>
            <Box fontSize={"14px"}>{data?.alert}</Box>
          </Stack>
          <Instructions />
        </Stack>
      </ModalContent>
    </Modal>
  );
};
