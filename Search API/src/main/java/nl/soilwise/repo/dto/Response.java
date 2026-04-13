package nl.soilwise.repo.dto;

import com.google.gson.Gson;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Response {
    private Object value;
    private String message;
    private String error;

    public String toJson() {
        return new Gson().toJson(this);
    }
}
