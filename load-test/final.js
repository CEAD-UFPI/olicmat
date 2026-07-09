/**
 * OLICMAT Load Test - Final Script (using autocannon CLI)
 * Usage: node load-test/final.js [smoke|load|stress]
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.TARGET_URL || 'http://localhost:3333';
const RESULTS_DIR = path.join(__dirname, 'results');
fs.mkdirSync(RESULTS_DIR, { recursive: true });

const PASSWORD = 'loadtest123';
const TEST_USER = 'loadtest4@olicmat.com';

async function getToken() {
  const res = await fetch(BASE_URL + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_USER, senha: PASSWORD }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.accessToken;
}

async function startExam(token) {
  await fetch(BASE_URL + '/api/inscricoes/minha/iniciar-prova', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
  });
}

const scenarios = {
  smoke: { connections: 10, duration: 10, name: 'Smoke Test' },
  load: { connections: 50, duration: 30, name: 'Expected Load (50 concurrent)' },
  stress: { connections: 200, duration: 15, name: 'Stress Test (200 concurrent)' },
};

async function runTest(endpoint, method, path, token, connections, duration) {
  const cmd = `npx autocannon -c ${connections} -d ${duration} -m ${method} -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" --json ${BASE_URL}${path}`;
  const output = execSync(cmd, { cwd: __dirname, encoding: 'utf-8' });
  return JSON.parse(output);
}

async function main() {
  const scenarioName = process.argv[2] || 'smoke';
  const scenario = scenarios[scenarioName];
  if (!scenario) { console.error('Use: smoke, load, stress'); process.exit(1); }

  console.log('OLICMAT Exam Load Test - ' + scenario.name);
  console.log('   Target:', BASE_URL);
  console.log('   Connections:', scenario.connections, '| Duration:', scenario.duration + 's');

  const token = await getToken();
  if (!token) { console.error('No token'); process.exit(1); }
  await startExam(token);
  console.log('Exam started');

  const results = {};

  // Test 1: GET /api/prova/questoes
  console.log('\nGET /api/prova/questoes...');
  results.questoes = await runTest('questoes', 'GET', '/api/prova/questoes', token, scenario.connections, scenario.duration);
  console.log('   Done:', results.questoes.requests?.total || 'N/A', 'requests');

  // Test 2: POST /api/prova/responder
  console.log('\nPOST /api/prova/responder...');
  results.responder = await runTest('responder', 'POST', '/api/prova/responder', token, scenario.connections, Math.min(scenario.duration, 10));
  console.log('   Done:', results.responder.requests?.total || 'N/A', 'requests');

  // Test 3: POST /api/prova/finalizar
  console.log('\nPOST /api/prova/finalizar...');
  results.finalizar = await runTest('finalizar', 'POST', '/api/prova/finalizar', token, scenario.connections, Math.min(scenario.duration, 10));
  console.log('   Done:', results.finalizar.requests?.total || 'N/A', 'requests');

  // Save results
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = 'results/' + scenarioName + '_' + ts + '.json';
  fs.writeFileSync(path.join(__dirname, filename), JSON.stringify({
    scenario: scenario.name,
    target: BASE_URL,
    connections: scenario.connections,
    duration: scenario.duration,
    timestamp: new Date().toISOString(),
    results,
  }, null, 2));

  console.log('\n' + filename);
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));

  for (const [name, data] of Object.entries(results)) {
    console.log('\n' + name.toUpperCase());
    const latency = data.latency;
    const rps = data.requests?.average;
    const throughput = data.throughput?.average;
    const errors = data.errors;
    const non2xx = data.non2xx;
    const total = data.requests?.total;

    console.log('  Latency: avg=' + latency?.average + 'ms p50=' + latency?.p50 + 'ms p95=' + latency?.p97_5 + 'ms p99=' + latency?.p99 + 'ms');
    console.log('  Throughput: ' + rps + ' req/s | ' + Math.round(throughput / 1024 / 1024) + ' MB/s');
    console.log('  Total: ' + total + ' requests');
    console.log('  Errors: ' + errors + ' | Non-2xx: ' + non2xx);
  }
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });
