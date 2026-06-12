import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useWeb3context } from "../contexts/useWeb3context";

const Wallet = () => {
  const { selectedAccount, chainId, connectBaseAccount, disconnectWallet, provider } =
    useWeb3context();

  const [nfts, setNfts] = useState([]);
  const [createdNfts, setCreatedNfts] = useState([]);
  const [view, setView] = useState("owned"); // 'owned' or 'created'
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("0");

  const shortAddress = selectedAccount
    ? `${selectedAccount.slice(0, 6)}...${selectedAccount.slice(-4)}`
    : "Not connected";

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!selectedAccount) {
        setNfts([]);
        setCreatedNfts([]);
        setBalance("0");
        return;
      }

      try {
        setLoading(true);
        
        // 1. Fetch Balance
        if (provider) {
          const bal = await provider.getBalance(selectedAccount);
          const ethBalance = (Number(bal) / 1e18).toFixed(4);
          setBalance(ethBalance);
        }

        // 2. Fetch Owned NFTs based on Network
        let reservoirUrl = "";
        if (chainId === 8453) {
          reservoirUrl = `https://api-base.reservoir.tools/users/${selectedAccount}/tokens/v6?limit=9`;
        } else if (chainId === 84532) {
          reservoirUrl = `https://api-base-sepolia.reservoir.tools/users/${selectedAccount}/tokens/v6?limit=9`;
        } else if (chainId === 11155111) {
          reservoirUrl = `https://api-sepolia.reservoir.tools/users/${selectedAccount}/tokens/v6?limit=9`;
        }

        if (reservoirUrl) {
          const ownedResponse = await fetch(reservoirUrl);
          if (ownedResponse.ok) {
            const data = await ownedResponse.json();
            const formatted = data.tokens.map(t => ({
              name: t.token.name || `#${t.token.tokenId}`,
              price: t.token.lastSale?.price?.amount?.decimal 
                ? `${t.token.lastSale.price.amount.decimal} ${t.token.lastSale.price.currency.symbol}`
                : "Floor: 0.01 ETH",
              image: t.token.image || t.token.collection?.image || "https://via.placeholder.com/300?text=NFT"
            }));
            setNfts(formatted);
          }
        }

        // 3. Fetch Created NFTs (Backend)
        console.log("Fetching created NFTs for:", selectedAccount);
        const createdResponse = await fetch(`/api/nft/created/${selectedAccount}`);
        if (createdResponse.ok) {
          const data = await createdResponse.json();
          console.log("Created NFTs data received:", data);
          const formatted = data.nfts.map(n => ({
            name: n.name,
            price: "Created",
            image: n.imageURL,
            description: n.description
          }));
          setCreatedNfts(formatted);
        } else {
          console.error("Failed to fetch created NFTs:", createdResponse.status);
        }

      } catch (err) {
        console.error("Error fetching wallet data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [selectedAccount, provider, chainId]);

  const displayNfts = view === "owned" ? nfts : createdNfts;

  return (
    <>
      <Navbar />

      <div className="wallet-container">
        <div className="wallet-header">
          <h1>My Wallet</h1>
          <p>Manage your crypto wallet and NFTs</p>
        </div>

        <div className="wallet-card">
          <div className="wallet-top">
            <div>
              <h3>Wallet Address</h3>
              <p>{shortAddress}</p>
              {chainId && <small>Chain ID: {chainId}</small>}
            </div>

            {selectedAccount ? (
              <button className="disconnect-btn" onClick={disconnectWallet}>
                Disconnect
              </button>
            ) : (
              <button className="connect-btn" onClick={connectBaseAccount}>
                Connect
              </button>
            )}
          </div>

          <div className="wallet-balance">
            <h3>Balance</h3>
            <h2>{balance} ETH</h2>
          </div>
        </div>

        {!selectedAccount && (
          <div className="wallet-options">
            <button className="connect-btn" onClick={connectBaseAccount}>
               MetaMask
            </button>

            <button
              className="connect-btn outline"
              onClick={() =>
                alert("WalletConnect option will be added in the next step.")
              }
            >
              WalletConnect
            </button>
          </div>
        )}

        <div className="wallet-stats">
          <div 
            className={`stat-card ${view === "owned" ? "active" : ""}`} 
            onClick={() => setView("owned")}
            style={{ cursor: 'pointer', border: view === 'owned' ? '2px solid #0052ff' : '1px solid #eee' }}
          >
            <h2>{nfts.length}</h2>
            <p>NFTs Owned</p>
          </div>

          <div className="stat-card">
            <h2>0</h2>
            <p>NFTs Sold</p>
          </div>

          <div 
            className={`stat-card ${view === "created" ? "active" : ""}`} 
            onClick={() => setView("created")}
            style={{ cursor: 'pointer', border: view === 'created' ? '2px solid #0052ff' : '1px solid #eee' }}
          >
            <h2>{createdNfts.length}</h2>
            <p>Collections</p>
          </div>
        </div>

        <h2 className="wallet-section-title">
          {view === "owned" ? "Your NFTs" : "Your Collections (Created)"}
        </h2>

        <div className="wallet-nft-grid">
          {loading ? (
            <p className="empty-nft-text">Loading your NFTs...</p>
          ) : displayNfts.length === 0 ? (
            <p className="empty-nft-text">
              {selectedAccount ? `No ${view} NFTs found.` : "Connect wallet to view your NFTs."}
            </p>
          ) : (
            displayNfts.map((nft, index) => (
              <div className="wallet-nft-card" key={index}>
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '16px' }} />
                ) : (
                  <div className="wallet-nft-image">NFT</div>
                )}

                <h3>{nft.name}</h3>
                <p>{nft.price}</p>
                {nft.description && <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{nft.description.slice(0, 30)}...</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Wallet;