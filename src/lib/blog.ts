import {
  getCollection,
  type CollectionEntry
} from "astro:content";

type BlogPost =
  CollectionEntry<"blog">;

export type GroupedPosts =
  Record<string, BlogPost[]>;

export async function getGroupedPosts() {
  const posts =
    await getCollection(
      "blog",
      ({ data }) =>
        !data.draft
    );

  return posts.reduce<GroupedPosts>(
    (acc, post) => {
      const category =
        post.id.split("/")[0];

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(post);

      return acc;
    },
    {}
  );
}