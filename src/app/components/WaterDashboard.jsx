import { useState, useEffect, useRef, useCallback } from "react";

// ─── PROJECT DATA REGISTRY ────────────────────────────────────────────────────
import PhaseecharoenFlowMapOverlay from "./basinmanage/phaseecharoen";
import PathumthaniFlowMapOverlay from "./basinmanage/pathumthani";
import * as phaseecharoen from "./phaseecharoen";
import * as angthong from "./angthong";
import * as pathumthani from "./pathumthani";

const PROJECTS = [
  { key: "phaseecharoen", meta: phaseecharoen.PROJECT_META, data: phaseecharoen },
  { key: "angthong",      meta: angthong.PROJECT_META,      data: angthong },
  { key: "pathumthani",   meta: pathumthani.PROJECT_META,   data: pathumthani },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const HOURS       = Array.from({ length: 24 }, (_, i) => i);
const CHART_COLORS = ["#1d4ed8","#047857","#b45309","#b91c1c","#6d28d9","#0e7490"];
const STATUS_CONFIG = {
  ok:     { color:"#047857", bg:"#ecfdf5", border:"#6ee7b7", label:"ปกติ" },
  warn:   { color:"#b45309", bg:"#fffbeb", border:"#fcd34d", label:"เฝ้าระวัง" },
  danger: { color:"#b91c1c", bg:"#fef2f2", border:"#fca5a5", label:"วิกฤต" },
};
function stCfg(s) { return STATUS_CONFIG[s] || STATUS_CONFIG.ok; }

const FLOW_OVERLAYS = {
  phaseecharoen: PhaseecharoenFlowMapOverlay,
  pathumthani:   PathumthaniFlowMapOverlay,
};

// ─── STATION ICON SVG (base64 ย่อ — ใช้ placeholder circle แทน) ──────────────
const STATION_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44" height="44" viewBox="0 0 74 74" fill="none">
  <defs>
    <filter id="filter0_d_418_662" x="-0.000781059" y="0.000195503" width="73.4" height="73.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/><feGaussianBlur stdDeviation="3.6"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.58 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_418_662"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_418_662" result="shape"/>
    </filter>
    <filter id="filter1_d_418_662" x="20.3594" y="21.3604" width="33.2695" height="36.2695" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feMorphology radius="3" operator="erode" in="SourceAlpha" result="effect1_dropShadow_418_662"/>
      <feOffset dy="4"/><feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.17 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_418_662"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_418_662" result="shape"/>
    </filter>
    <pattern id="pattern0_418_662" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlink:href="#image0_418_662" transform="scale(0.00195312)"/>
    </pattern>
    <image id="image0_418_662" width="512" height="512" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
  <g filter="url(#filter0_d_418_662)">
    <circle cx="36.6992" cy="36.7002" r="29.5" fill="#0009FF"/>
  </g>
  <g filter="url(#filter1_d_418_662)">
    <rect x="21.3594" y="21.3604" width="31.27" height="31.27" fill="url(#pattern0_418_662)" shape-rendering="crispEdges"/>
  </g>
</svg>`;

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
function IconDashboard({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}
function IconChart({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function IconForecast({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
}
function IconMap({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
}
function IconWater({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
}
function IconCompare({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function IconCheckCircle({ size=14, color="#047857" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
function IconWarn({ size=14, color="#b45309" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function IconAlert({ size=14, color="#b91c1c" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function IconStation({ size=14, color="#1d4ed8" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
}
function IconDroplet({ size=14, color="#0e7490" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
}
function IconRain({ size=14, color="#6d28d9" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>;
}
function IconLocation({ size=14, color="#374151" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconGate({ size=14, color="#374151" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="1"/><path d="M7 6V4M17 6V4M2 12h20M7 12v8M17 12v8"/></svg>;
}
function IconExtra({ size=14, color="#374151" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>;
}
function IconSwitch({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M12 20v-8"/><path d="M12 4v4"/><circle cx="12" cy="16" r="2"/><circle cx="12" cy="8" r="2"/></svg>;
}
function IconPin() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconBuild() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="10" rx="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function IconBell({ size=12, color="#374151" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
function IconWave({ size=12, color="#6366f1" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M2 12s3-4 6-4 6 4 6 4 3-4 6-4"/></svg>;
}

// ─── STATION TYPE ICONS ───────────────────────────────────────────────────────
const GATE_PATH = "M8.35294 30.4815V22.1852C8.35294 21.5306 8.87967 21 9.52941 21H22.4706C23.1203 21 23.6471 21.5306 23.6471 22.1852V30.4815M10.7059 30.4815V25.1481C10.7059 24.4936 11.2326 23.963 11.8824 23.963H13.6471C14.2968 23.963 14.8235 24.4936 14.8235 25.1481V30.4815M17.1765 30.4815V25.1481C17.1765 24.4936 17.7032 23.963 18.3529 23.963H20.1176C20.7674 23.963 21.2941 24.4936 21.2941 25.1481V30.4815M7.7026 30.1539L8.97959 30.7971C9.32404 30.9706 9.73099 30.9633 10.0691 30.7775L12.2014 29.6059C12.5525 29.4129 12.9769 29.4129 13.3281 29.6059L15.4366 30.7645C15.7878 30.9575 16.2122 30.9575 16.5634 30.7645L18.6719 29.6059C19.0231 29.4129 19.4475 29.4129 19.7987 29.6059L21.9309 30.7775C22.269 30.9633 22.676 30.9706 23.0204 30.7971L24.2974 30.1539C25.0796 29.7599 26 30.3329 26 31.214V35.8148C26 36.4694 25.4733 37 24.8235 37H7.17647C6.52672 37 6 36.4694 6 35.8148V31.214C6 30.3329 6.92037 29.7599 7.7026 30.1539Z";

function GateIcon({ size=24 }) {
  const h = Math.round(size * 56 / 32);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={h} viewBox="0 0 32 56" fill="none">
      <rect width="32" height="56" rx="2" fill="#1153ED"/>
      <path d={GATE_PATH} stroke="white" strokeWidth="2"/>
    </svg>
  );
}
function GaugingIcon({ size=24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path d="M18.125 0.938194L32.7135 9.36084C32.7908 9.4055 32.8385 9.48803 32.8385 9.57735V26.4226C32.8385 26.512 32.7908 26.5945 32.7135 26.6392L18.125 35.0618C18.0476 35.1065 17.9524 35.1065 17.875 35.0618L3.28654 26.6392C3.20919 26.5945 3.16154 26.512 3.16154 26.4226V9.57735C3.16154 9.48803 3.20919 9.4055 3.28654 9.36084L17.875 0.938194C17.9524 0.893536 18.0476 0.893536 18.125 0.938194Z" fill="#0369a1" stroke="white" strokeWidth="2"/>
      <path d="M8 23.9457C9.02756 24.6571 10.0952 25 11.2703 25C13.2835 25 14.8429 23.9731 16.3696 22.9676C16.8832 22.6293 17.3932 22.2935 17.9155 22M8 19.1709C8.94418 19.7234 9.93195 20 11.0049 20C12.8579 20 14.2931 19.191 15.7018 18.3969C16.7332 17.8154 17.7505 17.242 18.907 17M8 14.2275C8.96823 14.7476 9.97421 15 11.0815 15C13.0422 15 14.5327 14.2176 15.9914 13.452C17.3891 12.7183 18.7576 12 20.4825 12C21.3049 12 22.0245 12.1722 22.8732 12.6266M27.9357 21.0674C27.908 19.4803 24.8562 14.9302 24.3605 14.9389C23.3691 14.9564 20.9689 19.6025 20.9959 21.1896C21.0202 22.6201 22.4868 24.9734 24.5306 24.9374C27.0041 24.8939 27.9694 23.0512 27.9357 21.0674Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function StationTypeIconBox({ type, size=24 }) {
  if (type === "gauging") return <GaugingIcon size={size}/>;
  return <GateIcon size={size}/>;
}

// ─── SHARED MINI CHARTS ───────────────────────────────────────────────────────
function MiniSparkline({ data, color, h=28 }) {
  const W=120, H=h, pad=3;
  const max=Math.max(...data,0.001), min=Math.min(...data);
  const pts=data.map((v,i)=>{const x=pad+i*(W-2*pad)/(data.length-1);const y=H-pad-(v-min)/(max-min||1)*(H-2*pad);return `${x},${y}`;}).join(" ");
  const area=`${pad},${H-pad} ${pts} ${pad+(data.length-1)*(W-2*pad)/(data.length-1)},${H-pad}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:h}}>
      <polygon points={area} fill={color} opacity={0.12}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

function LineChart({ datasets, labels, height=160 }) {
  const W=560,H=height,padL=40,padR=16,padT=10,padB=24;
  const allVals=datasets.flatMap(d=>d.data);
  const max=Math.max(...allVals,0.001),min=Math.min(...allVals);
  const range=max-min||1;
  const pts=(data)=>data.map((v,i)=>{const x=padL+i*(W-padL-padR)/(data.length-1);const y=H-padB-(v-min)/range*(H-padT-padB);return `${x},${y}`;}).join(" ");
  const yTicks=[0,0.25,0.5,0.75,1].map(t=>min+t*range);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height}}>
      {yTicks.map((v,i)=>{const y=H-padB-(v-min)/range*(H-padT-padB);return <g key={i}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f3f4f6" strokeWidth={1}/><text x={padL-4} y={y+4} fontSize={8} fill="#9ca3af" textAnchor="end">{v.toFixed(2)}</text></g>;})}
      {datasets.map((ds,di)=>{const p=pts(ds.data);const xN=padL+(ds.data.length-1)*(W-padL-padR)/(ds.data.length-1);const areaStr=`${padL},${H-padB} ${p} ${xN},${H-padB}`;return <g key={di}><polygon points={areaStr} fill={ds.color} opacity={0.07}/><polyline points={p} fill="none" stroke={ds.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={ds.dashed?"5 3":"none"}/></g>;})}
      {labels.filter((_,i)=>i%4===0).map((l,i)=>{const idx=i*4;const x=padL+idx*(W-padL-padR)/(labels.length-1);return <text key={i} x={x} y={H-4} fontSize={8} fill="#9ca3af" textAnchor="middle">{l}</text>;})}
    </svg>
  );
}

function BarChart({ data, color="#3b82f6", height=120 }) {
  const W=560,H=height,padL=40,padR=16,padT=8,padB=24;
  const max=Math.max(...data,0.001);
  const bw=(W-padL-padR)/data.length*0.6;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height}}>
      {[0,0.5,1].map((t,i)=>{const v=t*max,y=H-padB-(v/max)*(H-padT-padB);return <g key={i}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f3f4f6" strokeWidth={1}/><text x={padL-4} y={y+4} fontSize={8} fill="#9ca3af" textAnchor="end">{v.toFixed(0)}</text></g>;})}
      {data.map((v,i)=>{const bh=(v/max)*(H-padT-padB);const x=padL+i*(W-padL-padR)/data.length+(W-padL-padR)/data.length*0.2;return <rect key={i} x={x} y={H-padB-bh} width={bw} height={bh} fill={color} rx={2} opacity={0.7}/>;})}
      {HOURS.filter(h=>h%4===0).map(h=>{const x=padL+h*(W-padL-padR)/data.length+(W-padL-padR)/data.length*0.5;return <text key={h} x={x} y={H-4} fontSize={8} fill="#9ca3af" textAnchor="middle">{String(h).padStart(2,"0")}:00</text>;})}
    </svg>
  );
}

// ─── PATHUMTHANI POPUP MINI CHARTS ────────────────────────────────────────────
function PTMiniSparkline({ data, color, h=28 }) {
  const W=120,H=h,pad=2;
  const max=Math.max(...data,0.001),min=Math.min(...data);
  const pts=data.map((v,i)=>{const x=pad+(i*(W-2*pad))/(data.length-1);const y=H-pad-((v-min)/(max-min||1))*(H-2*pad);return `${x},${y}`;}).join(" ");
  const lastIdx=data.length-1;
  const areaStr=`${pad},${H-pad} ${pts} ${pad+(lastIdx*(W-2*pad))/lastIdx},${H-pad}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:h}}>
      <defs>
        <linearGradient id="ptSpk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={areaStr} fill="url(#ptSpk)"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

function PTLineChart({ datasets, labels, height=100 }) {
  const W=520,H=height,padL=36,padR=8,padT=8,padB=20;
  const allVals=datasets.flatMap(d=>d.data);
  const max=Math.max(...allVals,0.001),min=Math.min(...allVals);
  const range=max-min||1;
  const pts=(data)=>data.map((v,i)=>{const x=padL+(i*(W-padL-padR))/(data.length-1);const y=H-padB-((v-min)/range)*(H-padT-padB);return `${x},${y}`;}).join(" ");
  const yTicks=[0,0.33,0.66,1].map(t=>min+t*range);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height}}>
      <defs>
        {datasets.map((ds,di)=>(
          <linearGradient key={di} id={`ptLg${di}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ds.color} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={ds.color} stopOpacity="0"/>
          </linearGradient>
        ))}
      </defs>
      {yTicks.map((v,i)=>{const y=H-padB-((v-min)/range)*(H-padT-padB);return <g key={i}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f1f5f9" strokeWidth={1}/><text x={padL-4} y={y+3.5} fontSize={7.5} fill="#94a3b8" textAnchor="end">{v.toFixed(2)}</text></g>;})}
      {datasets.map((ds,di)=>{const p=pts(ds.data);const xN=padL+((ds.data.length-1)*(W-padL-padR))/(ds.data.length-1);const areaStr=`${padL},${H-padB} ${p} ${xN},${H-padB}`;return <g key={di}><polygon points={areaStr} fill={`url(#ptLg${di})`}/><polyline points={p} fill="none" stroke={ds.color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"/></g>;})}
      {labels.filter((_,i)=>i%6===0).map((l,i)=>{const idx=i*6;const x=padL+(idx*(W-padL-padR))/(labels.length-1);return <text key={i} x={x} y={H-4} fontSize={7.5} fill="#94a3b8" textAnchor="middle">{l}</text>;})}
    </svg>
  );
}

// ─── PATHUMTHANI POPUP SUB-COMPONENTS ────────────────────────────────────────
function PTLabel({ children, color="#64748b" }) {
  return (
    <div style={{fontSize:10,fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>
      {children}
    </div>
  );
}

function PTStatCard({ label, value, unit, color, bg, border, spark, sparkColor }) {
  return (
    <div style={{background:bg,borderRadius:10,padding:"12px 14px",border:`1px solid ${border}`,flex:"1 1 0",minWidth:0}}>
      <div style={{fontSize:9.5,fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>{label}</div>
      <div style={{fontSize:26,fontWeight:800,color,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1,letterSpacing:"-0.5px"}}>{value}</div>
      {unit && <div style={{fontSize:9,color,opacity:0.7,marginTop:4}}>{unit}</div>}
      {spark && (
        <div style={{marginTop:8}}>
          <PTMiniSparkline data={spark} color={sparkColor||color} h={28}/>
        </div>
      )}
    </div>
  );
}

function PTInfoRow({ label, value }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"7px 0",borderBottom:"1px solid #f1f5f9"}}>
      <span style={{fontSize:11,color:"#64748b"}}>{label}</span>
      <span style={{fontSize:11,fontWeight:600,color:"#0f172a",textAlign:"right",marginLeft:12}}>{value}</span>
    </div>
  );
}

// ─── PATHUMTHANI STATION POPUP ────────────────────────────────────────────────
// รับข้อมูล station จาก WaterDashboard แล้ว map เป็น format ที่ Popup ต้องการ
function PathumthaniStationPopup({ station, onClose }) {
  const [tab, setTab] = useState("water");

  // map station → pierData format
  const data = {
    station_code:     station.id,
    station_detail:   station.name,
    brae_level:       station.info?.braeLevel     ?? 2.80,
    wl_values:        station.readings?.U          ?? null,
    wl_down:          station.readings?.D          ?? null,
    open_gate:        station.readings?.O          ?? null,
    wl_percent:       station.info?.wlPercent      ?? 45,
    amphoe:           station.info?.district       ?? "—",
    subdistrict:      station.info?.subdistrict    ?? "—",
    province_t:       station.info?.province       ?? "—",
    basin:            station.info?.basin          ?? "—",
    region:           station.info?.region         ?? "—",
    office:           station.info?.office         ?? "—",
    lat:              parseFloat(station.info?.lat)  || 0,
    lng:              parseFloat(station.info?.lng)  || 0,
    build_year:       station.info?.buildYear      ?? "—",
    complete_year:    station.info?.completeYear   ?? "—",
    gate_count:       station.info?.gateCount      ?? null,
    gate_type:        station.info?.gateType       ?? "—",
    gate_width:       station.info?.gateWidth      ?? null,
    gate_height:      station.info?.gateHeight     ?? null,
    max_discharge:    station.info?.maxDischarge   ?? null,
    spill_level:      station.info?.spillLevel     ?? null,
    flood_level:      station.info?.floodLevel     ?? null,
    normal_level:     station.info?.normalLevel    ?? null,
    pumps:            station.info?.pumps          ?? [],
    additional_canal: station.info?.additionalCanal ?? "—",
    remark:           station.info?.remark         ?? "—",
    series: {
      level: station.series?.level ?? Array(24).fill(0),
      rain:  station.series?.rain  ?? Array(24).fill(0),
    },
  };

  const HOURS_24 = Array.from({length:24},(_,i)=>i);
  const seriesLevel = data.series?.level || Array(24).fill(data.wl_values||0);
  const U = data.wl_values ?? null;
  const accentBlue = "#1d4ed8";

  const statusLabel =
    data.wl_percent > 80 ? "วิกฤต" :
    data.wl_percent > 50 ? "เฝ้าระวัง" : "ปกติ";

  const statusConfig = {
    วิกฤต:     {bg:"#fef2f2",color:"#b91c1c",border:"#fca5a5",dot:"#ef4444"},
    เฝ้าระวัง: {bg:"#fffbeb",color:"#b45309",border:"#fcd34d",dot:"#f59e0b"},
    ปกติ:      {bg:"#ecfdf5",color:"#047857",border:"#6ee7b7",dot:"#22c55e"},
  }[statusLabel];

  const tabs = [["water","ข้อมูลน้ำ"],["location","ข้อมูลพื้นที่"]];

  return (
    <div
      onClick={onClose}
      style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(15,23,42,0.5)",zIndex:1000}}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{background:"#fff",borderRadius:18,width:820,maxWidth:"96vw",maxHeight:"88vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,0.22),0 0 0 1px rgba(0,0,0,0.06)",overflow:"hidden",fontFamily:"'Sarabun',sans-serif"}}
      >
        {/* ══ HEADER ══ */}
        <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:"1px solid #f1f5f9",flexShrink:0,background:"linear-gradient(135deg,#122c68 0%,#3f6be6 100%)"}}>
          {/* Station icon */}
          <div
            style={{width:44,height:44,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}
            dangerouslySetInnerHTML={{__html:STATION_ICON_SVG}}
          />
          {/* Title */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
              <span style={{fontSize:9.5,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{data.station_code}</span>
              <span style={{width:3,height:3,borderRadius:"50%",background:"rgba(255,255,255,0.3)",display:"inline-block"}}/>
              <span style={{fontSize:9.5,fontWeight:600,color:"rgba(255,255,255,0.5)"}}>สถานีวัดน้ำ · จ.{data.province_t}</span>
            </div>
            <div style={{fontSize:16,fontWeight:700,color:"#fff",lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
              {data.station_detail}
            </div>
          </div>
          {/* Status badge */}
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,background:statusConfig.bg,border:`1px solid ${statusConfig.border}`,flexShrink:0}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:statusConfig.dot}}/>
            <span style={{fontSize:12,fontWeight:700,color:statusConfig.color}}>{statusLabel}</span>
          </div>
          {/* Close */}
          <button onClick={onClose} style={{width:30,height:30,borderRadius:8,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",cursor:"pointer",fontSize:18,color:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,lineHeight:1}}>×</button>
        </div>

        {/* ══ TABS ══ */}
        <div style={{display:"flex",borderBottom:"1px solid #f1f5f9",flexShrink:0,background:"#fafafa",padding:"0 20px"}}>
          {tabs.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"10px 16px",fontSize:12,fontWeight:tab===id?700:500,color:tab===id?accentBlue:"#6b7280",border:"none",borderBottom:tab===id?`2px solid ${accentBlue}`:"2px solid transparent",background:"none",cursor:"pointer",fontFamily:"'Sarabun',sans-serif",marginBottom:-1}}>
              {label}
            </button>
          ))}
          <div style={{flex:1}}/>
          <div style={{display:"flex",alignItems:"center",fontSize:10,color:"#94a3b8",fontFamily:"'IBM Plex Mono',monospace"}}>
            อัปเดต 10/04/2569 · 06:00 น.
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div style={{overflowY:"auto",flex:1,padding:"18px 20px"}}>

          {/* ─── TAB: ข้อมูลน้ำ ─── */}
          {tab==="water" && (
            <div style={{display:"flex",gap:18}}>

              {/* LEFT COLUMN */}
              <div style={{flex:"0 0 300px",display:"flex",flexDirection:"column",gap:14}}>

                {/* description */}
                <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#64748b",lineHeight:1.7}}>
                  ประตูระบายน้ำ {data.station_detail} ควบคุมการระบายน้ำ ตำบล{data.subdistrict} อำเภอ{data.amphoe}
                </div>

                {/* stat cards */}
                <div style={{display:"flex",gap:10}}>
                  <PTStatCard
                    label="ระดับน้ำ"
                    value={U!==null?`+${U.toFixed(2)}`:"—"}
                    unit="ม.รทก."
                    color={accentBlue}
                    bg="#eff6ff"
                    border="#bfdbfe"
                    spark={seriesLevel}
                    sparkColor={accentBlue}
                  />
                  <PTStatCard
                    label="ระดับตลิ่ง"
                    value={data.brae_level!=null?`+${data.brae_level.toFixed(2)}`:"—"}
                    unit="ม.รทก."
                    color="#7c3aed"
                    bg="#faf5ff"
                    border="#ddd6fe"
                  />
                </div>

                {/* level band bar */}
                <div style={{background:"#fff",borderRadius:10,padding:"12px 14px",border:"1px solid #e2e8f0"}}>
                  <PTLabel>เกณฑ์ระดับน้ำ</PTLabel>
                  <div style={{height:8,borderRadius:4,overflow:"hidden",display:"flex",marginBottom:10}}>
                    <div style={{flex:1,background:"#22c55e"}}/>
                    <div style={{flex:1,background:"#f59e0b"}}/>
                    <div style={{flex:1,background:"#ef4444"}}/>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {[
                      {label:"ปกติ",     dot:"#22c55e",color:"#15803d",bg:"#f0fdf4",border:"#bbf7d0"},
                      {label:"เฝ้าระวัง",dot:"#f59e0b",color:"#b45309",bg:"#fffbeb",border:"#fde68a"},
                      {label:"วิกฤต",    dot:"#ef4444",color:"#b91c1c",bg:"#fef2f2",border:"#fca5a5"},
                    ].map(({label,dot,color,bg,border})=>(
                      <div key={label} style={{flex:1,display:"flex",alignItems:"center",gap:6,padding:"6px 8px",borderRadius:7,background:bg,border:`1px solid ${border}`}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:dot,flexShrink:0}}/>
                        <span style={{fontSize:11,color,fontWeight:700}}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* notification */}
                <div style={{background:"#fff",borderRadius:10,padding:"12px 14px",border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
                    <IconBell size={11} color="#374151"/> การแจ้งเตือน
                  </div>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",borderRadius:7,...(statusLabel==="วิกฤต"?{background:"#fef2f2",border:"1px solid #fca5a5"}:statusLabel==="เฝ้าระวัง"?{background:"#fffbeb",border:"1px solid #fde68a"}:{background:"#ecfdf5",border:"1px solid #6ee7b7"})}}>
                    <span style={{fontSize:12,color:statusConfig.color,fontWeight:700,flexShrink:0}}>
                      {statusLabel==="วิกฤต"?"!":statusLabel==="เฝ้าระวัง"?"▲":"✓"}
                    </span>
                    <div>
                      <div style={{fontSize:11,color:statusConfig.color,fontWeight:600}}>
                        {statusLabel==="วิกฤต"?"ระดับน้ำเกินเกณฑ์วิกฤต":statusLabel==="เฝ้าระวัง"?"ระดับน้ำอยู่ในเกณฑ์เฝ้าระวัง":"ระดับน้ำเหนืออยู่ในเกณฑ์ปกติ"}
                      </div>
                      <div style={{fontSize:10,color:"#94a3b8",marginTop:2,fontFamily:"'IBM Plex Mono',monospace"}}>05:30 น.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:14}}>
                {/* camera image */}
                <div style={{borderRadius:12,overflow:"hidden",border:"1px solid #e2e8f0",position:"relative",flexShrink:0}}>
                  <img
                    src="/pathumthanicam.jpg"
                    alt="กล้องสถานี"
                    style={{width:"100%",height:200,objectFit:"cover",display:"block"}}
                  />
                  <div style={{position:"absolute",top:8,left:8,display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,0.55)",borderRadius:6,padding:"3px 8px"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#ef4444"}}/>
                    <span style={{fontSize:9,color:"#fff",fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>LIVE · CAM-01</span>
                  </div>
                  <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,0.55)",borderRadius:6,padding:"3px 8px"}}>
                    <span style={{fontSize:9,color:"rgba(255,255,255,0.85)",fontFamily:"'IBM Plex Mono',monospace"}}>10-04-69 · 06:00</span>
                  </div>
                </div>

                {/* chart */}
                <div style={{background:"#f8fafc",borderRadius:12,padding:"14px 16px",border:"1px solid #e2e8f0",flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                    <IconDroplet size={12} color={accentBlue}/>
                    ระดับน้ำ 24 ชั่วโมงที่ผ่านมา
                    <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:18,height:2,background:accentBlue,borderRadius:1}}/>
                      <span style={{fontSize:10,color:"#94a3b8"}}>ระดับน้ำ (ม.รทก.)</span>
                    </div>
                  </div>
                  <PTLineChart
                    datasets={[{data:seriesLevel,color:accentBlue}]}
                    labels={HOURS_24.map(h=>`${String(h).padStart(2,"0")}:00`)}
                    height={140}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: ข้อมูลพื้นที่ ─── */}
          {tab==="location" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,alignItems:"start"}}>

              {/* COL 1 — ที่ตั้ง */}
              <div style={{background:"#f8fafc",borderRadius:10,padding:14,border:"1px solid #e2e8f0"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10,display:"flex",alignItems:"center",gap:5}}>
                  <IconPin/> ที่ตั้ง
                </div>
                <PTInfoRow label="จังหวัด"      value={data.province_t||"—"}/>
                <PTInfoRow label="อำเภอ"        value={data.amphoe||"—"}/>
                <PTInfoRow label="ตำบล"         value={data.subdistrict||"—"}/>
                <PTInfoRow label="ลุ่มน้ำ"      value={data.basin||"—"}/>
                <PTInfoRow label="ภูมิภาค"      value={data.region||"—"}/>
                <PTInfoRow label="หน่วยงาน"     value={data.office||"—"}/>
              </div>

              {/* COL 2 — พิกัด + การก่อสร้าง */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{background:"#f0fdf4",borderRadius:10,padding:"12px 14px",border:"1px solid #bbf7d0"}}>
                  <div style={{fontSize:9.5,fontWeight:700,color:"#047857",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>ละติจูด</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#14532d",fontFamily:"'IBM Plex Mono',monospace"}}>{data.lat?.toFixed(5)}°N</div>
                </div>
                <div style={{background:"#fdf4ff",borderRadius:10,padding:"12px 14px",border:"1px solid #e9d5ff"}}>
                  <div style={{fontSize:9.5,fontWeight:700,color:"#7e22ce",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>ลองจิจูด</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#581c87",fontFamily:"'IBM Plex Mono',monospace"}}>{data.lng?.toFixed(5)}°E</div>
                </div>
                <div style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10,display:"flex",alignItems:"center",gap:5}}>
                    <IconBuild/> การก่อสร้าง
                  </div>
                  <PTInfoRow label="ปีที่ก่อสร้าง (พ.ศ.)"    value={data.build_year||"—"}/>
                  <PTInfoRow label="ปีที่แล้วเสร็จ (พ.ศ.)"   value={data.complete_year||"—"}/>
                </div>
              </div>

              {/* COL 3 — เส้นทาง + หมายเหตุ */}
              <div style={{background:"#fffbeb",borderRadius:10,padding:14,border:"1px solid #fde68a",display:"flex",flexDirection:"column",gap:12}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:"#92400e",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:7}}>เส้นทางระบายน้ำ</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#0f172a",lineHeight:1.75}}>{data.additional_canal}</div>
                </div>
                <div style={{borderTop:"1px solid #fde68a",paddingTop:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#92400e",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:7}}>หมายเหตุ</div>
                  <div style={{fontSize:12,color:"#0f172a",lineHeight:1.75}}>{data.remark}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── READING BADGE ─────────────────────────────────────────────────────────────
function ReadingBadge({ label, value, unit="ม.รทก." }) {
  const colors = {
    U:{bg:"#eff6ff",color:"#1d4ed8",border:"#bfdbfe"},
    D:{bg:"#ecfdf5",color:"#047857",border:"#6ee7b7"},
    O:{bg:"#faf5ff",color:"#7c3aed",border:"#ddd6fe"},
    P:{bg:"#fff7ed",color:"#c2410c",border:"#fed7aa"},
  };
  const c=colors[label]||{bg:"#f8fafc",color:"#64748b",border:"#e2e8f0"};
  const isNull=value===null||value===undefined;
  return (
    <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",padding:"3px 6px",borderRadius:5,border:`1px solid ${isNull?"#e2e8f0":c.border}`,background:isNull?"#f8fafc":c.bg,minWidth:46}}>
      <span style={{fontSize:9,fontWeight:700,color:isNull?"#cbd5e1":c.color,letterSpacing:"0.05em"}}>{label}</span>
      <span style={{fontSize:11,fontWeight:700,color:isNull?"#cbd5e1":c.color,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.2}}>
        {isNull?"—":typeof value==="number"?(value===0?"0":value>10?value.toFixed(2):`+${value.toFixed(2)}`):value}
      </span>
      {!isNull&&<span style={{fontSize:7,color:c.color,opacity:0.7}}>{unit}</span>}
    </div>
  );
}

function ReadingsRow({ readings, compact=false, isPathumthani=false }) {
  const {U,D,O,P}=readings;
  const badges=isPathumthani
    ?[{label:"U",value:U,unit:"ม.รทก."}]
    :[{label:"U",value:U,unit:"ม.รทก."},{label:"D",value:D,unit:"ม.รทก."},{label:"O",value:O,unit:"ม.พน."},{label:"P",value:P,unit:"ซม.มล."}];
  const shown=compact?badges.filter(b=>b.value!==null):badges;
  if(shown.length===0)return null;
  return(
    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
      {shown.map(b=><ReadingBadge key={b.label} label={b.label} value={b.value} unit={b.unit}/>)}
    </div>
  );
}

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
function StatusBadge({ status, small=false }) {
  const cfg=stCfg(status);
  const Icon=status==="ok"?IconCheckCircle:status==="warn"?IconWarn:IconAlert;
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:small?"2px 6px":"3px 9px",borderRadius:4,fontSize:small?10:11,fontWeight:600,background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.border}`,whiteSpace:"nowrap"}}>
      <Icon size={small?10:12} color={cfg.color}/>{cfg.label}
    </span>
  );
}

// ─── PROJECT SWITCHER ─────────────────────────────────────────────────────────
function ProjectSwitcher({ currentProject, onSwitch }) {
  const [open,setOpen]=useState(false);
  const current=PROJECTS.find(p=>p.key===currentProject);
  return(
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",borderRadius:6,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,color:"#0f172a",boxShadow:"0 1px 2px rgba(0,0,0,0.06)"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:current?.meta.color||"#1d4ed8"}}/>
        <span style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{current?.meta.name||"เลือกโครงการ"}</span>
        <IconSwitch size={12} color="#64748b"/>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,minWidth:280,background:"#fff",borderRadius:8,border:"1px solid #e2e8f0",boxShadow:"0 8px 24px rgba(0,0,0,0.12)",zIndex:200,overflow:"hidden"}}>
          <div style={{padding:"6px 12px",borderBottom:"1px solid #f1f5f9",fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em"}}>เลือกโครงการ</div>
          {PROJECTS.map(p=>(
            <button key={p.key} onClick={()=>{onSwitch(p.key);setOpen(false);}}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",width:"100%",textAlign:"left",border:"none",background:currentProject===p.key?"#f0f9ff":"#fff",cursor:"pointer",borderLeft:`3px solid ${currentProject===p.key?p.meta.color:"transparent"}`}}
              onMouseEnter={e=>{if(currentProject!==p.key)e.currentTarget.style.background="#f8fafc";}}
              onMouseLeave={e=>{if(currentProject!==p.key)e.currentTarget.style.background="#fff";}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:p.meta.color,flexShrink:0}}/>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{p.meta.name}</div>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:1}}>{p.meta.office}</div>
              </div>
              {currentProject===p.key&&<div style={{marginLeft:"auto",fontSize:10,color:p.meta.color,fontWeight:700}}>● ใช้งานอยู่</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STATS POPUP ──────────────────────────────────────────────────────────────
function StatsPopup({ filterKey, label, color, bg, stations, onStationClick, onClose, isPathumthani }) {
  const filtered=filterKey==="all"?stations:stations.filter(s=>s.status===filterKey);
  const typeLabel=t=>t==="gate"?"ปตร./สน.ปตร.":"สถานีวัดน้ำ";
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",zIndex:1002,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:16,width:600,maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,0.25)",overflow:"hidden"}}>
        <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafafa"}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{label}</div>
            <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{filtered.length} สถานี · คลิกเพื่อดูรายละเอียด</div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:16,color:"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"12px 16px",display:"flex",flexDirection:"column",gap:6}}>
          {filtered.map(st=>{
            const cfg=stCfg(st.status);
            return(
              <div key={st.id} onClick={()=>{onStationClick(st);onClose();}}
                style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:8,border:"1px solid #f1f5f9",background:"#fff",cursor:"pointer",borderLeft:`3px solid ${cfg.color}`}}
                onMouseEnter={e=>{e.currentTarget.style.background="#f8fafc";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
                <div style={{flexShrink:0}}><StationTypeIconBox type={st.type} size={20}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{st.name}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{typeLabel(st.type)} · {st.info.province}</div>
                </div>
                <div style={{flexShrink:0}}><ReadingsRow readings={st.readings} compact isPathumthani={isPathumthani}/></div>
                <StatusBadge status={st.status} small/>
              </div>
            );
          })}
        </div>
        <div style={{padding:"8px 16px",borderTop:"1px solid #f3f4f6",background:"#fafafa",fontSize:10,color:"#94a3b8",textAlign:"center"}}>
          ข้อมูล ณ วันที่ 10/04/2569 เวลา 06:00 น. · กรมชลประทาน
        </div>
      </div>
    </div>
  );
}

// ─── STATION MODAL (โครงการอื่น ไม่ใช่ pathumthani) ──────────────────────────
function StationModal({ station, onClose, isPathumthani }) {
  const [tab,setTab]=useState("water");
  const {info,readings}=station;
  const typeLabel=station.type==="gauging"?"สถานีวัดน้ำอัตโนมัติ":"ประตูระบายน้ำ / สถานีสูบน้ำ";
  const readingBoxes=isPathumthani
    ?[{key:"U",label:"U · ระดับน้ำ",val:readings.U,bg:"#eff6ff",border:"#bfdbfe",color:"#1d4ed8",unit:"ม.รทก."}]
    :[
      {key:"U",label:"U · ระดับน้ำเหนือ",val:readings.U,bg:"#eff6ff",border:"#bfdbfe",color:"#1d4ed8",unit:"ม.รทก."},
      {key:"D",label:"D · ระดับน้ำท้าย",val:readings.D,bg:"#ecfdf5",border:"#6ee7b7",color:"#047857",unit:"ม.รทก."},
      {key:"O",label:"O · เปิดบาน/จำนวน",val:readings.O,bg:"#faf5ff",border:"#ddd6fe",color:"#7c3aed",unit:"ม.พน."},
    ];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(3px)"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:"#fff",borderRadius:14,width:700,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 64px rgba(0,0,0,0.2)",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid #f1f5f9",background:"#fafafa"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <StationTypeIconBox type={station.type} size={34}/>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{station.name}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{typeLabel} · {info.province}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <StatusBadge status={station.status}/>
            <button onClick={onClose} style={{width:28,height:28,borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:16,color:"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        </div>
        <div style={{display:"flex",padding:"0 22px",background:"#fff",borderBottom:"1px solid #f1f5f9"}}>
          {[["water","ข้อมูลน้ำ"],["building","ข้อมูลอาคาร"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{padding:"10px 18px",fontSize:13,fontWeight:tab===id?700:500,color:tab===id?"#1d4ed8":"#6b7280",border:"none",borderBottom:tab===id?"2px solid #1d4ed8":"2px solid transparent",background:"none",cursor:"pointer"}}>
              {label}
            </button>
          ))}
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"18px 22px"}}>
          <div style={{background:"#f8fafc",borderRadius:10,padding:14,marginBottom:14,display:"flex",alignItems:"flex-start",gap:14,border:"1px solid #e2e8f0"}}>
            <StationTypeIconBox type={station.type} size={40}/>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>{station.name}</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:3,lineHeight:1.6}}>{station.desc}</div>
              <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
                <span style={{padding:"2px 10px",borderRadius:4,fontSize:11,fontWeight:600,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe"}}>{typeLabel}</span>
                <StatusBadge status={station.status} small/>
              </div>
            </div>
          </div>
          {tab==="water"&&(
            <>
              <div style={{background:"#fff",borderRadius:10,padding:14,marginBottom:14,border:"1px solid #e2e8f0"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}>
                  <IconDroplet size={12} color="#0e7490"/> ค่าวัดปัจจุบัน
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
                  {readingBoxes.map(({key,label,val,bg,border,color,unit})=>(
                    <div key={key} style={{flex:1,minWidth:120,background:bg,borderRadius:8,padding:"10px 14px",border:`1px solid ${border}`}}>
                      <div style={{fontSize:9,fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{label}</div>
                      <div style={{fontSize:22,fontWeight:700,color,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>
                        {val!==null&&val!==undefined?(typeof val==="number"?(val>10?val.toFixed(2):`+${val.toFixed(2)}`):val):"—"}
                      </div>
                      {val!==null&&val!==undefined&&<div style={{fontSize:9,color,marginTop:3}}>{unit}</div>}
                      {key==="U"&&val!==null&&<div style={{marginTop:6,height:24}}><MiniSparkline data={station.series.level} color={color} h={24}/></div>}
                    </div>
                  ))}
                  {!isPathumthani&&readings.P!==null&&readings.P!==undefined&&(
                    <div style={{flex:1,minWidth:120,background:"#fff7ed",borderRadius:8,padding:"10px 14px",border:"1px solid #fed7aa"}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#c2410c",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>P · ปริมาณการระบาย</div>
                      <div style={{fontSize:22,fontWeight:700,color:"#c2410c",fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>{readings.P}</div>
                      <div style={{fontSize:9,color:"#c2410c",marginTop:3}}>ซม.มล.</div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div style={{background:"#f8fafc",borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
                    <IconDroplet size={12} color="#1d4ed8"/> ระดับน้ำ 24 ชม.
                  </div>
                  <LineChart datasets={[{data:station.series.level,color:"#1d4ed8"}]} labels={HOURS.map(h=>`${String(h).padStart(2,"0")}:00`)} height={110}/>
                </div>
                <div style={{background:"#f8fafc",borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
                    <IconRain size={12} color="#6d28d9"/> ปริมาณฝน 24 ชม. (มม.)
                  </div>
                  <BarChart data={station.series.rain} color="#6d28d9" height={110}/>
                </div>
              </div>
            </>
          )}
          {tab==="building"&&(
            <>
              <div style={{background:"#f8fafc",borderRadius:8,padding:14,marginBottom:10,border:"1px solid #e2e8f0"}}>
                <div style={{fontWeight:700,fontSize:12,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}>
                  <IconLocation size={12} color="#374151"/> ที่ตั้ง
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>
                  {[["จังหวัด",info.province],["อำเภอ",info.district],["ตำบล",info.subdistrict],["ภูมิภาค",info.region],["ลุ่มน้ำ",info.basin],["สำนักงานชลประทาน",info.office]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:6,borderBottom:"1px solid #f1f5f9"}}>
                      <span style={{fontSize:12,color:"#64748b"}}>{k}</span>
                      <span style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div style={{background:"#f0fdf4",borderRadius:8,padding:"10px 14px",border:"1px solid #bbf7d0"}}>
                  <div style={{fontSize:10,color:"#047857",fontWeight:600,textTransform:"uppercase"}}>ละติจูด</div>
                  <div style={{fontSize:17,fontWeight:700,color:"#14532d",marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>{info.lat}°N</div>
                </div>
                <div style={{background:"#fdf4ff",borderRadius:8,padding:"10px 14px",border:"1px solid #e9d5ff"}}>
                  <div style={{fontSize:10,color:"#7e22ce",fontWeight:600,textTransform:"uppercase"}}>ลองจิจูด</div>
                  <div style={{fontSize:17,fontWeight:700,color:"#581c87",marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>{info.lng}°E</div>
                </div>
              </div>
              {info.gateCount&&(
                <div style={{background:"#f8fafc",borderRadius:8,padding:14,marginBottom:10,border:"1px solid #e2e8f0"}}>
                  <div style={{fontWeight:700,fontSize:12,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}>
                    <IconGate size={12} color="#374151"/> ข้อมูลประตูระบายน้ำ
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>
                    {[["จำนวนบานประตู",info.gateCount],["ประเภท",info.gateType],["ความกว้าง",`${info.gateWidth} ม.`],["ความสูง",`${info.gateHeight} ม.`],["อัตราระบายสูงสุด",`${info.maxDischarge} ม³/วิ`],["ระดับน้ำล้น",`${info.floodLevel} ม.`]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:6,borderBottom:"1px solid #f1f5f9"}}>
                        <span style={{fontSize:12,color:"#64748b"}}>{k}</span>
                        <span style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {info.pumps&&info.pumps.length>0&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                  {[{label:"เครื่องสูบถาวร",key:"ถาวร",bg:"#fef2f2",accent:"#b91c1c"},{label:"กึ่งถาวร",key:"กึ่งถาวร",bg:"#eff6ff",accent:"#1d4ed8"},{label:"เพิ่มเติม",key:"เพิ่มเติม",bg:"#f0fdf4",accent:"#047857"}].map(({label,key,bg,accent})=>{
                    const d=info.pumps.find(p=>p.label===key);
                    return(
                      <div key={label} style={{background:bg,borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
                        <div style={{fontSize:11,fontWeight:700,color:accent,marginBottom:8}}>{label}</div>
                        {[["จำนวน",d?.count??0],["ขนาด",d?.size||"—"],["สูงสุด",`${d?.maxRate??0} ม³/วิ`]].map(([k,v])=>(
                          <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:4}}>
                            <span style={{fontSize:11,color:"#64748b"}}>{k}</span>
                            <span style={{fontSize:11,fontWeight:600,color:"#0f172a"}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{background:"#fffbeb",borderRadius:8,padding:14,border:"1px solid #fde68a"}}>
                <div style={{fontWeight:700,fontSize:12,color:"#92400e",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}>
                  <IconExtra size={12} color="#92400e"/> ข้อมูลเพิ่มเติม
                </div>
                <div style={{marginBottom:8}}><div style={{fontSize:11,color:"#64748b"}}>เส้นทางการระบายน้ำ</div><div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{info.additionalCanal}</div></div>
                <div><div style={{fontSize:11,color:"#64748b"}}>หมายเหตุ</div><div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{info.remark}</div></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CAMERA SCENES ────────────────────────────────────────────────────────────
const CAM_SCENES = [
  (wPct,col)=>{const w=Number.isFinite(wPct)?wPct:0;return(<svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}><rect width={200} height={110} fill="#c8dff0"/><rect width={200} height={58} fill="#b8d0e8"/>{[20,45,70,95,120,145,168].map(x=><ellipse key={x} cx={x} cy={52} rx={12} ry={8} fill="#6a9b5a" opacity={0.7}/>)}<rect x={80} y={20} width={40} height={55} fill="#c0c8d0"/><rect x={85} y={25} width={30} height={45} fill="#aab2ba"/><rect x={90} y={48} width={20} height={22} fill="#3b82f6" opacity={0.6}/><rect x={84} y={44} width={4} height={30} fill="#8896a0"/><rect x={112} y={44} width={4} height={30} fill="#8896a0"/><polygon points={`0,${110-w*0.55} 80,${110-w*0.55} 80,110 0,110`} fill="#8a7060"/><polygon points={`120,${110-w*0.55} 200,${110-w*0.55} 200,110 120,110`} fill="#8a7060"/><rect x={0} y={110-w*0.55} width={80} height={w*0.55} fill={col} opacity={0.75}/><rect x={90} y={48} width={20} height={62} fill={col} opacity={0.7}/><rect x={120} y={110-w*0.55} width={80} height={w*0.55} fill={col} opacity={0.75}/></svg>);},
  (wPct,col)=>{const w=Number.isFinite(wPct)?wPct:0;return(<svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}><rect width={200} height={110} fill="#d4e8c2"/><polygon points={`40,110 60,${110-w*0.5} 140,${110-w*0.5} 160,110`} fill="#9a8870"/><rect x={60} y={110-w*0.5} width={80} height={w*0.5} fill={col} opacity={0.8}/></svg>);},
  (wPct,col)=>{const w=Number.isFinite(wPct)?wPct:0;return(<svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}><rect width={200} height={110} fill="#bccfdc"/><rect x={0} y={40} width={60} height={70} fill="#c8cdd2"/><rect x={140} y={40} width={60} height={70} fill="#c8cdd2"/><rect x={0} y={38} width={200} height={8} fill="#aab0b8"/><rect x={0} y={110-(w*0.65+8)} width={64} height={w*0.65+8} fill={col} opacity={0.82}/><rect x={136} y={110-w*0.35} width={64} height={w*0.35} fill={col} opacity={0.7}/></svg>);},
  (wPct,col)=>{const w=Number.isFinite(wPct)?wPct:0;return(<svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}><rect width={200} height={110} fill="#dce8d8"/><rect x={40} y={25} width={120} height={75} fill="#e8e0d8"/><rect x={0} y={90} width={200} height={20} fill="#9a8870"/><rect x={0} y={110-w*0.18} width={200} height={w*0.18} fill={col} opacity={0.8}/></svg>);},
];

function CameraFeed({ cam, station, onClick }) {
  const scfg=cam.status==="ok"?{color:"#047857",bg:"#ecfdf5",label:"ปกติ"}:cam.status==="warning"?{color:"#b45309",bg:"#fffbeb",label:"เฝ้าระวัง"}:{color:"#b91c1c",bg:"#fef2f2",label:"วิกฤต"};
  const wCol=cam.status==="danger"?"rgba(239,68,68,0.55)":cam.status==="warning"?"rgba(245,158,11,0.45)":"rgba(59,130,246,0.55)";
  const camId=Number(cam.id)||1;
  const wPct=Number(cam.waterPct)||0;
  const SceneRenderer=CAM_SCENES[(camId-1)%CAM_SCENES.length];
  return(
    <div onClick={onClick} style={{borderRadius:8,overflow:"hidden",border:"1px solid #e2e8f0",cursor:"pointer",background:"#fff"}}>
      <div style={{position:"relative",height:72,background:"#0f1a2e",overflow:"hidden"}}>
        <SceneRenderer wPct={wPct} col={wCol}/>
        <div style={{position:"absolute",top:0,left:0,right:0,background:"rgba(0,0,0,0.4)",padding:"2px 5px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:scfg.color,animation:"pulse 1.5s infinite"}}/>
            <span style={{fontSize:7,color:"#fff",fontFamily:"'IBM Plex Mono',monospace"}}>REC · CAM-0{cam.id}</span>
          </div>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.75)",fontFamily:"'IBM Plex Mono',monospace"}}>10-04-69 06:00</span>
        </div>
        {station&&<div style={{position:"absolute",top:16,right:3,width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center"}}><StationTypeIconBox type={station.type} size={12}/></div>}
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,0.35)",padding:"2px 5px",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.75)",fontFamily:"'IBM Plex Mono',monospace"}}>WL: {cam.level} cm</span>
          <span style={{fontSize:7,color:scfg.color,fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{scfg.label}</span>
        </div>
      </div>
      <div style={{padding:"4px 6px"}}>
        <div style={{fontSize:8,fontWeight:600,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cam.name}</div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:2,alignItems:"center"}}>
          <span style={{fontSize:8,color:"#64748b",fontFamily:"'IBM Plex Mono',monospace"}}>{cam.level} ซม.</span>
          <span style={{fontSize:7,fontWeight:700,background:scfg.bg,color:scfg.color,padding:"1px 4px",borderRadius:3,border:`1px solid ${scfg.color}30`}}>{scfg.label}</span>
        </div>
      </div>
    </div>
  );
}

// ─── FLOW MAP ─────────────────────────────────────────────────────────────────
function FlowMap({ stations, mapStations, onStationClick, renderCanals }) {
  const [zoom,setZoom]=useState(1);
  const [pan,setPan]=useState({x:0,y:0});
  const [dragging,setDragging]=useState(false);
  const dragRef=useRef({start:{x:0,y:0},panStart:{x:0,y:0}});
  const W=620,H=1200,MIN_ZOOM=0.35,MAX_ZOOM=4;
  const handleWheel=useCallback((e)=>{e.preventDefault();const d=e.deltaY>0?-0.1:0.1;setZoom(z=>Math.min(MAX_ZOOM,Math.max(MIN_ZOOM,parseFloat((z+d).toFixed(2)))));},[]);
  const handleMouseDown=useCallback((e)=>{if(e.button!==0)return;dragRef.current={start:{x:e.clientX,y:e.clientY},panStart:{...pan}};setDragging(true);},[pan]);
  const handleMouseMove=useCallback((e)=>{if(!dragging)return;const{start,panStart}=dragRef.current;setPan({x:panStart.x+(e.clientX-start.x),y:panStart.y+(e.clientY-start.y)});},[dragging]);
  const handleMouseUp=useCallback(()=>setDragging(false),[]);
  const zoomIn=()=>setZoom(z=>Math.min(MAX_ZOOM,parseFloat((z+0.2).toFixed(2))));
  const zoomOut=()=>setZoom(z=>Math.max(MIN_ZOOM,parseFloat((z-0.2).toFixed(2))));
  const resetView=()=>{setZoom(1);setPan({x:0,y:0});};
  const stMap=Object.fromEntries(stations.map(s=>[s.id,s]));
  return(
    <div style={{cursor:dragging?"grabbing":"grab",position:"relative",width:"100%",height:"100%",overflow:"hidden",background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",userSelect:"none"}}
      onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div style={{position:"absolute",top:10,right:10,zIndex:10,display:"flex",flexDirection:"column",gap:3}}>
        {[{label:"+",fn:zoomIn},{label:"−",fn:zoomOut},{label:"⌂",fn:resetView}].map(({label,fn})=>(
          <button key={label} onClick={fn} style={{width:26,height:26,borderRadius:5,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:label==="⌂"?10:15,fontWeight:700,color:"#475569",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 2px rgba(0,0,0,0.08)"}}>{label}</button>
        ))}
      </div>
      <div style={{position:"absolute",bottom:8,right:10,zIndex:10,background:"rgba(255,255,255,0.92)",border:"1px solid #e2e8f0",borderRadius:4,padding:"2px 7px",fontSize:9,color:"#64748b",fontFamily:"'IBM Plex Mono',monospace"}}>{Math.round(zoom*100)}%</div>
      <div style={{position:"absolute",bottom:8,left:10,zIndex:10,background:"rgba(255,255,255,0.85)",border:"1px solid #e2e8f0",borderRadius:4,padding:"2px 7px",fontSize:9,color:"#94a3b8"}}>เลื่อนล้อซูม · ลากเพื่อเลื่อน</div>
      <div style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:"center top",width:"100%",height:"100%",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:12}}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W*0.65} height={H*0.65} style={{fontFamily:"'Sarabun',sans-serif",display:"block"}}>
          <rect width={W} height={H} fill="#f8fafc"/>
          {Array.from({length:Math.ceil(W/40)}).map((_,i)=><line key={`v${i}`} x1={i*40} y1={0} x2={i*40} y2={H} stroke="rgba(226,232,240,0.6)" strokeWidth={0.5}/>)}
          {Array.from({length:Math.ceil(H/40)}).map((_,i)=><line key={`h${i}`} x1={0} y1={i*40} x2={W} y2={i*40} stroke="rgba(226,232,240,0.6)" strokeWidth={0.5}/>)}
          {renderCanals&&renderCanals(H)}
          {mapStations.map(({id,x,y})=>{
            const st=stMap[id];if(!st)return null;
            const cfg=stCfg(st.status);const isGauging=st.type==="gauging";const r=18;const{U,D,O,P}=st.readings;
            return(
              <g key={id} style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();if(!dragging)onStationClick?.(st);}}>
                <circle cx={x} cy={y} r={r} fill={cfg.bg} stroke={cfg.border} strokeWidth={1.5} opacity={0.97}/>
                {isGauging?(
                  <g transform={`translate(${x-8},${y-9}) scale(0.47)`}>
                    <path d="M18.125 0.938194L32.7135 9.36084V26.4226L18.125 35.0618L3.28654 26.4226V9.57735L18.125 0.938194Z" fill="#0369a1" stroke="white" strokeWidth="2.5"/>
                    <path d="M8 23C9 24 10 25 11.5 25C13.5 25 15 24 16.5 23M8 19C9 20 10 20 11 20C13 20 14 19 15.5 18C17 17 18 17 19 17M8 14C9 15 10 15 11 15C13 15 15.5 13.5 17 12.7C18.5 12 19.5 12 20.5 12" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </g>
                ):(
                  <g>
                    <circle cx={x} cy={y} r={12} fill="#1153ED"/>
                    <g transform={`translate(${x-7.5},${y-8}) scale(0.48)`}>
                      <path d={GATE_PATH} stroke="white" strokeWidth="2.2" fill="none"/>
                    </g>
                  </g>
                )}
                <rect x={x+r+2} y={y-12} width={st.shortName.length*5.2+8} height={13} fill="rgba(255,255,255,0.97)" rx={3} stroke={cfg.border} strokeWidth={0.5}/>
                <text x={x+r+6} y={y-2} fontSize={8} fill={cfg.color} fontWeight="700">{st.shortName}</text>
                {(U!==null||D!==null)&&(
                  <g>
                    <rect x={x+r+2} y={y+3} width={72} height={22} fill="rgba(255,255,255,0.94)" rx={3} stroke="#e2e8f0" strokeWidth={0.5}/>
                    {U!==null&&(<><text x={x+r+5} y={y+11} fontSize={6.5} fill="#1d4ed8" fontWeight="700">U</text><text x={x+r+13} y={y+11} fontSize={7} fill="#1d4ed8" fontFamily="'IBM Plex Mono',monospace">{U>10?U.toFixed(2):`+${U.toFixed(2)}`}</text></>)}
                    {D!==null&&(<><text x={x+r+5} y={y+21} fontSize={6.5} fill="#047857" fontWeight="700">D</text><text x={x+r+13} y={y+21} fontSize={7} fill="#047857" fontFamily="'IBM Plex Mono',monospace">{D>10?D.toFixed(2):`+${D.toFixed(2)}`}</text></>)}
                    {O!==null&&(<><text x={x+r+42} y={y+11} fontSize={6.5} fill="#7c3aed" fontWeight="700">O</text><text x={x+r+50} y={y+11} fontSize={7} fill="#7c3aed" fontFamily="'IBM Plex Mono',monospace">{O}</text></>)}
                    {P!==null&&(<><text x={x+r+42} y={y+21} fontSize={6.5} fill="#c2410c" fontWeight="700">P</text><text x={x+r+50} y={y+21} fontSize={7} fill="#c2410c" fontFamily="'IBM Plex Mono',monospace">{P}</text></>)}
                  </g>
                )}
                <circle cx={x+r-4} cy={y-r+4} r={4} fill={cfg.color} stroke="white" strokeWidth={1}/>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ station, onClick, isPathumthani }) {
  const cfg=stCfg(station.status);
  return(
    <div onClick={()=>onClick(station)} style={{borderRadius:7,padding:"8px 10px",border:"1px solid #f1f5f9",background:"#fff",cursor:"pointer",borderLeft:`2.5px solid ${cfg.color}`}}
      onMouseEnter={e=>{e.currentTarget.style.background="#f8fafc";}}
      onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
        <div style={{flexShrink:0}}><StationTypeIconBox type={station.type} size={13}/></div>
        <span style={{fontSize:9,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500,flex:1}}>{station.shortName}</span>
        <StatusBadge status={station.status} small/>
      </div>
      <ReadingsRow readings={station.readings} compact isPathumthani={isPathumthani}/>
      {station.series&&(
        <div style={{marginTop:4,height:16}}><MiniSparkline data={station.series.level} color={cfg.color} h={16}/></div>
      )}
    </div>
  );
}

function Chip({ children, active, onClick, color="#1d4ed8" }) {
  return(
    <button onClick={onClick} style={{padding:"4px 12px",borderRadius:4,border:`1px solid ${active?color:"#e2e8f0"}`,fontSize:11,cursor:"pointer",background:active?`${color}12`:"#fff",color:active?color:"#64748b",fontWeight:active?600:400,whiteSpace:"nowrap"}}>
      {children}
    </button>
  );
}

// ─── FORECAST TAB ─────────────────────────────────────────────────────────────
function ForecastTab({ stations }) {
  const [forecastStation,setForecastStation]=useState(stations[0]?.id||"");
  const [forecastRange,setForecastRange]=useState("48");
  const st=stations.find(s=>s.id===forecastStation)||stations[0];
  if(!st)return null;
  const hrs=parseInt(forecastRange)||48;
  const base=st.series.level[st.series.level.length-1];
  const trend=st.status==="danger"?0.008:st.status==="warn"?0.003:-0.002;
  const forecastData=Array.from({length:hrs},(_,i)=>Math.max(0,parseFloat((base+trend*i+Math.sin(i*0.5)*0.015).toFixed(3))));
  const bestCase=forecastData.map(v=>Math.max(0,parseFloat((v-0.018).toFixed(3))));
  const worstCase=forecastData.map((v,i)=>parseFloat((v+0.025*i/hrs).toFixed(3)));
  const rainForecast=Array.from({length:hrs},(_,i)=>parseFloat((i<6?0:i<12?Math.random()*7:i<24?Math.random()*3:Math.random()*1.5).toFixed(1)));
  const maxForecast=Math.max(...forecastData);
  const riskColor=st.status==="danger"?"#b91c1c":st.status==="warn"?"#b45309":"#047857";
  const riskBg=st.status==="danger"?"#fef2f2":st.status==="warn"?"#fffbeb":"#ecfdf5";
  const riskLabel=st.status==="danger"?"วิกฤต – ต้องเฝ้าระวังเข้ม":st.status==="warn"?"เฝ้าระวัง – แนวโน้มสูงขึ้น":"ปกติ – สถานการณ์อยู่ในเกณฑ์ดี";
  const W=560,H=180,padL=42,padR=16,padT=16,padB=24;
  const allVals=[...forecastData,...bestCase,...worstCase];
  const maxV=Math.max(...allVals)+0.05,minV=Math.max(0,Math.min(...allVals)-0.02),range=maxV-minV||1;
  const toX=(i)=>padL+i*(W-padL-padR)/(forecastData.length-1);
  const toY=(v)=>H-padB-(v-minV)/range*(H-padT-padB);
  const ptsMain=forecastData.map((v,i)=>`${toX(i)},${toY(v)}`).join(" ");
  const ptsBest=bestCase.map((v,i)=>`${toX(i)},${toY(v)}`).join(" ");
  const ptsWorst=worstCase.map((v,i)=>`${toX(i)},${toY(v)}`).join(" ");
  const areaMain=`${toX(0)},${H-padB} ${ptsMain} ${toX(forecastData.length-1)},${H-padB}`;
  const normY=toY(st.info.normalLevel);
  const step=Math.ceil(hrs/6);
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{padding:"10px 20px",background:"#fff",borderBottom:"1px solid #f1f5f9",display:"flex",flexWrap:"wrap",gap:12,alignItems:"center",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>สถานี</span>
          <select value={forecastStation} onChange={e=>setForecastStation(e.target.value)}
            style={{padding:"4px 10px",border:"1px solid #e2e8f0",borderRadius:5,fontSize:12,fontFamily:"'Sarabun',sans-serif",background:"#fff",color:"#0f172a"}}>
            {stations.map(s=><option key={s.id} value={s.id}>{s.shortName}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>ช่วงเวลา</span>
          {["24","48","72"].map(v=>(<Chip key={v} active={forecastRange===v} onClick={()=>setForecastRange(v)}>{v} ชม.</Chip>))}
        </div>
        <div style={{marginLeft:"auto",padding:"4px 12px",borderRadius:4,background:riskBg,color:riskColor,fontSize:11,fontWeight:600,border:`1px solid ${riskColor}30`}}>{riskLabel}</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {Icon:IconDroplet,label:"ระดับปัจจุบัน (U)",value:`${base.toFixed(2)} ม.`,color:"#1d4ed8",bg:"#eff6ff"},
            {Icon:IconWarn,label:"คาดสูงสุด",value:`${maxForecast.toFixed(2)} ม.`,color:"#b45309",bg:"#fffbeb"},
            {Icon:IconRain,label:"ฝนสะสม (คาด)",value:`${rainForecast.slice(0,24).reduce((a,b)=>a+b,0).toFixed(1)} มม.`,color:"#6d28d9",bg:"#faf5ff"},
            {Icon:IconChart,label:"แนวโน้ม",value:st.status==="danger"?"↑ สูงขึ้น":st.status==="warn"?"→ ทรงตัว":"↓ ลดลง",color:riskColor,bg:riskBg},
          ].map((s,i)=>(
            <div key={i} style={{background:s.bg,borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
              <s.Icon size={14} color={s.color}/>
              <div style={{fontSize:10,color:"#94a3b8",margin:"4px 0 2px",textTransform:"uppercase"}}>{s.label}</div>
              <div style={{fontSize:16,fontWeight:700,color:s.color,fontFamily:"'IBM Plex Mono',monospace"}}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>คาดการณ์ระดับน้ำ – {st.shortName}</div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{hrs} ชั่วโมงถัดไป</div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {[["#1d4ed8","คาดการณ์หลัก"],["#047857","กรณีดีที่สุด"],["#b45309","กรณีเลวร้าย"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}><div style={{width:14,height:2,background:c}}/>{l}</div>
              ))}
            </div>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}>
            <rect x={padL} y={padT} width={W-padL-padR} height={normY-padT} fill="rgba(254,226,226,0.25)"/>
            <line x1={padL} y1={normY} x2={W-padR} y2={normY} stroke="#b91c1c" strokeWidth={1} strokeDasharray="4 2"/>
            <text x={W-padR-2} y={normY-3} fontSize={8} fill="#b91c1c" textAnchor="end">ระดับปกติ {st.info.normalLevel} ม.</text>
            {[0,0.25,0.5,0.75,1].map((t,i)=>{const v=minV+t*range,y=toY(v);return <g key={i}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f1f5f9" strokeWidth={1}/><text x={padL-4} y={y+4} fontSize={8} fill="#94a3b8" textAnchor="end">{v.toFixed(2)}</text></g>;})}
            <polygon points={areaMain} fill="#1d4ed8" opacity={0.07}/>
            <polyline points={ptsWorst} fill="none" stroke="#b45309" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7}/>
            <polyline points={ptsBest} fill="none" stroke="#047857" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7}/>
            <polyline points={ptsMain} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>
            {Array.from({length:forecastData.length},(_,i)=>i).filter(i=>i%step===0).map(i=>(
              <text key={i} x={toX(i)} y={H-4} fontSize={8} fill="#94a3b8" textAnchor="middle">+{i}ชม.</text>
            ))}
          </svg>
        </div>
        <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#0f172a",marginBottom:4,display:"flex",alignItems:"center",gap:5}}>
            <IconRain size={12} color="#6d28d9"/> คาดการณ์ปริมาณน้ำฝน ({hrs} ชม.)
          </div>
          <BarChart data={rainForecast} color="#6d28d9" height={100}/>
        </div>
      </div>
    </div>
  );
}

// ─── WATER INFORMATION TAB ────────────────────────────────────────────────────
function WaterInformationTab({ stations, stationListForCompare, onStationClick, isPathumthani }) {
  const [activeMetric,setActiveMetric]=useState("level");
  const [selectedForChart,setSelectedForChart]=useState(new Set([stationListForCompare[0]]));
  const [activeTimeRange,setActiveTimeRange]=useState("24 ชม.");
  const metricOptions=isPathumthani
    ?[["level","ระดับน้ำ"],["rain","ปริมาณฝน"]]
    :[["level","ระดับน้ำ"],["flow","น้ำท่า"],["rain","ปริมาณฝน"]];
  const toggleChart=(id)=>{setSelectedForChart(prev=>{const newSet=new Set(prev);if(newSet.has(id)){newSet.delete(id);}else{newSet.add(id);}return newSet;});};
  const waterStations=stations.filter(s=>stationListForCompare.includes(s.id));
  const chartDatasets=[...selectedForChart].map((id,i)=>{const st=stations.find(s=>s.id===id);if(!st)return null;const stIndex=waterStations.findIndex(s=>s.id===id);return{data:st.series[activeMetric]||st.series.level,color:CHART_COLORS[stIndex%CHART_COLORS.length],label:st.shortName};}).filter(Boolean);
  const tableHeaders=isPathumthani
    ?["","สถานี","ประเภท","ระดับน้ำ (ม.รทก.)","สถานะ",""]
    :["","สถานี","ประเภท","U (ม.รทก.)","D (ม.รทก.)","O (ม.พน.)","P (ซม.มล.)","สถานะ",""];
  const fmt=v=>v===null?<span style={{color:"#cbd5e1"}}>—</span>:<span style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{typeof v==="number"?(v>10?v.toFixed(2):`+${v.toFixed(2)}`):v}</span>;
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{padding:"9px 20px",background:"#fff",borderBottom:"1px solid #f1f5f9",display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",flexShrink:0}}>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>ประเภท</span>
          {metricOptions.map(([id,l])=>(<Chip key={id} active={activeMetric===id} onClick={()=>setActiveMetric(id)}>{l}</Chip>))}
        </div>
        <div style={{width:1,height:18,background:"#e2e8f0"}}/>
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>สถานี</span>
          {waterStations.map((s,i)=>(<Chip key={s.id} active={selectedForChart.has(s.id)} onClick={()=>toggleChart(s.id)} color={CHART_COLORS[i%CHART_COLORS.length]}>{s.shortName}</Chip>))}
        </div>
        <div style={{width:1,height:18,background:"#e2e8f0"}}/>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          {["24 ชม.","7 วัน","30 วัน"].map(t=>(<Chip key={t} active={activeTimeRange===t} onClick={()=>setActiveTimeRange(t)}>{t}</Chip>))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>
                {activeMetric==="level"?"ระดับน้ำ (ม.รทก.)":activeMetric==="flow"?"อัตราน้ำท่า (ม³/วิ)":"ปริมาณน้ำฝน (มม.)"} – เปรียบเทียบสถานี
              </div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{activeTimeRange} · ข้อมูลล่าสุด 10/04/2569</div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {chartDatasets.map((ds,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}><div style={{width:14,height:2,background:ds.color}}/>{ds.label}</div>))}
            </div>
          </div>
          {chartDatasets.length>0
            ?<LineChart datasets={chartDatasets} labels={HOURS.map(h=>`${String(h).padStart(2,"0")}:00`)} height={200}/>
            :<div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:13}}>เลือกสถานีเพื่อแสดงกราฟ</div>
          }
        </div>
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e8f0"}}>
          <div style={{padding:"10px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:6}}>
            <IconStation size={12} color="#1d4ed8"/>
            <span style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>ตารางสรุปสถานีทั้งหมด ({stations.length} สถานี)</span>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:"#f8fafc"}}>
                  {tableHeaders.map((h,i)=>(<th key={i} style={{padding:"8px 10px",textAlign:"left",fontSize:9,color:"#94a3b8",fontWeight:700,borderBottom:"1px solid #e2e8f0",textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {stations.map((st,i)=>{
                  const cfg=stCfg(st.status);const typeLabel=st.type==="gauging"?"สถานีวัดน้ำ":"ปตร./สน.ปตร.";const r=st.readings;
                  return(
                    <tr key={st.id} style={{borderBottom:"1px solid #f8fafc",background:i%2?"#fafafa":"#fff"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="#eff6ff";}}
                      onMouseLeave={e=>{e.currentTarget.style.background=i%2?"#fafafa":"#fff";}}>
                      <td style={{padding:"7px 8px 7px 12px"}}><StationTypeIconBox type={st.type} size={14}/></td>
                      <td style={{padding:"7px 10px",fontWeight:600,color:"#0f172a",whiteSpace:"nowrap"}}>{st.shortName}</td>
                      <td style={{padding:"7px 10px",color:"#64748b",fontSize:11}}>{typeLabel}</td>
                      {isPathumthani?(
                        <td style={{padding:"7px 10px",color:"#1d4ed8"}}>{fmt(r.U)}</td>
                      ):(
                        <><td style={{padding:"7px 10px",color:"#1d4ed8"}}>{fmt(r.U)}</td><td style={{padding:"7px 10px",color:"#047857"}}>{fmt(r.D)}</td><td style={{padding:"7px 10px",color:"#7c3aed"}}>{fmt(r.O)}</td><td style={{padding:"7px 10px",color:"#c2410c"}}>{fmt(r.P)}</td></>
                      )}
                      <td style={{padding:"7px 10px"}}><StatusBadge status={st.status} small/></td>
                      <td style={{padding:"7px 10px"}}>
                        <button onClick={()=>onStationClick(st)} style={{padding:"3px 9px",border:"1px solid #bfdbfe",borderRadius:4,fontSize:10,cursor:"pointer",color:"#1d4ed8",background:"#eff6ff",fontFamily:"inherit",fontWeight:600}}>ดูรายละเอียด</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPARE TAB ──────────────────────────────────────────────────────────────
function CompareTab({ activeProject }) {
  return(
    <div style={{display:"flex",height:"100%",alignItems:"center",justifyContent:"center",background:"#fff",overflow:"hidden"}}>
      <img src={`/${activeProject}.png`} alt="Compare" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",display:"block"}}/>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function WaterDashboard() {
  const [activeProject,setActiveProject]=useState("phaseecharoen");
  const [activeTab,setActiveTab]=useState("dashboard");
  const [time,setTime]=useState("");
  const [selectedStation,setSelectedStation]=useState(null);
  const [statsPopup,setStatsPopup]=useState(null);

  const handleProjectSwitch=(key)=>{setActiveProject(key);setSelectedStation(null);setStatsPopup(null);};

  useEffect(()=>{
    const tick=()=>setTime(new Date().toLocaleTimeString("th-TH",{hour12:false}));
    tick();const t=setInterval(tick,1000);return()=>clearInterval(t);
  },[]);

  const project=PROJECTS.find(p=>p.key===activeProject);
  const {STATIONS,CAMERAS,STATION_LIST_FOR_COMPARE,MAP_STATIONS,PROJECT_META,renderCanals}=project.data;
  const isPathumthani=activeProject==="pathumthani";

  const allSummaryStats=[
    {label:"สถานีทั้งหมด",value:STATIONS.length,Icon:IconStation,color:"#1d4ed8",bg:"#eff6ff",filterKey:"all"},
    {label:"สถานีปกติ",value:STATIONS.filter(s=>s.status==="ok").length,Icon:IconCheckCircle,color:"#047857",bg:"#ecfdf5",filterKey:"ok"},
    {label:"เฝ้าระวัง",value:STATIONS.filter(s=>s.status==="warn").length,Icon:IconWarn,color:"#b45309",bg:"#fffbeb",filterKey:"warn"},
    {label:"วิกฤต",value:STATIONS.filter(s=>s.status==="danger").length,Icon:IconAlert,color:"#b91c1c",bg:"#fef2f2",filterKey:"danger"},
    {label:"ปตร./สน.ปตร.",value:STATIONS.filter(s=>s.type==="gate").length,Icon:IconGate,color:"#0e7490",bg:"#f0f9ff",filterKey:"all",hideForPathumthani:true},
    {label:"สถานีวัดน้ำ",value:STATIONS.filter(s=>s.type==="gauging").length,Icon:IconDroplet,color:"#6d28d9",bg:"#faf5ff",filterKey:"all",hideForPathumthani:true},
  ];
  const summaryStats=isPathumthani?allSummaryStats.filter(s=>!s.hideForPathumthani):allSummaryStats;

  const tabs=[
    {id:"dashboard",label:"Dashboard",Icon:IconDashboard},
    {id:"waterinformation",label:"ข้อมูลน้ำ",Icon:IconWater},
    {id:"compare",label:"เปรียบเทียบ",Icon:IconCompare},
    {id:"forecast",label:"คาดการณ์",Icon:IconForecast},
    {id:"flowmap",label:isPathumthani?"เส้นทางน้ำ":"ผังน้ำ",Icon:IconMap},
  ];
  const accentColor=PROJECT_META.color;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",background:"#f1f5f9",color:"#0f172a",fontFamily:"'Sarabun',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing:border-box; }
        button { font-family:inherit; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:#f1f5f9; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* HEADER */}
      <header style={{height:54,background:"#fff",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:8,background:accentColor,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.3s"}}>
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M18.125 0.938194L32.7135 9.36084V26.4226L18.125 35.0618L3.28654 26.4226V9.57735L18.125 0.938194Z" fill="white" opacity="0.25" stroke="white" strokeWidth="2"/>
              <path d="M8 23C9 24 10 25 11.5 25C13.5 25 15 24 16.5 23M8 19C9 20 10 20 11 20C13 20 15 18.5 16.5 18C18 17 19 17 20 17M8 14C9 15 10 15 11 15C13 15 15.5 13.5 17 12.7C18.5 12 19.5 12 20.5 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{PROJECT_META.name}</div>
            <div style={{fontSize:10,color:"#94a3b8"}}>{PROJECT_META.nameEn} · Real-time Monitoring System</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <ProjectSwitcher currentProject={activeProject} onSwitch={handleProjectSwitch}/>
          <div style={{width:1,height:24,background:"#e2e8f0"}}/>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:"#94a3b8"}}>ข้อมูลจำลอง</div>
            <div style={{fontSize:10,color:"#047857",fontWeight:600}}>ข้อมูล ณ เวลา 06:00 น.</div>
          </div>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:14,color:accentColor,fontWeight:600}}>{time}</div>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"#ecfdf5",border:"1px solid #6ee7b7",padding:"4px 10px",borderRadius:4}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#047857",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:10,color:"#047857",fontWeight:700}}>ONLINE</span>
          </div>
        </div>
      </header>

      {/* TABS */}
      <nav style={{background:"#fff",borderBottom:"1px solid #e2e8f0",display:"flex",gap:0,padding:"0 24px",flexShrink:0}}>
        {tabs.map(({id,label,Icon})=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"10px 18px",fontSize:12,fontWeight:activeTab===id?700:500,color:activeTab===id?accentColor:"#64748b",border:"none",borderBottom:activeTab===id?`2px solid ${accentColor}`:"2px solid transparent",background:"none",cursor:"pointer",transition:"color 0.2s"}}>
            <Icon size={13} color={activeTab===id?accentColor:"#94a3b8"}/>{label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <div style={{flex:1,overflow:"hidden"}}>

        {/* DASHBOARD */}
        {activeTab==="dashboard"&&(
          <div style={{display:"grid",gridTemplateColumns:"210px 1fr 220px",height:"100%",overflow:"hidden"}}>
            <aside style={{overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:6,background:"#f8fafc",borderRight:"1px solid #e2e8f0"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {summaryStats.map((s,i)=>(
                  <div key={i} onClick={()=>setStatsPopup(s)}
                    style={{background:"#fff",borderRadius:7,padding:"8px 10px",cursor:"pointer",border:"1px solid #f1f5f9"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${s.color}40`;e.currentTarget.style.background=s.bg;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#f1f5f9";e.currentTarget.style.background="#fff";}}>
                    <s.Icon size={13} color={s.color}/>
                    <div style={{fontSize:16,fontWeight:700,color:s.color,marginTop:3,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>{s.value}</div>
                    <div style={{fontSize:9,color:"#94a3b8",marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
              {!isPathumthani&&(
                <div style={{background:"#fff",borderRadius:7,padding:"8px 10px",border:"1px solid #f1f5f9"}}>
                  <div style={{fontSize:8,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>สัญลักษณ์ค่าวัด</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 8px"}}>
                    {[["U","#1d4ed8","#eff6ff","ระดับน้ำเหนือ"],["D","#047857","#ecfdf5","ระดับน้ำท้าย"],["O","#7c3aed","#faf5ff","เปิดบาน (ม.พน.)"]].map(([l,c,bg,desc])=>(
                      <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                        <span style={{width:16,height:16,borderRadius:3,background:bg,border:`1px solid ${c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:c,flexShrink:0}}>{l}</span>
                        <span style={{fontSize:8,color:"#64748b",lineHeight:1.2}}>{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 4px 0"}}>
                <div style={{width:2,height:12,background:accentColor,borderRadius:1}}/>
                <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em"}}>สถานีทั้งหมด ({STATIONS.length})</span>
              </div>
              {STATIONS.map(st=>(<StatCard key={st.id} station={st} onClick={setSelectedStation} isPathumthani={isPathumthani}/>))}
            </aside>
            <main style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 14px",background:"#fff",borderBottom:"1px solid #e2e8f0",flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <IconMap size={13} color={accentColor}/>
                  <span style={{fontSize:11,fontWeight:700,color:accentColor}}>
                    {isPathumthani?"เส้นทางน้ำ":"ผังโครงการ"} – {PROJECT_META.name}
                  </span>
                </div>
                <span style={{fontSize:9,color:"#94a3b8"}}>คลิกที่สถานีเพื่อดูรายละเอียด</span>
              </div>
              <div style={{flex:1,overflow:"hidden",background:"#f8fafc",position:"relative"}}>
                <img
                  src={activeProject==="phaseecharoen"?"map01.jpg":activeProject==="pathumthani"?"pathumthanimap.jpg":"map.jpg"}
                  alt={`${isPathumthani?"เส้นทางน้ำ":"ผังโครงการ"} ${PROJECT_META.name}`}
                  style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"100%",height:"auto",maxHeight:"100%",display:"block"}}
                />
              </div>
              <div style={{padding:"6px 14px",background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",gap:14,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
                {[["#0369a1","สถานีวัดน้ำ"],["#1153ED","ปตร./สน.ปตร."]].map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}><div style={{width:11,height:11,borderRadius:2,background:c}}/>{l}</div>
                ))}
                <div style={{width:1,height:14,background:"#e2e8f0"}}/>
                {[["#047857","ปกติ"],["#b45309","เฝ้าระวัง"],["#b91c1c","วิกฤต"]].map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}><div style={{width:7,height:7,borderRadius:"50%",background:c}}/>{l}</div>
                ))}
              </div>
            </main>
            <aside style={{overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:7,background:"#f8fafc",borderLeft:"1px solid #e2e8f0"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"2px 0"}}>
                <div style={{width:2,height:12,background:"#7c3aed",borderRadius:1}}/>
                <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase"}}>กล้องวงจรปิด ({CAMERAS.length})</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {CAMERAS.map(cam=>{
                  const st=STATIONS.find(s=>s.id===cam.stationId);
                  return(<CameraFeed key={cam.id} cam={cam} station={st} onClick={()=>{if(st)setSelectedStation(st);}}/>);
                })}
              </div>
            </aside>
          </div>
        )}

        {activeTab==="waterinformation"&&(
          <WaterInformationTab stations={STATIONS} stationListForCompare={STATION_LIST_FOR_COMPARE} onStationClick={setSelectedStation} isPathumthani={isPathumthani}/>
        )}

        {activeTab==="compare"&&<CompareTab activeProject={activeProject}/>}

        {activeTab==="forecast"&&<ForecastTab stations={STATIONS}/>}

        {activeTab==="flowmap"&&(
          <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 20px",background:"#fff",borderBottom:"1px solid #e2e8f0",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <IconMap size={14} color={accentColor}/>
                <span style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>
                  {isPathumthani?"เส้นทางน้ำ":"ผังน้ำ"} – {PROJECT_META.name}
                </span>
              </div>
              <div style={{display:"flex",gap:14,alignItems:"center"}}>
                {!isPathumthani&&(
                  <>
                    {[["U","#1d4ed8"],["D","#047857"],["O","#7c3aed"]].map(([l,c])=>(
                      <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#64748b"}}>
                        <span style={{width:14,height:14,borderRadius:3,background:c+"18",border:`1px solid ${c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:c}}>{l}</span>
                        {l==="U"?"ระดับน้ำเหนือ":l==="D"?"ระดับน้ำท้าย":"เปิดบาน"}
                      </div>
                    ))}
                    <div style={{width:1,height:14,background:"#e2e8f0"}}/>
                  </>
                )}
                {[["#047857","ปกติ"],["#b45309","เฝ้าระวัง"],["#b91c1c","วิกฤต"]].map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}><div style={{width:8,height:8,borderRadius:"50%",background:c}}/>{l}</div>
                ))}
                <span style={{fontSize:10,color:"#94a3b8"}}>คลิกที่สถานีเพื่อดูรายละเอียด</span>
              </div>
            </div>
            <div style={{flex:1,overflow:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20}}>
              <div style={{position:"relative",width:"100%",maxWidth:"100%"}}>
                <img
                  src={`${activeProject}flow.jpg`}
                  alt={`${isPathumthani?"เส้นทางน้ำ":"ผังน้ำ"} ${PROJECT_META.name}`}
                  style={{width:"100%",height:"auto",display:"block"}}
                />
                {(()=>{const Overlay=FLOW_OVERLAYS[activeProject];return Overlay?<Overlay/>:null;})()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ MODALS ══════════════════════════════════════════════════════════════
          pathumthani → PathumthaniStationPopup (2 tab: ข้อมูลน้ำ / ข้อมูลพื้นที่)
          อื่นๆ      → StationModal เดิม
      ════════════════════════════════════════════════════════════════════════ */}
      {selectedStation && (
        isPathumthani
          ? <PathumthaniStationPopup station={selectedStation} onClose={()=>setSelectedStation(null)}/>
          : <StationModal station={selectedStation} onClose={()=>setSelectedStation(null)} isPathumthani={false}/>
      )}

      {statsPopup&&(
        <StatsPopup
          filterKey={statsPopup.filterKey}
          label={statsPopup.label}
          color={statsPopup.color}
          bg={statsPopup.bg}
          stations={STATIONS}
          onStationClick={st=>{setSelectedStation(st);}}
          onClose={()=>setStatsPopup(null)}
          isPathumthani={isPathumthani}
        />
      )}
    </div>
  );
}