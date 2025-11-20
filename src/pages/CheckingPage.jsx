import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Upload,
  Image,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
  ArrowLeft,
  Leaf,
  Beaker,
  History,
  X,
  Plus,
  RefreshCw,
  Camera,
  Sparkles,
  ShieldCheck,
  Info,
  Droplets,
  Sun,
  Thermometer,
  AlertTriangle,
} from "lucide-react";

export default function CheckingPage({ onBackToHome }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("analyze");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUserName(name || "User");
    fetchPredictions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    onBackToHome();
  };

  const fetchPredictions = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:8000/predictions?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPredictions(data || []);
      } else {
        const { data, error } = await supabase
          .from("predictions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);
        if (error) throw error;
        setPredictions(data || []);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching predictions:", err);
      setError(err.message);
    }
  };

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPrediction(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handlePredict = async () => {
    if (!selectedImage) return;
    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await fetch(`http://localhost:8000/predict?user_id=${userId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Prediction failed");

      const result = await response.json();

      await supabase.from("predictions").insert({
        image_path: selectedImage.name,
        result: result.result,
        confidence: result.confidence,
      });

      setPrediction({
        result: result.result,
        confidence: result.confidence,
        message: result.message,
      });

      fetchPredictions();
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setPrediction({
        result: "Error",
        confidence: 0,
        message: "Analysis failed. Please try again.",
      });
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setPrediction(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatConfidence = (conf) => {
    const percentage = typeof conf === "string" ? parseFloat(conf) : conf;
    const displayPercent = percentage > 1 ? percentage : percentage * 100;
    return displayPercent.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ArsenicGuard AI
                </h1>
                <p className="text-sm text-gray-600">Hello, {userName}!</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                Back Home
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow-md cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow border border-gray-200/50 p-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab("analyze")}
                  className={`flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                    activeTab === "analyze"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  Analyze Plant
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                    activeTab === "history"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <History className="w-5 h-5" />
                  History
                </button>
              </div>
            </div>

            {/* Analyze Tab */}
            {activeTab === "analyze" && (
              <div className="space-y-8">
                {/* Upload Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow border border-gray-200/50 p-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Upload className="w-7 h-7 text-emerald-600" />
                    Upload Plant Image
                  </h2>

                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
                      isDragOver
                        ? "border-emerald-500 bg-emerald-50/70"
                        : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />

                    {previewUrl ? (
                      <div className="space-y-6">
                        <div className="relative inline-block">
                          <img
                            src={previewUrl}
                            alt="Plant preview"
                            className="max-h-96 mx-auto rounded-2xl shadow-2xl object-cover border-4 border-emerald-200"
                          />
                          <button
                            onClick={resetForm}
                            className="absolute top-4 right-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-lg font-medium text-gray-700">
                          {selectedImage?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full flex items-center justify-center">
                          <Image className="w-10 h-10 text-emerald-700" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-800">
                            Drop image here or click to upload
                          </p>
                          <p className="text-gray-600 mt-3">
                            Supports JPG, PNG, WebP • Max 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handlePredict}
                      disabled={!selectedImage || isLoading}
                      className={`flex-1 py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                        !selectedImage || isLoading
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl transform hover:scale-105 active:scale-95 cursor-pointer"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          Start Analysis
                        </>
                      )}
                    </button>

                    {selectedImage && !isLoading && (
                      <button
                        onClick={resetForm}
                        className="px-8 py-5 border-2 border-gray-300 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 cursor-pointer"
                      >
                        <X className="w-6 h-6" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Results */}
                {prediction && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-10 animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                      <Beaker className="w-8 h-8 text-emerald-600" />
                      Analysis Results
                    </h3>

                    <div
                      className={`rounded-3xl p-10 border-4 ${
                        prediction.result === "infected"
                          ? "bg-red-50 border-emerald-400"
                          : prediction.result === "not infected"
                          ? "bg-emerald-50 border-emerald-400"
                          : "bg-amber-50 border-emerald-400"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center shadow ${
                            prediction.result === "infected"
                              ? "bg-red-200"
                              : "bg-emerald-200"
                          }`}
                        >
                          {prediction.result === "infected" ? (
                            <AlertTriangle className="w-10 h-10 text-red-600" />
                          ) : (
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <h4
                            className={`text-3xl font-bold ${
                              prediction.result === "infected"
                                ? "text-red-800"
                                : "text-emerald-800"
                            }`}
                          >
                            {prediction.result === "infected"
                              ? "Arsenic Toxicity Detected"
                              : "No Arsenic Detected – Healthy Plant"}
                          </h4>
                          <p className="text-2xl font-bold mt-4 text-gray-900">
                            Confidence: {formatConfidence(prediction.confidence)}%
                          </p>
                          {prediction.message && (
                            <p className="mt-4 text-lg text-gray-600 italic">
                              {prediction.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={resetForm}
                      className="mt-10 w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Plus className="w-6 h-6" />
                      Analyze Another Plant
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow border border-gray-200/50 p-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <History className="w-8 h-8 text-emerald-600" />
                  Analysis History
                </h2>

                {predictions.length > 0 ? (
                  <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2">
                    {predictions.map((pred, i) => (
                      <div
                        key={pred.id || i}
                        className="bg-gray-50/70 hover:bg-gray-100 rounded-2xl p-6 border border-gray-200 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {pred.result === "infected" ? (
                              <AlertTriangle className="w-8 h-8 text-red-500" />
                            ) : (
                              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            )}
                            <div>
                              <p className="font-bold text-xl capitalize">
                                {pred.result === "infected" ? "Arsenic Detected" : "Healthy"}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {pred.image_path || "Unknown file"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {formatDate(pred.created_at)}
                            </p>
                            <p className="text-lg font-bold text-gray-700">
                              {formatConfidence(pred.confidence)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Clock className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <p className="text-xl font-semibold text-gray-600">
                      No analysis history yet
                    </p>
                    <p className="text-gray-500 mt-3">
                      Your analyzed plants will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                Pro Tips
              </h3>
              <ul className="space-y-5 text-lg">
                {["Clear, bright lighting", "Focus on leaves", "Avoid shadows", "Close-up shots work best"].map((tip, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <ShieldCheck className="w-6 h-6" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Care Tips */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Prevention Tips</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                  <Droplets className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm font-medium">Clean Water</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                  <Sun className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm font-medium">Proper Sunlight</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.9); }
        }
        .animate-blob { animation: blob 20s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}