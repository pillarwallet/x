import{c6 as y,c7 as U,c8 as Y,ae as n,c9 as S,ca as C,cb as E,cc as F,aK as a,aC as m,aD as b,aE as f,aM as x,aB as l,aF as v,aH as q,aI as Z,aG as J,aJ as Q,aY as oo,aV as ro}from"./main-C1sRb19f.js";import{Y as D,Z as A,A as e,$ as T,s as i,a0 as W,P as eo,a1 as N,W as k,u as $,S as w,V as M}from"./App-B0y76GMS.js";import{b as j}from"./tslib.es6-D9yd9Yl3.js";function P(o=y){const r=o===y?U:Y(o);return function(){const{store:s}=r();return s}}const to=P();function so(o=y){const r=o===y?to:P(o);return function(){return r().dispatch}}const ao=so();function no(o,r){var t=o.values,s=j(o,["values"]),c=r.values,d=j(r,["values"]);return D(c,t)&&D(s,d)}function R(o){var r=A(),t=r.formatMessage,s=r.textComponent,c=s===void 0?n.Fragment:s,d=o.id,g=o.description,p=o.defaultMessage,h=o.values,I=o.children,B=o.tagName,L=B===void 0?c:B,V=o.ignoreTag,K={id:d,description:g,defaultMessage:p},u=t(K,h,{ignoreTag:V});return typeof I=="function"?I(Array.isArray(u)?u:[u]):L?n.createElement(L,null,n.Children.toArray(u)):n.createElement(n.Fragment,null,u)}R.displayName="FormattedMessage";var X=n.memo(R,no);X.displayName="MemoizedFormattedMessage";const io=X,Lo=ao;function So(){const[o,r]=n.useState(window.innerWidth<S),[t,s]=n.useState(window.innerWidth<C),[c,d]=n.useState(window.innerWidth>=E),[g,p]=n.useState(window.innerWidth>=F);return n.useEffect(()=>{const h=()=>{r(window.innerWidth<S),s(window.innerWidth<C),d(window.innerWidth>=E),p(window.innerWidth>=F)};return h(),window.addEventListener("resize",h),()=>window.removeEventListener("resize",h)},[]),{isMobileXs:o,isMobile:t,isDesktop:c,isDesktopLg:g}}const Co=o=>a.jsx(io,{...o,id:o.id}),Eo=()=>{const{formatMessage:o,...r}=A();return{...r,formatMessage:o}},z=e`
  width: max-content;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${T}
  padding: 0 2rem;
  border-radius: 4px;
  transition: 0.3s linear;
  box-shadow: 0px 4px 34px rgba(30, 35, 40, 0.63);
  color: ${({theme:o})=>o.bgColors.dark200};
  background-color: ${({theme:o})=>o.colors.primary};
  &:hover {
    background-color: ${({theme:o})=>o.colors.primaryLight};
  }
`,G=e`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${T}
  font-weight: 500;
  border-radius: 8px;
  padding: 0 2.4rem;
  transition: 0.3s linear;
  color: ${({theme:o})=>o.colors.white};
  background-color: ${({theme:o})=>o.colors.primary};
  &:hover {
    background-color: ${({theme:o})=>o.colors.primaryLight};
  }
`,_=e`
  background-color: transparent;
  color: ${({theme:o})=>o.colors.primary};
  border: 2px solid ${({theme:o})=>o.colors.primary};
  &:hover {
    color: ${({theme:o})=>o.bgColors.dark100};
    background-color: ${({theme:o})=>o.colors.primary};
  }
`,O=e`
  background-color: transparent;
  color: ${({theme:o})=>o.colors.primary};
  border: 1.5px solid ${({theme:o})=>o.colors.primary};
  &:hover {
    color: ${({theme:o})=>o.colors.primaryLight};
    border: 1.5px solid ${({theme:o})=>o.colors.primaryLight};
    background: ${({theme:o})=>o.colors.white};
  }
`,co=e`
  cursor: not-allowed;
  background: ${({theme:o})=>o.colors.primaryFade};
  &:hover {
    background: ${({theme:o})=>o.colors.primaryFade};
  }
`,Fo=i.button`
  ${({entrypoint:o,variant:r})=>o===m.MAIN&&e`
      ${z}
      ${r==="bordered"&&e`
        ${_}
      `}
      ${r==="grey"&&e`
        color: ${({theme:t})=>t.colors.white};
        background-color: ${({theme:t})=>t.colors.grey801};
        &:hover {
          background-color: ${({theme:t})=>t.colors.grey800};
        }
      `}
    `}

  ${({entrypoint:o,variant:r})=>b(o)&&e`
      ${G}
      ${r==="bordered"&&e`
        ${O}
      `}
    `}

  ${({disabled:o})=>o&&e`
      ${co}
    `}

  ${({width:o})=>o&&`width: ${o};`}
  ${({height:o})=>o&&`height: ${o};`}
  ${({sizeFont:o})=>o&&`font-size: ${o};`}

  ${({entrypoint:o})=>f(o)&&e`
      ${po}
      height: 56px;

      @media (${x.M}) {
        height: 65px;
      }
      @media (${x.XL}) {
        height: 60px;
      }
    `}
`,Do=i.a`
  ${({entrypoint:o,variant:r})=>o===m.MAIN&&e`
      ${z}
      ${r==="bordered"?e`
            ${_}
          `:null}
    `}

  ${({entrypoint:o,variant:r})=>b(o)?e`
          ${G}
          ${r==="bordered"?e`
                ${O}
              `:null}
        `:null}

      ${({entrypoint:o,theme:r})=>f(o)&&e`
      width: 100%;
      border-radius: 16px;
      text-align: center;
      background: ${r.colors.primary100};
      ${W}
      font-weight: 500;
      color: ${r.colors.black};
      display: flex;
      align-items: center;
      justify-content: center;

      height: 56px;

      @media (${x.M}) {
        height: 65px;
      }
      @media (${x.XL}) {
        height: 60px;
      }

      &:hover {
        transition: 250ms linear;
        background: ${r.colors.primary300};
      }
    `}

  ${({width:o})=>o&&`width: ${o};`}
  ${({height:o})=>o&&`height: ${o};`}
  ${({sizeFont:o})=>o&&`font-size: ${o};`}
  &:hover {
    cursor: pointer;
  }
`,jo=i.button`
  ${eo}
  font-weight: 500;
  transition: 0.3s linear;

  ${({entrypoint:o})=>o===m.MAIN&&e`
      padding: 0.6rem 1.6rem;
      margin: 0 1.6rem;
      border-radius: 4px;
      border: 1px solid ${({theme:r})=>r.colors.border};
      background: ${({theme:r})=>r.bgColors.secondary};
      &:hover {
        color: ${({theme:r})=>r.colors.primary};
      }
    `}

  ${({entrypoint:o})=>b(o)&&e`
      padding: 0.8rem 1rem;
      margin: 0 0.8rem;
      border-radius: 8px;
      color: ${({theme:r})=>r.colors.primary};
      background-color: ${({theme:r})=>r.colors.white};
      border: 1px solid ${({theme:r})=>r.colors.primary};
      &:hover {
        color: ${({theme:r})=>r.colors.white};
        background-color: ${({theme:r})=>r.colors.primary};
      }
    `}

    ${({entrypoint:o})=>f(o)&&e`
      ${N}
      padding: 8px 10px;
      margin: 0 16px;
      border-radius: 8px;
      color: ${({theme:r})=>r.colors.primary};
      background-color: ${({theme:r})=>r.colors.white};
      border: 1px solid ${({theme:r})=>r.colors.primary};
      &:hover {
        color: ${({theme:r})=>r.colors.white};
        background-color: ${({theme:r})=>r.colors.primary};
      }
    `}
`,Ao=i.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1.8rem;
  border-radius: 50%;
  background: ${({theme:o})=>o.bgColors.secondary};
  svg {
    path {
      stroke: ${({theme:o})=>o.colors.grey700};
    }
  }
  @media (${l.SM}) {
    &:hover {
      background: ${({theme:o})=>o.colors.secondary};
      svg {
        path {
          stroke: ${({theme:o})=>o.colors.white};
        }
      }
    }
  }
`,lo=e`
  cursor: pointer;
  transition: 0.3s linear;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
`,go=e`
  background: ${({theme:o})=>v(o.colors.black,.08)};
  color: ${({theme:o})=>v(o.colors.black,.4)};
  cursor: not-allowed;
`,po=e`
  ${W}
  padding: 20px 32px;
  border-radius: 16px;
  background: ${({theme:o})=>o.colors.accent};
  color: ${({theme:o})=>o.colors.white};
  ${lo}

  &:hover {
    background: #c51631;
  }

  &:disabled {
    ${go}
  }
`,ho="data:image/svg+xml,%3csvg%20width='16'%20height='17'%20viewBox='0%200%2016%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M9.92639%202.88652C9.34639%202.71319%208.70639%202.59985%207.99973%202.59985C4.80639%202.59985%202.21973%205.18652%202.21973%208.37985C2.21973%2011.5799%204.80639%2014.1665%207.99973%2014.1665C11.1931%2014.1665%2013.7797%2011.5799%2013.7797%208.38652'%20stroke='%23053636'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",uo="data:image/svg+xml,%3csvg%20class='loader'%20viewBox='0%200%2050%2050'%3e%3ccircle%20cx='25'%20cy='25'%20r='20'%20stroke='%23588DFF'%20class='circle-loader'%3e%3c/circle%3e%3cdefs%3e%3clinearGradient%20id='gradient'%20x1='0%25'%20y1='0%25'%20x2='0%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20style='stop-color:%23CCDCFF;%20stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:%23588DFF;%20stop-opacity:1'%20/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",$o="data:image/svg+xml,%3csvg%20width='64'%20height='45'%20viewBox='0%200%2064%2045'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M1%200.999998L32.4562%2044L63%201L38.4179%201L1%200.999998Z'%20stroke='%236B6B6B'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_small'%20x1='-5.06522'%20y1='39.8387'%20x2='43.8294'%20y2='2.3658'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%238B89FE'/%3e%3cstop%20offset='1'%20stop-color='%234B51E2'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",mo=k`
  0% {
    stroke-dasharray: 250;
    stroke-dashoffset: 500;
  }
  100% {
    stroke-dasharray: 250;
    stroke-dashoffset: -500 ;
  }
`,bo=i.div`
  display: none;
  width: 100%;
  height: 100%;
  pointer-events: none;
  ${({isVisible:o})=>o&&e`
      display: flex;
      align-items: center;
      justify-content: center;
    `}
  ${({position:o})=>o&&e`
      position: ${o};
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 99;
    `}
  ${({entrypoint:o,transparentBg:r})=>o==m.MAIN&&e`
      ${r&&e`
        background: ${({theme:t})=>t.bgColors.dark200};
        opacity: 0.8;
      `}
    `}
  ${({entrypoint:o,transparentBg:r})=>(b(o)||f(o))&&e`
      ${r&&e`
        background: ${({theme:t})=>t.colors.white};
        opacity: 0.8;
      `}
    `}
`,fo=i.div`
  stroke-dasharray: 0;
  stroke-dashoffset: 0;
  animation: ${mo} 3s linear normal infinite;
  svg {
    g,
    path {
      stroke: ${({theme:o})=>o.colors.secondary};
    }
  }
`,yo=k`
0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`,H=k`
100% {
    transform: rotate(360deg);
  }
`,xo=i.div`
  svg {
    circle {
      fill: none;
      stroke-width: 10;
      transform-origin: center;
      animation: ${H} 2s linear infinite, ${yo} 1.5s ease-in-out infinite;
      stroke-linecap: round;
    }
  }
`,ko=k`
0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 120, 150;
    stroke-dashoffset: 50;
  }
  100% {
    stroke-dasharray: 120, 150;
    stroke-dashoffset: 150;
  }
`,wo=i.div`
  svg {
    path {
      fill: none;
      stroke-width: 3;
      transform-origin: center;
      animation: ${H} 1.5s linear infinite,
        ${ko} 1.5s linear infinite;
      stroke-linecap: round;
    }
  }
`,vo=({width:o,height:r})=>{const t=$(q),s=$(Z),c=$(J);return a.jsxs(a.Fragment,{children:[c?a.jsx(fo,{children:a.jsx(w,{src:$o,title:"Loader",width:o||40,height:r||40})}):null,t?a.jsx(xo,{children:a.jsx(w,{src:uo,height:r||40,width:o||40,title:"Loader"})}):null,s?a.jsx(wo,{children:a.jsx(w,{src:ho,height:r||40,width:o||40,title:"Loader"})}):null]})},To=({isVisible:o=!1,transparentBg:r,position:t="absolute",width:s,height:c})=>{const d=$(Q),g=$(oo),p=()=>g===ro.XUMM?"fixed":t;return a.jsx(bo,{entrypoint:d,isVisible:o,position:p(),transparentBg:r,children:a.jsx(vo,{width:s,height:c})})},Wo=e`
  @media (${l.XS}) {
    padding: 0 1.6rem;
  }
  @media (${l.SM}) {
    padding: 0 3.2rem;
  }
  @media (${l.MD}) {
    padding: 0 4.3rem;
  }
`,No=i.span`
  ${M}
  font-weight: 500;
  color: ${({theme:o})=>o.colors.grey300};
  ${({entrypoint:o})=>o==m.MAIN&&e`
      color: ${({theme:r})=>r.colors.grey300};
    `}
  ${({entrypoint:o})=>b(o)&&e`
      color: ${({theme:r})=>r.bgColors.dark100};
    `}

    ${({entrypoint:o,theme:r})=>f(o)&&e`
      ${N}
      font-weight: 500;
      color: ${v(r.colors.black,.8)};
      grid-area: title;
    `}
`,Po=i.span`
  ${M}
  font-weight: 500;
  color: ${({theme:o})=>o.colors.white};
`,Ro=e`
  display: inline-block;
  padding: 0 0.6rem;
  border-radius: 3px;
  color: ${({theme:o})=>o.colors.secondary};
  border: 1.5px solid ${({theme:o})=>o.colors.secondary};
`,Xo=e`
  &::-webkit-scrollbar {
    appearance: none;
    &:hover {
      cursor: pointer;
    }
    &:vertical {
      width: 3px;
    }
    &:horizontal {
      height: 3px;
    }
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: ${({theme:o})=>o.colors.grey800};
  }
`,zo=e`
  &::-webkit-scrollbar {
    appearance: none;
    background-color: ${({theme:o})=>o.bgColors.dark400};
    &:hover {
      cursor: pointer;
    }
    &:vertical {
      width: 3px;
    }
    &:horizontal {
      height: 3px;
    }
  }
  &::-webkit-scrollbar-thumb {
    border: 3px solid transparent;
    background-color: ${({theme:o})=>o.colors.primary};
  }
`,Go=e`
  padding-left: 1.6rem;
  padding-right: 1.6rem;
  @media (${l.SM}) {
    padding-left: 3rem;
    padding-right: 3rem;
  }
  @media (${l.MD}) {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
  }
  @media (${l.LG}) {
    padding-left: 3.4rem;
    padding-right: 3.4rem;
  }
`,_o=i.div`
  ${M}
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 1.2rem;
  & a {
    color: ${({theme:o})=>o.colors.secondary};
  }
`;export{Ao as C,Co as F,To as L,Fo as P,_o as T,So as a,Eo as b,Do as c,z as d,jo as e,zo as f,vo as g,Po as h,No as i,Ro as j,Wo as o,Xo as s,Go as t,Lo as u};
