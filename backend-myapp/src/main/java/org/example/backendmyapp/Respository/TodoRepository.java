package org.example.backendmyapp.Respository;

import org.example.backendmyapp.Model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, String> {
    List<Todo> findByUserId(Long userId);

}
