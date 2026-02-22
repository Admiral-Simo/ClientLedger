package com.clientledger.backend.email;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.EmailContent;
import software.amazon.awssdk.services.sesv2.model.RawMessage;
import software.amazon.awssdk.services.sesv2.model.SendEmailRequest;

import java.io.ByteArrayOutputStream;
import java.util.Properties;

@Service
public class EmailService {

    public void sendInvoiceWithAttachment(String toEmail, String fromEmail, String contractTitle, byte[] pdfBytes) throws Exception {

        System.out.println("🔥 Booting SES V2 Client (Using IAM Role/Default Provider)...");

        SesV2Client client = SesV2Client.builder()
                .region(Region.EU_WEST_3) // Ensure this matches where your email is verified!
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();

        Session session = Session.getDefaultInstance(new Properties());
        MimeMessage message = new MimeMessage(session);

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Invoice: " + contractTitle);
        helper.setText("Hello,\n\nPlease find your invoice attached for the project: " + contractTitle + ".\n\nThank you!");

        String safeFileName = "Invoice_" + contractTitle.replaceAll("[^a-zA-Z0-9.-]", "_") + ".pdf";
        helper.addAttachment(safeFileName, new ByteArrayResource(pdfBytes));

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        message.writeTo(outputStream);
        SdkBytes rawBytes = SdkBytes.fromByteArray(outputStream.toByteArray());

        SendEmailRequest request = SendEmailRequest.builder()
                .content(EmailContent.builder()
                        .raw(RawMessage.builder().data(rawBytes).build())
                        .build())
                .build();

        client.sendEmail(request);
        System.out.println("✅ Email successfully sent via IAM Role!");
    }
}