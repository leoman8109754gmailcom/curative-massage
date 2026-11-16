// Sanity Studio schema: one document per massage technique.
// The website's Services and Booking pages read these (see src/lib/treatments.js).

export default {
  name: 'treatment',
  title: 'Massage technique',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Name',
      type: 'string',
      description: 'e.g. Swedish Massage',
      validation: (Rule) => Rule.required().max(40),
    },
    {
      name: 'slug',
      title: 'Web address name',
      type: 'slug',
      description: 'Used in booking links. Click "Generate" after typing the name.',
      options: { source: 'title', maxLength: 60 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown on the Services and Booking pages.',
      validation: (Rule) => Rule.required().max(240),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Written exactly as it should appear, e.g. "$60–$135" or "From $80".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers show first (1, 2, 3 …).',
      initialValue: 10,
    },
    {
      name: 'visible',
      title: 'Show on website',
      type: 'boolean',
      description: 'Turn off to hide a technique without deleting it.',
      initialValue: true,
    },
  ],
  orderings: [{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', price: 'price', visible: 'visible' },
    prepare: ({ title, price, visible }) => ({
      title,
      subtitle: `${price ?? ''}${visible === false ? ' · hidden' : ''}`,
    }),
  },
}
