// import widget from '@stealthex-io/widget'
import widget from '@stealthex-io/widget';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    const cleanup =  widget.init('5a96629e-bc77-4b3a-9025-0a3b4cb35354',{size: width });
    return () => cleanup();
  },[])
  return (
    <div style={{backgroundColor: 'white', minHeight: '100vh',display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div id="stealthex-widget-container" style={{ width: '80vw',paddingBottom: '10vh' }}></div>
    </div>
  )
}

export default App;
