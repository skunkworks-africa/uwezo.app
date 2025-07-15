
"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useStorage } from "@/hooks/use-storage";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Briefcase,
  Linkedin,
  Github,
  Globe,
  Award,
  FileUp,
  UploadCloud,
  Facebook,
  Instagram,
  FileText,
  MessageSquare,
  Camera,
  Loader2,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  linkedin: z.string().url().or(z.literal("")).optional(),
  github: z.string().url().or(z.literal("")).optional(),
  portfolio: z.string().url().or(z.literal("")).optional(),
  credly: z.string().url().or(z.literal("")).optional(),
  facebook: z.string().url().or(z.literal("")).optional(),
  instagram: z.string().url().or(z.literal("")).optional(),
  kickresume: z.string().url().or(z.literal("")).optional(),
  whatsapp: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { uploadFile, isUploading } = useStorage();
  const { userData, loadingUser, updateUserProfile } = useUser();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      linkedin: "",
      github: "",
      portfolio: "",
      credly: "",
      facebook: "",
      instagram: "",
      kickresume: "",
      whatsapp: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = form;
  
  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName || user?.displayName?.split(" ")[0] || "",
        lastName: userData.lastName || user?.displayName?.split(" ")[1] || "",
        bio: userData.bio || "",
        linkedin: userData.linkedin || "",
        github: userData.github || "",
        portfolio: userData.portfolio || "",
        credly: userData.credly || "",
        facebook: userData.facebook || "",
        instagram: userData.instagram || "",
        kickresume: userData.kickresume || "",
        whatsapp: userData.whatsapp || "",
      });
    }
  }, [userData, user, reset]);


  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;

    const file = e.target.files[0];
    const filePath = `avatars/${user.uid}/${file.name}`;

    try {
      const fileURL = await uploadFile(filePath, file, true);
      if (fileURL) {
        toast({
          title: "Success",
          description: "Your profile picture has been updated.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was a problem uploading your picture.",
      });
    }
  };

  const onSave: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      await updateUserProfile(data);
      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your profile. Please try again.",
      });
    }
  };
  
   if (loadingUser) {
    return <ProfileSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Keep your professional and personal information up-to-date.
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">
            <User className="mr-2 h-4 w-4" /> Personal Details
          </TabsTrigger>
          <TabsTrigger value="professional">
            <Briefcase className="mr-2 h-4 w-4" /> Professional Links
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileUp className="mr-2 h-4 w-4" /> Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details here. This information is
                  private.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      placeholder="e.g. Jane"
                    />
                     {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      placeholder="e.g. Doe"
                    />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || "user@example.com"}
                      placeholder="you@company.com"
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Summary</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Tell us a little bit about yourself..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a new avatar.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 border-2 border-primary/20">
                  <AvatarImage src={user?.photoURL || undefined} alt="Your avatar" />
                  <AvatarFallback className="text-4xl">
                    {user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Label
                  htmlFor="picture"
                  className={cn("inline-flex items-center justify-center h-10 px-4 py-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full cursor-pointer", isUploading && "opacity-50 cursor-not-allowed")}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 h-4 w-4" />
                  )}
                  {isUploading ? "Uploading..." : "Choose Image"}
                </Label>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional & Social Links</CardTitle>
              <CardDescription>
                Help us get a complete picture of your professional life.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    {...register("linkedin")}
                    placeholder="https://linkedin.com/in/..."
                    className="pl-10"
                  />
                   {errors.linkedin && <p className="text-sm text-destructive">{errors.linkedin.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="github"
                    {...register("github")}
                    placeholder="https://github.com/..."
                    className="pl-10"
                  />
                  {errors.github && <p className="text-sm text-destructive">{errors.github.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="portfolio"
                     {...register("portfolio")}
                    placeholder="https://your-portfolio.com"
                    className="pl-10"
                  />
                   {errors.portfolio && <p className="text-sm text-destructive">{errors.portfolio.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credly">Credly</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="credly"
                    {...register("credly")}
                    placeholder="https://www.credly.com/users/..."
                    className="pl-10"
                  />
                   {errors.credly && <p className="text-sm text-destructive">{errors.credly.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="facebook"
                    {...register("facebook")}
                    placeholder="https://facebook.com/..."
                    className="pl-10"
                  />
                   {errors.facebook && <p className="text-sm text-destructive">{errors.facebook.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                     {...register("instagram")}
                    placeholder="https://instagram.com/..."
                    className="pl-10"
                  />
                  {errors.instagram && <p className="text-sm text-destructive">{errors.instagram.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kickresume">Kickresume</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="kickresume"
                    {...register("kickresume")}
                    placeholder="https://kickresume.com/..."
                    className="pl-10"
                  />
                  {errors.kickresume && <p className="text-sm text-destructive">{errors.kickresume.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Chat</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="whatsapp"
                    {...register("whatsapp")}
                    placeholder="Enter your WhatsApp number"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Upload supporting documents like transcripts or work
                portfolios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transcripts">Transcripts</Label>
                <div className="flex items-center justify-center w-full">
                  <Label
                    htmlFor="transcript-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOCX, or PNG (MAX. 10MB)
                      </p>
                    </div>
                    <Input
                      id="transcript-upload"
                      type="file"
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-upload">Work Portfolio</Label>
                <div className="flex items-center justify-center w-full">
                  <Label
                    htmlFor="portfolio-file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ZIP, PDF or other project files (MAX. 50MB)
                      </p>
                    </div>
                    <Input
                      id="portfolio-file-upload"
                      type="file"
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <Skeleton className="h-10 w-96" />

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
