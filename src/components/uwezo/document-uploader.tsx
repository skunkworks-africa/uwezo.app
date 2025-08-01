
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { extractSkills, type ExtractSkillsOutput } from "@/ai/flows/cv-skill-extractor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, FileText, CheckCircle2, Download } from "lucide-react";
import { useStorage } from "@/hooks/use-storage";
import { useUser } from "@/hooks/use-user";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

type FormInputs = {
  cv: FileList;
};

interface DocumentUploaderProps {
    onAnalysisComplete: () => void;
}

export function DocumentUploader({ onAnalysisComplete }: DocumentUploaderProps) {
  const { user } = useAuth();
  const { uploadFile, isUploading } = useStorage();
  const { userData, updateUserProfile } = useUser();
  const [extractedSkills, setExtractedSkills] = useState<ExtractSkillsOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch, reset } = useForm<FormInputs>();

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
    if (!data.cv || data.cv.length === 0 || !user) {
      setError("Please upload a CV to extract skills.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setExtractedSkills(null);

    const file = data.cv[0];
    const filePath = `cvs/${user.uid}/${file.name}`;

    try {
      // 1. Upload file to storage
      const downloadURL = await uploadFile(user, filePath, file);

      if (!downloadURL) {
        throw new Error("File upload failed and did not return a URL.");
      }
      
      // 2. Save URL to user profile
      await updateUserProfile({ cvUrl: downloadURL });
      
      // 3. Run AI skill extraction
      const cvDataUri = await readFileAsDataURI(file);
      const result = await extractSkills({ cvDataUri });
      setExtractedSkills(result);
      
      if (result.skills.length > 0) {
        onAnalysisComplete();
      }

      reset(); // Clear the file input

    } catch (e: any) {
      console.error(e);
      setError(`An error occurred: ${e.message || "Please try again."}`);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const isLoading = isUploading || isAnalyzing;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>CV Skill Analysis & Storage</CardTitle>
        <CardDescription>
          Upload your CV for AI skill analysis. It will be stored securely for your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userData?.cvUrl ? (
             <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                    <CheckCircle2 className="h-6 w-6" />
                    <div>
                        <p className="font-semibold">Your CV has been uploaded.</p>
                        <Link href={userData.cvUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline flex items-center gap-1">
                            View Saved CV <Download className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
                <div>
                     <Label htmlFor="cv-upload" className="text-sm text-muted-foreground">Upload a new version:</Label>
                     <form onSubmit={handleSubmit(onAnalyze)} className="flex items-center gap-2 mt-2">
                        <Input id="cv-upload" type="file" accept=".pdf,.doc,.docx" {...register("cv")} disabled={isLoading} />
                        <Button type="submit" disabled={isLoading || !cvFile || cvFile.length === 0}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                        </Button>
                     </form>
                </div>
            </div>
        ) : (
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
                    {isLoading ? "Processing..." : "Analyze & Save CV"}
                </Button>
            </form>
        )}


        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {extractedSkills && extractedSkills.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Extracted Skills (from last upload)
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
