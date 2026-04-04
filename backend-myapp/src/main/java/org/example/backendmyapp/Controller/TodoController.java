package org.example.backendmyapp.Controller;

import org.example.backendmyapp.Model.Todo;
import org.example.backendmyapp.Model.User;
import org.example.backendmyapp.Respository.TodoRepository;
import org.example.backendmyapp.Respository.UserRepository;
import org.example.backendmyapp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin("*")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;
//    @GetMapping
//    public List<Todo> getAllTodosByUserId(@RequestParam(required = false) Long userId) {
//        if (userId != null) {
//            return todoRepository.findByUserId(userId);
//        }
//        return todoRepository.findAll();
//    }
    @GetMapping
    public List<Todo> getAllTodos(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        Long userId = jwtUtil.extractUserId(jwt);
        return todoRepository.findByUserId(userId);
    }
    @PostMapping
    public Todo createTodo(@RequestHeader("Authorization") String token, @RequestBody Todo todo) {
        String jwt = token.substring(7);
        Long userId = jwtUtil.extractUserId(jwt);
        User user = userRepository.findById(userId).orElse(null);
        todo.setUser(user);
        if(todo.getIsDone() == null) todo.setIsDone(false);
        return todoRepository.save(todo);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable String id) {
        todoRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable String id, @RequestBody Todo todoDetails) {
        return todoRepository.findById(id).map(todo -> {
            todo.setTitle(todoDetails.getTitle());
            todo.setDescription(todoDetails.getDescription());
            todo.setIsDone(todoDetails.getIsDone());
            todo.setImageBase64(todoDetails.getImageBase64());
            return ResponseEntity.ok(todoRepository.save(todo));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public String generateFakeData() {
        List<Todo> fakeList = new ArrayList<>();
        for (int i = 1; i <= 200000; i++) {
            Todo t = new Todo();
            t.setTitle("Công việc test thứ " + i);
            t.setIsDone(i % 2 == 0);
            fakeList.add(t);
        }
        todoRepository.saveAll(fakeList);
        return "Đã đẻ thành công 200.000 task!";
    }
}