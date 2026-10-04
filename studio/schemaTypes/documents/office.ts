import {PinIcon} from '@sanity/icons/Pin'
import {defineField, defineType} from 'sanity'
import {orderByOrderField, orderField} from './shared'

/** Listed on /contact and in the footer. The map link is `address.mapUrl`. */
export default defineType({
  name: 'office',
  title: 'Office',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'requiredLocaleString',
      description: 'e.g. "Kantor Pusat Jakarta" / "Jakarta Head Office"',
    }),
    defineField({name: 'address', title: 'Address', type: 'address'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'email'}),
    orderField,
  ],
  orderings: [orderByOrderField],
  preview: {select: {title: 'name.id', subtitle: 'address.city'}},
})
