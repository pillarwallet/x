
import axios from 'axios';

const INFO_URL = 'https://api.hyperliquid.xyz/info';
const ADDRESS = '0x21175628173516104F90d0Aa30C41Ae153EC3019'; // User's address from screenshots/context if available, otherwise strict placeholder 
// User address from previous logs/context could be inferred or I will ask. 
// I'll use the one from the "Master Address" in the app if I can find it.
// Actually, I'll valid address from the code if I can.
// I will use a known active address or the user's address I saw in logs?
// I don't see the address in logs.
// I'll make the script take the address as an argument or just use a dummy one to check schema, 
// BUT to see the TP, I need the REAL USER address.
// I will inspect `src/store.ts` to see if there is a specific address hardcoded? No.
// I will assume I can run it with the address I find in the app (if I could see it).
// I will use a public address with orders if possible, or just check the schema.
// Better: I will use the address appearing in the user's previous screenshot or just ask to run it on '0x...'
// I'll look for "masterAddress" in the code interactions. 
// Ah, `PositionsCard` uses `masterAddress`.
// I will just use a hardcoded address 0x... for now, but really I want to verify if the ENDPOINT works.
// So I will use a random address.

async function testOrders() {
    // 1. Test frontendOpenOrders
    try {
        console.log('Fetching frontendOpenOrders...');
        const res = await axios.post(INFO_URL, {
            type: 'frontendOpenOrders',
            user: '0x21175628173516104f90d0aa30c41ae153ec3019'
        });
        console.log('FrontendOpenOrders Status:', res.status);
        console.log('FrontendOpenOrders Data Type:', typeof res.data);
        console.log('FrontendOpenOrders Is Array:', Array.isArray(res.data));
        if (Array.isArray(res.data) && res.data.length > 0) {
            console.log('Sample Order:', JSON.stringify(res.data[0], null, 2));
        } else {
            console.log('Data:', res.data);
        }
    } catch (e: any) {
        console.error('FrontendOpenOrders Failed:', e.message, e.response?.data);
    }

    // 2. Test openOrders
    try {
        console.log('\nFetching openOrders...');
        const res = await axios.post(INFO_URL, {
            type: 'openOrders',
            user: '0x21175628173516104f90d0aa30c41ae153ec3019'
        });
        console.log('OpenOrders Status:', res.status);
        console.log('OpenOrders Is Array:', Array.isArray(res.data));
        if (Array.isArray(res.data) && res.data.length > 0) {
            console.log('Sample Order:', JSON.stringify(res.data[0], null, 2));
        }
    } catch (e: any) {
        console.error('OpenOrders Failed:', e.message);
    }
}

testOrders();
