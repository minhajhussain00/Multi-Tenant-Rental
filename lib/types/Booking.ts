import { Rental } from "./Rental";
import { Profile } from "./UserProfile";

export type Booking = {
  id: string;
  rental_id: Rental;
  renting_user_id: Profile | string | null;
  owner_id: Profile | string | null;
  status: string;
  start_date: string;
  end_date: string;
  total_price: number;
  booking_expiry: string | null;
  payment_status: string | null;
  created_at: string | null;
};
