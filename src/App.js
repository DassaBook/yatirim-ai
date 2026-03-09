import { useState, useEffect, useCallback } from "react";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const assets = [
  { id: "gold", name: "Altın", symbol: "XAU/USD", icon: "🥇", category: "emtia", basePrice: 2340, unit: "$/oz" },
  { id: "silver", name: "Gümüş", symbol: "XAG/USD", icon: "🥈", category: "emtia", basePrice: 28.5, unit: "$/oz" },
  { id: "oil", name: "Petrol", symbol: "WTI", icon: "🛢️", category: "emtia", basePrice: 78.2, unit: "$/varil" },
  { id: "usd", name: "Dolar", symbol: "USD/TRY", icon: "💵", category: "doviz", basePrice: 32.4, unit: "TL" },
  { id: "eur", name: "Euro", symbol: "EUR/TRY", icon: "💶", category: "doviz", basePrice: 35.1, unit: "TL" },
  { id: "bist100", name: "BIST 100", symbol: "XU100", icon: "📈", category: "borsa", basePrice: 9840, unit: "puan" },
  { id: "thyao", name: "Türk Hava Yolları", symbol: "THYAO", icon: "✈️", category: "hisse", basePrice: 248, unit: "TL" },
  { id: "sp500", name: "S&P 500", symbol: "SPX", icon: "🏛️", category: "borsa", basePrice: 5240, unit: "puan" },
];

const sampleNews = [
  { id: 1, title: "Fed faiz kararı açıklandı", summary: "ABD Merkez Bankası faiz oranlarını sabit tuttu", time: "2 dk önce", impact: ["gold", "usd", "sp500"], sentiment: "nötr" },
  { id: 2, title: "Orta Doğu'da gerilim tırmanıyor", summary: "Bölgedeki çatışmalar enerji piyasalarını etkiliyor", time: "15 dk önce", impact: ["oil", "gold"], sentiment: "pozitif" },
  { id: 3, title: "TCMB toplantı kararı", summary: "Türkiye Merkez Bankası faiz kararını açıkladı", time: "1 sa önce", impact: ["usd", "eur", "bist100"], sentiment: "negatif" },
  { id: 4, title: "Enflasyon verileri geldi", summary: "ABD enflasyonu beklentilerin altında kaldı", time: "2 sa önce", impact: ["gold", "sp500", "usd"], sentiment: "pozitif" },
  { id: 5, title: "Çin büyüme rakamları", summary: "Çin ekonomisi tahminlerin üzerinde büyüdü", time: "3 sa önce", impact: ["oil", "silver", "sp500"], sentiment: "pozitif" },
];

function generateMockPrice(base) {
  const change = (Math.random() - 0.48) * base * 0.015;
  return +(base + change).toFixed(2);
}

function generateSparkline(base, points = 12) {
  let current = base;
  return Array.from({ length: points }, () => {
    current = +(current + (Math.random() - 0.5) * current * 0.008).toFixed(2);
    return current;
  });
}

const Sparkline = ({ data, positive }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80, height = 30;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline points={points} fill="none" stroke={positive ? "#10b981" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function App() {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(assets.map(a => [a.id, { current: a.basePrice, prev: a.basePrice, sparkline: generateSparkline(a.basePrice) }]))
  );
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [catFilter, setCatFilter] = useState("tümü");

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        assets.forEach(a => {
          const newPrice = generateMockPrice(next[a.id].current);
          const newSparkline = [...next[a.id].sparkline.slice(1), newPrice];
          next[a.id] = { current: newPrice, prev: next[a.id].current, sparkline: newSparkline };
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getPrediction = useCallback(async (asset) => {
    setSelectedAsset(asset);
    setPrediction(null);
    setLoading(true);
    setActiveTab("tahmin");
    const priceData = prices[asset.id];
    const change = ((priceData.current - priceData.sparkline[0]) / priceData.sparkline[0] * 100).toFixed(2);
    const relatedNews = sampleNews.filter(n => n.impact.includes(asset.id));
    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `Sen deneyimli bir finansal analiz asistanısın. Yeni başlayan Türk yatırımcılara sade, anlaşılır Türkçe ile yatırım tahmini yapıyorsun. 
Yanıtını SADECE şu JSON formatında ver, başka hiçbir şey yazma:
{
  "karar": "AL" veya "SAT" veya "BEKLE",
  "gucSeviyesi": 1-5 arası sayı,
  "kisaVade": "1-7 gün içinde beklenti",
  "uzunVade": "1 ay içinde beklenti",
  "sebepler": ["sebep 1", "sebep 2", "sebep 3"],
  "riskler": ["risk 1", "risk 2"],
  "ozet": "Yeni başlayan yatırımcı için 2 cümlelik sade özet"
}`,
          messages: [{
            role: "user",
            content: `${asset.name} (${asset.symbol}) için güncel piyasa analizi ve tahmin yap. Mevcut fiyat: ${priceData.current} ${asset.unit}. Son değişim: %${change}. İlgili haberler: ${relatedNews.map(n => n.title + ": " + n.summary).join("; ")}`
          }]
        })
      });
      const data = await response.json();
      const fullText = data.content?.map(b => b.type === "text" ? b.text : "").join("").trim();
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setPrediction(JSON.parse(jsonMatch[0]));
      } else {
        setPrediction({ karar: "BEKLE", gucSeviyesi: 3, kisaVade: "Analiz tamamlandı", uzunVade: "Piyasa değerlendiriliyor", sebepler: ["Veriler incelendi"], riskler: ["Piyasa volatilitesi"], ozet: fullText.substring(0, 200) });
      }
    } catch (e) {
      setPrediction({ karar: "BEKLE", gucSeviyesi: 2, kisaVade: "Veri alınamadı", uzunVade: "Lütfen tekrar deneyin", sebepler: ["Bağlantı hatası"], riskler: ["Tekrar deneyiniz"], ozet: "Analiz şu an yapılamıyor. İnternet bağlantınızı kontrol edin." });
    }
    setLoading(false);
  }, [prices]);

  const getChange = (id) => {
    const p = prices[id];
    return ((p.current - p.sparkline[0]) / p.sparkline[0] * 100);
  };

  const categories = [
    { id: "tümü", label: "Tümü" },
    { id: "emtia", label: "Emtia" },
    { id: "doviz", label: "Döviz" },
    { id: "borsa", label: "Borsa" },
    { id: "hisse", label: "Hisse" },
  ];

  const filteredAssets = catFilter === "tümü" ? assets : assets.filter(a => a.category === catFilter);
  const kararColor = (k) => k === "AL" ? "#10b981" : k === "SAT" ? "#ef4444" : "#f59e0b";
  const kararBg = (k) => k === "AL" ? "rgba(16,185,129,0.15)" : k === "SAT" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)";
  const kararEmoji = (k) => k === "AL" ? "🟢" : k === "SAT" ? "🔴" : "🟡";

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0a0e1a", minHeight: "100vh", color: "#e2e8f0", maxWidth: 430, margin: "0 auto", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
        .card:active { background: rgba(255,255,255,0.07); transform: scale(0.98); transition: all 0.1s; }
        .loading-bar { background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        .live-dot { width:7px; height:7px; background:#10b981; border-radius:50%; animation: pulse 1.5s infinite; display:inline-block; }
        .tab-btn { flex:1; padding: 10px 0; border:none; background:transparent; color:#64748b; font-size:13px; font-family:inherit; font-weight:500; cursor:pointer; border-radius:10px; transition:all 0.2s; }
        .tab-btn.active { background:rgba(255,255,255,0.08); color:#e2e8f0; }
        .pill { padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600; border:none; cursor:pointer; transition:all 0.2s; font-family:inherit; }
        .anim { animation: slideUp 0.4s ease forwards; }
      `}</style>

      <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#475569" }}>YatırımAI</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <span className="live-dot" />
          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>CANLI</span>
        </div>
      </div>

      <div style={{ padding: "16px 20px 12px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>YatırımAI</h1>
        <p style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Yapay Zeka Destekli Piyasa Analizi</p>
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4 }}>
          {[{ id: "dashboard", label: "📊 Piyasalar" }, { id: "haberler", label: "📰 Haberler" }, { id: "tahmin", label: "🤖 AI Tahmin" }].map(t => (
            <button key={t.id} className={`tab-btn${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px", paddingBottom: 100, overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}>

        {activeTab === "dashboard" && (
          <div className="anim">
            <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {categories.map(c => (
                <button key={c.id} className="pill" onClick={() => setCatFilter(c.id)} style={{ background: catFilter === c.id ? "rgba(99,179,237,0.2)" : "rgba(255,255,255,0.04)", color: catFilter === c.id ? "#93c5fd" : "#64748b", border: catFilter === c.id ? "1px solid rgba(99,179,237,0.4)" : "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>{c.label}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredAssets.map((asset) => {
                const p = prices[asset.id];
                const change = getChange(asset.id);
                const isPos = change >= 0;
                return (
                  <div key={asset.id} className="card" onClick={() => getPrediction(asset)} style={{ padding: "14px 16px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 24 }}>{asset.icon}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{asset.name}</div>
                          <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{asset.symbol}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Sparkline data={p.sparkline} positive={isPos} />
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 15 }}>{p.current.toLocaleString("tr-TR", { minimumFractionDigits: 0 })}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono', monospace", color: isPos ? "#10b981" : "#ef4444" }}>{isPos ? "+" : ""}{change.toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "#475569" }}>{asset.unit}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>🤖 AI Tahmin Al →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "haberler" && (
          <div className="anim">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sampleNews.map((news) => {
                const sentimentColor = news.sentiment === "pozitif" ? "#10b981" : news.sentiment === "negatif" ? "#ef4444" : "#f59e0b";
                const impactedAssets = assets.filter(a => news.impact.includes(a.id));
                return (
                  <div key={news.id} className="card" style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ flex: 1, paddingRight: 12 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{news.title}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{news.summary}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>{news.time}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: sentimentColor, background: `${sentimentColor}20`, padding: "2px 8px", borderRadius: 20 }}>
                          {news.sentiment === "pozitif" ? "↑ Pozitif" : news.sentiment === "negatif" ? "↓ Negatif" : "→ Nötr"}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {impactedAssets.map(a => (
                        <span key={a.id} onClick={() => getPrediction(a)} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#94a3b8", cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {a.icon} {a.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "tahmin" && (
          <div className="anim">
            {!selectedAsset && !loading && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>AI Tahmin Motoru</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>Piyasalar sekmesinden bir varlık seçerek yapay zeka destekli tahmin alabilirsin.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {assets.slice(0, 4).map(a => (
                    <div key={a.id} className="card" onClick={() => getPrediction(a)} style={{ padding: "16px", cursor: "pointer", textAlign: "center" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Tahmin Al →</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div style={{ padding: "20px 0", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12, animation: "pulse 1s infinite" }}>🤖</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{selectedAsset?.name} analiz ediliyor...</div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Güncel haberler ve piyasa verileri işleniyor</div>
                {[80, 60, 70, 50].map((w, i) => (<div key={i} className="loading-bar" style={{ height: 16, width: `${w}%`, marginBottom: 10, marginLeft: "auto", marginRight: "auto" }} />))}
              </div>
            )}

            {prediction && selectedAsset && !loading && (
              <div className="anim">
                <div className="card" style={{ padding: "16px", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 32 }}>{selectedAsset.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 17 }}>{selectedAsset.name}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{selectedAsset.symbol}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 18 }}>{prices[selectedAsset.id].current.toLocaleString("tr-TR")}</div>
                      <div style={{ fontSize: 12, color: getChange(selectedAsset.id) >= 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>{getChange(selectedAsset.id) >= 0 ? "+" : ""}{getChange(selectedAsset.id).toFixed(2)}%</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "20px", borderRadius: 16, marginBottom: 14, textAlign: "center", background: kararBg(prediction.karar), border: `1px solid ${kararColor(prediction.karar)}40` }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{kararEmoji(prediction.karar)}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: kararColor(prediction.karar) }}>{prediction.karar}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>AI Tavsiyesi</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 12 }}>
                    {Array.from({ length: 5 }).map((_, i) => (<div key={i} style={{ width: 28, height: 6, borderRadius: 3, background: i < prediction.gucSeviyesi ? kararColor(prediction.karar) : "rgba(255,255,255,0.1)" }} />))}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>Güven Seviyesi: {prediction.gucSeviyesi}/5</div>
                </div>

                <div className="card" style={{ padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 6 }}>📝 ÖZET</div>
                  <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}>{prediction.ozet}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <div className="card" style={{ padding: "14px" }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 6 }}>⚡ KISA VADE</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{prediction.kisaVade}</div>
                  </div>
                  <div className="card" style={{ padding: "14px" }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 6 }}>📅 UZUN VADE</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{prediction.uzunVade}</div>
                  </div>
                </div>

                <div className="card" style={{ padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 10 }}>✅ TAHMİN SEBEPLERİ</div>
                  {prediction.sebepler?.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: kararColor(prediction.karar), marginTop: 5, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 10 }}>⚠️ RİSKLER</div>
                  {prediction.riskler?.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", marginTop: 5, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "12px 14px", background: "rgba(245,158,11,0.08)", borderRadius: 12, border: "1px solid rgba(245,158,11,0.2)", marginBottom: 14 }}>
                  <p style={{ fontSize: 11, color: "#fbbf24", lineHeight: 1.6 }}>⚠️ Bu tahminler yatırım tavsiyesi değildir. Sadece eğitim amaçlıdır.</p>
                </div>

                <button onClick={() => { setSelectedAsset(null); setPrediction(null); setActiveTab("dashboard"); }} style={{ width: "100%", padding: "14px", borderRadius: 14, background: "rgba(99,179,237,0.15)", border: "1px solid rgba(99,179,237,0.3)", color: "#93c5fd", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                  ← Yeni Varlık Analiz Et
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 430, background: "rgba(10,14,26,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px 24px", display: "flex", justifyContent: "space-around" }}>
        {[{ id: "dashboard", icon: "📊", label: "Piyasalar" }, { id: "haberler", icon: "📰", label: "Haberler" }, { id: "tahmin", icon: "🤖", label: "AI Tahmin" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", color: activeTab === t.id ? "#93c5fd" : "#475569", fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, padding: "4px 16px", borderRadius: 10, borderTop: activeTab === t.id ? "2px solid #93c5fd" : "2px solid transparent" }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
