import { useNavigate } from "react-router-dom";
import { useWeb3context } from "../contexts/useWeb3context";

function Navbar() {
  const navigate = useNavigate();
  const { selectedAccount } = useWeb3context();

  const buttonText = selectedAccount
    ? `${selectedAccount.slice(0, 6)}...${selectedAccount.slice(-4)}`
    : "Connect Wallet";

  return (
    <nav className="navbar">
      <h2 className="logo" onClick={() => navigate("/")}>
        NFT Market
      </h2>

      <div className="nav-actions">
        <button className="nav-link-btn" onClick={() => navigate("/create-nft")}>
          Create NFT
        </button>

        <button className="wallet-btn" onClick={() => navigate("/wallet")}>
          {buttonText}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
