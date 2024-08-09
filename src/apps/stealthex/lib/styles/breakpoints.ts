export const size = {
    mobileS: 320,
    mobileM: 375,
    mobileL: 425,
    mobileXL: 680,
    tablet: 768,
    tabletL: 934,
    laptop: 1024,
    laptopM: 1200,
    laptopL: 1440,
  } as const;
  
  type SizeKey = keyof typeof size;
  
  type Device = {
    [key in SizeKey]: `(min-width: ${(typeof size)[key]}px)`;
  };
  
  export const device: Device = {
    mobileS: `(min-width: ${size.mobileS}px)`,
    mobileM: `(min-width: ${size.mobileM}px)`,
    mobileL: `(min-width: ${size.mobileL}px)`,
    mobileXL: `(min-width: ${size.mobileXL}px)`,
    tablet: `(min-width: ${size.tablet}px)`,
    tabletL: `(min-width: ${size.tabletL}px)`,
    laptop: `(min-width: ${size.laptop}px)`,
    laptopM: `(min-width: ${size.laptopM}px)`,
    laptopL: `(min-width: ${size.laptopL}px)`,
  };
  