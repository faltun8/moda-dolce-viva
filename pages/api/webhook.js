import { transporter } from '../../lib/nodemailer';
import { Stripe } from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SIGNING_SECRET, {
    apiVersion: '2020-08-27',
});


export const config = {
    api: {
        bodyParser: false, // We'll handle the raw body parsing ourselves
    },
};

const webhookHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const rawBody = await buffer(req);

    const payload = JSON.parse(rawBody);

    const eventType = payload.type;

    if (eventType === 'checkout.session.completed') {
        const customerEmail = payload.data.object.customer_details.email;
        const customerName = payload.data.object.customer_details.name; 

        await sendEmailToCustomer(customerEmail, customerName);
    }

    res.status(200).json({ received: true });
};



const sendEmailToCustomer = async (customerEmail, customerName) => {
    // Email content
    const emailContent = {
        from: 'info@modadolceviva.pl', // Sender address
        to: customerEmail, 
        subject: 'Thank you for your purchase!',
        text: `Thank you for your purchase!`, 
        html: `<!DOCTYPE html>
        <html>
            <head>
                <title>Thank You for Your Order!</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center;">
                        <img src="https://modadolceviva.pl/logo.jpg" alt="Moda Dolce VIva" style="max-width: 150px;">
                    </div>
                    <h2 style="color: #333;">Thank You for Your Order!</h2>
                    <p style="font-size: 16px; color: #555;">Hi ${customerName}!</p>
                    <p style="font-size: 16px; color: #555;">We appreciate your recent order and hope you are excited to receive your new items.</p>
                    <p style="font-size: 16px; color: #555;">As a token of our gratitude, here's a special discount code for 10% off your next purchase:</p>
                    <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                        <strong style="font-size: 18px; color: #333;">DISCOUNT CODE:</strong>
                        <br>
                        <span style="font-size: 24px; color: #f00;">THANKYOU10</span>
                    </div>
                    <p style="font-size: 16px; color: #555;">Use the discount code during checkout to avail the discount.</p>
                    <p style="font-size: 16px; color: #555;">We hope you have a great shopping experience with us. If you have any questions or need assistance, feel free to reach out to our support team.</p>
                    <p style="font-size: 16px; color: #555;">Thank you once again for choosing our store. We look forward to serving you in the future.</p>
                    <p style="font-size: 16px; color: #555;">Best regards,</p>
                    <p style="font-size: 16px; color: #555;">Moda Dolce Viva Team</p>
                </div>
            </body>
        </html>
        `,
    };

    // Send the email
    try {
        await transporter.sendMail(emailContent);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


export default webhookHandler;
