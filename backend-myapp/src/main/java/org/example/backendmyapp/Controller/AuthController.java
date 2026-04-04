package org.example.backendmyapp.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.example.backendmyapp.Model.User;
import org.example.backendmyapp.Respository.UserRepository;
import org.example.backendmyapp.util.JwtUtil; // 💡 Import cái này
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username đã tồn tại");
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User login) {
        Optional<User> userOpt = userRepository.findByUsername(login.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(login.getPassword())) {
                String token = jwtUtil.generateToken(user.getId()); 
                Map<String, String> response = new HashMap<>();
                response.put("token", token); 
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
    }
}