import { Link, useNavigate } from "@tanstack/react-router";
import { useCurrentUser } from "../features/auth/queries";
import { useLogout } from "../features/auth/mutations";


function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 4h14l6 6v14H4V4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 14l-3 3 3 3M18 14l3 3-3 3M15 12l-2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const logoutUser = async() => {
    await logoutMutation.mutateAsync();
    await navigate({ to: "/" })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-void/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-teal-400" aria-label="We Hustle home">
          <LogoMark />
          <span className="font-display text-lg font-semibold tracking-tight text-ink max-[420px]:sr-only">
            We Hustle
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-4 text-sm sm:gap-7 sm:text-[15px]">
          {user?.id
            ? (
              <>
                <Link to="/jobs" className="link">Jobs</Link>
                <a onClick={logoutUser} className="cursor-pointer link">Sign Out</a>
              </>
            ): (
              <>
                <Link to="/register" className="link">Register</Link>
                <Link to="/sign-in" className="link">Sign In</Link>
              </>
            )
          }
        </nav>
      </div>
    </header>
  );
}
