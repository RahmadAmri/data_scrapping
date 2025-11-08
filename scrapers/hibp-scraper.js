/**
 * HaveIBeenPwned Public Breach Information Scraper
 * Scrapes public breach metadata (NOT actual leaked data)
 * Uses HIBP's public API for breach information
 */

const axios = require("axios");
const fs = require("fs").promises;

async function scrapeHaveIBeenPwned() {
  console.log("  → Accessing HaveIBeenPwned public API...");

  const results = {
    breaches: [],
    screenshot: "screenshots/haveibeenpwned.png",
  };

  try {
    // HIBP provides public breach information without authentication
    // This only returns metadata about breaches, not actual leaked data
    const url = "https://haveibeenpwned.com/api/v3/breaches";

    console.log("  → Fetching public breach information...");

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Legal-Data-Acquisition-Demo",
        Accept: "application/json",
      },
    });

    if (response.data && Array.isArray(response.data)) {
      // Take latest 15 breaches for demonstration
      const recentBreaches = response.data.slice(0, 15);

      results.breaches = recentBreaches.map((breach) => ({
        id: breach.Name,
        source: "HaveIBeenPwned",
        name: breach.Name,
        title: breach.Title,
        domain: breach.Domain,
        breach_date: breach.BreachDate,
        added_date: breach.AddedDate,
        modified_date: breach.ModifiedDate,
        pwn_count: breach.PwnCount,
        description: breach.Description,
        data_classes: breach.DataClasses || [],
        is_verified: breach.IsVerified,
        is_sensitive: breach.IsSensitive,
        is_retired: breach.IsRetired,
        logo_path: breach.LogoPath,
        type: "breach_metadata",
        tags: ["breach_info", "public_database", "metadata_only"],
      }));

      console.log(
        `  ✓ Collected information about ${results.breaches.length} breaches`
      );
    }

    // Save screenshot metadata
    await saveScreenshotMetadata("haveibeenpwned.png", {
      url: "https://haveibeenpwned.com",
      timestamp: new Date().toISOString(),
      description: "HaveIBeenPwned - Public breach information database",
    });
  } catch (error) {
    console.error(`  ✗ Error accessing HIBP API: ${error.message}`);
    console.log("  → Using sample breach data for demonstration...");
    results.breaches = getSampleHIBPData();
  }

  return results;
}

async function saveScreenshotMetadata(filename, metadata) {
  try {
    await fs.mkdir("./output/screenshots", { recursive: true });
    await fs.writeFile(
      `./output/screenshots/${filename}.meta.json`,
      JSON.stringify(metadata, null, 2)
    );
  } catch (error) {
    console.error(`  ✗ Error saving screenshot metadata: ${error.message}`);
  }
}

function getSampleHIBPData() {
  return [
    {
      id: "Adobe",
      source: "HaveIBeenPwned",
      name: "Adobe",
      title: "Adobe",
      domain: "adobe.com",
      breach_date: "2013-10-04",
      added_date: "2013-12-04",
      modified_date: "2013-12-04",
      pwn_count: 152445165,
      description:
        "In October 2013, 153 million Adobe accounts were breached with each containing an internal ID, username, email, encrypted password and a password hint in plain text.",
      data_classes: [
        "Email addresses",
        "Password hints",
        "Passwords",
        "Usernames",
      ],
      is_verified: true,
      is_sensitive: false,
      is_retired: false,
      logo_path:
        "https://haveibeenpwned.com/Content/Images/PwnedLogos/Adobe.png",
      type: "breach_metadata",
      tags: ["breach_info", "public_database", "metadata_only"],
    },
    {
      id: "LinkedIn",
      source: "HaveIBeenPwned",
      name: "LinkedIn",
      title: "LinkedIn",
      domain: "linkedin.com",
      breach_date: "2012-05-05",
      added_date: "2016-05-21",
      modified_date: "2016-05-21",
      pwn_count: 164611595,
      description:
        "In May 2012, LinkedIn was breached and over 100 million user accounts were compromised.",
      data_classes: ["Email addresses", "Passwords"],
      is_verified: true,
      is_sensitive: false,
      is_retired: false,
      logo_path:
        "https://haveibeenpwned.com/Content/Images/PwnedLogos/LinkedIn.png",
      type: "breach_metadata",
      tags: ["breach_info", "public_database", "metadata_only"],
    },
    {
      id: "Dropbox",
      source: "HaveIBeenPwned",
      name: "Dropbox",
      title: "Dropbox",
      domain: "dropbox.com",
      breach_date: "2012-07-01",
      added_date: "2016-08-31",
      modified_date: "2016-08-31",
      pwn_count: 68648009,
      description:
        "In mid-2012, Dropbox suffered a data breach which exposed the stored credentials of tens of millions of their customers.",
      data_classes: ["Email addresses", "Passwords"],
      is_verified: true,
      is_sensitive: false,
      is_retired: false,
      logo_path:
        "https://haveibeenpwned.com/Content/Images/PwnedLogos/Dropbox.png",
      type: "breach_metadata",
      tags: ["breach_info", "public_database", "metadata_only"],
    },
  ];
}

module.exports = {
  scrapeHaveIBeenPwned,
};
