import { Candidate, MatchResult } from "./types";

function escapeCsvField(field: any): string {
  if (field === null || field === undefined) return '""';
  const stringValue = Array.isArray(field) ? field.join(", ") : String(field);
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function generateCandidatesCsv(candidates: Candidate[]): string {
  const headers = [
    "Candidate Name",
    "Email",
    "Phone",
    "LinkedIn",
    "GitHub",
    "Education",
    "Experience",
    "Skills",
    "Keywords",
    "Resume File",
    "Resume Format",
    "Created At",
  ];

  const rows = candidates.map((c) => [
    escapeCsvField(c.name),
    escapeCsvField(c.email),
    escapeCsvField(c.phone),
    escapeCsvField(c.linkedin),
    escapeCsvField(c.github),
    escapeCsvField(c.education),
    escapeCsvField(c.experience),
    escapeCsvField(c.skills),
    escapeCsvField(c.keywords),
    escapeCsvField(c.resumeFile),
    escapeCsvField(c.resumeFormat),
    escapeCsvField(new Date(c.createdAt).toISOString()),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function generateMatchingCsv(matches: MatchResult[], jobTitle: string = ""): string {
  const headers = [
    "Rank",
    "Candidate Name",
    "Email",
    "Job Title",
    "Match Score (%)",
    "Matching Skills",
    "Missing Skills",
    "Shortlisted",
    "Resume Format",
    "Resume File",
  ];

  const rows = matches.map((m) => [
    escapeCsvField(m.rank),
    escapeCsvField(m.candidateName),
    escapeCsvField(m.candidateEmail),
    escapeCsvField(jobTitle),
    escapeCsvField(m.matchScore.toFixed(2)),
    escapeCsvField(m.matchingSkills),
    escapeCsvField(m.missingSkills),
    escapeCsvField(m.shortlisted ? "YES" : "NO"),
    escapeCsvField(m.resumeFormat),
    escapeCsvField(m.resumeFile),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
