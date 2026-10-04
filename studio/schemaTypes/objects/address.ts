import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({name: 'street', title: 'Street', type: 'text', rows: 2}),
    defineField({name: 'city', title: 'City', type: 'string'}),
    defineField({name: 'province', title: 'Province / state', type: 'string'}),
    defineField({name: 'postalCode', title: 'Postal code', type: 'string'}),
    defineField({name: 'country', title: 'Country', type: 'string', initialValue: 'Indonesia'}),
    defineField({
      name: 'mapUrl',
      title: 'Map URL',
      type: 'url',
      description: 'Google Maps share link.',
    }),
  ],
})
