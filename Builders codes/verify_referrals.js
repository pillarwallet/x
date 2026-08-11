const https = require('https');

const data = JSON.stringify({
    type: "userFunding",
    user: "0x5e1D081488a5e746c1a13Bf92103C1B9eE5962A2"
});

const options = {
    hostname: 'api.hyperliquid.xyz',
    port: 443,
    path: '/info',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        // console.log(body);
        const parsed = JSON.parse(body);
        console.log(formatOutput(parsed));
    });
});

function formatOutput(data) {
    return JSON.stringify(data, null, 2);
}

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
