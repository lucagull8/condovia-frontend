import { Link } from 'react-router-dom';
import { SERVIZI_CATALOGO } from '../components/ServiceIcon';
import { useLandingMotion } from '../hooks/useLandingMotion';

const ArrowRight = ({ size = 14, stroke = 2.4 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
);

const styles = `
:root{
  --copper:#b87333;--copper-light:#d4915a;--copper-dark:#8b5520;
  --copper-50:#fbf3ea;--copper-100:#f4e3cf;
  --bg:#fafaf7;--surface:#fff;--ink:#2a2520;--ink-soft:#6b6256;
  --border:#ede6db;--border-strong:#dfd5c4;
  --d1:#332a23;--d2:#1e1815;--d3:#0e0a08;
  --cream:#f5ece0;
  --ease:cubic-bezier(.22,.68,.24,1);
  --sat:env(safe-area-inset-top,0px);
  --sab:env(safe-area-inset-bottom,0px);
  --sal:env(safe-area-inset-left,0px);
  --sar:env(safe-area-inset-right,0px);
}
.landing-root{background:var(--bg);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-size:16px;letter-spacing:-0.011em;font-variant-numeric:lining-nums;text-rendering:optimizeLegibility;overflow-x:hidden;}
.landing-root a{color:var(--copper-dark);text-decoration:none;}
.landing-root a:hover{color:var(--copper);}
.landing-root img{display:block;}
.landing-root h1,.landing-root h2,.landing-root h3,.landing-root h4{font-family:'Fraunces',serif;font-weight:500;letter-spacing:-0.025em;margin:0;font-optical-sizing:auto;font-variation-settings:"SOFT" 0,"WONK" 0;text-wrap:balance;}
.landing-root h1{font-variation-settings:"SOFT" 0,"WONK" 0,"opsz" 144;}
.landing-root h3,.landing-root h4{font-weight:600;font-variation-settings:"SOFT" 0,"WONK" 0,"opsz" 40;}
.landing-root em{font-style:normal;color:var(--copper-dark);}

/* INTRO CURTAIN */
#curtain{position:fixed;inset:0;z-index:200;background:linear-gradient(150deg,var(--d1) 0%,var(--d2) 55%,var(--d3) 100%);display:grid;place-items:center;transition:transform .85s var(--ease), opacity .5s ease .35s;padding-top:var(--sat);}
#curtain .cm{display:flex;flex-direction:column;align-items:center;gap:18px;}
#curtain img{height:38px;animation:cIn .7s var(--ease) both;}
#curtain .bar{width:120px;height:2px;background:rgba(245,236,224,.14);overflow:hidden;border-radius:2px;}
#curtain .bar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,var(--copper),var(--copper-light));transform:translateX(-100%);animation:cBar .8s var(--ease) both;}
@keyframes cIn{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
@keyframes cBar{to{transform:translateX(0)}}
#curtain.lift{transform:translateY(-101%);}
#curtain.gone{opacity:0;pointer-events:none;}

/* REVEAL PRIMITIVES */
[data-rise],[data-item]{opacity:0;transform:translateY(26px);transition:opacity .8s var(--ease), transform .8s var(--ease);}
[data-rise].in,[data-item].in{opacity:1;transform:none;}
@media (prefers-reduced-motion:reduce){[data-rise],[data-item]{opacity:1!important;transform:none!important;transition:none!important;} #curtain{display:none;}}

/* BUTTONS */
.landing-root .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-size:14px;font-weight:600;letter-spacing:-.006em;height:46px;padding:0 22px;border-radius:12px;border:0;cursor:pointer;white-space:nowrap;position:relative;overflow:hidden;transition:transform .22s var(--ease), box-shadow .25s, background .25s, color .2s;text-decoration:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}
.landing-root .btn svg{transition:transform .3s var(--ease);}
.landing-root .btn:hover svg{transform:translateX(4px);}
.landing-root .btn-primary{color:#fff;background:linear-gradient(180deg,#c8843f 0%,#a06525 100%);box-shadow:0 1px 0 rgba(255,255,255,.22) inset,0 -1px 0 rgba(80,40,8,.28) inset,0 0 0 1px rgba(110,62,21,.55),0 10px 26px -10px rgba(184,115,51,.6);}
.landing-root .btn-primary:hover{transform:translateY(-2px);color:#fff;box-shadow:0 1px 0 rgba(255,255,255,.24) inset,0 0 0 1px rgba(110,62,21,.6),0 16px 34px -12px rgba(184,115,51,.7);}
.landing-root .btn-glass{color:rgba(245,236,224,.92);background:rgba(245,236,224,.07);box-shadow:0 0 0 1px rgba(245,236,224,.2) inset;}
.landing-root .btn-glass:hover{background:rgba(245,236,224,.14);color:#fff;transform:translateY(-2px);}
.landing-root .btn-sm{height:38px;padding:0 16px;font-size:13px;border-radius:10px;}
.landing-root .btn-lg{height:56px;padding:0 30px;font-size:15.5px;border-radius:14px;}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:80;transition:background .35s, border-color .35s, backdrop-filter .35s;border-bottom:1px solid transparent;}
.nav.solid{background:rgba(18,14,11,.72);backdrop-filter:saturate(180%) blur(16px);-webkit-backdrop-filter:saturate(180%) blur(16px);border-bottom-color:rgba(245,236,224,.1);}
.nav-in{max-width:1240px;margin:0 auto;padding:calc(16px + var(--sat)) calc(34px + var(--sar)) 16px calc(34px + var(--sal));display:flex;align-items:center;gap:30px;}
.nav-logo{height:28px;}
.nav-links{display:flex;gap:28px;}
.nav-links a{font-size:14px;font-weight:500;color:rgba(245,236,224,.62);position:relative;-webkit-tap-highlight-color:transparent;}
.nav-links a::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:1.5px;background:var(--copper-light);transform:scaleX(0);transform-origin:left;transition:transform .3s var(--ease);}
.nav-links a:hover{color:#fff;}
.nav-links a:hover::after{transform:scaleX(1);}
.nav-sp{flex:1;}
@media (max-width:820px){.nav-links{display:none;}}

/* HERO */
.hero{--mx:70%;--my:16%;position:relative;overflow:hidden;min-height:100svh;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(150deg,var(--d1) 0%,var(--d2) 55%,var(--d3) 100%);color:var(--cream);padding:calc(124px + var(--sat)) calc(34px + var(--sar)) 104px calc(34px + var(--sal));}
.hero .glow-a{position:absolute;width:1100px;height:1100px;left:var(--mx);top:var(--my);transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(212,145,90,.42) 0%,rgba(184,115,51,.11) 38%,transparent 68%);transition:left .5s ease-out, top .5s ease-out;}
.hero .glow-b{position:absolute;width:720px;height:720px;left:-330px;bottom:-420px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(212,145,90,.24) 0%,transparent 66%);}
.hero-in{position:relative;max-width:1140px;margin:0 auto;width:100%;text-align:center;}
.hero h1{font-size:clamp(42px,5.8vw,76px);line-height:1.06;letter-spacing:-.028em;color:#fff;max-width:880px;margin:6px auto 0;font-variation-settings:"SOFT" 0,"WONK" 0,"opsz" 144;}
.hero h1 em{color:var(--copper-light);}
.hero .lede{font-size:17px;line-height:1.62;letter-spacing:-.008em;color:rgba(245,236,224,.72);max-width:620px;margin:24px auto 0;}
.hero-ctas{display:flex;gap:12px;justify-content:center;margin-top:34px;flex-wrap:wrap;}
.hero-meta{display:flex;gap:52px;justify-content:center;flex-wrap:wrap;margin:40px auto 0;padding-top:26px;border-top:1px solid rgba(245,236,224,.12);max-width:760px;}
.hm{display:flex;flex-direction:column;gap:6px;}
.hm .v{font-family:'Fraunces',serif;font-weight:500;font-size:31px;letter-spacing:-.03em;color:#fff;line-height:1;font-variation-settings:"SOFT" 0,"WONK" 0,"opsz" 72;font-variant-numeric:lining-nums tabular-nums;}
.hm .l{font-size:11px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:rgba(245,236,224,.5);}
.scroll-cue{position:absolute;left:50%;bottom:calc(26px + var(--sab));transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(245,236,224,.4);font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;}
.scroll-cue i{display:block;width:1px;height:28px;background:linear-gradient(180deg,rgba(212,145,90,.9),transparent);animation:cue 2s ease-in-out infinite;}
@keyframes cue{0%,100%{opacity:.25;transform:scaleY(.5);transform-origin:top}50%{opacity:1;transform:scaleY(1)}}

/* MARQUEE */
.mq{overflow:hidden;background:var(--surface);border-block:1px solid var(--border);padding:16px 0;}
.mq-track{display:flex;gap:44px;width:max-content;animation:slide 42s linear infinite;}
.mq:hover .mq-track{animation-play-state:paused;}
@keyframes slide{to{transform:translateX(-50%)}}
.mq-item{display:flex;align-items:center;gap:12px;font-size:13px;font-weight:500;letter-spacing:.005em;color:var(--ink-soft);white-space:nowrap;}
.mq-item::before{content:"";width:5px;height:5px;border-radius:999px;background:var(--copper);opacity:.6;}
@media (prefers-reduced-motion:reduce){.mq-track{animation:none}}

/* SECTIONS */
.band{max-width:1240px;margin:0 auto;padding:110px calc(34px + var(--sar)) 0 calc(34px + var(--sal));}
.sec-label{display:flex;align-items:center;gap:16px;font-size:11.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--copper-dark);margin-bottom:26px;}
.sec-label::after{content:"";flex:1;height:1px;background:var(--border-strong);}
.sec-head h2{font-size:clamp(32px,3.9vw,50px);line-height:1.08;letter-spacing:-.026em;max-width:780px;}
.sec-head p{font-size:16px;line-height:1.68;letter-spacing:-.008em;color:var(--ink-soft);max-width:620px;margin-top:18px;}

/* CARDS */
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:46px;}
@media (max-width:900px){.cards{grid-template-columns:1fr}}
.card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:30px 28px;display:flex;flex-direction:column;gap:15px;position:relative;overflow:hidden;transition:transform .35s var(--ease), border-color .3s, box-shadow .35s;}
.card::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .4s;background:radial-gradient(ellipse 70% 60% at 80% 0%,rgba(184,115,51,.1),transparent 70%);}
.card:hover{transform:translateY(-6px);border-color:var(--copper-100);box-shadow:0 26px 50px -30px rgba(42,37,32,.35);}
.card:hover::after{opacity:1;}
.card-top{display:flex;align-items:center;justify-content:space-between;gap:14px;}
.card-ic{width:54px;height:54px;border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.6),0 1px 2px rgba(42,37,32,.05);transition:transform .4s var(--ease);}
.card:hover .card-ic{transform:scale(1.07) rotate(-3deg);}
.card-num{font-family:'Fraunces',serif;font-weight:500;font-size:30px;line-height:1;color:var(--copper-100);font-variant-numeric:lining-nums tabular-nums;font-variation-settings:"SOFT" 0,"WONK" 0,"opsz" 72;}
.card h3{font-size:21px;line-height:1.26;letter-spacing:-.018em;}
.card p{font-size:14.5px;line-height:1.68;letter-spacing:-.006em;color:var(--ink-soft);margin:0;}

/* STICKY PROCESS */
.proc{display:grid;grid-template-columns:0.85fr 1.15fr;gap:60px;margin-top:46px;align-items:start;}
@media (max-width:960px){.proc{grid-template-columns:1fr;gap:34px}}
.proc-stick{position:sticky;top:120px;}
.proc-stick p{font-size:15.5px;line-height:1.68;letter-spacing:-.007em;color:var(--ink-soft);margin-top:18px;}
.psteps{display:flex;flex-direction:column;gap:16px;}
.pstep{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:30px;display:flex;gap:22px;align-items:flex-start;transition:border-color .4s, box-shadow .4s, transform .4s var(--ease), background .4s;}
.pstep .n{width:44px;height:44px;flex:0 0 auto;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:var(--copper-dark);background:var(--copper-50);box-shadow:0 0 0 1px var(--copper-100) inset;transition:color .4s, background .4s, box-shadow .4s, transform .4s var(--ease);}
.pstep h4{font-size:21px;line-height:1.26;letter-spacing:-.018em;}
.pstep p{font-size:14.5px;line-height:1.68;letter-spacing:-.006em;color:var(--ink-soft);margin:8px 0 0;}
.pstep.active{border-color:var(--copper-100);transform:translateX(6px);box-shadow:0 22px 46px -30px rgba(184,115,51,.5);}
.pstep.active .n{color:#fff;background:linear-gradient(180deg,#c8843f,#a06525);box-shadow:0 1px 0 rgba(255,255,255,.3) inset,0 10px 20px -10px rgba(184,115,51,.7);transform:scale(1.06);}

/* SERVICES */
.grid-svc{display:grid;grid-template-columns:repeat(5,1fr);gap:30px 14px;margin-top:46px;}
@media (max-width:980px){.grid-svc{grid-template-columns:repeat(4,1fr)}}
@media (max-width:620px){.grid-svc{grid-template-columns:repeat(3,1fr)}}
.tile{display:flex;flex-direction:column;align-items:center;gap:12px;padding:12px 4px;border-radius:16px;cursor:default;transition:background .25s, transform .3s var(--ease);-webkit-tap-highlight-color:transparent;touch-action:manipulation;}
.tile:hover{background:rgba(184,115,51,.06);transform:translateY(-4px);}
.tile-ic{width:54px;height:54px;border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.6),0 1px 2px rgba(42,37,32,.05);transition:transform .35s var(--ease), box-shadow .3s;}
.tile:hover .tile-ic{transform:scale(1.09);box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),0 12px 22px -12px rgba(42,37,32,.4);}
.tile .lb{font-size:12px;font-weight:500;letter-spacing:-.004em;line-height:1.4;text-align:center;max-width:108px;}

/* WALLET */
.wallet-wrap{max-width:1240px;margin:110px auto 0;padding:0 calc(34px + var(--sar)) 0 calc(34px + var(--sal));}
.wallet{position:relative;overflow:hidden;border-radius:28px;padding:66px 56px;color:var(--cream);background:linear-gradient(150deg,var(--d1) 0%,var(--d2) 56%,var(--d3) 100%);display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;}
@media (max-width:900px){.wallet{grid-template-columns:1fr;padding:46px 30px;gap:36px}}
.wallet::before{content:"";position:absolute;width:760px;height:760px;right:-300px;top:-430px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(212,145,90,.44) 0%,rgba(184,115,51,.12) 40%,transparent 68%);}
.wallet::after{content:"";position:absolute;width:520px;height:520px;left:-240px;bottom:-330px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(212,145,90,.28) 0%,transparent 66%);}
.wallet > *{position:relative;}
.wl .sec-label{color:var(--copper-light);}
.wl .sec-label::after{background:rgba(245,236,224,.16);}
.wallet h2{font-size:clamp(29px,3.4vw,43px);line-height:1.1;letter-spacing:-.026em;color:#fff;}
.wallet h2 em{color:var(--copper-light);}
.wallet p{font-size:15.5px;line-height:1.68;letter-spacing:-.007em;color:rgba(245,236,224,.7);margin:20px 0 0;max-width:460px;}
.wcard{background:rgba(245,236,224,.05);border:1px solid rgba(245,236,224,.14);border-radius:22px;padding:30px 28px;backdrop-filter:blur(6px);}
.wcard .wh{display:flex;align-items:center;gap:12px;font-size:10.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(245,236,224,.5);}
.wcard .wic{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;background:radial-gradient(120% 120% at 30% 20%,#f3c594,#b87333 58%,#6e3e15);box-shadow:0 1px 0 rgba(255,255,255,.3) inset;}
.wlist{list-style:none;margin:26px 0 0;padding:0;display:flex;flex-direction:column;gap:20px;}
.wlist li{display:flex;gap:16px;align-items:flex-start;}
.wn{width:28px;height:28px;flex:0 0 auto;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:700;color:var(--copper-light);background:rgba(184,115,51,.2);box-shadow:0 0 0 1px rgba(212,145,90,.34) inset;}
.wlist b{display:block;font-size:15px;font-weight:600;color:#fff;}
.wlist p{font-size:13.5px;line-height:1.55;color:rgba(245,236,224,.6);margin:5px 0 0;max-width:none;}

/* PARTNERS */
.pstrip{margin-top:46px;overflow:hidden;}
.p-track{display:flex;gap:16px;width:max-content;animation:slide 34s linear infinite;}
.pstrip:hover .p-track{animation-play-state:paused;}
@media (prefers-reduced-motion:reduce){.p-track{animation:none}}
.pcard{background:var(--surface);border:1px solid var(--border);border-radius:16px;width:190px;height:86px;padding:14px 20px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex:0 0 auto;transition:transform .3s var(--ease), box-shadow .3s, border-color .3s;-webkit-tap-highlight-color:transparent;}
.pcard:hover{transform:translateY(-4px);border-color:var(--border-strong);box-shadow:0 18px 34px -22px rgba(42,37,32,.3);}
.pcard img{max-width:100%;object-fit:contain;}
.pcard img.baiocco{max-height:46px;}
.pcard img.elti,.pcard img.domova{max-height:26px;}
.pcard.plate{padding:0;background:#2b2f86;border-color:transparent;}
.pcard.plate img{width:100%;height:100%;object-fit:cover;}

/* CTA */
.cta-wrap{max-width:1240px;margin:110px auto 0;padding:0 calc(34px + var(--sar)) 0 calc(34px + var(--sal));}
.cta{position:relative;overflow:hidden;border-radius:28px;padding:66px 52px 48px;color:var(--cream);background:linear-gradient(150deg,var(--d1) 0%,var(--d2) 58%,var(--d3) 100%);}
.cta::before{content:"";position:absolute;width:760px;height:760px;left:-330px;bottom:-450px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(212,145,90,.42) 0%,rgba(184,115,51,.12) 40%,transparent 70%);}
.cta::after{content:"";position:absolute;width:560px;height:560px;right:-240px;top:-330px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(212,145,90,.3) 0%,transparent 68%);}
.cta > *{position:relative;}
.cta-row{display:flex;align-items:center;justify-content:space-between;gap:44px;flex-wrap:wrap;}
.cta h2{font-size:clamp(29px,3.4vw,43px);line-height:1.1;letter-spacing:-.026em;color:#fff;max-width:660px;}
.cta h2 em{color:var(--copper-light);}
.cta .sub{font-size:15.5px;line-height:1.68;letter-spacing:-.007em;color:rgba(245,236,224,.66);margin-top:18px;max-width:560px;}
.cta-btns{display:flex;gap:12px;flex-wrap:wrap;}
.bo-row{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-top:40px;padding:20px 24px;border-radius:16px;background:rgba(245,236,224,.05);border:1px solid rgba(245,236,224,.13);}
.bo-t{display:flex;align-items:center;gap:14px;}
.bo-ic{width:40px;height:40px;border-radius:12px;flex:0 0 auto;background:rgba(184,115,51,.2);border:1px solid rgba(212,145,90,.34);color:var(--copper-light);display:flex;align-items:center;justify-content:center;}
.bo-t .l{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,236,224,.45);}
.bo-t .v{font-size:15px;font-weight:600;color:#fff;margin-top:3px;}
.contacts{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:34px;padding-top:34px;border-top:1px solid rgba(245,236,224,.14);}
@media (max-width:760px){.contacts{grid-template-columns:1fr}}
.contact{display:flex;align-items:center;gap:15px;}
.contact-ic{width:44px;height:44px;border-radius:13px;flex:0 0 auto;background:rgba(184,115,51,.2);border:1px solid rgba(212,145,90,.34);color:var(--copper-light);display:flex;align-items:center;justify-content:center;transition:background .3s, transform .3s var(--ease);}
.contact:hover .contact-ic{background:rgba(184,115,51,.34);transform:translateY(-3px);}
.contact .l{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,236,224,.45);}
.contact .v{font-size:15px;font-weight:600;color:#fff;margin-top:3px;}
.contact .v a{color:#fff;}
.contact .v a:hover{color:var(--copper-light);}

/* FOOTER */
.foot{max-width:1240px;margin:0 auto;padding:52px calc(34px + var(--sar)) calc(64px + var(--sab)) calc(34px + var(--sal));display:flex;align-items:flex-start;justify-content:space-between;gap:28px;flex-wrap:wrap;}
.foot > div:first-child{min-width:0;}
.foot-logo{height:26px;opacity:.9;}
.foot-legal{font-size:12px;line-height:1.7;letter-spacing:-.003em;color:var(--ink-soft);max-width:680px;margin-top:14px;}
.foot-links{display:flex;gap:22px;font-size:12.5px;}
.foot-links a{color:var(--ink-soft);}
.foot-links a:hover{color:var(--copper-dark);}

/* Standalone (PWA) */
@media (display-mode:standalone),(display-mode:minimal-ui){
  .nav{background:rgba(18,14,11,.86);backdrop-filter:saturate(180%) blur(16px);-webkit-backdrop-filter:saturate(180%) blur(16px);border-bottom-color:rgba(245,236,224,.1);}
  .hero{padding-top:calc(96px + var(--sat));}
}

/* MOBILE */
@media (max-width:560px){
  .nav-in{padding:calc(12px + var(--sat)) calc(18px + var(--sar)) 12px calc(18px + var(--sal));gap:10px;}
  .nav-logo{height:24px;}
  .landing-root .btn-sm{height:36px;padding:0 13px;font-size:12.5px;}
  .nav .btn-glass.btn-sm{padding:0 12px;}
  .hero{padding:calc(104px + var(--sat)) calc(20px + var(--sar)) 88px calc(20px + var(--sal));min-height:auto;}
  .hero h1{font-size:clamp(34px,9.4vw,44px);line-height:1.1;letter-spacing:-.022em;margin-top:0;}
  .hero .lede{font-size:15.5px;line-height:1.6;margin-top:18px;}
  .hero-ctas{margin-top:28px;gap:10px;flex-direction:column;align-items:stretch;}
  .hero-ctas .btn{width:100%;}
  .landing-root .btn-lg{height:52px;padding:0 22px;font-size:14.5px;}
  .hero-meta{gap:0;margin-top:34px;padding-top:22px;display:grid;grid-template-columns:1fr 1fr;}
  .hm{align-items:center;text-align:center;}
  .hm .v{font-size:27px;}
  .hm .l{font-size:9.5px;letter-spacing:.1em;}
  .scroll-cue{display:none;}
  .hero .glow-a{width:640px;height:640px;}
  .hero .glow-b{width:420px;height:420px;left:-200px;bottom:-260px;}
  .mq{padding:13px 0;}.mq-track{gap:26px;}.mq-item{font-size:12px;}
  .band{padding:72px calc(20px + var(--sar)) 0 calc(20px + var(--sal));}
  .sec-label{font-size:10.5px;letter-spacing:.14em;margin-bottom:20px;gap:12px;}
  .sec-head h2{font-size:clamp(28px,7.6vw,34px);line-height:1.14;}
  .sec-head p{font-size:15px;margin-top:14px;}
  .cards{gap:14px;margin-top:32px;}
  .card{padding:24px 22px;border-radius:18px;gap:12px;}
  .card-ic{width:48px;height:48px;border-radius:14px;}
  .card-num{font-size:26px;}
  .card h3{font-size:19.5px;}.card p{font-size:14px;}
  .proc{margin-top:32px;gap:26px;}
  .proc-stick{position:static;}
  .proc-stick h2{font-size:clamp(28px,7.6vw,34px)!important;line-height:1.14!important;}
  .proc-stick p{font-size:15px;margin-top:14px;}
  .psteps{gap:12px;}
  .pstep{padding:22px 20px;gap:16px;border-radius:18px;}
  .pstep .n{width:38px;height:38px;font-size:14px;}
  .pstep h4{font-size:19.5px;}.pstep p{font-size:14px;}
  .pstep.active{transform:none;}
  .grid-svc{grid-template-columns:repeat(3,1fr);gap:22px 8px;margin-top:32px;}
  .tile{padding:8px 2px;gap:9px;}
  .tile-ic{width:48px;height:48px;border-radius:14px;}
  .tile .lb{font-size:10.5px;max-width:92px;line-height:1.32;}
  .wallet-wrap,.cta-wrap{margin-top:72px;padding:0 calc(20px + var(--sar)) 0 calc(20px + var(--sal));}
  .wallet{padding:38px 22px;border-radius:22px;gap:28px;}
  .wallet h2{font-size:clamp(26px,7vw,32px);line-height:1.14;}
  .wallet p{font-size:15px;margin-top:16px;}
  .wallet .btn{width:100%;}
  .wallet .wl-ctas{flex-direction:column;margin-top:26px;}
  .wcard{padding:24px 20px;border-radius:18px;}
  .wlist{gap:16px;margin-top:22px;}
  .wlist b{font-size:14.5px;}.wlist p{font-size:13px;}
  .pstrip{margin-top:32px;}
  .pcard{width:158px;height:76px;padding:12px 16px;}
  .pcard img.baiocco{max-height:40px;}
  .pcard img.elti,.pcard img.domova{max-height:23px;}
  .cta{padding:38px 22px 32px;border-radius:22px;}
  .cta-row{gap:26px;}
  .cta h2{font-size:clamp(26px,7vw,32px);line-height:1.14;}
  .cta .sub{font-size:15px;margin-top:14px;}
  .cta-btns{width:100%;flex-direction:column;}
  .cta-btns .btn{width:100%;}
  .bo-row{margin-top:28px;padding:18px;gap:16px;align-items:flex-start;flex-direction:column;}
  .bo-row .btn{width:100%;}
  .contacts{margin-top:28px;padding-top:26px;gap:18px;}
  .foot{padding:40px calc(20px + var(--sar)) calc(52px + var(--sab)) calc(20px + var(--sal));gap:22px;}
  .foot-legal{font-size:11.5px;}
  .foot-links{gap:16px;flex-wrap:wrap;}
  #curtain img{height:30px;}
}
@media (max-width:380px){
  .grid-svc{grid-template-columns:repeat(2,1fr);}
  .hero h1{font-size:32px;}
}
@media (display-mode:standalone) and (max-width:560px){
  .hero{padding-top:calc(84px + var(--sat));}
}
`;

// 3 card "Cosa trovi nel marketplace" — icone e testi verbatim dal design v3
const CARDS = [
  {
    bg: '#f6e6d3', fg: '#a05f26', path: 'M12 2.4 4.4 5.3v6.2c0 5 3.2 8.6 7.6 10.2 4.4-1.6 7.6-5.2 7.6-10.2V5.3Z M10.6 15.9 6.9 12.2l1.9-1.9 1.8 1.8 4.6-4.6 1.9 1.9Z',
    n: '01', h: 'Network qualificato',
    p: 'Fornitori e imprese certificate per ogni intervento, con documentazione verificata: SOA, DURC e visure sempre aggiornate.',
  },
  {
    bg: '#e8eee5', fg: '#4a6349', path: 'M12 2.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Zm0 2.4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z M12 12.6c-4.1 0-7.4 2.5-7.4 5.6v3.2h14.8v-3.2c0-3.1-3.3-5.6-7.4-5.6Zm0 2.4c2.8 0 5 1.5 5 3.2v.8H7v-.8c0-1.7 2.2-3.2 5-3.2Z',
    n: '02', h: 'Un unico interlocutore',
    p: "Un referente Condovia ti segue dalla richiesta all'affidamento: niente più telefonate a vuoto e fornitori da rincorrere.",
  },
  {
    bg: '#efe6d7', fg: '#7d5c31', path: 'M6.4 2.8a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm0 2.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z M17.6 14a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm0 2.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z M5.3 11.2h2.2v6.3h6.9v2.2H5.3Z M16.5 12.8V6.5H9.6V4.3h9.1v8.5Z',
    n: '03', h: 'Rete & compravendita',
    p: 'Opportunità di acquisto o fornitura di prestazioni specializzate tra studi, imprese e professionisti della rete Condovia.',
  },
];

const STEPS = [
  { n: 1, h: 'Iscriviti alla piattaforma', p: "Registri il tuo studio e i condomini che amministri. L'accesso è gratuito e l'attivazione avviene in giornata." },
  { n: 2, h: 'Scegli il condominio', p: 'Selezioni lo stabile interessato e il servizio di cui ha bisogno, dalla lista delle categorie disponibili.' },
  { n: 3, h: 'Richiedi il servizio', p: 'Al resto ci pensa Condovia: individuiamo il fornitore giusto per quell\'intervento e ti ricontattiamo entro 24 ore.' },
];

const NUM_SERVIZI = SERVIZI_CATALOGO.length;

export default function Landing() {
  useLandingMotion();

  const marqueeItems = [...SERVIZI_CATALOGO, ...SERVIZI_CATALOGO]; // doppia lista per il loop

  const partnerList = [
    { src: '/partners/baiocco.png', alt: 'Baiocco Holding', cls: 'baiocco', card: '' },
    { src: '/partners/elti.png',    alt: 'E.L.T.I.',        cls: 'elti',    card: '' },
    { src: '/partners/hexa.png',    alt: 'Gruppo Hexa',     cls: '',        card: 'plate' },
    { src: '/partners/domova.png',  alt: 'Domova Gestioni', cls: 'domova',  card: '' },
  ];
  const partnersRepeated = [...partnerList, ...partnerList, ...partnerList];

  return (
    <div className="landing-root">
      <style>{styles}</style>

      <div id="curtain">
        <div className="cm">
          <img src="/brand/condovia-logo-white.png" alt="Condovia" />
          <div className="bar"><i /></div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-in">
          <img className="nav-logo" src="/brand/condovia-logo-white.png" alt="Condovia" />
          <div className="nav-links">
            <a href="#servizi">Servizi</a>
            <a href="#come-funziona">Come funziona</a>
            <a href="#wallet">Wallet</a>
            <a href="#partner">Partner</a>
          </div>
          <div className="nav-sp" />
          <Link className="btn btn-glass btn-sm" to="/login">Accedi</Link>
          <Link className="btn btn-primary btn-sm" to="/registrati">Iscriviti<ArrowRight /></Link>
        </div>
      </nav>

      <header className="hero">
        <div className="glow-a" /><div className="glow-b" />
        <div className="hero-in">
          <h1 data-rise>Ogni intervento del condominio, <em>in un unico posto.</em></h1>
          <p className="lede" data-rise>La prima rete digitale per la compravendita di servizi e interventi per il condominio. Fornitori certificati e imprese qualificate per ogni stabile che gestisci.</p>
          <div className="hero-ctas" data-rise>
            <Link className="btn btn-primary btn-lg" to="/registrati">Iscriviti alla piattaforma<ArrowRight size={16} stroke={2.2} /></Link>
            <a className="btn btn-glass btn-lg" href="#come-funziona">Scopri come funziona</a>
          </div>
          <div className="hero-meta" data-rise>
            <div className="hm"><span className="v" data-to={NUM_SERVIZI}>0</span><span className="l">Categorie di servizio</span></div>
            <div className="hm"><span className="v" data-to="24" data-suf="h">0</span><span className="l">Tempo di risposta</span></div>
          </div>
        </div>
        <div className="scroll-cue"><span>Scorri</span><i /></div>
      </header>

      <div className="mq">
        <div className="mq-track">
          {marqueeItems.map((s, i) => <span key={i} className="mq-item">{s.label}</span>)}
        </div>
      </div>

      <section className="band">
        <div className="sec-label" data-rise>Cosa trovi nel marketplace</div>
        <div className="sec-head">
          <h2 data-rise>Una rete costruita <em>sul lavoro dell'amministratore.</em></h2>
          <p data-rise>Niente strumenti generalisti: ogni funzione nasce da un problema concreto della gestione condominiale quotidiana.</p>
        </div>
        <div className="cards" data-stagger>
          {CARDS.map((c, i) => (
            <article key={i} className="card" data-item>
              <div className="card-top">
                <div className="card-ic" style={{ background: c.bg, color: c.fg }}>
                  <svg width="27" height="27" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d={c.path} /></svg>
                </div>
                <div className="card-num">{c.n}</div>
              </div>
              <h3>{c.h}</h3>
              <p>{c.p}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band" id="come-funziona">
        <div className="sec-label" data-rise>Come funziona</div>
        <div className="proc">
          <div className="proc-stick">
            <h2 data-rise style={{ fontSize: 'clamp(32px,3.8vw,50px)', lineHeight: 1.05 }}>Tre passaggi, <em>poi ci pensiamo noi.</em></h2>
            <p data-rise>Dall'iscrizione al fornitore in cantiere non serve altro: nessun preventivo da inseguire, nessuna trattativa da gestire in autonomia.</p>
          </div>
          <div className="psteps">
            {STEPS.map((s, i) => (
              <div key={s.n} className={'pstep' + (i === 0 ? ' active' : '')} data-rise>
                <div className="n">{s.n}</div>
                <div><h4>{s.h}</h4><p>{s.p}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band" id="servizi">
        <div className="sec-label" data-rise>Categorie disponibili</div>
        <div className="sec-head">
          <h2 data-rise>Dieci servizi, <em>un solo accesso.</em></h2>
          <p data-rise>Dalle forniture energetiche alla sicurezza, dalla manutenzione degli impianti agli adempimenti normativi.</p>
        </div>
        <div className="grid-svc" data-stagger>
          {SERVIZI_CATALOGO.map(s => (
            <div key={s.id} className="tile" data-item>
              <div className="tile-ic" style={{ background: s.tint }}>
                <svg width="27" height="27" viewBox="0 0 24 24"><path d={s.path} fill={s.fg} fillRule="evenodd" /></svg>
              </div>
              <div className="lb">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="wallet-wrap" id="wallet">
        <div className="wallet" data-rise>
          <div className="wl">
            <div className="sec-label">Wallet Condovia</div>
            <h2>Controlla il tuo <em>cashback</em> e richiedi la monetizzazione.</h2>
            <p>Ogni servizio attivo genera uno storno che si accumula nel tuo wallet. Consulti il saldo in tempo reale, verifichi i movimenti condominio per condominio e richiedi la liquidazione quando vuoi.</p>
            <div className="wl-ctas" style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" to="/login">Apri il wallet<ArrowRight size={15} /></Link>
              <a className="btn btn-glass" href="#come-funziona">Vedi i passaggi</a>
            </div>
          </div>
          <div className="wcard">
            <div className="wh">
              <div className="wic">
                <svg width="17" height="17" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M3 5.6h14.4a2 2 0 0 1 2 2v1.2H21a1 1 0 0 1 1 1v4.4a1 1 0 0 1-1 1h-1.6v1.2a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1V6.6a1 1 0 0 1 1-1Z M16.6 10.6a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" /></svg>
              </div>
              Come funziona lo storno
            </div>
            <ul className="wlist">
              <li><span className="wn">1</span><div><b>Attivi un servizio</b><p>Il contratto passa dalla piattaforma e resta nel pannello del tuo studio.</p></div></li>
              <li><span className="wn">2</span><div><b>Lo storno si accumula</b><p>Una quota di ogni transazione torna nel tuo wallet, condominio per condominio.</p></div></li>
              <li><span className="wn">3</span><div><b>Richiedi la liquidazione</b><p>Quando vuoi: il team ti contatta per la fatturazione entro 24 ore.</p></div></li>
            </ul>
          </div>
        </div>
      </div>

      <section className="band" id="partner">
        <div className="sec-label" data-rise>Partner</div>
        <div className="sec-head"><h2 data-rise>Le imprese che <em>lavorano con noi.</em></h2></div>
        <div className="pstrip" data-rise>
          <div className="p-track">
            {partnersRepeated.map((p, i) => (
              <div key={i} className={'pcard ' + p.card}>
                <img className={p.cls} src={p.src} alt={p.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-wrap" id="accedi">
        <div className="cta" data-rise>
          <div className="cta-row">
            <div>
              <h2>Entra nella rete Condovia, <em>è gratuito per gli amministratori.</em></h2>
              <p className="sub">Attivazione in giornata, nessun costo fisso: accedi al marketplace e richiedi il primo servizio.</p>
            </div>
            <div className="cta-btns">
              <Link className="btn btn-primary btn-lg" to="/registrati">Iscriviti ora<ArrowRight size={16} /></Link>
              <Link className="btn btn-glass btn-lg" to="/login">Hai già un account? Accedi</Link>
            </div>
          </div>
          <div className="bo-row">
            <div className="bo-t">
              <div className="bo-ic">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3M7 9h6M7 13h4"/></svg>
              </div>
              <div><div className="l">Area riservata</div><div className="v">Sei un commerciale Condovia?</div></div>
            </div>
            <Link className="btn btn-glass" to="/backoffice/login">Accedi come backoffice<ArrowRight size={15} /></Link>
          </div>
          <div className="contacts">
            <div className="contact">
              <div className="contact-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/></svg></div>
              <div><div className="l">Sito</div><div className="v">condovia.it</div></div>
            </div>
            <div className="contact">
              <div className="contact-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6.5L21 7"/></svg></div>
              <div><div className="l">E-mail</div><div className="v"><a href="mailto:condovia26@gmail.com">condovia26@gmail.com</a></div></div>
            </div>
            <div className="contact">
              <div className="contact-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.6"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M10 21v-3h4v3"/></svg></div>
              <div><div className="l">Sede legale</div><div className="v">Via Ugo Ojetti 171, Roma</div></div>
            </div>
          </div>
        </div>
      </div>

      <footer className="foot">
        <div>
          <img className="foot-logo" src="/brand/condovia-light.png" alt="Condovia" />
          <div className="foot-legal">CONDOVIA S.r.l.s. · Via Ugo Ojetti 171, 00137 Roma (RM) · P.IVA e C.F. 18645191000 · REA RM-1797707 · PEC condoviasrls@legalmail.it</div>
        </div>
        <div className="foot-links">
          <a href="#partner">Partner</a>
          <a href="#accedi">Contatti</a>
        </div>
      </footer>
    </div>
  );
}
