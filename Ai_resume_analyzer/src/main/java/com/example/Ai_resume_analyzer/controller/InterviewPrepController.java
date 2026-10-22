package com.example.Ai_resume_analyzer.controller;

import com.example.Ai_resume_analyzer.dto.InterviewPrepRequest;
import com.example.Ai_resume_analyzer.service.MistralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interview-prep")
@CrossOrigin(origins = "*") // Allows the frontend to make requests
public class InterviewPrepController {

    @Autowired
    private MistralService mistralService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateQuestions(@RequestBody InterviewPrepRequest request) {
        if (request.getDomain() == null || request.getTopic() == null) {
            return ResponseEntity.badRequest().body("Domain and topic must be provided.");
        }
        
        try {
            String jsonQuestions = mistralService.generateInterviewPrepQuestions(request.getDomain(), request.getTopic());
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(jsonQuestions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to generate questions.");
        }
    }
}
