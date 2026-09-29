import 'dotenv/config';

async function verifyConnection() {
  const apiKey = process.env.HINDSIGHT_API_KEY;
  const bankId = process.env.HINDSIGHT_BANK_ID;

  if (!apiKey || !bankId) {
    console.error('\x1b[31m[ERROR] Missing HINDSIGHT_API_KEY or HINDSIGHT_BANK_ID in .env file.\x1b[0m');
    process.exit(1);
  }

  console.log(`[Diagnostic] Testing connection to Vectorize Hindsight...`);
  console.log(`[Diagnostic] Bank ID: ${bankId}`);

  try {
    const res = await fetch(`https://api.hindsight.vectorize.io/v1/default/banks/${bankId}/prompts/preview`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ operation: 'retain' })
    });

    if (res.ok) {
      console.log('\x1b[32m✅ Hindsight API Connection Verified. Bank is active.\x1b[0m');
    } else {
      const errText = await res.text();
      console.error(`\x1b[31m[ERROR] Hindsight API returned HTTP ${res.status} ${res.statusText}\x1b[0m`);
      console.error(`\x1b[31m[Details] ${errText}\x1b[0m`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`\x1b[31m[ERROR] Network failure trying to reach Hindsight API.\x1b[0m`);
    console.error(err);
    process.exit(1);
  }
}

verifyConnection();
