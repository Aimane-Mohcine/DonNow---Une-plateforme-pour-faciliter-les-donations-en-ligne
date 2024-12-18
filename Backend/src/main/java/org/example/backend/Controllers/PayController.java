package org.example.backend.Controllers;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.example.backend.Entities.Compagne;
import org.example.backend.Entities.User;
import org.example.backend.Repository.CompagneRepsitory;
import org.example.backend.Repository.UserRepository;
import org.example.backend.Service.PaypalServiceSend;
import org.example.backend.Service.PaypalServiceReceive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")

@CrossOrigin
public class PayController {

    @Autowired
    CompagneRepsitory compagneRepsitory;
    @Autowired
    UserRepository userRepository;


    private final PaypalServiceSend paypalServiceClient;
    @Autowired
    private PaypalServiceReceive paypalServiceSeller;

    public PayController(PaypalServiceSend paypalServiceClient) {
        this.paypalServiceClient = paypalServiceClient;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createPayment(
            @RequestParam("amount") String amount,
            @RequestParam("url") String baseUrl,
            @RequestParam("idUser") String idUser) {

        Map<String, Object> response = new HashMap<>();
        try {
            // Validation et parsing du montant
            Double parsedAmount = Double.parseDouble(amount);
            if (parsedAmount <= 0) {
                throw new IllegalArgumentException("Amount must be greater than zero.");
            }

            // Définir les détails du paiement
            String currency = "USD";
            String description = "Payment for user ID: " + idUser;

            String url = URLEncoder.encode(baseUrl, StandardCharsets.UTF_8.toString());
            // Construire les URLs dynamiques
            String cancelUrl = "http://localhost:4200/Donate/" + url + "/0";
            String successUrl = "http://localhost:4200/Donate/" + url + "/1";

            // Création de la transaction PayPal
            Payment payment = paypalServiceClient.createPayment(
                    parsedAmount,
                    currency,
                    "paypal",
                    "sale",
                    description,
                    cancelUrl,
                    successUrl
            );

            // Extraire l'URL d'approbation
            String redirectUrl = payment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel()))
                    .findFirst()
                    .map(link -> link.getHref())
                    .orElseThrow(() -> new IllegalStateException("Approval URL not found."));

            // Retourner la réponse avec l'URL d'approbation
            response.put("success", true);
            response.put("redirectUrl", redirectUrl);

            Compagne c = compagneRepsitory.findBySlug(baseUrl);
            c.setMontant(c.getMontant() + parsedAmount);
            compagneRepsitory.save(c);

            Long id = Long.parseLong(idUser);

            User user=userRepository.findById((id)).get();
this.sendPayout(user.getPaypal(),parsedAmount);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid input: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (PayPalRESTException e) {
            response.put("success", false);
            response.put("message", "Error creating payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    //-----------------------------------

    public    ResponseEntity<Map<String, String>> sendPayout(
          String recipientEmail,
             Double amount) {

        String currency = "USD"; // Devise par défaut
        String note = "Payout";  // Note par défaut

        Map<String, String> response = new HashMap<>();

        try {
            // Appel au service PayPal pour envoyer le paiement
            paypalServiceSeller.sendPayout(recipientEmail, amount.toString(), currency, note);

            // Si aucun exception n'est levée, le paiement a été envoyé avec succès
            response.put("status", "success");
            response.put("message", "Payout sent successfully to " + recipientEmail);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            // Gestion de l'exception et retour d'un message d'erreur
            response.put("status", "failure");
            response.put("message", "Payout failed: " + e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
