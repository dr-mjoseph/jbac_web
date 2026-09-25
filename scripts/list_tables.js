async function run() {
  const res = await fetch('https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/tables');
  const json = await res.json();
  console.log('Total Tables:', json.total_tables);
  console.log('Table Names:\n' + json.data.map(t => `${t.name} (${t.rows} rows)`).join('\n'));
}
run();
