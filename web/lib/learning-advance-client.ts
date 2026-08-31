"use client";

export type LearningReadinessTask = {
  type: string;
  passed: boolean;
  message: string;
  score_rate?: number;
  required_score_rate?: number;
  artifact_id?: string;
  attempt_id?: string;
};

export type LearningSectionReadiness = {
  user_id: string;
  course_id: string;
  chapter_id: string;
  chapter_group: string;
  can_advance: boolean;
  status: "passed" | "blocked" | "force_passed" | string;
  required_tasks: string[];
  completed_tasks: string[];
  task_results: LearningReadinessTask[];
  blockers: Array<Record<string, unknown>>;
};

type ErrorPayload = { error?: string; detail?: string };

export async function evaluateLearningSectionReadiness(input: {
  userId: string;
  courseId: string;
  chapterId: string;
}): Promise<LearningSectionReadiness> {
  const response = await fetch("/api/learning/next-step/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: input.userId,
      course_id: input.courseId,
      chapter_id: input.chapterId,
      force: false,
      auto_start_run: false,
    }),
  });
  const payload = (await response.json().catch(() => ({}))) as
    | LearningSectionReadiness
    | ErrorPayload;
  if (!response.ok) {
    const error = payload as ErrorPayload;
    throw new Error(
      error.detail || error.error || `学习资格评估返回 HTTP ${response.status}`,
    );
  }
  return payload as LearningSectionReadiness;
}

export function readinessScoreLabel(
  readiness: LearningSectionReadiness | null,
): string {
  if (!readiness) return "待评估";
  const quiz = readiness.task_results.find((item) => item.type === "quiz");
  if (quiz && Number.isFinite(Number(quiz.score_rate))) {
    return `${Math.round(Number(quiz.score_rate) * 100)}%`;
  }
  if (!readiness.required_tasks.length) return readiness.can_advance ? "已达标" : "待评估";
  return `${readiness.completed_tasks.length}/${readiness.required_tasks.length}`;
}

export function readinessBlockerMessages(
  readiness: LearningSectionReadiness | null,
): string[] {
  if (!readiness) return [];
  const messages = readiness.task_results
    .filter((item) => !item.passed)
    .map((item) => item.message.trim())
    .filter(Boolean);
  return Array.from(new Set(messages));
}
