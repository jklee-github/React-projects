import { withAuthenticator } from '@aws-amplify/ui-react'
import { useState, useRef, React } from 'react'
import { API, Auth, Storage } from 'aws-amplify'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import { createPost } from '../src/graphql/mutations'
// SimpleMDE have issue with SSR so we use dynamic
// import SimpleMDE from "react-simplemde-editor"
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})
import 'easymde/dist/easymde.min.css'
import dynamic from 'next/dynamic'

const initialState = { title: '', content: '' }
function CreatePost() {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()
  const [image, setImage] = useState(null)
  // hold the img info
  const imageFileInput = useRef(null)

  function onChange(e) {
    setPost(() => ({
      ...post,
      [e.target.name]: e.target.value,
    }))
  }

  async function createNewPost() {
    if (!title || !content) return
    const id = uuid()
    const { username } = await Auth.currentAuthenticatedUser()
    post.id = id
    post.username = username

    // check if there is image
    if (image) {
      const filename = `${image.name}_${uuid()}`
      post.coverImage = filename
      await Storage.put(filename, image)
    }

    await API.graphql({
      query: createPost,
      // what is the input
      variables: { input: post },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })
    router.push(`/posts/${id}`)
  }

  async function uploadImage() {
    imageFileInput.current.click()
  }

  function handleChange(e) {
    const fileUploaded = e.target.files[0]
    if (!fileUploaded) return
    setImage(fileUploaded)
  }
  return (
    <div>
      <h1 className='text-3xl font-semibold tracking-wide'>Create new Post</h1>
      <input
        onChange={onChange}
        name='title'
        placeholder='Title'
        value={post.title}
        className='border-b pb-2 text-lg my-4
                 focus:outline-none w-full font-light text-gray-500'
      />
      {/* show the uploaded img */}
      {image && (
        <img
          width='500px'
          alt='picture'
          src={URL.createObjectURL(image)}
          className='my-4'
        />
      )}
      <SimpleMDE
        value={post.content}
        onChange={value => setPost({ ...post, content: value })}
      />
      {/* upload file run in backend */}
      <input
        type='file'
        ref={imageFileInput}
        className='absolute w-0 h-0'
        onChange={handleChange}
      />
      <button
        type='button'
        className='m-2 mb-4 bg-green-600 text-white font-semibold 
                px-8 py2 rounded-lg'
        onClick={uploadImage}
      >
        Upload Cover Image
      </button>
      <button
        type='button'
        className='m-2 mb-4 bg-blue-600 text-white font-semibold 
                px-8 py2 rounded-lg'
        onClick={createNewPost}
      >
        Create Post
      </button>
    </div>
  )
}
export default withAuthenticator(CreatePost)
