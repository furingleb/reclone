import { FC, useCallback } from "react";
import { useMutation } from "react-query";
import { DELETE_POST } from "../graphql/api/posts.graphql";
import { request } from "../graphql/custom-gql-fns";
import { Post } from "@/src/molecules";
import { qc } from "@/src/react-query/setup";
import { useUserStore } from "../store/user.store";
import { IPostMinimal } from "../types";

export const PostsSection: FC<{ posts: IPostMinimal[] }> = ({ posts }) => {
  const username = useUserStore((state) => state.user?.username);
  const deletePostMutation = useMutation(async (postId: number) => {
    return request(DELETE_POST, { postId });
  });

  const onDeletePost = useCallback(
    (postId: number) => {
      deletePostMutation.mutate(postId, {
        onSuccess() {
          qc.invalidateQueries("posts");
        },

        onError(err) {
          console.log(err);
        },
      });
    },
    [deletePostMutation]
  );

  return (
    <div className="flex flex-col gap-2">
      {posts &&
        posts?.map((p) => (
          <Post
            key={p.id}
            isOwner={p.user.username === username}
            onDeletePost={onDeletePost}
            {...p}
          />
        ))}
    </div>
  );
};
