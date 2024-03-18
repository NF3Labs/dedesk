import { useColorModeValue } from "@chakra-ui/react";

export const CheckNFT = () => {
  return <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="24" height="24" rx="3" fill={useColorModeValue("#ffffff", "#ffffff")} />
    <path
      d="M7 13L10.2929 16.2929C10.6834 16.6834 11.3166 16.6834 11.7071 16.2929L19 9"
      stroke="#01071A"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="1"
      y="1"
      width="24"
      height="24"
      rx="3"
      stroke="#01071A"
      strokeWidth="2"
    />
  </svg>
};
