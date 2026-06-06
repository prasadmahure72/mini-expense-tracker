import { getCategoryMeta } from '@/utils/constants'

export default function CategoryBadge({ category }) {
  const meta = getCategoryMeta(category)
  return (
    <span className={`badge ${meta.bg}`}>
      {meta.label}
    </span>
  )
}
