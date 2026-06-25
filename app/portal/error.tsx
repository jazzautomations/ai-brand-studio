"use client";

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mb-6 grid h-20 w-20 mx-auto place-items-center rounded-full bg-primary/10">
          <span className="text-3xl font-bold text-primary">!</span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Portal error</h1>
        <p className="text-muted-foreground mb-6">
          {error.message || "Something went wrong in the portal."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
