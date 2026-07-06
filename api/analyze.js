// Shared "house" photo analysis for trawa.
// Set ANTHROPIC_API_KEY (required) and ACCESS_CODE (optional) in the
// Vercel project's environment variables. The prompt and schema are
// fixed server-side so this endpoint can't be repurposed as a general
// AI proxy.

const CATEGORIES = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory'];
const COLORS = ['black', 'white', 'gray', 'navy', 'denim', 'beige', 'cream', 'brown', 'khaki',
  'blue', 'lightblue', 'teal', 'red', 'burgundy', 'pink', 'orange', 'yellow', 'mustard',
  'green', 'olive', 'purple', 'lavender'];
const STYLES = ['casual', 'smart', 'sport', 'beach', 'evening'];

const SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Short descriptive name, e.g. "White linen shirt"' },
    category: { type: 'string', enum: CATEGORIES },
    colors: { type: 'array', items: { type: 'string', enum: COLORS },
      description: 'Main colors of the garment, most dominant first (1-3)' },
    styles: { type: 'array', items: { type: 'string', enum: STYLES },
      description: 'Every style context this piece genuinely works for' },
    wearsPerWash: { type: 'integer',
      description: 'Typical wears before washing. Tops/dresses 1-3, bottoms 3-7, outerwear 10-20, shoes/accessories 20-30' },
    weightGrams: { type: 'integer',
      description: 'Estimated weight in grams. Tee ~180, shirt ~250, jeans ~600, dress ~350, sneakers ~850, coat ~1100, scarf ~120' },
  },
  required: ['name', 'category', 'colors', 'styles', 'wearsPerWash', 'weightGrams'],
  additionalProperties: false,
};

const PROMPT =
  'Catalog the single main clothing item in this photo for a travel capsule wardrobe. ' +
  'Ignore backgrounds, hangers, and people. Pick colors from the allowed list that best match ' +
  'the garment (denim for jean fabric, cream/beige for off-whites). For styles, include every ' +
  'context the piece genuinely works in: casual (everyday), smart (office/dinner), sport (workout), ' +
  'beach (hot weather/swim), evening (dressy nights out). ' +
  'wearsPerWash is the typical number of wears before washing. ' +
  'weightGrams is the estimated garment weight in grams.';

const ALLOWED_MEDIA = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'POST only' } });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(501).json({ error: { message: 'shared-analysis-not-configured' } });
  }
  const accessCode = process.env.ACCESS_CODE;
  const { mediaType, data, code } = req.body || {};
  if (accessCode && code !== accessCode) {
    return res.status(401).json({ error: { message: 'wrong-access-code' } });
  }
  if (!ALLOWED_MEDIA.includes(mediaType) || typeof data !== 'string' || !data || data.length > 2_500_000) {
    return res.status(400).json({ error: { message: 'bad image payload' } });
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANALYZE_MODEL || 'claude-haiku-4-5',
      max_tokens: 1024,
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
          { type: 'text', text: PROMPT },
        ],
      }],
    }),
  });

  const body = await upstream.json().catch(() => ({ error: { message: 'upstream parse error' } }));
  if (!upstream.ok) {
    // Don't leak upstream auth details to clients
    const status = upstream.status === 401 ? 501 : upstream.status;
    const message = upstream.status === 401
      ? 'shared-analysis-not-configured'
      : body.error?.message || `upstream error ${upstream.status}`;
    return res.status(status).json({ error: { message } });
  }
  return res.status(200).json(body);
};
