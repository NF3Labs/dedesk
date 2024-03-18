import { useColorModeValue } from "@chakra-ui/react";

export const Eliminate = (props) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M5.34912 11.2998L11.3595 5.2894" stroke="white" strokeWidth="2" />
    <path d="M11.3792 11.2783L5.32925 5.30767" stroke="white" strokeWidth="2" />
    <circle
      cx="8.5"
      cy="8.5"
      r="8.5"
      fill={useColorModeValue("black", "white")}
    />
    <path
      d="M4 8.01953H12.5"
      stroke={useColorModeValue("white", "black")}
      strokeWidth="2"
    />
  </svg>
);
