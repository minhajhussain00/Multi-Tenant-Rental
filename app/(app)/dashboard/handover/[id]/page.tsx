import Chat from '@/components/app/Chat';

import LocationPicker from '@/components/app/LocationPicker';
import { createClient } from '@/lib/supabase/server';
import type { HandOver } from '@/lib/types/HandOver';
export default async function Page({ params }: {params:Promise<{id: string}>}) {
  const { id } = await params;
  
  const supabase  = createClient();
  const { data: handover } = await (await supabase)
    .from("rental_handovers")
    .select("*")
    .eq("id", id)
    .single<HandOver>();
    
  if (!handover) {
    return <div className='flex items-center justify-center h-[90vh]'>Handover not found.</div>;
  }

  return (
<div className="flex flex-wrap items-center justify-center h-[88vh] p-5 w-full ">

  <div className="basis-full md:basis-1/2 order-1 md:order-1 ">
    <Chat roomId={id} />
  </div>


  <div className="basis-full md:basis-1/2 order-2 md:order-2 ">
    <LocationPicker bookingId={id} />
  </div>
</div>

  );
}
