import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Spacer,
  Tab,
  TabList,
  Tabs,
  Text,
  keyframes,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { EMBLEM_VAULT_API_KEY } from "../../constants/emblem";
import EmblemVaultSDK from "emblem-vault-sdk";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { NF3Spinner } from "../Spinner/NF3Spinner";
import Image from "next/image";
import { getBeautifulAddress } from "../../utils/formatters";
import VaultDashboardCard from "./VaultDashboardCard";
import { useEmblemContractTemplate } from "../../utils/emblem";
import { RepeatIcon } from "@chakra-ui/icons";

const VaultDashboard = () => {
  const { address } = useAccount();
  const sdk = new EmblemVaultSDK(EMBLEM_VAULT_API_KEY);

  const { contractTemplate } = useEmblemContractTemplate();

  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const content = useColorModeValue("content.light", "content.dark");

  const VAULT_TYPE = ["unclaimed", "claimed", "unminted"];
  const [tabIndex, setTabIndex] = useState(0);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["vaults", tabIndex],
    queryFn: async () => {
      try {
        const data = await sdk.fetchVaultsOfType(VAULT_TYPE[tabIndex], address);

        return data;
      } catch (error) {
        toast.error(error.message);
        console.error(error);
      }
    },
    enabled: Boolean(address),
  });

  const handleTabsChange = (index) => {
    if (isLoading) return;

    setTabIndex(index);
  };

  const [isSpinning, setIsSpinning] = useState(false);
  const spin = keyframes`  
  from {transform: rotate(0deg);}   
  to {transform: rotate(360deg)} 
`;

  const handleRefresh = () => {
    refetch();
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <>
      <Flex gap={5}>
        <Tabs
          variant="unstyled"
          isFitted
          index={tabIndex}
          onChange={handleTabsChange}
        >
          <Flex alignItems={"center"} gap={2}>
            <TabList bg={bg} borderRadius="8px">
              <Tab
                py="3"
                borderRadius={"8px"}
                fontSize="14px"
                _selected={{
                  color: "whiter",
                  bg: "pinker",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Locked
              </Tab>
              <Flex alignItems={"center"}>
                <Divider orientation="vertical" height="60%" />
              </Flex>
              <Tab
                py="3"
                borderRadius={"8px"}
                fontSize="14px"
                _selected={{
                  color: "whiter",
                  bg: "pinker",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Unlocked
              </Tab>
              <Flex alignItems={"center"}>
                <Divider orientation="vertical" height="60%" />
              </Flex>
              <Tab
                py="3"
                fontSize="14px"
                borderRadius={"8px"}
                _selected={{
                  color: "whiter",
                  bg: "pinker",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Unminted
              </Tab>
            </TabList>

            <IconButton
              animation={isSpinning ? `${spin} infinite 1s ease` : ""}
              onClick={handleRefresh}
              bg="transparent"
              icon={<RepeatIcon />}
              _hover={{ bg: "transparent" }}
            />
          </Flex>
        </Tabs>
        <Spacer />
      </Flex>
      <Box flex="1 1 0%" overflow={"scroll"}>
        <Box height={"fit-content"}>
          {isLoading || isRefetching ? (
            <Box mt="32px">
              <NF3Spinner />
            </Box>
          ) : !data || data.length === 0 ? (
            <Flex py="10vh" justifyContent="center" align="center">
              <Box textAlign={"center"}>No Items Found</Box>
            </Flex>
          ) : (
            <Grid
              templateColumns={{
                base: "repeat(4, 1fr)",
                xl: "repeat(5, 1fr)",
                "2xl": "repeat(6, 1fr)",
              }}
              gap={6}
              height={"fit-content"}
            >
              {data
                .filter(
                  (vault) =>
                    vault.targetContract["1"] ===
                    contractTemplate.targetContract["1"]
                )
                .sort((a, b) => b.ownership.id - a.ownership.id)
                .map((vault, index) => {
                  return (
                    <GridItem key={index} w="100%">
                      <VaultDashboardCard
                        vault={vault}
                        type={VAULT_TYPE[tabIndex]}
                        refetchVaults={refetch}
                      />
                    </GridItem>
                  );
                })}
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
};

export default VaultDashboard;
