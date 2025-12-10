async function urlToFile(url: string, filename: string): Promise<File> {
  try {
    // 1. Descargar la imagen
    const response = await fetch(url);

    // 2. Verificar que la respuesta sea exitosa
    if (!response.ok) {
      throw new Error(`Error al descargar la imagen: ${response.status}`);
    }

    // 3. Obtener el blob
    const blob = await response.blob();

    // 4. Crear el File a partir del blob
    const file = new File([blob], filename, {
      type: blob.type || "image/jpeg",
      lastModified: Date.now(),
    });

    return file;
  } catch (error) {
    console.error("Error convirtiendo URL a File:", error);
    throw error;
  }
}

// Uso para un array de URLs
async function convertUrlsToFiles(urls: string[]): Promise<File[]> {
  const files: File[] = [];

  for (let i = 0; i < urls.length; i++) {
    try {
      // Extraer nombre del archivo de la URL
      const url = urls[i];
      const filename = url.split("/").pop() || `imagen-${i + 1}.jpg`;

      const file = await urlToFile(url, filename);
      files.push(file);
    } catch (error) {
      console.warn(`⚠️ No se pudo convertir la imagen ${i + 1}:`, urls[i]);
    }
  }

  return files;
}

export default convertUrlsToFiles;
