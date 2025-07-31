import React, { useState } from 'react';
import { UploadButton } from '@uploadthing/react';

interface ExtractedData {
  summary: string;
  tags: string[];
  supplies: string[];
}

const ProgramSheetUpload: React.FC = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleUploadComplete = async (res: any) => {
    if (!res || !res[0]?.url) {
      setError('Upload failed: No file URL returned.');
      return;
    }
    setFileUrl(res[0].url);
    setLoading(true);
    setError(null);
    setExtracted(null);
    try {
      // Call the AI extraction API with the file URL
      const apiRes = await fetch('/api/ai-extract-program-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: res[0].url }),
      });
      if (!apiRes.ok) throw new Error('Extraction failed');
      const data = await apiRes.json();
      setExtracted(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleExtractedChange = (field: keyof ExtractedData, value: any) => {
    if (!extracted) return;
    setExtracted({ ...extracted, [field]: value });
  };

  const handleSave = async () => {
    setSaveStatus('Saving...');
    // TODO: Implement save logic to backend/program bank
    setTimeout(() => setSaveStatus('Saved! (placeholder)'), 1000);
  };

  return (
    <div>
      <h2>Upload Program Sheet PDF</h2>
      <UploadButton
        endpoint="pdfUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => setError(error.message)}
        accept="application/pdf"
      />
      {loading && <div>Processing...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {extracted && (
        <div style={{ marginTop: 20 }}>
          <h3>Edit Extracted Data</h3>
          <label>
            Summary:<br />
            <textarea
              value={extracted.summary}
              onChange={e => handleExtractedChange('summary', e.target.value)}
              rows={3}
              style={{ width: '100%' }}
            />
          </label>
          <br />
          <label>
            Tags (comma separated):<br />
            <input
              type="text"
              value={extracted.tags.join(', ')}
              onChange={e => handleExtractedChange('tags', e.target.value.split(',').map(s => s.trim()))}
              style={{ width: '100%' }}
            />
          </label>
          <br />
          <label>
            Supplies (comma separated):<br />
            <input
              type="text"
              value={extracted.supplies.join(', ')}
              onChange={e => handleExtractedChange('supplies', e.target.value.split(',').map(s => s.trim()))}
              style={{ width: '100%' }}
            />
          </label>
          <br />
          <button onClick={handleSave}>Save Program</button>
          {saveStatus && <span style={{ marginLeft: 10 }}>{saveStatus}</span>}
        </div>
      )}
    </div>
  );
};

export default ProgramSheetUpload; 