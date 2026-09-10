package nl.soilwise.repo.pdf;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class PdfRepository {
    public final static Logger log = LoggerFactory.getLogger(PdfRepository.class);

    @Value("${grobid-server.enabled:false}")
    private boolean grobid_server_enabled;

    @Value("${docling_server.enabled:false}")
    private boolean docling_server_enabled;

    private JdbcTemplate jdbcTemplate;

    public PdfRepository(@Autowired JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate=jdbcTemplate;
        log.info("constructed PdfRepository with JdbcTemplate : "+jdbcTemplate);
    }


    public @NonNull List<PdfItemBase> fetchUncheckedTikaGrobidDoclingItems(Integer limit) {
        String sql =  """
        select identifier, pdfurl, download_message, tika_status, grobid_status, docling_status 
        from metadata.pdf_items 
        where tika_status is null 
        or grobid_status is null 
        or docling_status is null
        """;
        if (limit!=null && limit>0) {
            sql+=" limit "+limit;
        }

        ObjectMapper objectMapper = new ObjectMapper();
        RowMapper<PdfItemBase> mapper = (rs, rownum) -> {
            PdfItemBase pdfItem = new PdfItemBase();
            pdfItem.setIdentifier(rs.getString("identifier"));
            pdfItem.setPdfurl(rs.getString("pdfurl"));
            pdfItem.setDownloadMessage(rs.getString("download_message"));
            pdfItem.setTikaStatus(rs.getString("tika_status"));
            pdfItem.setGrobidStatus(rs.getString("grobid_status"));
            pdfItem.setDoclingStatus(rs.getString("docling_status"));
            return pdfItem;
        };

        List<PdfItemBase> pdfItems = jdbcTemplate.query(sql, mapper);
        return pdfItems;
    }

    public @NonNull List<PdfItemBase> fetchUncheckedTikaItems(Integer limit) {
        String sql =  "select identifier, pdfurl, download_message, tika_status from metadata.pdf_items where tika_status is null";
        if (limit!=null && limit>0) {
            sql+=" limit "+limit;
        }

        ObjectMapper objectMapper = new ObjectMapper();
        RowMapper<PdfItemBase> mapper = (rs, rownum) -> {
            PdfItemBase pdfItem = new PdfItemBase();
            pdfItem.setIdentifier(rs.getString("identifier"));
            pdfItem.setPdfurl(rs.getString("pdfurl"));
            pdfItem.setDownloadMessage(rs.getString("download_message"));
            pdfItem.setTikaStatus(rs.getString("tika_status"));
            return pdfItem;
        };

        List<PdfItemBase> pdfItems = jdbcTemplate.query(sql, mapper);
        return pdfItems;
    }

    public void updatePdfItemDownloadStatus(PdfItemBase pdfItem) {
        StringBuffer sbStatus = new StringBuffer();
        if (pdfItem.getTikaStatus()==null) {
            sbStatus.append(", tika_status = 'SCREENED'");
        }

        if (pdfItem.getGrobidStatus()==null) {
            if (grobid_server_enabled)
                sbStatus.append(", grobid_status = 'SCREENED'");
            else
                sbStatus.append(", grobid_status = 'DISABLED'");
        }
        if (pdfItem.getDoclingStatus()==null) {
            if (docling_server_enabled)
                sbStatus.append(", docling_status = 'SCREENED'");
            else
                sbStatus.append(", docling_status = 'DISABLED'");
        }

        String sql = "update metadata.pdf_items set download_message = ? "+sbStatus.toString()
                    +" where identifier = ? and pdfurl = ? ";
        jdbcTemplate.update(sql,pdfItem.getDownloadMessage(), pdfItem.getIdentifier(), pdfItem.getPdfurl());
    }

    public void updateTikaColumnsForPdfItem(PdfParseTika tika, String identifier, String url) {
        String sql = """
                update metadata.pdf_items set   
                tika_status = ? ,
                tika_content = ?,
                tika_process_time = ?
                where identifier = ? and pdfurl = ?
                """;
        jdbcTemplate.update(sql, tika.getTikaStatus(),tika.getTikaContent(), new Date(), identifier, url);
    }

    public void updateGrobidColumnsForPdfItem(PdfParseGrobid grobid, String identifier, String url)  {
        String sql = """
                update metadata.pdf_items set
                grobid_status = ? ,
                grobid_content = ?,
                grobid_process_time = ?
                where identifier = ? and pdfurl = ?
                """;
        jdbcTemplate.update(sql,grobid.getGrobidStatus(),grobid.getGrobidContent(), new Date(), identifier, url);
    }

    public void updateDoclingColumnsForPdfItem(PdfParseDocling docling, String identifier, String url) {
        String sql = """
                update metadata.pdf_items set 
                docling_status = ? ,
                docling_content = ?
                where identifier = ? and pdfurl = ?
                """;
        jdbcTemplate.update(sql,docling.getDoclingStatus(), docling.getDoclingContent(), identifier, url);
    }
}

