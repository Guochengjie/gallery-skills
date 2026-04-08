function evaluateExpression(expression) {
  if (typeof expression !== 'string' || !expression.trim()) {
    throw new Error('Missing required field: expression');
  }
  if (expression.length > 300) {
    throw new Error('Expression is too long');
  }

  // Normalize common math aliases and symbols.
  const normalized = expression
    .trim()
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\bmod\b/gi, '%')
    .replace(/\^/g, '**');

  // Allow only arithmetic syntax plus supported function calls.
  if (!/^[0-9+\-*/%().,\sA-Za-z]+$/.test(normalized)) {
    throw new Error('Expression contains unsupported characters');
  }

  const identifiers = normalized.match(/[A-Za-z_]+/g) || [];
  for (const id of identifiers) {
    if (
      id !== 'sqrt' &&
      id !== 'power' &&
      id !== 'abs' &&
      id !== 'floor' &&
      id !== 'ceil' &&
      id !== 'round'
    ) {
      throw new Error(`Unsupported identifier: ${id}`);
    }
  }

  const evaluator = new Function(
    'sqrt',
    'power',
    'abs',
    'floor',
    'ceil',
    'round',
    `'use strict'; return (${normalized});`
  );
  const result = evaluator(
    (x) => Math.sqrt(x),
    (a, b) => Math.pow(a, b),
    (x) => Math.abs(x),
    (x) => Math.floor(x),
    (x) => Math.ceil(x),
    (x) => Math.round(x)
  );

  if (typeof result !== 'number' || !Number.isFinite(result)) {
    throw new Error('Invalid arithmetic result');
  }
  return result;
}

window['ai_edge_gallery_get_result'] = async (dataStr) => {
  try {
    const data = JSON.parse(dataStr || '{}');
    const expression = data.expression;
    const result = evaluateExpression(expression);

    return JSON.stringify({
      result: String(result),
      value: result,
      expression
    });
  } catch (e) {
    console.error(e);
    return JSON.stringify({error: `Failed to evaluate expression: ${e.message}`});
  }
};
