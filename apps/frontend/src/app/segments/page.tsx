"use client";

import { useState, useEffect } from "react";
import { Users, Filter, Sparkles, Plus, Save } from "lucide-react";

export default function Segments() {
  const [segments, setSegments] = useState<any[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFilter, setGeneratedFilter] = useState<any>(null);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/segments`);
      const data = await res.json();
      setSegments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAISegment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/ai/segment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setGeneratedFilter(data.queryFilter);
      fetchSegments(); // refresh list
    } catch (e) {
      alert("Failed to generate segment. Is OPENAI_API_KEY configured?");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Segments</h1>
          <p className="text-gray-500 mt-1">Manage and create audiences for your campaigns.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          <span>New Segment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Builder */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl text-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={24} className="text-purple-200" />
              <h2 className="text-xl font-semibold">AI Segment Builder</h2>
            </div>
            <p className="text-purple-100 text-sm mb-6">Describe your target audience in plain English, and our AI will build the filter.</p>
            <form onSubmit={handleAISegment} className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Inactive coffee buyers who spent over ₹10,000'"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                rows={3}
                required
              />
              <button 
                type="submit" 
                disabled={isGenerating}
                className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isGenerating ? "Generating..." : "Generate Segment"}
              </button>
            </form>

            {generatedFilter && (
              <div className="mt-6 bg-black/20 p-4 rounded-lg">
                <p className="text-xs text-purple-200 uppercase tracking-wider mb-2 font-semibold">Generated Filter Logic</p>
                <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(generatedFilter, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: List of Segments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                Saved Segments
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {segments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users size={48} className="mx-auto text-gray-300 mb-3" />
                  <p>No segments created yet.</p>
                </div>
              ) : (
                segments.map((seg) => (
                  <div key={seg.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{seg.name}</h4>
                      {seg.prompt && <p className="text-sm text-gray-500 mt-1 italic">"{seg.prompt}"</p>}
                    </div>
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {new Date(seg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
