package nl.soilwise.repo.pdf;

import java.util.Date;

public class PdfParseGrobid {
    private String grobidStatus;
    private String grobidContent;
    private Date grobidProcessTime;

    public String getGrobidStatus() {
        return grobidStatus;
    }

    public void setGrobidStatus(String grobidStatus) {
        this.grobidStatus = grobidStatus;
    }

    public String getGrobidContent() {
        return grobidContent;
    }

    public void setGrobidContent(String grobidContent) {
        this.grobidContent = grobidContent;
    }

    public Date getGrobidProcessTime() {
        return grobidProcessTime;
    }

    public void setGrobidProcessTime(Date grobidProcessTime) {
        this.grobidProcessTime = grobidProcessTime;
    }


}
