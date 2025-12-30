import { Booking } from "./Booking";
import { Rental } from "./Rental";
import { Profile } from "./UserProfile";

export type HandOver = {
  id: string | null;
  created_at?: string;
  pickup_location: string | null;
  status: string;
  booking_id: Booking | null;
  renting_user: Profile | string | null;
  owner: Profile | string | null;
  rental_id:Rental | number;
  isHanded: boolean;
  isReturned: boolean | null;
  return_location: string | null;
}
