import Link from "next/link";
import { XCircle } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-xl text-center bg-card text-card-foreground shadow-lg rounded-2xl p-8">
        <XCircle className="mx-auto w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Payment Cancelled</h1>
        <p className="text-sm text-muted-foreground mb-6">Your payment was cancelled. No charges were made.</p>
        <div className="flex justify-center gap-4">
          <Link href="/explore" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-95">Browse rentals</Link>
          <Link href="/" className="px-4 py-2 border rounded-md hover:bg-accent/10">Go home</Link>
        </div>
      </div>
    </main>
  );
}
