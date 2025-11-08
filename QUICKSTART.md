# Legal Data Acquisition System - Quick Start Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application

```bash
npm start
# or
node index.js
```

### 3. View Results

- Open `./output/report_[timestamp].html` in your browser
- Check `./output/processed_data.json` for raw data

## 🎯 What Gets Collected

### Reddit (r/security, r/netsec, r/privacy)

- Public posts and discussions
- Titles, authors, scores, comments count
- Post URLs and timestamps
- Content snippets (truncated)

### HaveIBeenPwned

- Public breach metadata
- Breach names, dates, affected counts
- Data types compromised
- Verification status

**Note**: Only publicly available metadata is collected, NOT actual leaked data.

## 🔧 Configuration

Copy `.env.example` to `.env` to customize:

```bash
cp .env.example .env
```

Edit settings:

- Rate limiting delays
- PII masking options
- Output directory

## 📊 Understanding the Report

The HTML report includes:

1. **Summary Statistics**: Total records, duplicates, PII detected
2. **Source Information**: Details about each data source
3. **Screenshots**: Visual evidence of source access
4. **Data Sample**: First 5 processed records (PII masked)
5. **Security Info**: PII types detected and masked
6. **Process Flow**: Step-by-step execution summary

## 🛡️ Legal & Ethical Notes

### ✅ This System Is Legal Because:

- Uses only public APIs
- Respects terms of service
- No authentication bypass
- Implements rate limiting
- Masks all PII
- Transparent reporting

### ⚖️ Compliance

- **CFAA Compliant**: No unauthorized access
- **GDPR Friendly**: PII detection and masking
- **Ethical**: Transparent and respectful

## 🐛 Troubleshooting

### API Rate Limits

If you hit rate limits:

- Increase `RATE_LIMIT_DELAY` in .env
- Run at different times
- Sample data will be used as fallback

### Network Issues

- Check internet connection
- Verify API endpoints are accessible
- System will use sample data if APIs fail

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learning Resources

### Concepts Demonstrated

1. **Async/Await**: Modern asynchronous JavaScript
2. **API Integration**: RESTful API consumption
3. **Data Processing**: Deduplication, validation
4. **Regex**: Pattern matching for PII
5. **Report Generation**: Dynamic HTML creation
6. **Error Handling**: Graceful degradation

### Code Structure

- `index.js`: Main orchestration
- `scrapers/`: Data collection modules
- `utils/`: Processing utilities
- Modular, maintainable design

## 🎓 Educational Use Cases

Perfect for demonstrating:

- Web scraping fundamentals
- Data pipeline development
- Privacy-aware programming
- API integration skills
- Security research techniques
- Portfolio projects

## 🤝 Contributing

This is an educational project. Suggestions for improvement:

- Additional legal data sources
- Enhanced PII detection patterns
- Better deduplication algorithms
- More detailed reporting
- Performance optimizations

## 📞 Support

For questions or issues:

1. Check the main README.md
2. Review code comments
3. Test with sample data first
4. Ensure all dependencies are installed

---

**Remember**: Always collect data ethically and legally! 🛡️
