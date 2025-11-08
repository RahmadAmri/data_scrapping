# System Architecture

## 📐 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA ACQUISITION SYSTEM                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  PHASE 1: DATA COLLECTION                                     │
└──────────────────────────────────────────────────────────────┘
                           │
                           ├─► Reddit Scraper ───► r/security
                           │                   ├─► r/netsec
                           │                   └─► r/privacy
                           │
                           └─► HIBP Scraper ─────► Public API
                                                   (Breach Metadata)
                           │
                           ▼
                    [ Raw Data Array ]
                           │
┌──────────────────────────────────────────────────────────────┐
│  PHASE 2: DATA PROCESSING                                     │
└──────────────────────────────────────────────────────────────┘
                           │
                           ├─► Deduplicator
                           │   ├─ Generate hashes
                           │   ├─ Compare entries
                           │   └─ Remove duplicates
                           │
                           ▼
                    [ Unique Records ]
                           │
                           ├─► PII Detector
                           │   ├─ Scan for emails
                           │   ├─ Scan for phones
                           │   ├─ Scan for SSNs
                           │   ├─ Scan for credit cards
                           │   └─ Mask all PII
                           │
                           ▼
                  [ Cleaned & Masked Data ]
                           │
┌──────────────────────────────────────────────────────────────┐
│  PHASE 3: OUTPUT GENERATION                                   │
└──────────────────────────────────────────────────────────────┘
                           │
                           ├─► Save JSON
                           │   └─► processed_data.json
                           │
                           ├─► Generate Report
                           │   ├─ Statistics
                           │   ├─ Source info
                           │   ├─ Screenshots
                           │   └─ Data samples
                           │
                           ▼
                    [ HTML Report ]
                           │
                           ▼
                    ✅ Complete!
```

## 🏗️ Module Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          index.js                            │
│                   (Main Orchestrator)                        │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   SCRAPERS   │  │    UTILS     │  │    OUTPUT    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        │                  │                  │
    ┌───┴───┐         ┌────┴────┐       ┌────┴────┐
    │       │         │         │       │         │
    ▼       ▼         ▼         ▼       ▼         ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Reddit│ │ HIBP │ │  PII │ │Dedup │ │Report│ │JSON  │
│      │ │      │ │Detect│ │      │ │ HTML │ │File  │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

## 🔄 Processing Pipeline

```
Input Sources
     │
     ├─► API Request ──► Rate Limiting ──► Response
     │
     ▼
Raw Data Buffer
     │
     ├─► Hash Generation ──► Deduplication
     │
     ▼
Unique Records
     │
     ├─► Regex Matching ──► PII Detection ──► Masking
     │
     ▼
Clean Data
     │
     ├─► Template Engine ──► HTML Generation
     │
     ▼
Final Output
```

## 📦 Data Structure

### Record Object

```javascript
{
  id: "unique_identifier",
  source: "Reddit|HaveIBeenPwned",
  title: "Post or breach title",
  content: "Main content (PII masked)",
  timestamp: "ISO 8601 date",
  url: "Source URL",
  metadata: {
    score: 123,
    comments: 45,
    author: "username"
  },
  type: "forum_post|breach_metadata",
  tags: ["security", "public_forum"]
}
```

### Report Summary

```javascript
{
  sources: [
    {
      name: "Source name",
      type: "Source type",
      url: "Source URL",
      recordsCollected: 123,
      screenshot: "path/to/screenshot"
    }
  ],
  totalRecords: 123,
  piiDetected: 45,
  duplicatesRemoved: 12,
  timestamp: "ISO 8601 date"
}
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         Data Input Layer                │
│  • API Authentication (when needed)     │
│  • HTTPS Only                           │
│  • Rate Limiting                        │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       Processing Layer                  │
│  • Input Validation                     │
│  • PII Detection                        │
│  • Data Sanitization                    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Storage Layer                   │
│  • Masked Data Only                     │
│  • Local File System                    │
│  • No Cloud Upload                      │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Output Layer                    │
│  • HTML Report (No PII)                 │
│  • JSON Export (Cleaned)                │
│  • Audit Trail                          │
└─────────────────────────────────────────┘
```

## 🎯 Feature Matrix

| Feature             | Status | Description                              |
| ------------------- | ------ | ---------------------------------------- |
| Reddit Scraping     | ✅     | Public API access to security subreddits |
| HIBP Integration    | ✅     | Breach metadata collection               |
| PII Detection       | ✅     | Regex-based pattern matching             |
| Email Masking       | ✅     | Partial masking (jo\*\*\*@example.com)   |
| Phone Masking       | ✅     | Last 4 digits visible                    |
| SSN Masking         | ✅     | Full masking                             |
| Credit Card Masking | ✅     | Last 4 digits visible                    |
| IP Masking          | ✅     | Partial masking                          |
| Deduplication       | ✅     | Hash-based comparison                    |
| HTML Reports        | ✅     | Responsive, detailed reports             |
| JSON Export         | ✅     | Structured data export                   |
| Rate Limiting       | ✅     | Respectful API usage                     |
| Error Handling      | ✅     | Graceful fallbacks                       |
| Async Processing    | ✅     | Non-blocking operations                  |

## 🚀 Performance Characteristics

- **Concurrent Requests**: Up to 3 sources in parallel
- **Rate Limiting**: 1 second between requests
- **Memory Usage**: Low (streaming where possible)
- **Processing Speed**: ~100 records/second for PII detection
- **Output Size**: Compressed JSON + HTML report

## 🔧 Configuration Points

1. **Data Sources**: Add/remove in index.js
2. **PII Patterns**: Customize in pii-detector.js
3. **Deduplication Logic**: Modify in deduplicator.js
4. **Report Template**: Edit in report-generator.js
5. **Rate Limits**: Configure in .env file

---

This architecture ensures:

- ✅ Modularity (easy to extend)
- ✅ Maintainability (clear separation of concerns)
- ✅ Testability (isolated components)
- ✅ Security (multiple protection layers)
- ✅ Performance (async operations)
- ✅ Legal compliance (transparent processing)
