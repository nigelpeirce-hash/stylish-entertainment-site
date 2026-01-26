/**
 * Test: Venue Autocomplete Prefix Matching
 * 
 * Verifies that the venue search API returns only venues
 * starting with the typed prefix (not substring matches).
 * 
 * Run: npx tsx scripts/test-venue-search.ts
 * Requires: Dev server running on port 3001
 */

import assert from "node:assert";

const BASE_URL = process.env.TEST_URL || "http://localhost:3001";

interface SearchResponse {
  venues: string[];
}

async function searchVenues(query: string): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/api/venues/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }
  const data: SearchResponse = await response.json();
  return data.venues;
}

async function testPrefixMatching() {
  console.log("Testing venue autocomplete prefix matching...\n");

  const testCases = ["b", "ba", "the", "k"];
  let passed = 0;
  let failed = 0;

  for (const prefix of testCases) {
    try {
      const results = await searchVenues(prefix);
      
      // Extract venue name (before comma if postcode present)
      const names = results.map(v => v.split(",")[0].trim().toLowerCase());
      
      // Verify all results start with the prefix
      const allStartWithPrefix = names.every(name => name.startsWith(prefix.toLowerCase()));
      
      if (results.length === 0) {
        console.log(`  ⚪ "${prefix}" → No results (may be expected if no matching venues)`);
        passed++;
      } else if (allStartWithPrefix) {
        console.log(`  ✅ "${prefix}" → ${results.length} result(s), all start with "${prefix}"`);
        passed++;
      } else {
        const badMatches = names.filter(name => !name.startsWith(prefix.toLowerCase()));
        console.log(`  ❌ "${prefix}" → Found non-prefix matches: ${badMatches.join(", ")}`);
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ "${prefix}" → Error: ${error instanceof Error ? error.message : error}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Run test
testPrefixMatching().catch((error) => {
  console.error("Test failed:", error.message);
  process.exit(1);
});
