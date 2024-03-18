import Head from "next/head";
import { useState } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useIsTouchDevice } from "../../hooks/useIsTouchDevice";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MINSCREEN_WIDTH } from "../../constants/minscreenWidth";
import { DesktopOnly } from "./DesktopOnly";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount, useDisconnect, useSigner } from "wagmi";
import { AcceptSign } from "../Modals/AcceptSign";
import { useUserContext } from "../../contexts/User";
import { useAppContext } from "../../contexts/App";
import axios from "axios";

export const Layout = ({ children }) => {
  const userContext = useUserContext();
  const appContext = useAppContext();

  const { windowSize } = useWindowSize();
  const isTouch = useIsTouchDevice();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isConnecting } = useAccount();
  const { data: signer } = useSigner();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      let data = window.localStorage.getItem("wallet-address");
      userContext?.dispatchSelectedActions({
        type: "RESET",
      });
      if (data !== address) {
        onOpen();
      }
    }
  }, [address]);

  useEffect(() => {
    userContext?.dispatchSelectedActions({
      type: "RESET",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleGoBack = () => {
    disconnect();
    onClose();
    window.localStorage.setItem("wallet-address", "");
    window.localStorage.setItem("nf3marketplace-connector-choice", null);
  };

  const handleContinue = async () => {
    try {
      const result = await generatorAuthToken();
      if (result.success) {
        onClose();
        window.localStorage.setItem("wallet-address", address);
        window.localStorage.setItem("CSRF", JSON.stringify(result.tokens));
      }
    } catch (error) {
      console.log(error);
      onClose();
      disconnect();
      window.localStorage.setItem("nf3marketplace-connector-choice", null);
    }
  };

  const generatorAuthToken = () => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/get/getToken");
        const token = response.data.data;

        if (token === "") {
          reject("Auth generator Failed!");
          return;
        }
        const signature = await signer.signMessage(token);
        const res = await axios.get("/api/get/getLogin", {
          params: {
            address: address,
            token: token,
            signature: signature,
          },
        });
        const tokens = res.data.data;
        setIsLoading(false);
        resolve({ success: true, tokens: res });
      } catch (error) {
        reject(error);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("wagmi.connected") && router.pathname !== "/") {
      router.push("/");
    }
  }),
    [router.pathname];

  // const FooterDisplay = () => {
  //   if (
  //     router.pathname === "/p2p"
  //   ) {
  //     return;
  //   } else {
  //     return <Footer />;
  //   }
  // };
  return (
    <>
      <Head>
        <title>de[desk]</title>
        <meta
          name="description"
          content="Securely swap NFTs from ETH & BTC blockchains"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <Box
        minH="calc(100vh - 86px - 60px)"
        h={router.pathname === "/" ? "" : "1px"}
        className="layout-margin z-index0"
      >
        {(windowSize?.width < MINSCREEN_WIDTH || isTouch || isMobile) &&
        router.pathname !== "/" ? (
          <DesktopOnly />
        ) : (
          children
        )}
        {isOpen && (
          <AcceptSign
            isOpen={isOpen}
            onClose={onClose}
            handleGoBack={handleGoBack}
            handleContinue={handleContinue}
            isLoading={isLoading}
          />
        )}
      </Box>
      {/* <FooterDisplay /> */}

      <Footer />
    </>
  );
};
