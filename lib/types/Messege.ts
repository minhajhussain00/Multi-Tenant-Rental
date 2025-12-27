export type Message = {
  id: number;               
  created_at?: string;       
  sender_id: string | null; 
  room_id: string;          
  content: string;          
};