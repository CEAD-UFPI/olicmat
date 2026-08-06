async function main() {
  const loginRes = await fetch('http://localhost:3333/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'loadtest0@olicmat.com', senha: 'loadtest123' })
  });

  if (!loginRes.ok) {
    console.error("Login failed:", loginRes.status, await loginRes.text());
    return;
  }

  const { accessToken } = await loginRes.json();
  console.log("Token obtained successfully.");

  // Call 20 times
  for (let i = 0; i < 20; i++) {
    const questionsRes = await fetch('http://localhost:3334/api/prova/questoes', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log(`Call #${i + 1} - Status: ${questionsRes.status}`);
    if (questionsRes.status !== 200) {
      console.log(await questionsRes.text());
      break;
    }
  }
}

main().catch(console.error);
