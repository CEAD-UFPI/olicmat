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

  // Call iniciar
  const initRes = await fetch('http://localhost:3334/api/prova/iniciar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
  console.log("Iniciar Status:", initRes.status);

  const questionsRes = await fetch('http://localhost:3334/api/prova/questoes', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const questionsData = await questionsRes.json();
  if (!questionsData.questoes) {
    console.error("No questions returned:", questionsData);
    return;
  }

  const questaoId = questionsData.questoes[0].id;
  console.log("Real QuestaoId:", questaoId);

  const responderRes = await fetch('http://localhost:3334/api/prova/responder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      questaoId,
      alternativa: 'A'
    })
  });

  console.log("Responder Status:", responderRes.status);
  console.log("Responder Body:", await responderRes.json());
}

main().catch(console.error);
