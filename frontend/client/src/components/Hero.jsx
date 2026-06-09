import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <span className="hero-badge">NFT Marketplace</span>

      <h1>Discover Digital Art & NFTs</h1>

      <p>Connect your wallet, create NFTs, and explore digital collections.</p>

      <div className="hero-actions">
        <button className="explore-btn" onClick={() => navigate("/wallet")}>
          Connect Wallet
        </button>

        <button className="secondary-btn" onClick={() => navigate("/create-nft")}>
          Create NFT
        </button>
      </div>
    </section>
  );
};

export default Hero;
