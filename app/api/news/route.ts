import fs from "fs";
import path from "path";

type NewsItem = {
  title: string;
  file: string;
};

function getLatestNews(folder: string): NewsItem[] {
  const dir = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(dir)) return [];

  // Get all HTML files
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".html"))
    .sort((a, b) => fs.statSync(path.join(dir, b)).mtimeMs - fs.statSync(path.join(dir, a)).mtimeMs)
    .slice(0, 10); // Latest 10 only

  return files.map((file) => ({
    title: file.replace(".html", ""),
    file: `/${folder}/${file}`,
  }));
}

export async function GET() {
  const national = getLatestNews("NationalNews");
  const international = getLatestNews("InternationalNews");

  return new Response(JSON.stringify({ national, international }), {
    headers: { "Content-Type": "application/json" },
  });
}
