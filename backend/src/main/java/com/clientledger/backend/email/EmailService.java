package com.clientledger.backend.email;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.EmailContent;
import software.amazon.awssdk.services.sesv2.model.RawMessage;
import software.amazon.awssdk.services.sesv2.model.SendEmailRequest;

import java.io.ByteArrayOutputStream;
import java.util.Properties;

@Service
public class EmailService {

    private final SesV2Client sesClient;

    public EmailService(SesV2Client sesClient) {
        this.sesClient = sesClient;
    }

    public void sendInvoiceWithAttachment(String toEmail, String fromEmail, String contractTitle, byte[] pdfBytes) throws Exception {

        // 1. Create a Jakarta MimeMessage
        Session session = Session.getDefaultInstance(new Properties());
        MimeMessage message = new MimeMessage(session);

        // 2. Use Spring's Helper to format the email and attach the PDF cleanly
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Invoice: " + contractTitle);
        helper.setText("Hello,\n\nPlease find your invoice attached for the project: " + contractTitle + ".\n\nThank you!");

        String safeFileName = "Invoice_" + contractTitle.replaceAll("[^a-zA-Z0-9.-]", "_") + ".pdf";
        helper.addAttachment(safeFileName, new ByteArrayResource(pdfBytes));

        // 3. Convert the MimeMessage into Raw Bytes for AWS SES
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        message.writeTo(outputStream);
        SdkBytes rawBytes = SdkBytes.fromByteArray(outputStream.toByteArray());

        // 4. Send the email via SES v2
        SendEmailRequest request = SendEmailRequest.builder()
                .content(EmailContent.builder()
                        .raw(RawMessage.builder().data(rawBytes).build())
                        .build())
                .build();

        sesClient.sendEmail(request);
    }
}