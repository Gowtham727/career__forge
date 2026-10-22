import { NextRequest, NextResponse } from "next/server";

// Language alias mapping for Piston API
const PISTON_LANGUAGE_MAP: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  cpp: "c++",
  csharp: "c#",
  go: "go",
  rust: "rust",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language, code, stdin = "" } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code content is required." },
        { status: 400 }
      );
    }

    const pistonLang = PISTON_LANGUAGE_MAP[language] || language || "python";

    const startTime = Date.now();

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: pistonLang,
        version: "*",
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
        stdin: stdin || "",
      }),
    });

    const executionDuration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          output: "",
          stderr: `Compiler Service Error (${response.status}): ${errorText}`,
          exitCode: 1,
          executionTime: executionDuration,
          status: "error",
        },
        { status: 200 }
      );
    }

    const data = await response.json();

    // Check if compile phase failed (e.g. syntax error in Java / C++)
    const compileStderr = data.compile?.stderr || data.compile?.output || "";
    const runStdout = data.run?.stdout || data.run?.output || "";
    const runStderr = data.run?.stderr || "";
    const exitCode = data.run?.code ?? data.compile?.code ?? 0;

    const fullOutput = runStdout;
    const fullError = [compileStderr, runStderr].filter(Boolean).join("\n");

    return NextResponse.json({
      output: fullOutput,
      stderr: fullError,
      exitCode,
      executionTime: executionDuration,
      status: exitCode === 0 && !fullError ? "success" : "error",
      languageVersion: data.version || "",
    });
  } catch (err: any) {
    console.error("Code execution endpoint error:", err);
    return NextResponse.json(
      {
        output: "",
        stderr: err?.message || "Failed to contact code compilation service.",
        exitCode: 1,
        executionTime: 0,
        status: "error",
      },
      { status: 500 }
    );
  }
}

function getFileExtension(lang: string): string {
  switch (lang) {
    case "python":
      return "py";
    case "javascript":
      return "js";
    case "typescript":
      return "ts";
    case "java":
      return "java";
    case "cpp":
      return "cpp";
    case "csharp":
      return "cs";
    case "go":
      return "go";
    case "rust":
      return "rs";
    default:
      return "txt";
  }
}
