import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Dashboard Overview | ApexLoan",
  description: "View comprehensive loan statistics, manage field agents, and track enterprise-wide repayment analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
