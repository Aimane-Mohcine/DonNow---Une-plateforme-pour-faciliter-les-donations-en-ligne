package org.example.backend.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity




public class Compagne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
     Long idAuteur; // Identifiant de l'auteur
    String titre ;
    @Column(length = 1000)
    String description ;
    Double Montant_necessaire;
    Double Montant;
    Date date_final;
    @Column(nullable = false) // Ajoutez cette annotation
    private Boolean isTermine = false;
    @Lob
    private String photoUrl; // URL de la photo stockée dans Cloudinary

    @Lob
    private String cloudinaryPublicId; // Public ID pour Cloudinary


    private String slug;



    // Getters et Setters

    // Getters et Setters
    public Boolean getIsTermine() {
        return isTermine;
    }

    public void setIsTermine(Boolean isTermine) {
        this.isTermine = isTermine;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdAuteur() {
        return idAuteur;
    }

    public void setIdAuteur(Long idAuteur) {
        this.idAuteur = idAuteur;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getMontant_necessaire() {
        return Montant_necessaire;
    }

    public void setMontant_necessaire(Double montant_necessaire) {
        Montant_necessaire = montant_necessaire;
    }

    public Double getMontant() {
        return Montant;
    }

    public void setMontant(Double montant) {
        Montant = montant;
    }

    public Date getDate_final() {
        return date_final;
    }

    public void setDate_final(Date date_final) {
        this.date_final = date_final;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getCloudinaryPublicId() {
        return cloudinaryPublicId;
    }

    public void setCloudinaryPublicId(String cloudinaryPublicId) {
        this.cloudinaryPublicId = cloudinaryPublicId;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }
}
