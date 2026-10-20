import { HomeExperience } from '@/components/HomeExperience'
import { HomeNews } from '@/components/HomeNews'
import { getBanners, getHomeContent, getHomeCategories, getPosts } from '@/lib/storefront'

export const metadata = { alternates: { canonical: '/' } }

export default async function HomePage() {
  const [banners, content, categories, posts] = await Promise.all([getBanners(), getHomeContent(), getHomeCategories(), getPosts()])
  return <HomeExperience banners={banners} deals={content.deals} sections={content.sections} categories={categories} news={<HomeNews posts={posts} />} />
}
