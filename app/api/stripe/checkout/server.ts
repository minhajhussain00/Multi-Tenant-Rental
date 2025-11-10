import stripe from "@/lib/stripe";

export async function POST(req: Request) {
    const { price , name } = await req.json();

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: name,
                    },
                    unit_amount: price,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/payment/success`,
        cancel_url: `${req.headers.get('origin')}/payment/cancel`,
    });

    return new Response(
        JSON.stringify({ sessionId: session.id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}