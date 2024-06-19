import { useEffect } from 'react';

const Waitlist = () => {
  useEffect(() => {
    // Load the CSS
    const link = document.createElement('link');
    link.href = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);

    // Load the JavaScript
    const script = document.createElement('script');
    script.src = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <div>
        <div id='getWaitlistContainer' data-waitlist_id='17924' data-widget_type='WIDGET_1'></div>
      </div>
    </div>
  );
};

export default Waitlist;
