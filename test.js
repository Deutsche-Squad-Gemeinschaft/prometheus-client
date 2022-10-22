const { query } = require("gamedig");

query({
  type: 'squad',
  port: 27165,
  host: `194.26.183.179`
}).then(result => {
  console.log(JSON.stringify(result));
}).catch(e => {
  throw e;
});

