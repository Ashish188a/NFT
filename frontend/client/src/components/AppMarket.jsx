import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NFTCard from "./NFTCard";

const AppMarket = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchAppNFTs = async () => {
      try {
        const response = await fetch("/api/nft/all");
        if (response.ok) {
          const data = await response.json();
          const formatted = data.nfts.map(n => ({
            title: n.name,
            price: `${n.price || '0.001'} ETH`,
            image: n.imageURL,
            volume: "Local",
            change: "+0.0%",
            tokenId: n.tokenId,
            ownerAddress: n.ownerAddress,
            isForSale: n.isForSale
          }));
          setNfts(formatted);
        }
      } catch (error) {
        console.error("Error fetching app market NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppNFTs();
  }, []);

  if (loading) return null;

  return (
    <section className="cards-container">
      <div className="section-header">
        <h2 className="trending-title">Created NFT's</h2>
        <div className="market-status">
          <span className="dot pulse-blue"></span> 
          Local Market
        </div>
      </div>
      
      {nfts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', margin: '0 20px', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
          <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '20px' }}>No NFTs have been minted on this platform yet.</p>
          <button className="secondary-btn" onClick={() => navigate('/create-nft')}>Mint Your First NFT</button>
        </div>
      ) : (
        <div className="nft-slider-container">
          <button className="slide-btn prev" onClick={() => scroll('left')}>&#10094;</button>
          
          <div className="horizontal-cards" ref={scrollRef}>
            {nfts.map((nft, index) => (
              <NFTCard
                key={index}
                title={nft.title}
                price={nft.price}
                image={nft.image}
                volume={nft.volume}
                change={nft.change}
                tokenId={nft.tokenId}
                ownerAddress={nft.ownerAddress}
                isForSale={nft.isForSale}
              />
            ))}
          </div>

          <button className="slide-btn next" onClick={() => scroll('right')}>&#10095;</button>
        </div>
      )}
    </section>
  );
};

export default AppMarket;
