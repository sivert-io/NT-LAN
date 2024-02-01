import Navbar from "@/components/navbar/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full px-32">
      {children}
      <Navbar isAdmin />
    </main>
  );
}
