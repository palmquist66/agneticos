// Vercel Edge Middleware — password gate for the PRIVATE Healthy Paws demo.
//
// Runs on every request (including the public *.vercel.app production URL), so the
// demo is protected regardless of Vercel plan-level Deployment Protection — which on
// the Hobby plan leaves production URLs public. HTTP Basic Auth: the browser shows a
// username/password prompt; without the correct credentials every route returns 401.
//
// This is a throwaway demo credential, not a real secret. Change USER/PASS to rotate.
import { next } from '@vercel/edge';

export const config = { matcher: '/:path*' };

const USER = 'healthypaws';
const PASS = 'KarenPreview2026';

export default function middleware(request: Request): Response {
  const header = request.headers.get('authorization') || '';
  const expected = 'Basic ' + btoa(`${USER}:${PASS}`);

  if (header === expected) {
    return next(); // authenticated — serve the static asset
  }

  // NOTE: WWW-Authenticate must be plain ASCII. A non-ASCII char in the realm
  // (e.g. an em dash) makes the runtime drop the header, so the browser never
  // shows the login prompt and just renders this body. Keep the realm ASCII-only.
  return new Response('Authentication required: this is a private preview.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Healthy Paws Demo"',
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}
