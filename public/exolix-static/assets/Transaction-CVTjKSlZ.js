import{ae as j,aB as f,aC as C,aD as v,aE as w,aG as _,aJ as S,cO as Mo,aK as o,bP as J,_ as Dt,bh as b,cI as Ce,aH as ie,aI as ae,cP as Nt,bg as z,cQ as ko,aY as Eo,b5 as Te,br as je,aV as So,aN as et,aU as Ot,bb as Ht,bD as Vt,aF as Me,bf as tt,bB as Bo,aT as Io,cR as Ao,cE as Gt,cS as Ro,b_ as _o}from"./main-CDKDnvW7.js";import{h as Po,t as Qt,b as ze,a as ge,F as m,u as ke,P as Fo,i as zt,j as Ze,c as Lo,s as Do,L as No}from"./mixins-CNu8Cr8X.js";import{b as Zt,m as Xt,n as Oo,o as Ho}from"./exchangeSelectors-DP50MkAx.js";import{m as Vo,n as Xe,o as Ee,p as ue,q as Go,r as Qo,t as le,u as pe,v as ce,w as Wt,x as zo,y as Zo,z as Xo,A as Wo,B as Yo,C as Uo,D as Yt,F as Ko,s as Jo,G as qo,H as er}from"./transactionSelectors-Bz099tFA.js";import{c as Ut}from"./transactionSlice-BLjUsgVM.js";import{s as d,V as P,b as B,A as i,a3 as V,u as c,S as E,O as xe,a8 as Kt,a as me,c as Jt,a9 as We,a4 as tr,P as fe,a1 as or,aa as de,ab as rr,ac as nr,ad as sr,a0 as qt,W as eo}from"./App-DCKfOddi.js";import{P as ir,S as ar,d as ot,T as rt,g as to,f as Ye,C as se,e as nt,F as oo,a as lr,h as cr}from"./StepsIndicator-DBFPQONH.js";import{u as dr}from"./useIsomorphicLayoutEffect-B0TE0m4X.js";import{d as hr}from"./dropdown-DvVsuBFR.js";import{g as gr,r as ur}from"./txToCookies-CjVnD0W0.js";import{l as pr,u as xr}from"./unlocked-CVJBCS6B.js";function mr(e){const[t,n]=j.useState(!!e),r=j.useCallback(()=>n(!0),[]),s=j.useCallback(()=>n(!1),[]),a=j.useCallback(()=>n(h=>!h),[]);return{value:t,setValue:n,setTrue:r,setFalse:s,toggle:a}}function fr(e){const[t,n]=j.useState(e||0);return{count:t,increment:()=>n(h=>h+1),decrement:()=>n(h=>h-1),reset:()=>n(e||0),setCount:n}}function vr(e,t){const n=j.useRef(e);dr(()=>{n.current=e},[e]),j.useEffect(()=>{if(!t&&t!==0)return;const r=setInterval(()=>n.current(),t);return()=>clearInterval(r)},[t])}function $r(e){let t=!1,n,r,s,a;"seconds"in e?(console.warn("[useCountdown:DEPRECATED] new interface is already available (see https://usehooks-ts.com/react-hook/use-countdown), the old version will retire on usehooks-ts@3."),t=!0,n=e.seconds,r=e.interval,s=e.isIncrement):{countStart:n,intervalMs:r,isIncrement:s,countStop:a}=e,r=r??1e3,s=s??!1,a=a??0;const{count:h,increment:l,decrement:u,reset:g}=fr(n),{value:p,setTrue:x,setFalse:$}=mr(!1),y=()=>{$(),g()},M=j.useCallback(()=>{if(h===a){$();return}s?l():u()},[h,a,u,l,s,$]);return vr(M,p?r:null),t?[h,{start:x,stop:$,reset:y}]:[h,{startCountdown:x,stopCountdown:$,resetCountdown:y}]}const Cr=d.div`
  position: relative;
  width: 64px;
  height: 32px;
`,wr=d.div`
  height: 100%;
  display: flex;
  align-items: center;
  span {
    ${P}
    font-weight: 500;
  }
  @media (${f.SM}) {
    span {
      ${B}
    }
  }
  ${({entrypoint:e,stopTimer:t,isRefunded:n})=>e==C.MAIN&&i`
      width: 100%;
      height: 100%;
      justify-content: center;
      border-radius: 4px;
      background: ${({theme:r})=>r.bgColors.secondary};
      ${t&&i`
        span {
          color: ${({theme:r})=>r.colors.error};
        }
      `}
      ${n&&i`
        span {
          color: ${({theme:r})=>r.colors.error};
        }
      `}
    `}
  ${({entrypoint:e,stopTimer:t,isRefunded:n})=>v(e)&&i`
      justify-content: flex-end;
      span {
        font-weight: 600;
        color: ${({theme:r})=>r.colors.primary};
      }
      ${t&&i`
        span {
          color: ${({theme:r})=>r.colors.error};
        }
      `}
      ${n&&i`
        span {
          color: ${({theme:r})=>r.colors.error};
        }
      `}
    `}

    ${({entrypoint:e})=>w(e)&&i`
      justify-content: flex-end;
      span {
        ${V}
        font-weight: 500;
        color: ${({theme:t})=>t.colors.accent};
      }
    `}
`,yr=d.svg`
  position: absolute;
  top: 0;
  border-radius: 4px;
  path {
    stroke: ${({theme:e})=>e.colors.secondary};
    ${({stopTimer:e})=>e&&i`
        stroke: transparent;
      `}
  }
`,jr=({createdAt:e,isOverdue:t,isRefunded:n})=>{const r=c(_),s=c(S),a=c(Mo),h=t||n,l=Math.floor(new Date(e).getTime()/1e3),u=Math.floor(Date.now()/1e3),g=l+a-u,[p]=j.useState(1e3),[x,{startCountdown:$,stopCountdown:y,resetCountdown:M}]=$r({countStart:g,intervalMs:p}),T=j.useRef(null),k=!!(x<1||h);j.useEffect(()=>(k?y():$(),()=>{M()}),[$,M,y,g,k]),j.useEffect(()=>{const Y=T.current;if(Y){const R=Y.querySelector("#timerSvgPath"),Z=R.getTotalLength();R.style.strokeDasharray=`${Z} ${Z}`,k?R.style.strokeDashoffset=`${a*Z}`:R.style.strokeDashoffset=`${(a-g)/a*Z}`}},[g,k,a]);const N=()=>{const Y=Math.floor(x/60),R=x%60;return`${Y}:${R.toString().padStart(2,"0")}`};return o.jsxs(Cr,{children:[o.jsx(wr,{entrypoint:s,stopTimer:k,isRefunded:n,children:o.jsx("span",{children:k?"00:00":N()})}),r?o.jsx(yr,{ref:T,stopTimer:k,viewBox:"0 0 66 34",children:o.jsx("path",{id:"timerSvgPath",d:"M 4,0 L 62,0 Q 66,0 66,4 L 66,30 Q 66,34 62,34 L 4,34 Q 0,34 0,30 L 0,4 Q 0,0 4,0",strokeWidth:"4",fillOpacity:"0"})}):null]})},br="data:image/svg+xml,%3csvg%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M8.21136%202.82628C8.64674%202.05739%209.35326%202.05842%209.7881%202.82628L16.3185%2014.3578C16.7539%2015.1267%2016.3787%2015.75%2015.4855%2015.75H2.51468C1.61922%2015.75%201.24685%2015.1257%201.68165%2014.3578L8.21136%202.82628Z'%20stroke='%2364F0BF'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9%2013.875C9.41421%2013.875%209.75%2013.5392%209.75%2013.125C9.75%2012.7108%209.41421%2012.375%209%2012.375C8.58579%2012.375%208.25%2012.7108%208.25%2013.125C8.25%2013.5392%208.58579%2013.875%209%2013.875Z'%20fill='%2364F0BF'/%3e%3cpath%20d='M9%207.125V10.875'%20stroke='%2364F0BF'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",Tr=d.div`
  display: flex;
  overflow: hidden;
  border-radius: 4px;
  margin-top: 2rem;
  background: ${({theme:e})=>e.bgColors.additional};
  ${({$isRtl:e})=>e&&i`
      background: ${({theme:t})=>t.bgColors.additionalRtl};
    `}
`,Mr=d.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1.7rem;
  border-left: 2px solid ${({theme:e})=>e.colors.attention};
  @media (${f.SM}) {
    padding: 2rem;
  }
`,kr=d.div`
  margin-right: 1rem;
  svg {
    path {
      stroke: ${({theme:e})=>e.colors.attention};
    }
  }
  @media (${f.SM}) {
    margin-right: 2rem;
  }
  ${({$isRtl:e})=>e?i`
          margin-right: 0;
          margin-left: 1rem;
          @media (${f.SM}) {
            margin-right: 0;
            margin-left: 2rem;
          }
        `:null}
`,Er=({comment:e})=>{const t=c(_),n=c(J);return!e||!t?null:o.jsx(Tr,{$isRtl:n,children:o.jsxs(Mr,{children:[o.jsx(kr,{$isRtl:n,children:o.jsx(E,{src:br})}),o.jsx(Po,{children:e})]})})},Sr=d.div`
  border-radius: 6px 6px 0 0;
  overflow: hidden;
`,Br=d.div`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${Qt}
      padding-top: 1.4rem;
      padding-bottom: 2.4rem;
    `}
  ${({entrypoint:e,isCanceled:t})=>(v(e)||w(e))&&i`
      padding: 1.6rem 1.2rem 0.8rem 1.6rem;
      @media (${f.S}) {
        padding: 2.4rem 2rem 0.8rem 2.4rem;
      }
      ${t&&i`
        padding: 1.6rem 1.2rem 0 1.6rem;
        @media (${f.S}) {
          padding: 2.4rem 2rem 0 2.4rem;
        }
      `}
    `}
`,Ir=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,Ar=j.lazy(()=>Dt(()=>import("./TxEmailSubscribe-CYFT4Vpm.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]))),Rr=j.lazy(()=>Dt(()=>import("./TxStatusInfo-gMt9-_Hg.js"),__vite__mapDeps([12,1,3,4,5,9,10,8,13,11,7,14,15,16,17]))),_r=({children:e,comment:t})=>{const n=c(Vo),r=c(_),s=c(Xe),a=c(Ee),h=c(ue),l=c(Zt),u=c(Xt),g=c(S),p=ze(),x=()=>{switch(l){case b.STEP_3:return b.STEP_3;case b.STEP_4:return b.STEP_4;case b.STEP_5:return b.STEP_5;default:return b.STEP_3}},$=()=>{switch(l){case b.STEP_3:return Ce.STEP_3;case b.STEP_4:return Ce.STEP_4;case b.STEP_5:return Ce.STEP_5;default:return Ce.STEP_3}};return o.jsxs(Sr,{children:[r?o.jsx(ir,{step:l,maxSteps:5,isError:s}):null,o.jsxs(Br,{entrypoint:g,isCanceled:s,children:[o.jsxs(Ir,{children:[o.jsx(ar,{step:l,maxSteps:5,title:p.formatMessage({id:`exchangeStep.item${x()}`,defaultMessage:$()})}),u?o.jsx(jr,{isOverdue:h,isRefunded:a,createdAt:n||""}):null]}),o.jsx(Er,{comment:t}),r&&u&&!h?o.jsx(Ar,{}):null,s?o.jsx(Rr,{}):null,e]})]})},Pr=d.div`
  overflow: hidden;
  ${({entrypoint:e,isLoading:t,$isRtl:n})=>e==C.MAIN&&i`
      border-radius: 6px;
      background: ${({theme:r})=>r.bgColors.primary};
      ${t&&i`
        background: ${({theme:r})=>r.bgColors.dark200};
      `}
      ${n?i`
            background: ${({theme:r})=>r.bgColors.primaryRtl};
          `:null}
    `}
  ${({entrypoint:e,theme:t})=>v(e)&&i`
      ${ot}
      background-color: ${t.colors.white};
    `}

    ${({entrypoint:e})=>w(e)&&i`
      ${ot}
      background-color: #F5FAF8
    `}
`,Fr=d.div`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${Qt};
      padding-bottom: 1.6rem;
      @media (${f.SM}) {
        padding-bottom: 3rem;
      }
      @media (${f.MD}) {
        padding-bottom: 2.4rem;
      }
      @media (${f.LG}) {
        padding-bottom: 3.4rem;
      }
    `}
  ${({entrypoint:e})=>(v(e)||w(e))&&i`
      padding: 0 1.6rem 1.6rem 1.6rem;
      @media (${f.S}) {
        padding: 0 2.4rem 2.4rem 2.4rem;
      }
    `}
`,Lr="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='12'%20cy='12'%20r='11'%20stroke='%236FF7C7'%20stroke-width='2'/%3e%3cpath%20d='M7.28516%2012.0005L10.2852%2014.5719L16.7137%208.14337'%20stroke='%236FF7C7'%20stroke-width='2'/%3e%3c/svg%3e",Dr="data:image/svg+xml,%3csvg%20width='16'%20height='10'%20viewBox='0%200%2016%2010'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M8%200.231201C4.94303%200.231201%202.17081%201.9037%200.125192%204.62028C-0.0417306%204.84284%20-0.0417306%205.15377%200.125192%205.37634C2.17081%208.09619%204.94303%209.76869%208%209.76869C11.057%209.76869%2013.8292%208.09619%2015.8748%205.37961C16.0417%205.15705%2016.0417%204.84611%2015.8748%204.62355C13.8292%201.9037%2011.057%200.231201%208%200.231201ZM8.21929%208.35803C6.19004%208.48567%204.51427%206.81318%204.64191%204.78065C4.74665%203.10488%206.10494%201.74659%207.78071%201.64186C9.80996%201.51421%2011.4857%203.18671%2011.3581%205.21923C11.2501%206.89173%209.89179%208.25002%208.21929%208.35803ZM8.11783%206.80663C7.02465%206.87536%206.1213%205.97529%206.19331%204.88212C6.24895%203.97877%206.9821%203.2489%207.88545%203.18998C8.97862%203.12125%209.88197%204.02132%209.80996%205.1145C9.75105%206.02112%209.0179%206.75099%208.11783%206.80663Z'%20fill='%23C0C0C7'%3e%3c/path%3e%3c/svg%3e",Nr=e=>{const[t,n]=j.useState({x:!1,y:!1}),r=j.useRef(null);return j.useLayoutEffect(()=>{const s=()=>{if(e.current){const{offsetWidth:a,scrollWidth:h,scrollHeight:l}=e.current,u=h>a,g=l>30;n({x:u,y:g})}else n({x:!1,y:!1})};return r.current&&r.current.disconnect(),r.current=new ResizeObserver(s),e.current&&r.current.observe(e.current),s(),()=>{r.current&&r.current.disconnect()}},[e]),t},Or="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.8503%201.66675H9.94199C8.05866%201.66675%206.53366%202.86675%206.46699%205.00841C6.51699%205.00841%206.55866%205.00008%206.60866%205.00008H11.517C13.442%205.00008%2015.0003%206.25008%2015.0003%208.48342V14.0251C15.0003%2014.0751%2014.992%2014.1167%2014.992%2014.1584C16.8503%2014.1001%2018.3337%2012.8667%2018.3337%2010.6917V5.15008C18.3337%202.91675%2016.7753%201.66675%2014.8503%201.66675Z'%20fill='%23053636'%20fill-opacity='0.24'/%3e%3cpath%20d='M5.15033%206.23674C3.22533%206.23674%201.66699%207.48674%201.66699%209.72008L1.66699%2014.8501C1.66699%2017.0834%203.22533%2018.3334%205.15033%2018.3334H10.0587C11.9837%2018.3334%2013.542%2017.0834%2013.542%2014.8501V8.73674C13.542%207.35603%2012.4227%206.23674%2011.042%206.23674H5.15033Z'%20fill='%23053636'%20fill-opacity='0.24'/%3e%3c/svg%3e",Re="data:image/svg+xml,%3csvg%20width='13'%20height='13'%20viewBox='0%200%2013%2013'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M2%201.91797V1.5C2%200.947715%202.44772%200.5%203%200.5H11C11.5523%200.5%2012%200.947715%2012%201.5V9.5C12%2010.0523%2011.5523%2010.5%2011%2010.5H10.688'%20stroke='%23ABB6C1'/%3e%3cpath%20d='M8.5%203H1.5C0.947715%203%200.5%203.44772%200.5%204V11C0.5%2011.5523%200.947715%2012%201.5%2012H8.5C9.05229%2012%209.5%2011.5523%209.5%2011V4C9.5%203.44772%209.05229%203%208.5%203Z'%20stroke='%23ABB6C1'/%3e%3c/svg%3e",_e="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='17'%20height='16'%20viewBox='0%200%2017%2016'%20fill='none'%3e%3cpath%20d='M15.4866%205.33301L8.82773%2011.9919L5.24219%208.40633'%20stroke='%2364F0BF'%20stroke-width='1.6'/%3e%3cpath%20d='M11.135%205.33301L4.47617%2011.9919L0.890625%208.40633'%20stroke='%2364F0BF'%20stroke-width='1.6'/%3e%3c/svg%3e";function Hr(){const[e,t]=j.useState(null);return[e,async r=>{if(!(navigator!=null&&navigator.clipboard))return console.warn("Clipboard not supported"),!1;try{return await navigator.clipboard.writeText(r),t(r),!0}catch(s){return console.warn("Copy failed",s),t(null),!1}}]}const Pe=d.button`
  height: 20px;
  width: 20px;
  line-height: 0;
  svg {
    path {
      transition: 0.3s linear;
    }
  }
  &:hover svg {
    path {
      stroke: ${({theme:e})=>e.colors.primary};
    }
  }
  ${({entrypoint:e})=>v(e)&&i`
      svg {
        path {
          stroke: ${({theme:t})=>t.colors.grey400};
        }
      }
    `}
`,Vr=d.button`
  position: relative;
  height: 64px;
  min-width: 118px;
  width: max-content;
  padding: 0 1rem;
  ${xe}
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border-radius: 0 3px 3px 0;
  transition: 0.3s linear;
  color: ${({theme:e})=>e.colors.primary};
  background: ${({theme:e})=>e.bgColors.primary};
  ${({$isRtl:e})=>e&&i`
      border-radius: 3px 0 0 3px;
    `}
  @media (${f}) {
    width: 140px;
  }
  svg {
    margin-top: 0.2rem;
    min-width: 11.5px;
    path {
      stroke: ${({theme:e})=>e.colors.primary};
    }
  }
  &:hover {
    background: ${({theme:e})=>e.colors.primaryLight};
    color: ${({theme:e})=>e.bgColors.dark200};
    svg {
      path {
        stroke: ${({theme:e})=>e.bgColors.dark200};
      }
    }
  }
`,Se=({copyValue:e,template:t="default"})=>{const n=c(ie),r=c(ae),s=c(_),a=c(Oo),h=c(J),l=c(S),[u,g]=Hr(),p=ze(),{isMobile:x}=ge();j.useEffect(()=>{let k;return u&&(k=setTimeout(()=>{g("")},3e3)),()=>{clearTimeout(k)}},[u,g]),j.useEffect(()=>{a&&g("")},[a,g]);const $=()=>{e&&g(e)},y=u?"btn.copied.tooltip":"btn.copy.tooltip",M=u?"Copied to your clipboard":"Copy to your clipboard",T=()=>{if(t==="default")return o.jsxs(o.Fragment,{children:[s?o.jsx(rt,{text:p.formatMessage({id:y,defaultMessage:M}),position:{top:"-56px"},transform:x?"translate(-100%, 0)":"",children:o.jsx(Pe,{entrypoint:l,onClick:$,children:u?o.jsx(E,{src:_e,title:"Checkmark"}):o.jsx(E,{src:Re,title:"Copy"})})}):null,n?o.jsx(Pe,{entrypoint:l,onClick:$,children:u?o.jsx(E,{src:_e,width:17,height:17,title:"Checkmark"}):o.jsx(E,{src:Re,width:17,height:17,title:"Copy"})}):null,r?o.jsx(Pe,{entrypoint:l,onClick:$,children:u?o.jsx(E,{src:to,width:20,height:20,title:"Checkmark"}):o.jsx(E,{src:Or,width:20,height:20,title:"Copy"})}):null]});if(t==="confirmingStep")return o.jsx(rt,{text:p.formatMessage({id:y,defaultMessage:M}),position:{top:"-56px"},transform:x?"translate(-100%, 0)":"",children:o.jsxs(Vr,{id:"copy_adress_click",onClick:$,$isRtl:h,children:[u?o.jsx(E,{src:_e,title:"Checkmark"}):o.jsx(E,{src:Re,title:"Copy"}),u?o.jsx(m,{id:"btn.copied"}):o.jsx(m,{id:"btn.copy"})]})})};return o.jsx(o.Fragment,{children:T()})},Gr=d.div`
  display: inline-flex;
  gap: 0.6rem;
  overflow: hidden;
`,Qr=d.button`
  align-self: flex-start;
  ${({entrypoint:e})=>e==C.MAIN&&i`
      padding-top: 0.3rem;
    `}
  ${({entrypoint:e})=>(v(e)||w(e))&&i`
      padding-top: 0.1rem;
    `}
  @media (${f.SM}) {
    svg {
      path {
        transition: 0.3s linear;
      }
    }
    &:hover {
      svg {
        path {
          fill: ${({theme:e})=>e.colors.primary};
        }
      }
    }
  }
  ${({show:e})=>e&&i`
      svg {
        path {
          fill: ${({theme:t})=>t.colors.primary};
        }
      }
    `}
`,ro=i`
  overflow: hidden;
  text-overflow: ellipsis;
  ${({show:e})=>e&&i`
      overflow: unset;
      text-overflow: unset;
      word-break: break-word;
    `}
`,st=d.span`
  ${ro}
  ${B}
  font-weight: 500;

  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

  ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${V}
      font-weight: 500;
      color: ${t.colors.black};
    `}
`,zr=d.a`
  ${ro}
  ${B}
  font-weight: 500;
  text-decoration: underline;
  color: ${({theme:e})=>e.colors.secondary};
`,K=({address:e,type:t="default",action:n="expand",link:r})=>{const s=c(S),[a,h]=j.useState(!1),{isMobileXs:l}=ge(),u=j.useRef(null),g=Nr(u),x=Nt(e,l?6:10),$=g.x||g.y;return o.jsxs(Gr,{children:[t==="default"?o.jsx(st,{entrypoint:s,ref:u,show:a,children:e}):null,t==="link"?o.jsx(zr,{entrypoint:s,ref:u,show:a,href:r,target:"_blank",rel:"noopener noreferrer",children:e}):null,t==="short"?o.jsx(st,{entrypoint:s,ref:u,show:a,children:a?e:x}):null,o.jsxs(o.Fragment,{children:[n==="expand"&&$?o.jsx(Qr,{show:a,entrypoint:s,onClick:()=>h(y=>!y),children:o.jsx(E,{src:Dr})}):null,n==="copy"?o.jsx(Se,{copyValue:e}):null]})]})},no=({width:e,variant:t})=>{const n=c(Go),r=c(_),s=c(z),a=c(ue),h=c(S),l=c(ko),u=c(Eo),g=c(Xt),p=ke(),x=Kt(),$=()=>{if(g&&a){if(s){p(Te.newExchangeClicked());return}p(je.setExchangeAgain(!0)),p(Ut.createTransaction())}else{const y=l===b.STEP_2||u===So.XUMM?b.STEP_2:b.STEP_1;p(je.setExchangeStep({exchangeStep:y,source:null})),p(je.setResetExchange()),r?x(`/${et.CEX}`):(x(`/${et.CEX}?theme=${h}`),Ot()&&p(Ht.postMessage({data:{event:Vt,payload:{type:"config/transactionId",id:""}},source:null})))}};return o.jsx(Fo,{type:"button",entrypoint:h,sizeFont:"1.6rem",width:e||"",onClick:$,variant:t||"default",disabled:!!n,children:o.jsx(m,{id:"btn.newExchange",defaultMessage:"New Exchange"})})},Zr="data:image/svg+xml,%3csvg%20width='16'%20height='12'%20viewBox='0%200%2016%2012'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15.3789%205.77666L9.80046%200.00390625V4.33347L-0.000267029%204.33347L-0.000267029%207.21985L9.80046%207.21985L9.80046%2011.5494L15.3789%205.77666Z'%20fill='%2370FBCA'/%3e%3c/svg%3e",Xr="data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15.5525%2013.3952C16.1492%2013.9918%2016.1492%2014.9562%2015.5525%2015.5529C15.2549%2015.8504%2014.8643%2016%2014.4736%2016C14.0829%2016%2013.6922%2015.8504%2013.3946%2015.5529L8%2010.1571L2.6069%2015.5513C2.30782%2015.8489%201.9171%2015.9984%201.52795%2015.9984C1.1373%2015.9984%200.746585%2015.8489%200.449003%2015.5513C-0.147663%2014.9547%20-0.147663%2013.9887%200.449003%2013.3936L5.8421%207.99938L0.4475%202.60515C-0.149166%202.00852%20-0.149166%201.04259%200.4475%200.447469C1.04266%20-0.149156%202.00866%20-0.149156%202.60533%200.447469L7.99993%205.8417L13.3945%200.447469C13.9912%20-0.149156%2014.9557%20-0.149156%2015.5524%200.447469C16.149%201.04259%2016.149%202.00852%2015.5524%202.60515L10.1578%207.99938L15.5525%2013.3952Z'%20fill='%23F75353'/%3e%3c/svg%3e",Wr=d.div`
  display: flex;
  ${({entrypoint:e})=>e==C.MAIN&&i`
      button {
        margin-top: 0.2rem;
      }
    `}
  ${({entrypoint:e})=>(v(e)||w(e))&&i`
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
    `}
`,Yr=d.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`,Ur=d.span`
  ${B}
  font-weight: 500;
  ${({entrypoint:e})=>e==C.MAIN&&i`
      color: ${({theme:t})=>t.colors.grey300};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      color: ${({theme:t})=>t.colors.grey400};
    `}
    ${({entrypoint:e})=>w(e)&&i`
      ${me}
      font-weight: 500;
      color: ${({theme:t})=>t.colors.grey500};
    `}
`,Kr=d.span`
  ${B}
  font-weight: 500;
  color: ${({theme:e})=>e.colors.primary};
`,so=()=>{const e=c(ie),t=c(ae),n=c(_),r=c(Qo),s=c(S),a=r||"";return o.jsx(Wr,{entrypoint:s,children:o.jsxs(Yr,{children:[o.jsxs(Ur,{entrypoint:s,children:[n?o.jsx(m,{id:"transaction.id",defaultMessage:"Transaction ID"}):null,e?o.jsx(m,{id:"fich.tx.id",defaultMessage:"Tx ID"}):null,t?o.jsx(m,{id:"bitp.tx.id",defaultMessage:"Tx ID"}):null,":"]}),o.jsx(Kr,{children:a}),o.jsx(Se,{copyValue:a})]})})},Jr=d.div`
  overflow: hidden;
  ${({entrypoint:e,$isRtl:t})=>e==C.MAIN&&i`
      &:first-child {
        padding: 1.6rem 1.6rem 0 1.6rem;
        @media (${f.MD}) {
          padding: 1.6rem 0 1.6rem 3.2rem;
        }
      }
      &:last-child {
        padding: 0 1.6rem 1.6rem 1.6rem;
        @media (${f.MD}) {
          padding: 1.6rem 3.2rem 1.6rem 0;
        }
      }
      ${t?i`
            &:first-child {
              @media (${f.MD}) {
                padding: 1.6rem 3.2rem 1.6rem 0;
              }
            }
            &:last-child {
              @media (${f.MD}) {
                padding: 1.6rem 0 1.6rem 3.2rem;
              }
            }
          `:null}
    `}
  ${({entrypoint:e})=>v(e)&&i`
      padding: 0.8rem 1.6rem 1.3rem 1.6rem;
      border-radius: 8px;
      border: 1px solid ${({theme:t})=>t.colors.grey200};
      background-color: ${({theme:t})=>t.colors.grey100};
      &:first-child {
        margin-bottom: 1.6rem;
      }
    `}

    ${({entrypoint:e,theme:t})=>w(e)&&i`
      flex: 1 1 auto;
      display: grid;
      grid-template-areas:
        'title amount'
        'coin amount'
        'hash hash';
      grid-column-gap: 16px;
      padding: 12px 16px;
      ${Jt}
      border-radius: 16px;
      background: linear-gradient(
        90deg,
        rgba(5, 54, 54, 0.06) 0%,
        rgba(5, 54, 54, 0.01) 100%
      );

      &::before {
        border-radius: 16px;
      }
    `}
`,qr=d.div`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      border-radius: 4px;
      @media (${f.MD}) {
        display: grid;
        grid-template-columns: 1fr 92px 1fr;
      }
      border: 1px solid ${({theme:t})=>t.colors.border};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      margin-top: 1.6rem;
    `}

  ${({entrypoint:e})=>w(e)&&i`
      display: flex;
      gap: 16px;
      margin-top: 16px;
      flex-wrap: wrap;
    `}
`,it=d.div`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${We}
      color: ${({theme:t})=>t.colors.white};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      font-weight: 500;
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

    ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${tr}
      font-weight: 500;
      color: ${t.colors.black};
      line-height: 120%;
      text-align: right;
    `}
`,en=d.div`
  display: flex;
  align-items: center;
  ${({entrypoint:e,$isRtl:t})=>e==C.MAIN&&i`
      height: 65px;
      border-radius: 4px;
      justify-content: space-between;
      padding: 1.2rem 1.6rem;
      background: ${({theme:n})=>n.bgColors.additional};
      margin: 0.8rem 0;
      @media (${f.MD}) {
        margin: 0.6rem 0;
      }
      ${t?i`
            background: ${({theme:n})=>n.bgColors.additionalRtl};
          `:null}
    `}
  ${({entrypoint:e})=>v(e)&&i`
      gap: 0.6rem;
      margin: 1rem 0;
    `}

    ${({entrypoint:e})=>w(e)&&i`
      gap: 16px;
      margin: 4px 0 12px;
    `}
`,at=d.div`
  display: flex;
  align-items: center;
  ${({entrypoint:e})=>e==C.MAIN&&i`
      gap: 1.6rem;
    `}
  ${({entrypoint:e})=>v(e)&&i`
      gap: 0.6rem;
    `}

  ${({entrypoint:e,theme:t})=>w(e)&&i`
      grid-area: amount;
      align-items: flex-end;
      justify-content: flex-end;
    `}
`,lt=d.div`
  display: flex;
  ${({entrypoint:e,withNetwork:t})=>e==C.MAIN&&i`
      height: 100%;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      ${t?i`
            justify-content: space-between;
          `:null}
    `}
  ${({entrypoint:e})=>v(e)&&i`
      align-items: center;
      gap: 0.6rem;
    `}

    ${({entrypoint:e})=>w(e)&&i`
      align-items: center;
    `}
`,ct=d.div`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${We}
      color: ${({theme:t})=>t.colors.grey300};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      font-weight: 500;
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

  ${({entrypoint:e})=>w(e)&&i`
      ${me}
      font-weight: 500;
      color: ${({theme:t})=>t.colors.black};
    `}
`,dt=d.div`
  ${fe}
  ${({entrypoint:e})=>e==C.MAIN&&i`
      font-weight: 500;
      color: ${({theme:t})=>t.colors.secondary};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${Ye}
      line-height: 150%;
    `}
  ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${or}
      color: ${Me(t.colors.black,.8)};
      margin-left: 4px;
    `}
`,tn=d.div`
  display: flex;
  gap: 1rem;
  overflow: hidden;

  ${({entrypoint:e})=>w(e)&&i`
      grid-area: hash;
      margin-top: 12px;
    `}
`,on=d.div`
  padding-top: 0.55rem;
`,rn=d.div`
  height: 72px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (${f.MD}) {
    height: 100%;
    align-items: flex-start;
  }
`,nn=d.div`
  width: 100%;
  height: 1px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: ${({theme:e})=>e.colors.border};
  @media (${f.MD}) {
    width: 1px;
    height: 100%;
    top: unset;
    left: 50%;
    transform: translate(-50%, 0);
  }
`,sn=d.div`
  position: relative;
  z-index: 2;
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background-color: ${({theme:e})=>e.bgColors.dark400};
  transform: rotate(90deg);
  @media (${f.MD}) {
    margin-top: 4.5rem;
    transform: rotate(0);
  }
`,an=d.h3`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${We}
      font-weight: 600;
      margin: 2.4rem 0 1.6rem 0;
      color: ${({theme:t})=>t.colors.white};
      @media (${f.SM}) {
        margin: 3.2rem 0 1.6rem 0;
      }
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${B}
      font-weight: 500;
      margin-bottom: 0.6rem;
      color: ${({theme:t})=>t.colors.black};
    `}
    ${({entrypoint:e})=>w(e)&&i`
      ${me}
      font-weight: 600;
      margin-bottom: 8px;
      color: ${({theme:t})=>t.colors.black};
    `}
`,ln=d.div`
  width: 100%;
`,ht=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({entrypoint:e})=>v(e)&&i`
      &:first-child {
        margin-bottom: 1.2rem;
      }
    `}

  ${({entrypoint:e})=>w(e)&&i`
      &:first-child {
        margin-bottom: 4px;
      }
    `}
`,Fe=d.span`
  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      font-weight: 500;
      color: ${({theme:t})=>t.colors.grey400};
    `}

  ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${V}
      color: ${t.colors.grey500};
    `}
`,cn=d.div`
  grid-area: coin;
  display: flex;
  gap: 8px;
  margin-top: 4px;
`,dn="data:image/svg+xml,%3csvg%20width='18'%20height='14'%20viewBox='0%200%2018%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M1.66699%202.25293C1.66699%201.56257%202.22664%201.00293%202.91699%201.00293H14.667C15.3573%201.00293%2015.917%201.56257%2015.917%202.25293V11.0029C15.917%2011.6933%2015.3573%2012.2529%2014.667%2012.2529H2.91699C2.22664%2012.2529%201.66699%2011.6933%201.66699%2011.0029V2.25293Z'%20stroke='%23ABB6C1'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3crect%20x='10.667'%20y='4.37793'%20width='6'%20height='4.5'%20rx='1.25'%20fill='%23191D21'%20stroke='%23ABB6C1'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M12.9165%207.37793C13.3307%207.37793%2013.6665%207.04214%2013.6665%206.62793C13.6665%206.21372%2013.3307%205.87793%2012.9165%205.87793C12.5023%205.87793%2012.1665%206.21372%2012.1665%206.62793C12.1665%207.04214%2012.5023%207.37793%2012.9165%207.37793Z'%20fill='%23ABB6C1'/%3e%3c/svg%3e",gt=({label:e})=>{const t=c(le),n=c(pe),r=c(ie),s=c(ae),a=c(z),h=c(_),l=c(S),u=c(J),g=c(Ho),p=c(ce);if(!p)return null;const{amount:x,amountTo:$,coinFrom:y,coinTo:M,depositAddress:T,withdrawalAddress:k,hashIn:N,hashOut:Y}=p,R=e==="You send",Z=R?"youSend":"youGet",ee=R?y.coinCode:M.coinCode,te=R?x:$,ne=R?y.icon:M.icon,O=R?t:n,Ae=R?T:k,bo=N.hash||"",To=Y.hash||"",qe=R?bo:To;return o.jsxs(Jr,{entrypoint:l,$isRtl:u,children:[o.jsx(zt,{entrypoint:l,children:o.jsx(m,{id:Z,defaultMessage:e})}),s?o.jsxs(o.Fragment,{children:[o.jsxs(cn,{children:[o.jsx(se,{icon:ne,width:20,height:20}),o.jsxs(lt,{entrypoint:l,withNetwork:!!O,children:[o.jsx(ct,{entrypoint:l,children:ee}),O?o.jsx(dt,{entrypoint:l,children:O}):null]})]}),o.jsx(at,{entrypoint:l,children:o.jsx(it,{entrypoint:l,children:te})})]}):null,h||r?o.jsxs(en,{entrypoint:l,$isRtl:u,children:[o.jsxs(at,{entrypoint:l,children:[h?o.jsx(se,{icon:ne}):null,r?o.jsx(se,{icon:ne,width:20,height:20}):null,o.jsx(it,{entrypoint:l,children:te})]}),o.jsxs(lt,{entrypoint:l,withNetwork:!!O,children:[o.jsx(ct,{entrypoint:l,children:ee}),O?o.jsx(dt,{entrypoint:l,children:O}):null]})]}):null,o.jsxs(tn,{entrypoint:l,children:[h?o.jsxs(o.Fragment,{children:[o.jsx(on,{children:o.jsx(E,{src:dn})}),o.jsx(K,{address:Ae,action:"expand"})]}):null,a?o.jsx(o.Fragment,{children:g?o.jsxs(ln,{children:[o.jsxs(ht,{entrypoint:l,children:[o.jsx(Fe,{entrypoint:l,children:o.jsx(m,{id:`${tt(l)}.tx.hash`,defaultMessage:"Hash"})}),qe?o.jsx(K,{address:qe,type:"short",action:"copy"}):o.jsx(Fe,{entrypoint:l,children:"-"})]}),o.jsxs(ht,{entrypoint:l,children:[o.jsx(Fe,{entrypoint:l,children:o.jsx(m,{id:`${tt(l)}.tx.address`,defaultMessage:"Address"})}),o.jsx(K,{address:Ae,type:"short",action:"copy"})]})]}):o.jsx(K,{address:Ae,type:"short",action:"copy"})}):null]})]})},Ue=()=>{const e=c(z),t=c(_),n=c(Ee),r=c(ue),s=c(Wt),a=c(S),h=r||s||n?Xr:Zr;return o.jsxs(o.Fragment,{children:[o.jsx(an,{entrypoint:a,children:o.jsx(m,{id:"transaction.step3.info",defaultMessage:"Transaction info"})}),e?o.jsx(so,{}):null,o.jsxs(qr,{entrypoint:a,children:[o.jsx(gt,{label:"You send"}),t?o.jsxs(rn,{children:[o.jsx(sn,{children:o.jsx(E,{src:h})}),o.jsx(nn,{})]}):null,o.jsx(gt,{label:"You get"})]})]})},hn=d.span`
  ${B}
  font-weight: 500;
  word-wrap: break-word;
  span {
    display: none;
  }
  ${({coinFromNetwork:e})=>e&&i`
      span:first-child {
        display: inline-block;
        color: ${({theme:t})=>t.colors.secondary};
      }
    `}
  ${({coinToNetwork:e})=>e&&i`
      span:last-child {
        display: inline-block;
        color: ${({theme:t})=>t.colors.secondary};
      }
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

  ${({entrypoint:e})=>w(e)&&i`
      ${V}
      font-weight: 500;
      color: ${({theme:t})=>t.colors.black};
    `}
`,io=()=>{const e=c(le),t=c(pe),n=c(zo),r=c(Zo),s=c(Xo),a=c(Wo),h=c(S);return o.jsxs(hn,{entrypoint:h,coinFromNetwork:!!e,coinToNetwork:!!t,children:["1 ",r==null?void 0:r.coinCode," ",e," ",n?"=":"≈"," ",a," ",s==null?void 0:s.coinCode," ",t]})},gn=d.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  span {
    line-height: 200%;
  }
`,un=d.title`
  display: inline-block;
  line-height: 0;
  svg {
    path {
      fill: ${({theme:e})=>e.colors.grey300};
    }
  }
`,pn=d.span`
  ${B}
  font-weight: 500;
  color: ${({theme:e})=>e.colors.grey300};
`,xn=d.span`
  display: none;
  @media (${f.SM}) {
    display: inline-block;
    width: 2rem;
  }
`,Ke=()=>{const e=c(Yo),t=c(le),n=c(pe),r=e===Bo.FIXED,s=r?"Fixed rate":"Floating rate",a=r?"fixedRate":"floatingRate",h=r?pr:xr;return o.jsxs(gn,{children:[o.jsx(un,{title:s,children:o.jsx(E,{src:h,width:16,height:16,title:"Rate type"})}),t||n?null:o.jsxs(pn,{children:[o.jsx(m,{id:a,defaultMessage:s}),":"]}),o.jsx(io,{}),o.jsx(xn,{}),o.jsx(so,{})]})},mn=d.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  @media (${f.SM}) {
    gap: 1.4rem;
  }
`,fn=d.h1`
  ${de}
`,vn=d.div`
  @media (${f.SM}) {
    svg {
      width: 28px;
      height: 28px;
    }
  }
`,$n=d.p`
  ${B}
  margin: 0.8rem 0 1.2rem 0;
`,ut=d.div`
  position: relative;
  display: flex;
`,Cn=d.h3`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      font-weight: 600;
      font-size: 2rem;
      color: ${({theme:t})=>t.colors.white};
      margin: 2.4rem 0 1.6rem 0;
      @media (${f.SM}) {
        margin: 3.2rem 0 1.6rem 0;
      }
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${B}
      font-weight: 500;
      margin-top: 1.6rem;
      color: ${({theme:t})=>t.bgColors.dark100};
    `}
`,pt=d.div`
  width: 100%;
  overflow: hidden;
  margin-bottom: 2.2rem;
  padding: 0 0 0 1.2rem;
  @media (${f.SM}) {
    display: grid;
    grid-template-columns: 230px 1fr;
    column-gap: 4%;
    margin-bottom: 4rem;
    &:nth-child(2) {
      margin-bottom: 2.8rem;
    }
  }
  @media (${f.LG}) {
    grid-template-columns: 190px 1fr;
    margin-bottom: 1rem;
    &:nth-child(2) {
      margin-bottom: 0.6rem;
    }
  }
  ${({$isRtl:e})=>e&&i`
      padding: 0 1.2rem 0 0;
    `}
`,X=d.div`
  ${P}
  font-weight: 500;
  line-height: 150%;
  ${({entrypoint:e,margin:t})=>e==C.MAIN&&i`
      color: ${({theme:n})=>n.colors.grey300};
      ${t&&i`
        margin-bottom: 0.2rem;
      `}
    `}
  ${({entrypoint:e})=>v(e)&&i`
      color: ${({theme:t})=>t.colors.grey400};
    `}

  ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${V}
      color: ${t.colors.grey500};
    `}
`,xt=d.div`
  overflow: hidden;
  @media (${f.LG}) {
    display: grid;
    grid-template-columns: 0.6fr 1fr;
    gap: 50px;
  }
`,mt=d.div`
  position: relative;
  padding-top: 0.3rem;
`,wn=d.div`
  position: absolute;
  top: 10px;
  left: 20px;
  width: 2px;
  height: 100%;
  background: ${({theme:e})=>e.bgColors.secondary};
  ${({$isRtl:e})=>e&&i`
      left: auto;
      right: 20px;
    `}
`,ft=d.div`
  margin-bottom: 1.6rem;
`,vt=d.span`
  ${xe}
  font-weight: 500;
`,$t=d.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
`,Ct=d.span`
  ${fe}
  ${Ze}
  font-weight: 500;
`,wt=d.div`
  margin-bottom: 2.4rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,yt=d.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,yn=i`
  display: flex;
  &:hover {
    svg {
      path {
        fill: ${({theme:e})=>e.colors.primary};
      }
    }
  }
  @media (${f.MD}) {
    svg {
      display: none;
    }
  }
`;d.div`
  ${yn}
  svg {
    margin: 1.15rem 1rem 0 0;
  }
  ${({$isRtl:e})=>e&&i`
      margin: 1rem 0 0 1rem;
    `}
`;const jt=d.div`
  ${B}
  font-weight: 500;
  line-height: 150%;
  margin-top: 0.4rem;
`,jn=d.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 2rem;
  ${({entrypoint:e,showDetails:t,$isRtl:n})=>e==C.MAIN&&i`
      margin-top: 0.6rem;
      font-weight: 600;
      color: ${({theme:r})=>r.colors.white};
      svg {
        transition: 0.3s linear;
      }
      ${t&&i`
        svg {
          transform: rotate(90deg);
        }
        ${n&&i`
          svg {
            transform: rotate(-270deg);
          }
        `}
      `}
      ${n&&i`
        svg {
          transform: rotate(-180deg);
        }
      `}
    `}
  ${({entrypoint:e})=>v(e)&&i`
      font-weight: 500;
      margin: 1.6rem 0;
    `}
  ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${me}
      font-weight: 600;
      color: ${t.colors.black};
      margin-top: 16px;
      cursor: default;
    `}
`,bn=d.div`
  ${({entrypoint:e,showDetails:t})=>e==C.MAIN&&i`
      display: none;
      ${t&&i`
        display: block;
        padding-top: 2rem;
        @media (${f.SM}) {
          display: grid;
          grid-template-columns: 1fr 1.4fr 1fr;
          gap: 40px;
        }
        @media (${f.MD}) {
          padding-top: 1.8rem;
        }
        @media (${f.LG}) {
          max-width: 80.5%;
          grid-template-columns: 1fr 1.4fr 1fr;
        }
      `}
    `}

  ${({entrypoint:e})=>w(e)&&i`
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `}
`,Le=d.div`
  text-align: start;
  margin-bottom: 2rem;

  ${({entrypoint:e})=>w(e)&&i`
      margin-bottom: 0;
      display: flex;
      justify-content: space-between;
    `}
`,bt=d.div`
  font-weight: 500;
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${B}
      margin-top: 0.4rem;
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

  ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${V}
      font-weight: 500;
      color: ${t.colors.black};
    `}
`,Tn=d.div`
  margin-top: 2.6rem;
  display: flex;
  justify-content: flex-end;
`,Mn=()=>{const e=c(le),t=Io("local","txSuccessModal"),n=c(pe),r=c(z),s=c(_),a=c(Ao),h=c(Uo),[l,u]=j.useState(!1),g=c(S),p=c(J),x=c(ce),$=ke(),y=x&&x.id?x.id:null;if(j.useEffect(()=>{y&&t&&!a&&$(Te.showTxSuccessModal(!0))},[$,y,a,t]),j.useEffect(()=>{y&&Gt("exchanger","Completed",y)},[y]),j.useEffect(()=>{gr()&&h&&ur(x)},[x,h]),!x)return null;const{amount:M,amountTo:T,coinFrom:k,coinTo:N,depositAddress:Y,withdrawalAddress:R,createdAt:Z,hashIn:ee,hashOut:te,withdrawalExtraId:ne}=x;return o.jsxs(o.Fragment,{children:[s?o.jsxs(o.Fragment,{children:[o.jsxs(mn,{children:[o.jsx(vn,{children:o.jsx(E,{src:Lr})}),o.jsx(fn,{id:"success_event_final",children:o.jsx(m,{id:"transaction.step5.title",defaultMessage:"Your transaction is complete!"})})]}),o.jsx($n,{children:o.jsx(m,{id:"transaction.step5.description",defaultMessage:"Please, check your funds in your wallet. The exchange process is completed.",values:{coinToCode:N.coinCode}})}),o.jsx(Ke,{}),o.jsx(Cn,{entrypoint:g,children:o.jsx(m,{id:"transaction.step3.info",defaultMessage:"Transaction info"})})]}):null,s?o.jsxs("div",{children:[o.jsxs(ut,{children:[o.jsx(wn,{$isRtl:p}),o.jsx(mt,{children:o.jsx(se,{icon:k.icon})}),o.jsxs(pt,{$isRtl:p,children:[o.jsxs(ft,{children:[o.jsx(X,{entrypoint:g,children:o.jsx(m,{id:"youSend",defaultMessage:"You send"})}),o.jsxs(vt,{children:[M," ",o.jsxs($t,{children:[k.coinCode,e?o.jsx(Ct,{children:e}):null]})]})]}),o.jsxs(xt,{children:[o.jsxs(wt,{children:[o.jsx(X,{entrypoint:g,margin:!0,children:o.jsx(m,{id:"transaction.step5.inputHash",defaultMessage:"Input hash"})}),ee.hash?o.jsx(K,{address:ee.hash,type:"link",link:ee.link?ee.link:"#",action:"expand"}):o.jsx(jt,{children:"-"})]}),o.jsxs(yt,{children:[o.jsx(X,{entrypoint:g,margin:!0,children:o.jsx(m,{id:"transaction.step5.depositAddress",defaultMessage:"Deposit {coinFromCode} {coinFromNetwork} address",values:{coinFromCode:k.coinCode,coinFromNetwork:e}})}),o.jsx(K,{address:Y,action:"expand"})]})]})]})]}),o.jsxs(ut,{children:[o.jsx(mt,{children:o.jsx(se,{icon:N.icon})}),o.jsxs(pt,{$isRtl:p,children:[o.jsxs(ft,{children:[o.jsx(X,{entrypoint:g,children:o.jsx(m,{id:"youGet",defaultMessage:"You get"})}),o.jsxs(vt,{children:[T," ",o.jsxs($t,{children:[N.coinCode,n?o.jsx(Ct,{children:n}):null]})]})]}),o.jsxs(xt,{children:[o.jsxs(wt,{children:[o.jsx(X,{entrypoint:g,margin:!0,children:o.jsx(m,{id:"transaction.step5.inputHash",defaultMessage:"Input hash"})}),te.hash?o.jsx(K,{type:"link",address:te.hash,link:te.link?te.link:"#",action:"expand"}):o.jsx(jt,{children:"-"})]}),o.jsxs(yt,{children:[o.jsx(X,{entrypoint:g,margin:!0,children:o.jsx(m,{id:"transaction.step5.recipientAddress",defaultMessage:"Recipient {coinToCode} {coinToNetwork} address",values:{coinToCode:N.coinCode,coinToNetwork:n}})}),o.jsx(K,{address:R,action:"expand"})]})]})]})]})]}):null,r?o.jsx(Ue,{}):null,o.jsxs("div",{children:[o.jsxs(jn,{$isRtl:p,entrypoint:g,showDetails:l,onClick:()=>u(!l),children:[o.jsx(m,{id:"transaction.step5.details",defaultMessage:"Transaction details"}),s?o.jsx(E,{src:hr}):null]}),o.jsxs(bn,{entrypoint:g,showDetails:l||r,children:[o.jsxs(Le,{entrypoint:g,children:[o.jsx(X,{entrypoint:g,children:o.jsx(m,{id:"transaction.step5.sentTime",defaultMessage:"Sent time"})}),o.jsxs(bt,{entrypoint:g,children:[o.jsx(rr,{value:Z,year:"numeric",month:"short",day:"numeric"}),", ",o.jsx(nr,{value:Z,children:O=>o.jsxs(o.Fragment,{children:[o.jsx("b",{children:O[0].value}),O[1].value,o.jsx("small",{children:O[2].value})]})})]})]}),o.jsxs(Le,{entrypoint:g,children:[o.jsx(X,{entrypoint:g,children:o.jsx(m,{id:"exchangeRate",defaultMessage:"Exchange rate"})}),o.jsx("div",{children:o.jsx(io,{})})]}),ne?o.jsxs(Le,{entrypoint:g,children:[o.jsx(X,{entrypoint:g,children:o.jsx(m,{id:"transaction.step5.recipient",defaultMessage:"Recipient"})}),o.jsx(bt,{entrypoint:g,children:ne})]}):null]})]}),o.jsx(Tn,{children:o.jsx(no,{})})]})},ao=()=>{const e=c(z),t=c(Ro),n=c(S),r=c(_o),{isMobileXs:s}=ge(),a=ke();if(t)return null;const h=(u,g)=>{e&&(u.preventDefault(),a(Te.outerLinkClicked("contact"))),a(Te.supportLinkClicked(g))},l=`${r}/contact`;return o.jsx(Lo,{entrypoint:n,target:"_blank",sizeFont:"1.6rem",variant:"bordered",width:s?"100%":"",href:l,onClick:u=>h(u,l),children:o.jsx(m,{id:"btn.support",defaultMessage:"Support"})})},kn=d.div`
  display: flex;
  align-items: center;
  ${({entrypoint:e})=>e==C.MAIN&&i`
      height: 66px;
      border-radius: 4px;
      justify-content: space-between;
      border: 1px solid ${({theme:t})=>t.colors.grey400};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      gap: 1rem;
    `}

    ${({entrypoint:e})=>w(e)&&i`
      gap: 8px;
      margin-top: 12px;
    `}
`,En=d.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  ${({entrypoint:e,$isRtl:t})=>e==C.MAIN&&i`
      padding: 0 1rem 0 1.6rem;
      @media (${f.SM}) {
        padding: 0 2.5rem 0 1.6rem;
      }
      ${t&&i`
        padding: 0 1.6rem 0 1rem;
        @media (${f.SM}) {
          padding: 0 1.6rem 0 2.5rem;
        }
      `}
    `}
`,Sn=d.div`
  padding: 0 1rem 0 0;
  ${({$isRtl:e})=>e&&i`
      padding: 0 0 0 1rem;
    `}
`,Tt=d.div`
  overflow-y: hidden;
  overflow-x: auto;
  line-height: 260%;
  white-space: nowrap;
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${Do};
      ${xe};
      font-weight: 500;
    `}

  ${({entrypoint:e})=>v(e)&&i`
      ${nt};
      ${P};
      font-weight: 500;
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

    ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${nt};
      ${me};
      font-weight: 500;
      color: ${t.bgColors.primary};
    `}
`,Mt=({address:e,isExtraAddress:t=!1})=>{const n=c(z),r=c(_),s=c(S),a=c(J),h=c(ce),{isMobileXs:l}=ge(),g=Nt(e,l?6:10);return o.jsxs(kn,{entrypoint:s,children:[o.jsxs(En,{entrypoint:s,$isRtl:a,children:[r?o.jsx(Sn,{$isRtl:a,children:o.jsx(se,{icon:(h==null?void 0:h.coinFrom.icon)||""})}):null,r?o.jsx(Tt,{entrypoint:s,children:e}):null,n?o.jsx(Tt,{entrypoint:s,children:t?e:g}):null]}),o.jsx("div",{children:o.jsx(Se,{copyValue:e,template:r?"confirmingStep":"default"})})]})},Bn="data:image/svg+xml,%3csvg%20width='22'%20height='20'%20viewBox='0%200%2022%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_5814_119226)'%3e%3cpath%20d='M0%203.75V0.78125C0%200.349731%200.37159%200%200.830078%200H3.98438C4.44286%200%204.81445%200.349731%204.81445%200.78125C4.81445%201.21277%204.44286%201.5625%203.98438%201.5625H1.66016V3.75C1.66016%204.18152%201.28857%204.53125%200.830078%204.53125C0.37159%204.53125%200%204.18152%200%203.75ZM20.4199%200H17.2656C16.8071%200%2016.4355%200.349731%2016.4355%200.78125C16.4355%201.21277%2016.8071%201.5625%2017.2656%201.5625H19.5898V3.75C19.5898%204.18152%2019.9614%204.53125%2020.4199%204.53125C20.8784%204.53125%2021.25%204.18152%2021.25%203.75V0.78125C21.25%200.349731%2020.8784%200%2020.4199%200ZM3.98438%2018.4375H1.66016V16.25C1.66016%2015.8185%201.28857%2015.4688%200.830078%2015.4688C0.37159%2015.4688%200%2015.8185%200%2016.25V19.2188C0%2019.6503%200.37159%2020%200.830078%2020H3.98438C4.44286%2020%204.81445%2019.6503%204.81445%2019.2188C4.81445%2018.7872%204.44286%2018.4375%203.98438%2018.4375ZM20.4199%2015.4688C19.9614%2015.4688%2019.5898%2015.8185%2019.5898%2016.25V18.4375H17.2656C16.8071%2018.4375%2016.4355%2018.7872%2016.4355%2019.2188C16.4355%2019.6503%2016.8071%2020%2017.2656%2020H20.4199C20.8784%2020%2021.25%2019.6503%2021.25%2019.2188V16.25C21.25%2015.8185%2020.8784%2015.4688%2020.4199%2015.4688ZM9.89868%203.84766V8.53516C9.89868%208.96667%209.52709%209.31641%209.0686%209.31641H4.08813C3.62965%209.31641%203.25806%208.96667%203.25806%208.53516V3.84766C3.25806%203.41614%203.62965%203.06641%204.08813%203.06641H9.0686C9.52709%203.06641%209.89868%203.41614%209.89868%203.84766ZM8.23853%204.62891H4.91821V7.75391H8.23853V4.62891ZM17.5769%209.31641H12.5964C12.1379%209.31641%2011.7664%208.96667%2011.7664%208.53516V3.84766C11.7664%203.41614%2012.1379%203.06641%2012.5964%203.06641H17.5769C18.0354%203.06641%2018.407%203.41614%2018.407%203.84766V8.53516C18.407%208.96667%2018.0354%209.31641%2017.5769%209.31641ZM16.7468%204.62891H13.4265V7.75391H16.7468V4.62891ZM9.89868%2011.8555V16.543C9.89868%2016.9745%209.52709%2017.3242%209.0686%2017.3242H4.08813C3.62965%2017.3242%203.25806%2016.9745%203.25806%2016.543V11.8555C3.25806%2011.424%203.62965%2011.0742%204.08813%2011.0742H9.0686C9.52709%2011.0742%209.89868%2011.424%209.89868%2011.8555ZM8.23853%2012.6367H4.91821V15.7617H8.23853V12.6367ZM16.5082%2016.3184H13.6652C13.2067%2016.3184%2012.8351%2015.9686%2012.8351%2015.5371V12.8613C12.8351%2012.4298%2013.2067%2012.0801%2013.6652%2012.0801H16.5082C16.9667%2012.0801%2017.3383%2012.4298%2017.3383%2012.8613V15.5371C17.3383%2015.9686%2016.9667%2016.3184%2016.5082%2016.3184ZM15.6781%2013.6426H14.4952V14.7559H15.6781V13.6426Z'%20fill='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_5814_119226'%3e%3crect%20width='21.25'%20height='20'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";var Be={},lo={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},In=lo;function co(e){this.mode=In.MODE_8BIT_BYTE,this.data=e}co.prototype={getLength:function(e){return this.data.length},write:function(e){for(var t=0;t<this.data.length;t++)e.put(this.data.charCodeAt(t),8)}};var An=co,ho={L:1,M:0,Q:3,H:2},we=ho;function G(e,t){this.totalCount=e,this.dataCount=t}G.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];G.getRSBlocks=function(e,t){var n=G.getRsBlockTable(e,t);if(n==null)throw new Error("bad rs block @ typeNumber:"+e+"/errorCorrectLevel:"+t);for(var r=n.length/3,s=new Array,a=0;a<r;a++)for(var h=n[a*3+0],l=n[a*3+1],u=n[a*3+2],g=0;g<h;g++)s.push(new G(l,u));return s};G.getRsBlockTable=function(e,t){switch(t){case we.L:return G.RS_BLOCK_TABLE[(e-1)*4+0];case we.M:return G.RS_BLOCK_TABLE[(e-1)*4+1];case we.Q:return G.RS_BLOCK_TABLE[(e-1)*4+2];case we.H:return G.RS_BLOCK_TABLE[(e-1)*4+3];default:return}};var Rn=G;function go(){this.buffer=new Array,this.length=0}go.prototype={get:function(e){var t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)==1},put:function(e,t){for(var n=0;n<t;n++)this.putBit((e>>>t-n-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(e){var t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var _n=go,H={glog:function(e){if(e<1)throw new Error("glog("+e+")");return H.LOG_TABLE[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return H.EXP_TABLE[e]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)};for(var A=0;A<8;A++)H.EXP_TABLE[A]=1<<A;for(var A=8;A<256;A++)H.EXP_TABLE[A]=H.EXP_TABLE[A-4]^H.EXP_TABLE[A-5]^H.EXP_TABLE[A-6]^H.EXP_TABLE[A-8];for(var A=0;A<255;A++)H.LOG_TABLE[H.EXP_TABLE[A]]=A;var uo=H,oe=uo;function be(e,t){if(e.length==null)throw new Error(e.length+"/"+t);for(var n=0;n<e.length&&e[n]==0;)n++;this.num=new Array(e.length-n+t);for(var r=0;r<e.length-n;r++)this.num[r]=e[r+n]}be.prototype={get:function(e){return this.num[e]},getLength:function(){return this.num.length},multiply:function(e){for(var t=new Array(this.getLength()+e.getLength()-1),n=0;n<this.getLength();n++)for(var r=0;r<e.getLength();r++)t[n+r]^=oe.gexp(oe.glog(this.get(n))+oe.glog(e.get(r)));return new be(t,0)},mod:function(e){if(this.getLength()-e.getLength()<0)return this;for(var t=oe.glog(this.get(0))-oe.glog(e.get(0)),n=new Array(this.getLength()),r=0;r<this.getLength();r++)n[r]=this.get(r);for(var r=0;r<e.getLength();r++)n[r]^=oe.gexp(oe.glog(e.get(r))+t);return new be(n,0).mod(e)}};var po=be,L=lo,kt=po,Pn=uo,U={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},I={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(e){for(var t=e<<10;I.getBCHDigit(t)-I.getBCHDigit(I.G15)>=0;)t^=I.G15<<I.getBCHDigit(t)-I.getBCHDigit(I.G15);return(e<<10|t)^I.G15_MASK},getBCHTypeNumber:function(e){for(var t=e<<12;I.getBCHDigit(t)-I.getBCHDigit(I.G18)>=0;)t^=I.G18<<I.getBCHDigit(t)-I.getBCHDigit(I.G18);return e<<12|t},getBCHDigit:function(e){for(var t=0;e!=0;)t++,e>>>=1;return t},getPatternPosition:function(e){return I.PATTERN_POSITION_TABLE[e-1]},getMask:function(e,t,n){switch(e){case U.PATTERN000:return(t+n)%2==0;case U.PATTERN001:return t%2==0;case U.PATTERN010:return n%3==0;case U.PATTERN011:return(t+n)%3==0;case U.PATTERN100:return(Math.floor(t/2)+Math.floor(n/3))%2==0;case U.PATTERN101:return t*n%2+t*n%3==0;case U.PATTERN110:return(t*n%2+t*n%3)%2==0;case U.PATTERN111:return(t*n%3+(t+n)%2)%2==0;default:throw new Error("bad maskPattern:"+e)}},getErrorCorrectPolynomial:function(e){for(var t=new kt([1],0),n=0;n<e;n++)t=t.multiply(new kt([1,Pn.gexp(n)],0));return t},getLengthInBits:function(e,t){if(1<=t&&t<10)switch(e){case L.MODE_NUMBER:return 10;case L.MODE_ALPHA_NUM:return 9;case L.MODE_8BIT_BYTE:return 8;case L.MODE_KANJI:return 8;default:throw new Error("mode:"+e)}else if(t<27)switch(e){case L.MODE_NUMBER:return 12;case L.MODE_ALPHA_NUM:return 11;case L.MODE_8BIT_BYTE:return 16;case L.MODE_KANJI:return 10;default:throw new Error("mode:"+e)}else if(t<41)switch(e){case L.MODE_NUMBER:return 14;case L.MODE_ALPHA_NUM:return 13;case L.MODE_8BIT_BYTE:return 16;case L.MODE_KANJI:return 12;default:throw new Error("mode:"+e)}else throw new Error("type:"+t)},getLostPoint:function(e){for(var t=e.getModuleCount(),n=0,r=0;r<t;r++)for(var s=0;s<t;s++){for(var a=0,h=e.isDark(r,s),l=-1;l<=1;l++)if(!(r+l<0||t<=r+l))for(var u=-1;u<=1;u++)s+u<0||t<=s+u||l==0&&u==0||h==e.isDark(r+l,s+u)&&a++;a>5&&(n+=3+a-5)}for(var r=0;r<t-1;r++)for(var s=0;s<t-1;s++){var g=0;e.isDark(r,s)&&g++,e.isDark(r+1,s)&&g++,e.isDark(r,s+1)&&g++,e.isDark(r+1,s+1)&&g++,(g==0||g==4)&&(n+=3)}for(var r=0;r<t;r++)for(var s=0;s<t-6;s++)e.isDark(r,s)&&!e.isDark(r,s+1)&&e.isDark(r,s+2)&&e.isDark(r,s+3)&&e.isDark(r,s+4)&&!e.isDark(r,s+5)&&e.isDark(r,s+6)&&(n+=40);for(var s=0;s<t;s++)for(var r=0;r<t-6;r++)e.isDark(r,s)&&!e.isDark(r+1,s)&&e.isDark(r+2,s)&&e.isDark(r+3,s)&&e.isDark(r+4,s)&&!e.isDark(r+5,s)&&e.isDark(r+6,s)&&(n+=40);for(var p=0,s=0;s<t;s++)for(var r=0;r<t;r++)e.isDark(r,s)&&p++;var x=Math.abs(100*p/t/t-50)/5;return n+=x*10,n}},Fn=I,Ln=An,xo=Rn,mo=_n,q=Fn,Dn=po;function Q(e,t){this.typeNumber=e,this.errorCorrectLevel=t,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}var F=Q.prototype;F.addData=function(e){var t=new Ln(e);this.dataList.push(t),this.dataCache=null};F.isDark=function(e,t){if(e<0||this.moduleCount<=e||t<0||this.moduleCount<=t)throw new Error(e+","+t);return this.modules[e][t]};F.getModuleCount=function(){return this.moduleCount};F.make=function(){if(this.typeNumber<1){var e=1;for(e=1;e<40;e++){for(var t=xo.getRSBlocks(e,this.errorCorrectLevel),n=new mo,r=0,s=0;s<t.length;s++)r+=t[s].dataCount;for(var s=0;s<this.dataList.length;s++){var a=this.dataList[s];n.put(a.mode,4),n.put(a.getLength(),q.getLengthInBits(a.mode,e)),a.write(n)}if(n.getLengthInBits()<=r*8)break}this.typeNumber=e}this.makeImpl(!1,this.getBestMaskPattern())};F.makeImpl=function(e,t){this.moduleCount=this.typeNumber*4+17,this.modules=new Array(this.moduleCount);for(var n=0;n<this.moduleCount;n++){this.modules[n]=new Array(this.moduleCount);for(var r=0;r<this.moduleCount;r++)this.modules[n][r]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(e,t),this.typeNumber>=7&&this.setupTypeNumber(e),this.dataCache==null&&(this.dataCache=Q.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,t)};F.setupPositionProbePattern=function(e,t){for(var n=-1;n<=7;n++)if(!(e+n<=-1||this.moduleCount<=e+n))for(var r=-1;r<=7;r++)t+r<=-1||this.moduleCount<=t+r||(0<=n&&n<=6&&(r==0||r==6)||0<=r&&r<=6&&(n==0||n==6)||2<=n&&n<=4&&2<=r&&r<=4?this.modules[e+n][t+r]=!0:this.modules[e+n][t+r]=!1)};F.getBestMaskPattern=function(){for(var e=0,t=0,n=0;n<8;n++){this.makeImpl(!0,n);var r=q.getLostPoint(this);(n==0||e>r)&&(e=r,t=n)}return t};F.createMovieClip=function(e,t,n){var r=e.createEmptyMovieClip(t,n),s=1;this.make();for(var a=0;a<this.modules.length;a++)for(var h=a*s,l=0;l<this.modules[a].length;l++){var u=l*s,g=this.modules[a][l];g&&(r.beginFill(0,100),r.moveTo(u,h),r.lineTo(u+s,h),r.lineTo(u+s,h+s),r.lineTo(u,h+s),r.endFill())}return r};F.setupTimingPattern=function(){for(var e=8;e<this.moduleCount-8;e++)this.modules[e][6]==null&&(this.modules[e][6]=e%2==0);for(var t=8;t<this.moduleCount-8;t++)this.modules[6][t]==null&&(this.modules[6][t]=t%2==0)};F.setupPositionAdjustPattern=function(){for(var e=q.getPatternPosition(this.typeNumber),t=0;t<e.length;t++)for(var n=0;n<e.length;n++){var r=e[t],s=e[n];if(this.modules[r][s]==null)for(var a=-2;a<=2;a++)for(var h=-2;h<=2;h++)a==-2||a==2||h==-2||h==2||a==0&&h==0?this.modules[r+a][s+h]=!0:this.modules[r+a][s+h]=!1}};F.setupTypeNumber=function(e){for(var t=q.getBCHTypeNumber(this.typeNumber),n=0;n<18;n++){var r=!e&&(t>>n&1)==1;this.modules[Math.floor(n/3)][n%3+this.moduleCount-8-3]=r}for(var n=0;n<18;n++){var r=!e&&(t>>n&1)==1;this.modules[n%3+this.moduleCount-8-3][Math.floor(n/3)]=r}};F.setupTypeInfo=function(e,t){for(var n=this.errorCorrectLevel<<3|t,r=q.getBCHTypeInfo(n),s=0;s<15;s++){var a=!e&&(r>>s&1)==1;s<6?this.modules[s][8]=a:s<8?this.modules[s+1][8]=a:this.modules[this.moduleCount-15+s][8]=a}for(var s=0;s<15;s++){var a=!e&&(r>>s&1)==1;s<8?this.modules[8][this.moduleCount-s-1]=a:s<9?this.modules[8][15-s-1+1]=a:this.modules[8][15-s-1]=a}this.modules[this.moduleCount-8][8]=!e};F.mapData=function(e,t){for(var n=-1,r=this.moduleCount-1,s=7,a=0,h=this.moduleCount-1;h>0;h-=2)for(h==6&&h--;;){for(var l=0;l<2;l++)if(this.modules[r][h-l]==null){var u=!1;a<e.length&&(u=(e[a]>>>s&1)==1);var g=q.getMask(t,r,h-l);g&&(u=!u),this.modules[r][h-l]=u,s--,s==-1&&(a++,s=7)}if(r+=n,r<0||this.moduleCount<=r){r-=n,n=-n;break}}};Q.PAD0=236;Q.PAD1=17;Q.createData=function(e,t,n){for(var r=xo.getRSBlocks(e,t),s=new mo,a=0;a<n.length;a++){var h=n[a];s.put(h.mode,4),s.put(h.getLength(),q.getLengthInBits(h.mode,e)),h.write(s)}for(var l=0,a=0;a<r.length;a++)l+=r[a].dataCount;if(s.getLengthInBits()>l*8)throw new Error("code length overflow. ("+s.getLengthInBits()+">"+l*8+")");for(s.getLengthInBits()+4<=l*8&&s.put(0,4);s.getLengthInBits()%8!=0;)s.putBit(!1);for(;!(s.getLengthInBits()>=l*8||(s.put(Q.PAD0,8),s.getLengthInBits()>=l*8));)s.put(Q.PAD1,8);return Q.createBytes(s,r)};Q.createBytes=function(e,t){for(var n=0,r=0,s=0,a=new Array(t.length),h=new Array(t.length),l=0;l<t.length;l++){var u=t[l].dataCount,g=t[l].totalCount-u;r=Math.max(r,u),s=Math.max(s,g),a[l]=new Array(u);for(var p=0;p<a[l].length;p++)a[l][p]=255&e.buffer[p+n];n+=u;var x=q.getErrorCorrectPolynomial(g),$=new Dn(a[l],x.getLength()-1),y=$.mod(x);h[l]=new Array(x.getLength()-1);for(var p=0;p<h[l].length;p++){var M=p+y.getLength()-h[l].length;h[l][p]=M>=0?y.get(M):0}}for(var T=0,p=0;p<t.length;p++)T+=t[p].totalCount;for(var k=new Array(T),N=0,p=0;p<r;p++)for(var l=0;l<t.length;l++)p<a[l].length&&(k[N++]=a[l][p]);for(var p=0;p<s;p++)for(var l=0;l<t.length;l++)p<h[l].length&&(k[N++]=h[l][p]);return k};var Nn=Q,fo={exports:{}},On="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",Hn=On,Vn=Hn;function vo(){}function $o(){}$o.resetWarningCache=vo;var Gn=function(){function e(r,s,a,h,l,u){if(u!==Vn){var g=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw g.name="Invariant Violation",g}}e.isRequired=e;function t(){return e}var n={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:$o,resetWarningCache:vo};return n.PropTypes=n,n};fo.exports=Gn();var Co=fo.exports,Je={};Object.defineProperty(Je,"__esModule",{value:!0});var Qn=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},zn=Co,D=yo(zn),wo=j,ye=yo(wo);function yo(e){return e&&e.__esModule?e:{default:e}}function Zn(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var Xn={bgColor:D.default.oneOfType([D.default.object,D.default.string]).isRequired,bgD:D.default.string.isRequired,fgColor:D.default.oneOfType([D.default.object,D.default.string]).isRequired,fgD:D.default.string.isRequired,size:D.default.number.isRequired,title:D.default.string,viewBoxSize:D.default.number.isRequired,xmlns:D.default.string},Wn={title:void 0,xmlns:"http://www.w3.org/2000/svg"},Ie=(0,wo.forwardRef)(function(e,t){var n=e.bgColor,r=e.bgD,s=e.fgD,a=e.fgColor,h=e.size,l=e.title,u=e.viewBoxSize,g=Zn(e,["bgColor","bgD","fgD","fgColor","size","title","viewBoxSize"]);return ye.default.createElement("svg",Qn({},g,{height:h,ref:t,viewBox:"0 0 "+u+" "+u,width:h}),l?ye.default.createElement("title",null,l):null,ye.default.createElement("path",{d:r,fill:n}),ye.default.createElement("path",{d:s,fill:a}))});Ie.displayName="QRCodeSvg";Ie.propTypes=Xn;Ie.defaultProps=Wn;Je.default=Ie;Object.defineProperty(Be,"__esModule",{value:!0});Be.QRCode=void 0;var Yn=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Un=Nn,Kn=ve(Un),Jn=ho,qn=ve(Jn),es=Co,W=ve(es),jo=j,ts=ve(jo),os=Je,rs=ve(os);function ve(e){return e&&e.__esModule?e:{default:e}}function ns(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var ss={bgColor:W.default.oneOfType([W.default.object,W.default.string]),fgColor:W.default.oneOfType([W.default.object,W.default.string]),level:W.default.string,size:W.default.number,value:W.default.string.isRequired},is={bgColor:"#FFFFFF",fgColor:"#000000",level:"L",size:256},$e=(0,jo.forwardRef)(function(e,t){var n=e.bgColor,r=e.fgColor,s=e.level,a=e.size,h=e.value,l=ns(e,["bgColor","fgColor","level","size","value"]),u=new Kn.default(-1,qn.default[s]);u.addData(h),u.make();var g=u.modules;return ts.default.createElement(rs.default,Yn({},l,{bgColor:n,bgD:g.map(function(p,x){return p.map(function($,y){return $?"":"M "+y+" "+x+" l 1 0 0 1 -1 0 Z"}).join(" ")}).join(" "),fgColor:r,fgD:g.map(function(p,x){return p.map(function($,y){return $?"M "+y+" "+x+" l 1 0 0 1 -1 0 Z":""}).join(" ")}).join(" "),ref:t,size:a,viewBoxSize:g.length}))});Be.QRCode=$e;$e.displayName="QRCode";$e.propTypes=ss;$e.defaultProps=is;var as=Be.default=$e;const De=({value:e,size:t=156})=>o.jsx(as,{value:e,size:t,style:{height:"auto",maxWidth:"100%",width:"100%"},viewBox:"0 0 256 256"}),ls=d.div`
  @media (${f.SM}) {
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid ${({theme:e})=>e.colors.border};
    background: ${({theme:e})=>e.bgColors.primary};
  }
`,cs=d.button`
  ${sr}
  width: 100%;
  height: 66px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: 0.3s linear;
  color: ${({theme:e})=>e.colors.secondary};
  border: 1px solid ${({theme:e})=>e.colors.secondary};
  svg {
    margin: 0 1rem 0 0;
    path {
      transition: 0.3s linear;
      fill: ${({theme:e})=>e.colors.secondary};
    }
  }
  &:hover {
    color: ${({theme:e})=>e.colors.white};
    background-color: ${({theme:e})=>e.colors.secondary};
    svg {
      path {
        fill: ${({theme:e})=>e.colors.white};
      }
    }
  }
  ${({$isRtl:e})=>e&&i`
      svg {
        margin: 0 0 0 1rem;
      }
    `}
`,ds=d.div`
  position: relative;
  z-index: 9;
  display: flex;
  justify-content: center;
`,hs=d.div`
  position: absolute;
  top: -160px;
  width: 151px;
  padding-bottom: 1rem;
  @media (${f.SM}) {
    top: -190px;
    width: 181px;
  }
`,gs=d.div`
  border-radius: 4px;
  border: 2px solid ${({theme:e})=>e.colors.white};
`,us=d.div`
  padding: 2.3rem 2rem 2rem 2rem;
  border-radius: 4px;
  border: 1px solid ${({theme:e})=>e.colors.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({theme:e})=>e.colors.secondary};
`,ps=d.div`
  width: 144px;
  margin-top: 2rem;
  border: 2px solid ${({theme:e})=>e.colors.white};
`,xs=d.div`
  display: flex;
  align-items: center;
  svg {
    margin: 0 0.8rem 0 0;
    path {
      transition: 0.3s linear;
      fill: ${({theme:e})=>e.colors.secondary};
    }
  }
  ${({$isRtl:e})=>e&&i`
      svg {
        margin: 0 0 0 0.8rem;
      }
    `}
`,ms=d.div`
  ${({entrypoint:e})=>v(e)&&i`
      width: 112px;
      height: 112px;
      background-color: ${({theme:t})=>t.colors.white};
    `}

  ${({entrypoint:e})=>w(e)&&i`
      width: 120px;
      height: 120px;
    `}
`,Et=({address:e})=>{const t=c(z),n=c(_),r=c(S),[s,a]=j.useState(!1),h=c(J),{isMobile:l}=ge(),u=o.jsxs(o.Fragment,{children:[o.jsx(E,{src:Bn,title:"QR Code"}),o.jsx(m,{id:"btn.qrCode",defaultMessage:"QR Code"})]});return o.jsxs(o.Fragment,{children:[n?o.jsx(o.Fragment,{children:l?o.jsxs(us,{children:[o.jsx(xs,{$isRtl:h,children:u}),o.jsx(ps,{children:o.jsx(De,{value:e})})]}):o.jsxs(ds,{onMouseEnter:()=>{a(!0)},onMouseLeave:()=>{a(!1)},children:[o.jsx(cs,{$isRtl:h,children:u}),s?o.jsx(hs,{children:o.jsx(ls,{children:o.jsx(gs,{children:o.jsx(De,{value:e})})})}):null]})}):null,t?o.jsx(ms,{entrypoint:r,children:o.jsx(De,{value:e})}):null]})},Ne=d.h1`
  ${({entrypoint:e,canceled:t})=>e===C.MAIN&&i`
      display: inline-flex;
      gap: 0.6rem;
      ${de};
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 0.8rem;
      ${t&&i`
        margin-bottom: 1.6rem;
      `}
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${P};
      font-weight: 400;
      margin-bottom: 2.2rem;
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

    ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${V};
      margin-bottom: 24px;
      color: ${t.colors.black};
    `}
`,fs=d.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
`,Oe=d.span`
  ${({entrypoint:e})=>e===C.MAIN&&i`
      ${de}
      color: ${({theme:t})=>t.colors.secondary};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      font-weight: 400;
      color: ${({theme:t})=>t.colors.primary};
    `}

  ${({entrypoint:e})=>w(e)&&i`
      ${V}
      color: ${({theme:t})=>t.colors.primary};
    `}
`,He=d.span`
  ${({entrypoint:e})=>e===C.MAIN&&i`
      color: ${({theme:t})=>t.colors.grey300};
    `}
  ${({entrypoint:e})=>(v(e)||w(e))&&i`
      color: ${({theme:t})=>t.colors.primary};
    `}
`,vs=d.span`
  ${({entrypoint:e})=>e===C.MAIN&&i`
      ${B}
      ${Ze}
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${fe}
      ${Ye}
    `}
`,$s=d.p`
  ${B}
  margin-bottom: 2.2rem;
`,St=d.div`
  ${({entrypoint:e})=>e===C.MAIN&&i`
      ${de}
      margin-bottom: 1.5rem;
    `}
  ${({entrypoint:e})=>v(e)&&i`
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid ${({theme:t})=>t.colors.grey200};
      background-color: ${({theme:t})=>t.colors.grey100};
    `}

  ${({entrypoint:e,theme:t})=>w(e)&&i`
      padding: 16px;
      border-radius: 12px;
      ${Jt}
      background: ${t.colors.white};

      &::before {
        border-radius: 12px;
      }
    `}
`,Bt=d.h3`
  ${P}
  font-weight: 500;
  ${({entrypoint:e})=>e===C.MAIN&&i`
      color: ${({theme:t})=>t.colors.grey300};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${B}
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

    ${({entrypoint:e})=>w(e)&&i`
      ${qt}
      color: ${({theme:t})=>t.colors.black};
      font-weight: 600;
    `}
`,Ve=d.h3`
  font-weight: 500;
  ${({entrypoint:e})=>e===C.MAIN&&i`
      ${P}
      color: ${({theme:t})=>t.colors.attention};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${B}
      color: ${({theme:t})=>t.bgColors.dark100};
    `}
    ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${qt}
      font-weight: 600;
      color: ${t.colors.black};
    `}
`,It=d.div`
  ${({entrypoint:e})=>e===C.MAIN&&i`
      display: flex;
      flex-direction: column;
      margin-top: 0.8rem;
      @media (${f.SM}) {
        display: grid;
        grid-template-columns: calc(100% - 216px) 66px 150px;
      }
      @media (${f.MD}) {
        width: 98.5%;
      }
      @media (${f.LG}) {
        width: 78.5%;
      }
    `}
  ${({entrypoint:e})=>v(e)&&i`
      display: grid;
      grid-template-columns: 1fr 112px;
    `}

  ${({entrypoint:e})=>w(e)&&i`
      display: grid;
      grid-template-columns: 1fr 120px;
    `}
`,At=d.div`
  ${xe}
  font-weight: 500;
  margin: 1.3rem 0;
  text-align: center;
  @media (${f.SM}) {
    margin: 0;
    align-self: center;
  }
`,Rt=d.div`
  ${({entrypoint:e})=>e===C.MAIN&&i`
      height: 1px;
    `}
  ${({entrypoint:e})=>(v(e)||w(e))&&i`
      height: 1.6rem;
    `}
`,Cs=()=>{const e=c(le),t=c(ie),n=c(ae),r=c(z),s=c(_),a=c(Xe),h=c(Ee),l=c(ue),u=c(S),g=c(ce),p=g&&g.id?g.id:null;if(j.useEffect(()=>{p&&Gt("exchanger","TransactionPageFirstView")},[p]),!g)return null;const{amount:x,coinFrom:$,depositAddress:y,depositExtraId:M}=g,T=l||h;return o.jsxs(o.Fragment,{children:[s?o.jsxs(Ne,{entrypoint:u,canceled:T,children:[o.jsx(m,{id:"transaction.step3.title",defaultMessage:"Send by one transaction"}),o.jsxs(fs,{children:[o.jsx(Oe,{entrypoint:u,children:x}),o.jsx(He,{entrypoint:u,children:$.coinCode}),e?o.jsx(vs,{entrypoint:u,children:e}):null,o.jsx(Se,{copyValue:`${x}`})]})]}):null,T?null:o.jsxs(o.Fragment,{children:[t?o.jsx(Ne,{entrypoint:u,canceled:T,children:o.jsx(m,{id:"fich.tx.deposit.title",values:{amount:o.jsx(Oe,{entrypoint:u,children:x}),coinFromCode:o.jsx(He,{entrypoint:u,children:$.coinCode})},defaultMessage:"To start exchange send {amount} {coinFromCode} to the address below. If you already made a deposit, please wait."})}):null,n?o.jsx(Ne,{entrypoint:u,canceled:T,children:o.jsx(m,{id:"bitp.tx.deposit.title",values:{amount:o.jsx(Oe,{entrypoint:u,children:x}),coinFromCode:o.jsx(He,{entrypoint:u,children:$.coinCode})},defaultMessage:"To start exchange send {amount} {coinFromCode} to the address below. If you already made a deposit, please wait."})}):null,s?o.jsx($s,{children:o.jsx(m,{id:"transaction.step3.description",defaultMessage:"The exchange process will start after network confirmation."})}):null,o.jsxs(St,{entrypoint:u,children:[s?o.jsx(Bt,{entrypoint:u,children:o.jsx(m,{id:"transaction.step3.depositAddress",values:{coinCode:$.coinCode},defaultMessage:"Deposit {coinCode} address"})}):null,o.jsxs(It,{entrypoint:u,children:[o.jsxs("div",{children:[r?o.jsx(Bt,{entrypoint:u,children:o.jsx(m,{id:"transaction.step3.depositAddress",values:{coinCode:$.coinCode},defaultMessage:"Deposit {coinCode} address"})}):null,o.jsx(Mt,{address:y})]}),s?o.jsx(At,{children:o.jsx(m,{id:"or",defaultMessage:"or"})}):null,o.jsx(Et,{address:y})]})]}),M?o.jsxs(o.Fragment,{children:[o.jsx(Rt,{entrypoint:u}),o.jsxs(St,{entrypoint:u,children:[s?o.jsxs(Ve,{entrypoint:u,children:["*",o.jsx(m,{id:"transaction.step3.depositExtraAddress",defaultMessage:"Please don’t forget the MEMO. Deposit without MEMO can be lost"})]}):null,o.jsxs(It,{entrypoint:u,children:[o.jsxs("div",{children:[t?o.jsx(Ve,{entrypoint:u,children:o.jsx(m,{id:"fich.tx.memo",defaultMessage:"MEMO"})}):null,n?o.jsx(Ve,{entrypoint:u,children:o.jsx(m,{id:"bitp.tx.memo",defaultMessage:"MEMO"})}):null,o.jsx(Mt,{address:M,isExtraAddress:!0})]}),s?o.jsx(At,{children:o.jsx(m,{id:"or",defaultMessage:"or"})}):null,o.jsx(Et,{address:M})]})]})]}):null]}),s?o.jsx(Ke,{}):null,o.jsx(Rt,{entrypoint:u}),o.jsx(Ue,{}),r?o.jsxs(oo,{isCanceled:a,children:[a?o.jsx(ao,{}):null,o.jsx(no,{})]}):null]})},ws=eo`
  0% {
    right: 100%;
  }
  100% {
    right: 0;
  }
`,ys=eo`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,js=d.div`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      margin-top: 1.6rem;
      @media (${f.SM}) {
        display: flex;
        align-items: center;
        margin-top: 3rem;
      }
      @media (${f.MD}) {
        margin-top: 2.4rem;
      }
      @media (${f.LG}) {
        margin-top: 3.4rem;
      }
    `}
  ${({entrypoint:e})=>v(e)&&i`
      display: flex;
      justify-content: space-between;
      margin: 2.6rem 0;
    `}

    ${({entrypoint:e})=>w(e)&&i`
      display: flex;
      justify-content: space-between;
      margin: 24px 0;
    `}
`,bs=d.div`
  position: relative;
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({theme:e})=>e.colors.grey900};
  &:first-child {
    border-radius: 4px 4px 0 0;
  }
  &:nth-child(2) {
    border-radius: 0;
    margin: 2px 0;
  }
  &:last-child {
    border-radius: 0 0 4px 4px;
  }
  @media (${f.SM}) {
    &:first-child {
      border-radius: 4px 0 0 4px;
    }
    &:nth-child(2) {
      border-radius: 0;
      margin: 0 2px;
    }
    &:last-child {
      border-radius: 0 4px 4px 0;
    }
  }
  span {
    position: relative;
    z-index: 2;
  }
  svg {
    display: none;
    margin-right: 0.8rem;
  }
  ${({status:e})=>e.active&&i`
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        background: ${({theme:t})=>t.colors.secondary};
        animation: ${ws} 10s infinite linear;
      }
      span {
        color: ${({theme:t})=>t.colors.white};
      }
    `}
  ${({status:e})=>e.confirmed&&i`
      svg {
        display: block;
      }
      span {
        color: ${({theme:t})=>t.colors.white};
      }
    `}
  ${({status:e})=>e.cancel&&i`
      &:nth-child(2) {
        background: ${({theme:t})=>t.colors.error};
      }
      &::after {
        animation: none;
      }
    `}
  ${({$isRtl:e})=>e&&i`
      &:first-child {
        border-radius: 0 0 4px 4px;
      }
      &:nth-child(2) {
        border-radius: 0;
        margin: 2px 0;
      }
      &:last-child {
        border-radius: 4px 4px 0 0;
      }
      @media (${f.SM}) {
        &:first-child {
          border-radius: 0 4px 4px 0;
        }
        &:nth-child(2) {
          border-radius: 0;
          margin: 0 2px;
        }
        &:last-child {
          border-radius: 4px 0 0 4px;
        }
      }
      svg {
        margin-right: 0;
        margin-left: 0.8rem;
      }
    `}
`,Ts=d.div`
  /* width: 100%; */
`,Ms=d.div`
  display: flex;
  justify-content: center;
`,ks=d.div`
  ${({status:e})=>e.active&&!e.cancel&&i`
      svg {
        animation: ${ys} 1s infinite linear;
        path {
          fill: ${({theme:t})=>t.colors.primary};
        }
      }
    `}
  ${({status:e})=>e.cancel&&e.active&&i`
      svg {
        path {
          fill: ${({theme:t})=>t.colors.error};
        }
      }
    `}
`,Es=d.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${({theme:e})=>e.colors.grey200};
  ${({status:e})=>e.confirmed&&i`
      border: 1.5px solid ${({theme:t})=>t.colors.primary};
      background-color: ${({theme:t})=>t.colors.primary};
    `}
`,Ss=d.div`
  ${fe}
  font-weight: 500;
  line-height: 120%;
  text-align: center;
  margin-top: 0.8rem;
  color: ${({theme:e})=>e.colors.grey400};
  ${({status:e})=>(e.confirmed||e.active)&&i`
      color: ${({theme:t})=>t.colors.primary};
    `}
  ${({status:e})=>e.cancel&&e.active&&i`
      color: ${({theme:t})=>t.colors.error};
    `}
`,Bs=d.div`
  width: 100%;
  height: 1.5px;
  margin-top: 9px;
  background-color: ${({theme:e})=>e.colors.grey200};
  &:last-child {
    display: none;
  }
  ${({status:e})=>e.confirmed&&i`
      background-color: ${({theme:t})=>t.colors.primary};
    `}
`,Is=d.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
`,As=d.div`
  border-radius: 50%;
  border: 2px solid ${({theme:e})=>Me(e.colors.black,.12)};
  width: 24px;
  height: 24px;
  z-index: 1;
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    path {
      stroke: ${({theme:e})=>e.colors.white};
    }
  }

  ${({status:e,theme:t})=>e.active&&i`
      border: 2px solid ${({theme:n})=>n.colors.primary};

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        width: 8px;
        height: 8px;
        background: ${t.colors.primary};
      }
    `}

  ${({status:e,theme:t})=>e.active&&e.cancel&&i`
      border: 2px solid ${({theme:n})=>n.colors.error};

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        width: 8px;
        height: 8px;
        background: ${t.colors.error};
      }
    `}

  ${({status:e,theme:t})=>e.confirmed&&i`
      background: ${t.colors.primary};
    `}
`,Rs=d.div`
  width: calc(100% - 24px); // 24px - circle width
  height: 2px;
  background: ${({theme:e})=>Me(e.colors.black,.12)};
  position: absolute;
  top: 12px;
  left: calc(50% + 12px); // 12px - half of circle
  transform: translate(0px, -50%);

  ${({status:e,theme:t})=>e.confirmed&&i`
      background: ${t.colors.primary};
    `}
`,_s=d.div`
  ${V}
  font-weight: 500;
  color: ${({theme:e})=>Me(e.colors.black,.4)};
  align-items: center;
  text-align: center;
  margin-top: 8px;

  ${({status:e,theme:t})=>e.active&&i`
      color: ${t.colors.primary};
    `}

  ${({status:e,theme:t})=>e.active&&e.cancel&&i`
      color: ${t.colors.error};
    `}

  ${({status:e,theme:t})=>e.confirmed&&i`
      color: ${t.colors.black};
    `}
`,Ps="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%3e%3cpath%20d='M12.7501%201.84975C12.9877%201.39685%2012.8144%200.832251%2012.3395%200.642484C10.7063%20-0.0101284%208.9105%20-0.172398%207.17506%200.186965C5.13612%200.609175%203.30665%201.7253%201.99837%203.34516C0.690094%204.96503%20-0.0160431%206.98841%200.000276435%209.07054C0.016596%2011.1527%200.754362%2013.1647%202.08787%2014.7639C3.42138%2016.363%205.26811%2017.4504%207.31342%2017.8406C9.35873%2018.2308%2011.4761%2017.8997%2013.3046%2016.9038C15.1332%2015.9079%2016.5599%2014.3088%2017.3417%2012.3789C18.007%2010.7363%2018.1701%208.94053%2017.8216%207.21665C17.7202%206.71538%2017.1959%206.44347%2016.7077%206.59576C16.2195%206.74804%2015.9536%207.26707%2016.0416%207.77086C16.2705%209.08231%2016.1295%2010.4383%2015.6251%2011.6836C15.0043%2013.2163%2013.8712%2014.4864%2012.4189%2015.2774C10.9665%2016.0684%209.28491%2016.3313%207.66048%2016.0214C6.03605%2015.7115%204.56932%2014.8479%203.51022%2013.5778C2.45112%2012.3077%201.86517%2010.7097%201.85221%209.05602C1.83924%207.40234%202.40008%205.79533%203.43914%204.50879C4.4782%203.22226%205.93121%202.33581%207.55059%202.00048C8.8662%201.72805%2010.2255%201.83307%2011.4744%202.29393C11.9542%202.47097%2012.5126%202.30265%2012.7501%201.84975Z'%20fill='%234b950b'/%3e%3c/svg%3e",_t="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%3e%3cpath%20d='M12.7501%201.84975C12.9877%201.39685%2012.8144%200.832251%2012.3395%200.642484C10.7063%20-0.0101284%208.9105%20-0.172398%207.17506%200.186965C5.13612%200.609175%203.30665%201.7253%201.99837%203.34516C0.690094%204.96503%20-0.0160431%206.98841%200.000276435%209.07054C0.016596%2011.1527%200.754362%2013.1647%202.08787%2014.7639C3.42138%2016.363%205.26811%2017.4504%207.31342%2017.8406C9.35873%2018.2308%2011.4761%2017.8997%2013.3046%2016.9038C15.1332%2015.9079%2016.5599%2014.3088%2017.3417%2012.3789C18.007%2010.7363%2018.1701%208.94053%2017.8216%207.21665C17.7202%206.71538%2017.1959%206.44347%2016.7077%206.59576C16.2195%206.74804%2015.9536%207.26707%2016.0416%207.77086C16.2705%209.08231%2016.1295%2010.4383%2015.6251%2011.6836C15.0043%2013.2163%2013.8712%2014.4864%2012.4189%2015.2774C10.9665%2016.0684%209.28491%2016.3313%207.66048%2016.0214C6.03605%2015.7115%204.56932%2014.8479%203.51022%2013.5778C2.45112%2012.3077%201.86517%2010.7097%201.85221%209.05602C1.83924%207.40234%202.40008%205.79533%203.43914%204.50879C4.4782%203.22226%205.93121%202.33581%207.55059%202.00048C8.8662%201.72805%2010.2255%201.83307%2011.4744%202.29393C11.9542%202.47097%2012.5126%202.30265%2012.7501%201.84975Z'%20fill='%230779FE'/%3e%3c/svg%3e",re=({id:e,title:t,activeStep:n})=>{const r=c(ie),s=c(ae),a=c(_),h=c(Ee),l=c(ue),u=c(Wt),g=c(S),p=c(J),x=e===n,$=e<n,y=u||h||l,M=()=>{switch(g){case C.FICH:return _t;case C.BITP:return Ps;default:return _t}},T={active:x,confirmed:$,cancel:y};return o.jsxs(o.Fragment,{children:[a?o.jsxs(bs,{status:T,$isRtl:p,children:[o.jsx(E,{src:lr}),o.jsx(zt,{entrypoint:g,children:t})]}):null,r?o.jsxs(o.Fragment,{children:[o.jsxs(Ts,{status:T,children:[o.jsx(Ms,{children:x?o.jsx(ks,{status:T,children:o.jsx(E,{src:M(),width:18,height:18})}):o.jsx(Es,{status:T,children:$?o.jsx(E,{src:cr,width:8,height:8}):null})}),o.jsx(Ss,{status:T,children:t})]}),o.jsx(Bs,{status:T})]}):null,s?o.jsxs(Is,{children:[o.jsx(As,{status:T,children:T.confirmed?o.jsx(E,{src:to}):null}),e<b.STEP_4_3&&o.jsx(Rs,{status:T}),o.jsx(_s,{status:T,children:t})]}):null]})},Pt=({coinFrom:e,coinTo:t,confirmations:n})=>{const r=c(Yt),s=c(z),a=c(_),h=c(S),l=ze();return o.jsxs(js,{entrypoint:h,children:[s?o.jsxs(o.Fragment,{children:[o.jsx(re,{id:b.STEP_3,title:l.formatMessage({id:"fich.tx.status.pending",defaultMessage:"Pending deposit"},{coinFromCode:e,coinToCode:t}),activeStep:r}),o.jsx(re,{id:b.STEP_4_1,title:l.formatMessage({id:"fich.tx.status.confirming",defaultMessage:"Confirming"},{coinFromCode:e,coinToCode:t}),activeStep:r}),o.jsx(re,{id:b.STEP_4_2,title:l.formatMessage({id:"fich.tx.status.exchanging",defaultMessage:"Exchanging"},{coinFromCode:e,coinToCode:t}),activeStep:r}),o.jsx(re,{id:b.STEP_4_3,title:l.formatMessage({id:"fich.tx.status.sending",defaultMessage:"Sending to you"},{coinFromCode:e,coinToCode:t}),activeStep:r})]}):null,a?o.jsxs(o.Fragment,{children:[o.jsx(re,{id:b.STEP_4_1,title:l.formatMessage({id:"transaction.step4.loader.item1",defaultMessage:"Confirmation {confirmations}"},{confirmations:n}),activeStep:r}),o.jsx(re,{id:b.STEP_4_2,title:l.formatMessage({id:"transaction.step4.loader.item2",defaultMessage:"Exchanging {coinFromCode} to {coinToCode}"},{coinFromCode:e,coinToCode:t}),activeStep:r}),o.jsx(re,{id:b.STEP_4_3,title:l.formatMessage({id:"transaction.step4.loader.item3",defaultMessage:"Sending"}),activeStep:r})]}):null]})},Ge=d.h1`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${de}
      margin-bottom: 0.8rem;
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      font-weight: 400;
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

  ${({entrypoint:e,theme:t})=>w(e)&&i`
      ${V}
      color: ${t.colors.black};
    `}
`,he=d.h1`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${de}
      margin-bottom: 0.8rem;
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      font-weight: 400;
      color: ${({theme:t})=>t.bgColors.dark100};
    `}

  ${({entrypoint:e})=>w(e)&&i`
      ${V}
      color: ${({theme:t})=>t.colors.black};
    `}
`,Ft=d.span`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      color: ${({theme:t})=>t.colors.secondary};
    `}
  ${({entrypoint:e})=>v(e)&&i`
      font-weight: 500;
      color: ${({theme:t})=>t.colors.primary};
    `}
`,Lt=d.span`
  display: inline-block;
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${B}
      ${Ze}
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${fe}
      ${Ye}
    `}
`;d.div`
  display: flex;
  align-items: center;
  margin-top: 0.8rem;
  @media (${f.SM}) {
    margin: 0 0 0 0.8rem;
  }
`;d.span`
  display: flex;
  align-items: center;
`;const Qe=d.p`
  ${({entrypoint:e})=>e==C.MAIN&&i`
      ${B}
      margin-bottom: 1.6rem;
    `}
  ${({entrypoint:e})=>v(e)&&i`
      ${P}
      color: ${({theme:t})=>t.bgColors.dark100};
    `}
`;d.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;d.h4`
  ${xe}
  font-weight: 600;
  max-width: 250px;
  margin-bottom: 1rem;
  text-align: end;
  color: ${({theme:e})=>e.colors.white};
`;d.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 1rem;
  }
  ${({$isRtl:e})=>e&&i`
      svg {
        margin-right: 0;
        margin-left: 1rem;
      }
    `}
`;const Fs=()=>{const e=c(le),t=c(pe),n=c(ie),r=c(ae),s=c(z),a=c(_),h=c(Xe),l=c(Yt),u=c(ce),g=c(S);if(!u)return null;const{coinFrom:p,coinTo:x,confirmations:$}=u;let y=null;switch(l){case b.STEP_4_1:y=o.jsxs(o.Fragment,{children:[a?o.jsxs(o.Fragment,{children:[o.jsx(Ge,{entrypoint:g,children:o.jsx(m,{id:"transaction.step4.1.title",defaultMessage:"Confirmation"})}),o.jsx(Qe,{entrypoint:g,children:o.jsx(m,{id:"transaction.step4.1.description",defaultMessage:"As soon as {coinFromCode} is confirmed in the blockchain, the exchange process will begin.",values:{coinFromCode:p.coinCode}})})]}):null,s?o.jsx(Ge,{entrypoint:g,children:o.jsx(m,{id:"transaction.step4.1.title",values:{coinFromCode:p.coinCode},defaultMessage:"After {coinFromCode} is confirmed on the blockchain, the exchange will begin."})}):null]});break;case b.STEP_4_2:y=o.jsx(o.Fragment,{children:h?null:o.jsxs(o.Fragment,{children:[a?o.jsxs(o.Fragment,{children:[o.jsx(he,{entrypoint:g,children:o.jsx(m,{id:"transaction.step4.2.title",defaultMessage:"Exchanging {coinFromCode} {coinFromNetwork} to {coinToCode} {coinToNetwork}",values:{coinFromCode:o.jsx(Ft,{entrypoint:g,children:p.coinCode}),coinFromNetwork:o.jsx(o.Fragment,{children:e?o.jsx(Lt,{entrypoint:g,children:e}):null}),coinToCode:o.jsx(Ft,{entrypoint:g,children:x.coinCode}),coinToNetwork:o.jsx(o.Fragment,{children:t?o.jsx(Lt,{entrypoint:g,children:t}):null})}})}),o.jsx(Qe,{entrypoint:g,children:o.jsx(m,{id:"transaction.step4.2.description",defaultMessage:"Please, wait. The exchange process will take from 15 min to 2 hours."})})]}):null,n?o.jsx(he,{entrypoint:g,children:o.jsx(m,{id:"fich.tx.exchange.exchanging",defaultMessage:"  Please wait, the exchange process may range from few minutes to several hours."})}):null,r?o.jsx(he,{entrypoint:g,children:o.jsx(m,{id:"bitp.tx.exchange.exchanging",defaultMessage:"  Please wait, the exchange process may range from few minutes to several hours."})}):null]})});break;case b.STEP_4_3:y=o.jsxs(o.Fragment,{children:[a?o.jsxs(o.Fragment,{children:[o.jsx(Ge,{entrypoint:g,children:o.jsx(m,{id:"transaction.step4.3.title",defaultMessage:"Sending"})}),o.jsx(Qe,{entrypoint:g,children:o.jsx(m,{id:"transaction.step4.3.description",defaultMessage:"{coinToCode} is being sent to your wallet. As soon as the transaction is completed, you will receive the exchanged amount.",values:{coinToCode:x.coinCode}})})]}):null,n?o.jsx(he,{entrypoint:g,children:o.jsx(m,{id:"fich.tx.exchange.sending",values:{coinToCode:x.coinCode},defaultMessage:"{coinToCode} is being sent to your wallet."})}):null,r?o.jsx(he,{entrypoint:g,children:o.jsx(m,{id:"bitp.tx.exchange.sending",values:{coinToCode:x.coinCode},defaultMessage:"{coinToCode} is being sent to your wallet."})}):null]});break}return o.jsxs(o.Fragment,{children:[y,a?o.jsx(Ke,{}):null,s?o.jsx(Pt,{coinFrom:p.coinCode,coinTo:x.coinCode,confirmations:$}):null,o.jsx(Ue,{}),a?o.jsx(Pt,{coinFrom:p.coinCode,coinTo:x.coinCode,confirmations:$}):null,s&&h?o.jsx(oo,{children:o.jsx(ao,{})}):null]})},Ls=()=>{const e=c(Ko),t=c(_),n=c(Jo),r=c(qo),s=c(S),a=c(J),h=c(Zt),l=c(er),u=c(ce),g=ke(),p=Kt();j.useEffect(()=>{l>b.STEP_2&&h!==l&&g(je.setExchangeStep({exchangeStep:l,source:null}))},[g,l,h]),j.useEffect(()=>{e&&(Ot()&&g(Ht.postMessage({data:{event:Vt,payload:{type:"notFound"}},source:null})),g(Ut.clearFetchTransactionByIdError()))},[g,p,e,l,s,t]);let x=null;switch(l){case b.STEP_3:x=o.jsx(Cs,{});break;case b.STEP_4:x=o.jsx(Fs,{});break;case b.STEP_5:x=o.jsx(Mn,{});break}return o.jsxs(Pr,{step:h,$isRtl:a,isLoading:n,entrypoint:s,children:[o.jsx(No,{isVisible:n,transparentBg:!0}),u?o.jsxs(o.Fragment,{children:[o.jsx(_r,{comment:r}),o.jsx(Fr,{entrypoint:s,children:x})]}):null]})},Ys=Object.freeze(Object.defineProperty({__proto__:null,default:Ls},Symbol.toStringTag,{value:"Module"}));export{K as D,no as N,ao as S,Ys as T};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["exolix-static/assets/TxEmailSubscribe-CYFT4Vpm.js","exolix-static/assets/main-CDKDnvW7.js","exolix-static/assets/index-htOA9nBG.js","exolix-static/assets/App-DCKfOddi.js","exolix-static/assets/tslib.es6-D9yd9Yl3.js","exolix-static/assets/App-Bw_SQ7J0.css","exolix-static/assets/Checkbox-JZJ3BKZ0.js","exolix-static/assets/StepsIndicator-DBFPQONH.js","exolix-static/assets/mixins-CNu8Cr8X.js","exolix-static/assets/transactionSelectors-Bz099tFA.js","exolix-static/assets/index-dIKOytT1.js","exolix-static/assets/transactionSlice-BLjUsgVM.js","exolix-static/assets/TxStatusInfo-gMt9-_Hg.js","exolix-static/assets/exchangeSelectors-DP50MkAx.js","exolix-static/assets/useIsomorphicLayoutEffect-B0TE0m4X.js","exolix-static/assets/dropdown-DvVsuBFR.js","exolix-static/assets/txToCookies-CjVnD0W0.js","exolix-static/assets/unlocked-CVJBCS6B.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
