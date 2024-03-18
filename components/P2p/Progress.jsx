import {
  Box,
  Grid,
  GridItem,
  Avatar,
  Flex
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { Step2Me } from "./Step2Me";
import { useUserContext } from "../../contexts/User";
import { useAccount } from "wagmi";
import Image from "next/image";

const steps = [
  { label: "1", description: "Find User" },
  { label: "2", description: "Request NFTs" },
  { label: "3", description: "Your Offer" },
  { label: "4", description: "Preview & Submit" },
]

export const Progress = ({ callback, handleVerified }) => {

  const surface = useColorModeValue("surface.light", "surface.dark")
  const header = useColorModeValue("header.light", "header.dark");
  const content = useColorModeValue("content.light", "content.dark");

  const h = useColorModeValue("placeholder.light", "placeholder.dark");

  const [tab, setTab] = useState(0);
  const { address } = useAccount();
  const userContext = useUserContext();
  const [isUseDust, setIsUseDust] = useState(false);
  const [dustString, setDustString] = useState(false);

  useEffect(() => {
    if (address === undefined) {
      userContext?.dispatchSelectedActions({
        type: "RESET"
      });

      callback()
    } else {
      if (address !== userContext?.selectedActionsState?.p2p_me?.address) {
        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_ME",
          payload: {
            ...userContext?.selectedActionsState?.p2p_me,
            ["address"]: address
          },
        });

        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_MY_NFT",
          payload: [],
        });
        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_MY_FT",
          payload: [],
        });
      } else if (address !== userContext?.selectedActionsState?.p2p_trader?.address) {
        setTab(0);
        userContext?.dispatchSelectedActions({
          type: "RESET"
        });
      }
    }
  }, [address])

  const handleStep = (index, data = false, dustString = false) => {
    if (index === -1) {
      userContext?.dispatchSelectedActions({
        type: "RESET"
      });

      callback()
    } else {
      setTab(index);
    }
    if (index == 2) {
      setIsUseDust(data)
      setDustString(dustString)
    }
  }

  return (
    <>
      <Box w='full' pt='32px' height="full">
        <Grid mx='35vh' templateColumns='repeat(3, 1fr)' mb="-8px">
          {new Array(3).fill(0).map((item, index) => {
            return <GridItem key={index} h='8px'
              // bg={(tab <= index) ? surface : 'pinker'} 
              bg={surface}
              position='relative' sx={{ transition: "all 0.5s ease-in" }}>
              <Box position='absolute' top='-10px' left='-30px' textAlign='center'>
                <Flex
                  display='inline-block'
                  borderRadius='full'
                  // bg={tab >= index ? 'pinker' : header}
                  border={`2px solid`}
                  borderColor={(tab === index) ? 'pinker' : surface}
                  sx={{ transition: "all 0.5s ease-in" }}
                >
                  <Avatar
                    m='auto'
                    name={steps[index].label}
                    // bg={tab >= index ? 'pinker' : header}
                    bg={header}
                    border='none'
                    sx={{ transition: "all 0.5s ease-in" }}
                    width={"24px"}
                    height={"24px"}
                    size="sm"
                  />
                </Flex>
                <Box
                  mt='12px'
                  fontSize='12px'
                  px='8px'
                  py='6px'
                  borderRadius='full'
                  // bg={tab < index ? surface : 'pinker'}
                  // color={tab >= index ? 'whiter' : content}
                  bg={surface}
                  border={`1px solid`}
                  borderColor={(tab === index) ? 'pinker' : surface}
                  sx={{ transition: "all 0.5s ease-in" }}
                >
                  {steps[index].description}
                </Box>
              </Box>
              {index === 2 &&
                <Box key={4} position='absolute' top='-10px' right='-56px' textAlign='center'>
                  <Flex
                    display='inline-block'
                    borderRadius='full'
                    // bg={tab >= (index + 1) ? 'pinker' : header}
                    border={`2px solid`}
                    borderColor={(tab === index + 1 || tab === 4) ? 'pinker' : surface}
                  >
                    <Avatar
                      m='auto'
                      name={steps[index + 1].label}
                      // bg={tab >= index ? 'pinker' : header}
                      bg={header}
                      border='none'
                      width={"24px"}
                      height={"24px"}
                      size="sm"
                    />
                  </Flex>
                  <Box
                    mt='12px'
                    fontSize='12px'
                    px='8px'
                    py='6px'
                    borderRadius='full'
                    // bg={tab < index + 1 ? surface : 'pinker'}
                    // color={tab >= index + 1 ? 'whiter' : content}
                    bg={surface}
                    border={`1px solid`}
                    borderColor={(tab === index + 1 || tab === 4) ? 'pinker' : surface}
                  >
                    {steps[index + 1].description}
                  </Box>
                </Box>
              }
            </GridItem>
          })}
        </Grid>
        {
          tab === 0 ? <Step1 callback={handleStep} /> :
            tab === 2 ? <Step2Me callback={handleStep} handleVerified={handleVerified} isUseDust={isUseDust} dustString={dustString} /> :
              tab === 1 ? <Step2 callback={handleStep} handleVerified={handleVerified} /> :
                tab === 3 ? <Step3 callback={handleStep} handleVerified={handleVerified} isUseDust={isUseDust} dustString={dustString} /> :
                  tab === 4 ? <Step4 callback={handleStep} /> : <></>
        }

        <Box position="absolute" top="-86px" left="0" w="100vw" h="100vh" zIndex="-1">
          <Image src="/images/dots.svg" layout="fill" />
        </Box>
      </Box >
    </>
  );
};