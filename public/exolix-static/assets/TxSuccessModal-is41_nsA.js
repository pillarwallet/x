import{cV as g,aJ as h,bP as f,aY as y,ae as M,aU as l,bb as b,bD as j,aK as s,cW as w,b5 as d,bE as k}from"./main-C1sRb19f.js";import{C,t as T}from"./trustpilot-BUNfR6gw.js";import{M as E}from"./Modal-DRpcZyx4.js";import{e as v}from"./formUiSelectors-Fui5Vn9C.js";import{u as L,F as i,c as R}from"./mixins-DxtyRTX9.js";import{s as r,O as S,Q as I,A as $,b as A,u as t}from"./App-B0y76GMS.js";import"./useIsomorphicLayoutEffect-iOFaqeeD.js";import"./tslib.es6-D9yd9Yl3.js";const B="/exolix-static/assets/success-modal-Bu_8kLNX.png",D=r.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 4.4rem;
  background: ${({theme:e})=>e.bgColors.primary};
  p {
    ${S}
    text-align: center;
    margin-bottom: 1.6rem;
    max-width: 330px;
  }
`,F=r.span`
  ${I}
  font-weight: 500;
  margin: 2rem 0 0.8rem 0;
`,P=r.span`
  position: absolute;
  top: 20px;
  right: 20px;
  ${({$isRtl:e})=>e&&$`
      right: initial;
      left: 20px;
    `}
`,U=r.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 3.2rem;
  span {
    ${A}
    color: ${({theme:e})=>e.colors.grey300};
  }
`,J=()=>{const e=t(g),a=t(v),p=t(h),u=t(f),n=t(y),o=L();M.useEffect(()=>{a&&l()&&o(b.postMessage({data:{event:j,payload:{type:"cex/showModal",payload:{variant:"transactionSuccess",show:!0}}},source:null}))},[o,a]);const c=()=>{o(d.showTxSuccessModal(!1)),k(!1)},m=x=>{o(d.rateUsLinkClicked(x))};return s.jsx(E,{isOpen:a&&!l()||!!(a&&n&&w(n)),onClose:c,children:s.jsxs(D,{children:[s.jsx(P,{$isRtl:u,children:s.jsx(C,{onClose:c})}),s.jsx("img",{src:B,width:164,alt:"Success"}),s.jsx(F,{children:s.jsx(i,{id:"transaction.success.modal.title",defaultMessage:"Done! That was quick!"})}),s.jsx("p",{children:s.jsx(i,{id:"transaction.success.modal.text",defaultMessage:"Thank you for using Exolix. Cant wait to see you again"})}),s.jsxs(U,{children:[s.jsx("span",{children:s.jsx(i,{id:"transaction.success.modal.rateUs",defaultMessage:"Please, rate us on"})}),s.jsx("img",{src:T,width:90,alt:"Trustpilot"})]}),s.jsx(R,{onClick:()=>m(e||""),href:e||"",entrypoint:p,target:"_blank",rel:"noopener noreferrer",width:"162px",height:"48px",children:s.jsx(i,{id:"transaction.success.modal.leaveReview",defaultMessage:"Leave review"})})]})})};export{J as default};
