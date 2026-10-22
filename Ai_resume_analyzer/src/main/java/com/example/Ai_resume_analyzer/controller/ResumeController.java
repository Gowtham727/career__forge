package com.example.Ai_resume_analyzer.controller;

import com.example.Ai_resume_analyzer.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/analyze/resume")
@CrossOrigin(origins = "*")
public class ResumeController {
    @Autowired
    ResumeService resumeservice;
    @PostMapping
    public ResponseEntity<?> postresume(@RequestParam MultipartFile file,@RequestParam String jd) throws IOException {
        if(file.isEmpty()){
            return ResponseEntity.badRequest().body("file not found..");
        }
        if(jd == null || jd.isBlank()){
            return ResponseEntity.badRequest().body("job description not found..");
        }
        com.example.Ai_resume_analyzer.entity.ResumeAnalysis analysis = resumeservice.resumeprocess(file,jd);
        return ResponseEntity.ok(analysis);
    }
    @PostMapping("/{id}/roadmap")
    public ResponseEntity<?> generateRoadmap(@PathVariable Long id){
        try {
            String roadmap = resumeservice.generateRoadmapForAnalysis(id);
            return ResponseEntity.ok(roadmap);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<?> generatequestions(@PathVariable Long id){
        try {
            String questions = resumeservice.generateQuestions(id);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
