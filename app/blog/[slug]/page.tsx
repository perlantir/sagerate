import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BLOG_POSTS } from "@/lib/constants/content";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  return post ? { title: post.title, description: post.description } : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="bg-surface py-14">
        <article className="container-page max-w-3xl rounded-lg bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl font-bold text-navy">{post.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{post.description}</p>
          <p className="mt-8 leading-8 text-slate-700">{post.body}</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
