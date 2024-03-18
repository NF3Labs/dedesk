import { useEffect, useState, useRef } from "react";
import { formatUnits, isAddress } from "ethers/lib/utils.js";
import { fetchBalance } from "@wagmi/core";
import { useAppContext } from "../contexts/App";
import { useNetwork } from "wagmi";
import { constants } from "ethers";


export const useERC20Balance = (address) => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const callingRef = useRef(false);
  const addressRef = useRef(address);
  const appContext = useAppContext();
  const { chain } = useNetwork();
  const ETH = constants.AddressZero;

  const tokenList = appContext?.tokenList;

  const getERC20Balance = async (address) => {
    try {
      callingRef.current = true;
      addressRef.current = address;
      setIsError(false);
      setIsLoading(true);

      const sdk = await appContext?.getSDK();

      const _promises = [
        fetchBalance({
          address,
          chainId: chain?.id.toString(),
          formatUnits: "wei",
        }),
        sdk.sc.fts.getBalanceOf(address, tokenList)
      ];
      const result = await Promise.all(_promises);

      var shift = 0;
      tokenList[chain?.id].forEach((i, idx) => {
        if (i.contract === ETH) {
          i.balanceInWei = result[0].formatted;
          i.balanceFormatted = formatUnits(result[0].formatted, i.decimals);
          shift += 1;
          return;
        }
        i.balanceInWei = result[1][0][idx - shift].toString();
        i.balanceFormatted = formatUnits(
          result[1][0][idx - shift].toString(),
          i.decimals
        );
      });

      setData(tokenList);
      setIsLoading(false);
      callingRef.current = false;
    } catch (error) {
      console.log(error);
      callingRef.current = false;
      setIsError(true);
      setIsLoading(false);
    }
  };

  const getERC20BalanceLocal = async(address)=>{
    try {
     
      const sdk = await appContext?.getSDK();
      const _tokenList = {...tokenList}
      const _promises = [
        fetchBalance({
          address,
          chainId: chain?.id.toString(),
          formatUnits: "wei",
        }),
        sdk.sc.fts.getBalanceOf(address, _tokenList)
      ];
      console.log(sdk.sc.fts,"promise")
      const result = await Promise.all(_promises);
      // console.log("useERC", result,sdk, tokenList,address)
      var shift = 0;
      _tokenList[chain?.id].forEach((i, idx) => {
        if (i.contract === ETH) {
          i.balanceInWei = result[0].formatted;
          i.balanceFormatted = formatUnits(result[0].formatted, i.decimals);
          shift += 1;
          return;
        }
        i.balanceInWei = result[1][0][idx - shift].toString();
        i.balanceFormatted = formatUnits(
          result[1][0][idx - shift].toString(),
          i.decimals
        );
      });
      console.log(JSON.parse(JSON.stringify(_tokenList)) , address ,"useERC" )

      return _tokenList;
    } catch (error) {
      console.log(error);
      return "";
    }
  }
  useEffect(() => {
    if (
      tokenList &&
      (!data || addressRef.current !== address) &&
      isAddress(address) &&
      !callingRef.current
    ) {
      getERC20Balance(address);
    }
  }, [address, data, tokenList]);

  return { data, isLoading, isError, getERC20Balance , getERC20BalanceLocal};
};
