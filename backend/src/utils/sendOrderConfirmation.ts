import { getResend } from "../config/resend";
import type { Order } from "../models/Order";

const FROM = process.env.RESEND_FROM_EMAIL ?? "The Cake Atelier <onboarding@resend.dev>";

function formatItemsHtml(items: Order["items"]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0;">${item.name}${item.size ? ` (${item.size}${item.flavor ? `, ${item.flavor}` : ""})` : ""} × ${item.quantity}</td>
          <td style="padding: 8px 0; text-align: right;">£${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  name: string;
  order: Order & { _id: unknown };
}) {
  const { to, name, order } = params;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #b8456b;">🍰 The Cake Atelier</h1>
      <p>Hi ${name},</p>
      <p>Thanks for your order! Here's a summary:</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${formatItemsHtml(order.items)}
        <tr style="border-top: 1px solid #ddd; font-weight: bold;">
          <td style="padding: 8px 0;">Total</td>
          <td style="padding: 8px 0; text-align: right;">£${order.totalAmount.toFixed(2)}</td>
        </tr>
      </table>
      <p>
        Delivery on <strong>${new Date(order.deliveryDate).toLocaleDateString()}</strong>
        to ${order.deliveryAddress}.
      </p>
      <p style="color: #777; font-size: 14px;">Order reference: ${String(order._id)}</p>
    </div>
  `;

  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Your Cake Atelier order confirmation",
    html,
  });
}
