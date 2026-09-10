package nl.soilwise.repo.pdf;

import java.util.Date;

public class PdfParseDocling {
    private String doclingStatus;
    private String doclingContent;
    private Date doclingProcessTime;

    public PdfParseDocling(String doclingStatus, String doclingContent) {
        this.doclingStatus = doclingStatus;
        this.doclingContent = doclingContent;
    }

    public String getDoclingStatus() {
        return doclingStatus;
    }

    public void setDoclingStatus(String doclingStatus) {
        this.doclingStatus = doclingStatus;
    }

    public String getDoclingContent() {
        return doclingContent;
    }

    public void setDoclingContent(String doclingContent) {
        this.doclingContent = doclingContent;
    }

    public Date getDoclingProcessTime() {
        return doclingProcessTime;
    }

    public void setDoclingProcessTime(Date doclingProcessTime) {
        this.doclingProcessTime = doclingProcessTime;
    }
}
