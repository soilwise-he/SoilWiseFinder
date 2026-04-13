package nl.soilwise.repo.domain;


public class SearchInputSortConfiguration {
    private SortFields field;
    private Order order;

    public SearchInputSortConfiguration() {
        field = SortFields.SCORE;
        order = Order.DESC;
    }

    public SortFields getField() {
        return field;
    }

    public void setField(SortFields field) {
        this.field = field;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public enum SortFields {
        DATE("date"),
        SCORE("score");

        public String getSolrValue() {
            return solrValue;
        }

        final String solrValue;
        SortFields(String solrValue){
            this.solrValue = solrValue;
        }
    }
    public enum Order {
        ASC("asc"),
        DESC("desc");

        public String getSolrValue() {
            return solrValue;
        }

        final String solrValue;
        Order(String solrValue){
            this.solrValue = solrValue;
        }
    }

}
