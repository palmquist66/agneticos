import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// DEMO MODE: set DEMO_MODE=true in .env to skip auth (local network demos)
const isDemoMode = process.env.DEMO_MODE === "true";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/notifications(.*)",
  "/api/waitlist",
  "/manifest.json",
  "/sw.js",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isDemoMode) return;
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
