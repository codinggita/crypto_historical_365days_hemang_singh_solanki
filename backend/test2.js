fetch('http://127.0.0.1:5000/coins/analytics/chronological-summary')
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
