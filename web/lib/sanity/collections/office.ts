import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from '../client';

export const OFFICES_QUERY = defineQuery(`*[_type == "office"]
  | order(coalesce(order, 9999) asc, name.id asc){ _id, name, kind, address, phone, email, hours }`);

export const getOffices = cache(() => sanityClient.fetch(OFFICES_QUERY));
