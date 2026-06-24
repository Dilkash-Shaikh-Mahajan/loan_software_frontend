export const metadata = {
  title: "Live Field Agents Map | ApexLoan Admin",
  description: "Real-time tracking and live map view of all active field agents and recovery personnel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
