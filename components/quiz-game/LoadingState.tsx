import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
          <CardTitle className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Loading Quiz...
          </CardTitle>
          <CardDescription className="text-lg">
            Preparing questions and shuffling content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse w-3/4" />
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse w-1/2" />
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
