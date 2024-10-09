import{aB as A,aK as r,ae as g}from"./main-CDKDnvW7.js";import{A as p,s as l,S as u,T as m}from"./App-DCKfOddi.js";import{u as S}from"./useIsomorphicLayoutEffect-B0TE0m4X.js";const B="data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%201.16265L6.7698%208L0%2014.8374L1.16282%2016L8%209.0946L14.8372%2016L16%2014.8374L9.2302%208L16%201.16265L14.8372%200L8%206.9054L1.16282%200L0%201.16265Z'%20fill='white'/%3e%3c/svg%3e",a=p`
  height: max-content;
  line-height: 0;
  svg {
    path {
      stroke: ${({theme:t})=>t.colors.white};
    }
  }
  @media (${A.SM}) {
    svg {
      transition: 0.3s linear;
      path {
        stroke: ${({theme:t})=>t.colors.white};
      }
      &:hover {
        opacity: 0.6;
      }
    }
  }
`,v=l.button`
  ${a}
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${({theme:t})=>t.colors.grey700};
  background-color: ${({theme:t})=>t.bgColors.dark400};
`,w=l.button`
  ${a}
`,f=({variant:t="default",onClose:s})=>r.jsxs(r.Fragment,{children:[t==="default"?r.jsx(w,{onClick:()=>s(),children:r.jsx(u,{src:B,title:"Close"})}):null,t==="bordered"?r.jsx(v,{onClick:()=>s(),children:r.jsx(u,{src:m,width:16,height:16,title:"Close"})}):null]});function E(t,s,o,e){const n=g.useRef(s);S(()=>{n.current=s},[s]),g.useEffect(()=>{const c=(o==null?void 0:o.current)??window;if(!(c&&c.addEventListener))return;const i=d=>n.current(d);return c.addEventListener(t,i,e),()=>{c.removeEventListener(t,i,e)}},[t,o,e])}function M(t,s,o="mousedown"){E(o,e=>{const n=t==null?void 0:t.current;!n||n.contains(e.target)||s(e)})}const V="data:image/png;base64,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";export{f as C,V as t,M as u};
