"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Leaf, Droplets, ThermometerSun, Loader2 } from "lucide-react";
import { getCropRecommendationsOllama } from "@/lib/ollama";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardWrapper } from "../../component/dashboard-wrapper";

interface CropRecommendation {
  name: string;
  matchLevel: string;
  reason: string;
}

export default function CropRecommendationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [phLevel, setPhLevel] = useState(7.2);
  const [nitrogen, setNitrogen] = useState(120);
  const [phosphorus, setPhosphorus] = useState(85);
  const [potassium, setPotassium] = useState(40);

  const parseCropRecommendations = (aiResponse: string): CropRecommendation[] => {
    const crops: CropRecommendation[] = [];

    // Split response into lines
    const lines = aiResponse.split('\n').filter(line => line.trim());

    // Look for crop names and descriptions in bullet points or numbered lists
    const cropMatches = aiResponse.match(/(?:•|-|\*|1\.|2\.|3\.)\s*\*?\*?(\w+(?:\s+\w+)?)\*?\*?:?\s*([^•\n\-\*]*)(?:•|$|-|$|\*|$)/gi) || [];

    if (cropMatches.length === 0) {
      // Fallback: look for common crop names mentioned in the text
      const commonCrops = ['wheat', 'rice', 'corn', 'maize', 'soybeans', 'pulses', 'lentils', 'chickpeas', 'barley', 'oats', 'bajra', 'jowar', 'groundnut', 'cotton', 'sugarcane', 'potato', 'tomato', 'onion', 'cabbage', 'carrot', 'cucumber', 'brinjal', 'chili', 'pepper'];

      commonCrops.forEach(crop => {
        if (aiResponse.toLowerCase().includes(crop)) {
          const matchLevel = aiResponse.toLowerCase().indexOf(crop.toLowerCase()) < 200 ? "High match" : "Good match";
          crops.push({
            name: crop.charAt(0).toUpperCase() + crop.slice(1),
            matchLevel: matchLevel,
            reason: `Suitable for your soil and climate conditions`
          });
        }
      });
    } else {
      cropMatches.forEach((match, index) => {
        const cropName = match.replace(/(?:•|-|\*|1\.|2\.|3\.)\s*\*?\*?|\*?\*?:?.*/gi, '').trim();
        if (cropName) {
          crops.push({
            name: cropName,
            matchLevel: index === 0 ? "High match" : index === 1 ? "Good match" : "Moderate match",
            reason: `Recommended based on your soil and climate data`
          });
        }
      });
    }

    // If still no crops found, extract any capitalized words that might be crop names
    if (crops.length === 0) {
      const capitalizedWords = aiResponse.match(/\b([A-Z][a-z]+)\b/g) || [];
      const cropKeywords = ['crop', 'recommendation', 'based', 'soil', 'climate', 'suitable', 'excellent', 'good', 'best', 'suggested'];

      capitalizedWords.slice(0, 3).forEach((word, index) => {
        if (!cropKeywords.includes(word.toLowerCase())) {
          crops.push({
            name: word,
            matchLevel: index === 0 ? "High match" : "Good match",
            reason: 'Recommended based on your soil and climate data'
          });
        }
      });
    }

    return crops.slice(0, 3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setCrops([]);

    const prompt = `
      You are an agricultural expert AI.
      Given the following values, suggest 3 specific crops to grow, with detailed reasoning:
      - Soil pH: ${phLevel}
      - Nitrogen: ${nitrogen} mg/kg
      - Phosphorus: ${phosphorus} mg/kg
      - Potassium: ${potassium} mg/kg
      - Average Temperature: 25°C
      - Rainfall: 1200mm
      - Soil Type: Loam
      
      Format your response as follows:
      First, provide a paragraph explaining the soil conditions and why certain crops are suitable.
      Then, list exactly 3 crop recommendations in this format:
      • Crop Name: (brief reason why it's suitable)
      • Crop Name: (brief reason why it's suitable)
      • Crop Name: (brief reason why it's suitable)
      
      Use real crop names appropriate for these conditions.
    `;

    try {
      const response = await getCropRecommendationsOllama(prompt);
      setResult(response);
      setError(null);
      const parsedCrops = parseCropRecommendations(response);
      setCrops(parsedCrops);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setResult(null);
      setError(errorMessage);
      setCrops([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper userRole="user">
      <div className="flex flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Crop Recommendations
          </h2>
          <p className="text-muted-foreground">
            Get personalized crop recommendations based on soil and climate data
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="recommend" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[600px]">
            <TabsTrigger value="recommend">Get Recommendations</TabsTrigger>
            <TabsTrigger value="history">Recommendation History</TabsTrigger>
            <TabsTrigger value="templates">Saved Templates</TabsTrigger>
          </TabsList>

          {/* Get Recommendations Tab */}
          <TabsContent value="recommend" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-500">
                  Crop Recommendation
                </CardTitle>
                <CardDescription>
                  Enter your soil and climate data to get AI-powered crop
                  recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Location and Field Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Enter your location" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Field Area (hectares)</Label>
                      <Input id="area" type="number" placeholder="Enter area" />
                    </div>
                  </div>

                  {/* Soil Type */}
                  <div className="space-y-2">
                    <Label htmlFor="soil-type">Soil Type</Label>
                    <Select defaultValue="loam">
                      <SelectTrigger id="soil-type">
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="loam">Loam</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                        <SelectItem value="peaty">Peaty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Soil pH Level */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="ph-level">Soil pH Level</Label>
                      <span className="text-sm text-gray-500">
                        {phLevel.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[phLevel]}
                      min={0}
                      max={14}
                      step={0.1}
                      onValueChange={(value) => setPhLevel(value[0])}
                    />
                  </div>

                  {/* Nutrient Levels */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="nitrogen">Nitrogen (mg/kg)</Label>
                      <span className="text-sm text-gray-500">{nitrogen}</span>
                    </div>
                    <Slider
                      value={[nitrogen]}
                      min={0}
                      max={300}
                      step={1}
                      onValueChange={(value) => setNitrogen(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="phosphorus">Phosphorus (mg/kg)</Label>
                      <span className="text-sm text-gray-500">
                        {phosphorus}
                      </span>
                    </div>
                    <Slider
                      value={[phosphorus]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(value) => setPhosphorus(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="potassium">Potassium (mg/kg)</Label>
                      <span className="text-sm text-gray-500">{potassium}</span>
                    </div>
                    <Slider
                      value={[potassium]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(value) => setPotassium(value[0])}
                    />
                  </div>

                  {/* Climate Data */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">
                        Average Temperature (°C)
                      </Label>
                      <div className="flex items-center">
                        <ThermometerSun className="h-4 w-4 mr-2 text-orange-500" />
                        <Input
                          id="temperature"
                          type="number"
                          placeholder="Enter temperature"
                          defaultValue="25"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                        <Input
                          id="rainfall"
                          type="number"
                          placeholder="Enter rainfall"
                          defaultValue="1200"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-[hsl(var(--green-600))] hover:bg-[hsl(var(--green-700))]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Leaf className="h-4 w-4 mr-2" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Results Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-500">
                  Recommendation Results
                </CardTitle>
                <CardDescription>
                  AI-generated crop recommendations based on your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg border border-red-300 dark:border-red-800 w-full">
                      <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-3">
                        ⚠️ API Error
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                        {error}
                      </p>
                      {error.includes("quota") && (
                        <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded mt-3 border border-red-200 dark:border-red-800">
                          <p className="text-xs text-red-700 dark:text-red-300 font-semibold mb-2">
                            How to fix:
                          </p>
                          <ol className="text-xs text-red-700 dark:text-red-300 space-y-1 list-decimal list-inside">
                            <li>Visit <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Google AI Studio</a></li>
                            <li>Go to your project settings → Billing</li>
                            <li>Enable paid billing with your payment method</li>
                            <li>Retry your crop recommendation</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <ReactMarkdown>{result}</ReactMarkdown>
                    {crops.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                        {crops.map((crop) => (
                          <div
                            key={crop.name}
                            className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                          >
                            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mb-2">
                              <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="font-medium text-center text-base">{crop.name}</p>
                            <p className="text-xs text-center text-green-600 dark:text-green-400 font-semibold mt-1">
                              {crop.matchLevel}
                            </p>
                            <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
                              {crop.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
                    <Leaf className="h-16 w-16 mb-4 opacity-20" />
                    <p>
                      Enter your soil and climate data to get personalized crop
                      recommendations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendation History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommendation History</CardTitle>
                <CardDescription>
                  View your past crop recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>No history available yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Templates</CardTitle>
                <CardDescription>
                  Use and manage your saved crop recommendation templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>No templates available yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardWrapper>
  );
}
