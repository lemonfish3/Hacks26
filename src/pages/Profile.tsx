import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserProfile } from "@/context/StudyMateContext";
import { useStudyMate } from "@/context/StudyMateContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const GENDERS: { value: UserProfile["gender"]; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const BUDDY_GENDER_OPTIONS: { value: UserProfile["preferences"]["buddyGender"]; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "female", label: "Female only" },
  { value: "male", label: "Male only" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, setProfile } = useStudyMate();
  const [name, setName] = useState(profile?.name ?? "");
  const [age, setAge] = useState(profile?.age?.toString() ?? "");
  const [gender, setGender] = useState<UserProfile["gender"]>(profile?.gender ?? "prefer_not_to_say");
  const [major, setMajor] = useState(profile?.major ?? "");
  const [classesInput, setClassesInput] = useState(
    profile?.classes?.join(", ") ?? ""
  );
  const [buddyGender, setBuddyGender] = useState<UserProfile["preferences"]["buddyGender"]>(
    profile?.preferences?.buddyGender ?? "any"
  );
  const [error, setError] = useState("");

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const ageNum = parseInt(age, 10);
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!age.trim() || isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
      setError("Please enter a valid age (16–100).");
      return;
    }
    if (!major.trim()) {
      setError("Please enter your major.");
      return;
    }

    const classes = classesInput
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);

    setProfile({
      name: name.trim(),
      age: ageNum,
      gender,
      major: major.trim(),
      classes,
      preferences: { buddyGender },
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">☁️</span>
          <span className="text-xl font-bold text-foreground">StudyMate</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-lg border-border cloud-shadow">
          <CardHeader>
            <CardTitle>Your details</CardTitle>
            <CardDescription>
              Required so we can match you with the right study buddy. Your name is only shown to your match.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min={16}
                  max={100}
                  placeholder="e.g. 20"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(v) => setGender(v as UserProfile["gender"])}
                  className="flex flex-wrap gap-4"
                >
                  {GENDERS.map((g) => (
                    <div key={g.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={g.value} id={g.value} />
                      <Label htmlFor={g.value} className="font-normal cursor-pointer">
                        {g.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Major *</Label>
                <Input
                  id="major"
                  placeholder="e.g. Computer Science, Biology"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classes">Classes you're studying for</Label>
                <Input
                  id="classes"
                  placeholder="e.g. CS 161, MATH 2B, CHEM 1A (comma-separated)"
                  value={classesInput}
                  onChange={(e) => setClassesInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Study buddy preference</Label>
                <p className="text-sm text-muted-foreground">
                  We'll only match you with partners that match this preference.
                </p>
                <Select
                  value={buddyGender}
                  onValueChange={(v) => setBuddyGender(v as UserProfile["preferences"]["buddyGender"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDDY_GENDER_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Save & find a study buddy
              </Button>

              <Link
                to="/"
                className="block text-center text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to home
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
