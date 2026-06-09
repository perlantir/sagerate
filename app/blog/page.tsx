import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BLOG_POSTS } from "@/lib/constants/content";

export const metadata: Metadata = { title: "Professional Mortgage Guides", description: "Guides for professional mortgage loan comparison." };

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="bg-surface py-14">
        <div className="container-page">
          <h1 className="text-4xl font-bold text-navy">Professional mortgage guides</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-gold">
                <h2 className="text-xl font-bold text-navy">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
