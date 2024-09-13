import{aB as s,bP as O,ae as p,aJ as V,cY as X,cT as L,aT as W,aK as t,cU as G,bT as H}from"./main-D0zeExby.js";import{e as J}from"./index-htOA9nBG.js";import{s as i,A as l,O as K,b as Y,V as y,u as d,R as q,af as g,X as f,S as Q,T as U}from"./App-Bu7sLToa.js";import{C as _}from"./Checkbox-BAXk5913.js";import{I as Z,J as ee}from"./transactionSelectors-C3qaSoQO.js";import{c as m}from"./transactionSlice-D--0OdA8.js";import{u as te,a as se,b as ie,F as c,P as oe}from"./mixins-D6aRU5Fq.js";import"./tslib.es6-D9yd9Yl3.js";import"./StepsIndicator-DqQRjhr9.js";import"./index-dIKOytT1.js";const ae="/exolix-static/assets/bell-message-img-DNrxlQs4.webp",re="/exolix-static/assets/bell-message-mobile-img-yYTzxCIx.webp",ne="/exolix-static/assets/bg-img-3Me-5Rxy.webp",ce="/exolix-static/assets/bg-mobile-img-C2w4OuE-.webp",le="/exolix-static/assets/bg-rtl-img-Bl_OR1Iu.webp",de=i.div`
  position: relative;
  overflow: hidden;
  padding: 2.4rem 1.6rem;
  margin-top: 2.4rem;
  border-radius: 6px;
  background: url(${ce}) center / cover no-repeat;
  @media (${s.SM}) {
    padding: 2.4rem;
    background: url(${ne}) center / cover no-repeat;
    ${({$isRtl:e})=>e?l`
            background: url(${le}) center / cover no-repeat;
          `:null}
  }
`,me=i.div`
  position: relative;
  z-index: 2;
  @media (${s.SM}) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
`,ue=i.div`
  padding-top: 12rem;
  @media (${s.SM}) {
    padding-top: 0;
    width: 81%;
  }
`,be=i.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`,he=i.button`
  position: relative;
  z-index: 3;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${({theme:e})=>e.colors.grey700};
  transition: 0.3s linear;
  @media (${s.SM}) {
    &:hover {
      opacity: 0.6;
    }
  }
  svg {
    path {
      stroke: ${({theme:e})=>e.colors.white};
    }
  }
`,xe=i.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  min-height: 170px;
  pointer-events: none;
  img {
    width: 200px;
    height: auto;
  }
  ${({$isRtl:e})=>e?l`
          img {
            transform: scaleX(-1);
          }
        `:null}
  @media (${s.SM}) {
    top: auto;
    left: auto;
    right: -8.8rem;
    bottom: -6.3rem;
    transform: translateX(0);
    min-height: 100%;
    img {
      width: 190px;
    }
    ${({$isRtl:e})=>e?l`
            right: auto;
            left: -8.8rem;
          `:null}
  }
  @media (${s.MD}) {
    right: -1.4rem;
    bottom: -8rem;
    img {
      width: 260px;
    }
    ${({$isRtl:e})=>e?l`
            right: auto;
            left: -1.4rem;
          `:null}
  }
  @media (${s.LG}) {
    right: 3rem;
    bottom: -11.2rem;
    img {
      width: 360px;
    }
    ${({$isRtl:e})=>e?l`
            right: auto;
            left: 3rem;
          `:null}
  }
`;i.span`
  line-height: 0;
  svg {
    margin-bottom: -0.2rem;
  }
`;const pe=i.div`
  ${K}
  font-weight: 600;
  text-align: center;
  line-height: 150%;
  color: ${({theme:e})=>e.colors.white};
  @media (${s.SM}) {
    ${Y}
    text-align: start;
  }
  @media (${s.MD}) {
    letter-spacing: 0.1rem;
  }
`,ge=i.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 1.2rem;
  @media (${s.SM}) {
    flex-direction: row;
    gap: 6px;
    margin-top: 1.3rem;
  }
`,fe=i.input`
  width: 100%;
  height: 48px;
  font-size: 1.6rem;
  border-radius: 6px;
  padding: 1.2rem 2.2rem;
  margin-bottom: 0.6rem;
  color: ${({theme:e})=>e.colors.white};
  background-color: transparent;
  border: 1px solid ${({theme:e})=>e.colors.grey400};
  @media (${s.SM}) {
    width: calc(100% - 176px);
    margin-bottom: 0;
  }
  @media (${s.MD}) {
    width: 380px;
  }
  &::placeholder {
    color: ${({theme:e})=>e.colors.white};
    opacity: 0.6;
  }
  &:focus {
    border: 1px solid ${({theme:e})=>e.colors.secondary};
  }
  ${({invalidAddress:e})=>e&&l`
      border: 1px solid ${({theme:r})=>r.colors.error};
    `}
`,Se=i.div`
  margin-top: 1.6rem;
`,we=i.span`
  ${y}
  font-weight: 500;
  @media (${s.SM}) {
    transition: 0.3s linear;
    &:hover {
      color: ${({theme:e})=>e.colors.primary};
    }
  }
`,S=i.span`
  ${y}
  font-weight: 600;
  margin: 0 1.2rem;
  span {
    color: ${({theme:e})=>e.colors.secondary};
  }
`,Be=()=>{const e=te(),r=d(Z),M=d(ee,q),w=d(O),{isMobile:T,isDesktop:C}=se(),I=ie(),[b,E]=p.useState(!1),[k,N]=p.useState(!1),B=d(V),D=d(X),R=L("hideSubscribeNotification"),h=W("local","hideSubscribeNotificationTxs")||[],x=h.includes(r),A=x?h:[...h,r],{email:o,invalidEmail:u,success:$}=M;if(p.useEffect(()=>{$&&o&&g.custom(n=>t.jsx(f,{toastData:{...n,type:"success"},children:t.jsx(S,{children:t.jsx(c,{id:"transaction.subscribe.successMessage",values:{email:o,span:a=>t.jsx("span",{children:a})},defaultMessage:"We will notify you to <span>{email}</span> when the exchange will be completed"})})}),{duration:6e3})},[$,o]),!!(k||D||R==="true"||x))return null;const v=()=>{b?G("hideSubscribeNotification","true"):x||H("local","hideSubscribeNotificationTxs",A),N(!0)},j=n=>{J.validate(n)?e(m.setInvalidSubscribeEmail(!1)):e(m.setInvalidSubscribeEmail(!0))},z=n=>{const a=n.target.value;e(m.setSubscribeEmail(a)),j(a)},P=()=>{o?j(o):!o&&u&&e(m.setInvalidSubscribeEmail(!1))},F=n=>{n.preventDefault(),r&&o&&!u?(e(m.createSubscribeToTransaction({id:r,email:o})),v()):r&&o&&u?g.custom(a=>t.jsx(f,{toastData:{...a,type:"error"},children:t.jsx(S,{children:t.jsx(c,{id:"transaction.subscribe.invalidEmail",defaultMessage:"Please enter a valid email address"})})}),{duration:6e3,id:"subEmailErr"}):g.custom(a=>t.jsx(f,{toastData:{...a},children:t.jsx(S,{children:t.jsx(c,{id:"transaction.subscribe.warning",defaultMessage:"Please enter your email address"})})}),{duration:6e3,id:"subEmailWarn"})};return t.jsx(de,{$isRtl:w,children:t.jsxs(me,{children:[t.jsxs("div",{children:[t.jsx(be,{children:t.jsx(he,{onClick:v,children:t.jsx(Q,{src:U,width:16,height:16})})}),t.jsx(xe,{$isRtl:w,children:t.jsx("img",{src:C?ae:re,alt:"Bell message icon"})})]}),t.jsxs(ue,{children:[t.jsx(pe,{children:t.jsx(c,{id:"transaction.subscribe.title",defaultMessage:"Want to be notified when the exchange is done?"})}),t.jsxs(ge,{onSubmit:F,children:[t.jsx(fe,{type:"email",onChange:z,onBlur:P,placeholder:I.formatMessage({id:"transaction.subscribe.input",defaultMessage:"Enter your email here"}),value:o,invalidAddress:u}),t.jsx(oe,{entrypoint:B,height:"48px",sizeFont:"1.6rem",width:T?"100%":"176px",children:t.jsx(c,{id:"transaction.subscribe.btn.confirm",defaultMessage:"Confirm"})})]}),t.jsx(Se,{children:t.jsx(_,{checked:b,setChecked:()=>E(!b),children:t.jsx(we,{children:t.jsx(c,{id:"transaction.subscribe.checkboxText",defaultMessage:"I don’t want to see this notification anymore"})})})})]})]})})};export{Be as default};
