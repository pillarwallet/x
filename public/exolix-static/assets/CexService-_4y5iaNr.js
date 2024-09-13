import{aD as g,aE as C,aM as o,aF as N,aH as R,aI as G,aJ as $,aK as t,bf as u,b5 as m,ae as l,aG as j,_ as v,aC as D,bg as S,bh as U,bi as O,aN as X}from"./main-C1sRb19f.js";import{s as x,A as c,b as z,a as K,c as Y,u as s,S as h}from"./App-B0y76GMS.js";import{E as p,s as J}from"./transactionSelectors-D2ZewSwG.js";import{s as H,a as V,b as W}from"./exchangeSelectors-D-PwAFNZ.js";import{u as q,a as Q,F as d,P as k,o as e2,L as b}from"./mixins-DxtyRTX9.js";import"./tslib.es6-D9yd9Yl3.js";import"./index-dIKOytT1.js";const M="data:image/svg+xml,%3csvg%20width='56'%20height='57'%20viewBox='0%200%2056%2057'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M28%205.52856C21.8867%205.52856%2016.9167%2010.4986%2016.9167%2016.6119C16.9167%2022.6086%2021.6067%2027.4619%2027.72%2027.6719C27.9067%2027.6486%2028.0933%2027.6486%2028.2333%2027.6719C28.28%2027.6719%2028.3033%2027.6719%2028.35%2027.6719C28.3733%2027.6719%2028.3733%2027.6719%2028.3967%2027.6719C34.37%2027.4619%2039.06%2022.6086%2039.0833%2016.6119C39.0833%2010.4986%2034.1133%205.52856%2028%205.52856Z'%20fill='white'/%3e%3cpath%20opacity='0.4'%20d='M39.8533%2033.8785C33.3433%2029.5385%2022.7267%2029.5385%2016.17%2033.8785C13.2067%2035.8619%2011.5733%2038.5452%2011.5733%2041.4152C11.5733%2044.2852%2013.2067%2046.9452%2016.1467%2048.9052C19.4133%2051.0985%2023.7067%2052.1952%2028%2052.1952C32.2933%2052.1952%2036.5867%2051.0985%2039.8533%2048.9052C42.7933%2046.9219%2044.4267%2044.2619%2044.4267%2041.3685C44.4033%2038.4985%2042.7933%2035.8385%2039.8533%2033.8785Z'%20fill='white'/%3e%3cpath%20d='M32.6667%2039.6652H29.75V36.7485C29.75%2035.7919%2028.9567%2034.9985%2028%2034.9985C27.0433%2034.9985%2026.25%2035.7919%2026.25%2036.7485V39.6652H23.3333C22.3767%2039.6652%2021.5833%2040.4585%2021.5833%2041.4152C21.5833%2042.3719%2022.3767%2043.1652%2023.3333%2043.1652H26.25V46.0819C26.25%2047.0385%2027.0433%2047.8319%2028%2047.8319C28.9567%2047.8319%2029.75%2047.0385%2029.75%2046.0819V43.1652H32.6667C33.6233%2043.1652%2034.4167%2042.3719%2034.4167%2041.4152C34.4167%2040.4585%2033.6233%2039.6652%2032.6667%2039.6652Z'%20fill='white'/%3e%3c/svg%3e",t2="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='90'%20height='90'%20viewBox='0%200%2090%2090'%20fill='none'%3e%3crect%20width='90'%20height='90'%20rx='45'%20fill='%23F8F9FF'/%3e%3crect%20x='0.5'%20y='0.5'%20width='89'%20height='89'%20rx='44.5'%20stroke='%23121217'%20stroke-opacity='0.1'/%3e%3cpath%20d='M35.8675%2035.5128C35.8675%2030.5434%2039.8859%2026.5%2044.8246%2026.5C49.7633%2026.5%2053.7818%2030.5434%2053.7818%2035.5128C53.7818%2040.4822%2049.7633%2044.5256%2044.8246%2044.5256C39.8859%2044.5256%2035.8675%2040.4822%2035.8675%2035.5128ZM50.4818%2047.3718H39.1675C33.1898%2047.3718%2028.3246%2052.2672%2028.3246%2058.2821C28.3256%2059.6656%2028.8723%2060.9922%2029.8446%2061.9706C30.8169%2062.9489%2032.1353%2063.499%2033.5103%2063.5H56.1389C57.5139%2063.499%2058.8324%2062.9489%2059.8047%2061.9706C60.7769%2060.9922%2061.3236%2059.6656%2061.3246%2058.2821C61.3246%2052.2672%2056.4595%2047.3718%2050.4818%2047.3718Z'%20fill='%230779FE'/%3e%3crect%20x='61.3242'%20y='60.5'%20width='26'%20height='26'%20rx='13'%20fill='%23FF7070'/%3e%3crect%20x='72.6992'%20y='65.375'%20width='3.25'%20height='9.75'%20rx='1.625'%20fill='white'/%3e%3crect%20x='72.6992'%20y='77.5625'%20width='3.25'%20height='3.25'%20rx='1.625'%20fill='white'/%3e%3c/svg%3e",i2="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='90'%20height='90'%20viewBox='0%200%2090%2090'%20fill='none'%3e%3crect%20width='90'%20height='90'%20rx='45'%20fill='%23F8F9FF'/%3e%3crect%20x='0.5'%20y='0.5'%20width='89'%20height='89'%20rx='44.5'%20stroke='%23121217'%20stroke-opacity='0.1'/%3e%3cpath%20d='M59.8749%2032H32.1251C29.8496%2032%2028%2033.8496%2028%2036.1251V54.8749C28%2057.1504%2029.8496%2059%2032.1251%2059H59.8749C62.1504%2059%2064%2057.1504%2064%2054.8749V36.1251C64%2033.8496%2062.1504%2032%2059.8749%2032ZM39.25%2037.9999C41.317%2037.9999%2042.9999%2039.683%2042.9999%2041.7501C42.9999%2043.8169%2041.317%2045.5%2039.25%2045.5C37.183%2045.5%2035.5001%2043.8169%2035.5001%2041.7501C35.5001%2039.683%2037.183%2037.9999%2039.25%2037.9999ZM46%2051.8751C46%2052.4961%2045.496%2053.0001%2044.875%2053.0001H33.625C33.004%2053.0001%2032.5%2052.4961%2032.5%2051.8751V51.125C32.5%2048.8495%2034.3496%2046.9999%2036.6251%2046.9999H41.8749C44.1504%2046.9999%2046%2048.8495%2046%2051.125V51.8751ZM58.375%2053.0001H50.1251C49.5041%2053.0001%2049.0001%2052.4961%2049.0001%2051.8751C49.0001%2051.2541%2049.5041%2050.7501%2050.1251%2050.7501H58.375C58.996%2050.7501%2059.5%2051.2541%2059.5%2051.8751C59.5%2052.4961%2058.996%2053.0001%2058.375%2053.0001ZM58.375%2046.9999H50.1251C49.5041%2046.9999%2049.0001%2046.4959%2049.0001%2045.8749C49.0001%2045.2539%2049.5041%2044.7499%2050.1251%2044.7499H58.375C58.996%2044.7499%2059.5%2045.2539%2059.5%2045.8749C59.5%2046.4959%2058.996%2046.9999%2058.375%2046.9999ZM58.375%2041H50.1251C49.5041%2041%2049.0001%2040.496%2049.0001%2039.875C49.0001%2039.254%2049.5041%2038.75%2050.1251%2038.75H58.375C58.996%2038.75%2059.5%2039.254%2059.5%2039.875C59.5%2040.496%2058.996%2041%2058.375%2041Z'%20fill='%230779FE'/%3e%3cpath%20d='M22.2661%2034.0801L22.2661%2029.79L22.2661%2029.5C22.2661%2027.2909%2024.057%2025.5%2026.2661%2025.5L26.9461%2025.5L31.6262%2025.5'%20stroke='%230779FE'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3cpath%20d='M59.7068%2064.5H64.3869H65.0669C67.276%2064.5%2069.0669%2062.7091%2069.0669%2060.5V59.82V55.1399'%20stroke='%230779FE'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3cpath%20d='M22.2661%2055.1399L22.2661%2059.82L22.2661%2060.5C22.2661%2062.7091%2024.057%2064.5%2026.2661%2064.5L26.9461%2064.5L31.6262%2064.5'%20stroke='%230779FE'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3cpath%20d='M69.0669%2034.8601L69.0669%2030.18L69.0669%2029.5C69.0669%2027.2909%2067.276%2025.5%2065.0669%2025.5L64.3869%2025.5L59.7068%2025.5'%20stroke='%230779FE'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3crect%20x='61.3242'%20y='60.5'%20width='26'%20height='26'%20rx='13'%20fill='%23FF7070'/%3e%3crect%20x='72.6992'%20y='65.375'%20width='3.25'%20height='9.75'%20rx='1.625'%20fill='white'/%3e%3crect%20x='72.6992'%20y='77.5625'%20width='3.25'%20height='3.25'%20rx='1.625'%20fill='white'/%3e%3c/svg%3e",s2="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='90'%20height='90'%20viewBox='0%200%2090%2090'%20fill='none'%3e%3crect%20width='90'%20height='90'%20rx='45'%20fill='%23F8F9FF'/%3e%3crect%20x='0.5'%20y='0.5'%20width='89'%20height='89'%20rx='44.5'%20stroke='%23121217'%20stroke-opacity='0.1'/%3e%3cpath%20d='M59.8749%2032H32.1251C29.8496%2032%2028%2033.8496%2028%2036.1251V54.8749C28%2057.1504%2029.8496%2059%2032.1251%2059H59.8749C62.1504%2059%2064%2057.1504%2064%2054.8749V36.1251C64%2033.8496%2062.1504%2032%2059.8749%2032ZM39.25%2037.9999C41.317%2037.9999%2042.9999%2039.683%2042.9999%2041.7501C42.9999%2043.8169%2041.317%2045.5%2039.25%2045.5C37.183%2045.5%2035.5001%2043.8169%2035.5001%2041.7501C35.5001%2039.683%2037.183%2037.9999%2039.25%2037.9999ZM46%2051.8751C46%2052.4961%2045.496%2053.0001%2044.875%2053.0001H33.625C33.004%2053.0001%2032.5%2052.4961%2032.5%2051.8751V51.125C32.5%2048.8495%2034.3496%2046.9999%2036.6251%2046.9999H41.8749C44.1504%2046.9999%2046%2048.8495%2046%2051.125V51.8751ZM58.375%2053.0001H50.1251C49.5041%2053.0001%2049.0001%2052.4961%2049.0001%2051.8751C49.0001%2051.2541%2049.5041%2050.7501%2050.1251%2050.7501H58.375C58.996%2050.7501%2059.5%2051.2541%2059.5%2051.8751C59.5%2052.4961%2058.996%2053.0001%2058.375%2053.0001ZM58.375%2046.9999H50.1251C49.5041%2046.9999%2049.0001%2046.4959%2049.0001%2045.8749C49.0001%2045.2539%2049.5041%2044.7499%2050.1251%2044.7499H58.375C58.996%2044.7499%2059.5%2045.2539%2059.5%2045.8749C59.5%2046.4959%2058.996%2046.9999%2058.375%2046.9999ZM58.375%2041H50.1251C49.5041%2041%2049.0001%2040.496%2049.0001%2039.875C49.0001%2039.254%2049.5041%2038.75%2050.1251%2038.75H58.375C58.996%2038.75%2059.5%2039.254%2059.5%2039.875C59.5%2040.496%2058.996%2041%2058.375%2041Z'%20fill='%230779FE'/%3e%3cpath%20d='M22.2661%2034.0801L22.2661%2029.79L22.2661%2029.5C22.2661%2027.2909%2024.057%2025.5%2026.2661%2025.5L26.9461%2025.5L31.6262%2025.5'%20stroke='%230779FE'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3cpath%20d='M59.7068%2064.5H64.3869H65.0669C67.276%2064.5%2069.0669%2062.7091%2069.0669%2060.5V59.82V55.1399'%20stroke='%230779FE'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3cpath%20d='M22.2661%2055.1399L22.2661%2059.82L22.2661%2060.5C22.2661%2062.7091%2024.057%2064.5%2026.2661%2064.5L26.9461%2064.5L31.6262%2064.5'%20stroke='%230779FE'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3cpath%20d='M69.0669%2034.8601L69.0669%2030.18L69.0669%2029.5C69.0669%2027.2909%2067.276%2025.5%2065.0669%2025.5L64.3869%2025.5L59.7068%2025.5'%20stroke='%230779FE'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3c/svg%3e",r2=x.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: ${({theme:e})=>e.fonts.main};

  ${({entrypoint:e,theme:i})=>g(e)&&c`
      height: 436px;
      border-radius: 12px;
      border: 1px solid ${i.colors.grey200};
      background-color: ${i.colors.white};
      padding: 1.6rem;
    `}

  ${({entrypoint:e,theme:i})=>C(e)&&c`
      height: 420px;
      padding: 20px;
      background: ${i.colors.glassFillGradient};
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      position: relative;

      @media (${o.S}) {
        border-radius: 19px;
      }
      @media (${o.M}) {
        height: 450px;
        padding: 24px;
        border-radius: 23px;
      }
      @media (${o.L}) {
        padding: 32px;
        border-radius: 31px;
      }
      @media (${o.XL}) {
        height: 420px;
        padding: 20px;
        border-radius: 19px;
      }

      &::after {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        border: 0;
        left: 0;
        z-index: -1;
        background: ${N(i.colors.black,.3)};

        @media (${o.S}) {
          border-radius: 19px;
        }
        @media (${o.M}) {
          border-radius: 23px;
        }
        @media (${o.L}) {
          border-radius: 31px;
        }
        @media (${o.XL}) {
          border-radius: 19px;
        }
      }
    `}
`,o2=x.p`
  ${({entrypoint:e,theme:i})=>g(e)&&c`
      ${z}
      max-width: 400px;
      text-align: center;
      color: ${i.bgColors.dark100};
      margin: 2.4rem 0;
    `}

  ${({entrypoint:e,theme:i})=>C(e)&&c`
      color: ${i.colors.white};
      ${K};
      text-align: center;
      margin: 20px 0;
    `}
`,n2=x.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({entrypoint:e})=>g(e)&&c`
      gap: 2.4rem;
    `}

  ${({entrypoint:e})=>C(e)&&c`
      width: 100%;
      gap: 24px;

      button {
        white-space: nowrap;
      }
    `}
`,E=x.div`
  padding: 24px;

  ${Y}
  border-radius: 16px;
  background: ${({theme:e})=>e.colors.glassFillGradient};

  &::before {
    border-radius: 16px;
    background: ${({theme:e})=>e.colors.glassStrokeGradient};
  }

  svg {
    width: 56px;
    height: 56px;
  }
`,a2=()=>{const e=s(H),i=s(V),n=s(R),a=s(G),r=s($),f=q(),{isMobileXs:F}=Q(),I=()=>{f(m.outerLinkClicked("register"))},_=()=>{f(m.outerLinkClicked("login"))},A=()=>{f(m.outerLinkClicked("verification"))},T=()=>{if(n)return t.jsx(h,{src:t2,title:"User access"});if(a)return t.jsx(E,{children:t.jsx(h,{src:M,title:"User access"})})},B=()=>{if(n)return t.jsx(h,{src:i2,title:"User access"});if(a)return t.jsx(E,{children:t.jsx(h,{src:M,title:"User access"})})},Z=()=>{if(n)return t.jsx(h,{src:s2,title:"User access"});if(a)return t.jsx(E,{children:t.jsx(h,{src:M,title:"User access"})})},P=()=>{if(n)return t.jsx(d,{id:"fich.auth.text",defaultMessage:"In order to complete your order, you need to have an account. Please create a new account or log in if you already have one."});if(a)return t.jsx(d,{id:"bitp.auth.text",defaultMessage:"To proceed with your order, you must have a BitPro account. Kindly sign up for a new account or log in if you already have one."})},w=e&&e===p.NOT_FINISHED,L=e&&e===p.CHECKING,y=e&&e===p.DECLINED;return t.jsxs(r2,{entrypoint:r,children:[e?null:T(),w||y?B():null,L?Z():null,t.jsxs(o2,{entrypoint:r,children:[i?null:P(),i&&(!e||w||y)?t.jsx(d,{id:`${u(r)}.auth.verify.text`,defaultMessage:"In order to complete your order, you need to verify your account."}):null,i&&L?t.jsx(d,{id:`${u(r)}.auth.checking.text`,defaultMessage:"Your verification data is under review. We will notify you once the process is complete. Thank you for your patience."}):null]}),t.jsxs(n2,{entrypoint:r,children:[i?null:t.jsxs(t.Fragment,{children:[t.jsx(k,{width:"106px",entrypoint:r,variant:"bordered",onClick:_,children:t.jsx(d,{id:`${u(r)}.auth.login.btn`,defaultMessage:"Login"})}),t.jsx(k,{entrypoint:r,width:F?"100%":"190px",onClick:I,children:t.jsx(d,{id:`${u(r)}.auth.signIn.btn`,defaultMessage:"Create Account"})})]}),i&&(!e||w||y)?t.jsx(k,{entrypoint:r,width:F?"100%":"190px",onClick:A,children:t.jsx(d,{id:`${u(r)}.auth.verify.btn`,defaultMessage:"Verify Account"})}):null]})]})},c2=()=>{const[e,i]=l.useState(null),n=s(j);return l.useEffect(()=>{n&&v(()=>import("./TxSuccessModal-is41_nsA.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9])).then(a=>i(()=>a.default))},[n]),t.jsx(t.Fragment,{children:e?t.jsx(l.Suspense,{fallback:null,children:t.jsx(e,{})}):null})},d2=x.div`
  position: relative;
  min-width: 320px;
  width: 100%;
  height: 100%;
  ${({entrypoint:e})=>e==D.MAIN&&c`
      min-height: 376px;
      ${e2};
    `}
  ${({entrypoint:e})=>g(e)&&c`
      overflow: hidden;
      border-radius: 12px;
      font-family: ${({theme:i})=>i.fonts.main};
    `}

    ${({entrypoint:e})=>C(e)&&c`
      overflow: hidden;
      font-family: ${({theme:i})=>i.fonts.main};

      @media (${o.S}) {
        border-radius: 19px;
      }
      @media (${o.M}) {
        border-radius: 23px;
      }
      @media (${o.L}) {
        border-radius: 31px;
      }
      @media (${o.XL}) {
        border-radius: 19px;
      }
    `}
`,l2=l.lazy(()=>v(()=>import("./Exchange-Byv6CSGH.js"),__vite__mapDeps([10,1,11,8,3,4,5,12,13,14,15,2,6,16,17,9,18,19,20,21,22,23]))),h2=l.lazy(()=>v(()=>import("./Transaction-BqrBzPwI.js").then(e=>e.T),__vite__mapDeps([24,1,8,3,4,5,14,19,17,20,13,6,25,26,21]))),u2=()=>{const e=s(J),i=s(j),n=s(S),a=s(W),r=s($);return t.jsxs(d2,{entrypoint:r,id:"cexService",children:[i?t.jsx(b,{isVisible:e,transparentBg:!0,height:60,width:60}):null,n?t.jsx(b,{isVisible:e,transparentBg:!0,height:30,width:30}):null,t.jsx(l.Suspense,{fallback:t.jsx(b,{isVisible:!0,transparentBg:!0}),children:a<U.STEP_3?t.jsx(l2,{}):t.jsx(h2,{})}),t.jsx(c2,{})]})},m2=()=>{const e=s(H),i=s(S),n=s(V),a=e&&e!==p.CONFIRMED;return l.useEffect(()=>()=>{O(X.CEX)},[]),t.jsx(t.Fragment,{children:i&&(!n||a)?t.jsx(a2,{}):t.jsx(u2,{})})};export{m2 as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["exolix-static/assets/TxSuccessModal-is41_nsA.js","exolix-static/assets/main-C1sRb19f.js","exolix-static/assets/trustpilot-BUNfR6gw.js","exolix-static/assets/App-B0y76GMS.js","exolix-static/assets/tslib.es6-D9yd9Yl3.js","exolix-static/assets/App-Bw_SQ7J0.css","exolix-static/assets/useIsomorphicLayoutEffect-iOFaqeeD.js","exolix-static/assets/Modal-DRpcZyx4.js","exolix-static/assets/mixins-DxtyRTX9.js","exolix-static/assets/formUiSelectors-Fui5Vn9C.js","exolix-static/assets/Exchange-Byv6CSGH.js","exolix-static/assets/RefreshButton-BF-MZeWw.js","exolix-static/assets/coinsSlice-WMpyUtlV.js","exolix-static/assets/StepsIndicator-C9YLJCmM.js","exolix-static/assets/exchangeSelectors-D-PwAFNZ.js","exolix-static/assets/exchangeSelectors-BUpjP3bu.js","exolix-static/assets/ratesSelectors-_fAw61MY.js","exolix-static/assets/index-dIKOytT1.js","exolix-static/assets/ratesSlice-Cyyr6YOS.js","exolix-static/assets/transactionSelectors-D2ZewSwG.js","exolix-static/assets/transactionSlice-CDqb9mqe.js","exolix-static/assets/unlocked-CVJBCS6B.js","exolix-static/assets/index-htOA9nBG.js","exolix-static/assets/Checkbox-DGHYF6Li.js","exolix-static/assets/Transaction-BqrBzPwI.js","exolix-static/assets/dropdown-DvVsuBFR.js","exolix-static/assets/txToCookies-xgw27gNY.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
