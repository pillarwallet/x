import widget from '@stealthex-io/widget'
import { useEffect } from 'react';

const App = () => {
  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  useEffect(() => {
    const cleanup =  widget.init('2859934d-7955-4903-ba70-4db42bb33f02',{size: width });
    return () => cleanup();
  },[])
  return (
    <div style={{backgroundColor: 'white', minHeight: '100vh',display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div id="stealthex-widget-container" style={{ width: '80vw',paddingBottom: '10vh' }}></div>
    </div>
  )
}

export default App;
