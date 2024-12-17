package org.example.backend.Repository;

import org.example.backend.Entities.Compagne;
import org.example.backend.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompagneRepsitory extends JpaRepository<Compagne, Long> {
    Compagne findBySlug(String slug);
    List<Compagne> findByIdAuteur(Long idAuteur);
    List<Compagne> findByIsTermineFalse();


}
