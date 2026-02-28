import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_USER = "studymate_user";
const STORAGE_PROFILE = "studymate_profile";

export type BuddyGenderPreference = "any" | "female" | "male";

export interface StudyBuddyPreferences {
  buddyGender: BuddyGenderPreference;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: "female" | "male" | "non_binary" | "prefer_not_to_say";
  major: string;
  classes: string[];
  preferences: StudyBuddyPreferences;
}

export interface VerifiedUser {
  email: string;
  verifiedAt: number;
}

interface StudyMateState {
  user: VerifiedUser | null;
  profile: UserProfile | null;
  setUser: (u: VerifiedUser | null) => void;
  setProfile: (p: UserProfile | null) => void;
  logout: () => void;
}

function loadJson<T>(key: string): T | null {
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : null;
  } catch {
    return null;
  }
}

function saveJson(key: string, value: unknown) {
  if (value == null) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(value));
}

const StudyMateContext = createContext<StudyMateState | null>(null);

export function StudyMateProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<VerifiedUser | null>(() =>
    loadJson<VerifiedUser>(STORAGE_USER)
  );
  const [profile, setProfileState] = useState<UserProfile | null>(() =>
    loadJson<UserProfile>(STORAGE_PROFILE)
  );

  const setUser = useCallback((u: VerifiedUser | null) => {
    setUserState(u);
    saveJson(STORAGE_USER, u);
  }, []);

  const setProfile = useCallback((p: UserProfile | null) => {
    setProfileState(p);
    saveJson(STORAGE_PROFILE, p);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
  }, [setUser, setProfile]);

  return (
    <StudyMateContext.Provider
      value={{
        user,
        profile,
        setUser,
        setProfile,
        logout,
      }}
    >
      {children}
    </StudyMateContext.Provider>
  );
}

export function useStudyMate(): StudyMateState {
  const ctx = useContext(StudyMateContext);
  if (!ctx) throw new Error("useStudyMate must be used within StudyMateProvider");
  return ctx;
}
