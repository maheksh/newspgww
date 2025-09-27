import { readdirSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  if (!type || (type !== 'national' && type !== 'international')) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const folder = type === 'national' ? 'NationalNews' : 'InternationalNews';
  const dir = join(process.cwd(), 'public', 'Articles', folder);

  try {
    const files = readdirSync(dir)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const num = parseInt(file.replace('.md', ''), 10);
        return { file: `/Articles/${folder}/${file}`, num, basename: file.replace('.md', '') };
      })
      .sort((a, b) => b.num - a.num) // Descending numerical sort for "latest" as top
      .map(({ file, basename }) => ({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Article ${basename}`,
        file,
      }));

    return NextResponse.json(files);
  } catch (error) {
    console.error(`Error reading ${dir}:`, error);
    return NextResponse.json({ error: 'Directory not found' }, { status: 500 });
  }
}