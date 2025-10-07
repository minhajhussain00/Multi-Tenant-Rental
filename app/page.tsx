
import Link from "next/link";
import { Gamepad2, Store, Wallet } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 to-gray-900 text-white">
    
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-500">GameRent</h1>
        <div className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-blue-400 transition">
            Features
          </a>
          <a href="#how" className="hover:text-blue-400 transition">
            How It Works
          </a>
          <a href="#partner" className="hover:text-blue-400 transition">
            For Vendors
          </a>
        </div>  
        <button className="bg-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition">
          Get Started
        </button>
      </nav>

   
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-24">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
          Rent. Play. Dominate.
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
          GameRent connects gamers with local stores offering top-tier gaming gear.
          Each vendor manages their own storefront with multi-tenant support.
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition">
            Start Renting
          </button>
          <button className="border border-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500/10 transition">
            List Your Store
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-900">
        <h3 className="text-3xl font-bold text-center mb-12">Why GameRent?</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500 transition">
            <Gamepad2 className="h-10 w-10 text-blue-500 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Rent Premium Gear</h4>
            <p className="text-gray-400">
              Access the best consoles, VR kits, and gaming PCs from trusted vendors.
            </p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500 transition">
            <Store className="h-10 w-10 text-blue-500 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Multi-Tenant Stores</h4>
            <p className="text-gray-400">
              Each vendor gets a personalized storefront with full inventory control.
            </p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500 transition">
            <Wallet className="h-10 w-10 text-blue-500 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Seamless Payments</h4>
            <p className="text-gray-400">
              Secure payments, automatic invoices, and fast payouts for vendors.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-4xl text-blue-500 font-bold mb-4">1</div>
            <h4 className="text-xl font-semibold mb-2">Browse</h4>
            <p className="text-gray-400">Find gaming gear from nearby vendors.</p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-4xl text-blue-500 font-bold mb-4">2</div>
            <h4 className="text-xl font-semibold mb-2">Rent</h4>
            <p className="text-gray-400">
              Choose your rental period and pay securely.
            </p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-4xl text-blue-500 font-bold mb-4">3</div>
            <h4 className="text-xl font-semibold mb-2">Play</h4>
            <p className="text-gray-400">
              Get it delivered or pick it up — game without limits.
            </p>
          </div>
        </div>
      </section>
      <footer className="py-10 text-center text-gray-500 border-t border-gray-800">
        <p>© {new Date().getFullYear()} GameRent. All rights reserved.</p>
      </footer>
    </main>
  );
}
