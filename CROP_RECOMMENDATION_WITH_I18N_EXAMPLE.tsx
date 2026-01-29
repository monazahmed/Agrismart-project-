// Example: How to update the Crop Recommendation Page with Translations
// This file shows the pattern to follow for other pages

"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "@/components/shared/language-provider";
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

export default function CropRecommendationPageWithI18n() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [crops, setCrops] = useState<CropRecommendation[]>([]);
    const [phLevel, setPhLevel] = useState(7.2);
    const [nitrogen, setNitrogen] = useState(120);
    const [phosphorus, setPhosphorus] = useState(85);
    const [potassium, setPotassium] = useState(40);

    // Add this hook to use translations
    const { t } = useTranslation();

    const parseCropRecommendations = (aiResponse: string): CropRecommendation[] => {
        const crops: CropRecommendation[] = [];

        // Remove code blocks from response
        const cleanResponse = aiResponse.replace(/```[\s\S]*?```/g, '');

        // Look for numbered crop entries (1. Crop Name - Match Level...)
        const numberedPattern = /(\d+)\.\s*\*?\*?([^-*]+?)\*?\*?\s*[-–]\s*Match Level:\s*(High|Good|Moderate)[\s\S]*?Why suitable:\s*([^0-9]*?)(?=\n\d+\.|$)/gi;

        let match;
        while ((match = numberedPattern.exec(cleanResponse)) !== null) {
            const cropName = match[2].replace(/[\*_`]/g, '').trim();
            const matchLevel = match[3].trim() + " " + t("cropRecommendation.moderateMatch").split(" ")[1];
            const reason = match[4].replace(/[\*_`]/g, '').trim().split('\n')[0];

            if (cropName && cropName.length > 1) {
                crops.push({
                    name: cropName,
                    matchLevel: matchLevel,
                    reason: reason || t("cropRecommendation.suitableFor")
                });
            }
        }

        // Fallback: look for common crop names if parsing fails
        if (crops.length === 0) {
            const commonCrops = ['wheat', 'rice', 'corn', 'maize', 'soybeans', 'pulses', 'lentils', 'chickpeas', 'barley', 'oats', 'bajra', 'jowar', 'groundnut', 'cotton', 'sugarcane', 'potato', 'tomato', 'onion', 'cabbage', 'carrot', 'cucumber', 'brinjal', 'chili', 'pepper'];

            commonCrops.forEach(crop => {
                if (cleanResponse.toLowerCase().includes(crop)) {
                    const matchLevel = cleanResponse.toLowerCase().indexOf(crop.toLowerCase()) < 300
                        ? t("cropRecommendation.highMatch")
                        : t("cropRecommendation.goodMatch");
                    crops.push({
                        name: crop.charAt(0).toUpperCase() + crop.slice(1),
                        matchLevel: matchLevel,
                        reason: t("cropRecommendation.suitableFor")
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

        const prompt = `You are an agricultural expert. Based on the following soil data, recommend exactly 3 crops that would be most suitable.

SOIL DATA:
- ${t("cropRecommendation.phLevel")}: ${phLevel}
- ${t("cropRecommendation.nitrogen")}: ${nitrogen} mg/kg
- ${t("cropRecommendation.phosphorus")}: ${phosphorus} mg/kg
- ${t("cropRecommendation.potassium")}: ${potassium} mg/kg

INSTRUCTIONS:
1. Provide ONLY crop recommendations in the format below
2. Do NOT include any Python code, formulas, or technical explanations
3. Each recommendation should be clear and concise

FORMAT:
**${t("cropRecommendation.recommendationResults")}:**

1. **Crop Name** - Match Level: High/Good/Moderate
   Why suitable: Brief explanation why this crop thrives in your soil conditions

2. **Crop Name** - Match Level: High/Good/Moderate
   Why suitable: Brief explanation why this crop thrives in your soil conditions

3. **Crop Name** - Match Level: High/Good/Moderate
   Why suitable: Brief explanation why this crop thrives in your soil conditions

Start with the recommendation now:`;

        try {
            const response = await getCropRecommendationsOllama(prompt);
            setResult(response);
            setError(null);
            const parsedCrops = parseCropRecommendations(response);
            setCrops(parsedCrops);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t("errors.serverError");
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
                        {t("cropRecommendation.title")}
                    </h2>
                    <p className="text-muted-foreground">
                        {t("cropRecommendation.description")}
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="recommend" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full md:w-[600px]">
                        <TabsTrigger value="recommend">{t("cropRecommendation.getRecommendations")}</TabsTrigger>
                        <TabsTrigger value="history">{t("cropRecommendation.recommendationHistory")}</TabsTrigger>
                        <TabsTrigger value="templates">{t("cropRecommendation.savedTemplates")}</TabsTrigger>
                    </TabsList>

                    {/* Get Recommendations Tab */}
                    <TabsContent value="recommend" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-700 dark:text-green-500">
                                    {t("cropRecommendation.title")}
                                </CardTitle>
                                <CardDescription>
                                    {t("cropRecommendation.description")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Location and Field Area */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location">{t("cropRecommendation.location")}</Label>
                                            <Input
                                                id="location"
                                                placeholder={t("cropRecommendation.location")}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="area">{t("cropRecommendation.fieldArea")}</Label>
                                            <Input
                                                id="area"
                                                type="number"
                                                placeholder={t("cropRecommendation.fieldArea")}
                                            />
                                        </div>
                                    </div>

                                    {/* Soil Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="soil-type">{t("cropRecommendation.soilType")}</Label>
                                        <Select defaultValue="loam">
                                            <SelectTrigger id="soil-type">
                                                <SelectValue placeholder={t("cropRecommendation.soilType")} />
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
                                            <Label htmlFor="ph-level">{t("cropRecommendation.phLevel")}</Label>
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
                                            <Label htmlFor="nitrogen">{t("cropRecommendation.nitrogen")}</Label>
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
                                            <Label htmlFor="phosphorus">{t("cropRecommendation.phosphorus")}</Label>
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
                                            <Label htmlFor="potassium">{t("cropRecommendation.potassium")}</Label>
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
                                                {t("cropRecommendation.temperature")}
                                            </Label>
                                            <div className="flex items-center">
                                                <ThermometerSun className="h-4 w-4 mr-2 text-orange-500" />
                                                <Input
                                                    id="temperature"
                                                    type="number"
                                                    placeholder={t("cropRecommendation.temperature")}
                                                    defaultValue="25"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="rainfall">{t("cropRecommendation.rainfall")}</Label>
                                            <div className="flex items-center">
                                                <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                                                <Input
                                                    id="rainfall"
                                                    type="number"
                                                    placeholder={t("cropRecommendation.rainfall")}
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
                                            {t("cropRecommendation.analyzing")}
                                        </>
                                    ) : (
                                        <>
                                            <Leaf className="h-4 w-4 mr-2" />
                                            {t("cropRecommendation.getRecommendations")}
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Results Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-700 dark:text-green-500">
                                    {t("cropRecommendation.recommendationResults")}
                                </CardTitle>
                                <CardDescription>
                                    {t("cropRecommendation.description")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error ? (
                                    <div className="flex flex-col items-center justify-center space-y-4 py-12">
                                        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg border border-red-300 dark:border-red-800 w-full">
                                            <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-3">
                                                ⚠️ {t("errors.apiError")}
                                            </p>
                                            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                                                {error}
                                            </p>
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
                                            {t("cropRecommendation.enterDataToGet")}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("cropRecommendation.recommendationHistory")}</CardTitle>
                                <CardDescription>
                                    {t("cropRecommendation.recommendationHistory")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{t("cropRecommendation.noHistory")}</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Templates Tab */}
                    <TabsContent value="templates" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("cropRecommendation.savedTemplates")}</CardTitle>
                                <CardDescription>
                                    {t("cropRecommendation.savedTemplates")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{t("cropRecommendation.noTemplates")}</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardWrapper>
    );
}
