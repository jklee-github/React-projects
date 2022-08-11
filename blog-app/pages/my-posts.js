import { API, Auth, Storage } from 'aws-amplify'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { postByUsername } from '../src/graphql/queries'
import Moment from 'moment'
import { deletePost as deletePostMutation } from '../src/graphql/mutations'

export default function MyPosts() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])
  async function fetchPosts() {
    const { username } = await Auth.currentUserPoolUser()
    const postData = await API.graphql({
      query: postByUsername,
      variables: { username },
    })
    // get img thumbnails
    const { items } = postData.data.postByUsername
    // fetch imgs from S3
    const postWithImages = await Promise.all(
      items.map(async post => {
        if (post.coverImage) {
          post.coverImage = await Storage.get(post.coverImage)
        }
        return post
      })
    )
    // setPosts(postData.data.postByUsername.items)
    setPosts(postWithImages)
  }

  async function deletePost(id) {
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })
    fetchPosts()
  }
  return (
    <div>
      {posts.map((post, index) => (
        <div
          key={index}
          className='border rounded-lg bg-white shadow-md m-2 p-4  text-center space-y-2 sm:text-left'
        >
          {post.coverImage && (
            <img
              src={post.coverImage}
              className='w-36 h36 bg-contain bg-center
                                     rounded-full sm:mx-0 sm:shrink-0'
            />
          )}
          <p className='text-lg text-black font-semibold'>{post.title}</p>
          <p className='text-slate-500 font-medium'>
            Created on:{Moment(post.createdAt).format('ddd, MMM hh:mm a')}
          </p>
          <div className='flex space-x-4'>
            <span className='border-2 py-1.5 px-2 rounded-full'>
              <Link href={`/edit-post/${post.id}`}> Edit Post</Link>
            </span>
            <span className='border-2 py-1.5 px-2 rounded-full'>
              <Link href={`/all-posts/${post.id}`}>View Post</Link>
            </span>
            <button
              onClick={() => deletePost(post.id)}
              className='border-2 py-1.5 px-2 rounded-full'
            >
              Delete Post
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
