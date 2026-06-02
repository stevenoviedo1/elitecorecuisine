import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if the API key is present.
// This prevents build failures on Vercel when the env var is not set
// (email sending is optional — currently only used for "pay online" which is disabled).
let resend = null;
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 5) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('RESEND_API_KEY is not set or invalid. Email confirmations will be skipped.');
}

// Nice branded email template for Elite Core Cuisine
function createOrderEmailHtml({ order, customer }) {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 8px 0; color: #333; font-size: 15px;">
                ${item.quantity}× ${item.name}
            </td>
            <td style="padding: 8px 0; color: #333; font-size: 15px; text-align: right; font-weight: 600;">
                $${(item.price * item.quantity).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const isDineIn = customer.orderType === 'dine-in';
    const locationLine = isDineIn 
        ? `Table ${customer.tableNumber || '—'}` 
        : 'Pickup at counter';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Elite Core Cuisine</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f8f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f5f0; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table role="presentation" width="100%" max-width="560px" cellspacing="0" cellpadding="0" style="max-width: 560px; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
                        
                        <!-- Header / Logo -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1a1a1a, #2c2c2c); padding: 32px 40px; text-align: center;">
                                <h1 style="margin:0; color: #f4c95d; font-size: 28px; font-weight: 800; letter-spacing: 1px;">
                                    ELITE CORE CUISINE
                                </h1>
                                <p style="margin: 6px 0 0; color: #d1d1d1; font-size: 14px; letter-spacing: 2px;">
                                    GOOD FOOD • GREAT MOOD
                                </p>
                            </td>
                        </tr>

                        <!-- Success Message -->
                        <tr>
                            <td style="padding: 40px 40px 20px; text-align: center;">
                                <div style="display: inline-block; background: #e6f4ea; color: #166534; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 9999px; margin-bottom: 16px;">
                                    ORDER CONFIRMED
                                </div>
                                
                                <h2 style="margin: 0 0 8px; color: #c8102e; font-size: 26px; font-weight: 800;">
                                    Thank you, ${customer.name.split(' ')[0]}!
                                </h2>
                                
                                <p style="margin: 0; color: #444; font-size: 17px;">
                                    We've received your order and will start preparing it shortly.
                                </p>
                            </td>
                        </tr>

                        <!-- Order Number -->
                        <tr>
                            <td style="padding: 0 40px 30px; text-align: center;">
                                <div style="background: #f8f5f0; border-radius: 16px; padding: 18px; display: inline-block;">
                                    <div style="font-size: 13px; color: #666; margin-bottom: 4px;">ORDER NUMBER</div>
                                    <div style="font-size: 26px; font-weight: 800; color: #c8102e; letter-spacing: 1px;">${order.id}</div>
                                </div>
                            </td>
                        </tr>

                        <!-- Order Details -->
                        <tr>
                            <td style="padding: 0 40px 30px;">
                                <div style="background: #fafafa; border-radius: 16px; padding: 24px;">
                                    <div style="font-weight: 700; color: #222; margin-bottom: 14px; font-size: 15px;">YOUR ORDER</div>
                                    
                                    <table role="presentation" width="100%" style="border-collapse: collapse;">
                                        ${itemsHtml}
                                    </table>

                                    <div style="border-top: 1px solid #e5e5e5; margin-top: 16px; padding-top: 16px; display: flex; justify-content: space-between; font-size: 17px; font-weight: 700;">
                                        <span style="color: #222;">Total</span>
                                        <span style="color: #c8102e;">$${order.total?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- Time & Location -->
                        <tr>
                            <td style="padding: 0 40px 40px;">
                                <div style="background: #f8f5f0; border-radius: 16px; padding: 20px 24px; font-size: 15px;">
                                    <div style="color: #666; margin-bottom: 6px;">
                                        ${isDineIn ? 'DINE-IN AT' : 'READY FOR PICKUP'}
                                    </div>
                                    <div style="font-weight: 700; color: #222; font-size: 16px; line-height: 1.4;">
                                        ${locationLine}
                                    </div>
                                    <div style="margin-top: 14px; color: #c8102e; font-weight: 700;">
                                        Estimated ready time: 15–25 minutes
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background: #1a1a1a; color: #aaa; padding: 24px 40px; font-size: 13px; text-align: center;">
                                <div style="margin-bottom: 8px; color: #f4c95d; font-weight: 600;">Elite Core Cuisine</div>
                                <div>1617 S Cage Blvd, Pharr, TX 78577</div>
                                <div style="margin-top: 12px; font-size: 12px; opacity: 0.7;">
                                    Questions? Call us or reply to this email.
                                </div>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

export async function POST(request) {
    try {
        const { order, customer } = await request.json();

        if (!customer?.email || !order?.id) {
            return NextResponse.json({ success: true, skipped: true });
        }

        if (!resend) {
            console.warn('Skipping email send because Resend is not configured.');
            return NextResponse.json({ success: true, skipped: true, reason: 'no-resend-key' });
        }

        const { error } = await resend.emails.send({
            from: 'Elite Core Cuisine <orders@elitecorecuisine.com>', // You can change the from address in Resend
            to: customer.email,
            subject: `Order Confirmed — #${order.id} • Elite Core Cuisine`,
            html: createOrderEmailHtml({ order, customer }),
        });

        if (error) {
            console.error('Resend email error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
