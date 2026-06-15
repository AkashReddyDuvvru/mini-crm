"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus, Calendar, CheckCircle2, PlayCircle, Clock } from "lucide-react";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  
  // AI Assistant Draft State
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [draft, setDraft] = useState<any>(null);

  useEffect(() => {
    fetchCampaigns();
    fetchSegments();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/campaigns");
      const data = await res.json();
      setCampaigns(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSegments = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/segments");
      const data = await res.json();
      setSegments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAIDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDrafting(true);
    try {
      const res = await fetch("http://localhost:4000/api/ai/campaign-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: assistantPrompt }),
      });
      const data = await res.json();
      setDraft(data);
    } catch (e) {
      alert("Failed to draft campaign. Is OPENAI_API_KEY configured?");
    } finally {
      setIsDrafting(false);
    }
  };

  const launchDraft = async () => {
    if (!draft || segments.length === 0) {
      alert("No draft or no segments available.");
      return;
    }
    
    // Pick the first segment for demo purposes
    const segmentId = segments[0]?.id;

    try {
      await fetch("http://localhost:4000/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Campaign: ${draft.channel}`,
          segmentId,
          channel: draft.channel,
          message: draft.message,
        }),
      });
      setDraft(null);
      setAssistantPrompt("");
      fetchCampaigns();
    } catch (e) {
      alert("Failed to launch campaign.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle2 size={16} className="text-green-500" />;
      case "Running": return <PlayCircle size={16} className="text-blue-500" />;
      case "Scheduled": return <Clock size={16} className="text-orange-500" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage and launch multi-channel campaigns.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Assistant */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-purple-600">
              <Megaphone size={20} />
              <h2 className="text-lg font-semibold text-gray-900">AI Campaign Assistant</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6">Describe your goal, and AI will suggest the audience, channel, timing, and copy.</p>
            
            <form onSubmit={handleAIDraft} className="space-y-4">
              <textarea
                value={assistantPrompt}
                onChange={(e) => setAssistantPrompt(e.target.value)}
                placeholder="e.g., 'Reactivate inactive beauty customers'"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                required
              />
              <button 
                type="submit" 
                disabled={isDrafting}
                className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isDrafting ? "Drafting..." : "Get Recommendations"}
              </button>
            </form>

            {draft && (
              <div className="mt-6 border-t border-gray-100 pt-6 space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-purple-800 uppercase">Recommended Channel</span>
                    <p className="font-medium text-purple-900">{draft.channel}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-purple-800 uppercase">Draft Message</span>
                    <p className="text-sm text-purple-900 bg-white p-2 rounded border border-purple-100 mt-1">
                      {draft.message}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-purple-800 uppercase">Explanation</span>
                    <p className="text-sm text-purple-700 italic">{draft.explanation}</p>
                  </div>
                  <button onClick={launchDraft} className="w-full bg-white text-purple-700 border border-purple-200 font-medium py-2 rounded-lg hover:bg-purple-100 mt-2 transition-colors">
                    Approve & Launch
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: List of Campaigns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={18} className="text-gray-500" />
                Active & Past Campaigns
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {campaigns.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Megaphone size={48} className="mx-auto text-gray-300 mb-3" />
                  <p>No campaigns launched yet.</p>
                </div>
              ) : (
                campaigns.map((camp) => (
                  <div key={camp.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{camp.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{camp.message}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {camp.channel}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(camp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(camp.status)}
                      <span className={`text-sm font-medium ${
                        camp.status === 'Completed' ? 'text-green-600' :
                        camp.status === 'Running' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
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
