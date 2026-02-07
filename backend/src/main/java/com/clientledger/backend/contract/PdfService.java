package com.clientledger.backend.contract;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateInvoice(Contract contract) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // FONTS
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            // 1. HEADER (Invoice Title)
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // 2. COMPANY INFO (Your User)
            document.add(new Paragraph("From:", headerFont));
            document.add(new Paragraph("ClientLedger Inc.", normalFont));
            document.add(new Paragraph("admin@clientledger.com", normalFont));
            document.add(new Paragraph("\n"));

            // 3. CLIENT INFO
            document.add(new Paragraph("Bill To:", headerFont));
            document.add(new Paragraph(contract.getClient().getName(), normalFont));
            document.add(new Paragraph(contract.getClient().getEmail(), normalFont));
            document.add(new Paragraph(contract.getClient().getCountry(), normalFont));
            document.add(new Paragraph("\n"));

            // 4. CONTRACT DETAILS LINE
            document.add(new Paragraph("-----------------------------------------------------------------------"));
            document.add(new Paragraph("Description: " + contract.getTitle(), normalFont));
            document.add(new Paragraph("Status: " + contract.getStatus(), normalFont));
            document.add(new Paragraph("-----------------------------------------------------------------------"));
            document.add(new Paragraph("\n"));

            // 5. TOTAL
            Paragraph total = new Paragraph("Total: " + formatCurrency(contract.getTotalValue().doubleValue(), contract.getCurrency()), titleFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return out.toByteArray();
    }

    private String formatCurrency(Double amount, String currencyCode) {
        if (amount == null) return "0.00";
        return amount + " " + (currencyCode != null ? currencyCode : "USD");
    }
}