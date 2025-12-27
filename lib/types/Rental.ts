export type Rental = {
  id: number | null;
  created_at?: string;
  rental_name?: string | null;
  rental_description?: string | null;
  price?: number | null;
  image_url?: string | null;
  rental_owner?: string | null;
  isAvailable?: boolean;
}
