#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║          LEGAL DATA ACQUISITION SYSTEM - FILE TREE            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

tree -I 'node_modules' -L 3 --charset ascii || \
ls -R | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\/]*\//--/g' -e 's/^/   /' -e 's/-/|/' || \
find . -not -path '*/node_modules/*' -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                      PROJECT STRUCTURE                        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Project Root"
echo "├── 📄 index.js                  # Main application entry"
echo "├── 📄 demo.js                   # Demo with sample data"
echo "├── 📄 package.json              # Dependencies & scripts"
echo "├── 📄 run.sh                    # Setup & run script"
echo "│"
echo "├── 📂 scrapers/                 # Data collection modules"
echo "│   ├── reddit-scraper.js        # Reddit API scraper"
echo "│   └── hibp-scraper.js          # HaveIBeenPwned scraper"
echo "│"
echo "├── 📂 utils/                    # Processing utilities"
echo "│   ├── pii-detector.js          # PII detection & masking"
echo "│   ├── deduplicator.js          # Duplicate removal"
echo "│   └── report-generator.js      # HTML report creation"
echo "│"
echo "├── 📂 output/                   # Generated files (created on run)"
echo "│   ├── processed_data.json      # Clean data output"
echo "│   ├── report_*.html            # HTML reports"
echo "│   └── screenshots/             # Source evidence"
echo "│"
echo "└── 📚 Documentation"
echo "    ├── README.md                # Full documentation"
echo "    ├── QUICKSTART.md            # Quick start guide"
echo "    ├── ARCHITECTURE.md          # System architecture"
echo "    ├── COMPLETION_SUMMARY.md    # Task completion proof"
echo "    └── .env.example             # Configuration template"
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                       QUICK COMMANDS                          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "  npm install          # Install dependencies"
echo "  npm run demo         # Run demo with sample data"
echo "  npm start            # Run full system with real APIs"
echo "  ./run.sh             # Automated setup and run"
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                     FILE STATISTICS                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Count files by type
if command -v find &> /dev/null; then
    JS_FILES=$(find . -name "*.js" -not -path "*/node_modules/*" | wc -l)
    MD_FILES=$(find . -name "*.md" | wc -l)
    JSON_FILES=$(find . -name "*.json" -not -path "*/node_modules/*" | wc -l)
    
    echo "  JavaScript Files:    $JS_FILES"
    echo "  Documentation Files: $MD_FILES"
    echo "  Config Files:        $JSON_FILES"
    
    # Count lines of code
    if command -v wc &> /dev/null; then
        TOTAL_LINES=$(find . -name "*.js" -not -path "*/node_modules/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
        echo "  Total Lines of Code: $TOTAL_LINES"
    fi
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    READY TO USE! 🚀                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
