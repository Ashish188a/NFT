import { useState } from "react";
import { ethers } from "ethers";
import { Web3Context } from "./createWeb3context";

const Web3Provider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectBaseAccount = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or Base Wallet");
      return;
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);

    await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const walletSigner = await browserProvider.getSigner();
    const address = await walletSigner.getAddress();
    const network = await browserProvider.getNetwork();

    setProvider(browserProvider);
    setSigner(walletSigner);
    setSelectedAccount(address);
    setChainId(Number(network.chainId));

    localStorage.setItem("walletAddress", address);
  };

  const disconnectWallet = () => {
    setSelectedAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    localStorage.removeItem("walletAddress");
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        selectedAccount,
        chainId,
        connectBaseAccount,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;