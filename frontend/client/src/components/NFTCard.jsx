const NFTCard = ({ title, price, image, volume, change }) => {
  const isPositive = change && change.startsWith('+');

  return (
    <div className="card">
      <div className="card-badge">Base</div>
      <div className="card-image">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            loading="lazy"
            className="nft-main-img"
            onError={(e) => {
              e.target.onerror = null; 
              // Using a globally reliable AI-style placeholder on error
              e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(title)}`;
            }}
          />
        ) : (
          <div className="nft-placeholder">NFT</div>
        )}
        <div className="image-overlay"></div>
      </div>

      <div className="card-content">
        <h3>{title}</h3>
        <div className="card-stats">
          <div className="price-box">
            <p className="price">{price}</p>
            {change && (
              <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                {change}
              </span>
            )}
          </div>
          {volume && <p className="volume">{volume}</p>}
        </div>
      </div>

      <button className="buy-btn">
        View Market
      </button>
    </div>
  )
}

export default NFTCard