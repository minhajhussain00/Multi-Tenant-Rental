"use client"
import Navbar from "@/components/app/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gamepad2, Store, Wallet } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted text-foreground">
      
      <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-black text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.4),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(0,255,255,0.4),transparent_40%),radial-gradient(circle_at_top_right,rgba(0,255,0,0.3),transparent_40%)]" />

        <div
          className="absolute inset-0 bg-[url('/images/gaming-bg.jpg')] bg-cover bg-center opacity-30"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Rent. Play. Dominate.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Experience next-level gaming gear — rent premium PCs, VR sets, and consoles
            from trusted vendors on our multi-tenant platform.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-semibold hover:opacity-90"
            >
             <Link href="/explore">
               Start Exploring
             </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
            >
              
            <Link href="/dashboard">
            List Your Store
            </Link>
            </Button>
          </div>
        </div>


        <div className="absolute inset-0 border-t border-b border-transparent bg-[linear-gradient(90deg,rgba(255,0,0,0.5),rgba(0,255,255,0.5),rgba(0,255,0,0.5))] bg-[length:200%_100%] animate-[borderMove_10s_linear_infinite]" />

        <style jsx>{`
        @keyframes borderMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      </section>


      <section
        id="features"
        className="py-24 px-6 bg-gradient-to-b from-black via-[#0a0a0a] to-[#050505]"
      >
        <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-green-400 bg-clip-text text-transparent">
          Why Choose GameRent?
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-900 to-black border border-fuchsia-500/20 hover:border-fuchsia-400/40 transition">
            <CardHeader>
              <Gamepad2 className="h-10 w-10 text-fuchsia-400 mb-4" />
              <CardTitle>Rent Premium Gear</CardTitle>
              <CardDescription className="text-gray-300">
                Access the latest consoles, VR kits, and custom gaming PCs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 hover:border-cyan-400/40 transition">
            <CardHeader>
              <Store className="h-10 w-10 text-cyan-400 mb-4" />
              <CardTitle>Multi-Tenant Stores</CardTitle>
              <CardDescription className="text-gray-300">
                Vendors get dedicated storefronts to manage listings, rentals, and earnings.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border border-green-500/20 hover:border-green-400/40 transition">
            <CardHeader>
              <Wallet className="h-10 w-10 text-green-400 mb-4" />
              <CardTitle>Seamless Payments</CardTitle>
              <CardDescription className="text-gray-300">
                Fast, secure payments for renters and instant payouts for vendors.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section
        id="how"
        className="py-24 px-6 bg-gradient-to-t from-black via-[#0b0b0b] to-[#020202]"
      >
        <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 via-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
          How It Works
        </h3>
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {[
            {
              num: "1",
              title: "Browse",
              desc: "Find gaming gear from top-rated local vendors."
            },
            {
              num: "2",
              title: "Rent",
              desc: "Choose your rental period and pay securely online."
            },
            {
              num: "3",
              title: "Play",
              desc: "Pick up or get it delivered — and game like never before!"
            },
            {
              num: "4",
              title: "Return",
              desc: "Return the quipment or extend your rental with ease."
            }
          ].map((step, i) => (
            <Card
              key={i}
              className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 hover:border-cyan-400/40 transition text-center"
            >
              <CardHeader>
                <CardTitle className="text-4xl mb-2 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  {step.num}
                </CardTitle>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {step.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <section
        id="cta"
        className="py-24 px-6 text-center bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-green-500"
      >
        <h3 className="text-4xl font-extrabold mb-4 text-black">
          Level Up Your Gaming Setup
        </h3>
        <p className="text-lg text-black/80 max-w-2xl mx-auto mb-8">
          Stop settling for average. Get access to high-end gaming rigs, VR kits, and exclusive gear — only when you need them.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-black text-white border border-black hover:bg-black/80 font-semibold"
          >
            Explore Rentals
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-black text-white border border-black hover:bg-black/80 font-semibold"
          >
            See Top Rated Gear
          </Button>
        </div>
      </section>
      <footer className="py-10 text-center text-gray-400 border-t border-fuchsia-500/20">
        <p>© {new Date().getFullYear()} GameRent. All rights reserved.</p>
      </footer>
    </main>
  );
}
