import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Briefcase, Linkedin, Github, Globe, Award, FileUp, UploadCloud } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">Keep your professional and personal information up-to-date.</p>
        </div>
        <Button>Save All Changes</Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal"><User className="mr-2 h-4 w-4" /> Personal Details</TabsTrigger>
          <TabsTrigger value="professional"><Briefcase className="mr-2 h-4 w-4" /> Professional Links</TabsTrigger>
          <TabsTrigger value="documents"><FileUp className="mr-2 h-4 w-4" /> Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here. This information is private.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="User" placeholder="e.g. Jane" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="" placeholder="e.g. Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" defaultValue="user@example.com" placeholder="you@company.com" className="pl-10" />
                 </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Summary</Label>
                <Textarea id="bio" placeholder="Tell us a little bit about yourself..." />
              </div>
            </CardContent>
          </Card>
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
                    <Input id="linkedin" placeholder="https://linkedin.com/in/..." className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                 <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="github" placeholder="https://github.com/..." className="pl-10" />
                 </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                 <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="portfolio" placeholder="https://your-portfolio.com" className="pl-10" />
                 </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="credly">Credly</Label>
                 <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="credly" placeholder="https://www.credly.com/users/..." className="pl-10" />
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Document Upload</CardTitle>
                    <CardDescription>Upload supporting documents like transcripts or work portfolios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="transcripts">Transcripts</Label>
                        <div className="flex items-center justify-center w-full">
                            <Label htmlFor="transcript-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX, or PNG (MAX. 10MB)</p>
                                </div>
                                <Input id="transcript-upload" type="file" className="hidden" />
                            </Label>
                        </div>
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio-upload">Work Portfolio</Label>
                        <div className="flex items-center justify-center w-full">
                           <Label htmlFor="portfolio-file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">ZIP, PDF or other project files (MAX. 50MB)</p>
                                </div>
                                <Input id="portfolio-file-upload" type="file" className="hidden" />
                            </Label>
                        </div>
                     </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
