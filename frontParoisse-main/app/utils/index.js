import { compareDesc, parseISO } from "date-fns";
export const cx = (...classNames) => classNames.filter(Boolean).join(" ");

export const sortBlogs = (blogs) => {
  if (!Array.isArray(blogs)) {
    console.error("Blogs is not an array:", blogs);
    return [];  // Ou vous pouvez retourner null ou une valeur par défaut
  }

  return blogs
    .slice()  // Crée une copie du tableau
    .sort((a, b) =>
      compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt))
    );
};
