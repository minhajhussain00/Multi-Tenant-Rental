import stripe from "@/lib/stripe";

export async function POST(req: Request) {
    try {
        const { price, name = 'Rental' ,rentalId, booking_id } = await req.json();
        console.log(price , name)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: price,
                        product_data: {
                            name,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/payment/success`,
            cancel_url: `${req.headers.get('origin')}/payment/cancel`,
              metadata: {
    rental_id: rentalId, 
    booking_id: booking_id
  },
        });

        return new Response(
            JSON.stringify({ url: session.url }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err: any) {
        console.error('Checkout POST error:', err?.message ?? err);
        const message = err?.message ?? 'Unknown error';
        return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
