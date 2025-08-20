import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react' // If URL has hash (#), show all posts 3-11-2025


/**
 * 搜索路由
 * @param {*} props
 * @returns
 */
const Search = props => {
  const { posts } = props
  const router = useRouter()
  const keyword = router?.query?.s
  const [showAllPosts, setShowAllPosts] = useState(false)

  // Check for hash in URL on client side // If URL has hash (#), show all posts 3-11-2025
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // If URL has hash (#), show all posts
      if (window.location.hash === 'home') {
        setShowAllPosts(true)
      }
    }
  }, []) // If URL has hash (#), show all posts 3-11-2025

  let filteredPosts
  // 静态过滤
  if (keyword) {
    filteredPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : ''
      const categoryContent = post.category ? post.category.join(' ') : ''
      const searchContent =
        post.title + post.summary + tagContent + categoryContent
      return searchContent.toLowerCase().includes(keyword.toLowerCase())
    })
  } else if (showAllPosts) {
    // If URL has hash (#), show all posts 3-11-2025
    filteredPosts = posts
  } else {
    filteredPosts = [] 
  }

  props = { ...props, posts: filteredPosts }

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

/**
 * 浏览器前端搜索
 */
export async function getStaticProps({ locale }) {
  const props = await getGlobalData({
    from: 'search-props',
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

export default Search
