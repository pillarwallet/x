import{aC as n,aD as i,aE as c,aJ as p,aK as a}from"./main-D0zeExby.js";import{s as t,A as e,u as d,S as h}from"./App-Bu7sLToa.js";import{a as x}from"./StepsIndicator-DqQRjhr9.js";const b=t.label`
  display: flex;
  column-gap: 0.6rem;
  cursor: pointer;
`,m=t.div`
  position: relative;
  width: 16px;
  height: 16px;
  font-size: 1px;
  border-radius: 4px;
  margin-top: 0.2rem;
  cursor: pointer;
  svg {
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
    path {
      stroke: ${({theme:r})=>r.colors.white};
    }
  }
  ${({entrypoint:r,checked:s})=>r==n.MAIN&&e`
      border: 1px solid ${({theme:o})=>o.colors.grey300};
      ${s?e`
            border-color: ${({theme:o})=>o.colors.secondary};
            background-color: ${({theme:o})=>o.colors.secondary};
            box-shadow: 0 0 8px ${({theme:o})=>o.colors.secondary};
            svg {
              display: block;
            }
          `:null}
    `}
  ${({entrypoint:r,checked:s})=>i(r)&&e`
      border: 1px solid ${({theme:o})=>o.colors.grey200};
      ${s?e`
            background-color: transparent;
            border-color: ${({theme:o})=>o.colors.primary};
            svg {
              display: block;
              path {
                stroke: ${({theme:o})=>o.colors.primary};
              }
            }
          `:null}
    `}

  ${({entrypoint:r,checked:s})=>c(r)&&e`
      margin-top: 0;
      border: 1px solid ${({theme:o})=>o.colors.grey500};
      ${s?e`
            background-color: transparent;
            border-color: ${({theme:o})=>o.colors.primary};
            svg {
              display: block;
              path {
                stroke: ${({theme:o})=>o.colors.primary};
              }
            }
          `:null}
    `}
`,y=t.input`
  appearance: none;
  border: none;
  height: 100%;
  width: 100%;
  cursor: pointer;
`,k=({checked:r,setChecked:s,children:o})=>{const l=d(p);return a.jsxs(b,{htmlFor:"agreeCheckbox",onChange:()=>s(),checked:r,children:[a.jsx("div",{children:a.jsxs(m,{checked:r,entrypoint:l,children:[a.jsx(y,{id:"agreeCheckbox",type:"checkbox",checked:r,readOnly:!0}),a.jsx(h,{src:x,width:10,title:"Checkmark"})]})}),o]})};export{k as C};
