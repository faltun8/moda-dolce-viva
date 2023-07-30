import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        allow_promotion_codes: true,
        payment_method_types: ['card', 'blik', 'p24', 'paypal'],
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "KE", "PL"],
        },
        billing_address_collection: 'auto',
        shipping_options: [

          //PRODUCTION

          // fast shipping
          { shipping_rate: 'shr_1NZbPBJMV9Ri69E2UUFRuCk6' },
          // standart shipping
          { shipping_rate: 'shr_1NZbOzJMV9Ri69E2QUIUYbrO' },

          //TEST

          //fast shipping
          // { shipping_rate: 'shr_1NZVAwJMV9Ri69E2sHFl2cpL' },
          //standart shipping
          // { shipping_rate: 'shr_1NZVAeJMV9Ri69E2hLGlS95I' },
        ],
        line_items: req.body.map((item) => {
          const img = item.image[0].asset._ref;
          const newImage = img.replace('image-', 'https://cdn.sanity.io/images/y9ligf3f/production/').replace('-webp', '.webp');

          return {
            price_data: { 
              currency: 'pln',
              product_data: { 
                name: item.name,
                description: `Size: ${item.selectedSize}`,
                images: [newImage],
                metadata: {
                  test: item._id,
                },
              },
              unit_amount: (item.discount ? (item.price - item.price * item.discount / 100) : item.price) * 100,
            },
            adjustable_quantity: {
              enabled:true,
              minimum: 1,
            },
            quantity: item.quantity
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}