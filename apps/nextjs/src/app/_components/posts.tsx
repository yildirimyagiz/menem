"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import type { CreatePostInput } from "@acme/validators";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { CreatePostSchema } from "@acme/validators";

import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export function CreatePostForm() {
  const t = useTranslations("Posts");
  const form = useForm<CreatePostInput>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      content: "",
      title: "",
    },
  });

  const utils = api.useUtils();
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.post.invalidate();
    },
    onError: (error) => {
      return toast.error(
        error.message === "UNAUTHORIZED"
          ? t("errorUnauthorized")
          : t("errorCreatePost"),
      );
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log("[POST FORM SUBMIT]", data);
    createPost.mutate(data, {
      onError: (error) => {
        console.error("[POST CREATE ERROR]", error);
        toast.error(
          error.message === "UNAUTHORIZED"
            ? t("errorUnauthorized")
            : error.message || t("errorCreatePost"),
        );
      },
      onSuccess: (result) => {
        console.log("[POST CREATE SUCCESS]", result);
      },
    });
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder={t("title")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder={t("content")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>{t("create")}</Button>
      </form>
    </Form>
  );
}

interface Post {
  id: string;
  title: string;
  content: string;
  // add other fields if needed
}

interface PostListResponse {
  data: {
    data: Post[];
    page: number;
    limit: number;
    total: number;
  };
  meta: object;
}

export function PostList() {
  const t = useTranslations("Posts");
  const responseRaw =
    api.post.all.useSuspenseQuery()[0] as unknown as PostListResponse;
  console.log("post.all responseRaw", responseRaw);
  const posts: Post[] = Array.isArray(responseRaw.data.data)
    ? responseRaw.data.data
    : [];
  console.log("post.all posts", posts);

  if (posts.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">{t("noPostsYet")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {posts.map((p: Post) => {
        return <PostCard key={p.id} post={p} />;
      })}
    </div>
  );
}

export function PostCard(props: { post: Post }) {
  const t = useTranslations("Posts");
  const utils = api.useUtils();
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
    onError: (error) => {
      toast.error(
        error.message === "UNAUTHORIZED"
          ? t("errorUnauthorized")
          : t("errorDeleting"),
      );
    },
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { data: { code: string } }).data.code === "UNAUTHORIZED"
          ? t("errorUnauthorized")
          : t("errorUpdatePost"),
      );
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(props.post.title);
  const [editContent, setEditContent] = useState(props.post.content);

  const handleSave = () => {
    updatePost.mutate({
      id: props.post.id,
      title: editTitle,
      content: editContent,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(props.post.title);
    setEditContent(props.post.content);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-row items-center gap-4 rounded-lg bg-muted p-4">
      <div className="flex-grow">
        {isEditing ? (
          <>
            <input
              aria-label="title"
              className="mb-1 w-full rounded border px-2 py-1 text-lg font-bold text-primary outline-none"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              aria-label="content"
              className="w-full rounded border px-2 py-1 text-sm outline-none"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
            />
            <div className="mt-2 flex gap-2">
              <Button
                size="icon"
                variant="default"
                onClick={handleSave}
                title={t("save")}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
                title={t("cancel")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="flex items-center gap-1 text-2xl font-bold text-primary">
              {props.post.title}
            </h2>
            <p className="mt-2 text-sm">{props.post.content}</p>
          </>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        {!isEditing && (
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-primary/10"
            onClick={() => setIsEditing(true)}
            title={t("edit")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-destructive/10"
          onClick={() => deletePost.mutate(props.post.id)}
          title={t("delete")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2
          aria-label="title"
          className="w-1/4 rounded bg-primary text-2xl font-bold"
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
