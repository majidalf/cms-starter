import { describe, expect, it } from 'vitest';
import { contactSchema, firstErrors, formDataToContactInput } from '@/lib/contact/schema';

const valid = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Example Ltd',
  practiceArea: 'Commercial Contracts',
  message: 'Hello, I would like to ask about your services.',
  consent: 'on',
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

  it('treats company, practice area and the spam token as optional', () => {
    const parsed = contactSchema.safeParse({
      name: valid.name,
      email: valid.email,
      message: valid.message,
      consent: 'on',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toMatchObject({ company: '', practiceArea: '', turnstileToken: '' });
    }
  });

  it('reports one error code per field: name, email, message and consent', () => {
    const parsed = contactSchema.safeParse({
      name: 'J',
      email: 'not-an-email',
      message: 'short',
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(firstErrors(parsed.error)).toEqual({
        name: 'name',
        email: 'email',
        message: 'message',
        consent: 'consent',
      });
    }
  });

  it('rejects overlong values', () => {
    const parsed = contactSchema.safeParse({
      ...valid,
      name: 'n'.repeat(101),
      message: 'm'.repeat(5001),
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(firstErrors(parsed.error)).toEqual({ name: 'tooLong', message: 'tooLong' });
    }
  });

  it('rejects line breaks in single-line fields (email header injection)', () => {
    for (const field of ['name', 'company', 'practiceArea'] as const) {
      const parsed = contactSchema.safeParse({ ...valid, [field]: 'Jane\r\nBcc: x@example.com' });
      expect(parsed.success).toBe(false);
    }
  });
});

describe('formDataToContactInput', () => {
  it('reads the expected fields from FormData', () => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(valid)) formData.set(key, value);
    expect(formDataToContactInput(formData)).toEqual(valid);
  });

  it('leaves missing fields undefined so the schema rejects them', () => {
    const input = formDataToContactInput(new FormData());
    expect(contactSchema.safeParse(input).success).toBe(false);
  });

  it('ignores file uploads posted under a text field name', () => {
    const formData = new FormData();
    formData.set('name', new File(['x'], 'x.txt'));
    expect(formDataToContactInput(formData).name).toBeUndefined();
  });
});
