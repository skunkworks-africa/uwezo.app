"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { extractSkills, type ExtractSkillsOutput } from "@/ai/flows/cv-skill-extractor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, UploadCloud, FileText, Sparkles } from "lucide-react";

type FormInputs = {
  cv: FileList;
};

interface DocumentUploaderProps {
    onAnalysisComplete: () => void;
}

export function DocumentUploader({ onAnalysisComplete }: DocumentUploaderProps) {
  const [extractedSkills, setExtractedSkills] = useState<ExtractSkillsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch } = useForm<FormInputs>();

  const cvFile = watch("cv");

  const readFileAsDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onAnalyze: SubmitHandler<FormInputs> = async (data) => {
    if (!data.cv || data.cv.length === 0) {
      setError("Please upload a CV to extract skills.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setExtractedSkills(null);

    try {
      const file = data.cv[0];
      const cvDataUri = await readFileAsDataURI(file);
      const result = await extractSkills({ cvDataUri });
      setExtractedSkills(result);
      if (result.skills.length > 0) {
        onAnalysisComplete();
      }
    } catch (e) {
      console.error(e);
      setError("Failed to extract skills from CV. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>CV Skill Analysis</CardTitle>
        <CardDescription>
          Upload your CV and our AI will analyze it to identify your key skills.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onAnalyze)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cv-upload">Curriculum Vitae (CV)</Label>
            <Input id="cv-upload" type="file" accept=".pdf,.doc,.docx" {...register("cv")} />
            {cvFile && cvFile.length > 0 && (
              <div className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
                <FileText className="h-4 w-4" />
                <span>{cvFile[0].name}</span>
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading || !cvFile || cvFile.length === 0}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Analyzing..." : "Analyze CV"}
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {extractedSkills && extractedSkills.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Extracted Skills
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {extractedSkills.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-base py-1 px-3 bg-accent/20 text-accent-foreground border-accent/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
