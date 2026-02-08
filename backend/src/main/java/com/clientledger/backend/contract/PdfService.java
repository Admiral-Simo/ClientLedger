package com.clientledger.backend.contract;

import com.clientledger.backend.user.UserProfile;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateInvoice(Contract contract, UserProfile profile) {

        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);

            // ============================
            // HEADER TITLE
            // ============================
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(30);
            document.add(title);

            // ============================
            // FROM + BILL TO (2 COLUMNS)
            // ============================
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(25);
            infoTable.setWidths(new float[]{1f, 1f});

            infoTable.addCell(buildInfoBlock("From", profile, normalFont, headerFont));
            infoTable.addCell(buildClientBlock("Bill To", contract, normalFont, headerFont));

            document.add(infoTable);

            // ============================
            // CONTRACT DETAILS TABLE
            // ============================
            PdfPTable detailsTable = new PdfPTable(3);
            detailsTable.setWidthPercentage(100);
            detailsTable.setSpacingBefore(10);
            detailsTable.setSpacingAfter(20);
            detailsTable.setWidths(new float[]{3f, 1.5f, 1.5f});

            // Header Row
            detailsTable.addCell(tableHeader("Description", headerFont));
            detailsTable.addCell(tableHeader("Status", headerFont));
            detailsTable.addCell(tableHeader("Amount", headerFont));

            // Data Row
            detailsTable.addCell(tableCell(contract.getTitle(), normalFont));
            detailsTable.addCell(tableCell(contract.getStatus().toString(), normalFont));
            detailsTable.addCell(tableCell(
                    formatCurrency(contract.getTotalValue().doubleValue(), contract.getCurrency()),
                    normalFont
            ));

            document.add(detailsTable);

            // ============================
            // TOTAL BOX (RIGHT SIDE)
            // ============================
            PdfPTable totalTable = new PdfPTable(1);
            totalTable.setWidthPercentage(40);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

            PdfPCell totalCell = new PdfPCell(
                    new Paragraph("TOTAL: " +
                            formatCurrency(contract.getTotalValue().doubleValue(), contract.getCurrency()),
                            boldFont)
            );

            totalCell.setPadding(12);
            totalCell.setBorder(Rectangle.BOX);
            totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            totalTable.addCell(totalCell);

            document.add(totalTable);

            // Footer
            Paragraph footer = new Paragraph("\nThank you for your business!",
                    FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10));
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(40);

            document.add(footer);

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("PDF Invoice generation failed", e);
        }

        return outputStream.toByteArray();
    }

    // ============================
    // BLOCKS
    // ============================

    private PdfPCell buildInfoBlock(String title, UserProfile profile, Font font, Font headerFont) {
        Paragraph p = new Paragraph();
        p.add(new Chunk(title + "\n", headerFont));

        addLine(p, profile.getCompanyName(), font);
        addLine(p, profile.getAddress(), font);
        addLine(p, formatLabel("Phone", profile.getPhone()), font);
        addLine(p, formatLabel("Tax ID", profile.getTaxID()), font);

        PdfPCell cell = new PdfPCell(p);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    private PdfPCell buildClientBlock(String title, Contract contract, Font font, Font headerFont) {
        Paragraph p = new Paragraph();
        p.add(new Chunk(title + "\n", headerFont));

        addLine(p, contract.getClient().getName(), font);
        addLine(p, contract.getClient().getEmail(), font);
        addLine(p, contract.getClient().getCountry(), font);

        PdfPCell cell = new PdfPCell(p);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    // ============================
    // TABLE HELPERS
    // ============================

    private PdfPCell tableHeader(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }

    private PdfPCell tableCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(8);
        return cell;
    }

    private void addLine(Paragraph paragraph, String value, Font font) {
        if (value != null && !value.trim().isEmpty()) {
            paragraph.add(new Chunk(value + "\n", font));
        }
    }

    private String formatLabel(String label, String value) {
        if (value == null || value.trim().isEmpty()) return null;
        return label + ": " + value;
    }

    private String formatCurrency(Double amount, String currencyCode) {
        if (amount == null) amount = 0.0;
        if (currencyCode == null) currencyCode = "USD";
        return String.format("%.2f %s", amount, currencyCode);
    }
}
