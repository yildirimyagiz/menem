"use client";

import type { RouterOutputs } from "@reservatior/api";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"; // Updated import for Heroicons v2

import { cn } from "@reservatior/ui";
import { Button } from "@reservatior/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@reservatior/ui/form";
import { Input } from "@reservatior/ui/input";
import { CreatePostSchema } from "@reservatior/validators";

import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export function CreatePostForm() {
  const form = useForm({
    schema: CreatePostSchema,
    defaultValues: {
      content: "",
      title: "",
    },
  });

  const utils = api.useUtils();

  // Check if createPost exists before calling useMutation
  const createPost = api.post.create.useMutation({
    onSuccess: async (newPost) => {
      form.reset();
      // Directly update Zustand store
      usePostStore.getState().addPost(newPost);
      await utils.post.invalidate();
      toast.success("Post created successfully!");
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.error(
        err instanceof Error && err.message === "UNAUTHORIZED"
          ? "You must be logged in to post"
          : "Failed to create post",
      );
    },
  });

  const handleSubmit = (data: { title: string; content: string }) => {
    createPost.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Title" required />
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
                <Input {...field} placeholder="Content" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createPost.status === "pending"}>
          {createPost.status === "pending" ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}

export function PostList() {
  const { posts, isLoading } = usePostStore();
  const { data } = api.post.all.useQuery();

  useEffect(() => {
    if (data) {
      usePostStore.setState({ posts: data, isLoading: false });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No posts yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {posts.map((p: RouterOutputs["post"]["all"][number]) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}

export function UpdatePostForm({
  post,
}: {
  post: RouterOutputs["post"]["all"][number];
}) {
  const form = useForm({
    schema: CreatePostSchema,
    defaultValues: {
      content: post.content,
      title: post.title,
    },
  });

  const utils = api.useUtils();
  const updatePost = api.post.update.useMutation({
    onSuccess: async (updatedPost) => {
      form.reset();
      const posts = usePostStore.getState().posts;
      usePostStore.setState({
        posts: posts.map(
          (p: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
          }) =>
            p.id === updatedPost.id
              ? {
                  ...p,
                  ...updatedPost,
                  createdAt: p.createdAt,
                  updatedAt: p.updatedAt,
                }
              : p,
        ),
      });
      await utils.post.invalidate();
      toast.success("Post updated successfully!");
    },
    onError: (err) => {
      console.error(err);
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to update a post"
          : "Failed to update post",
      );
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit((data) => {
          updatePost.mutate({ id: post.id, ...data });
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Title" />
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
                <Input {...field} placeholder="Content" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}

export function PostCard(props: {
  post: RouterOutputs["post"]["all"][number];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const utils = api.useUtils();
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      const posts = usePostStore
        .getState()
        .posts.filter((post: { id: string }) => post.id !== props.post.id);
      usePostStore.setState({ posts });
      await utils.post.invalidate();
      toast.success("Post deleted successfully!");
    },
    onError: (err) => {
      console.error(err);
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to delete a post"
          : "Failed to delete post",
      );
    },
  });

  return (
    <div className="rounded-lg bg-muted p-4">
      <div className="flex flex-row">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-primary">
            {props.post.title}
          </h2>
          <p className="mt-2 text-sm">{props.post.content}</p>
        </div>
        <div className="flex flex-col justify-between">
          <Button
            variant="ghost"
            className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            <PencilIcon className="mr-1 inline h-5 w-5" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer text-sm font-bold uppercase text-red-600 hover:bg-transparent hover:text-white"
            onClick={() => deletePost.mutate(props.post.id)}
          >
            <TrashIcon className="mr-1 inline h-5 w-5" />
            Delete
          </Button>
        </div>
      </div>
      {isEditing && (
        <div className="mt-4 border-t pt-4">
          <UpdatePostForm post={props.post} />
        </div>
      )}
    </div>
  );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-1/4 rounded bg-primary text-2xl font-bold",
            pulse && "animate-pulse",
          )}
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
