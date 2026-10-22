package com.example.Ai_resume_analyzer.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class Pdfservice {
    public String extracttext(MultipartFile file) throws IOException {
        if(file.isEmpty()){
            return "empty file";
        }
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setStartPage(1);
            stripper.setEndPage(Math.min(10, document.getNumberOfPages()));
            String text = stripper.getText(document);
            return text.replaceAll("//s", " ").trim();
        }
    }
}
