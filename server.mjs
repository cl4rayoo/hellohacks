import http from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const virtualenvPython = join(projectRoot, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const pythonExecutable = process.env.PYTHON_EXECUTABLE
  || (existsSync(virtualenvPython) ? virtualenvPython : process.platform === 'win32' ? 'python' : 'python3');
const recipeScript = join(projectRoot, 'src', 'recipe-nutrition-facts');
const fridgeScanScript = join(projectRoot, 'src', 'image-recognition');
const maxRequestBytes = 55 * 1024 * 1024;

function loadEnv() {
  try {
    const contents = readFileSync(join(projectRoot, '.env'), 'utf8');
    contents.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*["']?(.*?)["']?\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    });
  } catch {
    // Environment variables may be provided by the host instead.
  }
}

loadEnv();

const port = Number(process.env.PORT || 8787);

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(body));
}

function runPythonScript(scriptPath, payload, args = []) {
  return new Promise((resolve, reject) => {
    const python = spawn(pythonExecutable, [scriptPath, ...args], {
      cwd: projectRoot,
      stdio: ['pipe', 'pipe', 'inherit'],
    });
    let output = '';
    python.stdout.setEncoding('utf8');
    python.stdout.on('data', (chunk) => {
      output += chunk;
    });
    python.stdin.on('error', () => {});
    python.on('error', (error) => reject(new Error(`Could not start the Python recipe service: ${error.message}`)));
    python.on('close', () => {
      let result;
      try {
        result = JSON.parse(output);
      } catch {
        reject(new Error('Python recipe service returned invalid JSON.'));
        return;
      }
      if (result.error) reject(new Error(result.error));
      else resolve(result);
    });
    python.stdin.end(JSON.stringify(payload));
  });
}

async function createRecipe(request) {
  const prompt = typeof request === 'string' ? request.trim() : '';
  if (!prompt || prompt.length > 200) throw new Error('Enter a recipe idea under 200 characters.');
  return runPythonScript(recipeScript, { prompt }, ['--json']);
}

async function scanFridge(images) {
  if (!Array.isArray(images) || images.length === 0 || images.length > 4) {
    throw new Error('Add between 1 and 4 fridge photos to scan.');
  }
  return runPythonScript(fridgeScanScript, { images });
}

async function generatePantryRecipes(payload) {
  return runPythonScript(fridgeScanScript, {
    action: 'recipes',
    ingredients: payload.ingredients,
    prompt: payload.prompt || '',
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
    response.end();
    return;
  }
  const supportedRoutes = ['/api/recipe-nutrition', '/api/fridge-scan', '/api/pantry-recipes'];
  if (request.method !== 'POST' || !supportedRoutes.includes(request.url)) {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > maxRequestBytes) {
      sendJson(response, 413, { error: 'Photo upload is too large. Use fewer or smaller photos.' });
      request.destroy();
      return;
    }
  }
  try {
    const payload = JSON.parse(body || '{}');
    const result = request.url === '/api/fridge-scan'
      ? await scanFridge(payload.images)
      : request.url === '/api/pantry-recipes'
        ? await generatePantryRecipes(payload)
        : await createRecipe(payload.prompt);
    sendJson(response, 200, result);
  } catch (error) {
    sendJson(response, 400, { error: error.message || 'Could not create recipe.' });
  }
});

server.listen(port, () => console.log(`Recipe nutrition API listening on http://localhost:${port}`));
