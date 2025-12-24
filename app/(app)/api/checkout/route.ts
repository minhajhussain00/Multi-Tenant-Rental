import stripe from "@/lib/stripe";
import type Stripe from "stripe";


export async function POST(req: Request) {

    try {
        const { price, name = 'Rental', rentalId, booking_id }: {
            price?: number;
            name?: string;
            rentalId?: string;
            booking_id?: string;
        } = await req.json();
        console.log(price, name);

        if (!price || price <= 0) {
            return new Response(
                JSON.stringify({ error: "Invalid price" }),
                { status: 400 }
            );
        }

        if (!rentalId || !booking_id) {
            return new Response(
                JSON.stringify({ error: "Missing rental or booking id" }),
                { status: 400 }
            );
        }

        const amountInCents = Math.round(price * 100);
        const session = await stripe.checkout.sessions.create(
            ({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            unit_amount: amountInCents,
                            product_data: {
                                name,
                            },
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${req.headers.get("origin")}/payment/success`,
                cancel_url: `${req.headers.get("origin")}/payment/cancel`,
                metadata: {
                    rental_id: rentalId,
                    booking_id: booking_id,
                },
            } as Stripe.Checkout.SessionCreateParams)
        );

        return new Response(
            JSON.stringify({ url: session.url }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err: unknown) {

        let message = 'Unknown error';
        if (err instanceof Error) {
            message = err.message;
            console.error('Checkout POST error:', err.message);
        } else {
            console.error('Checkout POST error:', err);
            try {
                message = String(err);
            } catch {

            }
        }

        return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
