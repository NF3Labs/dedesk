import { useRef, useEffect, useState } from "react";

export const useLoadImage = (imageUrl) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const mountedRef = useRef(false);

  const handleLoadImage = () => {
    if (!mountedRef.current) return null;
    let img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setIsLoaded(true);
      setIsError(false);
    };
    img.onerror = () => {
      setIsLoaded(true);
      setIsError(true);
    };
  };

  useEffect(() => {
    mountedRef.current = true;
    if (imageUrl && !isLoaded && !isError) {
      handleLoadImage();
    }
    return () => (mountedRef.current = false);
  }, [imageUrl, isLoaded, isError]);

  return { isLoaded, isError, handleLoadImage };
};
