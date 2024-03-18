import {
  useEffect,
  createContext,
  useContext,
  useRef,
  useReducer,
} from "react";
import { useAccount, useConnect } from "wagmi";
import {
  selectedActions,
  initialSelectedActionsState,
} from "../reducers/selectedActions";
import { useERC20Balance } from "../hooks/useERC20Balance";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import axios from "axios";

const UserContext = createContext();

export const UserWrapper = ({ children }) => {
  const [selectedActionsState, dispatchSelectedActions] = useReducer(
    selectedActions,
    initialSelectedActionsState
  );
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const addressRef = useRef(null);
  const { connect, connectors } = useConnect();
  const { address, isConnected, connector } = useAccount();
  const {
    data: erc20Balance,
    isLoading: erc20BalanceIsLoading,
    isError: erc20BalanceIsError,
    getERC20Balance,
  } = useERC20Balance(address);

  useEffect(() => {
    if (address) {
      addressRef.current = address;
    }
  }, [address]);

  useEffect(() => {
    const connectorId = window.localStorage.getItem(
      "nf3marketplace-connector-choice"
    );
    if (!address && connectorId !== "null") {
      const type = connectors.find((i) => i.id === connectorId);
      if (!isConnected) {
        connect({ connector: type });
      }
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address && connector) {
      window.localStorage.setItem(
        "nf3marketplace-connector-choice",
        connector.id
      );
    } else {
      dispatchSelectedActions({
        type: "RESET",
      });
    }
  }, [address, isConnected, connector]);

  const getNonce = async () => {
    try {
      if (!address) {
        console.log("no wallet found");
        return false;
      }
      const response = await axios.get("/api/get/getNonce", {
        params: {
          address: address,
        },
      });
      const nonce = response.data.data;

      return nonce;
    } catch (error) {
      if (
        error?.response?.status === 401 &&
        window.localStorage.getItem("CSRF")
      ) {
        router.push("/dashboard");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");
      }
      return false;
    }
  };

  const settings = {
    selectedActionsState,
    dispatchSelectedActions,
    erc20Balance,
    erc20BalanceIsLoading,
    erc20BalanceIsError,
    getERC20Balance,
    getNonce,
  };

  return (
    <UserContext.Provider value={settings}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
