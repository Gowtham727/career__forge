package com.example.Ai_resume_analyzer.service;

import com.example.Ai_resume_analyzer.entity.ResumeAnalysis;
import com.example.Ai_resume_analyzer.repo.ResumeAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.json.JSONObject;
import java.io.IOException;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;
@Service
public class ResumeService {
    @Autowired
    ResumeAnalysisRepository repository;
    @Autowired
    Pdfservice pdfservice;
    @Autowired
    MistralService mistralService;

    public ResumeAnalysis resumeprocess(MultipartFile file, String jd) throws IOException {
        String resumeText = pdfservice.extracttext(file);
        
        // 1. Caching Strategy
        String inputHash = generateHash(resumeText + jd);
        java.util.Optional<ResumeAnalysis> cached = repository.findByHash(inputHash);
        if (cached.isPresent()) {
            return cached.get();
        }

        // 2. Fast Basic Processing
        long startAi = System.currentTimeMillis();
        String aiResponse = mistralService.analyzeBasicResume(resumeText, jd);
        long endAi = System.currentTimeMillis();
        double aiResponseTimeSeconds = (endAi - startAi) / 1000.0;

        JSONObject basicJson = extractJsonContent(aiResponse);

        ResumeAnalysis analysis = ResumeAnalysis.builder()
                .hash(inputHash)
                .resumeText(resumeText)
                .jobDescription(jd)
                .atsScore(basicJson.optInt("atsScore", 0))
                .summary(basicJson.optString("summary", ""))
                .strengths(basicJson.has("strengths") ? basicJson.getJSONArray("strengths").toString() : "[]")
                .weaknesses(basicJson.has("weaknesses") ? basicJson.getJSONArray("weaknesses").toString() : "[]")
                .existingSkills(basicJson.has("existingSkills") ? basicJson.getJSONArray("existingSkills").toString() : "[]")
                .missingSkills(basicJson.has("missingSkills") ? basicJson.get("missingSkills").toString() : "[]")
                .suggestions(basicJson.has("suggestions") ? basicJson.get("suggestions").toString() : "[]")
                .roadmap("[]") // Roadmap is lazy loaded later
                .interviewQuestions(basicJson.has("interviewQuestions") ? basicJson.get("interviewQuestions").toString() : "[]")
                .aiResponseTime(aiResponseTimeSeconds)
                .aiModel("Mistral-7B (Basic Only)")
                .build();

        return repository.save(analysis);
    }
    
    public String generateRoadmapForAnalysis(Long id) {
        ResumeAnalysis analysis = repository.findById(id).orElseThrow(() -> new RuntimeException("Analysis not found"));
        
        // Return cached roadmap if already generated
        if (analysis.getRoadmap() != null && !analysis.getRoadmap().equals("[]")) {
            return analysis.getRoadmap();
        }
        
        String aiResponse = mistralService.generateRoadmap(analysis.getResumeText(), analysis.getJobDescription());
        JSONObject roadmapJson = extractJsonContent(aiResponse);
        
        String roadmapJsonArray = roadmapJson.has("roadmap") ? roadmapJson.getJSONArray("roadmap").toString() : "[]";
        
        analysis.setRoadmap(roadmapJsonArray);
        repository.save(analysis);
        
        return roadmapJsonArray;
    }
    
    private String generateHash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return String.valueOf(input.hashCode());
        }
    }
    
    private JSONObject extractJsonContent(String aiResponse) {
        JSONObject root = new JSONObject(aiResponse);
        String content = root.getJSONArray("choices")
                .getJSONObject(0)
                .getJSONObject("message")
                .getString("content");
        String cleanContent = content.replaceAll("```json", "")
                                     .replaceAll("```", "")
                                     .trim();
        return new JSONObject(cleanContent);
    }

    public String generateQuestions(Long id) {
        ResumeAnalysis analysis = repository.findById(id).orElseThrow(() -> new RuntimeException("Resume analysis not found"));
        
        String questionsJsonArray = mistralService.generateQuestions(analysis.getResumeText(), analysis.getJobDescription());
        
        analysis.setInterviewQuestions(questionsJsonArray);
        repository.save(analysis);
        
        return questionsJsonArray;
    }

    
}
