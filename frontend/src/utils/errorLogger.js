// errorLogger.js
export function logErrorToFile(error, info) {
  // Send error to backend API (implement /api/log-error in backend)
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: error.toString(), info }),
  });
}
