import { useState, useEffect, useCallback, useRef } from "react";
import NFTCard from "./NFTCard";
import { HOME_DEMO_DATA } from "../data/mockData";

const NFTSection = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  const fetchNFTData = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      setNfts(HOME_DEMO_DATA);
      setLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    fetchNFTData();
  }, [fetchNFTData]);

  if (loading && nfts.length === 0) {
    return (
      <section className="cards-container">
        <div className="nft-slider-container">
          <div className="carousel-cards">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card loading-card">
                <div className="card-image loading-skeleton"></div>
                <div className="skeleton" style={{ width: '80%', margin: '15px auto 5px' }}></div>
                <div className="skeleton small" style={{ margin: '0 auto 20px' }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cards-container">
      <div className="section-header explorer-header">
        <div className="header-left">
          <h2 className="trending-title">NFT's</h2>
          <div className="market-status">
            <span className="dot pulse-blue"></span> 
            LIVE
          </div>
        </div>

        <div className="explorer-actions">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search collections..." 
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="nft-slider-container">
        <button className="slide-btn prev" onClick={() => scroll('left')}>&#10094;</button>
        
        <div className="horizontal-cards" ref={scrollRef}>
          {nfts.map((item, index) => (
            <NFTCard
              key={`${item.title}-${index}`}
              title={item.title}
              price={item.price}
              image={item.image}
              volume={item.volume}
              change={item.change}
              tokenId={null}
              isForSale={true}
            />
          ))}
        </div>

        <button className="slide-btn next" onClick={() => scroll('right')}>&#10095;</button>
      </div>
      
      <p className="error-hint">Project Demo Mode: Using secure local assets.</p>
    </section>
  );
};

export default NFTSection;
