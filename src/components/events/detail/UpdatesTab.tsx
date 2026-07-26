import { useState } from "react"
import { Button } from "../../ui/button"
import { ConfirmModal } from "../../ui/confirm-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { toast } from "../../../hooks/use-toast"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import type { UpdatePost, UpdatesData } from "../../../pages/dashboard/event-detail-types"
import { PersonAvatar } from "./PersonAvatar"
import { UpdateDetailsModal } from "./UpdateDetailsModal"

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random())

function Composer({ onPost }: { onPost: (body: string) => void }) {
  const [value, setValue] = useState("")

  const submit = () => {
    if (!value.trim()) return
    onPost(value.trim())
    setValue("")
    toast({ variant: "success", title: "Update posted" })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
      <div className="flex gap-2.5">
        <PersonAvatar name="Acme" tone="orange" size={28} />
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Post an update..."
          rows={3}
          className="min-h-[72px] w-full resize-none bg-transparent text-sm leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-icon-neutral">
          <button type="button" className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-bg-default-100" aria-label="Add image">
            <EventIcon name="pic-fill" size={EVENT_ICON_SIZE.meta} />
          </button>
          <button type="button" className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-bg-default-100" aria-label="Add tag">
            <EventIcon name="flag-2-fill" size={EVENT_ICON_SIZE.meta} />
          </button>
        </div>
        <Button variant="primary" size="sm" className="rounded-[10px]" disabled={!value.trim()} onClick={submit}>
          Post
        </Button>
      </div>
    </div>
  )
}

function PostCard({
  post,
  pinned,
  onDelete,
  onOpenComments,
  onSaveEdit,
}: {
  post: UpdatePost
  pinned?: boolean
  onDelete: (post: UpdatePost) => void
  onOpenComments: (post: UpdatePost) => void
  onSaveEdit: (id: string, body: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(post.body)
  return (
    <article className="flex flex-col gap-3 border-b border-border-default-100 p-4 last:border-b-0">
      <div className="flex items-start gap-2.5">
        <PersonAvatar name={post.author} tone={post.avatarTone} size={32} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold leading-[22px] text-text-events-strong">{post.author}</span>
            {pinned ? (
              <span className="inline-flex items-center rounded bg-bg-nav-tab-active px-1.5 py-0.5 text-[10px] font-medium leading-4 text-text-nav-tab-active">
                Pinned
              </span>
            ) : null}
          </div>
          <span className="text-xs leading-5 text-text-table-header">Posted {post.timeAgo}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-text-table-header outline-none hover:bg-bg-default-100 data-[state=open]:bg-bg-default-100"
            aria-label="Post actions"
          >
            <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.tableMore} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                setDraft(post.body)
                setEditing(true)
              }}
            >
              Edit post
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-text-negative focus:bg-bg-negative-soft"
              onSelect={() => onDelete(post)}
            >
              Delete post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {editing ? (
        <div className="flex flex-col gap-2 rounded-xl border border-border-default-100 p-2.5">
          <textarea
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            className="min-h-[64px] w-full resize-none bg-transparent text-sm leading-[22px] text-text-events-strong outline-none"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="neutral"
              size="sm"
              className="h-8 min-h-8 rounded-[10px]"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="h-8 min-h-8 rounded-[10px]"
              disabled={!draft.trim()}
              onClick={() => {
                onSaveEdit(post.id, draft.trim())
                setEditing(false)
                toast({ variant: "success", title: "Update edited" })
              }}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-[22px] text-text-events-strong">{post.body}</p>
      )}

      {post.imageUrl ? (
        <img src={post.imageUrl} alt="" className="w-full rounded-xl object-cover" />
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onOpenComments(post)}
          className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border-default-100 bg-button-neutral text-sm font-medium text-text-events-strong shadow-button-neutral hover:bg-button-neutral-clicked"
        >
          <EventIcon name="arrow-up-fill" size={EVENT_ICON_SIZE.meta} />
          Reply
        </button>
        <button
          type="button"
          onClick={() => onOpenComments(post)}
          className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border-default-100 bg-button-neutral text-sm font-medium text-text-events-strong shadow-button-neutral hover:bg-button-neutral-clicked"
        >
          <EventIcon name="inbox-fill" size={EVENT_ICON_SIZE.meta} />
          Comments ({post.commentList.length})
        </button>
      </div>
    </article>
  )
}

export function UpdatesTab({
  data,
  onChange,
}: {
  data: UpdatesData
  onChange: (data: UpdatesData) => void
}) {
  const [toDelete, setToDelete] = useState<UpdatePost | null>(null)
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null)
  const commentsPost = data.rows.find((post) => post.id === commentsPostId) ?? null

  const addPost = (body: string) => {
    const post: UpdatePost = {
      id: newId(),
      author: "Acme Incorporation",
      avatarTone: "orange",
      timeAgo: "Just now",
      body,
      likes: 0,
      comments: 0,
      commentList: [],
    }
    onChange({ ...data, rows: [post, ...data.rows] })
  }

  const deletePost = (id: string) =>
    onChange({ ...data, rows: data.rows.filter((post) => post.id !== id) })

  const editPost = (id: string, body: string) =>
    onChange({
      ...data,
      rows: data.rows.map((post) => (post.id === id ? { ...post, body } : post)),
    })

  const addComment = (postId: string, text: string) =>
    onChange({
      ...data,
      rows: data.rows.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentList: [
                ...post.commentList,
                { id: newId(), author: "Acme admin", avatarTone: "orange", date: "Just now", text },
              ],
            }
          : post,
      ),
    })

  const deleteComment = (postId: string, commentId: string) =>
    onChange({
      ...data,
      rows: data.rows.map((post) =>
        post.id === postId
          ? { ...post, commentList: post.commentList.filter((c) => c.id !== commentId) }
          : post,
      ),
    })

  const addReply = (postId: string, commentId: string, text: string) =>
    onChange({
      ...data,
      rows: data.rows.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentList: post.commentList.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      replies: [
                        ...(comment.replies ?? []),
                        {
                          id: newId(),
                          author: "Acme admin",
                          avatarTone: "orange" as const,
                          date: "Just now",
                          text,
                        },
                      ],
                    }
                  : comment,
              ),
            }
          : post,
      ),
    })

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="w-full lg:w-[360px] lg:shrink-0">
        <Composer onPost={addPost} />
      </div>

      <div className="min-w-0 flex-1">
        {data.rows.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-1 rounded-2xl border border-border-default-100 bg-bg-canvas px-6 py-16 text-center">
            <p className="type-events-empty-title">No updates yet</p>
            <p className="type-events-empty-description">Share your first update with volunteers.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border-default-100 bg-bg-canvas">
            {data.rows.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                pinned={index === 0}
                onDelete={setToDelete}
                onOpenComments={(p) => setCommentsPostId(p.id)}
                onSaveEdit={editPost}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete post"
        variant="destructive"
        onConfirm={() => {
          if (toDelete) deletePost(toDelete.id)
          toast({ variant: "success", title: "Post deleted" })
        }}
      />

      <UpdateDetailsModal
        post={commentsPost}
        onClose={() => setCommentsPostId(null)}
        onAddComment={(text) => commentsPost && addComment(commentsPost.id, text)}
        onDeleteComment={(commentId) => commentsPost && deleteComment(commentsPost.id, commentId)}
        onAddReply={(commentId, text) => commentsPost && addReply(commentsPost.id, commentId, text)}
      />
    </div>
  )
}
