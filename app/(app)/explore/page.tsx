"use client"
import React, { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

type RentalRow = {
  id: string
  rental_name: string
  rental_description?: string | null
  price: number
  image_url?: string | null
}
export default function ExplorePage() {
  const [query, setQuery] = useState("")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [listings, setListings] = useState<RentalRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    const fetchRentals = async () => {
      setLoading(true)
      setError(null)
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const { data, error } = await supabase.from("rentals").select("*").order("created_at", { ascending: false })
        if (error) {
          console.error("fetch rentals error", error)
          if (mounted) setError(error.message)
        } else {
          if (mounted) setListings((data ?? []) as RentalRow[])
        }
      } catch (err: unknown) {
        console.error("unexpected error fetching rentals", err)
        const msg = err instanceof Error ? err.message : String(err)
        if (mounted) setError(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchRentals()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesQuery =
        query.trim() === "" ||
        l.rental_name.toLowerCase().includes(query.toLowerCase()) ||
        (l.rental_description ?? "").toLowerCase().includes(query.toLowerCase())

      const matchesMin = minPrice === "" || l.price >= Number(minPrice)
      const matchesMax = maxPrice === "" || l.price <= Number(maxPrice)

      return matchesQuery && matchesMin && matchesMax
    })
  }, [query, minPrice, maxPrice, listings])

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Explore rentals</h1>
        <p className="text-sm text-muted-foreground">Find your next place — filter and search listings.</p>
      </header>

      <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 flex gap-2">
          <Input
            placeholder="Search by title or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="ghost" onClick={() => setQuery("")}>Clear</Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            type="number"
          />
          <Input
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            type="number"
          />
        </div>
      </section>

      <section>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading listings…</div>
        ) : error ? (
          <div className="text-center text-destructive">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground">No listings found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="relative w-full h-48 bg-muted">
                  <Image
                    src={listing.image_url || "/images/placeholder.jpg"}
                    alt={listing.rental_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{listing.rental_name}</CardTitle>
                  <CardDescription
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {listing.rental_description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{listing.price ? `$${listing.price}/mo` : ""}</div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Link href={`/rentals/${listing.id}`} className="">
                    <Button size="sm">View</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
