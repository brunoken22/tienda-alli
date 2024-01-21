import {getCartShopping} from '@/lib/controllers/product';
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  try {
    const {ids} = await req.json();

    const data = await getCartShopping(JSON.parse(ids));
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(e);
  }
}
