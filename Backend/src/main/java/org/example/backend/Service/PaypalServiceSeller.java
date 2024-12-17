package org.example.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaypalServiceSeller {
    @Value("${paypal.client-id}")
    private String clientId;
    @Value("${paypal.client-secret}")
    private String clientSecret;
    @Value("${paypal.mode}")
    private String mode;

    private final RestTemplate restTemplate;
    public PaypalServiceSeller(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }



    public String getAccessToken() {
        String auth = clientId + ":" + clientSecret;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Basic " + encodedAuth);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<>("grant_type=client_credentials", headers);

        String url = mode.equals("live") ?
                "https://api.paypal.com/v1/oauth2/token" :
                "https://api.sandbox.paypal.com/v1/oauth2/token";

        Map<String, String> response = restTemplate.postForObject(url, request, Map.class);
        return response.get("access_token");
    }

    public void sendPayout(String recipientEmail, String amount, String currency, String note) {
        String accessToken = getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        Map<String, String> senderBatchHeader = new HashMap<>();
        senderBatchHeader.put("sender_batch_id", "batch_" + System.currentTimeMillis());
        senderBatchHeader.put("email_subject", "You have a payment");

        Map<String, Object> payoutItem = new HashMap<>();
        payoutItem.put("recipient_type", "EMAIL");
        payoutItem.put("amount", Map.of("value", amount, "currency", currency));
        payoutItem.put("receiver", recipientEmail);
        payoutItem.put("note", note);
        payoutItem.put("sender_item_id", "item_" + System.currentTimeMillis());

        body.put("sender_batch_header", senderBatchHeader);
        body.put("items", new Object[] { payoutItem });

        String url = mode.equals("live") ?
                "https://api.paypal.com/v1/payments/payouts" :
                "https://api.sandbox.paypal.com/v1/payments/payouts";

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        restTemplate.postForObject(url, request, String.class);
    }
}
