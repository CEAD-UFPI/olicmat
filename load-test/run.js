/**
 * OLICMAT Load Test - Autocannon Script
 * Tests the exam module under various load scenarios.
 *
 * Usage:
 *   node load-test/run.js [scenario]
 *   Scenarios: smoke, load, stress, all (default: all)
 */
import autocannon from 'autocannon';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.TARGET_URL || 'http://localhost:3333';
const RESULTS_DIR = path.join(__dirname, 'results');

// Ensure results directory exists
fs.mkdirSync(RESULTS_DIR, { recursive: true });

// ============================================================================
// Test User Pool
// ============================================================================
// Users created by seed.js: loadtest0@olicmat.com to loadtest99@olicmat.com
// Password: loadtest123
const NUM_TEST_USERS = 100;
const TEST_PASSWORD = 'loadtest123';

function getUser(index) {
  return {
    email: `loadtest${index}@olicmat.com`,
    senha: TEST_PASSWORD,
  };
}

// ============================================================================
// Authentication Helper
// ============================================================================
async function login(email, senha) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.accessToken;
}

// ============================================================================
// Pre-authenticate users and build token pool
// ============================================================================
async function buildTokenPool(count = 50) {
  console.log(`🔑 Authenticating ${count} test users...`);
  const tokens = [];
  for (let i = 0; i < count; i++) {
    const user = getUser(i);
    const token = await login(user.email, user.senha);
    if (token) {
      tokens.push(token);
    } else {
      console.warn(`⚠️  Failed to login user ${user.email}`);
    }
  }
  console.log(`✅ ${tokens.length} tokens ready`);
  return tokens;
}

// ============================================================================
// Scenario Definitions
// ============================================================================
const scenarios = {
  smoke: {
    name: 'Smoke Test',
    description: 'Verify endpoints are reachable with minimal load',
    connections: 5,
    pipelining: 1,
    duration: 10,
    tokenCount: 5,
  },
  load: {
    name: 'Expected Load',
    description: 'Simulate 50 concurrent users (realistic olympiad load)',
    connections: 50,
    pipelining: 1,
    duration: 60,
    tokenCount: 50,
  },
  stress: {
    name: 'Stress / Load Spike',
    description: 'Simulate 200 concurrent users (peak load / spike)',
    connections: 200,
    pipelining: 1,
    duration: 30,
    tokenCount: 50,
  },
};

// ============================================================================
// Endpoint Definitions
// ============================================================================
function createAuthEndpoint(tokens) {
  return {
    method: 'POST',
    path: '/api/auth/login',
    body: JSON.stringify({ email: 'loadtest0@olicmat.com', senha: TEST_PASSWORD }),
    headers: { 'Content-Type': 'application/json' },
  };
}

function createQuestoesEndpoint(tokens) {
  return {
    method: 'GET',
    path: '/api/prova/questoes',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer @TOKEN',
    },
  };
}

function createResponderEndpoint(tokens) {
  return {
    method: 'POST',
    path: '/api/prova/responder',
    body: JSON.stringify({
      questaoId: '__QUESTAO_ID__',
      alternativa: 'A',
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer @TOKEN',
    },
  };
}

function createFinalizarEndpoint(tokens) {
  return {
    method: 'POST',
    path: '/api/prova/finalizar',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer @TOKEN',
    },
  };
}

function createResumoEndpoint(tokens) {
  return {
    method: 'GET',
    path: '/api/prova/resumo',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer @TOKEN',
    },
  };
}

// ============================================================================
// Run a single scenario
// ============================================================================
async function runScenario(scenarioKey, tokens) {
  const scenario = scenarios[scenarioKey];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 ${scenario.name}: ${scenario.description}`);
  console.log(`   Connections: ${scenario.connections} | Duration: ${scenario.duration}s`);
  console.log(`${'='.repeat(60)}`);

  // Build setup for each endpoint
  const setup = {
    token: async () => tokens[Math.floor(Math.random() * tokens.length)],
  };

  // Test each endpoint sequentially
  const endpoints = [
    { name: 'POST /api/auth/login', config: createAuthEndpoint(tokens) },
    { name: 'GET /api/prova/questoes', config: createQuestoesEndpoint(tokens) },
    { name: 'POST /api/prova/responder', config: createResponderEndpoint(tokens) },
    { name: 'POST /api/prova/finalizar', config: createFinalizarEndpoint(tokens) },
    { name: 'GET /api/prova/resumo', config: createResumoEndpoint(tokens) },
  ];

  const results = {};

  for (const ep of endpoints) {
    console.log(`\n  Testing ${ep.name}...`);

    // Replace @TOKEN with actual token from pool
    const config = {
      ...ep.config,
      url: BASE_URL,
      connections: scenario.connections,
      pipelining: scenario.pipelining,
      duration: scenario.duration,
    };

    // For endpoints that need auth, rotate tokens
    if (config.headers?.Authorization?.includes('@TOKEN')) {
      config.headers.Authorization = `Bearer ${tokens[0]}`;
    }

    const result = await autocannon(config);
    results[ep.name] = {
      latency: {
        average: result.latency.average,
        p50: result.latency.p50,
        p95: result.latency.p95,
        p99: result.latency.p99,
        max: result.latency.max,
      },
      requests: {
        average: result.requests.average,
        min: result.requests.min,
        max: result.requests.max,
        total: result.requests.total,
      },
      throughput: {
        average: result.throughput.average,
        total: result.throughput.total,
      },
      errors: result.errors,
      timeouts: result.timeouts,
      non2xx: result.non2xx,
      resets: result.resets,
    };

    console.log(`    ✅ p95: ${result.latency.p95.toFixed(0)}ms | p99: ${result.latency.p99.toFixed(0)}ms | errors: ${result.errors} | non2xx: ${result.non2xx}`);
  }

  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `results/${scenarioKey}_${timestamp}.json`;
  fs.writeFileSync(path.join(__dirname, filename), JSON.stringify({
    scenario: scenario.name,
    description: scenario.description,
    connections: scenario.connections,
    duration: scenario.duration,
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    endpoints: results,
  }, null, 2));

  console.log(`\n📄 Results saved to ${filename}`);
  return results;
}

// ============================================================================
// Main
// ============================================================================
async function main() {
  const args = process.argv.slice(2);
  const scenarioFilter = args[0] || 'all';

  console.log('🏛️  OLICMAT Exam Module Load Test');
  console.log(`   Target: ${BASE_URL}`);
  console.log(`   Scenario: ${scenarioFilter}`);
  console.log(`   Date: ${new Date().toISOString()}`);

  // Build token pool
  const tokens = await buildTokenPool(scenarioFilter === 'smoke' ? 5 : 50);
  if (tokens.length === 0) {
    console.error('❌ No valid tokens. Run seed.js first.');
    process.exit(1);
  }

  // Run scenarios
  const scenarioKeys = scenarioFilter === 'all'
    ? Object.keys(scenarios)
    : [scenarioFilter];

  const allResults = {};
  for (const key of scenarioKeys) {
    if (scenarios[key]) {
      allResults[key] = await runScenario(key, tokens);
    }
  }

  // Save combined results
  const combinedFile = `results/combined_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  fs.writeFileSync(path.join(__dirname, combinedFile), JSON.stringify({
    scenarios: allResults,
    metadata: {
      baseUrl: BASE_URL,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
    },
  }, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Load test complete!');
  console.log(`📄 Combined results: ${combinedFile}`);
  console.log(`${'='.repeat(60)}`);
}

main().catch((err) => {
  console.error('❌ Load test failed:', err);
  process.exit(1);
});
