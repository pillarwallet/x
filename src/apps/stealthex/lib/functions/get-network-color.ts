const colors = [
    {
      colorRTX: '#FF6671',
      colorETH: '#91A5F0',
      colorBSC: '#F5CE54',
      colorMAINNET: '#57DED6',
      colorDefault: '#9EB0C5',
    },
  ];
  
  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'TRX':
        return colors[0].colorRTX;
  
      case 'ETH':
        return colors[0].colorETH;
  
      case 'BSC':
      case 'BEP2':
        return colors[0].colorBSC;
  
      case 'MAINNET':
        return colors[0].colorMAINNET;
  
      default:
        return colors[0].colorDefault;
    }
  };
  
  export default getNetworkColor;