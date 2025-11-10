const fs = require("fs").promises;
const { detectAndMaskPII } = require("./utils/pii-detector");
const { deduplicateData } = require("./utils/deduplicator");
const { generateReport } = require("./utils/report-generator");
const { scrapeRedditSecurityPosts } = require("./scrapers/reddit-scraper");
const { scrapeHaveIBeenPwned } = require("./scrapers/hibp-scraper");

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
    await fs.mkdir("./output", { recursive: true });
    await fs.mkdir("./output/screenshots", { recursive: true });

    const redditData = await scrapeRedditSecurityPosts();

    results.sources.push({
      name: "Reddit - r/security",
      type: "Public Forum",
      url: "https://www.reddit.com/r/security/",
      recordsCollected: redditData.posts.length,
      screenshot: redditData.screenshot,
    });

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
    let allData = [...redditData.posts, ...hibpData.breaches];

    results.totalRecords = allData.length;
    console.log(`📊 Total records collected: ${allData.length}`);

    console.log("\n🔄 Running deduplication...");
    const { deduplicated, removedCount } = deduplicateData(allData);
    results.duplicatesRemoved = removedCount;
    console.log(`✓ Removed ${removedCount} duplicates`);
    console.log(`✓ Unique records: ${deduplicated.length}`);

    console.log("\n🔒 Detecting and masking PII...");
    const processedData = deduplicated.map((item) => {
      const { masked, piiFound } = detectAndMaskPII(item);
      if (piiFound) results.piiDetected++;
      return masked;
    });
    console.log(`✓ PII detected in ${results.piiDetected} records`);
    console.log(`✓ All PII has been masked for privacy`);

    await fs.writeFile(
      "./output/processed_data.json",
      JSON.stringify(processedData, null, 2)
    );
    console.log("\n💾 Saved processed data to: ./output/processed_data.json");

    console.log("\n📄 Generating HTML report...");
    const reportPath = await generateReport(results, processedData);
    console.log(`✓ Report generated: ${reportPath}`);

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

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
