package nl.soilwise.repo.pdf;

import java.util.List;
import java.util.Map;

public class ParsedPdf {
    private String title;
    private List<String> authors;
    private String text;

    public ParsedPdf() {
        this.title = title;
        this.authors = authors;
        this.text = text;
    }

    public ParsedPdf(String title, List<String> authors, String text) {
        this.title = title;
        this.authors = authors;
        this.text = text;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getAuthors() {
        return authors;
    }

    public void setAuthors(List<String> authors) {
        this.authors = authors;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }


    @Override
    public String toString() {
        return "ParsedPdf{" +
                "title='" + title + '\'' +
                ", authors=" + authors +
                ", text.length ='" + ((text==null)? null :text.length()) + '\'' +
                '}';
    }


}
