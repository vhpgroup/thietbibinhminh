export type CategoryNode = { id: number; parent?: number | { id: number } | null }

export function descendantIds(categories: CategoryNode[], id: number): number[] {
  const found = new Set<number>([id])
  let changed = true
  while (changed) {
    changed = false
    for (const category of categories) {
      const parent = typeof category.parent === 'object' ? category.parent?.id : category.parent
      if (parent && found.has(parent) && !found.has(category.id)) {
        found.add(category.id)
        changed = true
      }
    }
  }
  return [...found]
}
