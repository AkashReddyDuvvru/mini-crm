const fetch = require('node-fetch'); // we'll use native fetch since Node 18+

async function deployToRender() {
  const token = 'rnd_Vl15nnYc1lFFCmpXXzHHWFozHwzv';
  const ownerId = 'tea-d8nm611o3t8c73cuvllg';

  // 1. Create DB
  const dbRes = await fetch('https://api.render.com/v1/postgres', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      ownerId,
      name: 'mini-crm-db',
      databaseName: 'minicrm',
      databaseUser: 'crm',
      plan: 'free',
      region: 'oregon',
      version: '15'
    })
  });
  
  const dbData = await dbRes.json();
  console.log("DB Data:", dbData);
  
  let dbUrl = "";
  if (dbData.connectionInfo && dbData.connectionInfo.externalConnectionString) {
    dbUrl = dbData.connectionInfo.externalConnectionString;
  } else if (dbData.postgres && dbData.postgres.connectionInfo) {
    dbUrl = dbData.postgres.connectionInfo.externalConnectionString;
  } else {
    console.log("Could not extract connection string directly, using standard template based on name");
    // Render API doesn't always return the connection string immediately for security/provisioning reasons.
    // If it doesn't, we will just deploy the service via Blueprint since creating a service requiring DB URL might be tricky if we don't have it.
    // Actually, wait, creating web services with a new repo might require connecting the GitHub account.
  }
}

deployToRender().catch(console.error);
