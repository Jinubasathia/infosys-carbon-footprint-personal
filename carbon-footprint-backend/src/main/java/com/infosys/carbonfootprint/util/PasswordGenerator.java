package com.infosys.carbonfootprint.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class PasswordGenerator {

    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String OTHER_CHAR = "!@#$%^&*";
    private static final String PASSWORD_ALLOW_BASE = CHAR_LOWER + CHAR_UPPER + NUMBER + OTHER_CHAR;
    private static final SecureRandom random = new SecureRandom();

    public String generateTemporaryPassword(int length) {
        if (length < 8) length = 10;
        StringBuilder sb = new StringBuilder(length);

        // Ensure at least one character of each type
        sb.append(CHAR_LOWER.charAt(random.nextInt(CHAR_LOWER.length())));
        sb.append(CHAR_UPPER.charAt(random.nextInt(CHAR_UPPER.length())));
        sb.append(NUMBER.charAt(random.nextInt(NUMBER.length())));
        sb.append(OTHER_CHAR.charAt(random.nextInt(OTHER_CHAR.length())));

        for (int i = 4; i < length; i++) {
            sb.append(PASSWORD_ALLOW_BASE.charAt(random.nextInt(PASSWORD_ALLOW_BASE.length())));
        }

        char[] passChars = sb.toString().toCharArray();
        for (int i = 0; i < passChars.length; i++) {
            int j = random.nextInt(passChars.length);
            char temp = passChars[i];
            passChars[i] = passChars[j];
            passChars[j] = temp;
        }

        return new String(passChars);
    }
}
