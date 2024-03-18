import { useModal } from "connectkit";
import { Box } from "@chakra-ui/react";
import { useAccount } from "wagmi";

export const Connect = (props) => {

  const { setOpen } = useModal();
  const { address, isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <Box bg="transparent" cursor={"pointer"} onClick={setOpen} {...props}>
          <Box
            bgImage={"/images/pfp.png"}
            backgroundSize={"cover"}
            backgroundPosition={"center"}
            backgroundRepeat={"no-repeat"}
            w="32px"
            h="32px"
          />
        </Box>
      ) : (
        <Box
          onClick={setOpen}
          bg="pinker"
          borderRadius="8px"
          px="12px"
          py="10px"
          height="45px"
          display={"flex"}
          alignItems={"center"}
          fontWeight='bold'
          color={'whiter'}
          cursor={"pointer"}
        >
          Sign In
        </Box>
      )}
    </>
  );
};
