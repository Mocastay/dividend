exports.handler = async function(event) {
  const isin = event.queryStringParameters && event.queryStringParameters.isin;
  if (!isin || !/^[A-Z0-9]{12}$/.test(isin)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid ISIN' }) };
  }
  try {
    const fetch = require('node-fetch');
    const response = await fetch('https://api.divvydiary.com/symbols/' + isin, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (e) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: e.message })
    };
  }
};
