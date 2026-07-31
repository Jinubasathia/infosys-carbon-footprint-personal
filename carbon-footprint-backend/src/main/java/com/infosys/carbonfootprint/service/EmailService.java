package com.infosys.carbonfootprint.service;

public interface EmailService {

    void sendCredentialsEmail(String toEmail, String fullName, String username, String temporaryPassword);

    void sendRejectionEmail(String toEmail, String fullName, String remark);
}
