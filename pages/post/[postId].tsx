import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import Post from '../../components/Post'
import { GET_POST_BY_POST_ID } from '../../graphql/queries'
import {SubmitHandler, useForm} from 'react-hook-form'
import { ADD_COMMENT } from '../../graphql/mutations'
import toast from 'react-hot-toast'
import Avatar from '../../components/Avatar'
import TimeAgo from 'react-timeago'

type FormData = {
    comment: string
    id: number
    username: string
}
function PostPage() {
    var _a;
    const router = useRouter();
    const { data: session } = useSession();
    const [addComment] = useMutation(ADD_COMMENT, {
        refetchQueries: [GET_POST_BY_POST_ID, 'getPostListByPostId'],
    });
    const { data, error } = useQuery(GET_POST_BY_POST_ID, {
        variables: {
            post_id: router.query.postId,
        }
    });
    const post = data === null || data === void 0 ? void 0 : data.getPostListByPostId;
    const { register, handleSubmit, watch, setValue, formState: { errors }, } = useForm();
    const onSubmit = async (data: any) => {
        var _a;
        console.log(data);
        const notification = toast.loading('Posting comment');
        await addComment({
            variables: {
                post_id: router.query.postId,
                username: (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.name,
                text: data.comment
            },
        });
        setValue('comment', '');
        toast.success('Comment post', {
            id: notification,
        });
    };
    console.log(data);

  return (
    <div className='mx-auto my-7 max-w-5xl'>
        <Post post={post}/>

        <div className="-mt-1 pl-16 rounded-b-md border border-t-0 border-gray-300 bg-white p-5">
            <p className='text-sm'>
                Comment as <span className='text-red-500'>{session?.user?.name}</span>
            </p>

            <form
            className='flex flex-col space-y-2'
            onSubmit={handleSubmit(onSubmit)}
            >
                <textarea
                {...register('comment')}
                disabled={!session}
                className='h-24 rounded-md border-gray-200 border p-2 pl-4 outline-none disabled:bg-gray-50'
                placeholder={
                    session
                    ? 'Your comment'
                    : "Please sign"
                } />

                <button className='rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200' type='submit'>
                    Comment
                </button>
            </form>
        </div>

        <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10">
            <hr className='py-2' />
            
            {post?.comments.map((comment: any) => (
            <div
                className='relative flex items-center space-x-2 space-y-5'
                key={ comment.id }
            >
            <hr className='absolute top-10 left-7 z-0 h-16 border' />
            <div className="z-50">
                <Avatar seed={comment.username}/>
            </div>

            <div className="flex flex-col">
                <p className='py-2 text-xs text-gray-400'>
                    <span className='font-semibold text-gray-600'>{comment.username} </span>
                    <TimeAgo date={comment.created_at} />
                </p>
                <p>{comment.text}</p>
            </div>
            </div>
            ))}
        </div>
    </div>
  )
}

export default PostPage
