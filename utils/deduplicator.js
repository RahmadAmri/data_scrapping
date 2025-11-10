const crypto = require("crypto");

function generateHash(obj) {
  const normalized = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash("md5").update(normalized).digest("hex");
}

function generateFieldHash(obj, fields) {
  const values = fields.map((field) => obj[field] || "").join("|");
  return crypto.createHash("md5").update(values).digest("hex");
}

function deduplicateData(data, options = {}) {
  const { fields = null, useFullObject = true } = options;

  if (!Array.isArray(data) || data.length === 0) {
    return { deduplicated: data, removedCount: 0 };
  }

  const seen = new Set();
  const deduplicated = [];
  let removedCount = 0;

  for (const item of data) {
    let hash;

    if (fields && Array.isArray(fields)) {
      hash = generateFieldHash(item, fields);
    } else if (useFullObject) {
      hash = generateHash(item);
    } else {
      // Default: use title or name field
      hash = item.title || item.name || item.id || JSON.stringify(item);
    }

    if (!seen.has(hash)) {
      seen.add(hash);
      deduplicated.push(item);
    } else {
      removedCount++;
    }
  }

  return {
    deduplicated,
    removedCount,
    originalCount: data.length,
    finalCount: deduplicated.length,
  };
}

function findSimilarItems(data, threshold = 0.8) {
  const similarities = [];

  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      const similarity = calculateSimilarity(data[i], data[j]);
      if (similarity >= threshold) {
        similarities.push({
          item1: i,
          item2: j,
          similarity,
        });
      }
    }
  }

  return similarities;
}

function calculateSimilarity(obj1, obj2) {
  const str1 = JSON.stringify(obj1).toLowerCase();
  const str2 = JSON.stringify(obj2).toLowerCase();

  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(str1, str2);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

module.exports = {
  deduplicateData,
  findSimilarItems,
  generateHash,
  calculateSimilarity,
};
