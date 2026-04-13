package nl.soilwise.repo.domain;

import java.util.List;


/*
{
                                               "query": "pollen",
                                               "filters": ,
                                               "pagesize":10,
                                               "offset":10,
                                               "sort": {
                                                 "field": "date OR score (DEFAULT)",
                                                 "order": "desc (DEFAULT)"
                                               }
                                             }

 */


public class SearchInput {
    private String query;
    private SearchInputFilters filters;
    private SearchInputSortConfiguration sort;
    private Integer pagesize = 10;
    private Integer offset = 0;

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public SearchInputFilters getFilters() {
        return filters;
    }

    public void setFilters(SearchInputFilters filters) {
        this.filters = filters;
    }

    public SearchInputSortConfiguration getSort() {
        return sort;
    }

    public void setSort(SearchInputSortConfiguration sort) {
        this.sort = sort;
    }

    public Integer getPagesize() {
        return pagesize;
    }

    public void setPagesize(Integer pagesize) {
        this.pagesize = pagesize;
    }

    public Integer getOffset() {
        return offset;
    }

    public void setOffset(Integer offset) {
        this.offset = offset;
    }

}
