import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  useEffect(() => {
    const { isMobile } = require("react-device-detect");
    setIsMobileDevice(isMobile);
  }, []);

  return isMobileDevice;
};
