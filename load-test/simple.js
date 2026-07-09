/**
 * OLICMAT Load Test - Simple Endpoint Tester
 * Tests each exam endpoint individually with autocannon.
 *
 * Usage:
 *   node load-test/simple.js [endpoint] [connections] [duration]
 *   Endpoints: login, questoes, responder, finalizar, resumo, all
 *   Default: all 50 30
 */
import autocannon from 'autocannon';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.TARGET_URL || 'http://localhost:3333';
const RESULTS_DIR = path.join(__dirname, 'results');
fs.mkdirSync(RESULTS_DIR, { recursive: true });

const TEST_PASSWORD = 'loadtest123';

// ============================================================================
// Login to get a token
// ============================================================================
async function getToken() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `loadtest${i}@olicmat.com`, senha: TEST_PASSWORD }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.accessToken;
      }
    } catch {}
  }
  return null;
}

// ============================================================================
// Run test on a single endpoint
// ============================================================================
async function testEndpoint(name, config, connections, duration) {
  console.log(`\n  Testing: ${name}`);
  console.log(`  Connections: ${connections} | Duration: ${duration}s`);

  const result = await autocannon({
    url: BASE_URL,
    connections,
    duration,
    pipelining: 1,
    ...config,
  });

  return {
    endpoint: name,
    latency: {
      average: Math.round(result.latency.average),
      p50: Math.round(result.latency.p50),
      p95: Math.round(result.latency.p95),
      p99: Math.round(result.latency.p99),
      max: Math.round(result.latency.max),
    },
    rps: Math.round(result.requests.average),
    totalRequests: result.requests.total,
    throughput: Math.round(result.throughput.average),
    errors: result.errors,
    timeouts: result.timeouts,
    non2xx: result.non2xx,
    resets: result.resets,
  };
}

// ============================================================================
// Main
// ============================================================================
async function main() {
  const args = process.argv.slice(2);
  const endpoint = args[0] || 'all';
  const connections = parseInt(args[1]) || 50;
  const duration = parseInt(args[2]) || 30;

  console.log('🏛️  OLICMAT Exam Module Load Test');
  console.log(`   Target: ${BASE_URL}`);
  console.log(`   Date: ${new Date().toISOString()}`);

  // Get a valid token for authenticated endpoints
  const token = await getToken();
  if (!token) {
    console.error('❌ Could not get auth token. Run seed.js first.');
    process.exit(1);
  }
  console.log(`✅ Auth token obtained`);

  const endpoints = {
    login: {
      method: 'POST',
      path: '/api/auth/login',
      body: JSON.stringify({ email: 'loadtest0@olicmat.com', senha: TEST_PASSWORD }),
      headers: { 'Content-Type': 'application/json' },
    },
    questoes: {
      method: 'GET',
      path: '/api/prova/questoes',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    responder: {
      method: 'POST',
      path: '/api/prova/responder',
      body: JSON.stringify({ questaoId: 'test-id', alternativa: 'A' }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    finalizar: {
      method: 'POST',
      path: '/api/prova/finalizar',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    resumo: {
      method: 'GET',
      path: '/api/prova/resumo',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };

  const results = [];
  const toTest = endpoint === 'all' ? Object.keys(endpoints) : [endpoint];

  for (const name of toTest) {
    const result = await testEndpoint(name, endpoints[name], connections, duration);
    results.push(result);
    console.log(`    p95: ${result.latency.p95}ms | p99: ${result.latency.p99}ms | rps: ${result.rps} | errors: ${result.errors} | non2xx: ${result.non2xx}`);
  }

  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `results/test_${timestamp}.json`;
  fs.writeFileSync(path.join(__dirname, filename), JSON.stringify({
    target: BASE_URL,
    connections,
    duration,
    timestamp: new Date().toISOString(),
    results,
  }, null, 2));

  console.log(`\n📄 Results saved to ${filename}`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
