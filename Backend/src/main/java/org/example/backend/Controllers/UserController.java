package org.example.backend.Controllers;

import org.example.backend.Entities.User;
import org.example.backend.Repository.UserRepository;
import org.example.backend.Service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CloudinaryService cloudinaryService;


    public static String hashPassword(String password) throws NoSuchAlgorithmException {
        // Créez une instance de SHA-256
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        // Hachez le mot de passe
        byte[] hashedBytes = md.digest(password.getBytes());

        // Convertissez les octets en une chaîne hexadécimale
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashedBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
    @PostMapping("/create")
    public ResponseEntity<?> createUser(
            @RequestParam("nom") String nom,
            @RequestParam("prenom") String prenom,
            @RequestParam("cin") String cin,
            @RequestParam("email") String email,
            @RequestParam("telephone") String telephone,
            @RequestParam("password") String password,
            @RequestParam("dob") String dob,
            @RequestParam("address") String address,
            @RequestParam("paypal") String paypal,
            @RequestParam("description") String description,
            @RequestPart("file") MultipartFile file) {
        try {
            // Vérifier si l'email existe déjà
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Un utilisateur avec cet email existe déjà.");
            }


            // Mapper les champs reçus au modèle User
            User user = new User();
            user.setNom(nom);
            user.setPrenom(prenom);
            user.setCIN(cin);
            user.setEmail(email);
            user.setTelephone(telephone);
            user.setMotDePasse(password);
            user.setDateDeNaissance(LocalDate.parse(dob));
            user.setAdresse(address);
            user.setPaypal(paypal);
            user.setDescription(description);

            String hashedPassword = hashPassword(user.getMotDePasse());
            user.setMotDePasse(hashedPassword);
            System.out.println("Mot de passe haché : " + hashedPassword);
            // Cloudinary : Télécharger l'image
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);

            // Obtenir l'URL et le public_id de la réponse Cloudinary
            String imageUrl = (String) uploadResult.get("url");
            String publicId = (String) uploadResult.get("public_id");

            user.setCloudinaryPublicId(publicId);
            user.setPhotoUrl(imageUrl);



            User newUser = userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création de l'utilisateur : " + ex.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) throws NoSuchAlgorithmException {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Vérifier si l'utilisateur existe
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email introuvable.");
        }

        User user = userOptional.get();

        // Hacher le mot de passe reçu pour comparaison
        String hashedPassword = hashPassword(password);


        // Comparer le mot de passe haché
        if (!user.getMotDePasse().equals(hashedPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mot de passe incorrect.");
        }

        // Si tout est correct
        return ResponseEntity.ok(Map.of("message", "Connexion réussie!", "id", user.getId()));

    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable.");
            }

            User user = userOptional.get();
            return ResponseEntity.ok(user); // Retourner l'utilisateur trouvé
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la récupération de l'utilisateur : " + ex.getMessage());
        }
    }




    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String prenom,
            @RequestParam(required = false) String cin,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String telephone,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) String dob,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String paypal,
            @RequestParam(required = false) String description) {
        try {
            // Récupérer l'utilisateur à mettre à jour
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable.");
            }

            User user = userOptional.get();

            // Mettre à jour uniquement les champs non nuls
            if (nom != null && !nom.isEmpty()) user.setNom(nom);
            if (prenom != null && !prenom.isEmpty()) user.setPrenom(prenom);
            if (cin != null && !cin.isEmpty()) user.setCIN(cin);
            if (email != null && !email.isEmpty()) user.setEmail(email);
            if (telephone != null && !telephone.isEmpty()) user.setTelephone(telephone);
            if (password != null && !password.isEmpty()) {
                String hashedPassword = hashPassword(password);
                user.setMotDePasse(hashedPassword);
            }
            if (dob != null && !dob.isEmpty()) user.setDateDeNaissance(LocalDate.parse(dob));
            if (address != null && !address.isEmpty()) user.setAdresse(address);
            if (paypal != null && !paypal.isEmpty()) user.setPaypal(paypal);
            if (description != null && !description.isEmpty()) user.setDescription(description);



            // Sauvegarder les modifications
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Utilisateur mis à jour avec succès !"));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour de l'utilisateur : " + ex.getMessage());
        }
    }




    @PostMapping("/email")

    public  Boolean existEmail(@RequestParam String email) {

        if(userRepository.existsByEmail(email)){
            return true;
        }
        return false;
    }

}
