const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const path = require("path");
const { detectAndMaskPII } = require("./utils/pii-detector");
const { deduplicateData } = require("./utils/deduplicator");
const { generateReport } = require("./utils/report-generator");
const { scrapeRedditSecurityPosts } = require("./scrapers/reddit-scraper");
const { scrapeHaveIBeenPwned } = require("./scrapers/hibp-scraper");

/**
 * Legal Data Acquisition Manager
 * Demonstrates data collection from legal public sources
 * with PII detection, deduplication, and reporting
 */

async function main() {
  console.log("=== Legal Data Acquisition System ===\n");
  console.log("Starting data collection from legal public sources...\n");

  const results = {
    sources: [],
    totalRecords: 0,
    piiDetected: 0,
    duplicatesRemoved: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    // Create output directory
    await fs.mkdir("./output", { recursive: true });
    await fs.mkdir("./output/screenshots", { recursive: true });

    // Source 1: Reddit Security/DataBreaches subreddit
    console.log("📡 Source 1: Scraping Reddit r/security posts...");
    const redditData = await scrapeRedditSecurityPosts();
    console.log(`✓ Collected ${redditData.posts.length} posts from Reddit\n`);

    results.sources.push({
      name: "Reddit - r/security",
      type: "Public Forum",
      url: "https://www.reddit.com/r/security/",
      recordsCollected: redditData.posts.length,
      screenshot: redditData.screenshot,
    });

    // Source 2: HaveIBeenPwned - Public breach information
    console.log("📡 Source 2: Collecting breach info from HaveIBeenPwned...");
    const hibpData = await scrapeHaveIBeenPwned();
    console.log(`✓ Collected ${hibpData.breaches.length} breach records\n`);

    results.sources.push({
      name: "HaveIBeenPwned",
      type: "Public Breach Database",
      url: "https://haveibeenpwned.com/API/v3",
      recordsCollected: hibpData.breaches.length,
      screenshot: hibpData.screenshot,
    });

    // Combine all data
    let allData = [...redditData.posts, ...hibpData.breaches];

    results.totalRecords = allData.length;
    console.log(`📊 Total records collected: ${allData.length}`);

    // Step 3: Deduplication
    console.log("\n🔄 Running deduplication...");
    const { deduplicated, removedCount } = deduplicateData(allData);
    results.duplicatesRemoved = removedCount;
    console.log(`✓ Removed ${removedCount} duplicates`);
    console.log(`✓ Unique records: ${deduplicated.length}`);

    // Step 4: PII Detection and Masking
    console.log("\n🔒 Detecting and masking PII...");
    const processedData = deduplicated.map((item) => {
      const { masked, piiFound } = detectAndMaskPII(item);
      if (piiFound) results.piiDetected++;
      return masked;
    });
    console.log(`✓ PII detected in ${results.piiDetected} records`);
    console.log(`✓ All PII has been masked for privacy`);

    // Save processed data
    await fs.writeFile(
      "./output/processed_data.json",
      JSON.stringify(processedData, null, 2)
    );
    console.log("\n💾 Saved processed data to: ./output/processed_data.json");

    // Generate HTML Report
    console.log("\n📄 Generating HTML report...");
    const reportPath = await generateReport(results, processedData);
    console.log(`✓ Report generated: ${reportPath}`);

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total Sources: ${results.sources.length}`);
    console.log(`Total Records Collected: ${results.totalRecords}`);
    console.log(`Duplicates Removed: ${results.duplicatesRemoved}`);
    console.log(`PII Detected & Masked: ${results.piiDetected}`);
    console.log(`Final Clean Records: ${processedData.length}`);
    console.log("=".repeat(50));
    console.log("\n✅ Data acquisition completed successfully!");
    console.log(`\n📁 View report: ${reportPath}`);
  } catch (error) {
    console.error("❌ Error during data acquisition:", error.message);
    throw error;
  }
}

// Run the application
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
