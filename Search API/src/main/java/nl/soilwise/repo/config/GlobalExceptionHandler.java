package nl.soilwise.repo.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import nl.soilwise.repo.dto.Response;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ Exception.class })
    public ResponseEntity<?> handleException(Exception ex, WebRequest request) {
        String requestUri = request.getDescription(false);

        if (requestUri.contains("/favicon.ico")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Not Found");
        }

        return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new Response(null, null, ex.getClass().getName() + " " + ex.getMessage()));
    }
}
