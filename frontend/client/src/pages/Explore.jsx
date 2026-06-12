import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import NFTCard from "../components/NFTCard";
import { EXPLORE_CATEGORIES } from "../data/mockData";

const CategorySlider = ({ cat }) => {
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

  return (
    <div className="cards-container">
      <div className="section-header">
        <div className="header-left">
          <h2 className="trending-title">{cat.label}</h2>
          <span style={{ color: "#64748b", fontSize: "15px", fontWeight: 400 }}>
            {cat.description}
          </span>
        </div>
        <div className="live-indicator">
          <span className="dot pulse-blue"></span>
          {cat.nfts.length} items
        </div>
      </div>

      <div className="nft-slider-container">
        <button className="slide-btn prev" onClick={() => scroll('left')}>&#10094;</button>
        
        <div className="horizontal-cards" ref={scrollRef}>
          {cat.nfts.map((nft) => (
            <NFTCard
              key={nft.id}
              title={nft.title}
              price={nft.price}
              image={nft.image}
              volume={nft.volume}
              change={nft.change}
              tokenId={null}
              isForSale={true}
            />
          ))}
        </div>

        <button className="slide-btn next" onClick={() => scroll('right')}>&#10095;</button>
      </div>
    </div>
  );
};

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const visibleCategories =
    activeCategory === "all"
      ? EXPLORE_CATEGORIES
      : EXPLORE_CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <div className="hero" style={{ background: "linear-gradient(135deg, #f1f2f5 0%, #f4f4f8 100%)" }}>
        <span className="hero-badge" style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa" }}>
          ✨ NFT Marketplace
        </span>
        <h1 style={{ color: "#0c0b0b" }}>Explore NFTs</h1>
        <p style={{ color: "#a5b4fc" }}>
          Browse {EXPLORE_CATEGORIES.reduce((a, c) => a + c.nfts.length, 0)}+ digital assets across {EXPLORE_CATEGORIES.length} categories
        </p>

        {/* ── Category Pills ── */}
        <div className="hero-actions">
          <button
            className={activeCategory === "all" ? "explore-btn" : "secondary-btn"}
            onClick={() => setActiveCategory("all")}
          >
            ✨ All
          </button>
          {EXPLORE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? "explore-btn" : "secondary-btn"}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── NFT Sections ── */}
      {visibleCategories.map((cat) => (
        <CategorySlider key={cat.id} cat={cat} />
      ))}
    </>
  );
};

export default Explore;
