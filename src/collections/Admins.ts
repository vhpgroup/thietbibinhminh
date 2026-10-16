import type { Access, CollectionConfig } from 'payload'

const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'
const isPayloadAdminOrFirstUser: Access = async ({ req }) => {
  if (req.user?.collection === 'admins') return true
  const { totalDocs } = await req.payload.count({ collection: 'admins', overrideAccess: true })
  return totalDocs === 0
}

export const Admins: CollectionConfig = {
  slug: 'admins',
  access: {
    create: isPayloadAdminOrFirstUser,
    delete: isPayloadAdmin,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
