import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { getSchoolEmailError } from "@/lib/schoolEmail";
import { sendVerificationCode, verifyCode } from "@/lib/authApi";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Step = "email" | "verify";

const SignUp = () => {
  const navigate = useNavigate();
  const { user, setUser } = useStudyMate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const justVerified = useRef(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const err = getSchoolEmailError(email);
    if (err) {
      setError(err);
      return;
    }
    setSending(true);
    const result = await sendVerificationCode(email);
    setSending(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setStep("verify");
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = code.replace(/\D/g, "").slice(0, 6);
    if (trimmed.length < 6) {
      setError("Please enter the 6-digit code we sent to your email.");
      return;
    }
    setVerifying(true);
    const result = await verifyCode(email, trimmed);
    setVerifying(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    justVerified.current = true;
    setUser({
      email: email.trim().toLowerCase(),
      verifiedAt: Date.now(),
    });
    navigate("/profile");
  };

  useEffect(() => {
    if (user && !justVerified.current) navigate("/", { replace: true });
  }, [user, navigate]);

  if (user && !justVerified.current) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">☁️</span>
          <span className="text-xl font-bold text-foreground">StudyMate</span>
        </Link>
        <Link
          to="/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Log in
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-border cloud-shadow">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              Use your college or university email. We'll send a verification code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "email" ? (
              <form onSubmit={handleSubmitEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">School email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? "Sending…" : "Send verification code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitCode} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Code sent to <strong className="text-foreground">{email}</strong>
                </p>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(v) => setCode(v)}
                  >
                    <InputOTPGroup className="gap-1">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={verifying}>
                  {verifying ? "Verifying…" : "Verify & continue"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError("");
                  }}
                >
                  Use a different email
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-foreground hover:underline">
                Log in
              </Link>
            </p>
            <Link
              to="/"
              className="block text-center text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
