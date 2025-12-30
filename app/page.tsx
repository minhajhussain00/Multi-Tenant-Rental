"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gamepad2, Store, Wallet, Search, ShoppingCart, RotateCcw } from "lucide-react";
import { Vortex } from "@/components/ui/vortex";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const steps = [
  {
    title: "Browse",
    description: "Find gaming gear from top-rated local vendors.",
    content: (
      <Card className="h-full w-full bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 flex items-center justify-center mt-30">
        <div className="text-center">
          <Search className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
          <h4 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            1
          </h4>
        </div>
      </Card>
    ),
  },
  {
    title: "Rent",
    description: "Choose your rental period and pay securely online.",
    content: (
      <Card className="h-full w-full bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
          <h4 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            2
          </h4>
        </div>
      </Card>
    ),
  },
  {
    title: "Play",
    description: "Pick up or get it delivered — and game like never before!",
    content: (
      <Card className="h-full w-full bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
          <h4 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            3
          </h4>
        </div>
      </Card>
    ),
  },
  {
    title: "Return",
    description: "Return the equipment once you’re done.",
    content: (
      <Card className="h-full w-full bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 flex items-center justify-center">
        <div className="text-center">
          <RotateCcw className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
          <h4 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            4
          </h4>
        </div>
      </Card>
    ),
  },
];
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col  text-foreground">
      <section className=" min-h-screen w-full bg-black text-white overflow-hidden flex items-center justify-center">
        <Vortex backgroundColor="black" className="flex items-center flex-col justify-center  w-full h-[90vh]" >

          <div className=" max-w-4xl px-6 text-center mx-auto flex flex-col items-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent animate-gradient-slow">
              Rent. Play. Dominate.
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Experience next-level gaming gear — rent premium PCs, VR sets, and consoles.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                <Link href="/explore">Start Exploring</Link>
              </Button>

              <Button size="lg" variant="outline" className="border-cyan-400 text-cyan-300">
                <Link href="/dashboard">List Your Store</Link>
              </Button>
            </div>
          </div>
        </Vortex>
         <ShootingStars />
        <StarsBackground /> 
      </section>

      <section
        id="features"
        className="py-24 px-6 "
      >
        <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent animate-gradient-slow  py-5">
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
        className="relative py-24 px-6 bg-gradient-to-t from-black via-[#0b0b0b] to-[#020202]"
      >
        <h3 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 via-cyan-400 to-fuchsia-500 bg-clip-text text-transparent animate-gradient-slow">
          How It Works
        </h3>


        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] blur-3xl rounded-full  " />
        </div>

      <div className="relative max-w-6xl mx-auto min-h-[110vh] mt-70">
        <StickyScroll content={steps} />
      </div>

      </section>
      <section
        id="cta"
        className="py-24 px-6 text-center "
      >
        <h3 className="text-4xl font-extrabold mb-4 text-white">
          Level Up Your Gaming Setup
        </h3>
        <p className="text-lg  max-w-2xl mx-auto mb-8">
          Stop settling for average. Get access to high-end gaming rigs, VR kits, and exclusive gear — only when you need them.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-black text-white "
          >
            Explore Rentals
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-black text-white border"
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
