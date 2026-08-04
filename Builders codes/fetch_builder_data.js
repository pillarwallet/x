const https = require('https');
const fs = require('fs');
const lz4js = require('lz4js');

const builderAddress = '0x5e1d081488a5e746c1a13bf92103c1b9ee5962a2';
// 2026-01-12 is today. Let's check 12, 11, 10.
const dates = ['20260112', '20260111', '20260110', '20260109'];

async function fetchAndProcess(date) {
    const url = `https://stats-data.hyperliquid.xyz/Mainnet/builder_fills/${builderAddress}/${date}.csv.lz4`;
    // console.log(`Fetching ${url}...`);

    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                // console.log(`No data for ${date} (Status: ${res.statusCode})`);
                resolve(null);
                return;
            }

            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                try {
                    const decompressed = lz4js.decompress(buffer);
                    const csv = Buffer.from(decompressed).toString('utf8');
                    resolve({ date, csv });
                } catch (e) {
                    console.error(`Error decompressing ${date}:`, e.message);
                    resolve(null);
                }
            });
            res.on('error', () => resolve(null));
        });
    });
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((h, index) => {
            row[h] = values[index];
        });
        data.push(row);
    }
    return data;
}

async function main() {
    const results = [];
    for (const date of dates) {
        const result = await fetchAndProcess(date);
        if (result) {
            results.push(result);
        }
    }

    if (results.length === 0) {
        console.log("No builder referral data found for the last 3-4 days.");
        return;
    }

    console.log("Builder Code Referrals (Last available data):");
    let totalFees = 0;
    const uniqueUsers = new Set();
    const dailyStats = {};

    results.forEach(({ date, csv }) => {
        const records = parseCSV(csv);
        let dailyFees = 0;
        let dailyUsers = new Set();

        records.forEach(r => {
            const fee = parseFloat(r.builder_fee || 0);
            dailyFees += fee;
            totalFees += fee;
            if (r.user) {
                uniqueUsers.add(r.user);
                dailyUsers.add(r.user);
            }
        });

        dailyStats[date] = {
            fees: dailyFees,
            users: dailyUsers.size,
            transactions: records.length
        };
    });

    console.table(dailyStats);
    console.log(`\nTotal Builder Fees: ${totalFees.toFixed(6)} USDC`);
    console.log(`Total Unique Users: ${uniqueUsers.size}`);

    console.log("\nUser Breakdown:");
    const userBreakdown = {};
    results.forEach(({ csv }) => {
        const records = parseCSV(csv);
        records.forEach(r => {
            if (r.user) {
                if (!userBreakdown[r.user]) {
                    userBreakdown[r.user] = 0;
                }
                userBreakdown[r.user] += parseFloat(r.builder_fee || 0);
            }
        });
    });

    Object.entries(userBreakdown).forEach(([user, fee]) => {
        console.log(`User: ${user}, Total Fee: ${fee.toFixed(6)} USDC`);
    });
}

main();
