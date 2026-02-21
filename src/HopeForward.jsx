import { useState, useMemo, useRef, useEffect } from "react";

const BLUE = "#4DAFE8";
const GOLD = "#F5C518";
const GOLD_LIGHT = "#F7D96B";
const ORANGE = "#E8873A";
const GREEN = "#5CB85C";
const GRAD = `linear-gradient(135deg, ${BLUE}, #2e86c1)`;
const GRAD_GOLD = `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`;

const UK_REGIONS = [
  "East Midlands","East of England","London","North East England",
  "North West England","Northern Ireland","Scotland","South East England",
  "South West England","Wales","West Midlands","Yorkshire & the Humber",
];

const PRISONS_ENGLAND_WALES = [
  // England - London & South East
  "HMP Belmarsh","HMP Brixton","HMP Bronzefield","HMP Coldingley","HMP Downview",
  "HMP Elmley","HMP Ford","HMP Highdown","HMP Kingston","HMP Lewes",
  "HMP Maidstone","HMP Pentonville","HMP Rochester","HMP Standford Hill",
  "HMP Swaleside","HMP Wandsworth","HMP Wormwood Scrubs","HMP/YOI Cookham Wood",
  "HMP/YOI Feltham","HMP/YOI Isis","HMP/YOI Send",
  // England - South West
  "HMP Dartmoor","HMP Dorchester","HMP Erlestoke","HMP Exeter","HMP Guys Marsh",
  "HMP Guys Marsh","HMP Portland","HMP Shepton Mallet","HMP The Verne","HMP Leyhill",
  // England - South & South Central
  "HMP Albany","HMP Camp Hill","HMP Channings Wood","HMP Parkhurst","HMP Winchester",
  // England - East of England
  "HMP Bedford","HMP Bure","HMP Chelmsford","HMP Highpoint North","HMP Highpoint South",
  "HMP Hollesley Bay","HMP Littlehey","HMP Peterborough","HMP Warren Hill","HMP Wayland",
  "HMP Whitemoor","HMP/YOI Bullwood Hall",
  // England - East Midlands
  "HMP Foston Hall","HMP Gartree","HMP Glen Parva","HMP Leicester","HMP Lincoln",
  "HMP Lowdham Grange","HMP Morton Hall","HMP Nottingham","HMP Ranby","HMP Stocken",
  "HMP Whatton","HMP/YOI Moorland","HMP Sudbury",
  // England - West Midlands
  "HMP Birmingham","HMP Blakenhurst","HMP Brinsford","HMP Drake Hall","HMP Featherstone",
  "HMP Hewell","HMP Long Lartin","HMP Oakwood","HMP Onley","HMP Stafford",
  "HMP Stoke Heath","HMP Swinfen Hall","HMP Winson Green","HMP/YOI Brinsford",
  // England - North West
  "HMP Altcourse","HMP Buckley Hall","HMP Dovegate","HMP Forest Bank","HMP Garth",
  "HMP Haverigg","HMP Hindley","HMP Kennet","HMP Lancaster Farms","HMP Liverpool",
  "HMP Manchester (Strangeways)","HMP Risley","HMP Thorn Cross","HMP Wymott",
  "HMP/YOI Hindley","HMP Preston",
  // England - North East
  "HMP Acklington","HMP Castington","HMP Durham","HMP Frankland","HMP Full Sutton",
  "HMP Holme House","HMP Low Newton","HMP Northumberland",
  // England - Yorkshire & Humber
  "HMP Armley (Leeds)","HMP Askham Grange","HMP Doncaster","HMP Everthorpe",
  "HMP Humber","HMP Hull","HMP Kirkham","HMP Lindholme","HMP New Hall",
  "HMP Wealstun","HMP Wetherby","HMP/YOI Deerbolt","HMP/YOI Wetherby",
  // Wales
  "HMP Cardiff","HMP Parc","HMP Swansea","HMP Usk","HMP/YOI Parc",
  // Secure Training Centres / Other
  "HMYOI Aylesbury","HMYOI Cookham Wood","HMYOI Dover","HMYOI Glen Parva",
  "HMYOI Hatfield","HMYOI Huntercombe","HMYOI Lancaster Farms","HMYOI Onley",
  "HMYOI Portland","HMYOI Reading","HMYOI Rochester","HMYOI Thorn Cross",
  "HMYOI Warren Hill","HMYOI Werrington","HMYOI Wetherby","HMYOI Woking",
].sort();

const SEED_USERS = [
  { id:"u1",  name:"Marcus T.",  region:"London",                 prison:"HMP Belmarsh",                 score:82 },
  { id:"u2",  name:"Denise R.",  region:"West Midlands",          prison:"HMP Birmingham",               score:74 },
  { id:"u3",  name:"James W.",   region:"North West England",     prison:"HMP Manchester (Strangeways)", score:61 },
  { id:"u4",  name:"Priya K.",   region:"South East England",     prison:"HMP Downview",                 score:90 },
  { id:"u5",  name:"Lee B.",     region:"Yorkshire & the Humber", prison:"HMP Armley (Leeds)",           score:55 },
  { id:"u6",  name:"Sandra M.",  region:"Scotland",               prison:"",                             score:68 },
  { id:"u7",  name:"Tyrone H.",  region:"East Midlands",          prison:"HMP Nottingham",               score:79 },
  { id:"u8",  name:"Caitlin F.", region:"Wales",                  prison:"HMP Cardiff",                  score:47 },
  { id:"u9",  name:"Raj P.",     region:"North East England",     prison:"HMP Durham",                   score:88 },
  { id:"u10", name:"Amira O.",   region:"South West England",     prison:"HMP Exeter",                   score:63 },
  { id:"u11", name:"Dean C.",    region:"London",                 prison:"HMP Wandsworth",               score:71 },
  { id:"u12", name:"Nadia L.",   region:"East of England",        prison:"HMP Peterborough",             score:85 },
  { id:"u13", name:"Kevin S.",   region:"Northern Ireland",       prison:"",                             score:39 },
  { id:"u14", name:"Fatima A.",  region:"North West England",     prison:"HMP Manchester (Strangeways)", score:92 },
  { id:"u15", name:"Brett J.",   region:"West Midlands",          prison:"HMP Hewell",                   score:58 },
];

const categoryColors = {
  "Probation & Supervision":"#c0392b", Housing:BLUE, Employment:ORANGE,
  Education:GREEN, Family:"#8E44AD", Health:"#16A085", Finance:"#d35400", Identity:"#2c3e50",
};
const categoryIcons = {
  "Probation & Supervision":"⚖️", Housing:"🏠", Employment:"💼",
  Education:"📚", Family:"👨‍👩‍👧", Health:"🧠", Finance:"💰", Identity:"🌱",
};

const SERVICE_CATEGORIES = ["Housing","Employment","Mental Health","Substance Use","Legal & Probation","Family Support","Food & Finance","Education & Training","Health","Community"];
const SERVICE_ICONS = { Housing:"🏠", Employment:"💼", "Mental Health":"🧠", "Substance Use":"💊", "Legal & Probation":"⚖️", "Family Support":"👨‍👩‍👧", "Food & Finance":"💰", "Education & Training":"📚", Health:"❤️", Community:"🤝" };
const SERVICE_COLORS = { Housing:BLUE, Employment:ORANGE, "Mental Health":"#8E44AD", "Substance Use":"#16A085", "Legal & Probation":"#c0392b", "Family Support":"#8E44AD", "Food & Finance":"#d35400", "Education & Training":GREEN, Health:"#e74c3c", Community:"#2c3e50" };

const SPONSORED_SERVICES = [
  { id:"sp1", name:"The Recruitment Junction", category:"Employment", city:"Durham", address:"Milburngate House, Atherton Street, Durham, DH1 4FY", phone:"0191 300 0550", website:"therecruitmentjunction.co.uk", description:"Specialist employment agency actively supporting people with criminal records back into meaningful, sustainable work. Partnered with fair-chance employers across the North East.", sponsored:true, badge:"Reentry Friendly", highlight:"Fair-chance hiring · North East specialists · Free to candidates", tags:["Ban the Box","North East","Free Service"], color:ORANGE, icon:"💼" },
  { id:"sp2", name:"Psycovery", category:"Mental Health", city:"National", address:"Available nationwide — online via website", phone:null, website:"psycovery.co.uk", description:"Psycovery applies Hope Theory in forensic and reentry settings, offering specialist 1:1 coaching, hope frameworks and mental health support for people rebuilding their lives after the criminal justice system.", sponsored:true, national:true, badge:"Hope Forward Partner", highlight:"Hope Theory coaching · Forensic mental health · Available UK-wide", tags:["Nationwide","Hope Coaching","Mental Health","Reentry Specialist"], color:BLUE, icon:"🌅", isPsycovery:true },
];

const SEED_SERVICES = [
  { id:"s1", name:"Shelter England", category:"Housing", city:"London", address:"88 Old Street, London, EC1V 9HU", phone:"0808 800 4444", website:"shelter.org.uk", description:"Free housing advice and support for people facing homelessness.", national:true },
  { id:"s2", name:"St Mungo's", category:"Housing", city:"London", address:"Griffin House, 161 Hammersmith Road, London W6 8BS", phone:"020 3856 6000", website:"mungos.org", description:"Homelessness charity providing accommodation and support across London and the South." },
  { id:"s3", name:"Nacro", category:"Legal & Probation", city:"London", address:"Park Place, 10–12 Lawn Lane, London SW8 1UD", phone:"0300 123 1999", website:"nacro.org.uk", description:"National charity supporting people with criminal records into housing, education and employment.", national:true },
  { id:"s4", name:"Working Chance", category:"Employment", city:"London", address:"London", phone:"020 7148 5730", website:"workingchance.org", description:"Specialist employment charity placing women with convictions into jobs with inclusive employers." },
  { id:"s5", name:"Samaritans", category:"Mental Health", city:"National", address:"National helpline", phone:"116 123", website:"samaritans.org", description:"Free, confidential emotional support 24/7 for anyone struggling.", national:true },
  { id:"s6", name:"Mind", category:"Mental Health", city:"National", address:"National helpline", phone:"0300 123 3393", website:"mind.org.uk", description:"Mental health charity providing information, advice and local services across England and Wales.", national:true },
  { id:"s7", name:"Talk to Frank", category:"Substance Use", city:"National", address:"National helpline", phone:"0300 123 6600", website:"talktofrank.com", description:"Honest information about drugs, with a free 24/7 helpline.", national:true },
  { id:"s8", name:"Citizens Advice Manchester", category:"Legal & Probation", city:"Manchester", address:"Churchgate House, 56 Oxford St, Manchester M1 6EU", phone:"0800 144 8848", website:"citizensadvice.org.uk", description:"Free, independent legal and benefits advice for people in Manchester." },
  { id:"s9", name:"Emmaus Manchester", category:"Housing", city:"Manchester", address:"371 Moseley Road, Manchester M19 2JZ", phone:"0161 442 4200", website:"emmausmanchester.org.uk", description:"Provides a home and meaningful work for people who have experienced homelessness." },
  { id:"s10", name:"The Booth Centre", category:"Community", city:"Manchester", address:"Edward Holt House, Pimblett Street, Manchester M3 1FU", phone:"0161 835 3550", website:"boothcentre.org.uk", description:"Day centre for homeless and vulnerably housed people offering food, activities and support." },
  { id:"s11", name:"St Giles Trust", category:"Legal & Probation", city:"Birmingham", address:"Unit 4, The Bond, 180–182 Fazeley Street, Birmingham B5 5SE", phone:"020 7793 0404", website:"stgilestrust.org.uk", description:"Support for people leaving prison into housing, employment and resettlement." },
  { id:"s12", name:"SIFA Fireside", category:"Housing", city:"Birmingham", address:"39 Guildford Street, Birmingham B19 2HN", phone:"0121 766 1700", website:"sifafireside.co.uk", description:"Day centre and outreach support for people experiencing homelessness in Birmingham." },
  { id:"s13", name:"Turning Point Birmingham", category:"Substance Use", city:"Birmingham", address:"Lifeline Centre, Great Tindal Street, Birmingham B16 8EU", phone:"0121 248 4100", website:"turning-point.co.uk", description:"Drug and alcohol recovery services across Birmingham." },
  { id:"s14", name:"Crisis Skylight Leeds", category:"Housing", city:"Leeds", address:"3 Cranmer Bank, Leeds LS17 6DQ", phone:"0113 200 6400", website:"crisis.org.uk", description:"Education, training, employment and housing support for people experiencing homelessness." },
  { id:"s15", name:"St George's Crypt", category:"Community", city:"Leeds", address:"Great George Street, Leeds LS2 8BE", phone:"0113 245 9061", website:"stgeorgescrypt.org.uk", description:"Supporting homeless and vulnerable people with food, shelter and recovery services." },
  { id:"s16", name:"Basis Yorkshire", category:"Family Support", city:"Leeds", address:"2 Hepworth House, Claypit Lane, Leeds LS2 8AP", phone:"0113 242 6396", website:"basisyorkshire.co.uk", description:"Support for women and girls at risk of sexual exploitation and involved in the justice system." },
  { id:"s17", name:"Shelter Scotland", category:"Housing", city:"Glasgow", address:"Scotiabank House, 6 South Charlotte Street, Edinburgh EH2 4AW", phone:"0808 800 4444", website:"scotland.shelter.org.uk", description:"Housing advice and support for people in Scotland." },
  { id:"s18", name:"Simon Community Scotland", category:"Housing", city:"Glasgow", address:"48 Govan Road, Glasgow G51 1JL", phone:"0800 027 7466", website:"simonscotland.org.uk", description:"Housing and homelessness support across Scotland." },
  { id:"s19", name:"Addaction Bristol", category:"Substance Use", city:"Bristol", address:"Brunswick Court, Brunswick Square, Bristol BS2 8PE", phone:"0117 987 6000", website:"wearewithyou.org.uk", description:"Drug and alcohol recovery support in Bristol." },
  { id:"s20", name:"Second Step", category:"Mental Health", city:"Bristol", address:"Lawrence Hill Health Centre, Hassell Drive, Bristol BS2 0AN", phone:"0117 909 6630", website:"second-step.co.uk", description:"Mental health and housing support for people in Bristol and the South West." },
];

const goalLibrary = {
  "Probation & Supervision":[
    { title:"Never miss a probation appointment", steps:["Set phone reminders 24hrs before each appointment","Keep a written log of all check-in dates","Build a transport plan so I always arrive on time"] },
    { title:"Complete all licence conditions successfully", steps:["List every condition clearly and review weekly","Speak to my probation officer if I'm struggling","Check in with a trusted person each week for accountability"] },
  ],
  Housing:[{ title:"Secure stable long-term accommodation", steps:["Research local housing options and eligibility","Apply for social housing or housing benefit","Build a good relationship with my landlord"] }],
  Employment:[
    { title:"Find a job I'm proud of", steps:["Identify my skills and what I enjoy doing","Search for Ban the Box employers in my area","Apply for at least 3 jobs this week"] },
    { title:"Update my CV and cover letter", steps:["List my work history, skills and achievements","Get my CV reviewed by a careers adviser","Tailor my cover letter to each job I apply for"] },
  ],
  Education:[{ title:"Get my maths or English qualification", steps:["Find a local adult education centre offering free courses","Enrol in a GCSE or Functional Skills course","Study for at least 30 minutes every day"] }],
  Family:[{ title:"Rebuild my relationship with my children", steps:["Contact my children's carer to discuss contact arrangements","Attend every scheduled contact session","Be consistent, patient and honest with my children"] }],
  Health:[{ title:"Register with a GP", steps:["Find my nearest GP surgery","Complete a registration form in person or online","Book a new patient health check"] }],
  Finance:[{ title:"Open a bank account", steps:["Find a bank that accepts basic ID","Gather required documents — ID and proof of address","Visit a branch or apply online"] }],
  Identity:[{ title:"Discover who I am beyond my past", steps:["Write down 5 values that matter to me","Try a new activity that reflects those values","Talk to a counsellor or mentor about my identity"] }],
};

const initialGoals = [
  { id:1, title:"Find stable housing", category:"Housing", steps:["Research shelters","Apply for housing assistance","Save first month's rent"], completed:[true,false,false], agency:40 },
  { id:2, title:"Get a job", category:"Employment", steps:["Update resume","Apply to 3 jobs this week","Attend job fair"], completed:[true,true,false], agency:65 },
];

const coachingPlans = [
  { name:"Single Session", price:"£75", per:"one-off", icon:"🌱", color:GREEN, desc:"A focused 60-minute 1:1 session with a Psycovery coach.", features:["60-min video or phone session","Personalised hope plan","Follow-up action summary"] },
  { name:"Foundations", price:"£175", per:"4 sessions", icon:"🛤️", color:BLUE, desc:"A 4-session programme to build your goals, pathways and agency.", features:["4 × 60-min coaching sessions","Personalised hope framework","Weekly check-in messages","Progress review at session 4"], highlight:true },
  { name:"Full Journey", price:"£320", per:"8 sessions", icon:"🌅", color:GOLD, desc:"Our most comprehensive coaching programme over 3 months.", features:["8 × 60-min coaching sessions","Dedicated Psycovery coach","Goal & barrier planning toolkit","Monthly progress reports","Priority booking"] },
];

const onboardingSlides = [
  { bg:GRAD, icon:"🌅", title:"Welcome to Hope Forward", subtitle:"Powered by Psycovery", body:"A fresh start begins with a single step. This app is built to walk alongside you as you rebuild your life — on your terms." },
  { bg:`linear-gradient(135deg,${GOLD},#e8a800)`, icon:"🎯", title:"It Starts With a Goal", subtitle:"Goal Thinking", body:"Hope Theory tells us that having a clear goal is the foundation of everything. Your goal gives you direction and purpose." },
  { bg:`linear-gradient(135deg,${GREEN},#3d8b3d)`, icon:"🛤️", title:"Find Your Pathway", subtitle:"Pathway Thinking", body:"Once you have a goal, we help you map out the steps to get there. Every barrier has a way through it." },
  { bg:`linear-gradient(135deg,#8E44AD,#5b2c8d)`, icon:"💪", title:"Believe You Can Do It", subtitle:"Agency Thinking", body:"The final piece is believing in your own ability to move forward. Track your progress and let the community lift you up." },
  { bg:GRAD, icon:"✨", title:"Let's Set Your First Goal", subtitle:"You're ready", body:"Your journey starts now. Let's set your first goal together — it only takes a minute.", cta:true },
];

const PsycoveryLogo = ({ size=32, dark=false }) => {
  const g1 = dark ? GOLD : "#FFD700";
  const g2 = dark ? GOLD_LIGHT : "#FFE566";
  const g3 = dark ? "#F0C020" : "#FFC200";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Swirl 1 — outer, darkest */}
      <path d="M50 8 C76 5, 95 26, 92 50 C89 72, 70 89, 50 90 C33 91, 14 79, 10 61" fill="none" stroke={g1} strokeWidth="7.5" strokeLinecap="round"/>
      {/* Swirl 2 — middle */}
      <path d="M15 38 C10 20, 26 6, 46 8 C66 10, 82 26, 80 46 C78 63, 64 76, 50 78" fill="none" stroke={g3} strokeWidth="6" strokeLinecap="round"/>
      {/* Swirl 3 — inner, lightest */}
      <path d="M50 22 C64 20, 76 32, 76 46 C76 60, 65 72, 52 73" fill="none" stroke={g2} strokeWidth="4.5" strokeLinecap="round"/>
      {/* Sun */}
      <circle cx="50" cy="50" r="10" fill={g1}/>
      {Array.from({length:16},(_,i)=>{
        const a=(i*22.5)*Math.PI/180;
        return <line key={i} x1={50+12*Math.cos(a)} y1={50+12*Math.sin(a)} x2={50+17*Math.cos(a)} y2={50+17*Math.sin(a)} stroke={g1} strokeWidth="2.5" strokeLinecap="round"/>;
      })}
    </svg>
  );
};

const PsycoveryLink = ({ style={} }) => (
  <a href="https://www.psycovery.co.uk" target="_blank" rel="noopener noreferrer"
    style={{ color:GOLD, fontSize:11, fontWeight:700, textDecoration:"none", ...style }}>
    www.psycovery.co.uk ↗
  </a>
);

const Avatar = ({ photo, name, size=44, fontSize=18, onClick }) => {
  const initials = name ? name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() : "?";
  return (
    <div onClick={onClick} style={{ width:size, height:size, borderRadius:"50%", overflow:"hidden", flexShrink:0, cursor:onClick?"pointer":"default", border:"2px solid rgba(255,255,255,0.6)", boxShadow:"0 2px 8px rgba(0,0,0,0.18)", background:photo?"transparent":GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}>
      {photo ? <img src={photo} alt={name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <span style={{ color:"#fff", fontWeight:800, fontSize }}>{initials}</span>}
    </div>
  );
};

const scoreColor = s => s >= 80 ? GREEN : s >= 60 ? BLUE : s >= 40 ? ORANGE : "#c0392b";
const rankMedal = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : null;

const LeaderboardScreen = ({ myScore, myName, myRegion, myPrison, allUsers, onBack }) => {
  const [filterRegion, setFilterRegion] = useState("All");
  const [filterPrison, setFilterPrison] = useState("All");
  const [activeTab, setActiveTab] = useState("region"); // "region" | "prison"
  const [search, setSearch] = useState("");
  const [prisonFilterSearch, setPrisonFilterSearch] = useState("");
  const [prisonDropOpen, setPrisonDropOpen] = useState(false);
  const prisonDropRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (prisonDropRef.current && !prisonDropRef.current.contains(e.target)) {
        setPrisonDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fullList = useMemo(() => {
    const me = { id:"me", name: myName || "You", region: myRegion || "Unknown", prison: myPrison || "", score: myScore, isMe: true };
    return [...allUsers, me].sort((a,b) => b.score - a.score).map((u,i) => ({ ...u, rank: i+1 }));
  }, [allUsers, myScore, myName, myRegion, myPrison]);

  const communityAvg = useMemo(() => Math.round(fullList.reduce((s,u)=>s+u.score,0)/fullList.length), [fullList]);
  const myEntry = fullList.find(u=>u.isMe);

  // Build sorted list of prisons that appear in the data
  const prisonOptions = useMemo(() => {
    const set = new Set(fullList.map(u => u.prison).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [fullList]);

  const filteredPrisonOptions = useMemo(() => {
    if (!prisonFilterSearch) return prisonOptions;
    const q = prisonFilterSearch.toLowerCase();
    return prisonOptions.filter(p => p === "All" || p.toLowerCase().includes(q));
  }, [prisonOptions, prisonFilterSearch]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return fullList.filter(u => {
      const regionMatch = activeTab !== "region" || filterRegion === "All" || u.region === filterRegion;
      const prisonMatch = activeTab !== "prison" || filterPrison === "All" || u.prison === filterPrison;
      const searchMatch = !q || u.name.toLowerCase().includes(q) || u.region.toLowerCase().includes(q) || (u.prison||"").toLowerCase().includes(q);
      return regionMatch && prisonMatch && searchMatch;
    });
  }, [fullList, filterRegion, filterPrison, activeTab, search]);

  const inp = (extra={}) => ({ border:"1.5px solid #e0e0e0", borderRadius:10, padding:"9px 12px 9px 36px", fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", background:"#f4f7fb", ...extra });

  const activeFilter = activeTab === "region" ? filterRegion : filterPrison;
  const filterLabel = activeTab === "region"
    ? (filterRegion === "All" ? null : filterRegion)
    : (filterPrison === "All" ? null : filterPrison);

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", background:"#f4f7fb", paddingBottom:40 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,#1a1a2e,#2c3e50)`, padding:"16px 20px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:99, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18 }}>‹</button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={22}/></div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:700 }}>Hope Forward</div>
          </div>
        </div>
        <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>🏆 Hope Leaderboard</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", marginTop:3 }}>{fullList.length} people on their journey</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16 }}>
          <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:14, padding:"12px 14px" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Community Average</div>
            <div style={{ fontSize:26, fontWeight:800, color:GOLD }}>{communityAvg}%</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)", marginTop:2 }}>{fullList.length} members</div>
          </div>
          <div style={{ background:`rgba(77,175,232,0.25)`, borderRadius:14, padding:"12px 14px", border:`1px solid ${BLUE}50` }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Your Score</div>
            <div style={{ fontSize:26, fontWeight:800, color:"#fff" }}>{myScore}%</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginTop:2 }}>
              {myEntry ? `Rank #${myEntry.rank}` : "Not ranked"} · {myScore >= communityAvg ? `+${myScore - communityAvg}` : `${myScore - communityAvg}`} vs avg
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"14px 16px 24px" }}>
        {/* Search */}
        <div style={{ position:"relative", marginBottom:12 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, region or prison..." style={inp()}/>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#aaa" }}>🔍</div>
          {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", fontSize:15, cursor:"pointer", color:"#aaa" }}>✕</button>}
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {[
            { id:"region", label:"📍 By Region" },
            { id:"prison", label:"🏛️ By Prison" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ flex:1, padding:"9px 12px", borderRadius:12, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                background: activeTab === tab.id ? `linear-gradient(135deg,#1a1a2e,#2c3e50)` : "#fff",
                color: activeTab === tab.id ? "#fff" : "#555",
                boxShadow: activeTab === tab.id ? "0 4px 12px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.08)" }}>
              {tab.label}
              {tab.id === "prison" && filterPrison !== "All" && (
                <span style={{ marginLeft:6, background:BLUE, color:"#fff", borderRadius:99, padding:"1px 6px", fontSize:9 }}>●</span>
              )}
              {tab.id === "region" && filterRegion !== "All" && (
                <span style={{ marginLeft:6, background:BLUE, color:"#fff", borderRadius:99, padding:"1px 6px", fontSize:9 }}>●</span>
              )}
            </button>
          ))}
        </div>

        {/* Region filter pills */}
        {activeTab === "region" && (
          <div style={{ display:"flex", gap:7, overflowX:"auto", whiteSpace:"nowrap", marginBottom:14, paddingBottom:4 }}>
            {["All",...UK_REGIONS].map(r=>(
              <button key={r} onClick={()=>setFilterRegion(r)} style={{ display:"inline-block", padding:"5px 12px", borderRadius:99, border:"none", cursor:"pointer", fontSize:11, fontWeight:700, flexShrink:0, background:filterRegion===r?BLUE:"#fff", color:filterRegion===r?"#fff":"#555", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Prison filter — searchable dropdown */}
        {activeTab === "prison" && (
          <div ref={prisonDropRef} style={{ position:"relative", marginBottom:14 }}>
            <button
              onClick={() => setPrisonDropOpen(o => !o)}
              style={{ width:"100%", background:"#fff", border:`1.5px solid ${prisonDropOpen ? BLUE : "#e0e0e0"}`, borderRadius:12, padding:"10px 14px 10px 38px", fontSize:13, fontWeight:600, color: filterPrison === "All" ? "#aaa" : "#222", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow: prisonDropOpen ? `0 0 0 3px ${BLUE}18` : "none", transition:"all 0.15s", position:"relative" }}>
              <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>🏛️</div>
              <span style={{ flex:1 }}>{filterPrison === "All" ? "All prisons" : filterPrison}</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {filterPrison !== "All" && (
                  <span onClick={(e) => { e.stopPropagation(); setFilterPrison("All"); setPrisonFilterSearch(""); }} style={{ background:"#e0e0e0", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:"#666", cursor:"pointer" }}>✕</span>
                )}
                <span style={{ fontSize:12, color:"#aaa" }}>{prisonDropOpen ? "▲" : "▼"}</span>
              </div>
            </button>

            {prisonDropOpen && (
              <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"#fff", borderRadius:14, boxShadow:"0 8px 32px rgba(0,0,0,0.15)", border:`1.5px solid ${BLUE}30`, zIndex:999, maxHeight:280, display:"flex", flexDirection:"column" }}>
                {/* Search within dropdown */}
                <div style={{ padding:"10px 12px 6px", borderBottom:"1px solid #f5f5f5", flexShrink:0 }}>
                  <div style={{ position:"relative" }}>
                    <input
                      value={prisonFilterSearch}
                      onChange={e => setPrisonFilterSearch(e.target.value)}
                      placeholder="Search prisons..."
                      autoFocus
                      style={{ width:"100%", border:"1.5px solid #e0e0e0", borderRadius:8, padding:"7px 10px 7px 30px", fontSize:12, outline:"none", boxSizing:"border-box", background:"#f8fafc" }}
                    />
                    <div style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", fontSize:12, color:"#aaa" }}>🔍</div>
                    {prisonFilterSearch && <button onClick={() => setPrisonFilterSearch("")} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", fontSize:12, cursor:"pointer", color:"#aaa" }}>✕</button>}
                  </div>
                </div>
                <div style={{ overflowY:"auto", flex:1 }}>
                  {filteredPrisonOptions.length === 0 ? (
                    <div style={{ padding:16, textAlign:"center", color:"#aaa", fontSize:12 }}>No prisons match "{prisonFilterSearch}"</div>
                  ) : filteredPrisonOptions.map((p, i) => {
                    const isSelected = filterPrison === p;
                    // Count members from this prison
                    const count = p === "All" ? fullList.length : fullList.filter(u => u.prison === p).length;
                    return (
                      <button key={i} onClick={() => { setFilterPrison(p); setPrisonDropOpen(false); setPrisonFilterSearch(""); }}
                        style={{ width:"100%", background: isSelected ? `${BLUE}12` : "transparent", border:"none", padding:"10px 14px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10, borderBottom: i < filteredPrisonOptions.length - 1 ? "1px solid #f8f8f8" : "none" }}>
                        <div style={{ width:28, height:28, borderRadius:8, background: isSelected ? BLUE : "#f0f4f8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>
                          {isSelected ? <span style={{ color:"#fff", fontSize:11 }}>✓</span> : (p === "All" ? "🏆" : "🏛️")}
                        </div>
                        <span style={{ flex:1, fontSize:13, fontWeight: isSelected ? 700 : 500, color: isSelected ? BLUE : "#333" }}>
                          {p === "All" ? "All prisons" : p}
                        </span>
                        <span style={{ fontSize:11, color:"#aaa", background:"#f0f0f0", borderRadius:99, padding:"2px 7px", fontWeight:600 }}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Community avg bar */}
        <div style={{ background:"#fff", borderRadius:12, padding:"10px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:10, borderLeft:`4px solid ${GOLD}`, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:20 }}>📊</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#333" }}>Community Average Hope Score</div>
            <div style={{ background:"#f0f0f0", borderRadius:99, height:6, marginTop:6 }}>
              <div style={{ background:GOLD, borderRadius:99, height:6, width:`${communityAvg}%` }}/>
            </div>
          </div>
          <div style={{ fontSize:18, fontWeight:800, color:GOLD }}>{communityAvg}%</div>
        </div>

        {/* Result count */}
        <div style={{ fontSize:12, color:"#aaa", fontWeight:600, marginBottom:8 }}>
          {filtered.length} member{filtered.length!==1?"s":""}
          {filterLabel ? <span> · <span style={{ color:BLUE }}>{filterLabel}</span></span> : ""}
        </div>

        {/* List */}
        {filtered.map((u) => {
          const col = scoreColor(u.score);
          const medal = rankMedal(u.rank);
          const isAboveAvg = u.score >= communityAvg;
          return (
            <div key={u.id} style={{ background: u.isMe ? `linear-gradient(135deg,${BLUE}18,${GOLD}10)` : "#fff", borderRadius:14, padding:"12px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:12, boxShadow: u.isMe ? `0 4px 16px ${BLUE}22` : "0 2px 6px rgba(0,0,0,0.06)", border: u.isMe ? `2px solid ${BLUE}50` : "2px solid transparent" }}>
              <div style={{ width:32, textAlign:"center", flexShrink:0 }}>
                {medal ? <span style={{ fontSize:20 }}>{medal}</span> : <span style={{ fontSize:13, fontWeight:800, color:"#bbb" }}>#{u.rank}</span>}
              </div>
              <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${col},${col}aa)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 2px 6px ${col}44` }}>
                <span style={{ color:"#fff", fontWeight:800, fontSize:13 }}>{u.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#222", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{u.name}</span>
                  {u.isMe && <span style={{ fontSize:9, background:BLUE, color:"#fff", borderRadius:99, padding:"2px 7px", fontWeight:800, flexShrink:0 }}>YOU</span>}
                </div>
                <div style={{ fontSize:11, color:"#888", marginTop:1 }}>📍 {u.region}{u.prison ? <span style={{ color:"#aaa" }}> · 🏛️ {u.prison}</span> : ""}</div>
                <div style={{ background:"#f0f0f0", borderRadius:99, height:4, marginTop:5, position:"relative" }}>
                  <div style={{ background:col, borderRadius:99, height:4, width:`${u.score}%` }}/>
                  <div style={{ position:"absolute", top:-2, left:`${communityAvg}%`, width:2, height:8, background:GOLD, borderRadius:1 }}/>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:17, fontWeight:800, color:col }}>{u.score}%</div>
                <div style={{ fontSize:10, color: isAboveAvg ? GREEN : "#aaa", fontWeight:600 }}>
                  {isAboveAvg ? `▲ +${u.score-communityAvg}` : `▼ ${u.score-communityAvg}`}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:32, color:"#aaa" }}>
            <div style={{ fontSize:32 }}>🔍</div>
            <div style={{ fontSize:14, marginTop:8 }}>No members found</div>
            {filterLabel && <div style={{ fontSize:12, marginTop:4, color:"#bbb" }}>Try clearing the filter</div>}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileScreen = ({ profile, onSave, onBack }) => {
  const [draft, setDraft] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const [prisonSearch, setPrisonSearch] = useState(draft.prison || "");
  const [prisonOpen, setPrisonOpen] = useState(false);
  const fileRef = useRef();
  const prisonRef = useRef();
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPrisonOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredPrisons = useMemo(() => {
    const q = prisonSearch.toLowerCase();
    if (!q) return PRISONS_ENGLAND_WALES;
    return PRISONS_ENGLAND_WALES.filter(p => p.toLowerCase().includes(q));
  }, [prisonSearch]);

  const handlePhoto = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setDraft(p=>({...p,photo:ev.target.result}));
    reader.readAsDataURL(file);
  };
  const handleSave = () => { onSave(draft); setSaved(true); setTimeout(()=>{setSaved(false);onBack();},1000); };
  const inp = (extra={}) => ({ border:"1.5px solid #e0e0e0", borderRadius:10, padding:"11px 14px", fontSize:14, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit", background:"#fff", ...extra });

  const selectPrison = (prison) => {
    setDraft(p => ({ ...p, prison }));
    setPrisonSearch(prison);
    setPrisonOpen(false);
  };

  const clearPrison = () => {
    setDraft(p => ({ ...p, prison: "" }));
    setPrisonSearch("");
    setPrisonOpen(false);
    setTimeout(() => prisonRef.current?.focus(), 0);
  };

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", background:"#f4f7fb", paddingBottom:40 }}>
      <div style={{ background:GRAD, padding:"16px 20px 32px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:99, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18 }}>‹</button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={22}/></div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)", fontWeight:700 }}>Hope Forward</div>
          </div>
        </div>
        <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>My Profile</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>Your personal details</div>
      </div>
      <div style={{ padding:"0 20px", marginTop:-20 }}>
        {/* Photo */}
        <div style={{ background:"#fff", borderRadius:18, padding:24, boxShadow:"0 4px 16px rgba(0,0,0,0.08)", marginBottom:16, display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:96, height:96, borderRadius:"50%", overflow:"hidden", border:`3px solid ${BLUE}`, boxShadow:`0 4px 16px ${BLUE}44`, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {draft.photo ? <img src={draft.photo} alt="Profile" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <span style={{ color:"#fff", fontWeight:800, fontSize:32 }}>{draft.name?draft.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase():"?"}</span>}
            </div>
            <button onClick={()=>fileRef.current.click()} style={{ position:"absolute", bottom:0, right:0, width:30, height:30, borderRadius:"50%", background:GOLD, border:"2px solid #fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>📷</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }}/>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>fileRef.current.click()} style={{ background:`${BLUE}15`, border:`1.5px solid ${BLUE}`, borderRadius:99, padding:"7px 16px", fontSize:12, fontWeight:700, color:BLUE, cursor:"pointer" }}>{draft.photo?"Change photo":"Upload photo"}</button>
            {draft.photo && <button onClick={()=>setDraft(p=>({...p,photo:""}))} style={{ background:"#f5f5f5", border:"1.5px solid #ddd", borderRadius:99, padding:"7px 16px", fontSize:12, fontWeight:700, color:"#888", cursor:"pointer" }}>Remove</button>}
          </div>
        </div>

        {/* Personal details */}
        <div style={{ background:"#fff", borderRadius:18, padding:20, boxShadow:"0 4px 16px rgba(0,0,0,0.06)", marginBottom:16, display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#555", marginBottom:6 }}>First name *</div>
            <input value={draft.firstName} onChange={e=>setDraft(p=>({...p,firstName:e.target.value,name:`${e.target.value} ${p.lastName||""}`.trim()}))} placeholder="e.g. Alex" style={inp()}/>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#555", marginBottom:6 }}>Last name</div>
            <input value={draft.lastName||""} onChange={e=>setDraft(p=>({...p,lastName:e.target.value,name:`${p.firstName||""} ${e.target.value}`.trim()}))} placeholder="e.g. Johnson" style={inp()}/>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#555", marginBottom:6 }}>Preferred name / nickname</div>
            <input value={draft.preferredName||""} onChange={e=>setDraft(p=>({...p,preferredName:e.target.value}))} placeholder="What should we call you?" style={inp()}/>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#555", marginBottom:8 }}>Region of the UK</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {UK_REGIONS.map(r=>(
                <button key={r} onClick={()=>setDraft(p=>({...p,region:r}))} style={{ padding:"7px 12px", borderRadius:99, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, background:draft.region===r?BLUE:"#f0f4f8", color:draft.region===r?"#fff":"#555", boxShadow:draft.region===r?`0 2px 8px ${BLUE}44`:"none" }}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#555", marginBottom:6 }}>A little about me <span style={{ fontWeight:400, color:"#bbb" }}>(optional)</span></div>
            <textarea value={draft.bio||""} onChange={e=>setDraft(p=>({...p,bio:e.target.value}))} placeholder="A sentence about your journey, hopes, or goals..." rows={3} style={{ ...inp(), resize:"none" }}/>
          </div>
        </div>

        {/* Prison / release details */}
        <div style={{ background:"#fff", borderRadius:18, padding:20, boxShadow:"0 4px 16px rgba(0,0,0,0.06)", marginBottom:16, borderTop:`3px solid ${BLUE}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${BLUE}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚖️</div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#333" }}>Release Details</div>
              <div style={{ fontSize:11, color:"#aaa", marginTop:1 }}>Optional — helps us tailor support for you</div>
            </div>
          </div>

          {/* Prison searchable dropdown */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#555", marginBottom:6 }}>
              Prison released from <span style={{ fontWeight:400, color:"#bbb" }}>(optional)</span>
            </div>
            <div ref={dropdownRef} style={{ position:"relative" }}>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none", zIndex:1 }}>🏛️</div>
                <input
                  ref={prisonRef}
                  value={prisonSearch}
                  onChange={e => {
                    setPrisonSearch(e.target.value);
                    setPrisonOpen(true);
                    if (e.target.value !== draft.prison) setDraft(p => ({ ...p, prison: "" }));
                  }}
                  onFocus={() => setPrisonOpen(true)}
                  placeholder="Search for a prison..."
                  style={{ ...inp(), paddingLeft:38, paddingRight: draft.prison || prisonSearch ? 36 : 14, borderColor: prisonOpen ? BLUE : "#e0e0e0", boxShadow: prisonOpen ? `0 0 0 3px ${BLUE}18` : "none", transition:"all 0.15s" }}
                />
                {(draft.prison || prisonSearch) && (
                  <button
                    onClick={clearPrison}
                    style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"#e0e0e0", border:"none", borderRadius:"50%", width:20, height:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#666", fontWeight:800 }}>
                    ✕
                  </button>
                )}
              </div>

              {/* Selected prison badge */}
              {draft.prison && !prisonOpen && (
                <div style={{ marginTop:8, display:"inline-flex", alignItems:"center", gap:6, background:`${BLUE}14`, border:`1px solid ${BLUE}40`, borderRadius:99, padding:"5px 12px 5px 8px" }}>
                  <span style={{ fontSize:13 }}>✅</span>
                  <span style={{ fontSize:12, fontWeight:700, color:BLUE }}>{draft.prison}</span>
                </div>
              )}

              {/* Dropdown list */}
              {prisonOpen && (
                <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"#fff", borderRadius:14, boxShadow:"0 8px 32px rgba(0,0,0,0.15)", border:`1.5px solid ${BLUE}30`, zIndex:999, maxHeight:260, overflowY:"auto" }}>
                  {filteredPrisons.length === 0 ? (
                    <div style={{ padding:"16px 14px", textAlign:"center", color:"#aaa", fontSize:13 }}>
                      <div style={{ fontSize:24 }}>🔍</div>
                      <div style={{ marginTop:6 }}>No prisons found for "{prisonSearch}"</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ padding:"8px 14px 4px", fontSize:10, color:"#aaa", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid #f5f5f5" }}>
                        {filteredPrisons.length} prison{filteredPrisons.length !== 1 ? "s" : ""} {prisonSearch ? `matching "${prisonSearch}"` : "in England & Wales"}
                      </div>
                      {filteredPrisons.map((prison, i) => {
                        const isSelected = draft.prison === prison;
                        return (
                          <button
                            key={i}
                            onClick={() => selectPrison(prison)}
                            style={{ width:"100%", background: isSelected ? `${BLUE}12` : "transparent", border:"none", padding:"10px 14px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10, borderBottom: i < filteredPrisons.length - 1 ? "1px solid #f8f8f8" : "none" }}>
                            <div style={{ width:28, height:28, borderRadius:8, background: isSelected ? BLUE : "#f0f4f8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>
                              {isSelected ? <span style={{ color:"#fff", fontSize:12 }}>✓</span> : "🏛️"}
                            </div>
                            <span style={{ fontSize:13, fontWeight: isSelected ? 700 : 500, color: isSelected ? BLUE : "#333" }}>{prison}</span>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Privacy note */}
          <div style={{ marginTop:14, background:"#f8fafc", borderRadius:10, padding:"10px 12px", display:"flex", gap:8, alignItems:"flex-start" }}>
            <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>🔒</span>
            <div style={{ fontSize:11, color:"#888", lineHeight:1.5 }}>This information is private to your profile and helps us personalise your experience. It is never shared publicly.</div>
          </div>
        </div>

        <button onClick={handleSave} style={{ width:"100%", background:saved?GREEN:GRAD, border:"none", borderRadius:14, padding:16, color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:`0 4px 16px ${saved?GREEN:BLUE}55`, transition:"background 0.3s" }}>
          {saved?"✓ Saved!":"Save Profile"}
        </button>
      </div>
    </div>
  );
};

const SponsoredCard = ({ svc, expanded, onToggle }) => {
  const isPsy=svc.isPsycovery; const accentColor=svc.color||ORANGE;
  const bgGrad=isPsy?"linear-gradient(135deg,#e8f4fd,#f0f8ff)":"linear-gradient(135deg,#fff8e8,#fffdf4)";
  const borderColor=isPsy?BLUE:GOLD; const shadowColor=isPsy?"rgba(77,175,232,0.22)":"rgba(245,197,24,0.25)";
  return (
    <div style={{ borderRadius:16, marginBottom:16, overflow:"hidden", background:bgGrad, border:`2px solid ${borderColor}`, boxShadow:`0 6px 24px ${shadowColor}`, position:"relative" }}>
      <div style={{ position:"absolute", top:0, right:0, background:isPsy?GRAD:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:isPsy?"#fff":"#7a5f00", fontSize:10, fontWeight:800, padding:"4px 14px 4px 10px", borderBottomLeftRadius:12, letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:5 }}>
        ⭐ {isPsy?"FEATURED PARTNER":"SPONSORED"}
      </div>
      <button onClick={onToggle} style={{ width:"100%", background:"none", border:"none", padding:"16px 16px 12px", cursor:"pointer", textAlign:"left" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginTop:4 }}>
          <div style={{ width:52, height:52, borderRadius:12, flexShrink:0, background:isPsy?GRAD:`linear-gradient(135deg,${ORANGE},#f0a060)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 2px 8px ${accentColor}44` }}>
            {isPsy?<PsycoveryLogo size={36}/>:<span style={{ fontSize:26 }}>{svc.icon}</span>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:5 }}>
              <span style={{ fontSize:10, background:accentColor, color:"#fff", borderRadius:99, padding:"2px 8px", fontWeight:700 }}>{SERVICE_ICONS[svc.category]} {svc.category}</span>
              {svc.national&&<span style={{ fontSize:10, background:"#e8f4fd", color:BLUE, borderRadius:99, padding:"2px 8px", fontWeight:700, border:`1px solid ${BLUE}40` }}>🇬🇧 Nationwide</span>}
              <span style={{ fontSize:10, background:`${GOLD}28`, color:"#7a5f00", borderRadius:99, padding:"2px 8px", fontWeight:700, border:`1px solid ${GOLD}` }}>🏅 {svc.badge}</span>
            </div>
            <div style={{ fontSize:16, fontWeight:800, color:"#222" }}>{isPsy?<><span style={{ color:BLUE }}>Psy</span><span style={{ color:GOLD }}>covery</span></>:svc.name}</div>
            <div style={{ fontSize:12, color:"#777", marginTop:2 }}>{isPsy?"🌐 Available UK-wide · Online":`📍 ${svc.city}`}</div>
          </div>
          <div style={{ fontSize:16, color:"#ccc", flexShrink:0 }}>{expanded?"▲":"▼"}</div>
        </div>
        <div style={{ marginTop:10, background:isPsy?`linear-gradient(90deg,${BLUE}14,${GOLD}14)`:`linear-gradient(90deg,${ORANGE}18,${GOLD}18)`, borderRadius:10, padding:"8px 12px", fontSize:12, fontWeight:600, color:isPsy?"#1a4a6e":"#7a4f00", borderLeft:`3px solid ${accentColor}` }}>✅ {svc.highlight}</div>
        <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
          {svc.tags.map((t,i)=><span key={i} style={{ fontSize:10, background:"#f0f0f0", color:"#555", borderRadius:99, padding:"3px 9px", fontWeight:600 }}>{t}</span>)}
        </div>
      </button>
      <div style={{ padding:"0 16px 10px" }}><div style={{ fontSize:13, color:"#555", lineHeight:1.6 }}>{svc.description}</div></div>
      {expanded&&(
        <div style={{ padding:"12px 16px 16px", borderTop:`1px solid ${borderColor}30`, display:"flex", flexDirection:"column", gap:10 }}>
          {svc.address&&<div style={{ fontSize:12, color:"#555" }}>🏢 {svc.address}</div>}
          {svc.phone&&<a href={`tel:${svc.phone.replace(/\s/g,"")}`} style={{ display:"inline-flex", alignItems:"center", gap:8, background:`linear-gradient(135deg,${accentColor},#f0a060)`, color:"#fff", borderRadius:12, padding:"11px 20px", fontSize:14, fontWeight:800, textDecoration:"none", alignSelf:"flex-start" }}>📞 Call {svc.phone}</a>}
          {svc.website&&<a href={`https://${svc.website.replace(/^https?:\/\//,"")}`} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:8, background:isPsy?GRAD:`${accentColor}15`, color:isPsy?"#fff":accentColor, borderRadius:12, padding:"11px 20px", fontSize:13, fontWeight:800, textDecoration:"none", alignSelf:"flex-start" }}><PsycoveryLogo size={16}/>{isPsy?"Visit psycovery.co.uk ↗":`${svc.website} ↗`}</a>}
          {isPsy&&<div style={{ background:`${GOLD}18`, borderRadius:10, padding:"10px 12px", borderLeft:`3px solid ${GOLD}`, fontSize:12, color:"#7a5f00", lineHeight:1.5 }}><strong>Founded by David Adlington-Rivers</strong> — Specialist in Hope Theory · Forensic Applications · Criminal Justice Reform</div>}
          <div style={{ fontSize:11, color:"#bbb", textAlign:"right" }}>Sponsored listing</div>
        </div>
      )}
    </div>
  );
};

// ── AI Goal Suggester Screen ─────────────────────────────────────────────────
const GoalSuggesterScreen = ({ onBack, onAddGoal }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [added, setAdded] = useState({});
  const [error, setError] = useState(null);
  const [dots, setDots] = useState(0);
  const [quickWins, setQuickWins] = useState(false);
  const textareaRef = useRef();

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setDots(d => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, [loading]);

  const examples = [
    "I want to sort out where I'm living",
    "I need to find work and get back on my feet",
    "I want to be a better dad to my kids",
    "I'm struggling with my mental health",
    "I want to get back into education",
    "I need help with my finances and debt",
  ];

  const getSuggestions = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestions(null);
    setSelectedIdx(null);

    const systemPrompt = `You are a compassionate goal-setting coach for Hope Forward, an app supporting people rebuilding their lives after the criminal justice system in the UK. You help users turn vague aspirations into concrete, actionable goals grounded in Hope Theory (goals, pathways, agency).

When a user describes something they want to achieve, respond ONLY with a JSON array of exactly 3 goal suggestions. Each suggestion must have:
- "title": a clear, positive, first-person goal statement (e.g. "Find stable housing I'm proud of")
- "category": one of: "Probation & Supervision", "Housing", "Employment", "Education", "Family", "Health", "Finance", "Identity"
- "steps": array of exactly 3 concrete, practical action steps written in first person
- "why": one short sentence explaining how this goal helps them move forward
- "emoji": a single relevant emoji

Respond ONLY with valid JSON. No preamble, no markdown, no explanation. Just the JSON array.`;

    try {
      const response = await fetch("/api/suggest-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim(), quickWins }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      setSuggestions(data.suggestions);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (sg) => {
    onAddGoal(sg);
    setAdded(p => ({ ...p, [sg.title]: true }));
  };

  const inp = (extra = {}) => ({
    border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "10px 12px",
    fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", ...extra,
  });

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#f4f7fb", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #1a1a2e, #2c3e50)`, padding: "16px 20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 99, width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>‹</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center" }}><PsycoveryLogo size={22} /></div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>Hope Forward</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✨</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>AI Goal Suggester</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>Powered by Psycovery · Hope Theory</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.55, marginTop: 10 }}>
          Tell us in your own words what you want to achieve — we'll suggest goals and steps that fit your situation.
        </div>
      </div>

      <div style={{ padding: "0 20px", marginTop: -16 }}>
        {/* Input card */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.10)", marginBottom: 16, borderTop: `3px solid ${GOLD}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>What do you want to achieve?</div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); getSuggestions(); } }}
            placeholder="e.g. I want to get back on my feet and find somewhere stable to live..."
            rows={4}
            style={{ ...inp(), resize: "none", fontFamily: "inherit", fontSize: 14, lineHeight: 1.6, color: "#333", background: "#f9fafc", borderColor: "#e0e8f0" }}
          />
          {/* Example chips */}
          {!input && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, marginBottom: 7 }}>Try an example:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {examples.map((ex, i) => (
                  <button key={i} onClick={() => { setInput(ex); setTimeout(() => textareaRef.current?.focus(), 0); }}
                    style={{ fontSize: 11, background: `${BLUE}12`, color: BLUE, border: `1px solid ${BLUE}30`, borderRadius: 99, padding: "4px 10px", cursor: "pointer", fontWeight: 600, transition: "all 0.15s" }}>
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Quick Wins toggle */}
          <button
            onClick={() => setQuickWins(q => !q)}
            style={{ marginTop: 14, width: "100%", display: "flex", alignItems: "center", gap: 12, background: quickWins ? `${GREEN}12` : "#f4f7fb", border: `2px solid ${quickWins ? GREEN : "#e0e0e0"}`, borderRadius: 12, padding: "11px 14px", cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${quickWins ? GREEN : "#ccc"}`, background: quickWins ? GREEN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
              {quickWins && <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, lineHeight: 1 }}>✓</span>}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>⚡</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: quickWins ? GREEN : "#333" }}>Quick Wins</span>
                <span style={{ fontSize: 10, background: quickWins ? GREEN : "#e0e0e0", color: quickWins ? "#fff" : "#888", borderRadius: 99, padding: "2px 8px", fontWeight: 700 }}>SHORT-TERM</span>
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Suggest goals I can achieve in days or weeks, not months</div>
            </div>
          </button>

          <button
            onClick={getSuggestions}
            disabled={!input.trim() || loading}
            style={{ marginTop: 10, width: "100%", background: input.trim() && !loading ? `linear-gradient(135deg, #1a1a2e, #2c3e50)` : "#e0e0e0", border: "none", borderRadius: 12, padding: "13px 16px", color: input.trim() && !loading ? "#fff" : "#aaa", fontSize: 14, fontWeight: 800, cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
            {loading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: 16 }}>⟳</span>
                <span>Finding your goals{".".repeat(dots)}</span>
              </>
            ) : (
              <><span>{quickWins ? "⚡" : "✨"}</span><span>{quickWins ? "Suggest Quick Wins" : "Suggest Goals for Me"}</span></>
            )}
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 40, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }}>🔮</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>Reading your situation...</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 6, lineHeight: 1.5 }}>Psycovery's Hope Theory framework is finding goals that match your needs</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE, opacity: 0.3, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#fff5f5", borderRadius: 14, padding: 16, marginBottom: 16, borderLeft: `4px solid #e74c3c`, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ fontSize: 20 }}>⚠️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#c0392b" }}>Couldn't load suggestions</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{error}</div>
              <button onClick={getSuggestions} style={{ marginTop: 8, background: "#c0392b", border: "none", borderRadius: 8, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Try Again</button>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions && !loading && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${GOLD}60)` }} />
              <span style={{ fontSize: 11, color: GOLD, fontWeight: 800, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>✨ SUGGESTED FOR YOU</span>
              <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${GOLD}60, transparent)` }} />
            </div>

            {suggestions.map((sg, i) => {
              const col = categoryColors[sg.category] || BLUE;
              const icon = categoryIcons[sg.category] || "🎯";
              const isSelected = selectedIdx === i;
              const isAdded = added[sg.title];

              return (
                <div key={i} style={{ background: "#fff", borderRadius: 16, marginBottom: 12, overflow: "hidden", border: `2px solid ${isSelected ? col : "transparent"}`, boxShadow: isSelected ? `0 6px 20px ${col}22` : "0 2px 10px rgba(0,0,0,0.07)", transition: "all 0.2s", borderLeft: `4px solid ${col}` }}>
                  <button
                    onClick={() => setSelectedIdx(isSelected ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "16px 16px 12px", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${col}, ${col}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: `0 2px 8px ${col}44` }}>
                        {sg.emoji || icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 10, background: col, color: "#fff", borderRadius: 99, padding: "2px 8px", fontWeight: 700 }}>{icon} {sg.category}</span>
                          <span style={{ fontSize: 10, background: `${GOLD}22`, color: "#7a5f00", borderRadius: 99, padding: "2px 8px", fontWeight: 700, border: `1px solid ${GOLD}50` }}>✨ AI Suggested</span>
                          {quickWins && <span style={{ fontSize: 10, background: `${GREEN}18`, color: GREEN, borderRadius: 99, padding: "2px 8px", fontWeight: 700, border: `1px solid ${GREEN}50` }}>⚡ Quick Win</span>}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#222", lineHeight: 1.3 }}>{sg.title}</div>
                        <div style={{ fontSize: 12, color: "#777", marginTop: 4, fontStyle: "italic", lineHeight: 1.4 }}>{sg.why}</div>
                      </div>
                      <div style={{ fontSize: 14, color: "#ccc", flexShrink: 0 }}>{isSelected ? "▲" : "▼"}</div>
                    </div>
                  </button>

                  {/* Expanded steps */}
                  {isSelected && (
                    <div style={{ padding: "0 16px 12px", borderTop: `1px solid ${col}18` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: 10, marginTop: 10 }}>Your Pathway Steps</div>
                      {sg.steps.map((step, j) => (
                        <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                          <div style={{ width: 22, height: 22, borderRadius: 99, background: col, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, boxShadow: `0 2px 6px ${col}44` }}>
                            <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>{j + 1}</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.55 }}>{step}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ padding: "0 16px 14px", display: "flex", gap: 8 }}>
                    {!isSelected && (
                      <button onClick={() => setSelectedIdx(i)} style={{ flex: 1, background: `${col}12`, border: `1px solid ${col}30`, borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700, color: col, cursor: "pointer" }}>
                        View Steps ▼
                      </button>
                    )}
                    <button
                      onClick={() => !isAdded && handleAdd(sg)}
                      style={{ flex: isSelected ? 1 : 0, flexBasis: isSelected ? "auto" : 120, background: isAdded ? "#f0f0f0" : `linear-gradient(135deg, ${col}, ${col}cc)`, border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 800, color: isAdded ? "#aaa" : "#fff", cursor: isAdded ? "default" : "pointer", transition: "all 0.2s", boxShadow: isAdded ? "none" : `0 2px 8px ${col}44` }}>
                      {isAdded ? "✓ Added to Goals" : `+ Add This Goal`}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Try again */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 20 }}>🔄</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>Not quite right?</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>Refine your description and we'll suggest different goals</div>
              </div>
              <button onClick={() => { setSuggestions(null); setSelectedIdx(null); setTimeout(() => textareaRef.current?.focus(), 100); }}
                style={{ background: GRAD, border: "none", borderRadius: 10, padding: "7px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                Try Again
              </button>
            </div>

            {Object.keys(added).length > 0 && (
              <button onClick={onBack} style={{ width: "100%", background: `linear-gradient(135deg,#1a1a2e,#2c3e50)`, border: "none", borderRadius: 14, padding: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span>🎯</span>
                <span>View My Goals ({Object.keys(added).length} added)</span>
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.1); } }
        @keyframes bounce { 0%,60%,100% { transform:translateY(0); opacity:0.3; } 30% { transform:translateY(-8px); opacity:1; } }
      `}</style>
    </div>
  );
};

// ── Guided Hope Plan Screen ──────────────────────────────────────────────────
const HopePlanScreen = ({ profile, goals, overallProgress, purchased, onPurchase, onBack }) => {
  const PURPLE = "#6C3FC5";
  const PURPLE_LIGHT = "#9B6EE8";
  const PLAN_GRAD = `linear-gradient(135deg, #0f2027, #203a43, #2c5364)`;

  // Payment form state
  const [step, setStep] = useState(purchased ? "plan" : "product"); // product | payment | processing | plan
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardError, setCardError] = useState("");
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(0);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (step !== "processing" && step !== "generating") return;
    const t = setInterval(() => setDots(d => (d + 1) % 4), 380);
    return () => clearInterval(t);
  }, [step]);

  // Auto-generate plan once purchased
  useEffect(() => {
    if (step === "plan" && !plan && !planLoading) {
      generatePlan();
    }
  }, [step]);

  const formatCard = (val) => val.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g,"").slice(0,4);
    if (digits.length >= 3) return digits.slice(0,2) + "/" + digits.slice(2);
    return digits;
  };

  const handlePay = () => {
    if (!cardName.trim()) { setCardError("Please enter your name."); return; }
    if (cardNumber.replace(/\s/g,"").length < 16) { setCardError("Please enter a valid 16-digit card number."); return; }
    if (cardExpiry.length < 5) { setCardError("Please enter a valid expiry date."); return; }
    if (cardCvc.length < 3) { setCardError("Please enter your 3-digit CVC."); return; }
    setCardError("");
    setStep("processing");
    setTimeout(() => {
      onPurchase();
      setStep("plan");
    }, 2200);
  };

  const generatePlan = async () => {
    setPlanLoading(true);
    setPlanError(null);

    const goalsSummary = goals.length
      ? goals.map(g => `${g.title} (${g.category}, ${g.agency}% complete)`).join("; ")
      : "No goals set yet";

    const systemPrompt = `You are a specialist Hope Theory coach at Psycovery, creating a personalised Guided Hope Plan for someone rebuilding their life after the criminal justice system in the UK.

Create a structured, warm, and actionable Hope Plan. Respond ONLY with a valid JSON object with this structure:
{
  "headline": "A short personal motivational tagline (max 12 words)",
  "hopeScore": number (0-100, based on goals progress),
  "summary": "2-3 sentences: a warm, honest summary of where this person is and what their plan will help them achieve",
  "pillars": [
    {
      "icon": "single emoji",
      "title": "Pillar title",
      "description": "1 sentence description",
      "actions": ["action 1", "action 2", "action 3"]
    }
  ],
  "weeklyPlan": [
    { "week": 1, "focus": "theme", "tasks": ["task 1", "task 2", "task 3"] },
    { "week": 2, "focus": "theme", "tasks": ["task 1", "task 2", "task 3"] },
    { "week": 3, "focus": "theme", "tasks": ["task 1", "task 2", "task 3"] },
    { "week": 4, "focus": "theme", "tasks": ["task 1", "task 2", "task 3"] }
  ],
  "affirmation": "A single powerful personal affirmation sentence",
  "barriers": [
    { "barrier": "likely barrier name", "strategy": "how to overcome it" },
    { "barrier": "likely barrier name", "strategy": "how to overcome it" },
    { "barrier": "likely barrier name", "strategy": "how to overcome it" }
  ]
}

Base the plan on: their name, region, goals and progress. Be specific, compassionate, and grounded in Hope Theory (goals, pathways, agency). Return ONLY JSON. No preamble, no markdown backticks.`;

    const userMsg = `Name: ${profile.preferredName || profile.firstName || "Friend"}
Region: ${profile.region || "UK"}
${profile.prison ? `Released from: ${profile.prison}` : ""}
Current goals: ${goalsSummary}
Overall hope score: ${overallProgress}%

Please create my personalised Guided Hope Plan.`;

    try {
      const res = await fetch("/api/generate-hope-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, goals, overallProgress }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setPlan(data.plan);
    } catch (e) {
      setPlanError(e.message || "Couldn't generate your plan. Please try again.");
    } finally {
      setPlanLoading(false);
    }
  };

  const inp = (extra={}) => ({
    border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "12px 14px",
    fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box",
    fontFamily: "inherit", background: "#fff", ...extra,
  });

  // ── Product page ──────────────────────────────────────────────────────────
  if (step === "product") return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", background:"#f4f7fb", paddingBottom:40 }}>
      <div style={{ background: PLAN_GRAD, padding:"16px 20px 40px", position:"relative", overflow:"hidden" }}>
        {/* decorative circles */}
        <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:`${GOLD}18` }}/>
        <div style={{ position:"absolute", bottom:-20, left:20, width:80, height:80, borderRadius:"50%", background:`${BLUE}18` }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, position:"relative" }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:99, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18 }}>‹</button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={22}/></div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:700 }}>Hope Forward · Psycovery</div>
          </div>
        </div>
        <div style={{ position:"relative", textAlign:"center", paddingBottom:8 }}>
          <div style={{ fontSize:56, marginBottom:8 }}>📋</div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${GOLD}cc`, borderRadius:99, padding:"4px 14px", marginBottom:12 }}>
            <span style={{ fontSize:11, fontWeight:800, color:"#7a5f00" }}>IN-APP PURCHASE · ONE-TIME</span>
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:8 }}>Your Guided Hope Plan</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.6 }}>A personalised, AI-generated roadmap built around your goals — powered by Psycovery's Hope Theory framework.</div>
          <div style={{ marginTop:16, display:"inline-block", background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"10px 24px" }}>
            <div style={{ fontSize:32, fontWeight:800, color:GOLD }}>£4.99</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>one-time · instant delivery</div>
          </div>
        </div>
      </div>

      <div style={{ padding:"0 20px", marginTop:-16 }}>
        {/* What's included */}
        <div style={{ background:"#fff", borderRadius:18, padding:20, boxShadow:"0 4px 20px rgba(0,0,0,0.09)", marginBottom:16, borderTop:`3px solid ${GOLD}` }}>
          <div style={{ fontSize:13, fontWeight:800, color:"#333", marginBottom:14 }}>✨ What's included</div>
          {[
            { icon:"🎯", title:"Personal Hope Score Analysis", desc:"Deep-dive into where you are and what's holding you back" },
            { icon:"🏛️", title:"3 Hope Pillars", desc:"Goal, Pathway & Agency — tailored to your situation" },
            { icon:"📅", title:"4-Week Action Plan", desc:"Week-by-week tasks built around your real goals" },
            { icon:"🧱", title:"Barrier Strategies", desc:"The 3 most likely obstacles — and exactly how to beat them" },
            { icon:"💬", title:"Personal Affirmation", desc:"A powerful statement written just for you" },
          ].map((item, i) => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:14 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${GOLD}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#222" }}>{item.title}</div>
                <div style={{ fontSize:12, color:"#777", marginTop:2, lineHeight:1.4 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div style={{ background:"#fff", borderRadius:14, padding:"12px 16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", display:"flex", justifyContent:"space-around" }}>
          {[["🔒","Secure payment"],["⚡","Instant"],["🔄","Regenerate anytime"]].map(([ic, lb]) => (
            <div key={lb} style={{ textAlign:"center" }}>
              <div style={{ fontSize:20 }}>{ic}</div>
              <div style={{ fontSize:10, color:"#777", fontWeight:600, marginTop:3 }}>{lb}</div>
            </div>
          ))}
        </div>

        {/* Psycovery note */}
        <div style={{ background:`${BLUE}10`, borderRadius:14, padding:"12px 14px", marginBottom:20, borderLeft:`3px solid ${BLUE}`, display:"flex", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><PsycoveryLogo size={24}/></div>
          <div style={{ fontSize:12, color:"#444", lineHeight:1.5 }}>Built by <strong style={{ color:BLUE }}>Psycovery</strong> — specialists in applying Hope Theory in forensic and reentry settings. Founded by David Adlington-Rivers.</div>
        </div>

        <button onClick={() => setStep("payment")} style={{ width:"100%", background: PLAN_GRAD, border:"none", borderRadius:16, padding:"16px 20px", color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:"0 6px 20px rgba(0,0,0,0.28)", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <span style={{ fontSize:18 }}>📋</span>
          <span>Get My Hope Plan — £4.99</span>
        </button>
        <div style={{ textAlign:"center", marginTop:10, fontSize:11, color:"#aaa" }}>Secure payment · No subscription · Cancel anytime</div>
      </div>
    </div>
  );

  // ── Payment form ──────────────────────────────────────────────────────────
  if (step === "payment") return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", background:"#f4f7fb", paddingBottom:40 }}>
      <div style={{ background: PLAN_GRAD, padding:"16px 20px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <button onClick={() => setStep("product")} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:99, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18 }}>‹</button>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:700 }}>Secure Checkout</div>
          <div style={{ marginLeft:"auto", fontSize:18 }}>🔒</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:32 }}>📋</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>Guided Hope Plan</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>One-time purchase</div>
          </div>
          <div style={{ marginLeft:"auto", fontSize:22, fontWeight:800, color:GOLD }}>£4.99</div>
        </div>
      </div>

      <div style={{ padding:"0 20px", marginTop:-16 }}>
        <div style={{ background:"#fff", borderRadius:18, padding:20, boxShadow:"0 4px 20px rgba(0,0,0,0.08)", marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:800, color:"#333", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:18 }}>💳</span> Card Details
          </div>

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#666", marginBottom:6 }}>Name on card</div>
            <input value={cardName} onChange={e=>setCardName(e.target.value)} placeholder="e.g. Alex Johnson" style={inp()}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#666", marginBottom:6 }}>Card number</div>
            <div style={{ position:"relative" }}>
              <input value={cardNumber} onChange={e=>setCardNumber(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" inputMode="numeric" style={{ ...inp(), paddingRight:44, letterSpacing:"0.08em" }}/>
              <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:20 }}>
                {cardNumber.startsWith("4") ? "💳" : cardNumber.startsWith("5") ? "💳" : "💳"}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:12, marginBottom:14 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#666", marginBottom:6 }}>Expiry</div>
              <input value={cardExpiry} onChange={e=>setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" inputMode="numeric" style={inp()} maxLength={5}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#666", marginBottom:6 }}>CVC</div>
              <input value={cardCvc} onChange={e=>setCardCvc(e.target.value.replace(/\D/g,"").slice(0,3))} placeholder="123" inputMode="numeric" style={inp()} maxLength={3}/>
            </div>
          </div>

          {cardError && (
            <div style={{ background:"#fff5f5", borderRadius:10, padding:"10px 12px", marginBottom:12, borderLeft:"3px solid #e74c3c", fontSize:12, color:"#c0392b", fontWeight:600 }}>
              ⚠️ {cardError}
            </div>
          )}

          <div style={{ background:"#f8fafc", borderRadius:10, padding:"10px 12px", marginBottom:16, display:"flex", gap:8 }}>
            <span style={{ fontSize:14 }}>🔒</span>
            <div style={{ fontSize:11, color:"#888", lineHeight:1.4 }}>Your payment is processed securely. Card details are never stored on our servers.</div>
          </div>

          <button onClick={handlePay} style={{ width:"100%", background:PLAN_GRAD, border:"none", borderRadius:14, padding:"15px 20px", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 16px rgba(0,0,0,0.22)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span>🔒</span><span>Pay £4.99 Securely</span>
          </button>
        </div>

        <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:8 }}>
          {["Visa","Mastercard","Amex","Apple Pay"].map(p => (
            <div key={p} style={{ fontSize:10, color:"#bbb", fontWeight:700 }}>{p}</div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Processing ────────────────────────────────────────────────────────────
  if (step === "processing") return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", background: PLAN_GRAD, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, textAlign:"center" }}>
      <div style={{ fontSize:60, marginBottom:20 }}>🔒</div>
      <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:8 }}>Processing payment{".".repeat(dots)}</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>Authorising your card securely...</div>
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:28 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:GOLD, opacity:0.4, animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }}/>
        ))}
      </div>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-10px);opacity:1}}`}</style>
    </div>
  );

  // ── Plan view ─────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", background:"#f4f7fb", paddingBottom:40 }}>
      {/* Header */}
      <div style={{ background: PLAN_GRAD, padding:"16px 20px 36px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:`${GOLD}15` }}/>
        <div style={{ position:"absolute", bottom:-30, left:10, width:70, height:70, borderRadius:"50%", background:`${BLUE}15` }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, position:"relative" }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:99, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18 }}>‹</button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={22}/></div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:700 }}>Guided Hope Plan</div>
          </div>
          <button onClick={generatePlan} disabled={planLoading} title="Regenerate plan" style={{ marginLeft:"auto", background:"rgba(255,255,255,0.15)", border:"none", borderRadius:99, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16 }}>🔄</button>
        </div>
        {planLoading ? (
          <div style={{ textAlign:"center", position:"relative", padding:"20px 0" }}>
            <div style={{ fontSize:48, marginBottom:10 }}>🔮</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>Building your plan{".".repeat(dots)}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", marginTop:6 }}>Psycovery's Hope Theory framework is personalising your roadmap</div>
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:16 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:GOLD, opacity:0.4, animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }}/>
              ))}
            </div>
          </div>
        ) : plan ? (
          <div style={{ position:"relative" }}>
            <div style={{ fontSize:13, color:`${GOLD_LIGHT}`, fontWeight:600, marginBottom:4 }}>Your personal roadmap</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff", lineHeight:1.25, marginBottom:12 }}>{plan.headline}</div>
            <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ textAlign:"center", flexShrink:0 }}>
                <div style={{ fontSize:24, fontWeight:800, color:GOLD }}>{plan.hopeScore}%</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)", fontWeight:700 }}>HOPE SCORE</div>
              </div>
              <div style={{ width:1, height:36, background:"rgba(255,255,255,0.2)" }}/>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", lineHeight:1.5 }}>{plan.summary}</div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"12px 0" }}>
            <div style={{ fontSize:48 }}>📋</div>
            <div style={{ fontSize:15, color:"rgba(255,255,255,0.8)", marginTop:8 }}>Your plan is ready to generate</div>
          </div>
        )}
      </div>

      <div style={{ padding:"0 20px", marginTop:-16 }}>
        {planError && (
          <div style={{ background:"#fff5f5", borderRadius:14, padding:16, marginBottom:16, borderLeft:"4px solid #e74c3c" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#c0392b" }}>⚠️ {planError}</div>
            <button onClick={generatePlan} style={{ marginTop:8, background:"#c0392b", border:"none", borderRadius:8, padding:"7px 14px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Try Again</button>
          </div>
        )}

        {plan && !planLoading && (
          <>
            {/* Affirmation */}
            <div style={{ background:`linear-gradient(135deg,${GOLD}22,${GOLD_LIGHT}18)`, borderRadius:16, padding:"16px 18px", marginBottom:16, borderLeft:`4px solid ${GOLD}`, boxShadow:`0 4px 14px ${GOLD}22` }}>
              <div style={{ fontSize:10, fontWeight:800, color:"#7a5f00", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>✨ Your Affirmation</div>
              <div style={{ fontSize:15, fontWeight:700, color:"#333", fontStyle:"italic", lineHeight:1.6 }}>"{plan.affirmation}"</div>
            </div>

            {/* 3 Pillars */}
            <div style={{ fontSize:13, fontWeight:800, color:"#333", marginBottom:10 }}>🏛️ Your Hope Pillars</div>
            {(plan.pillars || []).map((pillar, i) => (
              <div key={i} style={{ background:"#fff", borderRadius:14, marginBottom:10, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", borderLeft:`4px solid ${[BLUE, GOLD, GREEN][i % 3]}` }}>
                <button onClick={() => setExpandedSection(expandedSection === i ? -1 : i)} style={{ width:"100%", background:"none", border:"none", padding:"14px 16px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${[BLUE, GOLD, GREEN][i % 3]}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{pillar.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:"#222" }}>{pillar.title}</div>
                    <div style={{ fontSize:11, color:"#888", marginTop:1 }}>{pillar.description}</div>
                  </div>
                  <div style={{ fontSize:14, color:"#ccc" }}>{expandedSection === i ? "▲" : "▼"}</div>
                </button>
                {expandedSection === i && (
                  <div style={{ padding:"0 16px 14px", borderTop:"1px solid #f5f5f5" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#aaa", textTransform:"uppercase", marginBottom:8, marginTop:10 }}>Actions</div>
                    {pillar.actions.map((a, j) => (
                      <div key={j} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                        <div style={{ width:22, height:22, borderRadius:99, background:[BLUE, GOLD, GREEN][i % 3], display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 2px 6px ${[BLUE, GOLD, GREEN][i % 3]}44` }}>
                          <span style={{ color:"#fff", fontSize:10, fontWeight:800 }}>{j+1}</span>
                        </div>
                        <div style={{ fontSize:13, color:"#444", lineHeight:1.5 }}>{a}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* 4-week plan */}
            <div style={{ fontSize:13, fontWeight:800, color:"#333", marginBottom:10, marginTop:6 }}>📅 Your 4-Week Plan</div>
            <div style={{ background:"#fff", borderRadius:14, padding:16, marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              {(plan.weeklyPlan || []).map((week, i) => (
                <div key={i} style={{ display:"flex", gap:12, marginBottom: i < (plan.weeklyPlan.length - 1) ? 16 : 0 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background: PLAN_GRAD, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ color:GOLD, fontWeight:800, fontSize:13 }}>W{week.week}</span>
                    </div>
                    {i < (plan.weeklyPlan.length - 1) && <div style={{ width:2, flex:1, background:"#f0f0f0", minHeight:16, marginTop:4 }}/>}
                  </div>
                  <div style={{ paddingBottom: i < (plan.weeklyPlan.length - 1) ? 16 : 0 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:"#333", marginBottom:6 }}>Week {week.week}: <span style={{ color:BLUE }}>{week.focus}</span></div>
                    {week.tasks.map((task, j) => (
                      <div key={j} style={{ fontSize:12, color:"#555", marginBottom:4, paddingLeft:12, borderLeft:"2px solid #f0f0f0", lineHeight:1.5 }}>• {task}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Barrier strategies */}
            <div style={{ fontSize:13, fontWeight:800, color:"#333", marginBottom:10 }}>🧱 Overcoming Barriers</div>
            {(plan.barriers || []).map((b, i) => (
              <div key={i} style={{ background:"#fff", borderRadius:12, padding:"12px 14px", marginBottom:8, boxShadow:"0 2px 6px rgba(0,0,0,0.06)", display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"#fff3e0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>⚡</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:800, color:"#c0392b", marginBottom:3 }}>{b.barrier}</div>
                  <div style={{ fontSize:12, color:"#555", lineHeight:1.5 }}>{b.strategy}</div>
                </div>
              </div>
            ))}

            {/* Regenerate */}
            <div style={{ marginTop:16, background:"#fff", borderRadius:14, padding:"14px 16px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ fontSize:18 }}>🔄</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333" }}>Updated your goals?</div>
                <div style={{ fontSize:11, color:"#aaa" }}>Regenerate your plan anytime — included in your purchase</div>
              </div>
              <button onClick={generatePlan} disabled={planLoading} style={{ background:GRAD, border:"none", borderRadius:10, padding:"7px 14px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>Refresh</button>
            </div>

            <div style={{ textAlign:"center", marginTop:16, marginBottom:4 }}><PsycoveryLink/></div>
          </>
        )}

        {!plan && !planLoading && !planError && (
          <div style={{ background:"#fff", borderRadius:16, padding:28, textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:48 }}>📋</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#333", marginTop:12 }}>Ready to generate your plan</div>
            <div style={{ fontSize:13, color:"#777", marginTop:6, lineHeight:1.5 }}>Tap below to create your personalised Guided Hope Plan</div>
            <button onClick={generatePlan} style={{ marginTop:18, background:PLAN_GRAD, border:"none", borderRadius:14, padding:"13px 28px", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>✨ Generate My Plan</button>
          </div>
        )}
      </div>

      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-10px);opacity:1}}`}</style>
    </div>
  );
};

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [slide, setSlide] = useState(0);
  const [screen, setScreen] = useState("home");
  const [goals, setGoals] = useState(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({ title:"", category:"Probation & Supervision", step1:"", step2:"", step3:"" });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [booked, setBooked] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedGoals, setAddedGoals] = useState({});
  const [expandedLib, setExpandedLib] = useState(null);
  const [services, setServices] = useState(SEED_SERVICES);
  const [dirCity, setDirCity] = useState("");
  const [dirCityInput, setDirCityInput] = useState("");
  const [dirCategory, setDirCategory] = useState("All");
  const [dirSearch, setDirSearch] = useState("");
  const [expandedService, setExpandedService] = useState(null);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name:"", category:"Housing", city:"", address:"", phone:"", website:"", description:"" });
  const [addServiceSuccess, setAddServiceSuccess] = useState(false);
  const [profile, setProfile] = useState({ firstName:"Alex", lastName:"", preferredName:"Alex", name:"Alex", region:"", photo:"", bio:"", prison:"" });
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSuggester, setShowSuggester] = useState(false);
  const [showHopePlan, setShowHopePlan] = useState(false);
  const [purchasedHopePlan, setPurchasedHopePlan] = useState(false);

  const overallProgress = goals.length ? Math.round(goals.reduce((a,g)=>a+g.agency,0)/goals.length) : 0;
  const displayName = profile.preferredName || profile.firstName || "there";

  const communityAvg = useMemo(() => {
    const all = [...SEED_USERS, { id:"me", score: overallProgress }];
    return Math.round(all.reduce((s,u)=>s+u.score,0)/all.length);
  }, [overallProgress]);

  const allGoalsList = useMemo(()=>Object.entries(goalLibrary).flatMap(([cat,gs])=>gs.map(g=>({...g,category:cat}))),[]);
  const filteredGoals = useMemo(()=>{
    const q=search.toLowerCase();
    return allGoalsList.filter(g=>(activeCategory==="All"||g.category===activeCategory)&&(g.title.toLowerCase().includes(q)||g.steps.some(s=>s.toLowerCase().includes(q))));
  },[search,activeCategory,allGoalsList]);
  const filteredSponsored = useMemo(()=>{
    const q=dirSearch.toLowerCase();
    return SPONSORED_SERVICES.filter(s=>{
      const cityMatch=!dirCity||s.national||s.city.toLowerCase().includes(dirCity.toLowerCase());
      const catMatch=dirCategory==="All"||s.category===dirCategory;
      const searchMatch=!q||s.name.toLowerCase().includes(q)||s.description.toLowerCase().includes(q)||s.category.toLowerCase().includes(q);
      return cityMatch&&catMatch&&searchMatch;
    });
  },[dirCity,dirCategory,dirSearch]);
  const filteredServices = useMemo(()=>{
    const q=dirSearch.toLowerCase();
    return services.filter(s=>{
      const cityMatch=!dirCity||s.national||s.city.toLowerCase().includes(dirCity.toLowerCase());
      const catMatch=dirCategory==="All"||s.category===dirCategory;
      const searchMatch=!q||s.name.toLowerCase().includes(q)||s.description.toLowerCase().includes(q)||s.category.toLowerCase().includes(q);
      return cityMatch&&catMatch&&searchMatch;
    });
  },[services,dirCity,dirCategory,dirSearch]);

  const addSuggestedGoal=(sg,cat)=>{setGoals(p=>[...p,{id:Date.now(),title:sg.title,category:cat,steps:sg.steps,completed:sg.steps.map(()=>false),agency:0}]);setAddedGoals(p=>({...p,[sg.title]:true}));setOnboarded(true);};
  const addSuggestedAIGoal=(sg)=>{setGoals(p=>[...p,{id:Date.now(),title:sg.title,category:sg.category,steps:sg.steps,completed:sg.steps.map(()=>false),agency:0}]);setOnboarded(true);setScreen("goals");};
  const addCustomGoal=()=>{if(!newGoal.title)return;const steps=[newGoal.step1,newGoal.step2,newGoal.step3].filter(Boolean);setGoals(p=>[...p,{id:Date.now(),title:newGoal.title,category:newGoal.category,steps,completed:steps.map(()=>false),agency:0}]);setNewGoal({title:"",category:"Probation & Supervision",step1:"",step2:"",step3:""});setOnboarded(true);setScreen("goals");};
  const toggleStep=(goalId,idx)=>{setGoals(goals.map(g=>{if(g.id!==goalId)return g;const completed=[...g.completed];completed[idx]=!completed[idx];return{...g,completed,agency:Math.round(completed.filter(Boolean).length/completed.length*100)};}));};
  const submitNewService=()=>{if(!newService.name||!newService.city)return;setServices(p=>[...p,{...newService,id:`u${Date.now()}`}]);setNewService({name:"",category:"Housing",city:"",address:"",phone:"",website:"",description:""});setAddServiceSuccess(true);setTimeout(()=>{setAddServiceSuccess(false);setShowAddService(false);},2000);};

  const inp=(extra={})=>({border:"1.5px solid #e0e0e0",borderRadius:10,padding:"10px 12px",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box",...extra});

  if (showProfile) return <ProfileScreen profile={profile} onSave={setProfile} onBack={()=>setShowProfile(false)}/>;
  if (showLeaderboard) return <LeaderboardScreen myScore={overallProgress} myName={profile.name||profile.preferredName||"You"} myRegion={profile.region} myPrison={profile.prison||""} allUsers={SEED_USERS} onBack={()=>setShowLeaderboard(false)}/>;
  if (showSuggester) return <GoalSuggesterScreen onBack={()=>{setShowSuggester(false);setScreen("goals");}} onAddGoal={addSuggestedAIGoal}/>;
  if (showHopePlan) return <HopePlanScreen profile={profile} goals={goals} overallProgress={overallProgress} purchased={purchasedHopePlan} onPurchase={()=>setPurchasedHopePlan(true)} onBack={()=>setShowHopePlan(false)}/>;

  const Header = ({ title, bg }) => (
    <div style={{ background:bg||GRAD, padding:"16px 20px 26px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}><PsycoveryLogo size={30}/></div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>Hope Forward</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.8)" }}>powered by <span style={{ color:GOLD_LIGHT, fontWeight:700 }}>Psycovery</span></div>
          </div>
        </div>
        <Avatar photo={profile.photo} name={profile.name||"?"} size={34} fontSize={13} onClick={()=>setShowProfile(true)}/>
      </div>
      <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{title}</div>
    </div>
  );

  if (!onboarded) {
    const s=onboardingSlides[slide];const isLast=slide===onboardingSlides.length-1;
    return (
      <div style={{ fontFamily:"'Segoe UI',sans-serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", background:s.bg, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"40px 28px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={28}/></div>
            <div><div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>Hope Forward</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.75)" }}>powered by <span style={{ fontWeight:700, color:GOLD_LIGHT }}>Psycovery</span></div></div>
          </div>
          {!isLast&&<button onClick={()=>{setOnboarded(true);setScreen("goalLibrary");}} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:99, padding:"6px 16px", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>Skip</button>}
        </div>
        <div style={{ textAlign:"center", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
          <div style={{ fontSize:72, lineHeight:1 }}>{s.icon}</div>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:99, padding:"4px 14px", fontSize:11, color:"#fff", fontWeight:600 }}>{s.subtitle}</div>
          <div style={{ fontSize:26, fontWeight:800, color:"#fff", lineHeight:1.2 }}>{s.title}</div>
          <div style={{ fontSize:15, color:"rgba(255,255,255,0.9)", lineHeight:1.6, maxWidth:300 }}>{s.body}</div>
          {s.cta&&<PsycoveryLink style={{ color:"rgba(255,255,255,0.85)", fontSize:12 }}/>}
        </div>
        <div>
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:28 }}>
            {onboardingSlides.map((_,i)=><div key={i} style={{ width:i===slide?20:8, height:8, borderRadius:99, background:i===slide?"#fff":"rgba(255,255,255,0.35)", transition:"width 0.3s" }}/>)}
          </div>
          {isLast?<button onClick={()=>{setOnboarded(true);setScreen("goalLibrary");}} style={{ width:"100%", background:"#fff", border:"none", borderRadius:16, padding:18, fontSize:16, fontWeight:800, color:BLUE, cursor:"pointer" }}>🎯 Browse Goal Library</button>:<button onClick={()=>setSlide(slide+1)} style={{ width:"100%", background:"rgba(255,255,255,0.25)", border:"2px solid rgba(255,255,255,0.6)", borderRadius:16, padding:16, fontSize:15, fontWeight:700, color:"#fff", cursor:"pointer" }}>Next →</button>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", background:"#f4f7fb", position:"relative", paddingBottom:70 }}>

      {screen==="home"&&(
        <>
          <div style={{ background:GRAD, padding:"16px 20px 40px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:44, height:44, borderRadius:11, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.18)" }}><PsycoveryLogo size={34}/></div>
                <div><div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>Hope Forward</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.8)" }}>powered by <span style={{ color:GOLD_LIGHT, fontWeight:700 }}>Psycovery</span></div></div>
              </div>
              <Avatar photo={profile.photo} name={profile.name||"?"} size={40} fontSize={15} onClick={()=>setShowProfile(true)}/>
            </div>
            <div style={{ fontSize:21, fontWeight:800, color:"#fff" }}>Welcome back, {displayName} 👋</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:3, fontStyle:"italic" }}>Where Hope Becomes Practice</div>
            {profile.region&&<div style={{ marginTop:6, display:"inline-flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.18)", borderRadius:99, padding:"3px 10px" }}><span style={{ fontSize:11, color:"rgba(255,255,255,0.9)", fontWeight:600 }}>📍 {profile.region}</span></div>}
          </div>
          <div style={{ padding:"0 20px", marginTop:-18 }}>
            <div style={{ background:"#fff", borderRadius:16, padding:16, marginBottom:14, borderLeft:`4px solid ${GOLD}`, boxShadow:"0 4px 14px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize:11, color:GOLD, fontWeight:700, marginBottom:4, textTransform:"uppercase" }}>Daily Hope</div>
              <div style={{ fontSize:14, color:"#333", fontStyle:"italic", lineHeight:1.5 }}>"Every day is a new chance to move forward."</div>
            </div>
            <div style={{ background:"#fff", borderRadius:16, padding:16, marginBottom:14, boxShadow:"0 4px 14px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:12 }}>Your Hope Score</div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ position:"relative", width:80, height:80 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#f0f0f0" strokeWidth="8"/>
                    <circle cx="40" cy="40" r="32" fill="none" stroke={GOLD} strokeWidth="8" strokeDasharray={`${2*Math.PI*32*overallProgress/100} 999`} strokeLinecap="round" transform="rotate(-90 40 40)"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:GOLD }}>{overallProgress}%</div>
                </div>
                <div>
                  <div style={{ fontSize:13, color:"#555" }}>You're making progress!</div>
                  <div style={{ fontSize:12, color:"#999", marginTop:4 }}>Based on {goals.length} active goals</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:10 }}>Quick Actions</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { label:"Goal Library", icon:"📖", target:"goalLibrary", color:BLUE },
                { label:"My Pathways", icon:"🛤️", target:"pathways", color:GREEN },
                { label:"Find Services", icon:"📍", target:"directory", color:GOLD },
                { label:"My Progress", icon:"📈", target:"progress", color:"#8E44AD" },
              ].map(a=>(
                <button key={a.label} onClick={()=>setScreen(a.target)} style={{ background:"#fff", border:"none", borderRadius:14, padding:"16px 12px", cursor:"pointer", textAlign:"left", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderTop:`3px solid ${a.color}` }}>
                  <div style={{ fontSize:24 }}>{a.icon}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#333", marginTop:6 }}>{a.label}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>setShowLeaderboard(true)} style={{ width:"100%", marginTop:12, background:`linear-gradient(135deg,#1a1a2e,#2c3e50)`, border:"none", borderRadius:14, padding:"16px 20px", color:"#fff", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 4px 14px rgba(0,0,0,0.2)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:10, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🏆</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800 }}>Hope Leaderboard</div>
                  <div style={{ fontSize:12, opacity:0.7 }}>{SEED_USERS.length+1} members · Avg {communityAvg}% community score</div>
                </div>
              </div>
              <div style={{ fontSize:18, opacity:0.6 }}>›</div>
            </button>
            <button onClick={()=>setScreen("coaching")} style={{ width:"100%", marginTop:12, background:GRAD_GOLD, border:"none", borderRadius:14, padding:"18px 20px", color:"#fff", cursor:"pointer", textAlign:"left", boxShadow:`0 4px 14px ${GOLD}55`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ background:"rgba(255,255,255,0.25)", borderRadius:10, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={32}/></div>
                <div><div style={{ fontSize:14, fontWeight:800 }}>Work with a Psycovery Coach</div><div style={{ fontSize:12, opacity:0.9 }}>1:1 coaching from Psycovery experts</div></div>
              </div>
              <div style={{ fontSize:18, opacity:0.8 }}>›</div>
            </button>
            {/* Guided Hope Plan IAP */}
            <button onClick={()=>setShowHopePlan(true)} style={{ width:"100%", marginTop:12, background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)", border:"none", borderRadius:14, padding:"18px 20px", color:"#fff", cursor:"pointer", textAlign:"left", boxShadow:"0 6px 20px rgba(0,0,0,0.28)", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-18, right:-18, width:80, height:80, borderRadius:"50%", background:`${GOLD}18` }}/>
              <div style={{ position:"absolute", bottom:-24, right:40, width:60, height:60, borderRadius:"50%", background:`${BLUE}14` }}/>
              <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative" }}>
                <div style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, borderRadius:12, width:46, height:46, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, boxShadow:`0 4px 12px ${GOLD}44` }}>📋</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                    <div style={{ fontSize:14, fontWeight:800 }}>Guided Hope Plan</div>
                    {purchasedHopePlan
                      ? <span style={{ fontSize:9, background:GREEN, color:"#fff", borderRadius:99, padding:"2px 7px", fontWeight:800 }}>UNLOCKED</span>
                      : <span style={{ fontSize:9, background:`${GOLD}dd`, color:"#7a5f00", borderRadius:99, padding:"2px 7px", fontWeight:800 }}>£4.99</span>}
                  </div>
                  <div style={{ fontSize:12, opacity:0.75 }}>AI-generated personal plan built on your goals</div>
                </div>
              </div>
              <div style={{ fontSize:18, opacity:0.6, position:"relative" }}>›</div>
            </button>
            <div style={{ background:"#fff", borderRadius:16, padding:20, marginTop:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderTop:`3px solid ${GOLD}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ width:50, height:50, borderRadius:12, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><PsycoveryLogo size={36}/></div>
                <div><div style={{ fontSize:16, fontWeight:800 }}><span style={{ color:BLUE }}>Psy</span><span style={{ color:GOLD }}>covery</span></div><div style={{ fontSize:11, color:"#888", fontStyle:"italic" }}>Where Hope Becomes Practice</div></div>
              </div>
              <div style={{ fontSize:13, color:"#555", lineHeight:1.65 }}>Hope Forward is powered by <span style={{ fontWeight:700, color:BLUE }}>Psycovery</span> — a specialist organisation founded by <span style={{ fontWeight:700, color:"#333" }}>David Adlington-Rivers</span>, dedicated to applying Hope Theory in forensic settings.</div>
              <div style={{ marginTop:14, padding:"10px 14px", background:`${BLUE}11`, borderRadius:10, borderLeft:`3px solid ${BLUE}` }}>
                <div style={{ fontSize:12, color:BLUE, fontWeight:700, marginBottom:2 }}>Founded by David Adlington-Rivers</div>
                <div style={{ fontSize:12, color:"#666", lineHeight:1.5 }}>Specialist in Hope Theory · Forensic Applications · Criminal Justice Reform</div>
              </div>
              <div style={{ marginTop:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <a href="https://www.psycovery.co.uk" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:10, background:GRAD, color:"#fff", borderRadius:12, padding:"11px 20px", fontSize:13, fontWeight:700, textDecoration:"none" }}><PsycoveryLogo size={20}/>Visit www.psycovery.co.uk</a>
              </div>
            </div>
            <div style={{ textAlign:"center", marginTop:16, marginBottom:8 }}><PsycoveryLink/></div>
          </div>
        </>
      )}

      {screen==="directory"&&(
        <>
          <div style={{ background:`linear-gradient(135deg,#2c3e50,#34495e)`, padding:"16px 20px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={26}/></div>
                <div><div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>Hope Forward</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.75)" }}>powered by <span style={{ color:GOLD_LIGHT, fontWeight:700 }}>Psycovery</span></div></div>
              </div>
              <Avatar photo={profile.photo} name={profile.name||"?"} size={32} fontSize={12} onClick={()=>setShowProfile(true)}/>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:12 }}>📍 Find Local Services</div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={dirCityInput} onChange={e=>setDirCityInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setDirCity(dirCityInput)} placeholder="Enter your town or city..." style={{ flex:1, borderRadius:12, border:"none", padding:"11px 14px", fontSize:14, outline:"none", background:"rgba(255,255,255,0.95)" }}/>
              <button onClick={()=>setDirCity(dirCityInput)} style={{ background:GOLD, border:"none", borderRadius:12, padding:"11px 16px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>Search</button>
            </div>
          </div>
          <div style={{ background:"#fff", padding:"10px 0", borderBottom:"1px solid #f0f0f0" }}>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingLeft:16, whiteSpace:"nowrap" }}>
              {["All",...SERVICE_CATEGORIES].map(cat=>(
                <button key={cat} onClick={()=>setDirCategory(cat)} style={{ display:"inline-block", padding:"6px 12px", borderRadius:99, border:"none", cursor:"pointer", fontSize:11, fontWeight:700, flexShrink:0, background:dirCategory===cat?(SERVICE_COLORS[cat]||"#2c3e50"):"#f4f7fb", color:dirCategory===cat?"#fff":"#555" }}>
                  {cat==="All"?"All":`${SERVICE_ICONS[cat]} ${cat}`}
                </button>
              ))}
            </div>
            <div style={{ padding:"8px 16px 4px" }}>
              <div style={{ position:"relative" }}>
                <input value={dirSearch} onChange={e=>setDirSearch(e.target.value)} placeholder="Search by name or type..." style={{ ...inp(), background:"#f4f7fb", border:"none", padding:"9px 14px 9px 36px" }}/>
                <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#aaa" }}>🔍</div>
              </div>
            </div>
          </div>
          <div style={{ padding:"12px 16px 80px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontSize:12, color:"#888" }}>
                {dirCity?<><span style={{ fontWeight:700, color:"#333" }}>{filteredServices.length+filteredSponsored.length}</span> services near <span style={{ fontWeight:700, color:BLUE }}>{dirCity}</span>{dirCategory!=="All"?` · ${dirCategory}`:""}</>:<span style={{ color:"#aaa" }}>Enter a town or city to find local services</span>}
              </div>
              {dirCity&&<button onClick={()=>{setDirCity("");setDirCityInput("");}} style={{ background:"none", border:"none", fontSize:11, color:"#aaa", cursor:"pointer" }}>✕ Clear</button>}
            </div>
            {!dirCity&&(
              <div style={{ background:"#fff", borderRadius:16, padding:24, textAlign:"center", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:40 }}>📍</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#333", marginTop:10 }}>Find support near you</div>
                <div style={{ fontSize:13, color:"#777", marginTop:6, lineHeight:1.5 }}>Type your town or city above to find housing, employment, mental health and other services in your area.</div>
                <div style={{ marginTop:20, textAlign:"left" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <div style={{ height:1, flex:1, background:`linear-gradient(90deg,transparent,${GOLD}60)` }}/>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:18, height:18, borderRadius:4, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={13}/></div><span style={{ fontSize:10, fontWeight:800, color:GOLD, letterSpacing:"0.06em" }}>FEATURED PARTNER</span></div>
                    <div style={{ height:1, flex:1, background:`linear-gradient(90deg,${GOLD}60,transparent)` }}/>
                  </div>
                  <SponsoredCard svc={SPONSORED_SERVICES[1]} expanded={expandedService==="sp2-teaser"} onToggle={()=>setExpandedService(expandedService==="sp2-teaser"?null:"sp2-teaser")}/>
                </div>
              </div>
            )}
            {dirCity&&filteredSponsored.length>0&&(
              <div style={{ marginBottom:4 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div style={{ height:1, flex:1, background:`linear-gradient(90deg,transparent,${GOLD}60)` }}/>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:18, height:18, borderRadius:4, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={13}/></div><span style={{ fontSize:10, fontWeight:800, color:GOLD, letterSpacing:"0.06em", whiteSpace:"nowrap" }}>SPONSORED PARTNER</span></div>
                  <div style={{ height:1, flex:1, background:`linear-gradient(90deg,${GOLD}60,transparent)` }}/>
                </div>
                {filteredSponsored.map(svc=><SponsoredCard key={svc.id} svc={svc} expanded={expandedService===svc.id} onToggle={()=>setExpandedService(expandedService===svc.id?null:svc.id)}/>)}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <div style={{ height:1, flex:1, background:"#e8e8e8" }}/><span style={{ fontSize:10, color:"#aaa", fontWeight:600, whiteSpace:"nowrap" }}>ALL LOCAL SERVICES</span><div style={{ height:1, flex:1, background:"#e8e8e8" }}/>
                </div>
              </div>
            )}
            {dirCity&&filteredServices.length===0&&filteredSponsored.length===0&&(
              <div style={{ background:"#fff", borderRadius:14, padding:24, textAlign:"center", color:"#aaa", marginBottom:16 }}>
                <div style={{ fontSize:32 }}>🔍</div>
                <div style={{ fontSize:14, marginTop:8, color:"#555" }}>No services found for "{dirCity}"</div>
                <div style={{ fontSize:12, marginTop:6, color:"#aaa" }}>Try a nearby city, or add a service below</div>
              </div>
            )}
            {filteredServices.map(svc=>{
              const col=SERVICE_COLORS[svc.category]||"#2c3e50"; const isExp=expandedService===svc.id;
              return (
                <div key={svc.id} style={{ background:"#fff", borderRadius:14, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", overflow:"hidden", borderLeft:`4px solid ${col}` }}>
                  <button onClick={()=>setExpandedService(isExp?null:svc.id)} style={{ width:"100%", background:"none", border:"none", padding:"14px 14px 10px", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                        <span style={{ fontSize:10, background:col, color:"#fff", borderRadius:99, padding:"2px 8px", fontWeight:700 }}>{SERVICE_ICONS[svc.category]} {svc.category}</span>
                        {svc.national&&<span style={{ fontSize:10, background:"#f0f0f0", color:"#888", borderRadius:99, padding:"2px 8px", fontWeight:600 }}>🇬🇧 National</span>}
                      </div>
                      <div style={{ fontSize:14, fontWeight:800, color:"#333" }}>{svc.name}</div>
                      <div style={{ fontSize:12, color:"#888", marginTop:2 }}>📍 {svc.city}</div>
                    </div>
                    <div style={{ fontSize:16, color:"#ccc", flexShrink:0 }}>{isExp?"▲":"▼"}</div>
                  </button>
                  <div style={{ padding:"0 14px 6px" }}><div style={{ fontSize:12, color:"#666", lineHeight:1.5 }}>{svc.description}</div></div>
                  {isExp&&(
                    <div style={{ padding:"10px 14px 14px", borderTop:"1px solid #f5f5f5", display:"flex", flexDirection:"column", gap:8 }}>
                      {svc.address&&<div style={{ fontSize:12, color:"#555" }}>🏢 {svc.address}</div>}
                      {svc.phone&&<a href={`tel:${svc.phone.replace(/\s/g,"")}`} style={{ display:"inline-flex", alignItems:"center", gap:8, background:col, color:"#fff", borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:700, textDecoration:"none", alignSelf:"flex-start" }}>📞 {svc.phone}</a>}
                      {svc.website&&<a href={`https://${svc.website.replace(/^https?:\/\//,"")}`} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:BLUE, fontWeight:600, textDecoration:"none" }}>🌐 {svc.website} ↗</a>}
                    </div>
                  )}
                </div>
              );
            })}
            {!showAddService?(
              <button onClick={()=>setShowAddService(true)} style={{ width:"100%", marginTop:8, background:"#fff", border:`2px dashed ${BLUE}`, borderRadius:14, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:99, background:`${BLUE}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>+</div>
                <div style={{ textAlign:"left" }}><div style={{ fontSize:13, fontWeight:700, color:BLUE }}>Add a Service</div><div style={{ fontSize:11, color:"#aaa" }}>Know a local service that should be listed here?</div></div>
              </button>
            ):(
              <div style={{ background:"#fff", borderRadius:16, padding:20, marginTop:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderTop:`3px solid ${BLUE}` }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#333", marginBottom:14 }}>➕ Add a Local Service</div>
                {addServiceSuccess?(<div style={{ textAlign:"center", padding:20 }}><div style={{ fontSize:40 }}>✅</div><div style={{ fontSize:14, fontWeight:700, color:GREEN, marginTop:8 }}>Service Added!</div></div>):(
                  <>
                    {[{label:"Organisation name *",key:"name",placeholder:"e.g. Manchester Shelter"},{label:"Town or City *",key:"city",placeholder:"e.g. Manchester"},{label:"Address",key:"address",placeholder:"Street address"},{label:"Phone number",key:"phone",placeholder:"e.g. 0161 123 4567"},{label:"Website",key:"website",placeholder:"e.g. example.org.uk"}].map(f=>(
                      <div key={f.key} style={{ marginBottom:10 }}><div style={{ fontSize:11, fontWeight:700, color:"#666", marginBottom:4 }}>{f.label}</div><input value={newService[f.key]} onChange={e=>setNewService(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={inp()}/></div>
                    ))}
                    <div style={{ marginBottom:10 }}><div style={{ fontSize:11, fontWeight:700, color:"#666", marginBottom:4 }}>Category</div><div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{SERVICE_CATEGORIES.map(c=><button key={c} onClick={()=>setNewService(p=>({...p,category:c}))} style={{ padding:"5px 10px", borderRadius:99, border:"none", cursor:"pointer", fontSize:11, fontWeight:600, background:newService.category===c?(SERVICE_COLORS[c]||BLUE):"#f0f0f0", color:newService.category===c?"#fff":"#666" }}>{SERVICE_ICONS[c]} {c}</button>)}</div></div>
                    <div style={{ marginBottom:14 }}><div style={{ fontSize:11, fontWeight:700, color:"#666", marginBottom:4 }}>Description</div><textarea value={newService.description} onChange={e=>setNewService(p=>({...p,description:e.target.value}))} placeholder="Briefly describe what this service offers..." rows={3} style={{ ...inp(), resize:"none", fontFamily:"inherit" }}/></div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>setShowAddService(false)} style={{ flex:1, background:"#f0f0f0", border:"none", borderRadius:12, padding:12, fontSize:13, fontWeight:700, color:"#666", cursor:"pointer" }}>Cancel</button>
                      <button onClick={submitNewService} style={{ flex:2, background:GRAD, border:"none", borderRadius:12, padding:12, fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>Submit Service</button>
                    </div>
                  </>
                )}
              </div>
            )}
            <div style={{ marginTop:20, background:`linear-gradient(135deg,#1a1a2e,#2c2c54)`, borderRadius:16, padding:20, boxShadow:"0 4px 16px rgba(0,0,0,0.15)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><PsycoveryLogo size={30}/></div>
                <div><div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>List Your Organisation Here</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>Reach people ready to work</div></div>
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", lineHeight:1.6, marginBottom:14 }}>Sponsored listings appear at the top of search results and reach people actively rebuilding their lives.</div>
              <a href="https://www.psycovery.co.uk" target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:GRAD_GOLD, color:"#7a5f00", borderRadius:12, padding:"11px 16px", fontSize:13, fontWeight:800, textDecoration:"none" }}><PsycoveryLogo size={18}/>Enquire about Sponsored Listings ↗</a>
            </div>
          </div>
        </>
      )}

      {screen==="goalLibrary"&&(
        <>
          <Header title="📖 Goal Library"/>
          {/* AI Suggester CTA */}
          <div style={{ padding:"14px 20px 0" }}>
            <button onClick={()=>setShowSuggester(true)} style={{ width:"100%", background:`linear-gradient(135deg,#1a1a2e,#2c3e50)`, border:"none", borderRadius:14, padding:"14px 18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4, boxShadow:"0 4px 14px rgba(0,0,0,0.18)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>✨</div>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>Not sure where to start?</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginTop:1 }}>Tell us what you want — AI suggests goals for you</div>
                </div>
              </div>
              <div style={{ fontSize:18, color:"rgba(255,255,255,0.5)" }}>›</div>
            </button>
          </div>
          <div style={{ padding:"12px 0 0", overflowX:"auto", whiteSpace:"nowrap", paddingLeft:20 }}>
            {["All",...Object.keys(goalLibrary)].map(cat=>(
              <button key={cat} onClick={()=>setActiveCategory(cat)} style={{ display:"inline-block", marginRight:8, marginBottom:12, padding:"7px 14px", borderRadius:99, border:"none", cursor:"pointer", fontSize:12, fontWeight:700, background:activeCategory===cat?(cat==="All"?BLUE:categoryColors[cat]||BLUE):"#fff", color:activeCategory===cat?"#fff":"#555", boxShadow:"0 2px 6px rgba(0,0,0,0.08)" }}>
                {cat==="All"?"All":`${categoryIcons[cat]} ${cat}`}
              </button>
            ))}
          </div>
          <div style={{ padding:"0 20px 20px" }}>
            <div style={{ position:"relative", marginBottom:12 }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search goals..." style={{ ...inp(), padding:"11px 16px 11px 38px", background:"#fff" }}/>
              <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>🔍</div>
              {search&&<button onClick={()=>setSearch("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", fontSize:16, cursor:"pointer", color:"#aaa" }}>✕</button>}
            </div>
            <div style={{ fontSize:12, color:"#999", marginBottom:12 }}>{filteredGoals.length} goal{filteredGoals.length!==1?"s":""} found</div>
            {filteredGoals.map((g,i)=>{
              const col=categoryColors[g.category]||BLUE; const isExpanded=expandedLib===i; const isAdded=addedGoals[g.title];
              return (
                <div key={i} style={{ background:"#fff", borderRadius:14, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", overflow:"hidden", borderLeft:`4px solid ${col}` }}>
                  <div style={{ padding:"14px 14px 10px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                    <div style={{ flex:1 }}><div style={{ fontSize:10, color:col, fontWeight:700, textTransform:"uppercase", marginBottom:3 }}>{categoryIcons[g.category]} {g.category}</div><div style={{ fontSize:14, fontWeight:700, color:"#333", lineHeight:1.3 }}>{g.title}</div></div>
                    <button onClick={()=>isAdded?null:addSuggestedGoal(g,g.category)} style={{ flexShrink:0, background:isAdded?"#f0f0f0":col, border:"none", borderRadius:99, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:isAdded?"default":"pointer", color:isAdded?"#aaa":"#fff", whiteSpace:"nowrap" }}>{isAdded?"✓ Added":"+ Add"}</button>
                  </div>
                  <button onClick={()=>setExpandedLib(isExpanded?null:i)} style={{ width:"100%", background:"none", border:"none", padding:"0 14px 12px", cursor:"pointer", textAlign:"left" }}>
                    <div style={{ fontSize:11, color:"#aaa", fontWeight:600 }}>{isExpanded?"▲ Hide steps":"▼ View pathway steps"}</div>
                  </button>
                  {isExpanded&&(
                    <div style={{ padding:"0 14px 14px", borderTop:"1px solid #f5f5f5" }}>
                      {g.steps.map((s,j)=>(
                        <div key={j} style={{ display:"flex", gap:8, marginBottom:7, alignItems:"flex-start" }}>
                          <div style={{ width:18, height:18, borderRadius:99, background:col, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}><span style={{ color:"#fff", fontSize:9, fontWeight:800 }}>{j+1}</span></div>
                          <div style={{ fontSize:12, color:"#555", lineHeight:1.5 }}>{s}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ background:"#fff", borderRadius:14, padding:16, marginTop:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderTop:`3px solid ${BLUE}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:4 }}>✏️ Can't find what you're looking for?</div>
              <div style={{ fontSize:12, color:"#777", marginBottom:12 }}>Write your own goal, or let AI suggest goals based on what you want to achieve.</div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setShowSuggester(true)} style={{ flex:1, background:`linear-gradient(135deg,#1a1a2e,#2c3e50)`, border:"none", borderRadius:12, padding:"11px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><span>✨</span><span>AI Suggest</span></button>
                <button onClick={()=>setScreen("addGoal")} style={{ flex:1, background:GRAD, border:"none", borderRadius:12, padding:"11px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Write My Own</button>
              </div>
            </div>
          </div>
        </>
      )}

      {screen==="addGoal"&&(
        <>
          <Header title="Write Your Own Goal"/>
          <div style={{ padding:20 }}>
            <div style={{ background:"#fff", borderRadius:16, padding:20, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#555", marginBottom:6 }}>What's your goal?</div>
              <input value={newGoal.title} onChange={e=>setNewGoal({...newGoal,title:e.target.value})} placeholder="e.g. Complete my unpaid work hours" style={inp()}/>
              <div style={{ fontSize:13, fontWeight:600, color:"#555", margin:"14px 0 6px" }}>Category</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {Object.keys(categoryColors).map(c=><button key={c} onClick={()=>setNewGoal({...newGoal,category:c})} style={{ padding:"6px 12px", borderRadius:99, border:"none", cursor:"pointer", fontSize:11, fontWeight:600, background:newGoal.category===c?categoryColors[c]:"#f0f0f0", color:newGoal.category===c?"#fff":"#666" }}>{categoryIcons[c]} {c}</button>)}
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:"#555", margin:"14px 0 6px" }}>Pathway Steps (up to 3)</div>
              {["step1","step2","step3"].map((k,i)=><input key={k} value={newGoal[k]} onChange={e=>setNewGoal({...newGoal,[k]:e.target.value})} placeholder={`Step ${i+1}`} style={inp({marginBottom:8})}/>)}
              <button onClick={addCustomGoal} style={{ width:"100%", background:GRAD, border:"none", borderRadius:14, padding:14, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:6 }}>Save My Goal 🎯</button>
            </div>
          </div>
        </>
      )}

      {screen==="goals"&&(
        <>
          <Header title="My Goals"/>
          <div style={{ padding:20 }}>
            <button onClick={()=>setScreen("goalLibrary")} style={{ width:"100%", background:"#fff", border:`2px dashed ${BLUE}`, borderRadius:14, padding:"12px 16px", cursor:"pointer", textAlign:"left", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>📖</span>
              <div><div style={{ fontSize:13, fontWeight:700, color:BLUE }}>Browse Goal Library</div><div style={{ fontSize:11, color:"#999" }}>Specialist goals across 8 categories</div></div>
            </button>
            <button onClick={()=>setShowSuggester(true)} style={{ width:"100%", background:`linear-gradient(135deg,#1a1a2e,#2c3e50)`, border:"none", borderRadius:14, padding:"12px 16px", cursor:"pointer", textAlign:"left", marginBottom:16, display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 14px rgba(0,0,0,0.16)" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>✨</div>
              <div><div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>AI Goal Suggester</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>Tell us what you want — we'll suggest goals</div></div>
              <div style={{ marginLeft:"auto", fontSize:18, color:"rgba(255,255,255,0.4)" }}>›</div>
            </button>
            {goals.map(g=>(
              <div key={g.id} style={{ background:"#fff", borderRadius:16, padding:16, marginBottom:14, borderLeft:`4px solid ${categoryColors[g.category]||BLUE}`, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div><div style={{ fontSize:10, color:categoryColors[g.category]||BLUE, fontWeight:700, textTransform:"uppercase" }}>{categoryIcons[g.category]} {g.category}</div><div style={{ fontSize:15, fontWeight:700, color:"#333", marginTop:2 }}>{g.title}</div></div>
                  <div style={{ fontSize:18, fontWeight:800, color:GOLD }}>{g.agency}%</div>
                </div>
                <div style={{ background:"#f0f0f0", borderRadius:99, height:6, marginTop:10, marginBottom:12 }}>
                  <div style={{ background:GOLD, borderRadius:99, height:6, width:`${g.agency}%`, transition:"width 0.4s" }}/>
                </div>
                {g.steps.map((s,i)=>(
                  <div key={i} onClick={()=>toggleStep(g.id,i)} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", cursor:"pointer", borderBottom:i<g.steps.length-1?"1px solid #f5f5f5":"none" }}>
                    <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${g.completed[i]?BLUE:"#ddd"}`, background:g.completed[i]?BLUE:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {g.completed[i]&&<span style={{ color:"#fff", fontSize:12, fontWeight:800 }}>✓</span>}
                    </div>
                    <div style={{ fontSize:13, color:g.completed[i]?"#aaa":"#333", textDecoration:g.completed[i]?"line-through":"none" }}>{s}</div>
                  </div>
                ))}
              </div>
            ))}
            <button onClick={()=>setScreen("addGoal")} style={{ width:"100%", background:GRAD, border:"none", borderRadius:14, padding:16, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>+ Write My Own Goal</button>
          </div>
        </>
      )}

      {screen==="pathways"&&(
        <>
          <Header title="My Pathways"/>
          <div style={{ padding:20 }}>
            <div style={{ fontSize:13, color:"#666", marginBottom:16 }}>Tap a goal to see your pathway</div>
            {goals.map(g=>(
              <div key={g.id}>
                <button onClick={()=>setSelectedGoal(selectedGoal===g.id?null:g.id)} style={{ width:"100%", background:"#fff", border:"none", borderRadius:14, padding:"14px 16px", cursor:"pointer", textAlign:"left", marginBottom:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><div style={{ fontSize:10, color:categoryColors[g.category]||BLUE, fontWeight:700, textTransform:"uppercase" }}>{g.category}</div><div style={{ fontSize:14, fontWeight:700, color:"#333" }}>{g.title}</div></div>
                  <div style={{ fontSize:18 }}>{selectedGoal===g.id?"▲":"▼"}</div>
                </button>
                {selectedGoal===g.id&&(
                  <div style={{ background:"#fff", borderRadius:14, padding:16, marginBottom:12, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    {g.steps.map((s,i)=>(
                      <div key={i} style={{ display:"flex", gap:12 }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                          <div style={{ width:28, height:28, borderRadius:99, background:g.completed[i]?BLUE:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:g.completed[i]?"#fff":"#aaa", flexShrink:0 }}>{g.completed[i]?"✓":i+1}</div>
                          {i<g.steps.length-1&&<div style={{ width:2, flex:1, background:"#f0f0f0", minHeight:24, margin:"4px 0" }}/>}
                        </div>
                        <div style={{ paddingTop:4, paddingBottom:i<g.steps.length-1?20:0 }}>
                          <div style={{ fontSize:14, color:g.completed[i]?"#aaa":"#333", textDecoration:g.completed[i]?"line-through":"none" }}>{s}</div>
                          {g.completed[i]&&<div style={{ fontSize:11, color:BLUE, fontWeight:600, marginTop:2 }}>Completed ✓</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {screen==="progress"&&(
        <>
          <Header title="My Progress"/>
          <div style={{ padding:20 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div style={{ background:"#fff", borderRadius:16, padding:16, textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:11, color:"#aaa", fontWeight:700, marginBottom:8, textTransform:"uppercase" }}>Your Score</div>
                <div style={{ position:"relative", width:80, height:80, margin:"0 auto" }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <defs><linearGradient id="pg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={BLUE}/><stop offset="100%" stopColor={GOLD}/></linearGradient></defs>
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#f0f0f0" strokeWidth="8"/>
                    <circle cx="40" cy="40" r="32" fill="none" stroke="url(#pg1)" strokeWidth="8" strokeDasharray={`${2*Math.PI*32*overallProgress/100} 999`} strokeLinecap="round" transform="rotate(-90 40 40)"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ fontSize:20, fontWeight:800, color:GOLD }}>{overallProgress}%</div>
                    <div style={{ fontSize:9, color:"#aaa" }}>HOPE</div>
                  </div>
                </div>
                <div style={{ marginTop:8, fontSize:11, fontWeight:600, color: overallProgress >= communityAvg ? GREEN : ORANGE }}>
                  {overallProgress >= communityAvg ? `▲ +${overallProgress - communityAvg} above avg` : `▼ ${overallProgress - communityAvg} below avg`}
                </div>
              </div>
              <div style={{ background:"#fff", borderRadius:16, padding:16, textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:11, color:"#aaa", fontWeight:700, marginBottom:8, textTransform:"uppercase" }}>Community Avg</div>
                <div style={{ position:"relative", width:80, height:80, margin:"0 auto" }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#f0f0f0" strokeWidth="8"/>
                    <circle cx="40" cy="40" r="32" fill="none" stroke={GOLD} strokeWidth="8" strokeDasharray={`${2*Math.PI*32*communityAvg/100} 999`} strokeLinecap="round" strokeDashoffset="0" transform="rotate(-90 40 40)" opacity="0.5"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ fontSize:20, fontWeight:800, color:"#aaa" }}>{communityAvg}%</div>
                    <div style={{ fontSize:9, color:"#ccc" }}>AVG</div>
                  </div>
                </div>
                <div style={{ marginTop:8, fontSize:11, fontWeight:600, color:"#aaa" }}>{SEED_USERS.length+1} members</div>
              </div>
            </div>
            <div style={{ background:"#fff", borderRadius:14, padding:"14px 16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${overallProgress>=communityAvg?GREEN:ORANGE}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333" }}>You vs Community</div>
                <div style={{ fontSize:12, fontWeight:800, color:overallProgress>=communityAvg?GREEN:ORANGE }}>
                  {overallProgress>=communityAvg?`+${overallProgress-communityAvg}%`:`${overallProgress-communityAvg}%`}
                </div>
              </div>
              <div style={{ position:"relative", background:"#f0f0f0", borderRadius:99, height:10 }}>
                <div style={{ position:"absolute", left:`${communityAvg}%`, top:-3, width:3, height:16, background:GOLD, borderRadius:2, zIndex:2 }}/>
                <div style={{ background:overallProgress>=communityAvg?GREEN:ORANGE, borderRadius:99, height:10, width:`${overallProgress}%`, transition:"width 0.6s" }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:10, color:"#aaa" }}>
                <span>0%</span>
                <span style={{ color:GOLD, fontWeight:700 }}>Avg {communityAvg}%</span>
                <span>100%</span>
              </div>
            </div>
            <button onClick={()=>setShowLeaderboard(true)} style={{ width:"100%", background:`linear-gradient(135deg,#1a1a2e,#2c3e50)`, border:"none", borderRadius:14, padding:"13px 16px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ fontSize:22 }}>🏆</div>
              <div style={{ textAlign:"left" }}><div style={{ fontSize:13, fontWeight:700 }}>View Full Leaderboard</div><div style={{ fontSize:11, opacity:0.6 }}>See how you rank across all members</div></div>
              <div style={{ marginLeft:"auto", fontSize:16, opacity:0.5 }}>›</div>
            </button>
            {goals.map(g=>(
              <div key={g.id} style={{ background:"#fff", borderRadius:14, padding:16, marginBottom:12, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#333" }}>{g.title}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:categoryColors[g.category]||BLUE }}>{g.agency}%</div>
                </div>
                <div style={{ background:"#f0f0f0", borderRadius:99, height:8 }}>
                  <div style={{ background:categoryColors[g.category]||BLUE, borderRadius:99, height:8, width:`${g.agency}%`, transition:"width 0.4s" }}/>
                </div>
                <div style={{ fontSize:12, color:"#aaa", marginTop:6 }}>{g.completed.filter(Boolean).length} of {g.steps.length} steps done</div>
              </div>
            ))}
            <div style={{ background:GRAD_GOLD, borderRadius:14, padding:16, color:"#fff", textAlign:"center" }}>
              <div style={{ fontSize:22 }}>🔥</div>
              <div style={{ fontSize:16, fontWeight:700, marginTop:4 }}>3-Day Streak!</div>
              <div style={{ fontSize:12, opacity:0.9, marginTop:2 }}>Keep checking in daily to grow your streak</div>
            </div>

            {/* Hope Plan CTA */}
            <button onClick={()=>setShowHopePlan(true)} style={{ width:"100%", marginTop:12, background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)", border:"none", borderRadius:14, padding:"18px 20px", color:"#fff", cursor:"pointer", textAlign:"left", boxShadow:"0 6px 20px rgba(0,0,0,0.28)", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-18, right:-18, width:80, height:80, borderRadius:"50%", background:`${GOLD}18` }}/>
              <div style={{ position:"absolute", bottom:-24, right:40, width:60, height:60, borderRadius:"50%", background:`${BLUE}14` }}/>
              <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative" }}>
                <div style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, borderRadius:12, width:46, height:46, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, boxShadow:`0 4px 12px ${GOLD}44` }}>📋</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                    <div style={{ fontSize:14, fontWeight:800 }}>Get Your Guided Hope Plan</div>
                    {purchasedHopePlan
                      ? <span style={{ fontSize:9, background:GREEN, color:"#fff", borderRadius:99, padding:"2px 7px", fontWeight:800 }}>UNLOCKED</span>
                      : <span style={{ fontSize:9, background:`${GOLD}dd`, color:"#7a5f00", borderRadius:99, padding:"2px 7px", fontWeight:800 }}>£4.99</span>}
                  </div>
                  <div style={{ fontSize:12, opacity:0.75 }}>Turn your progress into a personalised 4-week roadmap</div>
                </div>
              </div>
              <div style={{ fontSize:18, opacity:0.6, position:"relative" }}>›</div>
            </button>
          </div>
        </>
      )}

      {screen==="coaching"&&(
        <>
          <Header title="Psycovery Coaching" bg={GRAD_GOLD}/>
          <div style={{ padding:20 }}>
            <div style={{ background:`${GOLD}18`, borderRadius:16, padding:16, marginBottom:20, borderLeft:`4px solid ${GOLD}` }}>
              <div style={{ fontSize:14, fontWeight:800, color:"#333", display:"flex", alignItems:"center", gap:8 }}><div style={{ width:24, height:24, borderRadius:6, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={18}/></div>Work 1:1 with a Psycovery Coach</div>
              <div style={{ fontSize:13, color:"#555", marginTop:6, lineHeight:1.6 }}>Our specialist coaches are trained in Hope Theory and experienced in forensic settings.</div>
              <div style={{ marginTop:10 }}><PsycoveryLink/></div>
            </div>
            {!booked?(
              <>
                {coachingPlans.map((plan,i)=>(
                  <button key={i} onClick={()=>setSelectedPlan(selectedPlan===i?null:i)} style={{ width:"100%", background:"#fff", border:`2px solid ${selectedPlan===i?plan.color:"#eee"}`, borderRadius:16, padding:16, cursor:"pointer", textAlign:"left", marginBottom:12, boxShadow:selectedPlan===i?`0 4px 16px ${plan.color}33`:"0 2px 8px rgba(0,0,0,0.06)", position:"relative" }}>
                    {plan.highlight&&<div style={{ position:"absolute", top:-10, right:16, background:plan.color, color:"#fff", fontSize:10, fontWeight:800, borderRadius:99, padding:"3px 10px" }}>Most Popular</div>}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ fontSize:28 }}>{plan.icon}</div>
                        <div><div style={{ fontSize:15, fontWeight:800, color:"#333" }}>{plan.name}</div><div style={{ fontSize:11, color:"#888" }}>{plan.per}</div></div>
                      </div>
                      <div style={{ fontSize:22, fontWeight:800, color:plan.color }}>{plan.price}</div>
                    </div>
                    <div style={{ fontSize:13, color:"#555", lineHeight:1.5, marginBottom:10 }}>{plan.desc}</div>
                    {plan.features.map((f,j)=>(
                      <div key={j} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                        <div style={{ width:16, height:16, borderRadius:99, background:plan.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><span style={{ color:"#fff", fontSize:9, fontWeight:800 }}>✓</span></div>
                        <div style={{ fontSize:12, color:"#555" }}>{f}</div>
                      </div>
                    ))}
                  </button>
                ))}
                {selectedPlan!==null&&<button onClick={()=>setBooked(true)} style={{ width:"100%", background:GRAD_GOLD, border:"none", borderRadius:14, padding:16, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>Book {coachingPlans[selectedPlan].name} — {coachingPlans[selectedPlan].price}</button>}
              </>
            ):(
              <div style={{ background:"#fff", borderRadius:16, padding:28, textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:56 }}>🎉</div>
                <div style={{ fontSize:18, fontWeight:800, color:"#333", marginTop:12 }}>Booking Requested!</div>
                <div style={{ fontSize:13, color:"#555", lineHeight:1.6, marginTop:8 }}>A Psycovery coach will be in touch within 24 hours.</div>
                <button onClick={()=>{setBooked(false);setSelectedPlan(null);setScreen("home");}} style={{ marginTop:20, background:GRAD, border:"none", borderRadius:14, padding:"12px 24px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Back to Home</button>
              </div>
            )}
          </div>
        </>
      )}

      {screen==="emergency"&&(
        <>
          <div style={{ background:"linear-gradient(135deg,#c0392b,#e74c3c)", padding:"16px 20px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}><PsycoveryLogo size={22}/></div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.8)" }}>Hope Forward · <span style={{ fontWeight:700 }}>Psycovery</span></div>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>🆘 Emergency Support</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)", marginTop:4, lineHeight:1.5 }}>You are not alone. Free, confidential help is available right now — 24/7.</div>
          </div>
          <div style={{ padding:20 }}>
            {[
              { icon:"🧠", title:"Mental Health & Suicide Crisis", color:"#8E44AD", contacts:[{name:"Samaritans",detail:"Call 116 123 · Free, 24/7",action:"tel:116123"},{name:"Mind Infoline",detail:"0300 123 3393 · Mon–Fri 9am–6pm",action:"tel:03001233393"}] },
              { icon:"🏠", title:"Shelter & Housing Emergency", color:BLUE, contacts:[{name:"Shelter Helpline",detail:"0808 800 4444 · Free",action:"tel:08088004444"}] },
              { icon:"🚨", title:"Domestic Violence", color:ORANGE, contacts:[{name:"National Domestic Abuse Helpline",detail:"0808 2000 247 · Free, 24/7",action:"tel:08082000247"}] },
              { icon:"💊", title:"Substance Use & Relapse", color:GREEN, contacts:[{name:"Frank Drugs Helpline",detail:"0300 123 6600 · Free, 24/7",action:"tel:03001236600"}] },
            ].map((s,i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:16, padding:16, marginBottom:14, borderLeft:`4px solid ${s.color}`, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}><div style={{ fontSize:24 }}>{s.icon}</div><div style={{ fontSize:14, fontWeight:700, color:"#333" }}>{s.title}</div></div>
                {s.contacts.map((c,j)=>(
                  <div key={j} style={{ background:"#f9f9f9", borderRadius:10, padding:"10px 14px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div><div style={{ fontSize:13, fontWeight:700, color:"#333" }}>{c.name}</div><div style={{ fontSize:12, color:"#777", marginTop:2 }}>{c.detail}</div></div>
                    {c.action&&<a href={c.action} style={{ background:s.color, color:"#fff", border:"none", borderRadius:99, padding:"6px 14px", fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", marginLeft:8 }}>Call</a>}
                  </div>
                ))}
              </div>
            ))}
            <div style={{ background:"#fff", borderRadius:14, padding:16, textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:4 }}>In immediate danger?</div>
              <a href="tel:999" style={{ display:"inline-block", background:"linear-gradient(135deg,#c0392b,#e74c3c)", color:"#fff", borderRadius:99, padding:"10px 32px", fontSize:15, fontWeight:800, textDecoration:"none", marginTop:4 }}>📞 Call 999</a>
            </div>
          </div>
        </>
      )}

      {screen!=="emergency"&&(
        <button onClick={()=>setScreen("emergency")} style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", width:"calc(100% - 40px)", maxWidth:350, background:"linear-gradient(135deg,#c0392b,#e74c3c)", border:"none", borderRadius:16, padding:"14px 20px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 6px 20px rgba(192,57,43,0.45)", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:99 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🆘</div>
            <div style={{ textAlign:"left" }}><div style={{ fontSize:14, fontWeight:800 }}>Emergency Support</div><div style={{ fontSize:11, opacity:0.85, fontWeight:400 }}>Free 24/7 crisis help available now</div></div>
          </div>
          <div style={{ fontSize:18, opacity:0.8 }}>›</div>
        </button>
      )}

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:390, background:"#fff", borderTop:"1px solid #f0f0f0", display:"flex", padding:"8px 0" }}>
        {[
          { icon:"🏠", label:"Home", target:"home" },
          { icon:"📖", label:"Library", target:"goalLibrary" },
          { icon:"📍", label:"Services", target:"directory" },
          { icon:"🎯", label:"My Goals", target:"goals" },
          { icon:"📈", label:"Progress", target:"progress" },
        ].map(n=>(
          <button key={n.target} onClick={()=>setScreen(n.target)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", padding:"4px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div style={{ fontSize:18 }}>{n.icon}</div>
            <div style={{ fontSize:9, fontWeight:600, color:screen===n.target?BLUE:"#aaa" }}>{n.label}</div>
            {screen===n.target&&<div style={{ width:4, height:4, borderRadius:99, background:GOLD }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
