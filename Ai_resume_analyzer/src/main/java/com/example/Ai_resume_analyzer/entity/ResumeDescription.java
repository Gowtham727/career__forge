package com.example.Ai_resume_analyzer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResumeDescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
   // private String username;
    @Column(columnDefinition = "LONGTEXT")
    private String extract_text;
    @Column(columnDefinition = "LONGTEXT")
    private String jd;
    @Column(columnDefinition = "LONGTEXT")
    private String missing_skills;
    @Column(columnDefinition = "LONGTEXT")
    private String suggestions;
    @Column(columnDefinition = "LONGTEXT")
    private String roadmap;

}
