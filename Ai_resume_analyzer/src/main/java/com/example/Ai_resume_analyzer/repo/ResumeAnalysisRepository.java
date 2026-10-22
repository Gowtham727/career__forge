package com.example.Ai_resume_analyzer.repo;

import com.example.Ai_resume_analyzer.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    java.util.Optional<ResumeAnalysis> findByHash(String hash);
}
