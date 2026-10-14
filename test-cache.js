/**
 * Redis Cache Performance Tester
 * Run: node test-cache.js
 * Tests getAllCourses endpoint — shows cache MISS vs HIT timing
 */

const http = require("http");

const BASE_URL = "http://localhost:4000";
const ENDPOINT = "/api/v1/course/";
const REQUESTS = 5; // how many requests to fire

// ─── Color helpers ───────────────────────────────────────────
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const cyan   = (s) => `\x1b[36m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;

// ─── Single timed HTTP GET ────────────────────────────────────
function timedRequest(url) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const ms = Date.now() - start;
        try {
          const json = JSON.parse(data);
          resolve({ ms, fromCache: json.fromCache, success: json.success, count: json.data?.length ?? 0 });
        } catch {
          resolve({ ms, fromCache: null, success: false, count: 0 });
        }
      });
    }).on("error", reject);
  });
}

// ─── Main runner ─────────────────────────────────────────────
async function run() {
  console.log(bold("\n╔══════════════════════════════════════════════╗"));
  console.log(bold("║       Redis Cache Performance Tester         ║"));
  console.log(bold("╚══════════════════════════════════════════════╝"));
  console.log(`\nEndpoint: ${cyan(BASE_URL + ENDPOINT)}`);
  console.log(`Firing ${REQUESTS} sequential requests...\n`);
  console.log("─".repeat(55));

  const results = [];

  for (let i = 1; i <= REQUESTS; i++) {
    try {
      const result = await timedRequest(BASE_URL + ENDPOINT);
      results.push(result);

      const cacheTag = result.fromCache
        ? green("⚡ CACHE HIT ")
        : yellow("🗄  CACHE MISS");

      const timeColor = result.ms < 100 ? green : result.ms < 500 ? yellow : red;

      console.log(
        `  Request #${i}  ${cacheTag}  ${timeColor(result.ms + "ms").padEnd(18)}  ` +
        `Courses: ${result.count}`
      );

      // Small delay between requests
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.log(red(`  Request #${i}  ❌ FAILED — is the server running on port 4000?`));
    }
  }

  // ─── Summary ───────────────────────────────────────────────
  console.log("─".repeat(55));

  const misses = results.filter((r) => !r.fromCache);
  const hits   = results.filter((r) => r.fromCache);

  const avgMiss = misses.length
    ? Math.round(misses.reduce((s, r) => s + r.ms, 0) / misses.length)
    : 0;
  const avgHit = hits.length
    ? Math.round(hits.reduce((s, r) => s + r.ms, 0) / hits.length)
    : 0;

  console.log(bold("\n  📊 Summary"));
  console.log(`  Cache Misses  : ${yellow(misses.length)} requests  →  avg ${yellow(avgMiss + "ms")} (MongoDB query)`);
  console.log(`  Cache Hits    : ${green(hits.length)} requests  →  avg ${green(avgHit + "ms")} (Redis)`);

  if (avgMiss > 0 && avgHit > 0) {
    const speedup = (avgMiss / avgHit).toFixed(1);
    console.log(`\n  ${bold("🚀 Redis is")} ${green(speedup + "x faster")} ${bold("than MongoDB for this endpoint!")}`);
  }

  console.log("\n  💡 Tips:");
  console.log(`  • First request always goes to MongoDB (cold cache)`);
  console.log(`  • All subsequent requests served from Redis`);
  console.log(`  • Cache expires in 10 minutes (600s TTL)`);
  console.log(`  • Check your server console for ⚡ and 🗑️  logs\n`);
}

run();
