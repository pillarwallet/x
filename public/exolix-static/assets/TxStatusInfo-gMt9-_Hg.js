import{aC as $,aB as a,aD as b,aE as x,aF as M,aH as G,aI as T,aG as V,aJ as Z,bP as U,aK as e,bh as L}from"./main-CDKDnvW7.js";import{s as l,A as s,c as O,O as P,V as E,b as N,a3 as Y,u as c,S as h,ag as X,ah as K}from"./App-DCKfOddi.js";import{D as _,S as F,N as z}from"./Transaction-CVTjKSlZ.js";import{o as J,p as W,H as q,v as Q}from"./transactionSelectors-Bz099tFA.js";import{a as e2,F as d}from"./mixins-CNu8Cr8X.js";import"./tslib.es6-D9yd9Yl3.js";import"./exchangeSelectors-DP50MkAx.js";import"./transactionSlice-BLjUsgVM.js";import"./StepsIndicator-DBFPQONH.js";import"./useIsomorphicLayoutEffect-B0TE0m4X.js";import"./dropdown-DvVsuBFR.js";import"./txToCookies-CjVnD0W0.js";import"./unlocked-CVJBCS6B.js";import"./index-dIKOytT1.js";const t2="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='20'%20height='20'%20rx='10'%20fill='%23E72644'/%3e%3cpath%20d='M8.75%204.99951C8.75%204.30916%209.30964%203.74951%2010%203.74951C10.6904%203.74951%2011.25%204.30916%2011.25%204.99951V9.99951C11.25%2010.6899%2010.6904%2011.2495%2010%2011.2495C9.30964%2011.2495%208.75%2010.6899%208.75%209.99951V4.99951Z'%20fill='white'/%3e%3cpath%20d='M8.75%2014.3758C8.75%2013.6854%209.30964%2013.1258%2010%2013.1258C10.6904%2013.1258%2011.25%2013.6854%2011.25%2014.3758C11.25%2015.0662%2010.6904%2015.6258%2010%2015.6258C9.30964%2015.6258%208.75%2015.0662%208.75%2014.3758Z'%20fill='white'/%3e%3c/svg%3e",r2="data:image/svg+xml,%3csvg%20width='38'%20height='38'%20viewBox='0%200%2038%2038'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M24.9996%209.90026H10.9996C7.56179%209.90026%204.77734%2012.6847%204.77734%2016.1225V10.5069C4.77734%207.33352%207.34401%204.76685%2010.5173%204.76685H19.2596C22.4329%204.76685%2024.9996%206.72692%2024.9996%209.90026Z'%20fill='white'/%3e%3cpath%20opacity='0.4'%20d='M28.8573%2019.311C28.0795%2020.0732%2027.7062%2021.2243%2028.0173%2022.391C28.4062%2023.8376%2029.8374%2024.7554%2031.3307%2024.7554H32.7773V27.011C32.7773%2030.4488%2029.9929%2033.2332%2026.5551%2033.2332H10.9996C7.56179%2033.2332%204.77734%2030.4488%204.77734%2027.011V16.1221C4.77734%2012.6843%207.56179%209.8999%2010.9996%209.8999H26.5551C29.9773%209.8999%2032.7773%2012.6999%2032.7773%2016.1221V18.3776H31.0973C30.2262%2018.3776%2029.4329%2018.7199%2028.8573%2019.311Z'%20fill='white'/%3e%3cpath%20d='M35.8888%2019.9646V23.1691C35.8888%2024.0402%2035.1732%2024.7558%2034.2865%2024.7558H31.2843C29.6043%2024.7558%2028.0643%2023.5269%2027.9243%2021.8469C27.831%2020.8669%2028.2043%2019.9491%2028.8576%2019.3113C29.4332%2018.7202%2030.2265%2018.3779%2031.0976%2018.3779H34.2865C35.1732%2018.3779%2035.8888%2019.0935%2035.8888%2019.9646Z'%20fill='white'/%3e%3cpath%20d='M21.8887%2018.8443H12.5553C11.9176%2018.8443%2011.3887%2018.3154%2011.3887%2017.6777C11.3887%2017.0399%2011.9176%2016.511%2012.5553%2016.511H21.8887C22.5265%2016.511%2023.0553%2017.0399%2023.0553%2017.6777C23.0553%2018.3154%2022.5265%2018.8443%2021.8887%2018.8443Z'%20fill='white'/%3e%3c/svg%3e",i2="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='17'%20height='18'%20viewBox='0%200%2017%2018'%20fill='none'%3e%3cmask%20id='mask0_1105_12673'%20style='mask-type:luminance'%20maskUnits='userSpaceOnUse'%20x='-1'%20y='0'%20width='18'%20height='18'%3e%3cpath%20d='M16.6576%202.34459L14.9791%200.666016L8.3243%207.32078L1.66954%200.666016L-0.0090332%202.34459L6.64573%208.99935L-0.0090332%2015.6541L1.66954%2017.3327L8.3243%2010.6779L14.9791%2017.3327L16.6576%2015.6541L10.0029%208.99935L16.6576%202.34459Z'%20fill='white'/%3e%3c/mask%3e%3cg%20mask='url(%23mask0_1105_12673)'%3e%3crect%20x='-5.96143'%20y='-5.28711'%20width='28.5714'%20height='28.5714'%20fill='white'/%3e%3c/g%3e%3c/svg%3e",s2="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='71'%20height='70'%20viewBox='0%200%2071%2070'%20fill='none'%3e%3crect%20x='0.324341'%20width='70'%20height='70'%20rx='35'%20fill='white'/%3e%3crect%20x='0.824341'%20y='0.5'%20width='69'%20height='69'%20rx='34.5'%20stroke='%23121217'%20stroke-opacity='0.1'/%3e%3crect%20x='48.021'%20y='47.0547'%20width='20.2222'%20height='20.2222'%20rx='10.1111'%20fill='%23FF7070'/%3e%3crect%20x='56.8682'%20y='50.8457'%20width='2.52778'%20height='7.58333'%20rx='1.26389'%20fill='white'/%3e%3crect%20x='56.8682'%20y='60.3262'%20width='2.52778'%20height='2.52778'%20rx='1.26389'%20fill='white'/%3e%3cpath%20d='M41%2031.25H48V28C48%2025.9322%2046.3178%2024.25%2044.25%2024.25H25.75C23.6822%2024.25%2022%2025.9322%2022%2028V42C22%2044.0677%2023.6822%2045.75%2025.75%2045.75H44.25C46.3178%2045.75%2048%2044.0677%2048%2042V38.75H41C38.9322%2038.75%2037.25%2037.0677%2037.25%2035C37.25%2032.9322%2038.9322%2031.25%2041%2031.25Z'%20fill='%230779FE'/%3e%3cpath%20d='M41%2032.75C39.7594%2032.75%2038.75%2033.7593%2038.75%2035C38.75%2036.2407%2039.7593%2037.25%2041%2037.25H48V32.7501L41%2032.75ZM42%2035.75H41C40.5858%2035.75%2040.25%2035.4142%2040.25%2035C40.25%2034.5858%2040.5858%2034.25%2041%2034.25H42C42.4142%2034.25%2042.75%2034.5858%2042.75%2035C42.75%2035.4142%2042.4142%2035.75%2042%2035.75Z'%20fill='%230779FE'/%3e%3c/svg%3e",o2="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='71'%20height='70'%20viewBox='0%200%2071%2070'%20fill='none'%3e%3crect%20x='0.324341'%20width='70'%20height='70'%20rx='35'%20fill='white'/%3e%3crect%20x='0.824341'%20y='0.5'%20width='69'%20height='69'%20rx='34.5'%20stroke='%23121217'%20stroke-opacity='0.1'/%3e%3crect%20x='48.0209'%20y='47.0547'%20width='20.2222'%20height='20.2222'%20rx='10.1111'%20fill='%235AD383'/%3e%3cg%20clip-path='url(%23clip0_1173_15220)'%3e%3cpath%20d='M57.3355%2061.6366C57.2324%2061.7405%2057.0917%2061.7984%2056.9456%2061.7984C56.7995%2061.7984%2056.6589%2061.7405%2056.5558%2061.6366L53.4423%2058.5174C53.1192%2058.1938%2053.1192%2057.669%2053.4423%2057.3459L53.8321%2056.9553C54.1554%2056.6317%2054.6787%2056.6317%2055.0018%2056.9553L56.9457%2058.9025L62.1981%2053.6412C62.5213%2053.3175%2063.0452%2053.3175%2063.3678%2053.6412L63.7576%2054.0318C64.0807%2054.3554%2064.0807%2054.8802%2063.7576%2055.2033L57.3355%2061.6366Z'%20fill='white'/%3e%3c/g%3e%3cpath%20d='M41%2031.25H48V28C48%2025.9322%2046.3178%2024.25%2044.25%2024.25H25.75C23.6822%2024.25%2022%2025.9322%2022%2028V42C22%2044.0677%2023.6822%2045.75%2025.75%2045.75H44.25C46.3178%2045.75%2048%2044.0677%2048%2042V38.75H41C38.9322%2038.75%2037.25%2037.0677%2037.25%2035C37.25%2032.9322%2038.9322%2031.25%2041%2031.25Z'%20fill='%230779FE'/%3e%3cpath%20d='M41%2032.75C39.7594%2032.75%2038.75%2033.7593%2038.75%2035C38.75%2036.2407%2039.7593%2037.25%2041%2037.25H48V32.7501L41%2032.75ZM42%2035.75H41C40.5858%2035.75%2040.25%2035.4142%2040.25%2035C40.25%2034.5858%2040.5858%2034.25%2041%2034.25H42C42.4142%2034.25%2042.75%2034.5858%2042.75%2035C42.75%2035.4142%2042.4142%2035.75%2042%2035.75Z'%20fill='%230779FE'/%3e%3cdefs%3e%3cclipPath%20id='clip0_1173_15220'%3e%3crect%20width='12'%20height='12'%20fill='white'%20transform='translate(51.9999%2051)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",n2="/exolix-static/assets/overdue-icon-Bf7-j8Ua.svg",a2="/exolix-static/assets/refund-icon-SsF1n8dV.svg",c2="data:image/svg+xml,%3csvg%20width='60'%20height='61'%20viewBox='0%200%2060%2061'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M56.75%2030.5C56.75%2044.9975%2044.9975%2056.75%2030.5%2056.75C16.0025%2056.75%204.25%2044.9975%204.25%2030.5C4.25%2016.0025%2016.0025%204.25%2030.5%204.25C44.9975%204.25%2056.75%2016.0025%2056.75%2030.5Z'%20fill='%23797BF6'%20stroke='url(%23paint0_linear_7700_97377)'%20stroke-width='0.5'/%3e%3cg%20filter='url(%23filter0_bi_7700_97377)'%3e%3cpath%20d='M30.5%2050C41.2696%2050%2050%2041.2696%2050%2030.5C50%2019.7304%2041.2696%2011%2030.5%2011C19.7304%2011%2011%2019.7304%2011%2030.5C11%2041.2696%2019.7304%2050%2030.5%2050Z'%20fill='%23CFD3FD'%20fill-opacity='0.53'/%3e%3cpath%20d='M49.75%2030.5C49.75%2041.1315%2041.1315%2049.75%2030.5%2049.75C19.8685%2049.75%2011.25%2041.1315%2011.25%2030.5C11.25%2019.8685%2019.8685%2011.25%2030.5%2011.25C41.1315%2011.25%2049.75%2019.8685%2049.75%2030.5Z'%20stroke='url(%23paint1_linear_7700_97377)'%20stroke-width='0.5'/%3e%3c/g%3e%3cg%20filter='url(%23filter1_bi_7700_97377)'%3e%3cpath%20d='M39.6667%2020L27.6667%2032.1875L22.3333%2026.875L18%2030.625L27.6667%2040L44%2024.0625L39.6667%2020Z'%20fill='%23797BF6'/%3e%3cpath%20d='M39.8377%2019.8176L39.6597%2019.6508L39.4885%2019.8246L27.6649%2031.8329L22.5098%2026.6979L22.3453%2026.534L22.1697%2026.686L17.8364%2030.436L17.6301%2030.6145L17.826%2030.8045L27.4926%2040.1795L27.6672%2040.3488L27.8413%2040.1789L44.1746%2024.2414L44.3617%2024.0589L44.171%2023.8801L39.8377%2019.8176Z'%20stroke='url(%23paint2_linear_7700_97377)'%20stroke-width='0.5'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_bi_7700_97377'%20x='7.19563'%20y='7.19563'%20width='46.6087'%20height='47.3696'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeGaussianBlur%20in='BackgroundImageFix'%20stdDeviation='1.90219'/%3e%3cfeComposite%20in2='SourceAlpha'%20operator='in'%20result='effect1_backgroundBlur_7700_97377'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_backgroundBlur_7700_97377'%20result='shape'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='4.56525'/%3e%3cfeGaussianBlur%20stdDeviation='30.435'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='arithmetic'%20k2='-1'%20k3='1'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200.560784%200%200%200%200%200.607843%200%200%200%200%201%200%200%200%200.3%200'/%3e%3cfeBlend%20mode='normal'%20in2='shape'%20result='effect2_innerShadow_7700_97377'/%3e%3c/filter%3e%3cfilter%20id='filter1_bi_7700_97377'%20x='13.4573'%20y='15.4974'%20width='35.0697'%20height='29.7656'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeGaussianBlur%20in='BackgroundImageFix'%20stdDeviation='1.90219'/%3e%3cfeComposite%20in2='SourceAlpha'%20operator='in'%20result='effect1_backgroundBlur_7700_97377'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_backgroundBlur_7700_97377'%20result='shape'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='4.56525'/%3e%3cfeGaussianBlur%20stdDeviation='30.435'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='arithmetic'%20k2='-1'%20k3='1'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200.560784%200%200%200%200%200.607843%200%200%200%200%201%200%200%200%200.3%200'/%3e%3cfeBlend%20mode='normal'%20in2='shape'%20result='effect2_innerShadow_7700_97377'/%3e%3c/filter%3e%3clinearGradient%20id='paint0_linear_7700_97377'%20x1='92.3333'%20y1='-20.8989'%20x2='72.5009'%20y2='93.5517'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_7700_97377'%20x1='32.0286'%20y1='52.6718'%20x2='42.2421'%20y2='-0.730827'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint2_linear_7700_97377'%20x1='32.0191'%20y1='41.3702'%20x2='36.107'%20y2='13.5839'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",l2=l.div`
  padding: 1.6rem;
  margin-top: 2.4rem;
  ${({entrypoint:t,$isRtl:i})=>t==$.MAIN&&s`
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 6px;
      background: ${({theme:r})=>r.bgColors.additional};
      @media (${a.MD}) {
        flex-direction: row;
        justify-content: space-between;
      }
      ${i&&s`
        background: ${({theme:r})=>r.bgColors.additionalRtl};
      `}
    `}
  ${({entrypoint:t,isOverdue:i})=>b(t)&&s`
      border-radius: 8px;
      border: 1px solid ${({theme:r})=>r.colors.grey200};
      background-color: ${({theme:r})=>r.colors.grey100};
      ${i&&s`
        border: 1px solid ${({theme:r})=>r.colors.error};
        background-color: ${({theme:r})=>r.colors.errorLight};
      `}
    `}

    ${({entrypoint:t,isOverdue:i})=>x(t)&&s`
      border-radius: 16px;
      background: ${({theme:r})=>r.colors.infoNotificationFillGradient};
      ${O}

      &::before {
        background: ${({theme:r})=>r.colors.infoNotificationStrokeGradient};
        border-radius: 16px;
      }

      ${i&&s`
        background: linear-gradient(
          270deg,
          rgba(231, 38, 68, 0.04) 0%,
          rgba(231, 38, 68, 0.12) 100%
        );

        &::before {
          background: linear-gradient(
            180deg,
            rgba(231, 38, 68, 0.04) 0%,
            rgba(231, 38, 68, 0.12) 100%
          );
        }
      `}
    `}
`,B=l.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (${a.MD}) {
    flex-direction: row;
    align-items: center;
  }

  ${({entrypoint:t})=>x(t)&&s`
      flex-direction: row;
      gap: 20px;
    `}
`,I=l.div`
  margin-bottom: 1.2rem;
  @media (${a.MD}) {
    margin: 0 2.6rem 0 0;
    ${({$isRtl:t})=>t&&s`
        margin: 0 0 0 2.6rem;
      `}
  }

  ${({entrypoint:t})=>x(t)&&s`
      margin: 0;
      @media (${a.MD}) {
        margin: 0;
      }
    `}
`,S=l.div`
  text-align: center;
  @media (${a.SM}) {
    max-width: 600px;
  }
  @media (${a.MD}) {
    max-width: 100%;
    text-align: start;
  }
`,A=l.h3`
  ${({entrypoint:t})=>t==$.MAIN&&s`
      ${P}
      font-weight: 600;
      margin-bottom: 0.8rem;
    `}
  ${({entrypoint:t})=>b(t)&&s`
      ${E}
      color: ${({theme:i})=>i.bgColors.dark100};
    `}
`,C=l.p`
  ${({entrypoint:t})=>t==$.MAIN&&s`
      ${N}
      font-weight: 500;
      span {
        color: ${({theme:i})=>i.colors.secondary};
      }
    `}
  ${({entrypoint:t})=>b(t)&&s`
      ${E}
      color: ${({theme:i})=>i.bgColors.dark100};
      span {
        font-weight: 500;
      }
    `}

    ${({entrypoint:t,theme:i,isOverdue:r})=>x(t)&&s`
      ${Y}
      color: ${i.colors.black};
      font-weight: 500;
      text-align: left;

      ${r&&s`
        color: ${i.colors.accent};
      `}
    `}
`,d2=l.div`
  width: 100%;
  margin-top: 2.4rem;
  button {
    margin-top: 1rem;
  }
  @media (${a.XS}) {
    width: max-content;
    display: flex;
    justify-content: center;
    button {
      margin-top: 0;
    }
    a {
      margin: 0 1.6rem 0 0;
    }
  }
  @media (${a.MD}) {
    margin: 0 0 0 2.4rem;
  }
  ${({$isRtl:t})=>t&&s`
      a {
        margin: 0 0 0 1.6rem;
      }
      @media (${a.MD}) {
        margin: 0 2.4rem 0 0;
      }
    `}
`,u2=l.div`
  width: 100%;
  margin-top: 1.6rem;
  display: flex;
  justify-content: center;
  @media (${a.MD}) {
    width: max-content;
    justify-content: unset;
    margin: 0 0 0 2.4rem;
    ${({$isRtl:t})=>t&&s`
        margin: 0 2.4rem 0 0;
      `}
  }
`,y=l.div`
  ${({entrypoint:t,isOverdue:i})=>b(t)&&s`
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      ${i&&s`
        background-color: ${({theme:r})=>r.colors.error};
      `}
    `}

  ${({entrypoint:t,theme:i,isOverdue:r})=>x(t)&&s`
      width: 56px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 16px;
      background: ${M(i.colors.primary,.48)};
      position: relative;

      svg:nth-of-type(2) {
        position: absolute;
        bottom: 4px;
        right: -8px;
      }

      ${r&&s`
        background: ${M(i.colors.error,.48)};
      `}
    `}
`,k2=()=>{const t=c(G),i=c(T),r=c(V),o=c(J),u=c(W),n=c(Z),f=c(U),R=c(q),H=c(Q),{isMobileXs:D}=e2(),{amount:k,coinFrom:p,refundAddress:g,refundExtraId:m}=H??{},v={amount:e.jsx("span",{children:k}),coinFromCode:e.jsx("span",{children:p==null?void 0:p.coinCode}),refundAddress:e.jsx(e.Fragment,{children:g?e.jsx(_,{address:g,type:"short"}):""}),refundExtraAddress:m?e.jsxs(e.Fragment,{children:[", ",e.jsx("span",{children:m})]}):""},j={amount:e.jsx("span",{children:k}),coinFromCode:e.jsx("span",{children:p==null?void 0:p.coinCode}),refundAddress:e.jsx(e.Fragment,{children:g?e.jsxs(e.Fragment,{children:[" ",e.jsx(_,{address:g,type:"short"})]}):""}),refundExtraAddress:m?e.jsxs(e.Fragment,{children:[",",e.jsx(_,{address:m})]}):""};let w=null;switch(R){case L.STEP_3:w=e.jsxs(e.Fragment,{children:[e.jsxs(B,{entrypoint:n,children:[e.jsxs(I,{entrypoint:n,$isRtl:f,children:[r?e.jsx(h,{src:n2,title:"Timeover"}):null,t?e.jsx(y,{entrypoint:n,isOverdue:u,children:e.jsx(h,{src:i2,title:"Timeover"})}):null,i?e.jsx(y,{entrypoint:n,isOverdue:u,children:e.jsx(h,{src:K,title:"Timeover"})}):null]}),e.jsxs(S,{children:[r?e.jsxs(e.Fragment,{children:[e.jsx(A,{entrypoint:n,children:e.jsx(d,{id:"transaction.step3.overdue.title",defaultMessage:"Transaction is overdue"})}),e.jsx(C,{entrypoint:n,isOverdue:u,children:e.jsx(d,{id:"transaction.step3.overdue.description",defaultMessage:"Please, create a new exchange unless you have sent the funds. If the funds have been sent, please, wait for the confirmation from the system."})})]}):null,t?e.jsx(C,{entrypoint:n,isOverdue:u,children:e.jsx(d,{id:"fich.tx.overdue.description",defaultMessage:"Deposit address is not available anymore. Please, start new exchange. If you think that it is mistake, please, contact support."})}):null,i?e.jsx(C,{entrypoint:n,isOverdue:u,children:e.jsx(d,{id:"bitp.tx.overdue.description",defaultMessage:"Deposit address is not available anymore. Please, start new exchange. If you think that it is mistake, please, contact support."})}):null]})]}),r?e.jsxs(d2,{$isRtl:f,children:[e.jsx(F,{}),e.jsx(z,{width:D?"100%":"170px"})]}):null]});break;case L.STEP_4:w=e.jsxs(e.Fragment,{children:[e.jsxs(B,{entrypoint:n,children:[e.jsxs(I,{entrypoint:n,$isRtl:f,children:[r?e.jsx(h,{src:o?c2:a2,title:o?"Refunded":"Refund"}):null,t?e.jsx(y,{entrypoint:n,children:e.jsx(h,{src:o?o2:s2,title:o?"Refunded":"Refund"})}):null,i?e.jsxs(y,{entrypoint:n,children:[e.jsx(h,{src:r2,title:o?"Refunded":"Refund"}),e.jsx(h,{src:o?X:t2})]}):null]}),e.jsxs(S,{children:[r?e.jsx(A,{entrypoint:n,children:e.jsx(d,{id:o?"transaction.step4.2.refunded.title":"transaction.step4.2.refund.title",defaultMessage:o?"Refunding completed!":"Funds will be returned to your wallet"})}):null,e.jsxs(C,{entrypoint:n,isOverdue:u,children:[r?e.jsx(d,{id:o?"transaction.step4.2.refunded.description":"transaction.step4.2.refund.description",values:o?j:v,defaultMessage:o?"Your {amount} {coinFromCode} has been successfully refunded to wallet address{refundAddress}{refundExtraAddress}. For any assistance, please don't hesitate to reach out to our support team. Thank you for your understanding!":"Due to recent changes in exchange rates, your conversion could not be completed. Your funds {amount} {coinFromCode} will be refunded to your wallet {refundAddress}{refundExtraAddress} shortly."}):null,t?e.jsx(d,{id:o?"fich.tx.refunded.description":"fich.tx.refund.description",values:o?j:v,defaultMessage:o?"Your {amount} {coinFromCode} has been sent back to your wallet at{refundAddress}{refundExtraAddress}. If you need any assistance, feel free to reach out to our support team.":"Unable to complete your crypto conversion due to recent rate changes. Refunding {amount} {coinFromCode} to your wallet {refundAddress}{refundExtraAddress} shortly."}):null,i?e.jsx(d,{id:o?"bitp.tx.refunded.description":"bitp.tx.refund.description",values:o?j:v,defaultMessage:o?"Your {amount} {coinFromCode} has been sent back to your wallet at{refundAddress}{refundExtraAddress}. If you need any assistance, feel free to reach out to our support team.":"Unable to complete your crypto conversion due to recent rate changes. Refunding {amount} {coinFromCode} to your wallet {refundAddress}{refundExtraAddress} shortly."}):null]})]})]}),r?e.jsx(u2,{$isRtl:f,children:e.jsx(F,{})}):null]});break}return e.jsx(e.Fragment,{children:w?e.jsx(l2,{entrypoint:n,isOverdue:u,$isRtl:f,children:w}):null})};export{k2 as default};
