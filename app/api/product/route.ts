// export const dynamic = 'force-dynamic';
import {searchProduct} from '@/lib/controllers/product';
import {NextResponse} from 'next/server';
export async function GET(req: Request) {
  try {
    const data = await searchProduct(req);

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(e);
  }
}
