import { useColorModeValue } from "@chakra-ui/react";

export const EthP2P = ({ width, ...rest }) => (
  <svg
    width={width ? width : "24"}
    height={width ? width : "24"}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="12"
      fill={useColorModeValue("#ffffff", "#999")}
      fillOpacity="0.7"
    />
    <path d="M12 15.3764V4L7 12.4088L12 15.3764Z" fill="#FFE644" />
    <path d="M12 4L17 12.4088L12 15.3764V4Z" fill="#EC7463" />
    <path d="M7 13.0474L12 16.015V19.8537" fill="#009ECB" />
    <path d="M17 13.0474L12 16.015V19.8537" fill="#4D68AE" />
    <path d="M12 9.44147L7 12.4088L12 15.3764V9.44147Z" fill="#57A759" />
    <path d="M12 9.44147L17 12.4088L12 15.3764V9.44147Z" fill="#8E5298" />
  </svg>
);
