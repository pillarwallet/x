import{aB as c,aK as t,bh as de,aD as y,aE as w,aF as ne,aH as U,aI as K,aG as H,aJ as V,bP as z,bn as G,bs as Z,b5 as W,bL as qe,aC as I,ae as P,br as S,cB as _t,bB as re,aM as B,bq as Xt,aN as ye,aU as Wt,cC as Zt,cD as Je,c1 as Ht,cE as ve,cF as zt,cG as Yt,b_ as Qe,bl as Ut,cH as Kt,bg as et,cI as tt}from"./main-CDKDnvW7.js";import{A as qt,F as Q,s as Jt,E as Qt,R as ot,a as eo}from"./RefreshButton-DL_d0oNf.js";import{s as l,A as r,u as n,O as rt,P as ee,a as Me,a1 as ke,S as R,V as O,a3 as Se,Q as nt,a4 as to,c as st,b as ae,T as it,a0 as oo,R as ro,d as no}from"./App-DCKfOddi.js";import{u as D,F as $,a as J,b as q,C as at,P as lt,e as so}from"./mixins-CNu8Cr8X.js";import{b as he,i as Y,d as te,j as Ae,k as ct,l as io,f as ao,h as dt}from"./exchangeSelectors-DP50MkAx.js";import{u as lo,C as co}from"./trustpilot-DnM8-4bM.js";import{d as Ie,e as pt,i as po,a as ho,f as me,g as ht,s as mo}from"./ratesSelectors-CrbtfYvr.js";import{c as Ce}from"./coinsSlice-DSan2S0Z.js";import{s as mt,a as xt,b as xo,c as go,d as Ee}from"./formUiSelectors-Fui5Vn9C.js";import{c as Te}from"./ratesSlice-DmdeARD_.js";import{d as gt,e as Re,f as ut,g as Le,h as ft,i as $t,j as bt,k as wt,l as vt}from"./transactionSelectors-Bz099tFA.js";import{c as k}from"./transactionSlice-BLjUsgVM.js";import{f as uo,C as be,T as Ct,P as jt,S as yt,b as fo,d as Ne}from"./StepsIndicator-DBFPQONH.js";import{l as $o,u as bo}from"./unlocked-CVJBCS6B.js";import{e as wo}from"./index-htOA9nBG.js";import{C as vo}from"./Checkbox-JZJ3BKZ0.js";import"./exchangeSelectors-C6FOZc8J.js";import"./tslib.es6-D9yd9Yl3.js";import"./useIsomorphicLayoutEffect-B0TE0m4X.js";import"./index-dIKOytT1.js";const Co=l.div`
  margin-top: 1.6rem;
  text-align: center;
  @media (${c.SM}) {
    text-align: start;
    max-width: 65%;
  }
  @media (${c.SM}) {
    text-align: start;
    max-width: 70%;
  }
  ${({isStep2:e})=>e?r`
          @media (${c.SM}) {
            text-align: start;
            max-width: 45%;
          }
          @media (${c.MD}) {
            text-align: start;
            max-width: 50%;
          }
        `:null}
`,jo=()=>{const e=n(he),o=n(Y);return t.jsx(t.Fragment,{children:e<de.STEP_3?t.jsx(Co,{isStep2:o,children:t.jsx(qt,{})}):null})},Mt="data:image/svg+xml,%3csvg%20width='20'%20height='21'%20viewBox='0%200%2020%2021'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M5%208.11182L10%2013.1118L15%208.11182'%20stroke='%23053636'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",yo="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='5'%20height='10'%20viewBox='0%200%205%2010'%20fill='none'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M1.83307%205.14213C1.75283%205.06368%201.75283%204.93458%201.83307%204.85613L4.70577%202.04727C4.98907%201.77026%204.98907%201.31443%204.70577%201.03742C4.43133%200.769077%203.9928%200.769077%203.71836%201.03742L0.397868%204.28413C-0.00330848%204.67639%20-0.00330803%205.32188%200.397868%205.71414L3.71836%208.96085C3.9928%209.22919%204.43133%209.22919%204.70577%208.96085C4.98907%208.68384%204.98907%208.22801%204.70577%207.951L1.83307%205.14213Z'%20fill='%23121217'/%3e%3c/svg%3e",Mo="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='9'%20height='6'%20viewBox='0%200%209%206'%20fill='none'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M4.31865%203.66693C4.24019%203.74717%204.1111%203.74717%204.03264%203.66693L1.22378%200.794231C0.946772%200.510928%200.490939%200.510928%200.213932%200.794231C-0.0544095%201.06867%20-0.0544094%201.5072%200.213933%201.78164L3.46064%205.10213C3.8529%205.50331%204.49839%205.50331%204.89065%205.10213L8.13736%201.78164C8.4057%201.50719%208.4057%201.06867%208.13736%200.794231C7.86035%200.510928%207.40452%200.510928%207.12751%200.794231L4.31865%203.66693Z'%20fill='%23121217'/%3e%3c/svg%3e",kt="data:image/svg+xml,%3csvg%20width='12'%20height='6'%20viewBox='0%200%2012%206'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M6%206L0.803847%200.75L11.1962%200.750001L6%206Z'%20fill='%23abb6c1'/%3e%3c/svg%3e",ko=l.div`
  position: relative;
  width: 150px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.2rem;
  background: ${({theme:e})=>e.bgColors.primary};
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  @media (${c.SM}) {
    width: 164px;
    padding: 0 1.8rem 0 1.6rem;
  }
  svg {
    margin-top: 0.4rem;
  }
  ${({$isRtl:e})=>e?r`
          border-radius: 4px 0 0 4px;
          background: ${({theme:o})=>o.bgColors.primaryRtl};
        `:null}

  ${({entrypoint:e})=>y(e)&&r`
      height: 70px;
      border-radius: 6px;
      margin-right: 1.2rem;
      background-color: ${({theme:o})=>o.colors.grey300};
    `}

    ${({entrypoint:e,theme:o})=>w(e)&&r`
      flex-direction: column;
      justify-content: space-between;
      padding: 12px 0 12px 16px;
      width: 130px;

      @media (${c.SM}) {
        padding: 12px 0 12px 16px;
        width: 130px;
      }

      svg {
        margin-top: 0;
        width: 20px;
        height: 20px;

        path {
          color: ${o.colors.black};
        }
      }
    `}
`,So=l.div`
  display: flex;
  align-items: center;
  overflow: hidden;

  ${({entrypoint:e,theme:o})=>w(e)&&r`
      width: 100%;
      justify-content: space-between;
      padding: 4px 8px 4px 4px;
      background: ${ne(o.colors.black,.04)};
      border-radius: 32px;
    `}
`,Ao=l.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 0 1rem;
  overflow: hidden;
  @media (${c.SM}) {
    margin: 0 0 0 1.2rem;
  }
  ${({$isRtl:e})=>e?r`
          margin: 0 1rem 0 0;
          @media (${c.SM}) {
            margin: 0 1.2rem 0 0;
          }
        `:null}

  ${({entrypoint:e})=>w(e)&&r`
      margin: 0;
    `}
`,we=l.div`
  ${rt}
  line-height: 130%;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.3rem;
  :nth-child(2) {
    ${ee}
    color: ${({theme:e})=>e.colors.grey300};
  }
  ${({entrypoint:e,isNetwork:o})=>y(e)&&r`
      color: ${({theme:i})=>i.colors.black};
      ${o&&r`
        :nth-child(2) {
          ${uo}
        }
      `}
    `}

  ${({entrypoint:e,theme:o,isNetwork:i})=>w(e)&&r`
      ${Me}
      font-weight: 500;
      margin-top: 0;
      color: ${o.colors.black};

      ${i&&r`
        ${ke}
        color: ${ne(o.colors.black,.8)};
        align-self: flex-start;
      `} {
      }
    `}
`,Io=l.div`
  ${ke}
  font-weight: 500;
  color: ${({theme:e})=>e.colors.grey500};
  align-self: flex-start;
`,Pe=({selectType:e,disable:o})=>{const i=n(U),s=n(K),a=n(H),p=n(V),d=n(z),x=n(b=>te(b,e)),g=D(),{code:f,network:m,icon:h}=x||{},u=o&&e===Z,M=()=>{u||(g(W.setSelectOpen({selectType:e,open:!0,source:null})),qe(g,e,!0))};return t.jsxs(ko,{entrypoint:p,onClick:M,$isRtl:d,children:[s?t.jsx(Io,{children:t.jsx($,{id:e===G?"bitp.youPay":"bitp.youGet",defaultMessage:e===G?"You pay":"You get"})}):null,t.jsxs(So,{entrypoint:p,children:[a?t.jsx(be,{icon:h||""}):null,i?t.jsx(be,{icon:h||"",width:32,height:32}):null,s?t.jsx(be,{icon:h||"",width:28,height:28}):null,t.jsxs(Ao,{entrypoint:p,$isRtl:d,children:[t.jsx(we,{entrypoint:p,children:f}),a||i?t.jsx(we,{entrypoint:p,isNetwork:!0,children:m==null?void 0:m.network}):null]}),!u&&s?t.jsx(R,{src:Mt,width:12,height:7,title:"Dropdown"}):null]}),s?t.jsx(we,{entrypoint:p,isNetwork:!0,children:m==null?void 0:m.network}):null,u?null:a||i?t.jsxs("div",{children:[a?t.jsx(R,{src:kt,width:12,height:7,title:"Dropdown"}):null,i?t.jsx(R,{src:Mo,width:12,height:7,title:"Dropdown"}):null]}):null]})},Eo=l.div`
  ${ee}
  font-weight: 500;
  line-height: 150%;
  display: flex;
  align-items: center;
  span {
    display: none;
    color: ${({theme:e})=>e.colors.secondary};
  }
  ${({coinFromNetwork:e})=>e&&r`
      span:first-child {
        display: inline-block;
      }
    `}
  ${({coinToNetwork:e})=>e&&r`
      span:last-child {
        display: inline-block;
      }
    `}
  ${({entrypoint:e})=>e==I.MAIN&&r`
      margin-top: 0.4rem;
      @media (${c.SM}) {
        margin-top: 0;
      }
      @media (${c.MD}) {
        margin-top: 0.8rem;
      }
    `}
  ${({entrypoint:e})=>y(e)&&r`
      ${O}
      font-weight: 400;
      color: ${({theme:o})=>o.colors.grey400};
    `}
    ${({entrypoint:e})=>w(e)&&r`
      ${Se}
      color: ${({theme:o})=>ne(o.colors.black,.8)};
      cursor: default;
    `}
`,Fe=()=>{const e=n(Ie),o=n(pt),i=n(Ae),s=n(u=>te(u,G)),a=n(u=>te(u,Z)),p=n(V),d=s?s.code:"",x=a?a.code:"",g=d!==(s==null?void 0:s.network.network)?s==null?void 0:s.network.network:"",f=x!==(a==null?void 0:a.network.network)?a==null?void 0:a.network.network:"",m=e&&po(e)?e.rate:0,h=i?"=":"≈";return t.jsxs(Eo,{entrypoint:p,coinFromNetwork:!!g,coinToNetwork:!!f,children:["1 ",d," ",g," ",h," ",m&&!o?t.jsxs(t.Fragment,{children:[m," ",x," ",f]}):t.jsxs(t.Fragment,{children:[" ",t.jsx(Q,{width:"100px",height:"15px"})]})]})},Ro=l.div`
  position: relative;
  z-index: 1;
  width: calc(100% - 150px);
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 1.7rem 1.4rem;
  border-radius: 4px 0 0 4px;
  background: ${({theme:e})=>e.bgColors.primary};
  @media (${c.SM}) {
    width: calc(100% - 164px);
    padding: 1.7rem 2.2rem 1.7rem 1.4rem;
  }
  @media (${c.MD}) {
    padding: 2rem 1.7rem 1.7rem 1.7rem;
  }
  @media (${c.LG}) {
    padding: 2rem 2.2rem 1.7rem 1.7rem;
  }
  ${({$isRtl:e})=>e&&r`
      border-radius: 0 4px 4px 0;
      background: ${({theme:o})=>o.bgColors.primaryRtl};
    `}
  ${({entrypoint:e})=>y(e)&&r`
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1.2rem;
      background: transparent;
      label {
        font-size: ${ee};
        font-weight: 500;
        color: ${({theme:o})=>o.colors.grey400};
      }
    `}
    ${({entrypoint:e})=>w(e)&&r`
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 16px;
      width: calc(100% - 130px);
    `}
`,Lo=l.input`
  ${nt}
  width: 100%;
  height: 100%;
  background: transparent;
  transition: 0.3s linear;
  ${({fixedRateValue:e})=>e&&r`
      color: ${({theme:o})=>o.colors.secondary};
    `}

  ${({entrypoint:e})=>y(e)&&r`
      height: 36px;
      font-size: 2.4rem;
      font-weight: 400;
      color: ${({theme:o})=>o.colors.black};
    `}

  ${({entrypoint:e})=>w(e)&&r`
      height: 32px;
      ${to}
      font-weight: 500;
      color: ${({theme:o})=>o.colors.black};
      text-align: right;
    `}
`,Fo=l.span`
  ${nt}
`,Ve=r`
  svg {
    path {
      transition: 0.3s linear;
      fill: ${({theme:e})=>e.colors.secondary};
    }
  }
`,Bo=l.button`
  line-height: 0;
  &:hover {
    ${Ve}
  }
  svg {
    display: none;
    path {
      fill: ${({theme:e})=>e.colors.grey300};
    }
    @media (${c.SM}) {
      display: inline-block;
    }
    @media (${c.MD}) {
      display: none;
    }
    @media (${c.LG}) {
      display: inline-block;
    }
  }
  ${({fixedRateValue:e})=>e&&r`
      ${Ve}
    `}
`,To=l.div`
  height: 36px;
  width: 100%;
  display: flex;
  align-items: center;
`,De=({selectType:e})=>{const o=n(ho),i=n(me),s=n(mt),a=n(pt),p=n(U),d=n(K),x=n(H),g=n(Ae),f=n(ct),m=n(z),h=n(Ie),u=n(ie=>io(ie,e)),M=n(ie=>xt(ie,e)),b=n(V),v=D(),{isMobile:_,isDesktop:C}=J(),E=P.useId(),T=q(),X=P.useRef(!1),F=P.useRef(null),A=e===G,j=e===Z,N=!u&&!X.current||a&&j||i&&!o&&j||!h;P.useEffect(()=>{!N&&F.current&&M&&F.current.focus()},[N,F,M]),P.useEffect(()=>{if(h&&A&&h.minAmount&&+u<h.minAmount&&!M){v(S.setAmount({selectType:e,amount:h.minAmount.toString()}));return}h&&A&&h.maxAmount&&+u>h.maxAmount&&!M&&v(S.setAmount({selectType:e,amount:h.maxAmount.toString()}))},[v,h,u,A,M,e]);const oe=ie=>{const $e=ie.target.value;_t.test($e)?(v(S.setAmount({selectType:e,amount:$e.replace(/,/,".")})),X.current=!1):$e.trim()||(v(S.setAmount({selectType:e,amount:""})),X.current=!0),v(S.resetTimer(!0))},ue=()=>{v(W.blurCoinInput(e)),u||(A?v(s&&h?S.setAmount({selectType:e,amount:h.fromAmount.toString()}):S.setAmount({selectType:e,amount:"1"})):j&&h&&v(S.setAmount({selectType:e,amount:h.toAmount.toString()})))},L=()=>{v(S.setRateType(g?re.FLOAT:re.FIXED))},se=g?$o:bo,le=!!(f&&j),fe=g&&j,Dt=g?"exchange.toggleTooltip.float":"exchange.toggleTooltip.fixed",Gt=g?"Floating":"Fixed",Ot=C?"":"-105px";return t.jsxs(Ro,{entrypoint:b,inputFocus:M,fixedRateValue:fe,$isRtl:m,children:[p?t.jsx("label",{htmlFor:E,children:t.jsx($,{id:A?"fich.youPay":"fich.youGet",defaultMessage:A?"You pay":"You get"})}):null,N?t.jsxs(To,{children:[x||p?t.jsx(Q,{width:_?"120px":"160px",height:"26px"}):null,d?t.jsx(Q,{width:"100%",height:"26px"}):null]}):t.jsxs(t.Fragment,{children:[x&&le?t.jsx(Fo,{children:"~"}):null,t.jsx(Lo,{entrypoint:b,ref:F,fixedRateValue:fe,id:E,onFocus:()=>v(W.focusCoinInput(e)),onInput:oe,onChange:oe,onBlur:ue,value:u,type:"text",pattern:"[0-9]*.|,*",inputMode:"decimal",autoComplete:"off"}),d&&j&&t.jsx(Fe,{}),x&&j?t.jsx(Ct,{text:T.formatMessage({id:Dt,defaultMessage:`Click to switch the exchange rate to ${Gt}`}),position:{top:"-80px",left:Ot},children:t.jsx(Bo,{onClick:L,fixedRateValue:fe,children:t.jsx(R,{src:se,width:14,height:20,title:"Rate type"})})}):null]})]})},No="data:image/svg+xml,%3csvg%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.62498%2017.4163C13.9282%2017.4163%2017.4166%2013.9279%2017.4166%209.62467C17.4166%205.32146%2013.9282%201.83301%209.62498%201.83301C5.32176%201.83301%201.83331%205.32146%201.83331%209.62467C1.83331%2013.9279%205.32176%2017.4163%209.62498%2017.4163ZM9.62498%2015.583C12.9157%2015.583%2015.5833%2012.9154%2015.5833%209.62467C15.5833%206.33398%2012.9157%203.66634%209.62498%203.66634C6.33428%203.66634%203.66665%206.33398%203.66665%209.62467C3.66665%2012.9154%206.33428%2015.583%209.62498%2015.583ZM18.4875%2019.8845C18.6705%2020.0677%2018.924%2020.1663%2019.1775%2020.1663C19.4309%2020.1663%2019.6844%2020.0677%2019.8815%2019.8845C20.2617%2019.4899%2020.2617%2018.8699%2019.8815%2018.4894L17.2625%2015.8684C16.8682%2015.4879%2016.2486%2015.4879%2015.8685%2015.8684C15.4883%2016.2629%2015.4883%2016.883%2015.8685%2017.2634L18.4875%2019.8845Z'%20fill='%23053636'%20fill-opacity='0.24'/%3e%3c/svg%3e",Po="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='19'%20height='20'%20viewBox='0%200%2019%2020'%20fill='none'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M1.06176%205.66933C2.48796%202.24469%205.82961%200.0100374%209.53934%200.000128852C13.5375%20-0.0209255%2017.0926%202.54006%2018.339%206.3391C19.5853%2010.1381%2018.2381%2014.3074%2015.0044%2016.6588C11.7707%2019.0103%207.38925%2019.0068%204.15934%2016.6501L1.27934%2019.5301C0.986522%2019.8226%200.512158%2019.8226%200.21934%2019.5301C-0.0731134%2019.2373%20-0.0731134%2018.7629%200.21934%2018.4701L3.00934%2015.6801C0.403243%2013.04%20-0.364444%209.09396%201.06176%205.66933ZM2.39891%2012.1691C3.59638%2015.0547%206.41508%2016.9342%209.53934%2016.9301V16.8901C13.7796%2016.8847%2017.2219%2013.4603%2017.2493%209.22013C17.2534%206.09586%2015.374%203.27717%2012.4883%202.0797C9.60261%200.882226%206.27967%201.54208%204.07048%203.75127C1.86129%205.96046%201.20144%209.2834%202.39891%2012.1691Z'%20fill='%2380818F'/%3e%3c/svg%3e",Vo=l.div`
  position: relative;
  z-index: 9;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 1.6rem;
  border-radius: 4px;
  ${({entrypoint:e,active:o,$isRtl:i})=>e==I.MAIN&&r`
      height: 64px;
      border-radius: 4px;
      background: ${({theme:s})=>s.bgColors.dark400};
      border: 1px solid ${({theme:s})=>s.colors.grey700};
      @media (${c.SM}) {
        background: ${({theme:s})=>s.bgColors.primary};
      }
      ${o&&r`
        border: 1px solid ${({theme:s})=>s.colors.secondary};
      `}
      ${i&&r`
        padding-left: 0;
        padding-right: 1.6rem;
        @media (${c.SM}) {
          background: ${({theme:s})=>s.bgColors.primaryRtl};
        }
      `}
    `}
  ${({entrypoint:e,active:o})=>y(e)&&r`
      height: 48px;
      margin-top: 1.6rem;
      border-radius: 8px;
      border: 1px solid ${({theme:i})=>i.colors.grey200};
      ${o&&r`
        border: 1px solid ${({theme:i})=>i.colors.primary};
      `}
    `}

    ${({entrypoint:e,theme:o,active:i})=>w(e)&&r`
      margin-top: 16px;
      background: ${o.colors.white};
      padding: 16px;
      border-radius: 12px;
      ${st}

      &::before {
        border-radius: 12px;
      }

      ${i&&r`
        &::before {
          background: ${({theme:s})=>s.colors.blockGradient};
        }
      `}

      &:hover {
        &::before {
          background: ${({theme:s})=>s.colors.blockGradient};
        }
      }
    `}
`,Do=l.input`
  ${ae}
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  background: transparent;
  ${({entrypoint:e})=>e==I.MAIN&&r`
      font-weight: 500;
      color: ${({theme:o})=>o.colors.white};
      &::placeholder {
        color: ${({theme:o})=>o.colors.grey300};
      }
      &:autofill,
      &:autofill:hover,
      &:autofill:focus {
        border-radius: 4px;
        border: transparent;
        -webkit-text-fill-color: ${({theme:o})=>o.colors.white};
        box-shadow: 0 0 0px 1000px ${({theme:o})=>o.bgColors.dark400}
          inset;
        @media (${c.SM}) {
          border-radius: 0;
        }
      }
    `}
  ${({entrypoint:e})=>y(e)&&r`
      font-weight: 400;
      color: ${({theme:o})=>o.bgColors.dark100};
      &::placeholder {
        color: ${({theme:o})=>o.colors.grey400};
      }
      &:autofill,
      &:autofill:hover,
      &:autofill:focus {
        border-radius: 8px;
        border: transparent;
        -webkit-text-fill-color: ${({theme:o})=>o.colors.white};
        box-shadow: 0 0 0px 1000px ${({theme:o})=>o.colors.white} inset;
      }
    `}

  ${({entrypoint:e,theme:o})=>w(e)&&r`
      ${Me}
      color: ${o.colors.black};
      padding: 0 16px 0 12px;

      &::placeholder {
        color: ${ne(o.colors.black,.64)};
      }
    `}
`,Go=l.button`
  display: none;
  @media (${c.SM}) {
    display: inline-block;
    width: 20%;
    height: 100%;
    text-align: end;
    padding-right: 1.7rem;
  }
  svg {
    transform: rotate(180deg);
  }
  ${({$isRtl:e})=>e&&r`
      @media (${c.SM}) {
        padding-right: 0;
        padding-left: 1.7rem;
      }
    `}
`,Oo=({selectType:e})=>{const o=n(xo),i=n(U),s=n(K),a=n(H),p=n(V),d=n(z),x=n(b=>ht(b,e)),g=D(),f=P.useRef(null),m=q();P.useEffect(()=>{f.current&&f.current.focus({preventScroll:!0})},[]);const h=b=>{const v=b.target.value;g(Ce.setSearch({selectType:e,search:v.trim()}))},u=()=>{x&&g(Ce.setSearch({selectType:e,search:""}))},M=()=>{g(W.setSelectOpen({selectType:e,open:!1,source:null}))};return t.jsxs(Vo,{entrypoint:p,active:o,$isRtl:d,children:[t.jsxs("div",{children:[a?t.jsx(R,{src:Jt,width:24,height:24,title:"Search"}):null,i?t.jsx(R,{src:Po,width:18,height:18,title:"Search"}):null,s?t.jsx(R,{src:No,width:22,height:22,title:"Search"}):null]}),t.jsx(Do,{entrypoint:p,ref:f,onFocus:()=>g(W.focusSearchInput(!0)),onBlur:()=>g(W.focusSearchInput(!1)),onChange:h,value:x,placeholder:m.formatMessage({id:"search",defaultMessage:"Search"})}),x&&a?t.jsx("div",{children:t.jsx(at,{onClick:u,type:"button",children:t.jsx(R,{src:it,title:"Clear icon"})})}):t.jsx(Go,{onClick:M,type:"button",$isRtl:d,children:t.jsx(R,{src:kt,width:12,height:7,title:"Dropdown icon"})})]})},_o=l.div`
  position: relative;
  z-index: 2;
  height: 64px;
  ${({activeSelect:e})=>e&&r`
      z-index: 9;
    `}
  ${({entrypoint:e})=>y(e)&&r`
      height: 93px;
    `}

  ${({entrypoint:e,theme:o,inputFocus:i})=>w(e)&&r`
      background: ${o.colors.white};
      ${st}
      height: 124px;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1px;
        background: ${({theme:s})=>s.colors.blockGradient};
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask: linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        opacity: 0;
        transition: 300ms linear;
        z-index: -1;
      }

      &::after {
        z-index: -1;
      }

      &:hover {
        &::before {
          opacity: 0;
          transition: 300ms linear;
        }

        &::after {
          opacity: 1;
          transition: 300ms linear;
        }
      }

      ${i&&r`
        &::before {
          opacity: 0;
        }

        &::after {
          opacity: 1;
        }
      `}

      @media (${B.S}) {
        border-radius: 12px;

        &::before,
        &::after {
          border-radius: 16px;
        }
      }

      @media (${B.M}) {
        border-radius: 16px;
        height: 136px;

        &::before,
        &::after {
          border-radius: 16px;
        }
      }

      @media (${B.L}) {
        height: 126.5px;
      }

      @media (${B.XL}) {
        height: 128px;
      }
    `}
`,Xo=l.div`
  touch-action: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  ${({entrypoint:e})=>e==I.MAIN&&r`
      @media (${c.SM}) {
        position: absolute;
        height: max-content;
      }
    `}
  ${({entrypoint:e})=>y(e)&&r`
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid ${({theme:o})=>o.colors.grey200};
      background-color: ${({theme:o})=>o.bgColors.primary};
    `}

  ${({entrypoint:e})=>w(e)&&r`
      background: #f5faf8;
    `}
`,Wo=l.div`
  touch-action: none;
  ${({entrypoint:e})=>e==I.MAIN&&r`
      padding: 2rem 1.6rem 1.6rem 1.6rem;
      @media (${c.SM}) {
        padding: 0;
      }
    `}
  ${({entrypoint:e})=>y(e)&&r`
      padding: 2.4rem 1.6rem 1.6rem 1.6rem;
    `}

  ${({entrypoint:e})=>w(e)&&r`
      padding: 20px 20px 16px;

      @media (${B.M}) {
        padding: 24px 24px 16px;
      }

      @media (${B.L}) {
        padding: 32px 32px 16px;
      }

      @media (${B.XL}) {
        padding: 20px 20px 16px;
      }
    `}
`,Zo=l.div`
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${ae}
  font-weight: 600;
  ${({entrypoint:e})=>e==I.MAIN&&r`
      margin-bottom: 2.6rem;
      @media (${c.SM}) {
        display: none;
      }
    `}
  ${({entrypoint:e})=>y(e)&&r`
      ${({theme:o})=>o.colors.black}
    `}
`,Ho=l.div`
  height: 100%;
  ${({entrypoint:e})=>e==I.MAIN&&r`
      @media (${c.SM}) {
        height: max-content;
        overflow: hidden;
        margin-top: 1px;
        border-radius: 4px;
        border: 1px solid ${({theme:o})=>o.colors.border};
      }
    `}
`,zo=l.fieldset`
  width: 100%;
  display: flex;
  align-items: center;
  transition: 0.3s linear;
  ${({entrypoint:e,activeSelect:o,inputFocus:i,error:s})=>e==I.MAIN&&r`
      height: 66px;
      border-radius: 4px;
      border: 1px solid ${({theme:a})=>a.colors.grey700};
      &:hover {
        border: 1px solid ${({theme:a})=>a.colors.white};
        legend {
          color: ${({theme:a})=>a.colors.white};
        }
      }
      ${(o||i)&&r`
        border: 1px solid ${({theme:a})=>a.colors.secondary};
        legend {
          color: ${({theme:a})=>a.colors.secondary};
        }
        &:hover {
          border: 1px solid ${({theme:a})=>a.colors.secondary};
          legend {
            color: ${({theme:a})=>a.colors.secondary};
          }
        }
      `}
      ${s&&r`
        border: 1px solid ${({theme:a})=>a.colors.error};
        legend {
          color: ${({theme:a})=>a.colors.error};
        }
        &:hover {
          border: 1px solid ${({theme:a})=>a.colors.error};
          legend {
            color: ${({theme:a})=>a.colors.error};
          }
        }
      `}
    `}
  ${({entrypoint:e,activeSelect:o,inputFocus:i})=>y(e)&&r`
      height: 93px;
      border-radius: 8px;
      border: 1px solid ${({theme:s})=>s.colors.grey200};
      background-color: ${({theme:s})=>s.colors.grey100};
      &:hover {
        border: 1px solid ${({theme:s})=>s.colors.primary};
      }
      ${(o||i)&&r`
        border: 1px solid ${({theme:s})=>s.colors.primary};
        &:hover {
          border: 1px solid ${({theme:s})=>s.colors.primary};
        }
      `}
    `}
    ${({entrypoint:e})=>w(e)&&r`
      height: 100%;
    `}
`,Yo=l.legend`
  position: relative;
  z-index: 2;
  ${O}
  line-height: 0;
  font-weight: 500;
  padding: 0 0.2rem;
  margin: 0 1.6rem;
  transition: 0.3s linear;
  color: ${({theme:e})=>e.colors.grey700};
`,Ge=l.button`
  display: flex;
  align-items: center;
  color: ${({theme:e})=>e.colors.black};

  ${({entrypoint:e})=>y(e)&&r`
      gap: 1.2rem;
      ${ae}
      font-weight: 600;
      color: ${({theme:o})=>o.colors.black};
    `}

  ${({entrypoint:e})=>w(e)&&r`
      ${oo}
      font-weight: 600;
      gap: 12px;

      svg {
        transform: rotate(90deg);
      }
    `}
`,pe=({selectType:e})=>{const o=n(gt),i=n(Re),s=n(U),a=n(H),p=n(K),d=n(Xt),x=n(ut),g=n(L=>mo(L,e)),f=n(Le),m=n(L=>go(L,e)),h=n(L=>xt(L,e)),u=n(L=>ht(L,e)),M=n(L=>L.cex.coins[e],ro),b=n(V),_=n(me)&&e==="from",C=D(),E=P.useRef(null),{isMobile:T}=J();lo(E,L=>{!T&&L.target.id!=="coinSelect"&&F()});const X=L=>{L.preventDefault();const se=L.target.closest("#coinListItem"),le=se&&se.dataset.coinListItem?JSON.parse(se.dataset.coinListItem):null;le&&C(S.setSelectCoin({selectType:e,coin:le})),C(Te.removeRates()),C(Te.setRatesFetching(!0)),u&&C(Ce.setSearch({selectType:e,search:""})),e===Z&&(i&&C(k.setWithdrawalAddress("")),f&&C(k.setInvalidWithdrawalAddress("")),x&&C(k.setMemoAddress("")),o&&C(k.setInvalidMemoAddress(""))),F()};function F(){C(W.setSelectOpen({selectType:e,open:!1,source:null})),Wt()&&qe(C,e,!1)}const A=e===G,j=A?"You send":"You get",N=A?"youSend":"youGet",oe=()=>A?"You pay":"You get",ue=()=>A?"bitp.youPay":"bitp.youGet";return t.jsx(_o,{id:"coinSelect",ref:E,entrypoint:b,activeSelect:m,inputFocus:h,children:m?t.jsxs(Xo,{entrypoint:b,children:[t.jsxs(Wo,{entrypoint:b,children:[t.jsxs(Zo,{entrypoint:b,children:[a?t.jsxs(t.Fragment,{children:[t.jsx($,{id:N,defaultMessage:j}),t.jsx(co,{variant:"bordered",onClose:F})]}):null,s?t.jsxs(Ge,{entrypoint:b,onClick:F,children:[t.jsx(R,{src:yo,title:"Close"}),t.jsx($,{id:N,defaultMessage:j})]}):null,p?t.jsxs(Ge,{entrypoint:b,onClick:F,children:[t.jsx(R,{src:Mt,title:"Close"}),t.jsx($,{id:ue(),defaultMessage:oe()})]}):null]}),t.jsx(Oo,{selectType:e})]}),t.jsx(Ho,{entrypoint:b,children:t.jsx(Qt,{service:ye.CEX,selectType:e,data:M,items:g,selectOpen:m,onSelectClose:()=>F(),handleListItem:X})})]}):t.jsxs(zo,{entrypoint:b,activeSelect:m,inputFocus:h,error:_,children:[a?t.jsx(Yo,{children:t.jsx($,{id:N,defaultMessage:j})}):null,a||s?t.jsxs(t.Fragment,{children:[t.jsx(De,{selectType:e}),t.jsx(Pe,{disable:!!d,selectType:e})]}):null,p?t.jsxs(t.Fragment,{children:[t.jsx(Pe,{disable:!!d,selectType:e}),t.jsx(De,{selectType:e})]}):null]})})},Uo="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='15'%20viewBox='0%200%2020%2015'%20fill='none'%3e%3cpath%20d='M18.9228%206.91101L13.0895%201.07768C12.9323%200.925878%2012.7218%200.841883%2012.5033%200.843782C12.2848%200.84568%2012.0758%200.933321%2011.9213%201.08783C11.7668%201.24233%2011.6791%201.45134%2011.6772%201.66984C11.6753%201.88834%2011.7593%202.09884%2011.9111%202.25601L16.322%206.66684H1.66695C1.44594%206.66684%201.23398%206.75464%201.0777%206.91092C0.921415%207.0672%200.833618%207.27916%200.833618%207.50018C0.833618%207.72119%200.921415%207.93315%201.0777%208.08943C1.23398%208.24571%201.44594%208.33351%201.66695%208.33351H16.322L11.9111%2012.7443C11.8315%2012.8212%2011.768%2012.9132%2011.7244%2013.0148C11.6807%2013.1165%2011.6577%2013.2259%2011.6567%2013.3365C11.6558%2013.4472%2011.6769%2013.5569%2011.7188%2013.6593C11.7607%2013.7617%2011.8225%2013.8548%2011.9008%2013.933C11.979%2014.0112%2012.0721%2014.0731%2012.1745%2014.115C12.2769%2014.1569%2012.3866%2014.178%2012.4973%2014.1771C12.6079%2014.1761%2012.7173%2014.1531%2012.819%2014.1094C12.9206%2014.0658%2013.0126%2014.0023%2013.0895%2013.9227L18.9228%208.08934C19.079%207.93307%2019.1668%207.72115%2019.1668%207.50018C19.1668%207.27921%2019.079%207.06728%2018.9228%206.91101Z'%20fill='white'/%3e%3c/svg%3e",Oe=l.span`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({entrypoint:e})=>y(e)&&r`
      justify-content: space-between;
    `}

  ${({entrypoint:e})=>w(e)&&r`
      justify-content: center;
    `}
`,je=({width:e})=>{const o=n(ft),i=n(Re),s=n(me),a=n($t),p=n(U),d=n(K),x=n(H),g=n(bt),f=n(wt),m=n(vt),h=n(V),u=n(Zt),M=n(Je),b=n(Ht),v=n(Y),_=n(Le),C=n(N=>te(N,Z)),E=D(),{isMobile:T}=J(),X=P.useCallback(()=>{i&&v?(E(k.createTransaction()),ve("exchanger","ButtonClickExchange")):x?(E(S.setExchangeStep({exchangeStep:de.STEP_2,source:null})),ve("exchanger","ButtonClickExchangeStepOne")):(E(S.getUser()),E(S.getUserVerification()))},[E,v,i,x]);P.useEffect(()=>{const N=oe=>{oe.key==="Enter"&&v&&X()};return document.addEventListener("keydown",N),()=>{document.removeEventListener("keydown",N)}},[X,v]);const F=C&&C.network&&C.network.memoNeeded&&!u;let A=!1;s&&(A=!0),v?A=!!(!i||_||M&&!g||o||F&&!f||s||m&&a):A=!1;const j=()=>d?"65px":"60px";return t.jsxs(lt,{type:"button",height:j(),entrypoint:h,sizeFont:"1.8rem",width:e||"",disabled:A,onClick:X,id:"exchange_now_click",style:{backgroundColor:b?`#${b}`:void 0},children:[x?t.jsx(t.Fragment,{children:T?t.jsx($,{id:"btn.exchange",defaultMessage:"Exchange"}):t.jsx($,{id:"btn.exchangeNow",defaultMessage:"Exchange Now"})}):null,p?t.jsxs(Oe,{entrypoint:h,children:[t.jsx($,{id:"fich.btn.proceed",defaultMessage:"Proceed"}),t.jsx(R,{src:Uo})]}):null,d?t.jsx(Oe,{entrypoint:h,children:t.jsx($,{id:"bitp.btn.startExchange",defaultMessage:"Start Exchange"})}):null]})},St=()=>{const e=n(he),o=n(Y),i=n(V),s=D();if(!o)return null;const a=()=>{e&&s(S.setExchangeStep({exchangeStep:de.STEP_1,source:null})),zt(s,de.STEP_1)};return t.jsx(lt,{entrypoint:i,height:"60px",width:"122px",type:"button",variant:"grey",sizeFont:"1.8rem",onClick:a,children:t.jsx($,{id:"btn.back",defaultMessage:"Back"})})},At=()=>t.jsxs("svg",{width:"10",height:"14",viewBox:"0 0 10 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[t.jsx("title",{children:"Locked icon"}),t.jsx("path",{d:"M9.19393 5.61065H2.90192V3.58322C2.90192 2.53456 3.60103 1.62571 4.57979 1.41598C5.9081 1.20624 7.09659 2.185 7.09659 3.51331C7.09659 11.375 7.85792 8.16667 8.20748 8.16667C8.55703 8.16667 8.49482 3.93278 8.49482 3.51331C8.49482 1.48589 6.74704 -0.191983 4.6497 0.0177509C2.83201 0.227485 1.50369 1.83544 1.50369 3.65314V5.61065H0.804581C0.455025 5.61065 0.105469 5.8903 0.105469 6.30976V13.3009C0.105469 13.6504 0.455025 14 0.804581 14H9.19393C9.6134 14 9.89304 13.6504 9.89304 13.3009V6.30976C9.89304 5.8903 9.6134 5.61065 9.19393 5.61065ZM5.69837 10.2947V11.2035C5.69837 11.623 5.41872 11.9027 4.99926 11.9027C4.57979 11.9027 4.30014 11.623 4.30014 11.2035V10.2947C3.88068 10.0151 3.60103 9.59559 3.60103 9.10621C3.60103 8.19737 4.43997 7.56816 5.34881 7.7779C5.83819 7.91772 6.25766 8.33719 6.39748 8.82657C6.5373 9.45577 6.18775 10.0151 5.69837 10.2947Z",fill:"#64F0BF"})]}),It=()=>t.jsxs("svg",{width:"10",height:"14",viewBox:"0 0 10 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[t.jsx("title",{children:"Unlocked icon"}),t.jsx("path",{d:"M8.31893 5.61065H2.90192V3.58322C2.90192 2.53456 3.60103 1.62571 4.57979 1.41598C5.9081 1.20624 7.09659 2.185 7.09659 3.51331C7.09659 3.93278 7.44615 4.21243 7.79571 4.21243C8.14526 4.21243 8.49482 3.93278 8.49482 3.51331C8.49482 1.48589 6.74704 -0.191983 4.6497 0.0177509C2.83201 0.227485 1.50369 1.83544 1.50369 3.65314V5.61065H0.804581C0.455025 5.61065 0.105469 5.8903 0.105469 6.30976V13.3009C0.105469 13.6504 0.455025 14 0.804581 14H9.19393C9.6134 14 9.89304 13.6504 9.89304 13.3009V7.18476C9.89304 5.8903 8.7384 5.61065 8.31893 5.61065ZM5.69837 10.2947V11.2036C5.69837 11.623 5.41872 11.9027 4.99926 11.9027C4.57979 11.9027 4.30014 11.623 4.30014 11.2036V10.2947C3.88068 10.0151 3.60103 9.59559 3.60103 9.10621C3.60103 8.19737 4.43997 7.56816 5.34881 7.7779C5.83819 7.91772 6.25766 8.33719 6.39748 8.82657C6.5373 9.45577 6.18775 10.0151 5.69837 10.2947Z",fill:"#64F0BF"})]}),Ko=l.div`
  position: relative;
`,qo=l.div`
  position: absolute;
  max-width: 322px;
  top: -220px;
  left: 0;
  z-index: -1;
  display: flex;
  flex-direction: column;
  opacity: 0;
  max-width: 322px;
  padding: 1.6rem;
  border-radius: 6px;
  pointer-events: none;
  overflow: hidden;
  transition: 0.3s linear;
  background-color: rgba(12, 14, 16, 1);
  ${({showTooltip:e})=>e?r`
          opacity: 1;
          z-index: 9;
          pointer-events: unset;
        `:null}
  ${({$isRtl:e})=>e?r`
          top: -180px;
          left: unset;
          right: 0;
        `:null}
  @media (${c.SM}) {
    width: 322px;
    left: -100px;
    ${({$isRtl:e})=>e?r`
            left: 0;
            right: unset;
          `:null}
  }
  @media (${c.MD}) {
    left: 0;
    ${({$isRtl:e})=>e?r`
            left: unset;
            right: 0px;
          `:null}
  }
`,_e=l.div`
  display: flex;
  &:first-child {
    margin-bottom: 2.4rem;
  }
`,Xe=l.div`
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  line-height: 0;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  svg {
    path {
      fill: ${({theme:e})=>e.colors.grey300};
    }
  }
  ${({checked:e})=>e?r`
          svg {
            path {
              fill: ${({theme:o})=>o.colors.secondary};
            }
          }
        `:null}
`,We=l.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.2rem;
  h5 {
    ${O}
    font-weight: 600;
    margin-bottom: 0.4rem;
  }
  p {
    ${O}
    font-weight: 400;
    color: ${({theme:e})=>e.colors.grey300};
  }
  ${({$isRtl:e})=>e?r`
          margin-left: 0;
          margin-right: 1.2rem;
        `:null}
`,Et=({isFixedRate:e,isFloatRate:o,showTooltip:i,children:s})=>{const a=n(z);return t.jsxs(Ko,{children:[s,t.jsxs(qo,{showTooltip:!!i,$isRtl:a,children:[t.jsxs(_e,{children:[t.jsx(Xe,{checked:!!o,children:t.jsx(It,{})}),t.jsxs(We,{$isRtl:a,children:[t.jsx("h5",{children:t.jsx($,{id:"exchange.rateTooltip.float.title",defaultMessage:"Floating exchange rate"})}),t.jsx("p",{children:t.jsx($,{id:"exchange.rateTooltip.float.text",defaultMessage:"Your amount can differ depending on the market volatility at the end of the transaction."})})]})]}),t.jsxs(_e,{children:[t.jsx(Xe,{checked:!!e,children:t.jsx(At,{})}),t.jsxs(We,{$isRtl:a,children:[t.jsx("h5",{children:t.jsx($,{id:"exchange.rateTooltip.fixed.title",defaultMessage:"Fixed exchange rate"})}),t.jsx("p",{children:t.jsx($,{id:"exchange.rateTooltip.fixed.text",defaultMessage:"Your amount will remain the same in spite of the market volatility."})})]})]})]})]})},Jo=l.div`
  position: relative;
  width: max-content;
  display: flex;
  align-items: center;
  @media (min-width: 540px) {
    position: initial;
  }
`,Qo=l.label`
  position: relative;
  cursor: pointer;
  border-radius: 100px;
  display: inline-block;
  background-color: transparent;
  ${({checked:e})=>e&&r`
      background-color: rgba(100, 240, 191, 0.2);
    `}
`,er=l.input`
  display: none;
  width: 1px;
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
`,tr=l.span`
  position: relative;
  width: 56px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px;
  padding: 0.6rem;
  border-radius: 100px;
  transition: 0.3s linear;
  border: 1px solid ${({theme:e})=>e.colors.primary};
  background-color: ${({theme:e})=>e.bgColors.dark400};
  ${({checked:e})=>e&&r`
      border: 1px solid rgba(0, 193, 125, 1);
      background-color: ${({theme:o})=>o.colors.primary};
    `}
`,or=l.span`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: 0.3s linear;
  transform: translateX(0);
  line-height: 0;
  opacity: 0.5;
  background-color: ${({theme:e})=>e.colors.primary};
  ${({checked:e})=>e&&r`
      opacity: 1;
      transform: translateX(171%) scale(1.75);
      background-color: ${({theme:o})=>o.bgColors.dark200};
      & svg {
        opacity: 1;
      }
    `}
  ${({$isRtl:e,checked:o})=>e&&o?r`
          transform: translateX(-171%) scale(1.75);
        `:null}
`,rr=l.span`
  line-height: 0;
  transform: scale(0.58);
  svg {
    opacity: 0;
    pointer-events: none;
    transition: 0.3s linear;
    margin-left: 1px;
  }
  ${({checked:e})=>e&&r`
      svg {
        opacity: 1;
      }
    `}
  ${({$isRtl:e})=>e?r`
          svg {
            margin-left: 0;
            margin-right: 1px;
          }
        `:null}
`,nr=l.span`
  line-height: 0;
  svg {
    opacity: 1;
    pointer-events: none;
    transition: 0.3s linear;
    margin: 0 0.2rem 0.2rem 0;
  }
  ${({checked:e})=>e?r`
          svg {
            opacity: 0;
          }
        `:null}
  ${({$isRtl:e})=>e?r`
          svg {
            margin: 0 0 0.2rem 0.2rem;
          }
        `:null}
`,sr=l.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  ${ae}
  font-weight: 500;
  margin: 0 0 0 1rem;
  ${({$isRtl:e})=>e?r`
          margin: 0 1rem 0 0;
        `:null}
`,Ze=l.button`
  ${ae}
  font-weight: 500;
  padding-bottom: 0.4rem;
  transition: 0.3s linear;
  color: ${({theme:e})=>e.colors.grey700};
  border-bottom: 1px dashed ${({theme:e})=>e.colors.secondary};
  &:hover {
    cursor: pointer;
    color: ${({theme:e})=>e.colors.white};
  }
  ${({checked:e})=>e&&r`
      color: ${({theme:o})=>o.colors.white};
    `}
`,Rt=()=>{const e=D(),o=n(z),i=n(Ae),s=n(ct),{isMobile:a}=J(),p=q(),[d,x]=P.useState(!1),g=()=>{e(S.setRateType(i?re.FLOAT:re.FIXED))},f=()=>{a||x(!0)},m=()=>{a||x(!1)},h=i?"exchange.toggleTooltip.float":"exchange.toggleTooltip.fixed",u=i?"Float":"Fixed";return t.jsxs(Jo,{children:[t.jsx(Qo,{checked:i,children:t.jsxs(Ct,{text:p.formatMessage({id:h,defaultMessage:`Click to switch the exchange rate to ${u}`}),position:{top:"-60px",left:"0"},children:[t.jsx(er,{onChange:g,checked:i,type:"checkbox"}),t.jsxs(tr,{checked:i,children:[t.jsx(or,{checked:i,$isRtl:o,children:t.jsx(rr,{checked:i,$isRtl:o,children:t.jsx(At,{})})}),t.jsx(nr,{checked:i,$isRtl:o,children:t.jsx(It,{})})]})]})}),t.jsx(Et,{showTooltip:d,isFixedRate:i,isFloatRate:s,children:t.jsxs(sr,{$isRtl:o,children:[t.jsx(Ze,{onClick:()=>e(S.setRateType(re.FLOAT)),onMouseEnter:f,onMouseLeave:m,checked:s,children:t.jsx($,{id:"floatingRate",defaultMessage:"Floating Rate"})}),t.jsx($,{id:"or",defaultMessage:"or"}),t.jsx(Ze,{onClick:()=>e(S.setRateType(re.FIXED)),onMouseEnter:f,onMouseLeave:m,checked:i,children:t.jsx($,{id:"fixedRate",defaultMessage:"Fixed Rate"})})]})})]})},ir="data:image/svg+xml,%3csvg%20width='20'%20height='21'%20viewBox='0%200%2020%2021'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M5.70215%2016.4868L5.70215%203.98682M5.70215%203.98682L9.13965%207.42432M5.70215%203.98682L2.26465%207.42432M14.2959%205.23682L14.2959%2017.7368M14.2959%2017.7368L17.7334%2014.2993M14.2959%2017.7368L10.8584%2014.2993'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",ar="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='18'%20height='16'%20viewBox='0%200%2018%2016'%20fill='none'%3e%3cpath%20d='M17.6713%209.99538C17.5479%209.86979%2017.3792%209.79905%2017.2031%209.79905C17.0271%209.79905%2016.8584%209.86979%2016.735%209.99538L13.76%2012.9791V5.10413C13.76%204.74169%2013.4662%204.44788%2013.1038%204.44788C12.7413%204.44788%2012.4475%204.74169%2012.4475%205.10413V12.9791L9.46376%209.99538C9.29808%209.82814%209.05576%209.76199%208.82808%209.82185C8.6004%209.88171%208.42195%2010.0585%208.35996%2010.2856C8.29796%2010.5127%208.36183%2010.7556%208.52751%2010.9229L12.64%2015.0004C12.699%2015.0617%2012.7707%2015.1095%2012.85%2015.1404C12.93%2015.1753%2013.0165%2015.1932%2013.1038%2015.1929C13.1883%2015.1932%2013.2718%2015.1753%2013.3488%2015.1404C13.4306%2015.1094%2013.5051%2015.0617%2013.5675%2015.0004L17.6713%2010.8966C17.9102%2010.6437%2017.9102%2010.2483%2017.6713%209.99538Z'%20fill='%230779FE'/%3e%3cpath%20d='M8.53626%206.00538C8.79547%206.26229%209.2133%206.26229%209.47251%206.00538C9.72841%205.74917%209.72841%205.3341%209.47251%205.07788L5.36001%201.00038C5.30101%200.93902%205.22935%200.891246%205.15001%200.86038C4.9894%200.799144%204.81187%200.799144%204.65126%200.86038C4.57044%200.893351%204.49631%200.940795%204.43251%201.00038L0.328763%205.07788C0.0728666%205.3341%200.0728666%205.74917%200.328763%206.00538C0.45064%206.13046%200.617874%206.201%200.792513%206.201C0.967152%206.201%201.13439%206.13046%201.25626%206.00538L4.24001%203.02163V10.8966C4.24001%2011.1311%204.36509%2011.3477%204.56814%2011.465C4.77118%2011.5822%205.02134%2011.5822%205.22439%2011.465C5.42743%2011.3477%205.55251%2011.1311%205.55251%2010.8966V3.02163L8.53626%206.00538Z'%20fill='%230779FE'/%3e%3c/svg%3e",lr="data:image/svg+xml,%3csvg%20width='31'%20height='31'%20viewBox='0%200%2031%2031'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='exchnage'%3e%3cpath%20id='Shape'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M25.0039%2022.1598L19.2312%2027.7383L13.4584%2022.1598L17.788%2022.1598L17.788%2012.3591L20.6743%2012.3591L20.6743%2022.1598L25.0039%2022.1598ZM9.12976%2017.9492L9.12976%208.14849L4.80019%208.14849L10.5729%202.57004L16.3457%208.14849L12.0161%208.14849L12.0161%2017.9492L9.12976%2017.9492Z'%20fill='white'/%3e%3cpath%20id='Shape_2'%20d='M19.2312%2027.7344L25.0039%2022.1559L20.6743%2022.1559L20.6743%2012.3552L17.788%2012.3552L17.788%2022.1559L13.4584%2022.1559L19.2312%2027.7344Z'%20fill='%2364F0BF'/%3e%3c/g%3e%3c/svg%3e",cr=l.button`
  height: max-content;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 8;
  padding: 1rem;
  border-radius: 50%;
  transition: 0.3s linear;
  transform: translate(-50%, -50%);
  ${({entrypoint:e})=>e==I.MAIN&&r`
      &:hover {
        cursor: pointer;
        background-color: ${({theme:o})=>o.colors.grey600};
        span {
          background: ${({theme:o})=>o.colors.secondary};
          svg {
            path {
              fill: ${({theme:o})=>o.colors.white};
            }
          }
        }
      }
      @media (${c.MD}) {
        top: 118px;
      }
    `}

  ${({entrypoint:e,theme:o})=>w(e)&&r`
      padding: 0;
      background: ${o.colors.primary};
    `}

  ${({isHidden:e})=>e&&r`
      display: none;
    `}
`,dr=l.span`
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  border-radius: 50%;
  transition: 0.3s linear;
  box-shadow: 0px 4px 33px rgba(0, 0, 0, 0.25);
  svg {
    transition: 0.3s linear;
  }

  ${({entrypoint:e,revertExchange:o,$isRtl:i})=>e==I.MAIN&&r`
      transform: rotate(-90deg);
      background: ${({theme:s})=>s.bgColors.primaryRevert};
      svg {
        transform: rotate(90deg);
      }
      ${o&&r`
        svg {
          transform: rotate(-90deg);
        }
      `}
      ${i&&r`
        background: ${({theme:s})=>s.bgColors.primary};
      `}
      @media (${c.SM}) {
        width: 60px;
        height: 60px;
      }
      @media (${c.MD}) {
        svg {
          transform: rotate(0);
        }
        ${o&&r`
          svg {
            transform: rotate(180deg);
          }
        `}
      }
    `}
  ${({entrypoint:e,revertExchange:o})=>y(e)&&r`
      width: 42px;
      height: 42px;
      box-shadow: none;
      border: 1px solid ${({theme:i})=>i.colors.grey200};
      background-color: ${({theme:i})=>i.bgColors.primary};
      &:hover {
        border: 1px solid ${({theme:i})=>i.colors.primary};
      }
      ${o&&r`
        svg {
          transform: rotate(-180deg);
        }
      `}
    `}

    ${({entrypoint:e,revertExchange:o,theme:i})=>w(e)&&r`
      width: 40px;
      height: 40px;

      &:hover {
        background: #035659;
      }

      ${o&&r`
        svg {
          transform: rotate(-180deg);
        }
      `}
    `}
`,Lt=()=>{const e=n(mt),o=n(Yt),i=n(U),s=n(K),a=n(H),p=n(V),d=n(z),{isMobile:x}=J(),g=D(),f=()=>{g(W.revertExchange(!e))};return t.jsx(cr,{entrypoint:p,isHidden:!!o,onClick:f,type:"button",children:t.jsxs(dr,{entrypoint:p,$isRtl:d,revertExchange:e,children:[a?t.jsx(R,{src:lr,width:x?25:30,height:x?25:30,title:"Revert icon"}):null,i?t.jsx(R,{src:ar,width:18,height:18,title:"Revert icon"}):null,s?t.jsx(R,{src:ir,width:20,height:20,title:"Revert icon"}):null]})})},pr=l.div`
  display: flex;

  & > div:nth-of-type(2) {
    margin-left: 16px;
  }
`,ce=l.div`
  ${ee}
  font-weight: 500;
  line-height: 150%;
  display: flex;
  align-items: center;
  color: ${({theme:e})=>e.colors.grey300};
  ${({error:e})=>e&&r`
      color: ${({theme:o})=>o.colors.error};
    `}
  @media (${c.MD}) {
    margin-top: 0.8rem;
  }
  button {
    ${ee}
    font-weight: 500;
    color: ${({theme:e})=>e.colors.secondary};
    transition: 0.3s linear;
    cursor: pointer;
    &:hover {
      color: ${({theme:e})=>e.colors.primary};
    }

    ${({error:e})=>e&&r`
        color: ${({theme:o})=>o.colors.error};
        text-decoration: underline;
      `}
  }
`,Ft=()=>{const e=D(),o=n(Ie),i=n(m=>te(m,G)),s=n(me),a=s&&!!o&&!!o.minAmount,p=s&&!!o&&!!o.maxAmount,d=()=>{o!=null&&o.minAmount&&e(S.setAmount({selectType:G,amount:o.minAmount.toString()}))},x=()=>{o!=null&&o.maxAmount&&e(S.setAmount({selectType:G,amount:o.maxAmount.toString()}))},g=()=>p?null:a?t.jsxs(ce,{error:!0,children:[t.jsx($,{id:"exchange.minAmountError",defaultMessage:"The minimal amount is"})," ",o!=null&&o.minAmount?t.jsxs("button",{onClick:d,children:[o.minAmount," ",i==null?void 0:i.code]}):t.jsx(Q,{width:"100px",height:"15px"})]}):t.jsxs(ce,{error:!1,children:[t.jsx($,{id:"exchange.minAmount",defaultMessage:"Min"}),":  ",o!=null&&o.minAmount?t.jsxs("button",{onClick:d,children:[o.minAmount," ",i==null?void 0:i.code]}):t.jsx(Q,{width:"100px",height:"15px"})]}),f=()=>o&&o.minAmount&&!o.message&&!o.maxAmount||a?null:p?t.jsxs(ce,{error:!0,children:[t.jsx($,{id:"exchange.maxAmountError",defaultMessage:"You exceeded the limit of"})," ",o&&o.maxAmount?t.jsxs("button",{onClick:x,children:[o.maxAmount," ",i==null?void 0:i.code]}):t.jsx(Q,{width:"100px",height:"15px"})]}):t.jsxs(ce,{error:!1,children:[t.jsx($,{id:"exchange.maxAmount",defaultMessage:"Max"}),":  ",o&&o.maxAmount?t.jsxs("button",{onClick:x,children:[o.maxAmount," ",i==null?void 0:i.code]}):t.jsx(Q,{width:"100px",height:"15px"})]});return t.jsxs(pr,{children:[g(),f()]})},hr=l.fieldset`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  transition: 0.3s linear;

  ${({entrypoint:e,inputFocus:o,invalidAddress:i})=>e==I.MAIN&&r`
      height: 58px;
      border-radius: 4px;
      border: 1px solid ${({theme:s})=>s.colors.grey700};
      &:hover {
        border: 1px solid ${({theme:s})=>s.colors.white};
        legend {
          color: ${({theme:s})=>s.colors.white};
        }
      }
      ${o&&r`
        border: 1px solid ${({theme:s})=>s.colors.secondary};
        legend {
          color: ${({theme:s})=>s.colors.secondary};
        }
        &:hover {
          border: 1px solid ${({theme:s})=>s.colors.secondary};
          legend {
            color: ${({theme:s})=>s.colors.secondary};
          }
        }
      `}
      ${i?r`
            border: 1px solid ${({theme:s})=>s.colors.error};
            &:hover {
              border: 1px solid ${({theme:s})=>s.colors.error};
            }
          `:null}
    `}
  ${({entrypoint:e,inputFocus:o,invalidAddress:i})=>y(e)&&r`
      height: 48px;
      border-radius: 8px;
      border: 1px solid ${({theme:s})=>s.colors.grey200};
      &:hover {
        border: 1px solid ${({theme:s})=>s.colors.primary};
        legend {
          color: ${({theme:s})=>s.colors.primary};
        }
      }
      ${o&&r`
        border: 1px solid ${({theme:s})=>s.colors.primary};
        legend {
          color: ${({theme:s})=>s.colors.primary};
        }
        &:hover {
          border: 1px solid ${({theme:s})=>s.colors.primary};
          legend {
            color: ${({theme:s})=>s.colors.primary};
          }
        }
      `}
      ${i?r`
            border: 1px solid ${({theme:s})=>s.colors.error};
            &:hover {
              border: 1px solid ${({theme:s})=>s.colors.error};
            }
          `:null}
    `}
    ${({entrypoint:e,inputFocus:o,invalidAddress:i,theme:s})=>w(e)&&r`
      padding: 16px 0;
      border-radius: 12px;
      border: 1px solid ${ne(s.colors.black,.2)};
      &:hover {
        border: 1px solid ${({theme:a})=>a.colors.primary};
        legend {
          color: ${({theme:a})=>a.colors.primary};
        }
      }
      ${o&&r`
        border: 1px solid ${({theme:a})=>a.colors.primary};
        legend {
          color: ${({theme:a})=>a.colors.primary};
        }
        &:hover {
          border: 1px solid ${({theme:a})=>a.colors.primary};
          legend {
            color: ${({theme:a})=>a.colors.primary};
          }
        }
      `}
      ${i?r`
            border: 1px solid ${({theme:a})=>a.colors.error};
            &:hover {
              border: 1px solid ${({theme:a})=>a.colors.error};
            }
          `:null}
    `}
`,mr=l.legend`
  position: relative;
  z-index: 2;
  ${O};
  line-height: 0;
  font-weight: 500;
  padding: 0 0.2rem;
  margin: 0 1.6rem;
  transition: 0.3s linear;
  color: ${({theme:e})=>e.colors.grey700};
  ${({inputFocus:e})=>e?r`
          color: ${({theme:o})=>o.colors.secondary};
        `:null}
  ${({invalidAddress:e})=>e?r`
          color: ${({theme:o})=>o.colors.error};
        `:null}
  ${({$isRtl:e})=>e?r`
          left: initial;
          right: 15px;
        `:null}
`,xr=l.input`
  width: 100%;
  height: 100%;
  ${O}
  font-weight: 500;
  padding: 0 0 0 1.6rem;
  background: transparent;
  &::placeholder {
    font-weight: 500;
    color: ${({theme:e})=>e.colors.grey300};
  }
  &:autofill,
  &:autofill:hover,
  &:autofill:focus {
    border-radius: 4px 0 0 4px;
    border: transparent;
    box-shadow: 0 0 0px 1000px ${({theme:e})=>e.bgColors.dark400} inset;
    -webkit-text-fill-color: ${({theme:e})=>e.colors.white};
  }
  ${({$isRtl:e})=>e?r`
          padding: 0 1.6rem 0 0;
        `:null}
  ${({entrypoint:e})=>y(e)&&r`
      font-weight: 400;
      color: ${({theme:o})=>o.bgColors.dark100};
      &::placeholder {
        font-weight: 400;
        color: ${({theme:o})=>o.colors.grey400};
      }
      &:autofill,
      &:autofill:hover,
      &:autofill:focus {
        border-radius: 8px 0 0 8px;
        border: transparent;
        box-shadow: 0 0 0px 1000px ${({theme:o})=>o.colors.white} inset;
        -webkit-text-fill-color: ${({theme:o})=>o.bgColors.dark100};
      }
    `}
    ${({entrypoint:e,theme:o})=>w(e)&&r`
      ${Me}
      color: ${o.colors.black};

      &::placeholder {
        color ${ne(o.colors.black,.64)};
      }
      &:autofill,
      &:autofill:hover,
      &:autofill:focus {
        border-radius: 8px 0 0 8px;
        border: transparent;
        box-shadow: 0 0 0px 1000px #f5faf8 inset;
        -webkit-text-fill-color: ${({theme:i})=>i.colors.black};
      }
    `}
`,gr=l.div`
  ${ee}
  font-weight: 500;
  margin-top: 0.8rem;
  color: ${({theme:e})=>e.colors.error};

  ${({entrypoint:e})=>w(e)&&r`
      ${Se}
      margin-top: 4px;
    `}
`,xe=({id:e,label:o,placeholder:i,handleInput:s,handleInputBlur:a,value:p,invalidAddress:d,errorMessage:x,children:g,disabled:f})=>{const m=n(H),h=n(z),u=n(T=>Ee(T,e)),M=n(V),b=D(),v=P.useRef(null),_=T=>{s(T)},C=()=>{b(W.focusFormInput(e))},E=()=>{b(W.blurFormInput(e)),a&&a()};return t.jsxs("div",{children:[t.jsxs(hr,{entrypoint:M,ref:v,inputFocus:u,invalidAddress:d||!1,children:[m?t.jsx(mr,{inputFocus:u,invalidAddress:d||!1,$isRtl:h,children:o}):null,t.jsx(xr,{entrypoint:M,$isRtl:h,onChange:_,onFocus:C,onBlur:E,placeholder:i,value:p,id:e,type:"text",autoComplete:"false",disabled:f}),g]}),d?t.jsx(gr,{entrypoint:M,children:x}):null]})},Bt=()=>{const e=n(Y),o=n(Je),i=n(ft),s=n(bt),a=n(h=>Ee(h,"emailInput")),p=q(),d=D();if(!e||!(o&&o==="email"))return null;const g=h=>{const u=h.target.value;d(k.setEmailAddress(u)),a&&i&&d(k.setInvalidEmailAddress(""))},f=()=>{s&&(wo.validate(s)?d(k.setInvalidEmailAddress("")):d(k.setInvalidEmailAddress(s)))},m=i?"Invalid email address":"";return t.jsx(xe,{id:"emailInput",label:p.formatMessage({id:"exchange.emailAddress.label",defaultMessage:"E-mail"}),placeholder:p.formatMessage({id:"exchange.emailAddress.input",defaultMessage:"Add your email for notifications"}),handleInput:g,handleInputBlur:f,value:s,invalidAddress:!!i,errorMessage:m})},ur=l.div`
  ${({entrypoint:e})=>e==I.MAIN&&r`
      margin-top: 1.8rem;
      @media (${c.SM}) {
        margin-top: 2rem;
      }
    `}
  ${({entrypoint:e})=>y(e)&&r`
      margin-top: 0.8rem;
    `}

  ${({entrypoint:e})=>w(e)&&r`
      margin-top: 8px;
    `}
`,fr=l.div`
  ${O}
  font-weight: 500;
  a {
    ${O}
    font-weight: 500;
    text-decoration: underline;
    color: ${({theme:e})=>e.colors.primary};
  }
  ${({entrypoint:e})=>e==I.MAIN&&r`
      color: ${({theme:o})=>o.colors.grey300};
    `}
  ${({entrypoint:e})=>y(e)&&r`
      line-height: 150%;
      color: ${({theme:o})=>o.colors.grey400};
    `}

    ${({entrypoint:e})=>w(e)&&r`
      ${ke}
      color: ${({theme:o})=>o.colors.black};
    `}
`;l.div`
  padding: 0 1.6rem;
  line-height: 0;
`;const Tt=()=>{const e=n(gt),o=n(U),i=n(K),s=n(H),a=n(ut),p=n(ao),d=n(wt),x=n(Y),g=n(V),f=n(Qe),m=n(C=>te(C,Z)),h=q(),u=D();if(!x)return null;const M=C=>{u(W.memoLinkClicked(C))},b=m!=null&&m.network.memoName?m==null?void 0:m.network.memoName:"MEMO",v=!!e,_=C=>{const T=C.target.value.trim();u(k.setMemoAddress(T||"")),v&&u(k.setInvalidMemoAddress(""))};return t.jsx(t.Fragment,{children:p?t.jsxs("div",{children:[t.jsx(xe,{id:"memoInput",label:h.formatMessage({id:"exchange.memo.label",defaultMessage:"MEMO"}),placeholder:h.formatMessage({id:"exchange.memo.input",defaultMessage:"Enter MEMO"}),value:a,handleInput:_,invalidAddress:v,errorMessage:e}),t.jsx(ur,{entrypoint:g,children:t.jsx(vo,{checked:d,setChecked:()=>u(k.setMemoAgree(!d)),children:t.jsxs(fr,{entrypoint:g,children:[s?t.jsx($,{id:"exchange.memoAgree",values:{extraName:b,a:C=>t.jsx("a",{onClick:()=>M(`${f}/terms#refund`),href:`${f}/terms#refund`,target:"_blank",rel:"noreferrer",children:C})},defaultMessage:"I agree that the <a>absence of the {extraName} can lead to a loss of funds.</a>"}):null,o?t.jsx($,{id:"fich.memoAgree",values:{extraName:b},defaultMessage:"I agree that the absence of the {extraName} can lead to a loss of funds."}):null,i?t.jsx($,{id:"bitp.memoAgree",values:{extraName:b},defaultMessage:"I agree that the absence of the {extraName} can lead to a loss of funds."}):null]})})})]}):null})},$r=l.div`
  @media (${c.XS}) {
    display: grid;
    grid-template-columns: 1fr 130px;
    justify-content: space-between;
  }
  @media (${c.SM}) {
    grid-template-columns: 1fr 165px;
    align-items: flex-start;
  }
  @media (${c.MD}) {
    grid-template-columns: 0.8fr 165px;
  }
`,br=l.div`
  h5 {
    ${rt}
    font-weight: 500;
  }
  p {
    ${ee}
    color: ${({theme:e})=>e.colors.grey300};
  }
  @media (${c.XS}) {
    margin-top: 1.2rem;
  }
  @media (${c.MD}) {
    margin-top: 0.8rem;
  }
`,wr=l.div`
  width: 100%;
  margin-top: 2rem;
  @media (${c.XS}) {
    margin-top: 1.2rem;
  }
`,vr=()=>{const e=n(vt),o=n($t),i=n(f=>Ee(f,"promocodeInput")),s=n(Y),a=!!n(Ut),p=q(),d=D();if(!s||a)return null;const x=f=>{const m=f.target.value;d(k.setPromocode(m.trim())),i&&o&&f.target.value.length===6&&d(k.setInvalidPromocode(""))},g=()=>{e&&(e.length<6||e.length>6?d(k.setInvalidPromocode("The promocode must be 6 characters long")):d(k.setInvalidEmailAddress("")))};return t.jsxs($r,{children:[t.jsxs(br,{children:[t.jsx("h5",{children:t.jsx($,{id:"exchange.promocode.title",defaultMessage:"Have a promocode?"})}),t.jsx("p",{children:t.jsx($,{id:"exchange.promocode.description",defaultMessage:"Enter code and it will apply automatically (optional)"})})]}),t.jsx(wr,{children:t.jsx(xe,{id:"promocodeInput",label:p.formatMessage({id:"exchange.promocode.label",defaultMessage:"Code"}),placeholder:p.formatMessage({id:"exchange.promocode.input",defaultMessage:"Enter here"}),handleInput:x,handleInputBlur:g,value:e,invalidAddress:!!o,errorMessage:o})})]})},Nt=()=>{const e=n(Re),o=n(Kt),i=n(H),s=n(U),a=n(K),p=n(et),d=n(Y),x=n(Le),g=n(j=>te(j,Z)),f=n(V),m=n(no),{isMobile:h}=J(),u=D(),M=q();if(!d)return null;const b=!!x,v=j=>{const N=j.target.value;u(k.setWithdrawalAddress(N.trim())),E(),ve("exchanger","InputAddressStepTwo")},_=async()=>{try{window&&m&&window.Telegram.WebApp.readTextFromClipboard();const j=await navigator.clipboard.readText();j&&u(k.setWithdrawalAddress(j.trim()))}catch(j){console.error(j)}},C=()=>{u(k.setWithdrawalAddress("")),E()};function E(){b&&u(k.setInvalidWithdrawalAddress(""))}const T=t.jsx(t.Fragment,{children:e&&!o&&!h?t.jsx("div",{children:t.jsx(at,{onClick:C,children:t.jsx(R,{src:it,title:"Clear icon"})})}):t.jsx(t.Fragment,{children:!o&&t.jsx(so,{onClick:_,type:"button",entrypoint:f,children:t.jsx($,{id:"btn.paste",defaultMessage:"Paste"})})})}),X=()=>{const j="exchange.recipinetAddress.input";return i?j:s?"fich.input.receivingAddress":a?"bitp.input.receivingAddress":j},F=()=>{if(i)return"Enter recipient {coinCode} wallet";if(p)return"Enter your {coinCode} receiving address"},A=M.formatMessage({id:X(),defaultMessage:F()},{coinCode:g==null?void 0:g.code});return t.jsx(xe,{id:"recipientInput",label:M.formatMessage({id:"exchange.recipientAddress.label",defaultMessage:"Recipient address"}),errorMessage:x,handleInput:v,placeholder:A,invalidAddress:b,disabled:!!o,value:e,children:T})},Pt=l.div`
  ${({entrypoint:e,$isRtl:o})=>e==I.MAIN&&r`
      margin-top: 2.2rem;
      @media (${c.SM}) {
        position: absolute;
        bottom: -3rem;
        right: 3rem;
        display: flex;
        justify-content: flex-end;
        margin-top: 0;
        button:last-child {
          margin-left: 1.6rem;
        }
        ${o&&r`
          right: unset;
          left: 3rem;
          button:last-child {
            margin-left: 0;
            margin-right: 1.6rem;
          }
        `}
      }
      @media (${c.MD}) {
        right: 2.4rem;
        bottom: -2.8rem;
        ${o&&r`
          left: 2.4rem;
        `}
      }
      @media (${c.LG}) {
        right: 3.4rem;
        bottom: -3rem;
        ${o&&r`
          left: 3.4rem;
        `}
      }
    `}

  ${({entrypoint:e})=>w(e)&&r`
      margin-top: 16px;

      @media (${B.M}) {
        margin-top: 20px;
      }

      @media (${B.L}) {
        margin-top: 24px;
      }

      @media (${B.XL}) {
        margin-top: 20px;
      }
    `}
`,Be=r`
  background: ${({theme:e})=>e.bgColors.primary};
`,ge=r`
  background: ${({theme:e})=>e.bgColors.primaryRtl};
`,Cr=l.div`
  position: relative;
`,jr=l.div`
  overflow: hidden;
  border-radius: 6px 0 0 0;
  ${({$isRtl:e})=>e&&r`
      border-radius: 0 6px 0 0;
    `}
  ${({isStep2:e})=>e?r`
          border-radius: 6px 6px 0 0;
        `:null}
`,yr=l.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`,Mr=l.div`
  ${Be}
  padding: 1.8rem 5.4rem 0 2.4rem;
  @media (${c.LG}) {
    padding: 1.8rem 5.4rem 0 3.4rem;
  }
  ${({$isRtl:e})=>e&&r`
      ${ge}
      padding: 1.8rem 2.4rem 0 5.4rem;
      @media (${c.LG}) {
        padding: 1.8rem 3.4rem 0 5.4rem;
      }
    `}
`,kr=l.div`
  ${Be}
  display: flex;
  justify-content: flex-end;
  padding: 1.8rem 2.4rem 0 5.4rem;
  @media (${c.LG}) {
    padding: 1.8rem 3.4rem 0 5.4rem;
  }
  ${({$isRtl:e})=>e&&r`
      ${ge}
      padding: 1.8rem 5.4rem 0 2.4rem;
      @media (${c.LG}) {
        padding: 1.8rem 5.4rem 0 3.4rem;
      }
    `}
`,Sr=l.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`,Vt=r`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${Be}
`,Ar=l.div`
  ${Vt}
  border-radius: 0 0 0 6px;
  padding: 3.4rem 5.4rem 5.2rem 2.4rem;
  @media (${c.LG}) {
    padding: 3.4rem 5.4rem 5.2rem 3.4rem;
  }
  ${({$isRtl:e})=>e&&r`
      ${ge}
      border-radius:  0 0 6px 0;
      padding: 3.4rem 2.4rem 5.2rem 5.4rem;
      @media (${c.LG}) {
        padding: 3.4rem 3.4rem 5.2rem 5.4rem;
      }
    `}
`,Ir=l.div`
  ${Vt}
  border-radius: 0 0 6px 0;
  padding: 3.4rem 2.4rem 5.2rem 5.4rem;
  @media (${c.LG}) {
    padding: 3.4rem 3.4rem 5.2rem 5.4rem;
  }
  ${({$isRtl:e})=>e&&r`
      ${ge}
      border-radius: 0 0 0 6px;
      padding: 3.4rem 5.4rem 5.2rem 2.4rem;
      @media (${c.LG}) {
        padding: 3.4rem 5.4rem 5.2rem 3.4rem;
      }
    `}
`,He=l.div`
  display: flex;
  flex-direction: column;
  gap: 3.3rem;
  ${({selectType:e})=>e==G&&r`
      margin-top: 2.2rem;
    `}
  ${({selectType:e})=>e==Z&&r`
      margin-top: 3.3rem;
    `}
`,Er=l.div`
  margin-top: 1.6rem;
`,Rr=l.div`
  ${O}
  font-weight: 500;
  margin-top: 1.6rem;
  @media (${c.MD}) {
    margin-bottom: 1rem;
  }
`,Lr=()=>{const e=n(he),o=n(z),i=n(dt),s=n(Y),a=q();return t.jsxs(jr,{isStep2:s,$isRtl:o,children:[i?null:t.jsx(jt,{step:e,maxSteps:5}),t.jsxs(yr,{children:[t.jsx(Mr,{$isRtl:o,children:t.jsx(yt,{step:e,maxSteps:5,title:a.formatMessage({id:"exchangeStep.item1",defaultMessage:tt.STEP_1})})}),t.jsx(kr,{$isRtl:o,children:t.jsx(ot,{service:ye.CEX})})]})]})},Fr=()=>{const e=n(V),o=n(z),i=n(Y);return t.jsxs(Cr,{children:[t.jsx(Lr,{}),t.jsxs(Sr,{children:[t.jsxs(Ar,{$isRtl:o,children:[t.jsxs("div",{children:[t.jsx(pe,{selectType:G}),t.jsx(Ft,{}),i?t.jsxs(He,{selectType:G,children:[t.jsx(vr,{}),t.jsx(Bt,{})]}):null]}),t.jsx(Rr,{children:t.jsx($,{id:"exchange.fees",defaultMessage:"No extra fees"})})]}),t.jsx(Lt,{}),t.jsxs(Ir,{$isRtl:o,children:[t.jsxs("div",{children:[t.jsx(pe,{selectType:Z}),t.jsx(Fe,{}),i?t.jsxs(He,{selectType:Z,children:[t.jsx(Nt,{}),t.jsx(Tt,{})]}):null]}),t.jsx(Er,{children:t.jsx(Rt,{})})]})]}),t.jsxs(Pt,{entrypoint:e,$isRtl:o,children:[t.jsx(St,{}),t.jsx(je,{width:"200px"})]})]})},Br="data:image/svg+xml,%3csvg%20width='20'%20height='22'%20viewBox='0%200%2020%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_6496_141637)'%3e%3cpath%20d='M10%2021C15.2467%2021%2019.5%2016.7467%2019.5%2011.5C19.5%206.25329%2015.2467%202%2010%202C4.75329%202%200.5%206.25329%200.5%2011.5C0.5%2016.7467%204.75329%2021%2010%2021Z'%20stroke='%23ABB6C1'/%3e%3cpath%20d='M9.37872%2013.0144V11.2984C9.96538%2011.2764%2010.409%2011.1664%2010.7097%2010.9684C11.0177%2010.7631%2011.1717%2010.4478%2011.1717%2010.0224V9.86843C11.1717%209.56043%2011.08%209.3221%2010.8967%209.15343C10.7134%208.98476%2010.4677%208.90043%2010.1597%208.90043C9.82972%208.90043%209.56205%208.99943%209.35672%209.19743C9.15872%209.3881%209.01938%209.63743%208.93872%209.94543L7.76172%209.46143C7.82772%209.2341%207.92305%209.0141%208.04772%208.80143C8.17238%208.58876%208.33372%208.40176%208.53172%208.24043C8.72972%208.07176%208.96805%207.93976%209.24672%207.84443C9.52538%207.74176%209.84805%207.69043%2010.2147%207.69043C10.5887%207.69043%2010.926%207.74543%2011.2267%207.85543C11.5274%207.9581%2011.784%208.10843%2011.9967%208.30643C12.2094%208.4971%2012.3744%208.7281%2012.4917%208.99943C12.609%209.27076%2012.6677%209.57143%2012.6677%209.90143C12.6677%2010.2241%2012.6127%2010.5137%2012.5027%2010.7704C12.4%2011.0197%2012.257%2011.2397%2012.0737%2011.4304C11.8904%2011.6137%2011.6814%2011.7641%2011.4467%2011.8814C11.212%2011.9914%2010.97%2012.0684%2010.7207%2012.1124V13.0144H9.37872ZM10.0607%2015.6324C9.75272%2015.6324%209.52905%2015.5591%209.38972%2015.4124C9.25038%2015.2657%209.18072%2015.0787%209.18072%2014.8514V14.6314C9.18072%2014.4041%209.25038%2014.2171%209.38972%2014.0704C9.52905%2013.9237%209.75272%2013.8504%2010.0607%2013.8504C10.376%2013.8504%2010.6034%2013.9237%2010.7427%2014.0704C10.882%2014.2171%2010.9517%2014.4041%2010.9517%2014.6314V14.8514C10.9517%2015.0787%2010.882%2015.2657%2010.7427%2015.4124C10.6034%2015.5591%2010.376%2015.6324%2010.0607%2015.6324Z'%20fill='%23ABB6C1'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_6496_141637'%3e%3crect%20width='20'%20height='21'%20fill='white'%20transform='translate(0%200.5)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",Tr=()=>t.jsx(fo,{children:t.jsx(R,{src:Br,title:"Tooltip icon"})}),Nr=l.button`
  display: flex;
  align-items: center;
  ${O}
  font-weight: 500;
  margin-top: 1.6rem;
`,Pr=()=>{const[e,o]=P.useState(!1);return t.jsx(Et,{showTooltip:e,children:t.jsxs(Nr,{onMouseEnter:()=>o(!0),onMouseLeave:()=>o(!1),children:[t.jsx($,{id:"exchange.rateTooltip",defaultMessage:"What is the difference?"}),"  ",t.jsx(Tr,{})]})})},Vr="/exolix-static/assets/aml-VwToy9zL.png",Dr=l.div`
  width: 100%;
  display: flex;
  align-items: center;

  ${({entrypoint:e})=>y(e)&&r`
      gap: 1.2rem;
      padding: 2rem 1.6rem;
      margin: 1.6rem 0;
      border-radius: 8px;
      border: 1px solid ${({theme:o})=>o.colors.grey200};
      background-color: ${({theme:o})=>o.colors.additional};
    `}

  ${({entrypoint:e})=>w(e)&&r`
      justify-content: center;
    `}
`,ze=l.span`
  ${({entrypoint:e})=>y(e)&&r`
      ${O}
      letter-spacing: -0.1px;
      color: ${({theme:o})=>o.bgColors.dark100};
    `}

  ${({entrypoint:e,theme:o})=>w(e)&&r`
      ${Se}
      color: ${o.colors.black};
      text-align: center;
      margin-top: 12px;

      @media (${B.M}) {
        margin-top: 16px;
      }
    `}
`,Ye=l.a`
  cursor: pointer;
  color: ${({theme:e})=>e.colors.primary};

  ${({entrypoint:e,theme:o})=>w(e)&&r`
      position: relative;

      &::after {
        content: '';
        width: 100%;
        height: 1px;
        background: ${o.colors.primary};
        position: absolute;
        bottom: 0;
        left: 0;
      }
    `}
`,Ue=()=>{const e=n(Qe),o=n(U),i=n(K),s=n(V),a=()=>t.jsxs(t.Fragment,{children:[t.jsx("img",{src:Vr,width:24,height:24,alt:"AML"}),t.jsx(ze,{entrypoint:s,children:t.jsx($,{id:"fich.policy",values:{policy:d=>t.jsx(Ye,{entrypoint:s,target:"_blank",href:`${e}/aml-policy`,rel:"noopener noreferrer",children:d})},defaultMessage:"We may check exchange in accordance <policy>with KYC policy</policy>"})})]}),p=()=>t.jsx(ze,{entrypoint:s,children:t.jsx($,{id:"bitp.policy",values:{policy:d=>t.jsx(Ye,{entrypoint:s,target:"_blank",href:`${e}/aml-policy`,rel:"noopener noreferrer",children:d})},defaultMessage:"We will verify the exchange in line with our <policy>KYC policy</policy>."})});return t.jsxs(Dr,{entrypoint:s,children:[o?a():null,i?p():null]})},Gr=l.div`
  position: relative;
  ${({entrypoint:e})=>y(e)&&r`
      ${Ne}
      background: ${({theme:o})=>o.colors.white};
    `}

  ${({entrypoint:e})=>w(e)&&r`
      ${Ne}
      background: #F5FAF8;
    `}
`,Or=l.div`
  overflow: hidden;
  background: ${({theme:e})=>e.bgColors.primary};
  @media (${c.SM}) {
    border-radius: 6px 0 0 0;
  }
  ${({$isRtl:e})=>e?r`
          background: ${({theme:o})=>o.bgColors.primaryRtl};
          @media (${c.SM}) {
            border-radius: 0 6px 0 0;
          }
        `:null}
  ${({isStep2:e})=>e?r`
          border-radius: 6px 6px 0 0;
          @media (${c.SM}) {
            border-radius: 6px 6px 0 0;
          }
        `:null}
`,_r=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.6rem 0 1.6rem;
  @media (${c.SM}) {
    padding: 1.4rem 3rem 0 3rem;
  }
`,Xr=l.div`
  ${({entrypoint:e,$isRtl:o})=>e==I.MAIN&&r`
      border-radius: 0 0 6px 6px;
      padding: 3rem 1.6rem 1.6rem 1.6rem;
      background: ${({theme:i})=>i.bgColors.primary};
      @media (${c.SM}) {
        padding: 3rem 3rem 5rem 3rem;
      }
      ${o&&r`
        background: ${({theme:i})=>i.bgColors.primaryRtl};
      `}
    `}
  ${({entrypoint:e})=>y(e)&&r`
      padding: 1.6rem 1.2rem 1.6rem 1.6rem;
      border-radius: 12px;
      @media (${c.S}) {
        padding: 2.4rem 2rem 2.4rem 2.4rem;
      }
    `}
  ${({entrypoint:e,theme:o})=>w(e)&&r`
      padding: 20px;

      @media (${B.S}) {
        border-radius: 20px;
      }
      @media (${B.M}) {
        padding: 24px;
        border-radius: 24px;
      }
      @media (${B.L}) {
        padding: 32px;
        border-radius: 32px;
      }
      @media (${B.XL}) {
        padding: 20px;
        border-radius: 20px;
      }
    `}
`,Wr=l.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  ${({entrypoint:e})=>y(e)&&r`
      gap: 0.8rem;
    `}

  ${({entrypoint:e})=>w(e)&&r`
      gap: 8px;
    `}
`,Zr=l.div`
  display: flex;
  flex-direction: column;
  ${({entrypoint:e})=>e==I.MAIN&&r`
      gap: 3.3rem;
      margin-top: 3.3rem;
    `}
  ${({entrypoint:e})=>(y(e)||w(e))&&r`
      gap: 1.6rem;
      margin-top: 1.6rem;
    `}
`,Hr=l.div`
  display: flex;
  flex-direction: column;
  ${({entrypoint:e})=>e==I.MAIN&&r`
      margin-top: 0.8rem;
      @media (${c.SM}) {
        flex-direction: row;
        justify-content: space-between;
      }
      @media (${c.MD}) {
        margin-top: 0;
      }
    `}
  ${({entrypoint:e})=>e==I.FICH&&r`
      margin-top: 1rem;
      align-items: center;
    `}
`,zr=l.div`
  margin-top: 2rem;
  @media (${c.SM}) {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.6rem;
  }
`,Yr=l.div`
  ${O}
  font-weight: 500;
  margin-top: 1.6rem;
  @media (${c.SM}) {
    margin-top: 0;
  }
`,Ur=()=>{const e=n(he),o=n(dt),i=n(Y),s=n(z),a=q();return t.jsxs(Or,{$isRtl:s,isStep2:i,children:[o?null:t.jsx(jt,{step:e,maxSteps:5}),t.jsxs(_r,{children:[t.jsx(yt,{step:e,maxSteps:5,title:a.formatMessage({id:"exchangeStep.item1",defaultMessage:tt.STEP_1})}),t.jsx(ot,{service:ye.CEX})]})]})},Ke=()=>{const e=n(U),o=n(K),i=n(et),s=n(H),a=n(V),p=n(z),d=n(Y),{isMobile:x}=J();return t.jsxs(Gr,{entrypoint:a,children:[s?t.jsx(Ur,{}):null,t.jsxs(Xr,{entrypoint:a,$isRtl:p,children:[t.jsxs(Wr,{entrypoint:a,children:[t.jsx(pe,{selectType:G}),t.jsx(Lt,{}),t.jsx(pe,{selectType:Z})]}),(e||s)&&t.jsxs(Hr,{entrypoint:a,children:[s?t.jsx(Ft,{}):null,t.jsx(Fe,{})]}),d?t.jsxs(Zr,{entrypoint:a,children:[t.jsx(Nt,{}),t.jsx(Tt,{}),t.jsx(Bt,{})]}):null,e?t.jsx(Ue,{}):null,s?t.jsxs(zr,{children:[t.jsx(Rt,{}),x?t.jsx(Pr,{}):null,t.jsx(Yr,{children:t.jsx($,{id:"exchange.fees",defaultMessage:"No extra fees"})})]}):null,t.jsxs(Pt,{entrypoint:a,$isRtl:p,children:[s&&!x?t.jsx(St,{}):null,s?t.jsx(je,{width:x?"100%":"200px"}):null,i?t.jsx(je,{}):null]}),o?t.jsx(Ue,{}):null]})]})},fn=()=>{const e=n(H),{isDesktop:o}=J();return e?t.jsxs(P.Suspense,{fallback:null,children:[t.jsx(eo,{}),o?t.jsx(Fr,{}):t.jsx(Ke,{}),t.jsx(jo,{})]}):t.jsx(Ke,{})};export{fn as default};
