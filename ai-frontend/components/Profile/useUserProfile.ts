"use client";

import { useState, useEffect } from "react";
import { JOB_ROLES, JobRoleDefinition } from "./RoleCurriculum";
import { useAuth } from "@/context/AuthContext";

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  timestamp: string;
  icon: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: string;
  completedTopics: string[];
  resumeScore: number;
  liveSessionsCount: number;
  codeExecutionsCount: number;
  activityFeed: ActivityItem[];
}

const DEFAULT_PROFILE: UserProfileData = {
  name: "Gowtham",
  email: "gowtham@example.com",
  targetRole: "java-developer",
  experienceLevel: "Mid-Level (2-4 yrs)",
  completedTopics: [
    "Basics",
    "OOP",
    "Collections",
    "Exception Handling",
    "REST APIs",
    "Joins",
    "Indexes",
    "Bubble Sort",
    "Binary Search",
  ],
  resumeScore: 85,
  liveSessionsCount: 4,
  codeExecutionsCount: 18,
  activityFeed: [
    {
      id: "1",
      title: "Completed Binary Search Algorithm Visualizer",
      category: "Algorithm Visualizer",
      timestamp: "Today, 10:25 AM",
      icon: "📊",
    },
    {
      id: "2",
      title: "Executed Python & Java code solutions in Live Editor",
      category: "Live Technical Session",
      timestamp: "Today, 09:40 AM",
      icon: "💻",
    },
    {
      id: "3",
      title: "Generated Java OOP & Collections AI Questions",
      category: "AI Interview Prep",
      timestamp: "Yesterday, 04:15 PM",
      icon: "🎯",
    },
    {
      id: "4",
      title: "Analyzed Resume for Java Backend Developer - Score 85%",
      category: "Resume Analyzer",
      timestamp: "2 days ago",
      icon: "📄",
    },
  ],
};

const STORAGE_KEY = "user_career_profile_data_v2";

export function useUserProfile() {
  const { user: authUser, updateProfile: updateAuthProfile } = useAuth();

  const [profile, setProfile] = useState<UserProfileData>(() => {
    if (authUser) {
      return {
        name: authUser.name || "Candidate",
        email: authUser.email || "",
        targetRole: authUser.targetRole || "java-developer",
        experienceLevel: authUser.experienceLevel || "Mid-Level (2-4 yrs)",
        completedTopics: authUser.completedTopics || DEFAULT_PROFILE.completedTopics,
        resumeScore: authUser.resumeScore || 85,
        liveSessionsCount: authUser.liveSessionsCount || 4,
        codeExecutionsCount: authUser.codeExecutionsCount || 18,
        activityFeed: authUser.activityFeed || DEFAULT_PROFILE.activityFeed,
      };
    }
    return DEFAULT_PROFILE;
  });

  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  // Sync profile when authUser changes (e.g. login)
  useEffect(() => {
    if (authUser) {
      setProfile({
        name: authUser.name || "Candidate",
        email: authUser.email || "",
        targetRole: authUser.targetRole || "java-developer",
        experienceLevel: authUser.experienceLevel || "Mid-Level (2-4 yrs)",
        completedTopics: authUser.completedTopics || DEFAULT_PROFILE.completedTopics,
        resumeScore: authUser.resumeScore || 85,
        liveSessionsCount: authUser.liveSessionsCount || 4,
        codeExecutionsCount: authUser.codeExecutionsCount || 18,
        activityFeed: authUser.activityFeed || DEFAULT_PROFILE.activityFeed,
      });
    }
  }, [authUser]);

  // Save changes locally & sync with AuthContext / DB
  const saveProfile = (newProfile: UserProfileData) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {}

    updateAuthProfile({
      name: newProfile.name,
      email: newProfile.email,
      targetRole: newProfile.targetRole,
      experienceLevel: newProfile.experienceLevel,
      completedTopics: newProfile.completedTopics,
      activityFeed: newProfile.activityFeed,
      resumeScore: newProfile.resumeScore,
    });
  };

  const updateTargetRole = (roleId: string) => {
    const updated = { ...profile, targetRole: roleId };
    saveProfile(updated);
    logActivity(`Updated Target Job Role to ${JOB_ROLES[roleId]?.title || roleId}`, "Profile Update", "💼");
  };

  const updateCredentials = (name: string, email: string, experienceLevel: string) => {
    const updated = { ...profile, name, email, experienceLevel };
    saveProfile(updated);
  };

  const logActivity = (title: string, category: string, icon: string = "✨") => {
    const newItem: ActivityItem = {
      id: Date.now().toString(),
      title,
      category,
      timestamp: "Just now",
      icon,
    };
    const updated = {
      ...profile,
      activityFeed: [newItem, ...profile.activityFeed.slice(0, 15)],
    };
    saveProfile(updated);
  };

  const toggleTopicCompletion = (topic: string) => {
    const current = profile.completedTopics;
    const exists = current.includes(topic);
    const newTopics = exists
      ? current.filter((t) => t !== topic)
      : [...current, topic];

    const updated = { ...profile, completedTopics: newTopics };
    saveProfile(updated);

    if (!exists) {
      logActivity(`Marked competency "${topic}" as Completed`, "Skill Mastery", "✅");
    }
  };

  // Calculate Readiness Score (%) dynamically based on active targetRole requirements
  const currentRoleDef: JobRoleDefinition =
    JOB_ROLES[profile.targetRole] || JOB_ROLES["java-developer"];

  const domainScores = currentRoleDef.requiredSkills.map((domain) => {
    const totalRequired = domain.requiredTopics.length;
    const completedCount = domain.requiredTopics.filter((topic) =>
      profile.completedTopics.includes(topic)
    ).length;

    const percentage = totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 100;
    const weightedPoints = Math.round((percentage * domain.weight) / 100);

    return {
      domainId: domain.id,
      domainName: domain.name,
      weight: domain.weight,
      completedCount,
      totalRequired,
      percentage,
      weightedPoints,
      requiredTopics: domain.requiredTopics,
      moduleLink: domain.moduleLink,
      moduleName: domain.moduleName,
    };
  });

  const overallReadinessScore = Math.min(
    100,
    domainScores.reduce((acc, curr) => acc + curr.weightedPoints, 0)
  );

  return {
    profile,
    isLoaded,
    currentRoleDef,
    domainScores,
    overallReadinessScore,
    updateTargetRole,
    updateCredentials,
    logActivity,
    toggleTopicCompletion,
  };
}
