import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <button 
        className="hero-badge" 
        onClick={() => navigate("/explore")}
        style={{ cursor: 'pointer', transition: 'transform 0.2s', border: 'none' }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Explore
      </button>

      <h1>Discover Digital Art & NFTs</h1>

      <p>Connect your wallet, create NFTs, and explore digital collections.</p>

      <div className="hero-actions">
        <button className="explore-btn" onClick={() => {
          const marketSection = document.querySelector('.trending-title');
          if (marketSection) marketSection.scrollIntoView({ behavior: 'smooth' });
        }}>
          View Market
        </button>

        <button className="secondary-btn" onClick={() => navigate("/create-nft")}>
          Create NFT
        </button>
      </div>
    </section>
  );
};

export default Hero;
