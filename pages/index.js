import {
  Stack,
  Flex,
  Spacer,
  Box,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Button,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { P2PItem } from "../components/P2p/P2PItem";
import { useRouter } from "next/router";
import { P2PStatus } from "../components/Modals/P2PStatus";
import { useDisclosure } from "@chakra-ui/react";
import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useDisconnect,
  useSigner,
} from "wagmi";
import { NF3Spinner } from "../components/Spinner/NF3Spinner";
import { sortListingResponse } from "../utils/formatters";
import { errorToast, infoToast } from "./_app";
import { getRequiredChain } from "../utils/ScInteractions/getChain";
import { CHAIN } from "../constants/chain";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SwapCompleted } from "../components/Modals/SwapCompleted";
import { Approve } from "../components/Modals/Approve";
import { useAppContext } from "../contexts/App";
import axios from "axios";
import { ethers, constants } from "ethers";
import {
  FeeConfiguration,
  optional,
} from "../constants/royalty_fee_configuration";
import Image from "next/image";
import { Verified } from "../components/Icons/Verified";
import { useModal } from "connectkit";
import BtcModal from "../components/Modals/BtcModal";
import { ENABLE_BTC } from "../constants/emblem";

export default function ActiveOptions() {
  const bg = useColorModeValue("bg.light", "bg.dark");
  const lightBg = useColorModeValue("lightBg.dark", "lightBg.dark");
  const content = useColorModeValue("content.dark", "content.light");
  const header = useColorModeValue("header.light", "header.dark");
  const surface = useColorModeValue("surface.light", "surface.dark");
  const input = useColorModeValue("input.light", "input.dark");

  const appContext = useAppContext();

  const router = useRouter();
  const { setOpen } = useModal();
  const { address, isConnected } = useAccount();

  const [createClicked, setCreateClicked] = useState(false);

  const handleCreate = async () => {
    setCreateClicked(true);
    if (isConnected) {
      window.sessionStorage.setItem("dashboard-p2p", true);
      router.push("/p2p");
    } else {
      setOpen();
    }
  };

  const handleVaultOrdinals = () => {
    if (isConnected) {
      router.push("/vault");
    } else {
      setOpen();
    }
  };

  const [btcModalOpen, setBtcModalOpen] = useState(false);
  const handleOpenBtcModal = () => {
    setBtcModalOpen(true);
  };

  const handleCloseBtcModal = () => {
    setBtcModalOpen(false);
  };

  useEffect(() => {
    if (createClicked && isConnected) {
      handleCreate();
      setCreateClicked(false);
    }
  }, [createClicked, isConnected]);

  const steps = useMemo(() => [
    {
      icon: "/images/steps/step1.svg",
      title: "Find User",
      description:
        "Enter the ENS or wallet address of the individual you wish to swap with.",
    },
    {
      icon: "/images/steps/step2.svg",
      title: "Request NFTs",
      description:
        "Select NFTs and/or tokens from the user’s wallet that you wish to swap for.",
    },
    {
      icon: "/images/steps/step3.svg",
      title: "Your Offer",
      description:
        "Select NFTs and/or tokens from your wallet that you wish to offer in the swap.",
    },
    {
      icon: "/images/steps/step4.svg",
      title: "Preview & Submit",
      description:
        "Confirm your swap offer and submit it to the blockchain. If the other person approves it, your swap will be completed.",
    },
  ]);

  const faq = useMemo(() => [
    {
      title: "What is a P2P Direct Swap?",
      content:
        "The direct exchange of NFTs and/or fungible tokens between two parties without a central platform or intermediary.",
    },
    {
      title: "Which chains does de[desk] support?",
      content:
        "Currently, we support Ethereum mainnet, with plans to add support for BTC Ordinals soon.",
    },
    {
      title: "Is there a fee for using de[desk]?",
      content:
        "There are no platform or royalty fees on de[desk]. You only need to pay for gas fees.",
    },
    {
      title: "Can I cancel a swap offer?",
      content: `Yes, you can cancel a swap offer in your dashboard, as long as it’s before the expiration time or before the counterparty accepts or rejects it.`,
    },
    {
      title: "What if I want to swap an unsupported NFT or FT on de[desk]?",
      content:
        "If the token or collection is not listed under “Supported Assets” or “Supported Chains”, submit a support request in our Discord server for review and potential approval.",
    },
    {
      title: "How can I verify the legitimacy of an asset?",
      content: `de[desk] whitelists specific token and NFT collection contracts, so only legitimate assets may be traded on the platform.`,
    },
    // {
    //   title:
    //     "How do I know that the asset I am requesting or I have been offered is from a verified collection?",
    //   content: `de[desk] whitelists a limited number of token & NFT collection contracts, so you can be sure that the asset you have requested or have been offered is the legitimate one. Look out for Verified check mark to ensure that the asset is indeed verified.`,
    // },
  ]);

  return (
    <Flex
      flexDir={"column"}
      alignItems={"center"}
      h="fit-content"
      position={"relative"}
      overflow={"hidden"}
      paddingTop="7vh"
      px={3}
    >
      <Flex
        width={"full"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={12}
      >
        {/* <Box display={{ base: "none", md: "block" }}>
          <Image
            src="/images/landing-header-left.png"
            width={462}
            height={413}
          />
        </Box> */}

        <Flex
          // flex={{ base: 1, md: 0 }}
          flexDir={"column"}
          alignItems={"center"}
          w="full"
        >
          <Text
            width={"300px"}
            fontSize={{ base: 32, md: 40 }}
            fontWeight={"bold"}
            textAlign={"center"}
          >
            Securely swap
            <br />
            NFTs & Tokens
          </Text>

          <Box
            position={"relative"}
            width={"full"}
            maxW="931px"
            aspectRatio={"2.56"}
            my={{ base: 6, md: 0 }}
          >
            <Image src="/images/landing-header.png" layout="fill" />
          </Box>

          <Button
            backgroundColor={"pinker"}
            display={"flex"}
            width="229px"
            height="46px"
            borderRadius={"8px"}
            onClick={handleCreate}
            _hover={{ opacity: 0.6 }}
            marginTop={{ base: 0, md: -6 }}
          >
            CREATE NEW SWAP
          </Button>

          <Tooltip
            label="Coming soon"
            isDisabled={ENABLE_BTC}
            borderRadius={"8px"}
            bg={surface}
            color={input}
          >
            <Button
              backgroundColor={"bitcoin"}
              display={"flex"}
              width="229px"
              height="46px"
              borderRadius={"8px"}
              onClick={handleVaultOrdinals}
              marginTop={3}
              isDisabled={!ENABLE_BTC}
              _disabled={{ opacity: 0.8, cursor: "not-allowed" }}
              _hover={{ opacity: 0.8 }}
              _active={{ opacity: 0.8 }}
            >
              ORDINALS
            </Button>
          </Tooltip>
        </Flex>

        {/* <Box display={{ base: "none", md: "block" }}>
          <Image
            src="/images/landing-header-right.png"
            width={462}
            height={413}
          />
        </Box> */}
      </Flex>

      <Flex
        w="full"
        maxWidth={"900px"}
        flexDirection={"column"}
        alignItems={"center"}
        paddingBottom={"7vh"}
        px="24px"
      >
        {ENABLE_BTC && (
          <Flex
            onClick={handleOpenBtcModal}
            cursor={"pointer"}
            position={"relative"}
            gap="96px"
            marginTop={{ base: "100px", md: "182px" }}
            width="full"
            maxW={972}
            height={208}
            borderRadius={32}
            overflow={"clip"}
            alignItems={"center"}
            background="linear-gradient(92deg, #1C0F06 0.26%, rgba(42, 34, 6, 0.68) 68.86%, rgba(48, 24, 6, 0.54) 99.68%);"
          >
            <Flex zIndex={1} flexDir={"column"} pl={12} gap={3} pr={32}>
              <Text fontSize={24} fontWeight={"bold"}>
                Learn how to Vault and trade your BTC NFTs
              </Text>

              <Text>Watch Video</Text>
            </Flex>

            <Image
              src="/images/btc-banner-image.png"
              alt="Bitcoin Banner"
              layout="fill"
              objectFit="cover"
              objectPosition="0% 50%"
              style={{
                zIndex: 0,
                opacity: 0.8,
              }}
            />
          </Flex>
        )}

        <Flex
          gap="96px"
          marginTop={{ base: "100px", md: "182px" }}
          width="full"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box width={{ base: "100%", md: "50%" }}>
            <Box>
              <Text fontSize={"32px"} fontWeight={"bold"} marginBottom="24px">
                How de[desk]
                <br />
                Trading Works
              </Text>
              <Text fontSize={{ base: "14px", md: "16px" }}>
                de[desk] is a trustless peer-to-peer
                <br />
                trading platform that allows you to
                <br />
                directly swap assets across different
                <br />
                collections with other users.
              </Text>
            </Box>

            <Flex marginTop="70px">
              <Box width="50%">
                <Text fontSize={"16px"} color={content} marginBottom={"16px"}>
                  Supported Assets
                </Text>
                <Flex alignItems={"center"} gap={"8px"}>
                  <Flex
                    backgroundColor={lightBg}
                    width="40px"
                    height="40px"
                    justifyContent={"center"}
                    alignItems={"center"}
                    borderRadius={"6px"}
                  >
                    <svg
                      width="25"
                      height="15"
                      style={{ fill: "white" }}
                      viewBox="0 0 61 39"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M59.5214 35.8302L58.754 32.6644C58.3945 31.1742 56.4037 30.8295 55.5504 32.1023L51.9551 37.4583C51.8692 37.5855 51.7404 37.681 51.5956 37.7234C51.3809 37.7817 51.1394 37.8083 50.957 37.8083C48.6925 37.8083 47.5602 36.4613 47.5602 34.95C47.5602 33.0621 48.3866 31.7151 51.4238 30.0394L55.2875 27.8811C58.8399 25.8872 60.6966 23.1879 60.6966 19.8418C60.6966 14.9365 56.5646 11.6805 51.2951 10.9434C51.1609 11.2191 50.9838 11.4896 50.7584 11.7388C50.7423 11.7547 50.7262 11.7706 50.7101 11.7918C52.8566 12.179 54.6918 13.6002 55.6953 16.5645C56.4198 18.7122 54.8636 20.1758 53.0981 20.4198L53.2966 20.5736C53.6937 20.9713 53.9728 21.438 54.123 21.9789C54.1606 22.2599 54.1982 22.541 54.2357 22.8273C54.2518 23.2675 54.1606 23.6758 53.9567 24.0523C53.8279 24.4447 53.6025 24.7894 53.2913 25.0758C53.023 25.3569 53.3503 25.8076 52.9908 25.9402C52.7225 26.1099 51.0965 26.3485 50.7799 26.4334C50.4955 26.4705 48.1934 27.0114 47.807 26.8152C47.7802 26.8046 47.909 26.2106 47.8822 26.2C47.4797 26.3909 48.4295 26.2 47.8822 26.2C46.3743 26.2 45.4137 25.3569 45.0059 24.2857C44.4746 23.8084 44.1527 23.1508 44.0346 22.4508C41.491 24.4023 40.2461 26.6402 40.2461 29.8167C40.2461 35.2628 44.4693 38.8264 51.3165 38.8264H58.0672C59.0867 38.8264 59.8595 37.9355 59.7253 36.9386C59.6717 36.5568 59.6073 36.1643 59.5268 35.8249L59.5214 35.8302Z" />
                      <path d="M18.1806 0H0.638575C0.284407 0 0 0.296967 0 0.668176V2.83709C0 4.85753 1.65815 6.49615 3.70266 6.49615H3.83145C4.25001 6.49615 4.58808 6.83024 4.58808 7.24387V32.4967C4.58808 32.9103 4.25001 33.2444 3.83145 33.2444C1.97475 33.2444 0.466858 34.7345 0.466858 36.5694V38.4042C0.466858 38.6428 0.649308 38.8337 0.880053 38.8337H17.5152C31.1131 38.8337 39.6078 31.7118 39.6078 18.9316C39.6078 6.15146 31.7248 0 18.1806 0ZM16.7371 37.9746H16.5493C16.1951 37.9746 15.9107 37.6777 15.9107 37.3065V1.52726C15.9107 1.15605 16.1951 0.859083 16.5493 0.859083H17.1986C23.9439 0.859083 27.7539 7.16963 27.7539 18.9847C27.7539 30.7997 23.3751 37.9693 16.7317 37.9693L16.7371 37.9746Z" />
                      <path d="M46.7712 31.9697C46.0092 29.5356 46.1541 27.7167 47.7532 27.25C55.7971 24.8902 59.9344 27.6531 59.9344 18.6592C59.9344 14.7191 56.1191 10.9434 51.2788 10.9434C43.0417 10.9434 38.459 18.2774 38.459 26.1523C38.459 29.8591 40.1225 33.1257 42.1456 35.3212C43.4495 33.8151 44.8286 32.4045 46.7712 31.9644V31.9697ZM46.9536 13.6426C49.1699 13.6426 53.0443 16.8032 53.0443 23.1349C53.0443 25.7069 51.4666 27.4303 48.9445 25.3993C46.6317 23.5379 44.8447 19.6721 44.8447 16.8191C44.8447 14.8251 45.6175 13.6373 46.9536 13.6373V13.6426Z" />
                    </svg>
                  </Flex>

                  <Flex
                    backgroundColor={lightBg}
                    width="40px"
                    height="40px"
                    justifyContent={"center"}
                    alignItems={"center"}
                    borderRadius={"6px"}
                  >
                    <svg
                      width="14"
                      height="30"
                      style={{ fill: "white", marginTop: "2px" }}
                      viewBox="0 0 939 1272"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22.7294 75.1205C11.7865 37.9208 39.67 0.625 78.4458 0.625H315.146C342.358 0.625 365.891 19.5467 371.908 46.0845C413.002 227.321 459.568 405.069 515.322 582.93C552.387 405.626 587.033 229.474 613.484 50.6332C617.721 21.9869 642.213 0.625 671.171 0.625H873.299C907.922 0.625 934.858 30.7297 931.29 65.1689C895.246 413.105 865.356 870.815 620.652 1120.23C467.297 1276.53 248.973 1273.36 58.7564 1271.39C26.7211 1271.06 0.75 1245.04 0.75 1213.01C0.75 1159.53 0.75 1099.89 0.75 1052.94C0.75 1020.9 26.6993 995.384 58.7362 995.332C159.113 995.17 278.965 984.745 248.274 868.116C189.186 643.571 71.5108 240.949 22.7294 75.1205Z" />
                    </svg>
                  </Flex>

                  {ENABLE_BTC && (
                    <Flex
                      backgroundColor={lightBg}
                      width="40px"
                      height="40px"
                      justifyContent={"center"}
                      alignItems={"center"}
                      borderRadius={"8px"}
                    >
                      <svg
                        width="25"
                        height="15"
                        style={{ fill: "#FF7733" }}
                        viewBox="0 0 19 13"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 0H9.30612V0.386845H9.69388V1.16053H10.8571V2.70791H11.6327V3.4816H12.4082V6.18951H13.1837V5.02898H14.3469V8.12374H15.1224V8.51058H17.0612V6.18951H16.2857V5.02898H14.3469V3.86845H17.8367V5.02898H19V8.51058H18.2245V9.67111H15.1224V11.6053H17.0612V10.8316H17.8367V10.4448H18.6122V12.379H14.3469V11.6053H13.5714V10.4448H12.4082V9.28427H11.6327V10.058H10.8571V11.2185H9.69388V11.9922H9.30612V12.379H0V10.8316H0.77551V10.4448H1.55102V1.93422H0.77551V1.54738H0V0ZM8.14286 1.16053V1.93422H8.91837V10.4448H8.14286V10.8316H4.65306V10.4448H4.26531V1.54738H4.65306V1.16053H8.14286Z"
                        />
                      </svg>
                    </Flex>
                  )}
                </Flex>
              </Box>
              <Box width="50%">
                <Text fontSize={"16px"} color={content} marginBottom={"16px"}>
                  Supported Chains
                </Text>
                <Flex alignItems={"center"} gap={2}>
                  <Flex
                    backgroundColor={lightBg}
                    width="40px"
                    height="40px"
                    justifyContent={"center"}
                    alignItems={"center"}
                    borderRadius={"full"}
                  >
                    <svg
                      width="16px"
                      height="16px"
                      shapeRendering="geometricPrecision"
                      textRendering="geometricPrecision"
                      imageRendering="optimizeQuality"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      viewBox="0 0 784.37 1277.39"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Layer_x0020_1">
                        <metadata id="CorelCorpID_0Corel-Layer" />
                        <g id="_1421394342400">
                          <g>
                            <polygon
                              fill="#343434"
                              fillRule="nonzero"
                              points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
                            />
                            <polygon
                              fill="#8C8C8C"
                              fillRule="nonzero"
                              points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
                            />
                            <polygon
                              fill="#3C3C3B"
                              fillRule="nonzero"
                              points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
                            />
                            <polygon
                              fill="#8C8C8C"
                              fillRule="nonzero"
                              points="392.07,1277.38 392.07,956.52 -0,724.89 "
                            />
                            <polygon
                              fill="#141414"
                              fillRule="nonzero"
                              points="392.07,882.29 784.13,650.54 392.07,472.33 "
                            />
                            <polygon
                              fill="#393939"
                              fillRule="nonzero"
                              points="0,650.54 392.07,882.29 392.07,472.33 "
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </Flex>

                  {ENABLE_BTC && (
                    <svg
                      width="37"
                      height="37"
                      viewBox="0 0 37 37"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.0517578"
                        width="36.9452"
                        height="36.9452"
                        rx="18.4726"
                        fill="#F7931A"
                      />
                      <path
                        d="M24.2623 16.3434C24.542 14.471 23.1164 13.4645 21.167 12.793L21.7993 10.2566L20.255 9.87183L19.6394 12.3414C19.2339 12.2403 18.8171 12.1448 18.4028 12.0503L19.0228 9.56446L17.4798 9.17969L16.847 11.7152C16.5111 11.6387 16.1813 11.5631 15.8611 11.4835L15.8629 11.4756L13.7337 10.9439L13.323 12.5929C13.323 12.5929 14.4685 12.8554 14.4443 12.8717C15.0696 13.0278 15.1831 13.4416 15.1637 13.7697L14.4434 16.6592C14.4865 16.6702 14.5424 16.686 14.6039 16.7106L14.4412 16.6702L13.4312 20.7179C13.3546 20.9079 13.1607 21.1928 12.7236 21.0847C12.739 21.1071 11.6014 20.8046 11.6014 20.8046L10.835 22.5723L12.8446 23.0732C13.2183 23.1668 13.5846 23.2649 13.9448 23.3572L13.3058 25.9231L14.848 26.3079L15.4812 23.7697C15.902 23.884 16.311 23.9896 16.7112 24.0889L16.0806 26.6152L17.6245 27L18.2634 24.4394C20.8961 24.9376 22.8763 24.7367 23.7087 22.3559C24.3802 20.4387 23.6757 19.3328 22.2905 18.6112C23.2993 18.3777 24.0596 17.7141 24.2623 16.3434ZM20.7343 21.29C20.2567 23.2073 17.0291 22.1713 15.9821 21.9109L16.8299 18.5122C17.8765 18.7734 21.2316 19.2905 20.7343 21.29ZM21.2114 16.3157C20.7761 18.0597 18.0893 17.1737 17.2173 16.9564L17.986 13.8739C18.8579 14.0911 21.6652 14.4965 21.2114 16.3157Z"
                        fill="white"
                      />
                    </svg>
                  )}
                </Flex>
              </Box>
            </Flex>

            {/* <Box marginTop="60px">
              <Text fontSize={"16px"} color={content} marginBottom={"16px"}>
                Coming Soon
              </Text>
              <Flex
                backgroundColor={lightBg}
                width="40px"
                height="40px"
                justifyContent={"center"}
                alignItems={"center"}
                borderRadius={"8px"}
              >
                <svg
                  width="25"
                  height="15"
                  style={{ fill: "#FF7733" }}
                  viewBox="0 0 19 13"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 0H9.30612V0.386845H9.69388V1.16053H10.8571V2.70791H11.6327V3.4816H12.4082V6.18951H13.1837V5.02898H14.3469V8.12374H15.1224V8.51058H17.0612V6.18951H16.2857V5.02898H14.3469V3.86845H17.8367V5.02898H19V8.51058H18.2245V9.67111H15.1224V11.6053H17.0612V10.8316H17.8367V10.4448H18.6122V12.379H14.3469V11.6053H13.5714V10.4448H12.4082V9.28427H11.6327V10.058H10.8571V11.2185H9.69388V11.9922H9.30612V12.379H0V10.8316H0.77551V10.4448H1.55102V1.93422H0.77551V1.54738H0V0ZM8.14286 1.16053V1.93422H8.91837V10.4448H8.14286V10.8316H4.65306V10.4448H4.26531V1.54738H4.65306V1.16053H8.14286Z"
                  />
                </svg>
              </Flex>
            </Box> */}
          </Box>

          <Box width={{ base: "100%", md: "50%" }}>
            <Flex flexDirection={"column"} gap="16px">
              {steps.map((step, index) => (
                <Box
                  key={index}
                  width="full"
                  minHeight="134px"
                  backgroundColor={lightBg}
                  borderRadius={"24px"}
                  py="16px"
                  px="20px"
                >
                  <Image src={step.icon} width="24px" height="24px" />
                  <Text fontSize="20px" fontWeight={"semibold"}>
                    {step.title}
                  </Text>
                  <Text fontSize={{ base: "14px", md: "16px" }} color={content}>
                    {step.description}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>

        <Box
          marginTop={{ base: "50px", md: "177px" }}
          marginBottom={"150px"}
          width={"full"}
        >
          <Text
            textAlign={"center"}
            marginBottom="24px"
            fontSize="32px"
            fontWeight={"semibold"}
          >
            FAQ
          </Text>
          <Accordion allowMultiple width={"full"}>
            {faq.map((item, index) => {
              return (
                <AccordionItem
                  key={index}
                  border="none"
                  borderBottom={`1px solid`}
                  borderColor={lightBg}
                  width={"full"}
                >
                  <h2 width={"full"}>
                    <AccordionButton width={"full"}>
                      <Flex
                        width={"full"}
                        as="span"
                        flex="1"
                        textAlign="left"
                        alignItems="center"
                        fontSize="14px"
                        fontWeight="bold"
                      >
                        {item.title}
                      </Flex>
                      <Box
                        borderRadius="50%"
                        color="whiter"
                        display="flex"
                        p="5px"
                      >
                        <AccordionIcon />
                      </Box>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} fontSize="14px" width={"full"}>
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
      </Flex>
      {/* <Box
        position="absolute"
        bottom={"-20vh"}
        left={0}
        w="100vw"
        aspectRatio={1.94}
        zIndex="-1"
      >
        <Image src="/images/dots-horizontal.svg" layout="fill" />
      </Box> */}

      <Box
        position="absolute"
        top="-86px"
        left="0"
        w="100vw"
        h="100vh"
        zIndex="-1"
      >
        <Image src="/images/dots.svg" layout="fill" />
      </Box>

      <BtcModal isOpen={btcModalOpen} onClose={handleCloseBtcModal} />
    </Flex>
  );
}
