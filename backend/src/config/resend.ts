import { Resend } from "resend";

let resend: Resend | undefined;

export function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  return (resend ??= new Resend(process.env.RESEND_API_KEY));
}
