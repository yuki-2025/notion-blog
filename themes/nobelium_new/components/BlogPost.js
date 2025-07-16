import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import TagItem from './TagItem'

const BlogPost = ({ post }) => {
  const { NOTION_CONFIG } = useGlobal()
  const showPreview =
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) && post?.blockMap

  return (
    <article key={post.id} className='mb-6 md:mb-8'>
      <header className='flex flex-col justify-between md:flex-row md:items-baseline'>
        <Link href={post?.href}>
          <h2 className='text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h2>
        </Link>
        <time className='flex-shrink-0 text-gray-600 dark:text-gray-400'>
          {post?.publishDay}
        </time>
      </header>
      
      {/* 添加标签和阅读量 */}
      <div className='flex flex-wrap items-center text-sm mt-2 mb-3'>
        {post?.tags && post.tags.length > 0 && (
          <div className='flex flex-wrap mr-2'>
            {post.tags.map(tag => (
              <TagItem key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
      
      <main>
        {!showPreview && (
          <p className='hidden md:block leading-8 text-gray-700 dark:text-gray-300'>
            {post.summary}
          </p>
        )}
        {showPreview && post?.blockMap && (
          <div className='overflow-ellipsis truncate'>
            <NotionPage post={post} />
            <hr className='border-dashed py-4' />
          </div>
        )}
      </main>
    </article>
  )
}

export default BlogPost
