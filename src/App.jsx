import { useState, useEffect, useRef, Fragment } from "react";
import PHOTO from "./assets/lakshya.jpg";

/* ------------------------------------------------------------------
   EDIT ME: fill these in and re-publish. Empty values are hidden.
------------------------------------------------------------------- */
const CONFIG = {
  email: "lakshyayaduvanshi28@gmail.com",
  phone: "+91 92580 48164",
  phoneLink: "+919258048164",
  linkedin: "https://www.linkedin.com/in/lakshya-yadav-32a692312/",
  github: "https://github.com/Lakshya0604",
  resume: "https://drive.google.com/file/d/1FWDCfjh27vV2M93CbXZ3k9hyIzpCrcPR/view?usp=sharing",
};


const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cv = (name) => "var(--" + name + ")";

/* ------------------------------ icons ------------------------------ */
const ICONS = {
  screen: (<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>),
  server: (<><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01" /></>),
  db: (<><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>),
  cloud: (<path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a4.25 4.25 0 0 1 0 8.5H7z" />),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>),
  card: (<><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19M6 15h4" /></>),
  bell: (<><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 21h4" /></>),
  pin: (<><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  play: (<><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l6-3.5z" /></>),
  key: (<><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M16 7l3 3" /></>),
  msg: (<path d="M4 5h16v11H9l-5 4z" />),
  branch: (<><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.5 12h4c2 0 2-6 5.5-6M11.5 12c2 0 2 6 5.5 6" /></>),
  spark: (<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />),
  check: (<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></>),
  book: (<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16" /></>),
  box: (<><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>),
};

const Icon = ({ name, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

/* ------------------------------ data ------------------------------ */
const STAGES = [
  {
    name: "Screen", tech: "React", icon: "screen", color: "sky",
    title: "The screen",
    text: "I build the interface people actually touch: role-based dashboards, carts and live order tracking. State lives in Redux Toolkit, styling in Tailwind CSS.",
    out: "dispatch(placeOrder(cart))",
    back: "setOrder(res.data)  // screen updates",
    chips: ["React", "Redux Toolkit", "Tailwind CSS", "Vite", "React Router"],
  },
  {
    name: "Server", tech: "Express", icon: "server", color: "violet",
    title: "The server",
    text: "REST APIs protected with JWT, Google sign-in through Firebase, a gateway that proxies to separate services, and Socket.io for live updates.",
    out: "POST /api/order/place-order  token verified",
    back: "res.status(201).json(order)",
    chips: ["Node.js", "Express", "JWT", "Firebase Auth", "Socket.io", "Microservices"],
  },
  {
    name: "Database", tech: "MongoDB", icon: "db", color: "teal",
    title: "The data",
    text: "Mongoose schemas, populated references between users, shops and orders, and GeoJSON points for delivery locations, hosted on MongoDB Atlas.",
    out: "Order.create({ user, shopOrders, payment })",
    back: "saved, owner populated",
    chips: ["MongoDB Atlas", "Mongoose", "GeoJSON"],
  },
  {
    name: "Outside world", tech: "APIs and AI", icon: "cloud", color: "coral",
    title: "Everything around it",
    text: "Payments with Razorpay and Stripe, media on Cloudinary, deploys on Render, and agent routing with LangChain and LangGraph.",
    out: "razorpay.orders.create({ amount, currency: \"INR\" })",
    back: "signature verified, payment captured",
    chips: ["Razorpay", "Stripe", "Cloudinary", "Render", "LangChain", "LangGraph", "Git"],
  },
];

// a request goes out through the layers, then the response comes back
const SEQ = [[0, "out"], [1, "out"], [2, "out"], [3, "out"], [2, "back"], [1, "back"], [0, "back"]];

const TECH = [
  ["React", "sky"], ["Node.js", "teal"], ["Express", "violet"], ["MongoDB", "teal"], ["Redux Toolkit", "violet"],
  ["Tailwind CSS", "sky"], ["Socket.io", "coral"], ["Razorpay", "sky"], ["Stripe", "violet"], ["Firebase", "gold"],
  ["LangGraph", "pink"], ["LangChain", "coral"], ["Cloudinary", "sky"], ["Render", "teal"], ["Git", "coral"],
];

const PROJECTS = [
  {
    name: "Khana Khajana",
    line: "Food delivery with three kinds of users and live order tracking.",
    status: "Live",
    color: "coral",
    points: [
      "Separate experiences for customers, shop owners and delivery partners, with role-based screens.",
      "Orders move between all three views in real time through Socket.io events.",
      "Online payments with Razorpay (test mode) and image uploads through Cloudinary.",
      "Delivery locations stored as GeoJSON points in MongoDB Atlas.",
    ],
    stack: ["React", "Redux Toolkit", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Socket.io", "Razorpay", "Cloudinary"],
    links: [{ label: "Open the live app", href: "https://khana-khajana-2ijn.onrender.com" }],
    doneText: "That was one order, from the cart to the customer's doorstep.",
    steps: [
      { label: "Places order", sub: "React + Redux", icon: "box", title: "The customer places an order", text: "The cart goes to the API as one request with the items, address and payment choice.", trace: "dispatch(placeOrder(cart))" },
      { label: "Pays online", sub: "Razorpay", icon: "card", title: "Payment is checked on the server", text: "Razorpay runs the checkout in test mode, and my verifyPayment controller confirms it before the order is saved.", trace: "verifyPayment(...)  ok" },
      { label: "Order saved", sub: "Express + MongoDB", icon: "db", title: "The order is stored", text: "The order is saved with one entry per shop, and each shop owner is linked to their part of it.", trace: "Order.create({ user, shopOrders })" },
      { label: "Owner notified", sub: "Socket.io", icon: "bell", title: "The shop owner sees it instantly", text: "A Socket.io event pushes the new order to the owner's dashboard without a refresh.", trace: "socket emit  >  owner dashboard" },
      { label: "Partner accepts", sub: "Delivery partner", icon: "user", title: "A delivery partner accepts", text: "When the partner accepts, an assignmentAccepted event updates every screen that is open.", trace: "socket.on(\"assignmentAccepted\")" },
      { label: "Live tracking", sub: "GeoJSON", icon: "pin", title: "The customer tracks it live", text: "The partner's location is sent as a GeoJSON point and shown to the customer while the order is on its way.", trace: "location: { type: \"Point\", coordinates }" },
    ],
  },
  {
    name: "TechLearn",
    line: "A learning platform where instructors publish courses and students pay to enroll.",
    status: "Deployed",
    color: "violet",
    points: [
      "Three roles (student, instructor, admin) with protected routes in the UI and JWT on the API.",
      "Course payments through Stripe, video and image hosting on Cloudinary.",
      "Deployed on Render, including a Linux-only import fix and clearing large videos out of the Git history.",
      "Built with a teammate, with ER, UML and SRS documents written for the viva.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Stripe", "Cloudinary"],
    links: [],
    doneText: "That was one student, from sign-in to the first lecture.",
    steps: [
      { label: "Signs in", sub: "JWT + roles", icon: "key", title: "Sign in with a role", text: "Students, instructors and admins log in and get a JWT. Protected routes decide what each role can open.", trace: "Authorization: Bearer <token>" },
      { label: "Browses courses", sub: "React", icon: "book", title: "Browse and pick a course", text: "Students look through the published courses and open the one they want.", trace: "fetch courses  >  render catalog" },
      { label: "Pays", sub: "Stripe", icon: "card", title: "Pay with Stripe", text: "Stripe handles the card details, and my server only needs to know whether the payment went through.", trace: "stripe payment  >  confirmed" },
      { label: "Enrolled", sub: "MongoDB", icon: "check", title: "The enrollment is saved", text: "After the payment, the course is added to the student's account in MongoDB.", trace: "save enrollment  >  student account" },
      { label: "Watches lectures", sub: "Cloudinary", icon: "play", title: "Watch the lectures", text: "Lecture videos that instructors uploaded are served from Cloudinary.", trace: "cloudinary video  >  player" },
    ],
  },
  {
    name: "HiveNixAI",
    line: "A multi-agent AI platform split into small, independent services.",
    status: "In development",
    color: "sky",
    points: [
      "An Express gateway proxies requests to separate services, so auth and agents change without touching each other.",
      "The auth service handles Google sign-in through Firebase and issues JWTs.",
      "The agent service routes requests with a LangGraph graph, orchestrated through LangChain.",
      "My final-year project. I post the build progress on LinkedIn as I go.",
    ],
    stack: ["React", "Vite", "Redux", "Node.js", "Express", "MongoDB", "Firebase Auth", "LangChain", "LangGraph"],
    links: [],
    doneText: "That was one message, from Google sign-in to the agent's reply.",
    steps: [
      { label: "Signs in", sub: "Firebase + JWT", icon: "key", title: "Sign in with Google", text: "Firebase handles Google sign-in, and my auth service issues a JWT for the session.", trace: "signInWithPopup(auth, googleprovider)" },
      { label: "Sends a message", sub: "React + Redux", icon: "msg", title: "Send a message", text: "The chat screen sends the message through an axios instance, and Redux keeps the conversation state.", trace: "axios  >  gateway" },
      { label: "Gateway", sub: "express-http-proxy", icon: "branch", title: "The gateway routes it", text: "One entry point forwards each request to the right small service, so every service stays independent.", trace: "gateway  >  agent service" },
      { label: "Router", sub: "LangGraph", icon: "spark", title: "The router picks an agent", text: "A LangGraph graph decides which agent should handle the request.", trace: "graph.invoke(state)" },
      { label: "Agent runs", sub: "LangChain", icon: "server", title: "The agent works on it", text: "The chosen agent runs through LangChain and prepares the answer.", trace: "agent  >  answer" },
      { label: "Reply appears", sub: "Chat UI", icon: "check", title: "The reply comes back", text: "The answer shows up in the chat, and new chats get a name automatically.", trace: "render reply  +  name chat" },
    ],
  },
  {
    name: "Blackcoffer Insights Dashboard",
    line: "Full-stack MERN data visualization dashboard for the Blackcoffer Visualization Dashboard test.",
    status: "Deployed",
    color: "violet",
    points: [
      "Provided JSON dataset stored in MongoDB Atlas with a seed script.",
      "REST API with Express.js handles filtering, pagination, and KPI aggregation.",
      "React + Chart.js frontend with multi-select filters and interactive charts.",
      "Deployed on Vercel (frontend) and Render (backend).",
    ],
    stack: ["React", "Vite", "JavaScript", "CSS", "Chart.js", "react-chartjs-2", "react-select", "Axios", "Node.js", "Express", "MongoDB", "Mongoose"],
    links: [
      { label: "Open live demo", href: "https://blackcoffer-insights-dashboard1-iv8ozka0t-lakshya0604s-projects.vercel.app/" },
      { label: "View repository", href: "https://github.com/Lakshya0604/blackcoffer-insights-dashboard" },
    ],
    doneText: "That was one dataset, from JSON to interactive dashboard.",
    steps: [
      { label: "Seed Data", sub: "MongoDB Atlas", icon: "db", title: "JSON to MongoDB", text: "The provided jsondata.json is imported into MongoDB Atlas using a seed script.", trace: "seed.js  >  MongoDB Atlas" },
      { label: "API Layer", sub: "Node.js + Express", icon: "server", title: "REST API serves data", text: "Express routes handle filtering, aggregation, and KPI calculations from MongoDB.", trace: "GET /api/data?topic=oil&region=Europe" },
      { label: "Dashboard UI", sub: "React + Vite", icon: "screen", title: "React fetches and renders", text: "React fetches filtered data via Axios and renders charts and KPI cards dynamically.", trace: "axios  >  React render" },
      { label: "Charts", sub: "Chart.js", icon: "book", title: "Chart.js visualizations", text: "Chart.js renders interactive bar, line, and pie charts for insights.", trace: "new Chart(ctx, config)" },
      { label: "Filters & KPIs", sub: "react-select", icon: "check", title: "Filters update everything", text: "Multi-select filters update charts and KPI cards in real time.", trace: "filter change  >  re-render" },
    ],
  },
];

const BUGS = [
  { broke: "Order updates showed up twice on the delivery dashboard.", fix: "Socket listeners were being added on every render. Removing them in the useEffect cleanup with socket.off fixed the duplicates.", color: "teal" },
  { broke: "Redux warned about values that can't be serialized.", fix: "I had put the Socket.io instance inside the store. It now lives outside Redux, and the store only keeps plain data.", color: "violet" },
  { broke: "The app ran on Windows and crashed on Render.", fix: "One import had the wrong letter case in ProtectedRoute. Linux file names are case-sensitive, so I now match every path exactly.", color: "coral" },
  { broke: "Git showed about 10,000 changed files.", fix: "There was no .gitignore, so node_modules was tracked. I added one, cleared the Git cache and pushed again.", color: "sky" },
  { broke: "MongoDB Atlas refused to connect from my college network.", fix: "The IP allow-list and DNS were the problem, not the code. Now I check network access first when a connection string fails.", color: "pink" },
];

/* ------------------------------ hooks ------------------------------ */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (!localStorage.getItem("theme")) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handler);
    document.documentElement.setAttribute("data-theme", theme);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);
  const setThemePersist = (t) => {
    localStorage.setItem("theme", t);
    setTheme(t);
  };
  return [theme, setThemePersist];
}

function useTypewriter(text, speed = 14) {
  const [out, setOut] = useState(REDUCE ? text : "");
  useEffect(() => {
    if (REDUCE) { setOut(text); return; }
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return out;
}

/* --------------------------- small pieces --------------------------- */
function Reveal({ as: Tag = "div", delay = 0, className = "", style, children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (REDUCE || !("IntersectionObserver" in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting || e.boundingClientRect.top < 0) { setShown(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} style={{ transitionDelay: delay + "ms", ...style }} className={"reveal " + (shown ? "in " : "") + className}>
      {children}
    </Tag>
  );
}

function MagLink({ href, className = "", external, children }) {
  const ref = useRef(null);
  const move = (e) => {
    if (REDUCE) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a ref={ref} href={href} onMouseMove={move} onMouseLeave={leave} className={"mag " + className} {...extra}>
      {children}
    </a>
  );
}

function Tilt({ className = "", children }) {
  const ref = useRef(null);
  const move = (e) => {
    if (REDUCE) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={"tilt " + className}>{children}</div>;
}

const btnPrimary = "btn-grad px-6 py-3 rounded-full text-white font-display font-semibold text-[15px]";
const btnGhost = "px-6 py-3 rounded-full border border-ink/30 font-display font-semibold text-[15px] hover:border-ink transition-colors";

function Chip({ children }) {
  return <span className="chip">{children}</span>;
}

function Section({ id, children }) {
  return (
    <section id={id} className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-24">
      {children}
    </section>
  );
}

function H2({ children, lead }) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <h2 className="font-display font-extrabold tracking-[-0.03em] leading-[1.02] text-[clamp(2rem,4.6vw,3.4rem)]">{children}</h2>
      <span className="h2bar" />
      {lead && <p className="mt-5 text-lg md:text-xl text-mute max-w-[56ch] leading-relaxed">{lead}</p>}
    </Reveal>
  );
}

/* ------------------------------- nav -------------------------------- */
function Nav({ theme, setTheme, active }) {
  const links = [
    ["projects", "Projects", "Projects"],
    ["debugging", "Debugging", "Bugs"],
    ["about", "About", "About"],
    ["contact", "Contact", "Contact"],
  ];
  return (
    <header className="sticky z-40 border-b border-rule/70 backdrop-blur-md bg-paper/80" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-5 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 font-display font-extrabold text-lg tracking-tight">
          <span className="logo-mark grid place-items-center w-8 h-8 rounded-lg text-white text-base">L</span>
          <span className="hidden sm:inline">Lakshya</span>
        </a>
        <nav className="flex items-center gap-3.5 sm:gap-7 text-[14px] sm:text-[15px] font-display font-medium">
          {links.map(([id, long, short]) => (
            <a key={id} href={"#" + id} className={"navlink " + (active === id ? "on" : "")}>
              <span className="hidden sm:inline">{long}</span>
              <span className="sm:hidden">{short}</span>
            </a>
          ))}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="grid place-items-center w-9 h-9 rounded-full border border-rule hover:border-ink transition-colors"
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" /></svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

/* --------------------------- hero: request flow ---------------------- */
function Flow() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(!REDUCE);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setStep((s) => (s + 1) % SEQ.length), 2600);
    return () => clearInterval(id);
  }, [auto]);

  const [idx, dir] = SEQ[step];
  const stage = STAGES[idx];
  const typed = useTypewriter(dir === "out" ? stage.out : stage.back);

  const pick = (i) => {
    setAuto(false);
    setStep(SEQ.findIndex((s) => s[0] === i && s[1] === "out"));
  };

  return (
    <div className="flowcard rounded-2xl border border-rule bg-panel p-5 sm:p-6">
      <div className="relative" style={{ paddingTop: 6 }}>
        <div
          className={"flowline " + (dir === "back" ? "rev" : "")}
          style={{ position: "absolute", left: "12.5%", right: "12.5%", top: 30, height: 2 }}
        />
        <div
          className="flowring"
          style={{ left: ((idx * 2 + 1) / 8) * 100 + "%", top: 30, "--c": cv(stage.color) }}
        />
        <div className="relative grid grid-cols-4">
          {STAGES.map((s, i) => (
            <button
              key={s.name}
              onClick={() => pick(i)}
              aria-pressed={idx === i}
              className="flex flex-col items-center text-center"
              style={{ "--c": cv(s.color) }}
            >
              <span className={"node " + (idx === i ? "on" : "")}>
                <Icon name={s.icon} />
              </span>
              <span className="mt-3 font-display font-semibold text-[13px] sm:text-sm leading-tight">{s.name}</span>
              <span className="text-[12px] sm:text-[13px] text-mute leading-tight mt-0.5">{s.tech}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-rule" style={{ "--c": cv(stage.color) }}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="font-display font-bold text-xl">{stage.title}</h3>
          <span className={"text-[12px] font-display font-semibold px-2.5 py-1 rounded-full whitespace-nowrap " + (dir === "out" ? "bg-gold text-[#1a1200]" : "border border-teal text-teal")}>
            {dir === "out" ? "Request going out" : "Response coming back"}
          </span>
        </div>
        <p className="text-[17px] leading-relaxed text-mute min-h-[5.6rem] sm:min-h-[4.6rem]">{stage.text}</p>

        <div className="mt-4 rounded-lg border border-rule bg-paper px-3.5 py-3 font-mono text-[12.5px] sm:text-[13px] min-h-[46px] overflow-x-auto whitespace-nowrap" aria-hidden="true">
          <span className="mr-2" style={{ color: "rgb(var(--c))" }}>{dir === "out" ? ">" : "<"}</span>
          {typed}
          <span className="caret" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 min-h-[2rem]">
          {stage.chips.map((c) => <Chip key={c}>{c}</Chip>)}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-mute">Tap a layer to stop and read it.</span>
          <button onClick={() => setAuto((a) => !a)} className="font-display font-semibold underline underline-offset-4 decoration-2" style={{ textDecorationColor: "rgb(var(--c))" }}>
            {auto ? "Pause trace" : "Play trace"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const words = "Full-stack, from the button to the database.".split(" ");
  return (
    <section id="top" className="relative z-10 mx-auto max-w-6xl px-5 pt-10 pb-16 md:pt-16 md:pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-14 items-center">
      <div>
        <div className="fadeup flex items-center gap-4 mb-7" style={{ animationDelay: "0.05s" }}>
          <div className="avatar">
            <img src={PHOTO} alt="Portrait of Lakshya" width="88" height="88" />
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-tight">Lakshya</p>
            <p className="text-mute text-[15px] leading-snug">B.Tech CS, graduating 2027</p>
            <p className="mt-1.5 inline-flex items-center gap-2 text-[13px] font-display font-semibold">
              <span className="ping" />Open to internships
            </p>
          </div>
        </div>
        <h1
          className="font-display font-extrabold tracking-[-0.035em] leading-[0.98] text-[clamp(2.6rem,6.4vw,4.9rem)]"
          aria-label="Full-stack, from the button to the database."
        >
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="word" aria-hidden="true"><span style={{ "--i": i }}>{w}</span></span>{" "}
            </Fragment>
          ))}
        </h1>
        <p className="fadeup mt-7 text-xl leading-relaxed max-w-[52ch]" style={{ animationDelay: "0.75s" }}>
          I build MERN apps with real payments, live order tracking and AI agents, and I deploy them. Below, every project shows how its request travels from the screen to the database.
        </p>
        <div className="fadeup mt-9 flex flex-wrap gap-3" style={{ animationDelay: "0.95s" }}>
          <MagLink href="#projects" className={btnPrimary}>See my projects</MagLink>
          <MagLink href={CONFIG.github} external className={btnGhost}>GitHub</MagLink>
          {CONFIG.resume && <MagLink href={CONFIG.resume} external className={btnGhost}>Resume</MagLink>}
        </div>
      </div>
      <div className="fadeup" style={{ animationDelay: "0.6s" }}>
        <Flow />
      </div>
    </section>
  );
}

function Marquee() {
  const row = TECH.map(([t, c], i) => (
    <span key={t + i} className="mq-item"><i style={{ background: "rgb(var(--" + c + "))" }} />{t}</span>
  ));
  return (
    <div className="mq relative z-10" aria-hidden="true">
      <div className="mq-track">{row}{row}</div>
    </div>
  );
}

/* --------------------------- animated workflow ----------------------- */
function Workflow({ steps, color, running, doneText }) {
  const n = steps.length;
  const [i, setI] = useState(REDUCE ? n : 0);
  const [auto, setAuto] = useState(!REDUCE);

  useEffect(() => {
    if (!running) { setI(REDUCE ? n : 0); setAuto(!REDUCE); }
  }, [running]);

  useEffect(() => {
    if (!running || !auto) return;
    const id = setInterval(() => setI((v) => (v >= n ? 0 : v + 1)), 1900);
    return () => clearInterval(id);
  }, [running, auto, n]);

  const finished = i >= n;
  const s = steps[Math.min(i, n - 1)];
  const trace = useTypewriter(finished ? "" : s.trace);

  const pick = (k) => { setAuto(false); setI(k); };
  const toggle = () => {
    if (auto) setAuto(false);
    else { setI(0); setAuto(true); }
  };

  return (
    <div className="wf rounded-2xl border border-rule bg-panel p-5 sm:p-7" style={{ "--c": cv(color) }}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <p className="font-display font-bold text-lg">How it works</p>
        <button onClick={toggle} className="text-sm font-display font-semibold underline underline-offset-4 decoration-2" style={{ textDecorationColor: "rgb(var(--c))" }}>
          {auto ? "Pause" : "Replay"}
        </button>
      </div>

      <ol className="wf-steps">
        {steps.map((st, k) => (
          <li key={st.label} className={"wf-step " + (k < i ? "done " : "") + (k === i ? "active" : "")}>
            <button onClick={() => pick(k)} className="wf-btn" aria-label={"Step " + (k + 1) + ": " + st.label}>
              <span className="wf-node"><Icon name={st.icon} size={22} /></span>
              <span className="wf-text">
                <span className="wf-label">{st.label}</span>
                <span className="wf-sub">{st.sub}</span>
              </span>
            </button>
            {k < n - 1 && <span className="wf-link" aria-hidden="true"><span className="wf-fill" /></span>}
          </li>
        ))}
      </ol>

      <div className="wf-cap">
        {finished ? (
          <p className="font-display font-bold text-xl">{doneText}</p>
        ) : (
          <>
            <p className="font-display font-bold text-xl">{s.title}</p>
            <p className="mt-1.5 text-[17px] leading-relaxed text-mute max-w-[64ch]">{s.text}</p>
            <div className="mt-3.5 rounded-lg border border-rule bg-paper px-3.5 py-2.5 font-mono text-[12.5px] sm:text-[13px] overflow-x-auto whitespace-nowrap" aria-hidden="true">
              <span className="mr-2" style={{ color: "rgb(var(--c))" }}>&gt;</span>
              {trace}
              <span className="caret" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ projects ----------------------------- */
function Project({ p, open, onToggle, i }) {
  const live = p.status !== "In development";
  return (
    <Reveal delay={i * 80} className={"proj border-t border-rule last:border-b " + (open ? "open" : "")} style={{ "--c": cv(p.color) }}>
      <span className="proj-bar" />
      <h3 className="m-0">
        <button onClick={onToggle} aria-expanded={open} className="w-full text-left py-6 md:py-8 pl-5 flex items-start gap-4 group">
          <span className="flex-1 min-w-0">
            <span className="proj-name block font-display font-bold tracking-tight text-[1.7rem] md:text-[2.4rem] leading-tight">{p.name}</span>
            <span className="block mt-2 text-lg text-mute max-w-[58ch] leading-snug">{p.line}</span>
          </span>
          <span className={"pill hidden sm:inline-block mt-2 text-[13px] font-display font-semibold px-3 py-1 rounded-full " + (live ? "" : "pill-dev")}>
            {p.status}
          </span>
          <span className="plusbtn mt-2 grid place-items-center w-9 h-9 rounded-full border border-rule shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14" className="plus-v" />
              <path d="M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>
      <div className={"acc " + (open ? "open" : "")} aria-hidden={!open}>
        <div>
          <div className="pl-5 pb-10 space-y-8">
            <Workflow steps={p.steps} color={p.color} running={open} doneText={p.doneText} />
            <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-12">
              <ul className="space-y-3.5 text-lg leading-relaxed">
                {p.points.map((pt) => (
                  <li key={pt} className="pl-5 relative">
                    <span className="absolute left-0 top-[0.72em] w-2.5 h-[3px] rounded" style={{ background: "rgb(var(--c))" }} />
                    {pt}
                  </li>
                ))}
              </ul>
              <div>
                <p className="font-display font-semibold mb-3">Built with</p>
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((s) => <Chip key={s}>{s}</Chip>)}
                </div>
                {p.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={btnPrimary + " inline-block"}>{l.label}</a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Projects() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="projects">
      <H2 lead="Three full-stack builds. Open one to watch how a request moves through it, step by step.">Projects</H2>
      <div>
        {PROJECTS.map((p, i) => (
          <Project key={p.name} p={p} i={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------ debugging ---------------------------- */
function Debugging() {
  return (
    <Section id="debugging">
      <H2 lead="Most of what I know about deploying and real-time apps came from things that broke first.">Bugs that taught me something</H2>
      <div>
        {BUGS.map((b, i) => (
          <Reveal key={b.broke} delay={i * 60} className="bug grid md:grid-cols-[1fr_1.4fr] gap-2 md:gap-12 py-6 pl-5 border-t border-rule last:border-b" style={{ "--c": cv(b.color) }}>
            <span className="bug-bar" />
            <h3 className="font-display font-semibold text-xl leading-snug">{b.broke}</h3>
            <p className="text-lg text-mute leading-relaxed">{b.fix}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------- about ------------------------------ */
function About() {
  const rows = [
    ["Degree", "B.Tech, Computer Science", "violet"],
    ["College", "Faculty of Engineering and Technology, Agra College", "coral"],
    ["University", "AKTU, Uttar Pradesh", "sky"],
    ["Graduating", "2027", "teal"],
  ];
  return (
    <Section id="about">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16">
        <div>
          <H2>About me</H2>
          <div className="portrait-wrap">
            <span className="portrait-back b1" />
            <span className="portrait-back b2" />
            <Tilt className="relative">
              <img className="portrait" src={PHOTO} alt="Portrait of Lakshya in a dark blazer" width="320" height="320" />
            </Tilt>
            <span className="float-chip" style={{ "--c": cv("sky"), top: "6%", right: "-10px" }}>React</span>
            <span className="float-chip" style={{ "--c": cv("teal"), top: "46%", left: "-14px", animationDelay: "-1.6s" }}>Node.js</span>
            <span className="float-chip" style={{ "--c": cv("coral"), bottom: "8%", right: "-6px", animationDelay: "-3.1s" }}>MongoDB</span>
          </div>
        </div>
        <Reveal>
          <p className="text-xl leading-relaxed max-w-[58ch]">
            I learn by building things that have to work for real users. Most of my time goes into MERN projects, and right now I'm finishing my final-year project while preparing for placements.
          </p>
          <p className="mt-5 text-xl leading-relaxed max-w-[58ch]">
            When something breaks I write down why, which is where the section above came from. I'm also working toward my first open-source contribution, to LibreChat.
          </p>
          <dl className="mt-10 border-t border-rule">
            {rows.map(([k, v, c]) => (
              <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-3.5 border-b border-rule">
                <dt className="font-display font-semibold flex items-center gap-2.5">
                  <i className="dot" style={{ background: "rgb(var(--" + c + "))" }} />{k}
                </dt>
                <dd className="text-mute">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------- contact ----------------------------- */
// EMAILJS SETUP (free: 200 emails/mo):
// 1. Sign up at emailjs.com
// 2. Add a Gmail service
// 3. Create a template with fields: name, email, message
// 4. Replace SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY below
const EMAILJS = {
  serviceId: "service_4hhqj7q",
  templateId: "template_6uk9doh",
  publicKey: "Me6uIEY3t1JRLeVRT",
};
const EMAILJS_ENABLED = EMAILJS.serviceId !== "service_xxxxxx";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const items = [
    CONFIG.email && { label: "Email me", href: "mailto:" + CONFIG.email },
    CONFIG.linkedin && { label: "LinkedIn", href: CONFIG.linkedin, external: true },
    CONFIG.github && { label: "GitHub", href: CONFIG.github, external: true },
  ].filter(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      if (EMAILJS_ENABLED) {
        const templateParams = {
          name: form.name,
          email: form.email,
          title: "Portfolio Contact",
          message: form.message,
        };
        await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, templateParams, EMAILJS.publicKey);
      } else {
        const subject = encodeURIComponent("Portfolio Contact from " + form.name);
        const body = encodeURIComponent("Name: " + form.name + "\nEmail: " + form.email + "\n\n" + form.message);
        window.open("mailto:" + CONFIG.email + "?subject=" + subject + "&body=" + body, "_blank");
      }
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch {
      window.open("mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Portfolio Contact from " + form.name) + "&body=" + encodeURIComponent("Name: " + form.name + "\nEmail: " + form.email + "\n\n" + form.message), "_blank");
    } finally {
      setSending(false);
    }
  };

  return (
    <Section id="contact">
      <Reveal className="gborder">
        <div className="contact-inner rounded-[24px] bg-panel px-6 py-12 md:px-14 md:py-16">
          <h2 className="font-display font-extrabold tracking-[-0.03em] leading-[1.02] text-[clamp(2rem,4.8vw,3.6rem)] max-w-[20ch]">
            Hiring for an internship or a junior full-stack role?
          </h2>
          <p className="mt-5 text-xl text-mute max-w-[50ch] leading-relaxed">
            Send me a message or give me a call. I'm happy to walk you through any of these projects and how I built them.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {items.map((it, k) => (
              <MagLink key={it.label} href={it.href} external={it.external} className={k === 0 ? btnPrimary : btnGhost}>
                {it.label}
              </MagLink>
            ))}
          </div>

          <form onSubmit={submit} className="mt-10 grid gap-3 max-w-[52ch]">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border border-rule bg-paper px-4 py-3 text-[15px] font-body placeholder:text-mute/60 focus:outline-none focus:ring-2 focus:ring-violet/40"
              />
              <input
                type="email"
                required
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border border-rule bg-paper px-4 py-3 text-[15px] font-body placeholder:text-mute/60 focus:outline-none focus:ring-2 focus:ring-violet/40"
              />
            </div>
            <textarea
              required
              rows={4}
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="rounded-lg border border-rule bg-paper px-4 py-3 text-[15px] font-body placeholder:text-mute/60 focus:outline-none focus:ring-2 focus:ring-violet/40 resize-y"
            />
            <div className="flex items-center gap-3 flex-wrap">
              <button type="submit" className={btnPrimary} disabled={sending}>
                {sending ? "Sending..." : "Send via email"}
              </button>
              {sent && <span className="text-teal font-display font-semibold text-[14px]">Message Send</span>}
            </div>
          </form>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-lg">
            {CONFIG.email && <span className="text-mute break-all">{CONFIG.email}</span>}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-4 text-[15px] text-mute">
      <div className="border-t border-rule pt-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <span>Lakshya, 2026</span>
        <div className="flex items-center gap-4">
          <a href={CONFIG.github} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
          </a>
          <a href={CONFIG.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </a>
          <a href={"mailto:" + CONFIG.email} className="hover:text-ink transition-colors" aria-label="Email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
          </a>
        </div>
        <span className="sm:hidden">Written and designed with AI (Claude) for the InAmigos Foundation. Built with React and Tailwind CSS.</span>
      </div>
      <span className="hidden sm:inline mt-4 block text-[13px]">Written and designed with AI (Claude) for the InAmigos Foundation. Built with React and Tailwind CSS.</span>
    </footer>
  );
}

function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 grid place-items-center w-11 h-11 rounded-full border border-rule bg-panel text-mute hover:text-ink hover:border-ink transition-colors shadow-sm"
      aria-label="Scroll to top"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
    </button>
  );
}

/* --------------------------------- app ------------------------------- */
function App() {
  const [theme, setTheme] = useTheme();
  const [active, setActive] = useState("");
  const bar = useRef(null);
  const glow = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (REDUCE) return;
    const move = (e) => {
      if (glow.current) glow.current.style.transform = `translate(${e.clientX - 220}px, ${e.clientY - 220}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const ids = ["projects", "debugging", "about", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const top = document.getElementById("top");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id === "top" ? "" : e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((el) => io.observe(el));
    if (top) io.observe(top);
    return () => io.disconnect();
  }, []);

  return (
    <div className="font-body relative">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div ref={bar} className="progress" style={{ top: "env(safe-area-inset-top, 0px)" }} />
      <div ref={glow} className="glow" />
      <Nav theme={theme} setTheme={setTheme} active={active} />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <Debugging />
        <About />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
