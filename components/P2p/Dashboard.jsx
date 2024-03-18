import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spacer,
  Link,
  HStack,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { P2p_find } from "../Icons/P2p_find";
import { P2p_select } from "../Icons/P2p_select";
import { P2p_offer } from "../Icons/P2p_offer";
import { P2p_submit } from "../Icons/P2p_submit";
import { Logo } from "../Icons/Logo";

import { Discord } from "../Icons/Discord";
import { Mail } from "../Icons/Mail";
import { Twitter } from "../Icons/Twitter";
import Image from "next/image";
import { Verified } from "../Icons/Verified";

export const Dashboard = ({ onTrade }) => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const realBg = useColorModeValue("bg.light", "bg.dark");
  const content = useColorModeValue("content.light", "content.dark");
  const header = useColorModeValue("header.light", "header.dark");
  const input = useColorModeValue("input.light", "input.dark");

  const list = [
    {
      title: "FIND A USER",
      content:
        "Enter the wallet address of the person you are looking to complete a swap with",
    },
    {
      title: "I'M LOOKING FOR",
      content:
        "Select the items from the other persons wallet that you wish to swap for",
    },
    {
      title: "I'M OFFERING",
      content:
        "Select the items from your own wallet that you wish to offer in the swap",
    },
    {
      title: "PREVIEW & SUBMIT",
      content:
        "Verify the swap deal before submitting to the chain for the other person to approve and complete the swap",
    },
  ];

  const faq = [
    {
      title: "What is a P2P Direct Swap?",
      content:
        "P2P Direct Swap refers to the exchange of non-fungible tokens (NFTs) and/or Fungible Tokens (FTs) between two individuals without the involvement of a centralized platform or third-party intermediary.",
    },
    {
      title: "What are cross-chain swaps?",
      content:
        "Cross-chain swaps refer to the exchange of NFTs and/or FTs between different blockchain networks, such as Polygon and Ethereum. This requires the use of bridging protocols, which enable the transfer of assets between the two networks while maintaining their unique characteristics. P2P Direct Swaps cross-chain are under development and will be released at a later date.",
    },
    {
      title:
        "Currently, which chains do we provide support for in P2P trades/swaps?",
      content:
        "We provide support for the Polygon (Matic) chain and the Ethereum chain. This allows for the exchange of NFTs between these two networks through P2P Direct Swap transactions. See section above for full list of supported tokens & collections.",
    },
    {
      title: "Is there a service fee?",
      content:
        "There are no fees for using P2P Direct Swap, just pay for the gas.",
    },
    {
      title: "How does it work?",
      content: `To learn how to swap P2P on our platform, please visit the "How to Swap P2P" section on our website. You can also ask any questions you may have in our discord.`,
    },
    {
      title: "Can I cancel a swap?",
      content:
        "Yes, you can cancel any swap offer you make through the P2P tab in your dashboard. However, please note that you can only cancel the swap offer prior to the expiration time or before the counterparty accepts or rejects your swap offer.",
    },
    {
      title:
        "I want to swap an NFT or FT that's not supported. How can I do that?",
      content: `If a token or collection is not listed under "Supported Tokens & Collections" please submit a ticket on our discord and our team will happily review the asset for approval.`,
    },
    {
      title:
        "How do I know that the asset I am requesting or I have been offered is from a verified collection?",
      content: `NF3 whitelists for swap a limited number of token & NFT collection contracts so you can be sure that the asset you have requested or have been offered is the correct one. Look out for <Verified/> to ensure that the asset is indeed verified.`,
    },
    {
      title: "When will you support Phantom wallet?",
      content:
        "We are working on Phantom wallet integration and hope to have that supported in the near future. For now, we recommend using a dedicated/segregated hot wallet such as MetaMask.",
    },
  ];

  const middle = [
    {
      title: "Ethereum",
      content: "ETH, WETH, USDC",
      image: "p2p-middle-eth.png",
    },
  ];

  return (
    <>
      <Box w="full" mt="84px" position="relative" overflowX="hidden">
        <HStack spacing="4" align="center" justify="center">
          <Text fontSize="32px" fontWeight="bold" textAlign="center" mr="2">
            P2P Direct Swap
          </Text>
          <Image
            src="/images/beta-text.svg"
            alt="Beta"
            width={52}
            height={17}
          />
        </HStack>
        <Flex alignItems="center">
          <Text
            m="auto"
            fontSize="14px"
            textAlign="center"
            mt="16px"
            maxW="717px"
          >
            Securely swap your NFT(s) peer-to-peer
          </Text>
        </Flex>

        <Flex mt="32px">
          <Flex m="auto">
            <Box
              bgImage={"/images/p2p-ether-icon.png"}
              backgroundSize="contain"
              backgroundPosition={"center"}
              backgroundRepeat={"no-repeat"}
              h="60px"
              w="60px"
            />
            <Box
              bgImage={"/images/p2p-poly-icon.png"}
              backgroundSize="contain"
              backgroundPosition={"center"}
              backgroundRepeat={"no-repeat"}
              h="60px"
              w="60px"
              ml="20px"
            />
          </Flex>
        </Flex>
        <Flex>
          <Box
            cursor="pointer"
            m="auto"
            mt="32px"
            h="48px"
            bg="pinker"
            borderRadius="8px"
            fontSize="14px"
            fontWeight="bold"
            py="14px"
            px="78px"
            color="white"
            _hover={{ color: "whiteHover" }}
            onClick={onTrade}
          >
            CREATE NEW SWAP
          </Box>
        </Flex>
        <Box
          bg={bg}
          borderRadius="21px"
          mt="60px"
          mx="40px"
          px="40px"
          py="48px"
        >
          <Text fontSize="24px" fontWeight="bold" textAlign="center">
            How P2P Works
          </Text>
          <Grid mt="32px" templateColumns="repeat(4, 1fr)" gap={6}>
            {list.map((i, j) => {
              return (
                <GridItem key={j} w="100%" bg={realBg} borderRadius="19px">
                  <Box my="37px" mx="28px">
                    <Flex mb="20px">
                      <Box h="80px" m="auto">
                        {j === 0 ? (
                          <P2p_find />
                        ) : j === 1 ? (
                          <P2p_select />
                        ) : j === 2 ? (
                          <P2p_offer />
                        ) : (
                          <P2p_submit />
                        )}
                      </Box>
                    </Flex>
                    <Text fontSize="14px" fontWeight="bold" textAlign="center">
                      {i.title}
                    </Text>
                    <Text
                      mt="20px"
                      fontSize="12px"
                      color={content}
                      textAlign="center"
                    >
                      {i.content}
                    </Text>
                  </Box>
                </GridItem>
              );
            })}
          </Grid>
        </Box>
        <Box
          bg={bg}
          borderRadius="21px"
          mt="60px"
          mx="40px"
          px="40px"
          py="48px"
        >
          <Text fontSize="24px" fontWeight="bold" textAlign="center">
            Supported Tokens & Collections
          </Text>
          <Box
            mt="32px"
            overflowY="hidden"
            overflowX="auto"
            display="flex"
            sx={{
              "&::-webkit-scrollbar": {
                width: "3px",
                height: "10px",
                borderRadius: "2px",
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: input,
                borderRadius: "2px",
              },
            }}
          >
            <Flex justify="center" width="100%">
              {middle.map((i, j) => {
                return (
                  <Box key={j} borderRadius="19px">
                    <Box my="37px" mx="28px">
                      <Box
                        bgImage={`/images/${i.image}`}
                        backgroundSize="contain"
                        backgroundPosition={"center"}
                        backgroundRepeat={"no-repeat"}
                        h="180px"
                        w="180px"
                      />
                      <Text
                        mt="12px"
                        fontSize="16px"
                        fontWeight="bold"
                        textAlign="center"
                      >
                        {i.title}
                      </Text>
                      <Text fontSize="12px" textAlign="center">
                        {i.content}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
            </Flex>
          </Box>
        </Box>
        <Box bg={bg} borderRadius="21px" mt="60px" mb="140" mx="40px" py="48px">
          <Text mb="32px" fontSize="24px" fontWeight="bold" textAlign="center">
            P2P Direct Swap FAQ
          </Text>
          <Accordion allowMultiple>
            {faq.map((item, index) => {
              return (
                <AccordionItem
                  key={index}
                  border="none"
                  borderBottom={`1px solid`}
                  borderColor={realBg}
                >
                  <h2>
                    <AccordionButton px="40px">
                      <Flex
                        as="span"
                        flex="1"
                        textAlign="left"
                        alignItems="center"
                        fontSize="14px"
                        fontWeight="bold"
                      >
                        <Text
                          mr="32px"
                          fontSize="32px"
                          fontWeight="bold"
                          color={header}
                        >
                          {index < 9 ? "0" + (index + 1) : index + 1}
                        </Text>
                        {item.title}
                      </Flex>
                      <Box
                        borderRadius="50%"
                        bgColor="content.light"
                        color="whiter"
                        display="flex"
                        p="5px"
                      >
                        <AccordionIcon />
                      </Box>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} fontSize="14px" pl="120px" pr="80px">
                    {index === 7 ? (
                      <>
                        NF3 whitelists for swap a limited number of token & NFT
                        collection contracts so you can be sure that the asset
                        you have requested or have been offered is the correct
                        one. Look out for{" "}
                        <span
                          style={{ display: "inline-block", margin: "0 5px" }}
                        >
                          <Verified />
                        </span>{" "}
                        to ensure that the asset is indeed verified.
                      </>
                    ) : (
                      item.content
                    )}
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Box>
        {/* <Flex
          position="absolute"
          bg={bg}
          bottom="0"
          right="0"
          w="full"
          py="20px"
          px="40px"
          borderTop={`1px solid`}
          borderColor={header}
          alignItems="center"
        >
          <Logo />
          <Text ml="28px" fontSize="12px" fontWeight="bold">
            Copyright DeDesk {(new Date()).getFullYear()}, All rights reserved
          </Text>
          <Spacer />
          <Text fontSize="12px">Audited by:&nbsp;</Text>
          <Link
            href="https://skynet.certik.com/projects/nf3x"
            target="_blank"
            mr="32px"
            display="flex"
          >
            <Text color="bluer" as="u" fontSize="12px">
              Certik
            </Text>
          </Link>
          <Link href="https://discord.gg/CzvRf6Gkqs" target="_blank" mr="21px">
            <Discord />
          </Link>
          <Link
            href="https://twitter.com/nf3exchange"
            target="_blank"
            mr="21px"
          >
            <Twitter />
          </Link>
          <Link href="mailto:hello@nf3x.io" target="_blank">
            <Mail />
          </Link>
        </Flex> */}
      </Box>
    </>
  );
};
