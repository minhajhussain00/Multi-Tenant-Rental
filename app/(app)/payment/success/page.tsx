import Link from "next/link";
import { CheckCircle, Home } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-xl text-center bg-card text-card-foreground shadow-lg rounded-2xl p-8">
        <CheckCircle className="mx-auto w-16 h-16 text-primary mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Payment Successful</h1>
        <p className="text-sm text-muted-foreground mb-6">Thanks — your payment was processed. Go to the dashboard to request the meetup location,</p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-95">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link href="/dashboard" className="px-4 py-2 border rounded-md hover:bg-accent/10">Go to dashboard</Link>
        </div>
      </div>
    </main>
  );
}
