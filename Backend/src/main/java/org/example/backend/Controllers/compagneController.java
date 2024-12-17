package org.example.backend.Controllers;

import org.example.backend.Entities.Compagne;
import org.example.backend.Repository.CompagneRepsitory;
import org.example.backend.Service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/compagnes")

@CrossOrigin("*")
public class compagneController {

    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private CompagneRepsitory compagneRepository;



    @PostMapping("/create")
    public ResponseEntity<?> createCompagne(
            @RequestParam("titre") String titre,
            @RequestParam("description") String description,
            @RequestParam("Montant_necessaire") Double montantNecessaire,
            @RequestParam("date_final") String dateFinal,
            @RequestParam("id_Auteur") Long idAuteur,
            @RequestPart("file") MultipartFile file) {

        try {
            // Conversion de la date
            Date finalDate = new SimpleDateFormat("yyyy-MM-dd").parse(dateFinal);

            // Téléchargement de l'image sur Cloudinary
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);
            String imageUrl = (String) uploadResult.get("url");
            String publicId = (String) uploadResult.get("public_id");

            // Création de l'objet Compagne
            Compagne compagne = new Compagne();
            compagne.setTitre(titre);
            compagne.setDescription(description);
            compagne.setMontant_necessaire(montantNecessaire);
            compagne.setDate_final(finalDate);
            compagne.setPhotoUrl(imageUrl);
            compagne.setCloudinaryPublicId(publicId);
            compagne.setSlug(generateSlug(titre));
            compagne.setIdAuteur(idAuteur);
            compagne.setMontant(0.0);
            // Sauvegarde dans la base de données
            Compagne newCompagne = compagneRepository.save(compagne);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("slug",compagne.getSlug()));

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création de la campagne : " + ex.getMessage());
        }
    }

    // Générer un slug à partir du titre
    private String generateSlug(String titre) {
        return     UUID.randomUUID().toString().substring(0, 8); // Slug court

    }



    @GetMapping("/{slug}")
    public ResponseEntity<?> getCompagneBySlug(@PathVariable("slug") String slug) {
        try {
            // Rechercher la campagne par son slug
            Compagne compagne = compagneRepository.findBySlug(slug);

            // Vérifier si la campagne existe
            if (compagne == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune campagne trouvée avec ce slug.");
            }

            return ResponseEntity.ok(compagne);

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la récupération de la campagne : " + ex.getMessage());
        }
    }

    @GetMapping("/by-auteur/{idAuteur}")
    public ResponseEntity<?> getCompagnesByAuteur(@PathVariable("idAuteur") Long idAuteur) {
        try {
            // Récupérer la liste des campagnes par idAuteur
            List<Compagne> compagnes = compagneRepository.findByIdAuteur(idAuteur);

            // Vérifier si la liste est vide
            if (compagnes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune campagne trouvée pour cet auteur.");
            }

            // Vérifier si chaque campagne est terminée
            Date today = new Date();
            for (Compagne compagne : compagnes) {
                if (compagne.getDate_final().before(today)) {
                    compagne.setIsTermine(true);
                }
            }

            // Sauvegarder les mises à jour (si nécessaire)
            compagneRepository.saveAll(compagnes);

            return ResponseEntity.ok(compagnes);

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la récupération des campagnes : " + ex.getMessage());
        }
    }


    @GetMapping("/all")
    public ResponseEntity<?> getAllCompagnes() {
        try {
            // Récupérer toutes les campagnes
            List<Compagne> compagnes = compagneRepository.findAll();

            // Vérifier si la liste est vide
            if (compagnes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune campagne trouvée.");
            }

            // Vérifier si chaque campagne est terminée
            Date today = new Date();
            for (Compagne compagne : compagnes) {
                if (compagne.getDate_final().before(today)) {
                    compagne.setIsTermine(true);
                }
            }


            // Sauvegarder les mises à jour (si nécessaire)
            compagneRepository.saveAll(compagnes);

            // Récupérer les campagnes non terminées
            List<Compagne> l = compagneRepository.findByIsTermineFalse();

            // Vérifier si la liste est vide
            if (compagnes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune campagne non terminée trouvée.");
            }

            return ResponseEntity.ok(l);

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la récupération des campagnes : " + ex.getMessage());
        }
    }

}
