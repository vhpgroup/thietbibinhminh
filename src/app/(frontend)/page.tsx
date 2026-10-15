import { HomeExperience } from '@/components/HomeExperience'
import { getBanners, getProducts } from '@/lib/storefront'

export default async function HomePage() {
  const [banners, products] = await Promise.all([getBanners(), getProducts()])
  return <HomeExperience banners={banners} products={products} />
}
