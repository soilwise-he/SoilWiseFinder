package nl.soilwise.repo.domain;


/*
{
                                                   "wkt": "MOOIE WKT STRING",
                                                   "operation": "INTERSECTS OF WITHIN"
                                                 }
 */
public class SpatialCoverageFilterInput {
    private String wkt;
    private String operation;

    public String getWkt() {
        return wkt;
    }

    public void setWkt(String wkt) {
        this.wkt = wkt;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public boolean isValid(){
        return true;
    }
}
