export type Profile = {
  id: string;                    
  created_at: string;            
  name: string | null;            
  renting?: number[] | null;        
  image_url: string | null;        
  stripe_customer_id: string | null;
  email: string | null;
};