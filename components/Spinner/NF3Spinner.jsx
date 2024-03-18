import { Flex, Box, CircularProgress } from "@chakra-ui/react";
import { NF3Logo } from "../Icons/NF3Logo";


export const NF3Spinner = (props) => {
  return (
    <Flex w="full" justifyContent={"center"} {...props}>
      <CircularProgress isIndeterminate color='pinker' />
    </Flex>
  );
};
