import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user: any = null;
  let onboardingCompleted = false;

  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user;

    if (user) {
      const { data: dbUser } = await supabase
        .from("users")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();
      onboardingCompleted = dbUser?.onboarding_completed || false;
    }
  } catch (err) {
    console.warn("Supabase auth check failed in middleware, checking mock cookie...", err);
  }

  // If Supabase fetch failed or user is not logged in, check for mock user session
  if (!user) {
    const mockUserCookie = request.cookies.get("studycoach_mock_user")?.value;
    if (mockUserCookie) {
      try {
        const mockUser = JSON.parse(decodeURIComponent(mockUserCookie));
        if (mockUser && mockUser.id) {
          user = mockUser;
          onboardingCompleted = mockUser.onboarding_completed || false;
        }
      } catch (e) {
        console.error("Failed to parse mock user cookie", e);
      }
    }
  }

  const path = request.nextUrl.pathname;

  // 1. Unauthenticated users: redirect to sign-in if accessing dashboard or onboarding
  if (path.startsWith("/dashboard") || path.startsWith("/onboarding")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  }

  // 2. Authenticated users: enforce onboarding completion
  if (user) {
    if (path.startsWith("/dashboard") || path === "/onboarding") {
      // If accessing dashboard but onboarding is not completed, redirect to onboarding page
      if (path.startsWith("/dashboard") && !onboardingCompleted) {
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }

      // If accessing onboarding but onboarding is already completed, redirect to dashboard
      if (path === "/onboarding" && onboardingCompleted) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
