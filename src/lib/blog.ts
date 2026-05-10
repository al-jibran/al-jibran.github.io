import {
  getCollection,
} from "astro:content";

export async function getGroupedPosts() {
  const posts =
    await getCollection(
      "blog",
      ({ data }) =>
        !data.draft
    );

  return posts.reduce(
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