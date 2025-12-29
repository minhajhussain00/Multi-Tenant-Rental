"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/stores/useUserStore";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import { toast } from "sonner";

const ClickHandler = ({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default function RentalHandover({ bookingId }: { bookingId: string }) {
  const supabase = createClient();
  const { user } = useUserStore();

  const [handover, setHandover] = useState<any>(null);
  const [coords, setCoords] = useState<string>("");
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const markerIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [28, 28],
  });



  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("rental_handovers")
        .select("*, booking:booking_id(*)")
        .eq("id", bookingId)
        .single();
      if (data) setHandover(data);
    };

    fetch();

    const channel = supabase
      .channel(`handover-${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rental_handovers",
          filter: `id=eq.${bookingId}`,
        },
        (payload) => payload.new && setHandover(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  if (!handover) return <p>Loading…</p>;

  const isOwner = handover.owner === user?.id;
  const isRenter = handover.renting_user === user?.id;


  const savePickupLocation = async () => {
    if (!coords) return toast.error("Select a pickup location");
    setLoading(true);

    const { error } = await supabase
      .from("rental_handovers")
      .update({ pickup_location: coords })
      .eq("id", bookingId);

    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Pickup location saved");
    setSelected(null);
  };

  const markAsHanded = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("rental_handovers")
      .update({ isHanded: true })
      .eq("id", bookingId);

    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Rental handed over");
  };

  const saveReturnLocation = async () => {
    if (!coords) return toast.error("Select a return location");
    setLoading(true);

    const { error } = await supabase
      .from("rental_handovers")
      .update({ return_location: coords })
      .eq("id", bookingId);

    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Return location saved");
    setSelected(null);
  };

  const markAsReturned = async () => {
    setLoading(true);

    const { error: handoverError } = await supabase
      .from("rental_handovers")
      .update({ isReturned: true, status: 'completed' })
      .eq("id", bookingId);

    if (handoverError) {
      setLoading(false);
      return toast.error(handoverError.message);
    }

    await supabase
      .from("rentals")
      .update({ isAvailable: true })
      .eq("id", handover.rental_id);

    setLoading(false);
    toast.success("Rental returned");
  };

  const parseCoords = (value?: string) =>
    value
      ? {
        lat: Number(value.split(",")[0]),
        lng: Number(value.split(",")[1]),
      }
      : null;

  const pickupCoords = parseCoords(handover.pickup_location);
  const returnCoords = parseCoords(handover.return_location);
  console.log(pickupCoords, returnCoords)
  console.log("is Owner " + isOwner)

  return (
    <Card className="p-4 h-[80vh]">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Rental Handover
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {!pickupCoords && (
          <p className="text-muted-foreground">
            {isOwner
              ? "Set a pickup location for the renter to pick up the rental."
              : "Waiting for the owner to set a pickup location."}
          </p>
        )}

        {isOwner && !handover.pickup_location && (
          <>
            <p className="font-medium">Set pickup location</p>
            <MapContainer center={[0, 0]} zoom={3}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickHandler
                onPick={(lat, lng) => {
                  setCoords(`${lat},${lng}`);
                  setSelected({ lat, lng });
                }}
              />
              {selected && (
                <Marker position={[selected.lat, selected.lng]} icon={markerIcon} />
              )}
            </MapContainer>
            <Button disabled={loading} onClick={savePickupLocation}>
              Save pickup location
            </Button>
          </>
        )}

        {pickupCoords && !handover.isHanded && isRenter && (
          <>
            <p className="font-medium">Pickup location</p>
            <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={15}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={markerIcon} />
            </MapContainer>
          </>
        )}

        {pickupCoords && !handover.isHanded && isOwner && (
          <>
            <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={15}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={markerIcon} />
            </MapContainer>
            <Button disabled={loading} onClick={markAsHanded}>
              Confirm handover
            </Button>
          </>
        )}
        {handover.isHanded && !handover.isReturned && isRenter && new Date(handover.booking?.end_date).getTime() > Date.now() && (
          <p className="text-muted-foreground">
            Return location will be available once the rental period ends.
          </p>
        )}
        {handover.isHanded && !handover.isReturned && isRenter && new Date(handover.booking?.end_date).getTime() < Date.now() && (
          <>
            <p className="font-medium">Set return location</p>
            <MapContainer center={[0, 0]} zoom={3}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickHandler
                onPick={(lat, lng) => {
                  setCoords(`${lat},${lng}`);
                  setSelected({ lat, lng });
                }}
              />
              {selected && (
                <Marker position={[selected.lat, selected.lng]} icon={markerIcon} />
              )}
            </MapContainer>
            <Button disabled={loading} onClick={saveReturnLocation}>
              Save return location
            </Button>
            <Button disabled={loading} onClick={markAsReturned}>
              Mark as returned
            </Button>
          </>
        )}

        {returnCoords && isOwner && (
          <>
            <p className="font-medium">Return location</p>
            <MapContainer center={[returnCoords.lat, returnCoords.lng]} zoom={15}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[returnCoords.lat, returnCoords.lng]} icon={markerIcon} />
            </MapContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}

