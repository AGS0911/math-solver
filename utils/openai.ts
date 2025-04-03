export const fetchMathFromImage = async (imageUrl: string): Promise<{ latex: string; solution: string }> => {
  const res = await fetch("/api/solve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to get solution:", data);
    return { latex: "N/A", solution: "N/A" };
  }

  const reply = data.result ?? "";

  const [latex, solution] = reply.split("Solution:");

  return {
    latex: latex?.trim() || "N/A",
    solution: solution?.trim() || "N/A",
  };
};