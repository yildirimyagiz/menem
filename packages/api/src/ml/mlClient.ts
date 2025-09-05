export interface MLAnalyzeResult {
  success: boolean;
  analysis?: unknown;
  recognition?: unknown;
  [key: string]: unknown;
}

type LocationData = Record<string, unknown>;

export async function analyzePropertyPhotoML({
  imageUrl,
  location,
  mlApiUrl,
}: {
  imageUrl: string;
  location?: LocationData;
  mlApiUrl?: string;
}): Promise<MLAnalyzeResult> {
  const endpoint = mlApiUrl ?? 'http://localhost:8001/api/places/analyze';

  // Download image and send as file to ML API
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error('Failed to fetch image for ML analysis');
  const arrayBuffer = await res.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

  const form = new FormData();
  form.append('photo', blob, 'photo.jpg');
  if (location) {
    form.append('location_data', JSON.stringify(location));
  }

  const mlRes = await fetch(endpoint, {
    method: 'POST',
    body: form,
  });
  if (!mlRes.ok) throw new Error('ML API error');
  const json = (await mlRes.json()) as unknown;
  return json as MLAnalyzeResult;
}
