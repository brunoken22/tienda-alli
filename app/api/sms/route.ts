import {whatsaapApi} from '@/lib/whatsaap';
export async function POST() {
  const response = await whatsaapApi();
  return Response.json(response);
}
