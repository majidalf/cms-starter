import { describe, expect, it } from 'vitest';
import { contactSchema, formDataToContactInput } from '@/lib/contact/schema';

const valid = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'Hello, I would like to ask about your services.',
  turnstileToken: 'token-123',
};

describe('contactSchema', () => {
  it('accepts valid input and trims whitespace', () => {
    const parsed = contactSchema.safeParse({
      ...valid,
      name: '  Jane Doe  ',
      email: '  jane@example.com  ',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe('Jane Doe');
      expect(parsed.data.email).toBe('jane@example.com');
    }
  });

  it('rejects a short name, invalid email, short message, and missing token', () => {
    const parsed = contactSchema.safeParse({
      name: 'J',
      email: 'not-an-email',
      message: 'short',
      turnstileToken: '',
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      expect(fields.name).toBeDefined();
      expect(fields.email).toBeDefined();
      expect(fields.message).toBeDefined();
      expect(fields.turnstileToken).toBeDefined();
    }
  });

  it('rejects overlong values', () => {
    const parsed = contactSchema.safeParse({
      ...valid,
      name: 'n'.repeat(101),
      message: 'm'.repeat(5001),
    });
    expect(parsed.success).toBe(false);
  });
});

describe('formDataToContactInput', () => {
  it('reads the expected fields from FormData', () => {
    const formData = new FormData();
    formData.set('name', valid.name);
    formData.set('email', valid.email);
    formData.set('message', valid.message);
    formData.set('turnstileToken', valid.turnstileToken);
    expect(formDataToContactInput(formData)).toEqual(valid);
  });

  it('yields null for missing fields so the schema rejects them', () => {
    const input = formDataToContactInput(new FormData());
    expect(contactSchema.safeParse(input).success).toBe(false);
  });
});
