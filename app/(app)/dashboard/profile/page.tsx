import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, CreditCard, Home } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/login");
  }

  // Get profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!profile) {
    redirect("/auth/login");
  }

  // Get user's listings count
  const { data: listings } = await supabase
    .from("rentals")
    .select("*")
    .eq("rental_owner", authUser.id);

  // Get rentals the user is currently renting
  const rentingIds = profile.renting || [];
  let currentRentals = [];
  if (rentingIds.length > 0) {
    const { data } = await supabase
      .from("rentals")
      .select("*")
      .in("id", rentingIds);
    currentRentals = data || [];
  }

  // Calculate account age
  const accountCreated = new Date(authUser.created_at);
  const now = new Date();
  const daysSinceCreation = Math.floor(
    (now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    profile.image && profile.image !== "placeholder"
                      ? profile.image
                      : undefined
                  }
                  alt={profile.name}
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {authUser.email}
                </CardDescription>
              </div>
            </div>
            <EditProfileDialog />
          </CardHeader>
        </Card>

        {/* User Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and identifiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">User ID</p>
                <p className="text-sm text-muted-foreground">{profile.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{authUser.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Stripe ID</p>
                <p className="text-sm text-muted-foreground">
                  {profile.stripeId || "Not connected"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {accountCreated.toLocaleDateString()} ({daysSinceCreation} days ago)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{listings?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Items you&apos;re renting out
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rentingIds.length}</div>
              <p className="text-xs text-muted-foreground">
                Items you&apos;re currently renting
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Age</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysSinceCreation}</div>
              <p className="text-xs text-muted-foreground">Days as a member</p>
            </CardContent>
          </Card>
        </div>

        {/* Currently Renting Properties */}
        {currentRentals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Currently Renting</CardTitle>
              <CardDescription>
                Properties you are currently renting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentRentals.map((rental) => (
                  <div
                    key={rental.id}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-4">
                      {rental.image_url && (
                        <Image
                          src={rental.image_url}
                          alt={rental.rental_name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{rental.rental_name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${rental.price}/day
                        </p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
