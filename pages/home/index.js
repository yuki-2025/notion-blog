import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * Home route that mirrors search functionality
 * @param {*} props
 * @returns
 */
const Home = props => {
  const { posts } = props
  const [showAllPosts, setShowAllPosts] = useState(true)

  // Always show all posts on the home page
  useEffect(() => {
    setShowAllPosts(true)
  }, [])

  // Filter posts (showing all by default)
  let filteredPosts = showAllPosts ? posts : []
  props = { ...props, posts: filteredPosts }

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

/**
 * Server-side data fetching
 */
export async function getStaticProps({ locale }) {
  const props = await getGlobalData({
    from: 'home-props',
    locale
  })
  const { allPages } = props
  props.posts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Home
