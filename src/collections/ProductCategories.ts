import type { CollectionConfig } from 'payload'
import { cacheTags, revalidateCollection, revalidateCollectionDelete } from '@/lib/cache-tags'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: 'Danh mục sản phẩm', plural: 'Danh mục sản phẩm' },
  admin: {
    group: 'Cửa hàng',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [async ({ data, originalDoc, req }) => {
      if (!data || !('parent' in data)) return data
      let parent = typeof data.parent === 'object' ? data.parent?.id : data.parent
      let depth = 1
      const visited = new Set<string>()
      while (parent) {
        const key = String(parent)
        if (key === String(originalDoc?.id) || visited.has(key)) throw new Error('Danh mục cha tạo vòng lặp.')
        visited.add(key)
        depth++
        const ancestor = await req.payload.findByID({ collection: 'product-categories', id: parent, depth: 0, req })
        const next = ancestor.parent
        parent = typeof next === 'object' ? next?.id : next
      }
      if (depth > 4) throw new Error('Danh mục chỉ được có tối đa 4 cấp.')
      if (originalDoc?.id) {
        const all = await req.payload.find({ collection: 'product-categories', limit: 10000, depth: 0, req })
        const childDepth = (id: number, seen = new Set<number>()): number => {
          if (seen.has(id)) throw new Error('Cây danh mục có vòng lặp.')
          const nextSeen = new Set(seen).add(id)
          const children = all.docs.filter((item) => (typeof item.parent === 'object' ? item.parent?.id : item.parent) === id)
          return children.length ? 1 + Math.max(...children.map((item) => childDepth(item.id, nextSeen))) : 0
        }
        if (depth + childDepth(originalDoc.id) > 4) throw new Error('Chuyển nhóm này sẽ làm danh mục con vượt quá 4 cấp.')
      }
      return data
    }],
    beforeDelete: [async ({ id, req }) => {
      const [children, products] = await Promise.all([
        req.payload.count({ collection: 'product-categories', where: { parent: { equals: id } }, req }),
        req.payload.count({ collection: 'products', where: { or: [{ category: { equals: id } }, { secondaryCategories: { contains: id } }] }, req }),
      ])
      if (children.totalDocs || products.totalDocs) throw new Error('Hãy chuyển danh mục con và sản phẩm trước khi xóa.')
    }],
    afterChange: [revalidateCollection(cacheTags.products)],
    afterDelete: [revalidateCollectionDelete(cacheTags.products)],
  },
  fields: [
    { name: 'sourceURL', label: 'Đường dẫn danh mục nguồn', type: 'text' },
    { name: 'name', label: 'Tên danh mục', type: 'text', required: true },
    { name: 'slug', label: 'Đường dẫn', type: 'text', required: true, unique: true, index: true },
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    { name: 'parent', label: 'Danh mục cha', type: 'relationship', relationTo: 'product-categories', index: true },
    { name: 'showInMenu', label: 'Hiện trong menu', type: 'checkbox', defaultValue: true },
    { name: 'seoTitle', label: 'Tiêu đề SEO', type: 'text' },
    { name: 'seoDescription', label: 'Mô tả SEO', type: 'textarea' },
    { name: 'indexable', label: 'Cho phép lập chỉ mục', type: 'checkbox', defaultValue: true },
    { name: 'icon', label: 'Tên biểu tượng', type: 'text' },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0 },
  ],
}
