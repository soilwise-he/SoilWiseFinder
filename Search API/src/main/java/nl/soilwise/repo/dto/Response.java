package nl.soilwise.repo.dto;

import com.google.gson.Gson;

public class Response {
    private Object value;
    private String message;
    private String error;

    public Response(Object value, String message, String error) {
        this.value = value;
        this.message = message;
        this.error = error;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String toJson() {
        return new Gson().toJson(this);
    }
}