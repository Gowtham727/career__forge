package com.example.Ai_resume_analyzer.repo;

import com.example.Ai_resume_analyzer.entity.ResumeDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepo extends JpaRepository<ResumeDescription,Long> {
}
