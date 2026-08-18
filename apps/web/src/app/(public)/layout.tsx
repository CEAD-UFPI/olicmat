export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen dot-pattern">
      <div className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
