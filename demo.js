/**
 * Test Script - Demonstrates all system capabilities
 * Run this to test the system without making actual API calls
 */

const fs = require("fs").promises;
const { detectAndMaskPII } = require("./utils/pii-detector");
const { deduplicateData } = require("./utils/deduplicator");
const { generateReport } = require("./utils/report-generator");

async function runDemo() {
  console.log("=== DEMO MODE - Testing System Capabilities ===\n");

  // Sample data with PII for testing
  const sampleData = [
    {
      id: 1,
      title: "Security vulnerability in authentication",
      content: "Contact me at john.doe@example.com or call 555-123-4567",
      source: "Reddit",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Data breach at TechCorp",
      content:
        "Leaked data includes emails like admin@techcorp.com and SSN 123-45-6789",
      source: "HaveIBeenPwned",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Security vulnerability in authentication", // Duplicate
      content: "Contact me at john.doe@example.com or call 555-123-4567",
      source: "Reddit",
      timestamp: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Cloud security best practices",
      content: "Credit card 4532-1234-5678-9010 was exposed. IP: 192.168.1.100",
      source: "Forum",
      timestamp: new Date().toISOString(),
    },
    {
      id: 5,
      title: "New encryption standard released",
      content: "This is clean data without any PII",
      source: "Reddit",
      timestamp: new Date().toISOString(),
    },
  ];

  console.log("📊 Sample Data Created: 5 records");
  console.log("   - 1 duplicate entry");
  console.log("   - Multiple PII instances\n");

  // Test 1: Deduplication
  console.log("🔄 Testing Deduplication...");
  const { deduplicated, removedCount } = deduplicateData(sampleData);
  console.log(`✓ Removed ${removedCount} duplicates`);
  console.log(`✓ Unique records: ${deduplicated.length}\n`);

  // Test 2: PII Detection
  console.log("🔒 Testing PII Detection...");
  let piiCount = 0;
  const processedData = deduplicated.map((item) => {
    const { masked, piiFound, piiTypes } = detectAndMaskPII(item);
    if (piiFound) {
      piiCount++;
      console.log(`  ✓ PII found in record ${item.id}:`, piiTypes);
    }
    return masked;
  });
  console.log(`\n✓ Total records with PII: ${piiCount}\n`);

  // Show before/after example
  console.log("📝 PII Masking Example:");
  console.log("  Before:", sampleData[0].content);
  console.log("  After: ", processedData[0].content);
  console.log("");

  // Test 3: Report Generation
  console.log("📄 Testing Report Generation...");

  await fs.mkdir("./output", { recursive: true });
  await fs.mkdir("./output/screenshots", { recursive: true });

  const summary = {
    sources: [
      {
        name: "Reddit - r/security",
        type: "Public Forum",
        url: "https://www.reddit.com/r/security/",
        recordsCollected: 3,
        screenshot: "screenshots/demo_reddit.png",
      },
      {
        name: "HaveIBeenPwned",
        type: "Public Breach Database",
        url: "https://haveibeenpwned.com/",
        recordsCollected: 2,
        screenshot: "screenshots/demo_hibp.png",
      },
    ],
    totalRecords: 5,
    piiDetected: piiCount,
    duplicatesRemoved: removedCount,
    timestamp: new Date().toISOString(),
  };

  const reportPath = await generateReport(summary, processedData);
  console.log(`✓ Report generated: ${reportPath}\n`);

  // Save processed data
  await fs.writeFile(
    "./output/demo_processed_data.json",
    JSON.stringify(processedData, null, 2)
  );
  console.log("✓ Processed data saved: ./output/demo_processed_data.json\n");

  // Summary
  console.log("=".repeat(50));
  console.log("DEMO SUMMARY");
  console.log("=".repeat(50));
  console.log(`Total Records: ${sampleData.length}`);
  console.log(`After Deduplication: ${deduplicated.length}`);
  console.log(`PII Detected: ${piiCount} records`);
  console.log(`Report Generated: Yes`);
  console.log("=".repeat(50));
  console.log("\n✅ Demo completed successfully!");
  console.log(`\n📁 View results:`);
  console.log(`   - Report: ${reportPath}`);
  console.log(`   - Data: ./output/demo_processed_data.json`);
  console.log("\n💡 To run with real data, use: npm start\n");
}

// Run demo
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };
