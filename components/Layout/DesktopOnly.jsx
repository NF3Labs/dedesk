import { Flex, Box } from "@chakra-ui/react";
import { MINSCREEN_WIDTH } from "../../constants/minscreenWidth";

export const DesktopOnly = () => {
  return (
    <Flex justify={"center"} align="center" h="full">
      <Box fontWeight={"bold"} textAlign={"center"}>
        Currently Only Available For Screens {MINSCREEN_WIDTH}px or Larger.
      </Box>
    </Flex>
  );
};
