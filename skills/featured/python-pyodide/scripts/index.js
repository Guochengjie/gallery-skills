let pyodideInstance = null;

async function getPyodide() {
  if (!pyodideInstance) {
    pyodideInstance = await loadPyodide({
      indexURL: 'pyodide/'
    });
  }
  return pyodideInstance;
}

window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const payload = JSON.parse(data || '{}');
    const code = payload.code;
    const variables = payload.variables || {};

    if (!code || typeof code !== 'string') {
      return JSON.stringify({error: 'Missing required field: code (string).'});
    }

    const pyodide = await getPyodide();
    pyodide.globals.set('USER_CODE', code);
    pyodide.globals.set('USER_VARS_JSON', JSON.stringify(variables));

    const raw = await pyodide.runPythonAsync(`
import contextlib
import io
import json
import traceback

vars_dict = json.loads(USER_VARS_JSON)
globals_dict = {'__builtins__': __builtins__}
globals_dict.update(vars_dict)
locals_dict = {}

stdout_io = io.StringIO()
error_text = None

try:
  with contextlib.redirect_stdout(stdout_io):
    exec(USER_CODE, globals_dict, locals_dict)
except Exception:
  error_text = traceback.format_exc()

result_value = None
if 'result' in locals_dict:
  result_value = locals_dict['result']
elif 'result' in globals_dict:
  result_value = globals_dict['result']

json.dumps({
  'stdout': stdout_io.getvalue(),
  'error': error_text,
  'result': result_value,
}, default=str, ensure_ascii=False)
`);

    const parsed = JSON.parse(raw);

    if (parsed.error) {
      return JSON.stringify({error: `Python execution failed:\n${parsed.error}`});
    }

    const renderedResult =
      parsed.result === null || parsed.result === undefined
        ? 'Execution finished. No `result` variable was set.'
        : typeof parsed.result === 'string'
          ? parsed.result
          : JSON.stringify(parsed.result, null, 2);

    const stdoutSection = parsed.stdout ? `\n\nstdout:\n${parsed.stdout}` : '';

    return JSON.stringify({
      result: `${renderedResult}${stdoutSection}`
    });
  } catch (e) {
    console.error(e);
    return JSON.stringify({error: `Failed to run Python: ${e.message}`});
  }
};
