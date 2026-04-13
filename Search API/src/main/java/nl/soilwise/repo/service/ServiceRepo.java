package nl.soilwise.repo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ServiceRepo {


    private JdbcTemplate jdbcTemplate;

    public ServiceRepo(@Autowired JdbcTemplate jdbcTemplate ) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer livenessProbe() {
        return this.jdbcTemplate.queryForObject("SELECT 1", Integer.class);
    }

    public List<String> distinctResources() { return new ArrayList<String>(); }

}
