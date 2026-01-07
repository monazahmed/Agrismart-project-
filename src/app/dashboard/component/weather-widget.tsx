"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrentWeather, ProcessedForecast } from "@/lib/types";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

interface WeatherWidgetProps {
  weatherData: CurrentWeather;
  forecastData: ProcessedForecast[];
}

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("rain") || desc.includes("drizzle")) {
    return <CloudRain className="h-8 w-8 text-blue-500" />;
  }
  if (desc.includes("snow")) {
    return <CloudSnow className="h-8 w-8 text-blue-200" />;
  }
  if (desc.includes("cloud")) {
    return <Cloud className="h-8 w-8 text-gray-400" />;
  }
  return <Sun className="h-8 w-8 text-yellow-500" />;
};

const getSmallWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("rain") || desc.includes("drizzle")) {
    return <CloudRain className="h-5 w-5 text-blue-500" />;
  }
  if (desc.includes("snow")) {
    return <CloudSnow className="h-5 w-5 text-blue-200" />;
  }
  if (desc.includes("cloud")) {
    return <Cloud className="h-5 w-5 text-gray-400" />;
  }
  return <Sun className="h-5 w-5 text-yellow-500" />;
};

export function WeatherWidget({
  weatherData,
  forecastData,
}: WeatherWidgetProps) {
  const currentDescription =
    weatherData.weather[0]?.description || "Unknown weather";
  const currentMain = weatherData.weather[0]?.main || "Unknown";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Weather in {weatherData.name}</span>
          {getWeatherIcon(currentDescription)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          {/* Current Weather */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">
                  {Math.round(weatherData.main.temp)}°C
                </p>
                <p className="text-muted-foreground capitalize">
                  {currentMain} - {currentDescription}
                </p>
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  {weatherData.main.humidity}% Humidity
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{weatherData.wind.speed} m/s</span>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              5-Day Forecast
            </p>
            <div className="flex justify-between gap-2">
              {forecastData.slice(0, 5).map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                  {getSmallWeatherIcon(day.description)}
                  <span className="text-sm font-medium flex items-center">
                    <Thermometer className="h-3 w-3 mr-1" />
                    {Math.round(day.temp)}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
