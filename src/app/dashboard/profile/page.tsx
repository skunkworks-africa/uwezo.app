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

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" defaultValue="User" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" defaultValue="" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="user@example.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bio">Professional Summary</Label>
                        <Textarea id="bio" placeholder="Tell us a little bit about yourself" />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Professional Links</CardTitle>
                    <CardDescription>Links to your work and social profiles.</CardDescription>
                </Header>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input id="linkedin" placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input id="github" placeholder="https://github.com/..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio</Label>
                        <Input id="portfolio" placeholder="https://your-portfolio.com" />
                    </div>
                    <Button>Save Links</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
