'use client'

import { useState } from "react";
import { fetchMathFromImage } from "@/utils/openai";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ latex: string; solution: string } | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("math-images").upload(fileName, file);
    if (error) {
      console.error("Upload failed", error);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("math-images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrl.publicUrl;

    // Insert into supabase first
    const { data: row, error: insertErr } = await supabase
    .from("image-uploads")
    .insert([{ image_url: imageUrl }])
    .select()
    .single();

    if (insertErr || !row) {
      console.error("Insert failed", insertErr);
      return;
    }

    // Call GPT-4 Vision API
    const { latex, solution } = await fetchMathFromImage(imageUrl);

    // Update Supabase row
    await supabase
      .from("image-uploads")
      .update({ latex_output: latex, solution_text: solution })
      .eq("id", row.id);

    setResult({ latex, solution });
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 font-sans">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="file-input file-input-bordered"
      />
      <button onClick={handleUpload} disabled={!file || loading} className="btn btn-primary">
        {loading ? "Processing..." : "Upload & Solve"}
      </button>

      {result && (
        <div className="mt-4">
          <h3 className="font-semibold">LaTeX:</h3>
          <pre className="bg-gray-100 p-2 text-black">{result.latex}</pre>
          <h3 className="font-semibold mt-2">Solution:</h3>
          <pre className="bg-green-100 p-2 text-black" >{result.solution}</pre>
        </div>
      )}
    </div>
  );
}