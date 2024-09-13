import{ae as n,cX as p,aK as d}from"./main-Bp11xWcs.js";import{u as f}from"./trustpilot-DZhaPuDo.js";import{s as c,A as r}from"./App-D9naWC8m.js";import{s as y}from"./mixins-i12hrTLx.js";const x=c.div`
  opacity: 0;
  pointer-events: none;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s linear;
  background-color: ${({theme:e})=>e.bgColors.overlay};
  ${({isOpen:e})=>e&&r`
      opacity: 1;
      z-index: 1;
      pointer-events: all;
    `}
  ${({isMobile:e})=>e&&r`
      width: 100%;
      align-items: flex-end;
    `}
`,g=c.div`
  overflow: hidden;
  border-radius: 6px;
  background: ${({theme:e})=>e.bgColors.primary};
  ${y};
  margin: 0 2rem;
  ${({isMobile:e})=>e&&r`
      width: 100%;
      margin: 0;
    `}
`,k=({isOpen:e,onClose:o,children:l,isMobile:i})=>{const m=document.getElementById("root"),s=n.useRef(null),a=n.useId();return n.useEffect(()=>{const t=u=>{u.key==="Escape"&&o()};return document.addEventListener("keydown",t),()=>{document.removeEventListener("keydown",t)}},[o]),f(s,t=>{t.target.id!==a&&o()}),m?p.createPortal(d.jsx(x,{isOpen:e,isMobile:!!i,children:d.jsx(g,{id:a,ref:s,isMobile:!!i,children:l})}),document.body):null};export{k as M};
