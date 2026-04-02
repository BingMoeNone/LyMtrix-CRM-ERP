import { getArticleList } from "@/lib/articles";
import ArticlesClient from "./ArticlesClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  const articles = await getArticleList(locale);
  return <ArticlesClient locale={locale} articles={articles} />;
}
