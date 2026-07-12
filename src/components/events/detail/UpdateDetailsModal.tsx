import { useState } from "react"
import { ImageIcon, MoreHorizontal, Reply } from "lucide-react"
import { Button } from "../../ui/button"
import { Modal } from "../../ui/modal"
import { ConfirmModal } from "../../ui/confirm-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { toast } from "../../../hooks/use-toast"
import type { UpdateComment, UpdatePost } from "../../../pages/dashboard/event-detail-types"
import { PersonAvatar } from "./PersonAvatar"

export function UpdateDetailsModal({
  post,
  onClose,
  onAddComment,
  onDeleteComment,
  onAddReply,
}: {
  post: UpdatePost | null
  onClose: () => void
  onAddComment: (text: string) => void
  onDeleteComment: (commentId: string) => void
  onAddReply: (commentId: string, text: string) => void
}) {
  const [reply, setReply] = useState("")
  const [toDelete, setToDelete] = useState<UpdateComment | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState("")

  if (!post) return null

  const submitReply = (commentId: string) => {
    if (!replyDraft.trim()) return
    onAddReply(commentId, replyDraft.trim())
    toast({ variant: "success", title: "Reply posted" })
    setReplyDraft("")
    setReplyingTo(null)
  }

  return (
    <Modal open={Boolean(post)} onClose={onClose} size="full" title="Update details" flushBody className="max-h-[92vh]">
      <div className="flex flex-col md:flex-row">
        {/* Post panel */}
        <div className="flex flex-col gap-3 border-b border-border-default-100 p-6 md:w-[320px] md:shrink-0 md:border-b-0 md:border-r">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt="" className="w-full rounded-xl object-cover" />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#e6d8ff] via-[#f2e7ff] to-[#ffe4cf]">
              <ImageIcon className="size-8 text-white/70" aria-hidden />
            </div>
          )}
          <p className="text-sm leading-[22px] text-text-events-strong">{post.body}</p>
          <p className="text-xs leading-5 text-text-table-header">Posted {post.timeAgo}</p>
        </div>

        {/* Comments */}
        <div className="flex flex-1 flex-col gap-4 bg-bg-on-canvas p-6">
          <div className="flex flex-col gap-3 rounded-xl border border-border-default-100 bg-bg-canvas p-3">
            <div className="flex gap-2.5">
              <PersonAvatar name="Acme" tone="orange" size={28} />
              <textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Post an update..."
                rows={2}
                className="min-h-[48px] w-full resize-none bg-transparent text-sm leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder"
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                className="rounded-[10px]"
                disabled={!reply.trim()}
                onClick={() => {
                  onAddComment(reply.trim())
                  toast({ variant: "success", title: "Comment posted" })
                  setReply("")
                }}
              >
                Post
              </Button>
            </div>
          </div>

          <p className="text-sm font-[510] leading-[22px] text-text-events-strong">
            {post.commentList.length} comments
          </p>

          <div className="flex flex-col gap-4">
            {post.commentList.map((comment) => (
              <div key={comment.id} className="flex gap-2.5">
                <PersonAvatar name={comment.author} tone={comment.avatarTone} size={32} />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-[22px] text-text-events-strong">
                        {comment.author}
                      </span>
                      <span className="text-xs leading-5 text-text-table-header">
                        Commented on {comment.date}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-table-header outline-none hover:bg-bg-default-100 data-[state=open]:bg-bg-default-100"
                        aria-label="Comment actions"
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-text-negative focus:bg-bg-negative-soft"
                          onSelect={() => setToDelete(comment)}
                        >
                          Delete comment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm leading-[22px] text-text-events-strong">{comment.text}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo((current) => (current === comment.id ? null : comment.id))
                      setReplyDraft("")
                    }}
                    className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-border-default-100 bg-button-neutral px-2.5 py-1 text-xs font-[510] text-text-events-strong shadow-button-neutral hover:bg-button-neutral-clicked"
                  >
                    <Reply className="size-3.5" />
                    Reply
                  </button>

                  {replyingTo === comment.id ? (
                    <div className="mt-1 flex flex-col gap-2 rounded-xl border border-border-default-100 bg-bg-canvas p-2.5">
                      <textarea
                        autoFocus
                        value={replyDraft}
                        onChange={(event) => setReplyDraft(event.target.value)}
                        placeholder={`Reply to ${comment.author}...`}
                        rows={2}
                        className="min-h-[40px] w-full resize-none bg-transparent text-sm leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="neutral"
                          size="sm"
                          className="h-8 min-h-8 rounded-[10px]"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyDraft("")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-8 min-h-8 rounded-[10px]"
                          disabled={!replyDraft.trim()}
                          onClick={() => submitReply(comment.id)}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {comment.replies && comment.replies.length > 0 ? (
                    <div className="mt-2 flex flex-col gap-3 border-l border-border-default-100 pl-3">
                      {comment.replies.map((child) => (
                        <div key={child.id} className="flex gap-2.5">
                          <PersonAvatar name={child.author} tone={child.avatarTone} size={28} />
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="text-sm font-semibold leading-[22px] text-text-events-strong">
                              {child.author}
                            </span>
                            <span className="text-xs leading-5 text-text-table-header">
                              Commented on {child.date}
                            </span>
                            <p className="text-sm leading-[22px] text-text-events-strong">{child.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete comment"
        description="Are you sure you want to delete this comment?"
        confirmLabel="Delete comment"
        variant="destructive"
        onConfirm={() => {
          if (toDelete) onDeleteComment(toDelete.id)
          toast({ variant: "success", title: "Comment deleted" })
        }}
      />
    </Modal>
  )
}
