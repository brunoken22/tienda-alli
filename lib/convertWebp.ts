import sharp from 'sharp';

export default async function convertToWebp(input: string | Buffer | Uint8Array): Promise<string> {
  const outputPath = `/uploads/${Date.now()}.webp`;

  await sharp(input).webp().toFile(`./public${outputPath}`);

  return outputPath;
}
