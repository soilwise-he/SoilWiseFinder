package nl.soilwise.repo.pdf;

public class PdfItemBase {
    private String identifier;
    private String pdfurl;
    private String downloadMessage;
    private String tikaStatus;
    private String grobidStatus;
    private String doclingStatus;

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPdfurl() {
        return pdfurl;
    }

    public void setPdfurl(String pdfurl) {
        this.pdfurl = pdfurl;
    }

    public String getDownloadMessage() {
        return downloadMessage;
    }

    public void setDownloadMessage(String downloadMessage) {
        this.downloadMessage = downloadMessage;
    }

    public String getGrobidStatus() {
        return grobidStatus;
    }

    public void setGrobidStatus(String grobidStatus) {
        this.grobidStatus = grobidStatus;
    }

    public String getTikaStatus() {
        return tikaStatus;
    }

    public void setTikaStatus(String tikaStatus) {
        this.tikaStatus = tikaStatus;
    }

    public String getDoclingStatus() {
        return doclingStatus;
    }

    public void setDoclingStatus(String doclingStatus) {
        this.doclingStatus = doclingStatus;
    }

}
