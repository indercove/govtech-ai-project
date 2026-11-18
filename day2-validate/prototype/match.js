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

/**
 * Generate a draft reply based on the customer enquiry and selected policy.
 * ALL DRAFTS ARE SYNTHETIC TEMPLATES FOR LEARNING PURPOSES.
 */
function generateReplyDraft(enquiry, policy, alternate = false) {
  const templates = getReplyTemplates(policy.category);
  const template = alternate
    ? templates[Math.floor(Math.random() * templates.length)]
    : templates[0];

  return template
    .replace('{GREETING}', getGreeting())
    .replace('{POLICY_TITLE}', policy.title)
    .replace('{POLICY_SUMMARY}', policy.summary)
    .replace('{POLICY_URL}', policy.url)
    .replace('{SIGN_OFF}', getSignOff());
}

function getGreeting() {
  const greetings = [
    'Dear Customer,',
    'Hello,',
    'Good day,'
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

function getSignOff() {
  return `Best regards,
[Officer Name]
ServiceSG

[This is a synthetic draft for prototype testing]`;
}

function getReplyTemplates(category) {
  const templates = {
    'CPF': [
      `{GREETING}

Thank you for your enquiry regarding CPF matters.

Based on your query, I would like to direct you to the following resource:

**{POLICY_TITLE}**
{POLICY_SUMMARY}

You may find more details at: {POLICY_URL}

If you need further assistance, please provide your NRIC (last 4 characters) and we can look into your specific situation.

{SIGN_OFF}`,
      `{GREETING}

Thank you for reaching out to us about your CPF query.

For your reference, the relevant policy is:

**{POLICY_TITLE}**

Key information: {POLICY_SUMMARY}

For step-by-step guidance, please visit: {POLICY_URL}

Do let us know if you have any follow-up questions.

{SIGN_OFF}`
    ],
    'HDB': [
      `{GREETING}

Thank you for your enquiry about HDB matters.

Based on your query, the relevant information can be found here:

**{POLICY_TITLE}**
{POLICY_SUMMARY}

Please visit {POLICY_URL} for eligibility criteria and application steps.

If you would like us to check your specific eligibility, please provide your household details.

{SIGN_OFF}`,
      `{GREETING}

Thank you for contacting us regarding your housing query.

I am pleased to share the following resource with you:

**{POLICY_TITLE}**

Summary: {POLICY_SUMMARY}

You can access the full details and apply at: {POLICY_URL}

Please feel free to reach out if you need clarification.

{SIGN_OFF}`
    ],
    'Healthcare': [
      `{GREETING}

Thank you for your healthcare-related enquiry.

Based on your query, I would recommend reviewing:

**{POLICY_TITLE}**
{POLICY_SUMMARY}

More information is available at: {POLICY_URL}

If your query involves a specific claim or medical bill, please provide the relevant reference numbers.

{SIGN_OFF}`,
      `{GREETING}

Thank you for reaching out about your healthcare matter.

The following resource should address your query:

**{POLICY_TITLE}**

Details: {POLICY_SUMMARY}

Please refer to {POLICY_URL} for more information.

We are here to help if you have further questions.

{SIGN_OFF}`
    ],
    'Education': [
      `{GREETING}

Thank you for your enquiry about education and skills matters.

The relevant policy for your query is:

**{POLICY_TITLE}**
{POLICY_SUMMARY}

You can find more details at: {POLICY_URL}

If you need help with a specific application, please let us know.

{SIGN_OFF}`,
      `{GREETING}

Thank you for contacting us regarding your education query.

Based on your enquiry, I would like to share:

**{POLICY_TITLE}**

Key points: {POLICY_SUMMARY}

Full information available at: {POLICY_URL}

Do reach out if you need further guidance.

{SIGN_OFF}`
    ],
    'Employment': [
      `{GREETING}

Thank you for your enquiry about employment and work pass matters.

Based on your query, the relevant resource is:

**{POLICY_TITLE}**
{POLICY_SUMMARY}

Please refer to {POLICY_URL} for detailed requirements and application procedures.

If you need assistance with a specific case, please provide your FIN or application reference number.

{SIGN_OFF}`,
      `{GREETING}

Thank you for reaching out about your work pass query.

I am directing you to the following policy:

**{POLICY_TITLE}**

Summary: {POLICY_SUMMARY}

For full details and online services, visit: {POLICY_URL}

Please let us know if you require further assistance.

{SIGN_OFF}`
    ],
    'default': [
      `{GREETING}

Thank you for your enquiry.

Based on your query, I would like to share the following resource:

**{POLICY_TITLE}**
{POLICY_SUMMARY}

You may find more details at: {POLICY_URL}

Please do not hesitate to contact us if you need further assistance.

{SIGN_OFF}`,
      `{GREETING}

Thank you for contacting ServiceSG.

The following information should help address your query:

**{POLICY_TITLE}**

Details: {POLICY_SUMMARY}

For more information, please visit: {POLICY_URL}

We are happy to assist with any follow-up questions.

{SIGN_OFF}`
    ]
  };

  return templates[category] || templates['default'];
}
