/**
 * Policy matching logic for the prototype.
 * Uses simple keyword matching to find relevant policies.
 *
 * ALL DATA IS SYNTHETIC AND MADE UP FOR LEARNING PURPOSES.
 */

let policyIndex = null;

async function loadPolicies() {
  if (policyIndex) return policyIndex;

  const response = await fetch('policy-index.json');
  const data = await response.json();
  policyIndex = data.policies;
  return policyIndex;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1);
}

function calculateScore(queryTokens, policy) {
  const keywordSet = new Set(policy.keywords.map(k => k.toLowerCase()));
  const titleTokens = tokenize(policy.title);
  const summaryTokens = tokenize(policy.summary);

  let score = 0;
  let matchedKeywords = [];

  for (const token of queryTokens) {
    // Direct keyword match (highest weight)
    if (keywordSet.has(token)) {
      score += 30;
      matchedKeywords.push(token);
    }

    // Partial keyword match
    for (const keyword of policy.keywords) {
      if (keyword.toLowerCase().includes(token) && !keywordSet.has(token)) {
        score += 15;
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    }

    // Title match (medium weight)
    if (titleTokens.includes(token)) {
      score += 10;
    }

    // Summary match (lower weight)
    if (summaryTokens.includes(token)) {
      score += 5;
    }
  }

  // Normalize score to percentage (cap at 100)
  const normalizedScore = Math.min(100, Math.round(score / queryTokens.length * 2));

  return {
    score: normalizedScore,
    matchedKeywords: matchedKeywords
  };
}

async function matchPolicies(query, maxResults = 3) {
  const policies = await loadPolicies();
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return [];
  }

  const scored = policies.map(policy => {
    const { score, matchedKeywords } = calculateScore(queryTokens, policy);
    return {
      ...policy,
      score: score,
      reason: matchedKeywords.length > 0
        ? matchedKeywords.slice(0, 3).join(', ')
        : 'general relevance'
    };
  });

  // Sort by score descending and filter out zero scores
  const results = scored
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return results;
}
