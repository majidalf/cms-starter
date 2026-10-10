# Implementation Plan: Contact Form (Resend + Turnstile)

## Objective
Implement a robust, secure contact form module in `cms-starter` (`web/`) with Resend API for email delivery and Cloudflare Turnstile for spam protection.

## Steps
1. **Create Validation Schema**: Use Zod for validating name, email, message, and turnstile token.
2. **Create Server Action (`web/app/actions/contact.ts`)**:
   - Verify Cloudflare Turnstile token.
   - Send email via Resend API (`resend.emails.send`).
   - Return success/error status.
3. **Create Contact Form Component (`web/components/forms/ContactForm.tsx`)**:
   - Form inputs with Tailwind CSS v4 styling.
   - Cloudflare Turnstile widget integration.
   - Loading and success/error feedback states.
4. **Integration Page**: Add or embed the form into a contact page or section.
5. **Quality Gates Check**: Run `npm run lint`, `npm run typecheck`, and `npm run test` inside `web/`.
