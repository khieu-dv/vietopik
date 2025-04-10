"use client"; // Bắt buộc để sử dụng useTranslation()

import { ArrowRight, Clock, MessageCircle, ShoppingBag, Star, ThumbsUp, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Footer } from "~/ui/components/footer";
import { Header } from "~/ui/components/header";
import { TopicCard } from "~/ui/components/product-card";
import { TestimonialCarousel } from "~/ui/components/testimonial-carousel";
import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/ui/primitives/card";
import { desc } from "drizzle-orm";
import { useTranslation } from "react-i18next";
import { ContactButton } from "./components/contact-button";

// Simple post card component specifically for the homepage
interface Post {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: string;
  author: { name: string; avatar: string };
  likes: number;
  commentCount: number;
  tags: string[];
}

function PostCardSimple({ post }: { post: Post }) {
  return (
    <Card className="min-w-[300px] w-[350px] overflow-hidden transition-all duration-200 hover:shadow-md">
      {post.coverImage && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 text-sm">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </div>
        </div>
        <Link href={`/posts/${post.id}`} className="flex items-center gap-1 text-sm font-medium text-primary">
          Read more <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    coverImage: string;
    author: { name: string; avatar: string };
    likes: number;
    commentCount: number;
    tags: string[];
  }>>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll navigation functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  // tao bien product
  const featuredTopiks = [
    {
      id: "9v0i6zzig509tk9",
      name: "제35회 한국어능력시험 TOPIK Ⅰ 듣기",
      description: t("content.learnKorean"),
      price: 199.99,
      originalPrice: 249.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Topik I",
      rating: 4.5,
      inStock: true,
      lessonCount: 12,
    },
    {
      id: "tph8rw2hzg51igq",
      name: "제35회 한국어능력시험 TOPIK I 읽기",
      description: t("content.learnFromExperts"),

      price: 299.99,
      originalPrice: 349.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Topik I",
      rating: 4.2,
      inStock: true,
      lessonCount: 12,
    },
    {
      id: "6bve930m9y8vacl",
      name: "제35회 한국어능력시험 TOPIK Ⅱ 듣기",
      description: t("content.learnAtYourOwnPace"),
      price: 999.99,
      originalPrice: 1099.99,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Topik II",
      rating: 4.8,
      inStock: true,
      lessonCount: 12,
    },
    {
      id: "giy1vhnk3w7d55c",
      name: "제35회 한국어능력시험 TOPIK IⅠ 읽기",
      description: t("content.coverAllAspects"),
      price: 149.99,
      originalPrice: 179.99,
      image:
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Topik II",
      rating: 4.4,
      inStock: true,
      lessonCount: 12,
    },
  ];

  const categories = [
    {
      name: "TOPIK I",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      productCount: 12,
    },
    {
      name: "TOPIK II",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      productCount: 15,
      lessionCount: 12,
    },
  ];

  // Features for the why choose us section
  const features = [
    {
      title: t("content.beginnerKorean"),
      description:
        "Learn Korean with high-quality lessons and resources at absolutely no cost.",
      icon: <Truck className="h-6 w-6 text-primary" />,
    },
    {
      title: t("content.intermediateKorean"),
      description:
        "Learn Korean with high-quality lessons and resources at absolutely no cost.",
      icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    },
    {
      title: t("content.advancedKorean"),
      description:
        "Learn Korean with high-quality lessons and resources at absolutely no cost.",
      icon: <Clock className="h-6 w-6 text-primary" />,
    },
  ];

  // Testimonials for the testimonial carousel
  const testimonials = [
    {
      id: "1",
      content: t("content.testimonial1.quote"),
      author: {
        name: t("content.testimonial1.name"),
        role: t("content.testimonial1.role"),
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      rating: 5,
    },
    {
      id: "2",
      content: t("content.testimonial2.quote"),
      author: {
        name: t("content.testimonial2.name"),
        role: t("content.testimonial2.role"),
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      rating: 4,
    },
    {
      id: "3",
      content: t("content.testimonial3.quote"),
      author: {
        name: t("content.testimonial3.name"),
        role: t("content.testimonial3.role"),
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      rating: 5,
    },
  ];

  // Load blog posts for the homepage
  useEffect(() => {
    // In a real application, you would fetch from an API
    // This is mock data for demonstration
    setTimeout(() => {
      setPosts([
        {
          id: "1",
          title: "Getting Started with TOPIK I: A Beginner's Guide",
          excerpt: "TOPIK I is designed for beginners to intermediate Korean language learners. This guide will help you understand what to expect and how to prepare effectively for the test.",
          publishedAt: "2025-03-15T10:00:00Z",
          coverImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Min-Ji Kim",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 42,
          commentCount: 8,
          tags: ["TOPIK I", "Beginner", "Study Guide"]
        },
        {
          id: "2",
          title: "Advanced Korean Grammar Patterns for TOPIK II",
          excerpt: "This post explores complex grammar patterns that frequently appear in TOPIK II tests. Master these patterns to improve your score significantly.",
          publishedAt: "2025-03-10T14:30:00Z",
          coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Sung-Ho Park",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 35,
          commentCount: 12,
          tags: ["TOPIK II", "Advanced", "Grammar"]
        },
        {
          id: "3",
          title: "Common Mistakes to Avoid in TOPIK Reading Section",
          excerpt: "Learn about the typical errors made by test-takers in the reading comprehension section and how to avoid them in your preparation.",
          publishedAt: "2025-03-05T09:15:00Z",
          coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Ji-Woo Lee",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 27,
          commentCount: 6,
          tags: ["TOPIK", "Reading", "Test Preparation"]
        },
        {
          id: "4",
          title: "Listening Comprehension Strategies for TOPIK",
          excerpt: "This article provides effective strategies to enhance your listening skills for the TOPIK exam, including practice resources and tips.",
          publishedAt: "2025-02-28T11:45:00Z",
          coverImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Hye-Jin Choi",
            avatar: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 50,
          commentCount: 15,
          tags: ["TOPIK", "Listening", "Strategies"]
        },
        {
          id: "5",
          title: "Writing Tips for TOPIK II: Crafting a Strong Essay",
          excerpt: "This post offers practical tips for writing a compelling essay in the TOPIK II exam, including structure, vocabulary, and common pitfalls.",
          publishedAt: "2025-02-20T13:30:00Z",
          coverImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Soo-Yeon Kim",
            avatar: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 38,
          commentCount: 10,
          tags: ["TOPIK II", "Writing", "Essay"]
        },
        {
          id: "6",
          title: "Mastering TOPIK Vocabulary: Effective Memory Techniques",
          excerpt: "Explore proven methods to memorize and retain Korean vocabulary for the TOPIK exam, including spaced repetition and memory association techniques.",
          publishedAt: "2025-02-15T09:00:00Z",
          coverImage: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Jae-Hoon Park",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 45,
          commentCount: 14,
          tags: ["TOPIK", "Vocabulary", "Memory Techniques"]
        },
        {
          id: "7",
          title: "TOPIK Test Day: What to Expect and How to Prepare",
          excerpt: "A comprehensive guide to help you navigate test day with confidence, including what to bring, timing strategies, and last-minute preparation tips.",
          publishedAt: "2025-02-10T11:30:00Z",
          coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Yoon-Ah Kim",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 33,
          commentCount: 9,
          tags: ["TOPIK", "Test Preparation", "Exam Day"]
        }
      ]);
      setIsLoadingPosts(false);
    }, 1000);
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 via-muted/25 to-background py-24 md:py-32">
          <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:20px_20px]" />
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {t("content.newCollection")}
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
                    {t("content.oneStopPlatform")}{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">

                    </span>
                  </h1>
                  <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                    {t("content.learnKorean")}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/products">
                    <Button size="lg" className="h-12 gap-1.5 px-8">
                      {t("content.startLearningNow")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/lesson-category">
                    <Button variant="outline" size="lg" className="h-12 px-8">
                      View All Lessons <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-5 w-5 text-primary/70" />
                    <span>{t("content.freeAccess")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-5 w-5 text-primary/70" />
                    <span>{t("content.expertInstructors")}</span>
                  </div>
                </div>
              </div>
              <div className="relative mx-auto hidden aspect-square w-full max-w-md overflow-hidden rounded-xl border lg:block">
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt="Shopping experience"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </section>

        {/* Featured Categories */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Topik by Category
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground">
                {t("content.learnKorean")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/products?category=${category.name.toLowerCase()}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 to-transparent" />
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="relative z-20 -mt-6 p-4">
                    <div className="mb-1 text-lg font-medium">
                      {category.name}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {category.productCount} tests
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Topiks */}
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Featured Topiks
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground">
                Check out our latest and most Topiks items
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredTopiks.map((product) => (
                <TopicCard
                  key={product.id}
                  variant="list"
                  topic={product}
                />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/products">
                <Button variant="outline" size="lg" className="group h-12 px-8">
                  View All Topiks
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Section - Modified to horizontal scrolling */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Latest Blog Posts
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground">
                Explore our latest articles and tips for learning Korean
              </p>
            </div>

            {/* Navigation buttons for horizontal scrolling */}
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={scrollLeft}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {isLoadingPosts ? (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="min-w-[300px] w-[350px] h-80 animate-pulse rounded-lg bg-muted"></div>
                ))}
              </div>
            ) : (
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar"
                style={{
                  scrollbarWidth: 'none', /* Firefox */
                  msOverflowStyle: 'none' /* IE and Edge */
                }}
              >
                {posts.map((post) => (
                  <PostCardSimple key={post.id} post={post} />
                ))}
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link href="/posts">
                <Button variant="outline" size="lg" className="group h-12 px-8">
                  View All Posts
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/50 py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t("content.topikExam")}
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground md:text-lg">
                {t("content.whyChooseVieTopik")}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-none bg-background shadow-sm"
                >
                  <CardHeader className="pb-2">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


        {/* Testimonials */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                What Our Customers Say
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground md:text-lg">
                Don't just take our word for it - hear from our satisfied
                customers
              </p>
            </div>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-xl bg-primary/10 p-8 md:p-12">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]" />
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {t("content.vieTopik")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                  {t("content.yourOneStopShop")}
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/auth/sign-up">
                    <Button size="lg" className="h-12 px-8">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" size="lg" className="h-12 px-8">
                      Browse Topiks
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ContactButton />
    </>
  );
}