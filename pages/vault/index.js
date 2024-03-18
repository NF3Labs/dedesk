import {
  Avatar,
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import VaultStep1 from "../../components/Vault/VaultStep1";
import VaultStep2 from "../../components/Vault/VaultStep2";
import VaultStep3 from "../../components/Vault/VaultStep3";
import { ENABLE_BTC } from "../../constants/emblem";
import { useRouter } from "next/router";

const steps = [
  { label: "1", description: "Create BTC Vault" },
  { label: "2", description: "Send Ordinal to Vault" },
  { label: "3", description: "Mint Ordinal Vault" },
];

export default function Vault() {
  const router = useRouter();
  const surface = useColorModeValue("surface.light", "surface.dark");
  const header = useColorModeValue("header.light", "header.dark");
  const content = useColorModeValue("content.light", "content.dark");

  const [tab, setTab] = useState(0);
  const [vaultData, setVaultData] = useState(null);

  const handleVaultData = (data) => {
    setVaultData(data);
  };

  const handleTabChange = (index) => {
    setTab(index);
  };

  if (!ENABLE_BTC) {
    router.push("/");
    return;
  }

  return (
    <Box>
      <Box w="full" pt="32px" height="full">
        <Grid templateColumns="repeat(2, 1fr)" mx={"35vw"} mb="-8px">
          {new Array(2).fill(0).map((item, index) => {
            return (
              <GridItem
                key={index}
                h="8px"
                // bg={(tab <= index) ? surface : 'pinker'}
                bg={surface}
                position="relative"
                sx={{ transition: "all 0.5s ease-in" }}
              >
                <Box
                  position="absolute"
                  top="-10px"
                  left={index === 0 ? "-46px" : "-65px"}
                  textAlign="center"
                >
                  <Flex
                    display="inline-block"
                    borderRadius="full"
                    // bg={tab >= index ? 'pinker' : header}
                    border={`2px solid`}
                    borderColor={tab === index ? "pinker" : surface}
                    sx={{ transition: "all 0.5s ease-in" }}
                  >
                    <Avatar
                      m="auto"
                      name={steps[index].label}
                      // bg={tab >= index ? 'pinker' : header}
                      bg={header}
                      border="none"
                      sx={{ transition: "all 0.5s ease-in" }}
                      width={"24px"}
                      height={"24px"}
                      size="sm"
                    />
                  </Flex>
                  <Box
                    mt="12px"
                    fontSize="12px"
                    px="8px"
                    py="6px"
                    borderRadius="full"
                    // bg={tab < index ? surface : 'pinker'}
                    // color={tab >= index ? 'whiter' : content}
                    bg={surface}
                    border={`1px solid`}
                    borderColor={tab === index ? "pinker" : surface}
                    sx={{ transition: "all 0.5s ease-in" }}
                  >
                    {steps[index].description}
                  </Box>
                </Box>
                {index === 1 && (
                  <Box
                    key={4}
                    position="absolute"
                    top="-10px"
                    right="-46px"
                    textAlign="center"
                  >
                    <Flex
                      display="inline-block"
                      borderRadius="full"
                      // bg={tab >= (index + 1) ? 'pinker' : header}
                      border={`2px solid`}
                      borderColor={
                        tab === index + 1 || tab === 4 ? "pinker" : surface
                      }
                    >
                      <Avatar
                        m="auto"
                        name={steps[index + 1].label}
                        // bg={tab >= index ? 'pinker' : header}
                        bg={header}
                        border="none"
                        width={"24px"}
                        height={"24px"}
                        size="sm"
                      />
                    </Flex>
                    <Box
                      mt="12px"
                      fontSize="12px"
                      px="8px"
                      py="6px"
                      borderRadius="full"
                      // bg={tab < index + 1 ? surface : 'pinker'}
                      // color={tab >= index + 1 ? 'whiter' : content}
                      bg={surface}
                      border={`1px solid`}
                      borderColor={
                        tab === index + 1 || tab === 4 ? "pinker" : surface
                      }
                    >
                      {steps[index + 1].description}
                    </Box>
                  </Box>
                )}
              </GridItem>
            );
          })}
        </Grid>
        {tab === 0 ? (
          <VaultStep1
            handleTabChange={handleTabChange}
            handleVaultData={handleVaultData}
          />
        ) : tab === 1 || tab === 2 ? (
          <VaultStep2 vaultData={vaultData} handleTabChange={handleTabChange} />
        ) : (
          <></>
        )}

        <Box
          position="absolute"
          top="-86px"
          left="0"
          w="100vw"
          h="100vh"
          zIndex="-1"
        >
          <Image src="/images/dots.svg" layout="fill" alt="" />
        </Box>
      </Box>
    </Box>
  );
}
