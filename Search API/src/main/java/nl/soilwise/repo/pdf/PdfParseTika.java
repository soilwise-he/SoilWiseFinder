package nl.soilwise.repo.pdf;

import java.util.Date;

public class PdfParseTika {
    private String tikaStatus;
    private String tikaContent;
    private Date tikaProcessTime;

    public String getTikaStatus() {
        return tikaStatus;
    }

    public void setTikaStatus(String tikaStatus) {
        this.tikaStatus = tikaStatus;
    }

    public String getTikaContent() {
        return tikaContent;
    }

    public void setTikaContent(String tikaContent) {
        this.tikaContent = tikaContent;
    }

    public Date getTikaProcessTime() {
        return tikaProcessTime;
    }

    public void setTikaProcessTime(Date processTime) {
        this.tikaProcessTime = processTime;
    }
}
