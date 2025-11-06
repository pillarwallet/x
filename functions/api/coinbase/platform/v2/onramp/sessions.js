// Cloudflare Pages Function to proxy Coinbase API requests
// This handles POST requests and forwards them to Coinbase API
// Path: /api/coinbase/platform/v2/onramp/sessions

export async function onRequestPost(context) {
  try {
    // Get the request body
    const body = await context.request.json();

    // Get the Authorization header
    const authHeader = context.request.headers.get('Authorization');

    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'Missing Authorization header',
        debug: 'No Authorization header found in request'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Forward the request to Coinbase API
    const coinbaseResponse = await fetch('https://api.cdp.coinbase.com/platform/v2/onramp/sessions', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get the response data - handle both JSON and text responses
    let data;
    const contentType = coinbaseResponse.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await coinbaseResponse.json();
    } else {
      // If response is not JSON, get it as text and wrap it
      const textData = await coinbaseResponse.text();
      data = {
        error: textData || 'Unauthorized',
        status: coinbaseResponse.status
      };
    }

    // Return the response with CORS headers
    return new Response(JSON.stringify(data), {
      status: coinbaseResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle CORS preflight requests
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
