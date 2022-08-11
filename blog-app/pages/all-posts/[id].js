import { API, Auth, Hub, Storage } from 'aws-amplify'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ReactMarkDown from 'react-markdown'
import '../../configureAmplify'
import { listPosts, getPost } from '../../src/graphql/queries'
import { createComment } from '../../src/graphql/mutations'
import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})
import { v4 as uuid } from 'uuid'
import { AmplifyAuthContainer } from '@aws-amplify/ui-react'

const initialState = { message: '' }

export default function Post({ post }) {
  const [signedInUser, setSignedInUser] = useState(false)
  const [coverImage, setCoverImage] = useState(null)
  const [comment, setComment] = useState(initialState)
  const [showMe, setShowMe] = useState(false)
  const router = useRouter()
  const { message } = comment

  function toggle() {
    setShowMe(!showMe)
  }

  //  check for a logged in user or not
  useEffect(() => {
    authListener()
  }, [])
  async function authListener() {
    Hub.listen('auth', data => {
      switch (data.payload.event) {
        case 'signIn':
          return setSignedInUser(true)
        case 'signOut':
          return setSignedInUser(false)
      }
    })
    try {
      await Auth.currentAuthenticatedUser()
      setSignedInUser(true)
    } catch (error) {}
  }

  useEffect(() => {
    updateCoverImage()
  }, [])
  async function updateCoverImage() {
    if (post.coverImage) {
      const imageKey = await Storage.get(post.coverImage)
      setCoverImage(imageKey)
    }
  }

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  async function createTheComment() {
    if (!message) return
    const id = uuid()
    comment.id = id
    try {
      await API.graphql({
        query: createComment,
        variables: { input: comment },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      })
    } catch (error) {
      console.log(error)
    }
    router.push('/my-posts')
  }

  return (
    <div>
      <h1 className='text-5xl mt-4 mb-4 font-semibold tracking-wide'>
        {post.title}
      </h1>
      {coverImage && <img src={coverImage} className='w-60 mt4' />}
      <p className='text-sm font-light my-4'>By {post.username}</p>
      <div className='mt-8'>
        <ReactMarkDown
          className='prose'
          // eslint-disable-next-line
          children={post.content}
        />
      </div>
      {post.comments.items.length > 0 &&
        post.comments.items.map((comment, index) => (
          <div
            key={index}
            className='rounded-lg py-8 px-8 max-w-xl mx-auto bg-white
                  shadow-lg space-y-2 sm:py-1 sm:flex my-6 mx-12 mb-6
                  sm:items-center sm:space-y-0 sm:space-x-6'
          >
            <div>
              <p className='text-gray-500 mt-2'>{comment.message}</p>
              <p className='text-gray-200 mt-1'>by {comment.createdBy}</p>
            </div>
          </div>
        ))}

      <div>
        {signedInUser && (
          <button
            onClick={toggle}
            type='button'
            className='mb-4 bg-green-600 text-white
                            font-semibold px-8 py-2 rounded-lg'
          >
            Write a Comment
          </button>
        )}

        {
          <div style={{ display: showMe ? 'block' : 'none' }}>
            <SimpleMDE
              value={comment.message}
              onChange={value =>
                setComment({
                  ...comment,
                  message: value,
                  postID: post.id,
                })
              }
            />
            <button
              onClick={createTheComment}
              type='button'
              className='mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg'
            >
              Save
            </button>
          </div>
        }
      </div>
    </div>
  )
}

// dynamically create the page at the build time
// based on the post comming from the api
export async function getStaticPaths() {
  const postData = await API.graphql({
    query: listPosts,
  })
  // create the paths
  const paths = postData.data.listPosts.items.map(post => ({
    params: { id: post.id },
  }))

  return {
    paths,
    fallback: true,
  }
}

// params:{
//   id: post.id
// }

// get the id as props
export async function getStaticProps({ params }) {
  const { id } = params
  const postData = await API.graphql({
    query: getPost,
    variables: { id: id },
  })
  // return the actual post
  return {
    props: {
      post: postData.data.getPost,
    },
    // revalidate every 1 sec
    revalidate: 1,
  }
}
