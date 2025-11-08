# Legal Data Acquisition System 🔍

A demonstration of **ethical and legal** data scraping, processing, and analysis from public sources. This system showcases advanced data collection techniques while maintaining strict adherence to legal and ethical standards.

## 🎯 Features

- ✅ **Legal Public Source Scraping**: Collects data only from legal, publicly accessible sources
- ✅ **Multi-Source Collection**: Aggregates data from multiple platforms (Reddit, HaveIBeenPwned)
- ✅ **PII Detection & Masking**: Automatically detects and masks personally identifiable information
- ✅ **Data Deduplication**: Removes duplicate entries using hash-based comparison
- ✅ **Comprehensive Reports**: Generates detailed HTML reports with statistics and evidence
- ✅ **Asynchronous Processing**: Efficient async/await pattern for concurrent operations
- ✅ **Error Handling**: Robust error handling with fallback mechanisms

## 📋 Data Sources

### Source 1: Reddit Security Communities
- **Platform**: Reddit Public API
- **Subreddits**: r/security, r/netsec, r/privacy
- **Data Type**: Public forum posts and discussions
- **Legal Status**: ✅ Public API, no authentication required for public posts
- **Use Case**: Security discussions, vulnerability disclosures, best practices

### Source 2: HaveIBeenPwned
- **Platform**: HaveIBeenPwned Public API
- **Data Type**: Public breach metadata (NOT actual leaked data)
- **Legal Status**: ✅ Public API for breach information
- **Use Case**: Understanding breach landscape, affected services, data types

## 🛠️ Tech Stack

- **Node.js**: Runtime environment
- **Axios**: HTTP client for API requests
- **Cheerio**: HTML parsing (when needed)
- **Puppeteer**: Browser automation for screenshots (optional)
- **Crypto**: Hash generation for deduplication

## 📦 Installation

```bash
# Install dependencies
npm install

# Run the application
npm start
```

## 🚀 Usage

```bash
node index.js
```

The system will:
1. 📡 Collect data from configured public sources
2. 🔄 Remove duplicate entries
3. 🔒 Detect and mask any PII
4. 📊 Generate statistics and analysis
5. 📄 Create an HTML report in `./output/`

## 📁 Project Structure

```
data_scrapping/
├── index.js                      # Main application entry point
├── package.json                  # Project dependencies
├── scrapers/
│   ├── reddit-scraper.js         # Reddit public API scraper
│   └── hibp-scraper.js           # HaveIBeenPwned API scraper
├── utils/
│   ├── pii-detector.js           # PII detection and masking
│   ├── deduplicator.js           # Duplicate removal logic
│   └── report-generator.js       # HTML report generation
└── output/
    ├── processed_data.json       # Cleaned and processed data
    ├── report_[timestamp].html   # Generated report
    └── screenshots/              # Source screenshots
```

## 🔒 Privacy & Security

### PII Detection
The system automatically detects and masks:
- 📧 Email addresses (e.g., `jo***@example.com`)
- 📞 Phone numbers (e.g., `***-***-1234`)
- 🆔 SSN patterns (e.g., `***-**-****`)
- 💳 Credit cards (e.g., `****-****-****-1234`)
- 🌐 IP addresses (e.g., `192.168.***.***`)

### Ethical Guidelines
- ✅ Only scrapes publicly accessible data
- ✅ Respects robots.txt and terms of service
- ✅ Implements rate limiting to avoid server overload
- ✅ Masks all PII before storage or reporting
- ✅ No authentication bypass or unauthorized access
- ✅ No collection of non-public data

## 📊 Sample Output

```
=== Legal Data Acquisition System ===

📡 Source 1: Scraping Reddit r/security posts...
✓ Collected 30 posts from Reddit

📡 Source 2: Collecting breach info from HaveIBeenPwned...
✓ Collected 15 breach records

📊 Total records collected: 45

🔄 Running deduplication...
✓ Removed 3 duplicates
✓ Unique records: 42

🔒 Detecting and masking PII...
✓ PII detected in 8 records
✓ All PII has been masked for privacy

📄 Generating HTML report...
✓ Report generated: ./output/report_[timestamp].html

==================================================
SUMMARY
==================================================
Total Sources: 2
Total Records Collected: 45
Duplicates Removed: 3
PII Detected & Masked: 8
Final Clean Records: 42
==================================================
```

## ⚖️ Legal Compliance

This project demonstrates **legal and ethical** data acquisition:

### What This System Does:
✅ Accesses only public APIs and publicly available data  
✅ Respects terms of service and rate limits  
✅ Collects metadata and publicly shared information  
✅ Implements PII protection measures  
✅ Provides transparency through detailed reporting  

### What This System Does NOT Do:
❌ Access unauthorized or restricted areas  
❌ Bypass authentication or security measures  
❌ Download or distribute stolen data  
❌ Access darknet or illegal marketplaces  
❌ Violate CFAA, GDPR, or other data protection laws  

## 🎓 Educational Purpose

This project is designed to demonstrate:
- Web scraping best practices
- Asynchronous data processing
- PII detection algorithms
- Data deduplication techniques
- Report generation and documentation
- Ethical considerations in data acquisition

## 🤝 Use Cases

Perfect for:
- **Security Research**: Analyzing public security discussions
- **Threat Intelligence**: Understanding breach landscape
- **Educational Projects**: Learning data acquisition techniques
- **Portfolio Demonstrations**: Showcasing technical skills ethically
- **OSINT Training**: Open Source Intelligence gathering

## 📝 License

MIT License - Feel free to use for educational and legal purposes only.

## ⚠️ Disclaimer

This tool is for **educational and legal purposes only**. Users are responsible for ensuring compliance with all applicable laws and terms of service. Never use this system to access, collect, or distribute unauthorized or illegally obtained data.

## 🔗 Resources

- [Reddit API Documentation](https://www.reddit.com/dev/api)
- [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3)
- [OWASP Data Protection](https://owasp.org/www-project-top-ten/)
- [Ethical Web Scraping Guidelines](https://www.eff.org/issues/coders/reverse-engineering-faq)

---

**Built with ❤️ for ethical data science and security research**