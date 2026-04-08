function tokenize(expression) {
  const tokens = [];
  let i = 0;

  while (i < expression.length) {
    const ch = expression[i];

    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let j = i;
      let dotCount = 0;
      while (j < expression.length && /[0-9.]/.test(expression[j])) {
        if (expression[j] === '.') dotCount += 1;
        if (dotCount > 1) {
          throw new Error('Invalid number format');
        }
        j += 1;
      }
      const numStr = expression.slice(i, j);
      if (numStr === '.') {
        throw new Error('Invalid number format');
      }
      tokens.push({type: 'number', value: Number(numStr)});
      i = j;
      continue;
    }

    if ('+-*/()'.includes(ch)) {
      tokens.push({type: 'op', value: ch});
      i += 1;
      continue;
    }

    throw new Error(`Unsupported character: ${ch}`);
  }

  return tokens;
}

function toRpn(tokens) {
  const output = [];
  const ops = [];
  const precedence = {'u-': 3, '*': 2, '/': 2, '+': 1, '-': 1};
  const rightAssoc = new Set(['u-']);

  let prev = null;

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
      prev = token;
      continue;
    }

    const v = token.value;

    if (v === '(') {
      ops.push(v);
      prev = token;
      continue;
    }

    if (v === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') {
        output.push({type: 'op', value: ops.pop()});
      }
      if (!ops.length) {
        throw new Error('Mismatched parentheses');
      }
      ops.pop();
      prev = token;
      continue;
    }

    let op = v;
    const isUnaryMinus =
      v === '-' &&
      (!prev || (prev.type === 'op' && prev.value !== ')'));
    if (isUnaryMinus) {
      op = 'u-';
    }

    while (ops.length) {
      const top = ops[ops.length - 1];
      if (top === '(') break;
      const shouldPop = rightAssoc.has(op)
        ? precedence[op] < precedence[top]
        : precedence[op] <= precedence[top];
      if (!shouldPop) break;
      output.push({type: 'op', value: ops.pop()});
    }

    ops.push(op);
    prev = token;
  }

  while (ops.length) {
    const op = ops.pop();
    if (op === '(' || op === ')') {
      throw new Error('Mismatched parentheses');
    }
    output.push({type: 'op', value: op});
  }

  return output;
}

function evalRpn(rpn) {
  const stack = [];

  for (const token of rpn) {
    if (token.type === 'number') {
      stack.push(token.value);
      continue;
    }

    const op = token.value;
    if (op === 'u-') {
      if (stack.length < 1) throw new Error('Invalid expression');
      stack.push(-stack.pop());
      continue;
    }

    if (stack.length < 2) throw new Error('Invalid expression');
    const b = stack.pop();
    const a = stack.pop();

    switch (op) {
      case '+':
        stack.push(a + b);
        break;
      case '-':
        stack.push(a - b);
        break;
      case '*':
        stack.push(a * b);
        break;
      case '/':
        if (b === 0) throw new Error('Division by zero');
        stack.push(a / b);
        break;
      default:
        throw new Error(`Unsupported operator: ${op}`);
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}

function evaluateExpression(expression) {
  if (typeof expression !== 'string' || !expression.trim()) {
    throw new Error('Missing required field: expression');
  }
  if (expression.length > 300) {
    throw new Error('Expression is too long');
  }

  const tokens = tokenize(expression);
  const rpn = toRpn(tokens);
  return evalRpn(rpn);
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
