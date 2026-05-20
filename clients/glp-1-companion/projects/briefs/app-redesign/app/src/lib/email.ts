import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendWaitlistConfirmation(email: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping confirmation email");
    return;
  }

  await transporter.sendMail({
    from: `"GLP-1 Companion" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "You're on the list — GLP-1 Companion beta",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#FAF8F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F3;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(15,95,90,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#0F5F5A;padding:24px 32px;">
            <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">GLP-1 Companion</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#07302E;line-height:1.3;">
              You're in.
            </h1>
            <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4F4B40;">
              Thanks for signing up for the GLP-1 Companion beta. We're building the app that connects your weight, food, medication, side effects, and glucose into one timeline — so you can finally see the patterns that matter.
            </p>
            <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4F4B40;">
              We'll email you as soon as your spot opens up. No spam, no fluff — just an invite when it's ready.
            </p>
            <!-- Divider -->
            <hr style="border:none;border-top:1px solid rgba(15,95,90,0.08);margin:24px 0;" />
            <p style="margin:0;font-size:14px;line-height:1.6;color:#6F6A5C;">
              In the meantime, if you have questions or feature ideas, just reply to this email.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#F2EEE5;">
            <p style="margin:0;font-size:12px;color:#6F6A5C;text-align:center;">
              &copy; ${new Date().getFullYear()} GLP-1 Companion &middot; Not medical advice.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
