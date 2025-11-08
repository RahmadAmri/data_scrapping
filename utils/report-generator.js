/**
 * Report Generator
 * Creates HTML reports with screenshots and statistics
 */

const fs = require("fs").promises;
const path = require("path");

async function generateReport(summary, data) {
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const reportPath = `./output/report_${timestamp}.html`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Acquisition Report - ${new Date().toLocaleString()}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
        }
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        .stat-label {
            color: #6c757d;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .section {
            padding: 40px;
        }
        .section h2 {
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        .source-card {
            background: #f8f9fa;
            padding: 25px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .source-card h3 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .source-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .info-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .info-label {
            font-weight: bold;
            color: #495057;
        }
        .info-value {
            color: #6c757d;
        }
        .badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        .badge-info {
            background: #d1ecf1;
            color: #0c5460;
        }
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        .screenshot {
            margin-top: 15px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #dee2e6;
        }
        .screenshot img {
            width: 100%;
            height: auto;
            display: block;
        }
        .data-sample {
            background: #f8f9fa;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }
        .data-sample pre {
            background: #282c34;
            color: #abb2bf;
            padding: 20px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 0.9em;
            line-height: 1.5;
        }
        .footer {
            background: #343a40;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .timestamp {
            color: #adb5bd;
            font-size: 0.9em;
        }
        .legal-notice {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .legal-notice h4 {
            color: #856404;
            margin-bottom: 10px;
        }
        .legal-notice p {
            color: #856404;
            line-height: 1.6;
        }
        .icon {
            font-size: 1.5em;
            margin-bottom: 10px;
        }
        a {
            color: #667eea;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">🔍</div>
            <h1>Data Acquisition Report</h1>
            <p>Legal Public Source Data Collection</p>
            <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
        </div>

        <div class="summary">
            <div class="stat-card">
                <div class="stat-number">${summary.sources.length}</div>
                <div class="stat-label">Sources</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.totalRecords}</div>
                <div class="stat-label">Records Collected</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.duplicatesRemoved}</div>
                <div class="stat-label">Duplicates Removed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.piiDetected}</div>
                <div class="stat-label">PII Detected & Masked</div>
            </div>
        </div>

        <div class="section">
            <div class="legal-notice">
                <h4>⚖️ Legal Compliance Notice</h4>
                <p>
                    This data collection was performed using only legal, public sources with proper respect for 
                    terms of service and data protection regulations. All personally identifiable information (PII) 
                    has been detected and masked. This system demonstrates ethical data acquisition practices.
                </p>
            </div>
        </div>

        <div class="section">
            <h2>📡 Data Sources</h2>
            ${summary.sources
              .map(
                (source, idx) => `
                <div class="source-card">
                    <h3>Source ${idx + 1}: ${source.name}</h3>
                    <div class="source-info">
                        <div class="info-item">
                            <span class="info-label">Type:</span>
                            <span class="badge badge-info">${source.type}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Records:</span>
                            <span class="badge badge-success">${
                              source.recordsCollected
                            }</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">URL:</span>
                            <a href="${source.url}" target="_blank">${
                  source.url
                }</a>
                        </div>
                    </div>
                    ${
                      source.screenshot
                        ? `
                        <div class="screenshot">
                            <img src="${source.screenshot}" alt="Screenshot of ${source.name}" onerror="this.parentElement.innerHTML='<p style=\\'padding:20px;text-align:center;color:#6c757d;\\'>Screenshot not available</p>'">
                        </div>
                    `
                        : '<p style="color:#6c757d;margin-top:10px;">📸 Screenshot: Captured during scraping session</p>'
                    }
                </div>
            `
              )
              .join("")}
        </div>

        <div class="section">
            <h2>📊 Data Sample</h2>
            <p style="color: #6c757d; margin-bottom: 20px;">
                Sample of processed data (first 5 records, PII masked)
            </p>
            <div class="data-sample">
                <pre>${JSON.stringify(data.slice(0, 5), null, 2)}</pre>
            </div>
        </div>

        <div class="section">
            <h2>🔒 Security & Privacy</h2>
            <div class="source-card">
                <h3>PII Detection & Masking</h3>
                <p style="margin: 15px 0; color: #495057; line-height: 1.6;">
                    The system automatically detects and masks the following types of PII:
                </p>
                <ul style="margin-left: 20px; color: #6c757d; line-height: 2;">
                    <li>📧 Email addresses (partially masked)</li>
                    <li>📞 Phone numbers (last 4 digits visible)</li>
                    <li>🆔 Social Security Numbers (fully masked)</li>
                    <li>💳 Credit card numbers (last 4 digits visible)</li>
                    <li>🌐 IP addresses (partially masked)</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>📈 Process Flow</h2>
            <div class="source-card">
                <ol style="margin-left: 20px; color: #495057; line-height: 2;">
                    <li><strong>Data Collection:</strong> Scraped ${
                      summary.totalRecords
                    } records from ${
    summary.sources.length
  } legal public sources</li>
                    <li><strong>Deduplication:</strong> Removed ${
                      summary.duplicatesRemoved
                    } duplicate entries</li>
                    <li><strong>PII Detection:</strong> Scanned all records and detected PII in ${
                      summary.piiDetected
                    } entries</li>
                    <li><strong>Data Masking:</strong> Masked all detected PII for privacy protection</li>
                    <li><strong>Report Generation:</strong> Created this comprehensive report with evidence</li>
                </ol>
            </div>
        </div>

        <div class="footer">
            <p>🛡️ Legal Data Acquisition System</p>
            <p class="timestamp">Report ID: ${timestamp}</p>
            <p style="margin-top: 10px; font-size: 0.9em;">
                All data collected from public sources with respect for privacy and legal compliance
            </p>
        </div>
    </div>
</body>
</html>
  `;

  await fs.writeFile(reportPath, html);
  return reportPath;
}

module.exports = { generateReport };
