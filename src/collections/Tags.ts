import type { CollectionConfig } from 'payload'

export const createTags = (): CollectionConfig => ({
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  tags: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
})
