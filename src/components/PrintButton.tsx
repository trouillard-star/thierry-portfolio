export function PrintButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="button button-primary" type="button" data-print-page>
      {children}
    </button>
  );
}
