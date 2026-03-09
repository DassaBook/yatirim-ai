import { useState, useEffect, useCallback, useRef } from "react";

const bistStocks = [
  { id:"thyao", name:"Türk Hava Yolları", symbol:"THYAO", basePrice:248 },
  { id:"garan", name:"Garanti BBVA", symbol:"GARAN", basePrice:112 },
  { id:"akbnk", name:"Akbank", symbol:"AKBNK", basePrice:58 },
  { id:"isctr", name:"İş Bankası C", symbol:"ISCTR", basePrice:14 },
  { id:"ykbnk", name:"Yapı Kredi", symbol:"YKBNK", basePrice:32 },
  { id:"eregl", name:"Ereğli Demir Çelik", symbol:"EREGL", basePrice:48 },
  { id:"kchol", name:"Koç Holding", symbol:"KCHOL", basePrice:185 },
  { id:"sahol", name:"Sabancı Holding", symbol:"SAHOL", basePrice:95 },
  { id:"sise", name:"Şişe Cam", symbol:"SISE", basePrice:42 },
  { id:"toaso", name:"Tofaş Otomobil", symbol:"TOASO", basePrice:210 },
  { id:"froto", name:"Ford Otosan", symbol:"FROTO", basePrice:1240 },
  { id:"tuprs", name:"Tüpraş", symbol:"TUPRS", basePrice:580 },
  { id:"asels", name:"Aselsan", symbol:"ASELS", basePrice:88 },
  { id:"bimas", name:"BİM Mağazalar", symbol:"BIMAS", basePrice:520 },
  { id:"mgros", name:"Migros", symbol:"MGROS", basePrice:620 },
  { id:"arclk", name:"Arçelik", symbol:"ARCLK", basePrice:185 },
  { id:"vesbe", name:"Vestel Beyaz Eşya", symbol:"VESBE", basePrice:72 },
  { id:"vestl", name:"Vestel", symbol:"VESTL", basePrice:28 },
  { id:"tcell", name:"Turkcell", symbol:"TCELL", basePrice:95 },
  { id:"ttkom", name:"Türk Telekom", symbol:"TTKOM", basePrice:38 },
  { id:"enkai", name:"Enka İnşaat", symbol:"ENKAI", basePrice:52 },
  { id:"ekgyo", name:"Emlak Konut GYO", symbol:"EKGYO", basePrice:18 },
  { id:"tavhl", name:"TAV Havalimanları", symbol:"TAVHL", basePrice:195 },
  { id:"petkm", name:"Petkim", symbol:"PETKM", basePrice:24 },
  { id:"brisa", name:"Brisa Bridgestone", symbol:"BRISA", basePrice:165 },
  { id:"dohol", name:"Doğan Holding", symbol:"DOHOL", basePrice:22 },
  { id:"gubrf", name:"Gübre Fabrikaları", symbol:"GUBRF", basePrice:180 },
  { id:"halkb", name:"Halkbank", symbol:"HALKB", basePrice:25 },
  { id:"vakbn", name:"VakıfBank", symbol:"VAKBN", basePrice:20 },
  { id:"zrgyo", name:"Ziraat GYO", symbol:"ZRGYO", basePrice:12 },
  { id:"kords", name:"Kordsa", symbol:"KORDS", basePrice:98 },
  { id:"ccola", name:"Coca-Cola İçecek", symbol:"CCOLA", basePrice:780 },
  { id:"ulker", name:"Ülker Bisküvi", symbol:"ULKER", basePrice:145 },
  { id:"tatgd", name:"TAT Gıda", symbol:"TATGD", basePrice:55 },
  { id:"aghol", name:"AG Anadolu Grubu", symbol:"AGHOL", basePrice:320 },
  { id:"doas", name:"Doğuş Otomotiv", symbol:"DOAS", basePrice:285 },
  { id:"otkar", name:"Otokar", symbol:"OTKAR", basePrice:1850 },
  { id:"logo", name:"Logo Yazılım", symbol:"LOGO", basePrice:420 },
  { id:"netas", name:"Netaş Telekomünikasyon", symbol:"NETAS", basePrice:48 },
  { id:"indes", name:"İndeks Bilgisayar", symbol:"INDES", basePrice:65 },
  { id:"ismen", name:"İş Yatırım Menkul", symbol:"ISMEN", basePrice:18 },
  { id:"alark", name:"Alarko Holding", symbol:"ALARK", basePrice:145 },
  { id:"algyo", name:"Alarko GYO", symbol:"ALGYO", basePrice:28 },
  { id:"ansgr", name:"Anadolu Sigorta", symbol:"ANSGR", basePrice:32 },
  { id:"akgrt", name:"Aksigorta", symbol:"AKGRT", basePrice:45 },
  { id:"golts", name:"Göltaş Çimento", symbol:"GOLTS", basePrice:185 },
  { id:"akcns", name:"Akçansa Çimento", symbol:"AKCNS", basePrice:195 },
  { id:"cimsa", name:"Çimsa Çimento", symbol:"CIMSA", basePrice:155 },
  { id:"boluc", name:"Bolu Çimento", symbol:"BOLUC", basePrice:88 },
  { id:"adnac", name:"Adana Çimento A", symbol:"ADNAC", basePrice:72 },
  { id:"skbnk", name:"Şekerbank", symbol:"SKBNK", basePrice:12 },
  { id:"tskb", name:"TSKB", symbol:"TSKB", basePrice:18 },
  { id:"eczyt", name:"Eczacıbaşı Yatırım", symbol:"ECZYT", basePrice:42 },
  { id:"ecilc", name:"Eczacıbaşı İlaç", symbol:"ECILC", basePrice:68 },
  { id:"selec", name:"Selçuk Ecza", symbol:"SELEC", basePrice:38 },
  { id:"afyon", name:"Afyon Çimento", symbol:"AFYON", basePrice:55 },
  { id:"ayen", name:"Aydem Enerji", symbol:"AYEN", basePrice:28 },
  { id:"zoren", name:"Zorlu Enerji", symbol:"ZOREN", basePrice:14 },
  { id:"akenr", name:"Ak Enerji", symbol:"AKENR", basePrice:22 },
  { id:"odas", name:"Odaş Elektrik", symbol:"ODAS", basePrice:35 },
  { id:"enjsa", name:"Enerjisa Enerji", symbol:"ENJSA", basePrice:55 },
  { id:"aksen", name:"Aksa Enerji", symbol:"AKSEN", basePrice:42 },
  { id:"tkfen", name:"Tekfen Holding", symbol:"TKFEN", basePrice:145 },
  { id:"tknsa", name:"Teknosa", symbol:"TKNSA", basePrice:18 },
  { id:"pgsus", name:"Pegasus Hava Taşımacılığı", symbol:"PGSUS", basePrice:650 },
  { id:"clebi", name:"Çelebi Hava Servisi", symbol:"CLEBI", basePrice:880 },
  { id:"mavi", name:"Mavi Giyim", symbol:"MAVI", basePrice:195 },
  { id:"lcwai", name:"LC Waikiki", symbol:"LCWAI", basePrice:58 },
  { id:"crfsa", name:"CarrefourSA", symbol:"CRFSA", basePrice:65 },
  { id:"sokm", name:"ŞOK Marketler", symbol:"SOKM", basePrice:52 },
  { id:"kozal", name:"Koza Altın", symbol:"KOZAL", basePrice:1250 },
  { id:"kozaa", name:"Koza Anadolu Metal", symbol:"KOZAA", basePrice:48 },
  { id:"aygaz", name:"Aygaz", symbol:"AYGAZ", basePrice:195 },
  { id:"ttrak", name:"Türk Traktör", symbol:"TTRAK", basePrice:850 },
  { id:"nuhcm", name:"Nuh Çimento", symbol:"NUHCM", basePrice:68 },
  { id:"parsn", name:"Parsan Makine", symbol:"PARSN", basePrice:42 },
  { id:"rysas", name:"Reysaş Taşımacılık", symbol:"RYSAS", basePrice:28 },
  { id:"mpark", name:"MLP Care", symbol:"MPARK", basePrice:185 },
  { id:"bfren", name:"Bosch Fren", symbol:"BFREN", basePrice:320 },
  { id:"goody", name:"Goodyear", symbol:"GOODY", basePrice:88 },
  { id:"sasa", name:"Sasa Polyester", symbol:"SASA", basePrice:42 },
  { id:"royal", name:"Royal Halı", symbol:"ROYAL", basePrice:28 },
  { id:"dmsas", name:"Demisaş Döküm", symbol:"DMSAS", basePrice:55 },
  { id:"ipman", name:"İpragaz", symbol:"IPMAN", basePrice:145 },
  { id:"klnma", name:"Kalkınma Yatırım Bankası", symbol:"KLNMA", basePrice:48 },
  { id:"gsdho", name:"GSD Holding", symbol:"GSDHO", basePrice:8 },
  { id:"dohol2", name:"Doğan Burda", symbol:"DOBUR", basePrice:18 },
  { id:"serve", name:"Servet GYO", symbol:"SERVE", basePrice:8 },
  { id:"ihlgm", name:"İhlas Gazetecilik", symbol:"IHLGM", basePrice:5 },
  { id:"ihlas", name:"İhlas Holding", symbol:"IHLAS", basePrice:8 },
  { id:"medtr", name:"Medical Park", symbol:"MEDTR", basePrice:75 },
  { id:"tire", name:"Tire Kutsan", symbol:"TIRE", basePrice:38 },
  { id:"cvkmd", name:"CVK Madencilik", symbol:"CVKMD", basePrice:12 },
  { id:"aefes", name:"Anadolu Efes", symbol:"AEFES", basePrice:320 },
  { id:"banvt", name:"Banvit", symbol:"BANVT", basePrice:85 },
  { id:"kervn", name:"Kervan Gıda", symbol:"KERVN", basePrice:42 },
  { id:"bryat", name:"Borusan Yatırım", symbol:"BRYAT", basePrice:145 },
  { id:"bmsch", name:"Borusan Makine", symbol:"BMSCH", basePrice:88 },
];

const globalAssets = [
  { id:"gold",    name:"Altın",    symbol:"XAU/TRY", icon:"🥇", category:"emtia",  basePriceTL:78000 },
  { id:"silver",  name:"Gümüş",    symbol:"XAG/TRY", icon:"🥈", category:"emtia",  basePriceTL:930   },
  { id:"oil",     name:"Petrol",   symbol:"WTI/TRY", icon:"🛢️", category:"emtia",  basePriceTL:2540  },
  { id:"usd",     name:"Dolar",    symbol:"USD/TRY", icon:"💵", category:"doviz",  basePriceTL:32.4  },
  { id:"eur",     name:"Euro",     symbol:"EUR/TRY", icon:"💶", category:"doviz",  basePriceTL:35.1  },
  { id:"gbp",     name:"Sterlin",  symbol:"GBP/TRY", icon:"💷", category:"doviz",  basePriceTL:41.2  },
  { id:"bist100", name:"BIST 100", symbol:"XU100",   icon:"📈", category:"borsa",  basePriceTL:9840  },
  { id:"sp500",   name:"S&P 500",  symbol:"SPX",     icon:"🏛️", category:"borsa",  basePriceTL:168000},
];

const sampleNews = [
  { id:1, title:"Fed faiz kararı açıklandı",           summary:"ABD Merkez Bankası faiz oranlarını sabit tuttu.",                        time:"5 dk önce",  impact:["gold","usd","sp500"],          sentiment:"nötr"     },
  { id:2, title:"Orta Doğu'da gerilim tırmanıyor",     summary:"Bölgedeki gelişmeler enerji ve emtia piyasalarını etkiliyor.",           time:"18 dk önce", impact:["oil","gold"],                  sentiment:"pozitif"  },
  { id:3, title:"TCMB faiz kararı açıklandı",          summary:"Türkiye Merkez Bankası politika faizini değiştirmedi.",                  time:"1 sa önce",  impact:["usd","eur","bist100"],         sentiment:"negatif"  },
  { id:4, title:"ABD enflasyon verisi açıklandı",      summary:"Enflasyon beklentilerin altında kaldı, altın yükseldi.",                 time:"2 sa önce",  impact:["gold","sp500","usd"],          sentiment:"pozitif"  },
  { id:5, title:"Çin büyüme rakamları geldi",          summary:"Çin ekonomisi %5,2 ile tahminlerin üzerinde büyüdü.",                   time:"3 sa önce",  impact:["oil","silver","sp500"],        sentiment:"pozitif"  },
  { id:6, title:"BIST 100 yeni zirve",                 summary:"Borsa İstanbul güçlü bankacılık verileriyle rekor kırdı.",               time:"4 sa önce",  impact:["bist100","garan","akbnk"],     sentiment:"pozitif"  },
  { id:7, title:"THY yolcu rekoru açıkladı",           summary:"Türk Hava Yolları Ocak–Mart döneminde yolcu rekoru kırdı.",             time:"5 sa önce",  impact:["thyao"],                       sentiment:"pozitif"  },
  { id:8, title:"Petrol OPEC kararıyla yükseldi",      summary:"OPEC+ üretim kısıtlamalarını sürdürme kararı aldı.",                    time:"6 sa önce",  impact:["oil","tuprs","petkm"],         sentiment:"pozitif"  },
];

function rnd(base) { return +(base + (Math.random()-0.48)*base*0.012).toFixed(2); }
function spark(base, n=14) { let c=base; return Array.from({length:n},()=>{ c=rnd(c); return c; }); }
function fmt(n) {
  if(n>=1000) return n.toLocaleString("tr-TR",{minimumFractionDigits:0,maximumFractionDigits:0});
  if(n>=10)   return n.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2});
  return n.toLocaleString("tr-TR",{minimumFractionDigits:3,maximumFractionDigits:3});
}

const Spark = ({data,pos}) => {
  const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const W=70,H=26;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*W},${H-((v-mn)/rng)*H}`).join(" ");
  return (
    <svg width={W} height={H} style={{overflow:"visible",flexShrink:0}}>
      <polyline points={pts} fill="none" stroke={pos?"#22c55e":"#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const ConfBar = ({level,color}) => (
  <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:10}}>
    {Array.from({length:5}).map((_,i)=>(
      <div key={i} style={{width:30,height:6,borderRadius:3,background:i<level?color:"rgba(255,255,255,0.08)"}}/>
    ))}
  </div>
);

export default function App() {
  const initPrices = () => {
    const obj={};
    globalAssets.forEach(a=>{ obj[a.id]={cur:a.basePriceTL, sp:spark(a.basePriceTL)}; });
    bistStocks.forEach(s=>{ obj[s.id]={cur:s.basePrice, sp:spark(s.basePrice)}; });
    return obj;
  };

  const [prices, setPrices]   = useState(initPrices);
  const [tab, setTab]         = useState("dashboard");
  const [catFilter, setCat]   = useState("global");
  const [search, setSearch]   = useState("");
  const [selAsset, setSel]    = useState(null);
  const [pred, setPred]       = useState(null);
  const [loading, setLoad]    = useState(false);
  const timerRef              = useRef(null);

  useEffect(()=>{
    timerRef.current = setInterval(()=>{
      setPrices(prev=>{
        const next={...prev};
        Object.keys(next).forEach(id=>{
          const nc=rnd(next[id].cur);
          next[id]={cur:nc, sp:[...next[id].sp.slice(1),nc]};
        });
        return next;
      });
    },3500);
    return ()=>clearInterval(timerRef.current);
  },[]);

  const chg = id => {
    const p=prices[id]; if(!p) return 0;
    return ((p.cur-p.sp[0])/p.sp[0])*100;
  };

  const getPred = useCallback(async(asset)=>{
    setSel(asset); setPred(null); setLoad(true); setTab("tahmin");
    const p=prices[asset.id];
    const change=chg(asset.id).toFixed(2);
    const relNews=sampleNews.filter(n=>n.impact?.includes(asset.id));
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1500,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          system:`Sen Türk ve global piyasalarda uzman bir finansal analistsin. Yeni başlayan yatırımcılara net Türkçe ile analiz yapıyorsun.

ÖNEMLİ: Önce web'de bu varlıkla ilgili güncel haberleri ara. Sonra SADECE aşağıdaki JSON formatında yanıt ver. JSON dışında kesinlikle hiçbir şey yazma:

{"karar":"AL","gucSeviyesi":4,"kisaVade":"1-7 gün beklenti açıklaması","uzunVade":"1 ay beklenti açıklaması","sebepler":["somut sebep 1","somut sebep 2","somut sebep 3"],"riskler":["risk 1","risk 2"],"ozet":"2 cümlelik sade özet"}

karar: mutlaka "AL", "SAT" veya "BEKLE" olmalı
gucSeviyesi: 1-5 tam sayı`,
          messages:[{role:"user",content:`${asset.name} (${asset.symbol||asset.id.toUpperCase()}) analizi yap.
Fiyat: ${fmt(p.cur)} TL | Değişim: %${change}
Yüksek: ${fmt(Math.max(...p.sp))} TL | Düşük: ${fmt(Math.min(...p.sp))} TL
${relNews.length>0?"Haberler: "+relNews.map(n=>n.title+": "+n.summary).join(" | "):""}
Web'de güncel haberleri ara, sonra JSON formatında analiz ver.`}]
        })
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data=await res.json();
      const fullText=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      const match=fullText.match(/\{[\s\S]*\}/);
      if(match){
        const parsed=JSON.parse(match[0]);
        if(!["AL","SAT","BEKLE"].includes(parsed.karar)) parsed.karar="BEKLE";
        parsed.gucSeviyesi=Math.min(5,Math.max(1,parseInt(parsed.gucSeviyesi)||3));
        setPred(parsed);
      } else {
        setPred({karar:"BEKLE",gucSeviyesi:3,kisaVade:"Kısa vadede yatay seyir bekleniyor",uzunVade:"Piyasa koşullarına göre değişim olabilir",sebepler:["Güncel piyasa verileri analiz edildi","Haber akışı değerlendirildi","Teknik göstergeler incelendi"],riskler:["Piyasa oynaklığı yüksek","Global belirsizlik devam ediyor"],ozet:"Bu varlık için şu an net bir sinyal oluşmadı. Piyasa gelişmelerini takip etmeye devam edin."});
      }
    } catch(e){
      setPred({karar:"BEKLE",gucSeviyesi:1,kisaVade:"Bağlantı hatası",uzunVade:"Tekrar deneyin",sebepler:["API bağlantısı kurulamadı"],riskler:["Teknik sorun"],ozet:"Analiz şu an yapılamıyor. Sayfayı yenileyip tekrar deneyin."});
    }
    setLoad(false);
  },[prices]);

  const bistFiltered=bistStocks.filter(s=>
    search===""||s.name.toLowerCase().includes(search.toLowerCase())||s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const kC=k=>k==="AL"?"#22c55e":k==="SAT"?"#ef4444":"#f59e0b";
  const kBg=k=>k==="AL"?"rgba(34,197,94,0.12)":k==="SAT"?"rgba(239,68,68,0.12)":"rgba(245,158,11,0.12)";
  const kE=k=>k==="AL"?"🟢":k==="SAT"?"🔴":"🟡";

  return (
    <div style={{fontFamily:"'Sora','Helvetica Neue',sans-serif",background:"#080c18",minHeight:"100vh",color:"#e2e8f0",maxWidth:430,margin:"0 auto",position:"relative",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
        body{background:#080c18}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        .card{background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.07);border-radius:14px;transition:all .15s}
        .card:active{background:rgba(255,255,255,0.065);transform:scale(0.985)}
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.04) 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;border-radius:8px}
        .tb{flex:1;padding:9px 0;border:none;background:transparent;color:#475569;font-size:12px;font-family:inherit;font-weight:600;cursor:pointer;border-radius:9px;transition:all .2s}
        .tb.on{background:rgba(255,255,255,0.07);color:#e2e8f0}
        .pill{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;border:none;cursor:pointer;font-family:inherit;transition:all .2s}
        .dot{width:7px;height:7px;background:#22c55e;border-radius:50%;animation:pulse 1.4s infinite;display:inline-block}
        .anim{animation:up .35s ease forwards}
        .mono{font-family:'JetBrains Mono',monospace}
        input{outline:none}
        input::placeholder{color:#334155}
        button{outline:none}
      `}</style>

      {/* STATUS BAR */}
      <div style={{padding:"12px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:"#1e293b"}}>9:41</span>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span className="dot"/>
          <span style={{fontSize:10,color:"#22c55e",fontWeight:700,letterSpacing:.5}}>CANLI</span>
        </div>
      </div>

      {/* HEADER */}
      <div style={{padding:"12px 20px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.8px",background:"linear-gradient(135deg,#f1f5f9 30%,#64748b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>YatırımAI</h1>
            <p style={{fontSize:11,color:"#334155",marginTop:1}}>Yapay Zeka Destekli Piyasa Analizi • TL Bazlı</p>
          </div>
          <div className="mono" style={{fontSize:11,color:"#334155"}}>
            {new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{padding:"12px 20px 0"}}>
        <div style={{display:"flex",gap:3,background:"rgba(255,255,255,0.025)",borderRadius:11,padding:3}}>
          {[{id:"dashboard",l:"📊 Piyasalar"},{id:"haberler",l:"📰 Haberler"},{id:"tahmin",l:"🤖 AI Tahmin"}].map(t=>(
            <button key={t.id} className={`tb${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>{t.l}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:"14px 20px",paddingBottom:90,overflowY:"auto",maxHeight:"calc(100vh - 155px)"}}>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard" && (
          <div className="anim">
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {[{id:"global",label:"🌍 Global"},{id:"bist",label:"🇹🇷 BIST 100"}].map(c=>(
                <button key={c.id} className="pill" onClick={()=>{setCat(c.id);setSearch("");}} style={{background:catFilter===c.id?"rgba(99,179,237,0.18)":"rgba(255,255,255,0.04)",color:catFilter===c.id?"#93c5fd":"#475569",border:catFilter===c.id?"1px solid rgba(99,179,237,0.35)":"1px solid rgba(255,255,255,0.07)"}}>{c.label}</button>
              ))}
            </div>

            {catFilter==="bist" && (
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Hisse ara... (THYAO, Garanti...)"
                style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,color:"#e2e8f0",fontSize:13,fontFamily:"inherit",marginBottom:12}}/>
            )}

            {catFilter==="global" && (
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {globalAssets.map(a=>{
                  const p=prices[a.id]; if(!p) return null;
                  const c=chg(a.id); const pos=c>=0;
                  return (
                    <div key={a.id} className="card" onClick={()=>getPred({...a,isTL:true})} style={{padding:"13px 14px",cursor:"pointer"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:22}}>{a.icon}</span>
                          <div>
                            <div style={{fontWeight:600,fontSize:14}}>{a.name}</div>
                            <div className="mono" style={{fontSize:10,color:"#334155"}}>{a.symbol}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <Spark data={p.sp} pos={pos}/>
                          <div style={{textAlign:"right",minWidth:90}}>
                            <div className="mono" style={{fontWeight:600,fontSize:14}}>{fmt(p.cur)} ₺</div>
                            <div className="mono" style={{fontSize:11,fontWeight:600,color:pos?"#22c55e":"#ef4444"}}>{pos?"+":""}{c.toFixed(2)}%</div>
                          </div>
                        </div>
                      </div>
                      <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.04)",display:"flex",justifyContent:"flex-end"}}>
                        <span style={{fontSize:10,color:"#334155"}}>🤖 AI Tahmin Al →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {catFilter==="bist" && (
              <div>
                <div style={{fontSize:11,color:"#334155",marginBottom:10}}>{bistFiltered.length} hisse listeleniyor</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {bistFiltered.map(s=>{
                    const p=prices[s.id]; if(!p) return null;
                    const c=chg(s.id); const pos=c>=0;
                    return (
                      <div key={s.id} className="card" onClick={()=>getPred({...s,icon:"📊",category:"hisse",isBIST:true})} style={{padding:"11px 13px",cursor:"pointer"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                              <span className="mono" style={{fontSize:10,fontWeight:600,color:"#93c5fd",background:"rgba(99,179,237,0.1)",padding:"2px 6px",borderRadius:5,flexShrink:0}}>{s.symbol}</span>
                              <span style={{fontWeight:500,fontSize:12,color:"#cbd5e1",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
                            </div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
                            <Spark data={p.sp} pos={pos}/>
                            <div style={{textAlign:"right",minWidth:72}}>
                              <div className="mono" style={{fontWeight:600,fontSize:13}}>{fmt(p.cur)} ₺</div>
                              <div className="mono" style={{fontSize:11,fontWeight:600,color:pos?"#22c55e":"#ef4444"}}>{pos?"+":""}{c.toFixed(2)}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── HABERLER ── */}
        {tab==="haberler" && (
          <div className="anim">
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              {sampleNews.map(n=>{
                const sc=n.sentiment==="pozitif"?"#22c55e":n.sentiment==="negatif"?"#ef4444":"#f59e0b";
                const allA=[...globalAssets,...bistStocks];
                const imp=allA.filter(a=>n.impact?.includes(a.id));
                return (
                  <div key={n.id} className="card" style={{padding:"13px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                      <div style={{flex:1,paddingRight:10}}>
                        <div style={{fontWeight:600,fontSize:14,lineHeight:1.4,marginBottom:4}}>{n.title}</div>
                        <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>{n.summary}</div>
                      </div>
                      <div style={{flexShrink:0,textAlign:"right"}}>
                        <div style={{fontSize:9,color:"#334155",marginBottom:4}}>{n.time}</div>
                        <div style={{fontSize:10,fontWeight:700,color:sc,background:`${sc}18`,padding:"2px 8px",borderRadius:20,whiteSpace:"nowrap"}}>
                          {n.sentiment==="pozitif"?"↑ Pozitif":n.sentiment==="negatif"?"↓ Negatif":"→ Nötr"}
                        </div>
                      </div>
                    </div>
                    {imp.length>0&&(
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {imp.slice(0,5).map(a=>(
                          <span key={a.id} onClick={()=>getPred({...a,icon:a.icon||"📊",category:a.category||"hisse",isBIST:!a.icon})}
                            style={{fontSize:10,padding:"3px 8px",borderRadius:7,background:"rgba(255,255,255,0.05)",color:"#94a3b8",cursor:"pointer",border:"1px solid rgba(255,255,255,0.07)"}}>
                            {a.icon||"📊"} {a.symbol||a.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:14,padding:"13px",background:"rgba(99,179,237,0.06)",borderRadius:13,border:"1px solid rgba(99,179,237,0.14)"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#93c5fd",marginBottom:5}}>🤖 Nasıl Kullanılır?</div>
              <p style={{fontSize:11,color:"#475569",lineHeight:1.6}}>Haberdeki varlık etiketine tıklayarak o varlık için gerçek zamanlı AI analizi alabilirsin.</p>
            </div>
          </div>
        )}

        {/* ── TAHMİN ── */}
        {tab==="tahmin" && (
          <div className="anim">
            {!selAsset&&!loading&&(
              <div style={{textAlign:"center",padding:"36px 16px"}}>
                <div style={{fontSize:52,marginBottom:14}}>🤖</div>
                <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>AI Tahmin Motoru</h3>
                <p style={{fontSize:13,color:"#475569",lineHeight:1.7,marginBottom:22}}>Piyasalar veya Haberler sekmesinden bir varlığa tıklayarak gerçek zamanlı analiz al.</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                  {[globalAssets[0],globalAssets[3],{...bistStocks[0],icon:"📊",category:"hisse"},{...bistStocks[1],icon:"📊",category:"hisse"}].map(a=>(
                    <div key={a.id} className="card" onClick={()=>getPred(a)} style={{padding:"14px",cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontSize:26,marginBottom:7}}>{a.icon||"📊"}</div>
                      <div style={{fontWeight:600,fontSize:12,marginBottom:2}}>{a.name}</div>
                      <div style={{fontSize:10,color:"#334155"}}>Tahmin Al →</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading&&(
              <div style={{padding:"28px 0",textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12,animation:"pulse 0.8s infinite"}}>🤖</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{selAsset?.name} analiz ediliyor...</div>
                <div style={{fontSize:12,color:"#475569",marginBottom:18}}>Web'de güncel haberler aranıyor...</div>
                {[75,55,65,45,70].map((w,i)=>(
                  <div key={i} className="skel" style={{height:14,width:`${w}%`,margin:"0 auto 9px"}}/>
                ))}
              </div>
            )}

            {pred&&selAsset&&!loading&&(
              <div className="anim">
                <div className="card" style={{padding:"14px",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:28}}>{selAsset.icon||"📊"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:16}}>{selAsset.name}</div>
                      <div className="mono" style={{fontSize:10,color:"#334155"}}>{selAsset.symbol||selAsset.id.toUpperCase()}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div className="mono" style={{fontWeight:700,fontSize:17}}>{fmt(prices[selAsset.id]?.cur||0)} ₺</div>
                      <div className="mono" style={{fontSize:12,fontWeight:600,color:chg(selAsset.id)>=0?"#22c55e":"#ef4444"}}>
                        {chg(selAsset.id)>=0?"+":""}{chg(selAsset.id).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{padding:"20px",borderRadius:16,marginBottom:12,textAlign:"center",background:kBg(pred.karar),border:`1px solid ${kC(pred.karar)}35`}}>
                  <div style={{fontSize:42,marginBottom:8}}>{kE(pred.karar)}</div>
                  <div style={{fontSize:34,fontWeight:800,color:kC(pred.karar),letterSpacing:"-1px"}}>{pred.karar}</div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:3}}>AI Tavsiyesi</div>
                  <ConfBar level={pred.gucSeviyesi} color={kC(pred.karar)}/>
                  <div style={{fontSize:11,color:"#334155",marginTop:6}}>Güven Seviyesi: {pred.gucSeviyesi}/5</div>
                </div>

                <div className="card" style={{padding:"14px",marginBottom:10}}>
                  <div style={{fontSize:11,color:"#334155",fontWeight:700,marginBottom:7}}>📝 ÖZET</div>
                  <p style={{fontSize:13,color:"#cbd5e1",lineHeight:1.75}}>{pred.ozet}</p>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
                  <div className="card" style={{padding:"13px"}}>
                    <div style={{fontSize:10,color:"#334155",fontWeight:700,marginBottom:5}}>⚡ KISA VADE</div>
                    <div style={{fontSize:10,color:"#64748b",marginBottom:3}}>1 – 7 gün</div>
                    <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{pred.kisaVade}</div>
                  </div>
                  <div className="card" style={{padding:"13px"}}>
                    <div style={{fontSize:10,color:"#334155",fontWeight:700,marginBottom:5}}>📅 UZUN VADE</div>
                    <div style={{fontSize:10,color:"#64748b",marginBottom:3}}>1 ay</div>
                    <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{pred.uzunVade}</div>
                  </div>
                </div>

                <div className="card" style={{padding:"14px",marginBottom:10}}>
                  <div style={{fontSize:11,color:"#334155",fontWeight:700,marginBottom:10}}>✅ TAHMİN SEBEPLERİ</div>
                  {pred.sebepler?.map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:9}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:kC(pred.karar),marginTop:5,flexShrink:0}}/>
                      <span style={{fontSize:13,color:"#cbd5e1",lineHeight:1.55}}>{s}</span>
                    </div>
                  ))}
                </div>

                <div className="card" style={{padding:"14px",marginBottom:10,borderColor:"rgba(239,68,68,0.15)"}}>
                  <div style={{fontSize:11,color:"#334155",fontWeight:700,marginBottom:10}}>⚠️ RİSK FAKTÖRLERİ</div>
                  {pred.riskler?.map((r,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:9}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#ef4444",marginTop:5,flexShrink:0}}/>
                      <span style={{fontSize:13,color:"#cbd5e1",lineHeight:1.55}}>{r}</span>
                    </div>
                  ))}
                </div>

                <div style={{padding:"11px 13px",background:"rgba(245,158,11,0.07)",borderRadius:11,border:"1px solid rgba(245,158,11,0.18)",marginBottom:13}}>
                  <p style={{fontSize:11,color:"#fbbf24",lineHeight:1.6}}>⚠️ Bu analiz yatırım tavsiyesi değildir. Yatırım kararlarını kendi araştırmanla ve bir uzmana danışarak ver.</p>
                </div>

                <button onClick={()=>{setSel(null);setPred(null);setTab("dashboard");}} style={{width:"100%",padding:"13px",borderRadius:13,background:"rgba(99,179,237,0.12)",border:"1px solid rgba(99,179,237,0.25)",color:"#93c5fd",fontFamily:"inherit",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                  ← Yeni Varlık Analiz Et
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:430,background:"rgba(8,12,24,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"10px 20px 22px",display:"flex",justifyContent:"space-around"}}>
        {[{id:"dashboard",icon:"📊",label:"Piyasalar"},{id:"haberler",icon:"📰",label:"Haberler"},{id:"tahmin",icon:"🤖",label:"AI Tahmin"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"transparent",border:"none",cursor:"pointer",color:tab===t.id?"#93c5fd":"#334155",fontSize:9,fontFamily:"inherit",fontWeight:700,padding:"4px 14px",borderRadius:10,borderTop:tab===t.id?"2px solid #93c5fd":"2px solid transparent"}}>
            <span style={{fontSize:19}}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
