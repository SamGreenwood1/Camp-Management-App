import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// Placeholder AI extraction function
async function extractProgramSheetData(file: Buffer) {
  // TODO: Replace with real AI service integration
  return {
    summary: 'Sample program summary extracted from PDF.',
    tags: ['outdoor', 'teamwork', 'crafts'],
    supplies: ['Rope', 'Markers', 'Paper', 'Scissors']
  };
}

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Support both direct file upload and fileUrl (from UploadThing)
  if (req.headers['content-type']?.includes('application/json')) {
    // Handle JSON body with fileUrl
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const { fileUrl } = JSON.parse(body);
        if (!fileUrl) return res.status(400).json({ error: 'Missing fileUrl' });
        // Fetch the file from the URL
        const fileRes = await fetch(fileUrl);
        if (!fileRes.ok) return res.status(400).json({ error: 'Failed to fetch file from URL' });
        const fileBuffer = Buffer.from(await fileRes.arrayBuffer());
        const extracted = await extractProgramSheetData(fileBuffer);
        res.status(200).json(extracted);
      } catch (e) {
        res.status(400).json({ error: 'Invalid request or file fetch failed' });
      }
    });
    return;
  }

  // Fallback: handle direct file upload (multipart/form-data)
  const chunks: Buffer[] = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', async () => {
    const fileBuffer = Buffer.concat(chunks);
    const extracted = await extractProgramSheetData(fileBuffer);
    res.status(200).json(extracted);
  });
} 