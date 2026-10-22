package com.example.Ai_resume_analyzer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class MistralService {
    private final WebClient webClient;

    public MistralService(
            @Value("${spring.ai.mistralai.api-key}") String apikey,
            @Value("${spring.ai.mistral.api.url}") String url) {
        this.webClient=WebClient.builder()
                .baseUrl(url)
                .defaultHeader("Authorization","Bearer "+apikey)
                .build();

    }
    public String analyzeBasicResume(String resume, String jd) {
        String systemPrompt = """
        You are an expert technical mentor, software architect, and placement trainer.
        You are provided with a resume and a job description.

        Your task:
        Analyze the resume against the job description and provide an ATS score, summary, strengths, weaknesses, existing skills, missing skills, and suggestions.
        
        Return ONLY this JSON schema (no markdown, no explanation):
        {
          "atsScore": <number 0-100>,
          "summary": "<brief summary of resume vs JD fit>",
          "strengths": ["<strength1>", "<strength2>"],
          "weaknesses": ["<weakness1>", "<weakness2>"],
          "existingSkills": ["<skill1>", "<skill2>"],
          "missingSkills": ["<skill1>", "<skill2>"],
          "suggestions": ["<suggestion1>", "<suggestion2>"]
        }
        """;

        String userMessage = """
        Resume:
        %s

        Job Description:
        %s
        """.formatted(resume, jd);

        java.util.Map<String, Object> requestBody = java.util.Map.of(
            "model", "open-mistral-7b",
            "messages", java.util.List.of(
                java.util.Map.of("role", "system", "content", systemPrompt),
                java.util.Map.of("role", "user", "content", userMessage)
            ),
            "temperature", 0.2,
            "response_format", java.util.Map.of("type", "json_object")
        );

        return callMistral(requestBody);
    }

    public String generateRoadmap(String resume, String jd) {
        String systemPrompt = """
        You are an expert technical mentor. You are provided with a resume and a job description.
        
        Your task:
        Generate a complete personalized learning roadmap for all missing skills based on the gap between the resume and job description.
        
        Roadmap Rules:
        1. Start from the user's existing knowledge.
        2. Expand every missing skill into a learning hierarchy.
        3. Do not repeat concepts the user already knows.
        4. Follow the correct learning sequence.
        
        Return ONLY this JSON schema (no markdown, no explanation, must contain the 'roadmap' array):
        {
          "roadmap": [
            {
              "title": "<topic>",
              "description": "<what to learn>",
              "difficulty": "<Beginner|Intermediate|Advanced>",
              "estimatedHours": <number>,
              "children": [
                {
                  "title": "<subtopic>",
                  "description": "<details>",
                  "difficulty": "<Beginner|Intermediate|Advanced>",
                  "estimatedHours": <number>,
                  "children": []
                }
              ]
            }
          ]
        }
        """;

        String userMessage = """
        Resume:
        %s

        Job Description:
        %s
        """.formatted(resume, jd);

        java.util.Map<String, Object> requestBody = java.util.Map.of(
            "model", "open-mistral-7b",
            "messages", java.util.List.of(
                java.util.Map.of("role", "system", "content", systemPrompt),
                java.util.Map.of("role", "user", "content", userMessage)
            ),
            "temperature", 0.2,
            "response_format", java.util.Map.of("type", "json_object")
        );

        return callMistral(requestBody);
    }

    private String callMistral(java.util.Map<String, Object> requestBody) {
        try {
            return webClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            System.err.println("API Error Status: " + e.getStatusCode());
            System.err.println("API Error Response: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected Error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public String generateQuestions(String resume, String jd) {
        String prompt = """
        Based on the following resume and job description, generate a minimum of 20 highly relevant technical and behavioral interview questions that the candidate is most likely to be asked. 
        Focus strictly on uncovering their depth of knowledge in areas mentioned in the job description that overlap with their resume, as well as probing any missing skills.

        Return ONLY a JSON array of strings containing the questions. E.g.
        [
          "Question 1...",
          "Question 2..."
        ]

        Resume:
        %s

        Job Description:
        %s
        """.formatted(resume, jd);

        java.util.Map<String, Object> requestBody = java.util.Map.of(
            "model", "open-mistral-7b",
            "messages", java.util.List.of(
                java.util.Map.of(
                    "role", "user",
                    "content", prompt
                )
            ),
            "temperature", 0.7
        );

        String aiResponse = "";
        try {
            aiResponse = webClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            System.err.println("API Error Status: " + e.getStatusCode());
            System.err.println("API Error Response: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected Error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }

        org.json.JSONObject root = new org.json.JSONObject(aiResponse);

        String content = root.getJSONArray("choices")
                .getJSONObject(0)
                .getJSONObject("message")
                .getString("content");

        return content.replaceAll("```json", "").replaceAll("```", "").trim();
    }

    public String generateInterviewPrepQuestions(String domain, String topic) {
        String prompt = """
        Generate exactly 20 interview questions for the domain "%s" and topic "%s".
        
        Return the response strictly as a JSON array.
        Each question must contain:
        - "question"
        - "answer"
        - "explanation"
        - "difficulty" (must be one of: "Easy", "Medium", "Hard")
        
        Return valid JSON only. Do not include markdown formatting or backticks.
        Example format:
        [
          {
            "question": "...",
            "answer": "...",
            "explanation": "...",
            "difficulty": "Easy"
          }
        ]
        """.formatted(domain, topic);

        java.util.Map<String, Object> requestBody = java.util.Map.of(
            "model", "open-mistral-7b",
            "messages", java.util.List.of(
                java.util.Map.of(
                    "role", "user",
                    "content", prompt
                )
            ),
            "temperature", 0.7
        );

        String aiResponse = "";
        try {
            aiResponse = webClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            System.err.println("API Error Status: " + e.getStatusCode());
            System.err.println("API Error Response: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected Error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }

        org.json.JSONObject root = new org.json.JSONObject(aiResponse);

        String content = root.getJSONArray("choices")
                .getJSONObject(0)
                .getJSONObject("message")
                .getString("content");

        return content.replaceAll("```json", "").replaceAll("```", "").trim();
    }
}
