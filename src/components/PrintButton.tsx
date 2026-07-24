"use client";

export function PrintButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="button button-primary"
      type="button"
      onClick={() => window.print()}
    >
      {children}
    </button>
  );
}
