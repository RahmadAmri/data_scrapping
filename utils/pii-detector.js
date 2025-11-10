const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  password: /\b(password|pwd|pass)[\s:=]+[^\s]{6,}\b/gi,
  apiKey: /\b[A-Za-z0-9_-]{32,}\b/g,
};

function maskString(str, visibleChars = 3) {
  if (!str || str.length <= visibleChars) {
    return "*".repeat(str.length);
  }
  const visible = str.substring(0, visibleChars);
  const masked = "*".repeat(str.length - visibleChars);
  return visible + masked;
}

function maskEmail(email) {
  const [username, domain] = email.split("@");
  return `${maskString(username, 2)}@${domain}`;
}

function detectAndMaskPII(data) {
  let piiFound = false;
  let processed = JSON.stringify(data);

  const emails = processed.match(PII_PATTERNS.email) || [];
  if (emails.length > 0) {
    emails.forEach((email) => {
      processed = processed.replace(email, maskEmail(email));
      piiFound = true;
    });
  }

  const phones = processed.match(PII_PATTERNS.phone) || [];
  if (phones.length > 0) {
    phones.forEach((phone) => {
      processed = processed.replace(phone, `***-***-${phone.slice(-4)}`);
      piiFound = true;
    });
  }

  const ssns = processed.match(PII_PATTERNS.ssn) || [];
  if (ssns.length > 0) {
    ssns.forEach((ssn) => {
      processed = processed.replace(ssn, `***-**-${ssn.slice(-4)}`);
      piiFound = true;
    });
  }

  const cards = processed.match(PII_PATTERNS.creditCard) || [];
  if (cards.length > 0) {
    cards.forEach((card) => {
      const cleaned = card.replace(/[-\s]/g, "");
      processed = processed.replace(
        card,
        `****-****-****-${cleaned.slice(-4)}`
      );
      piiFound = true;
    });
  }

  const ips = processed.match(PII_PATTERNS.ipAddress) || [];
  if (ips.length > 0) {
    ips.forEach((ip) => {
      const parts = ip.split(".");
      processed = processed.replace(ip, `${parts[0]}.${parts[1]}.***.***.***`);
      piiFound = true;
    });
  }

  return {
    masked: JSON.parse(processed),
    piiFound,
    piiTypes: {
      emails: emails.length,
      phones: phones.length,
      ssns: ssns.length,
      creditCards: cards.length,
      ipAddresses: ips.length,
    },
  };
}

function sanitizeText(text) {
  if (!text) return text;

  let sanitized = text;

  sanitized = sanitized.replace(PII_PATTERNS.email, (email) =>
    maskEmail(email)
  );

  sanitized = sanitized.replace(PII_PATTERNS.phone, "***-***-****");

  sanitized = sanitized.replace(PII_PATTERNS.ssn, "***-**-****");

  sanitized = sanitized.replace(PII_PATTERNS.creditCard, "****-****-****-****");

  return sanitized;
}

module.exports = {
  detectAndMaskPII,
  sanitizeText,
  PII_PATTERNS,
};
