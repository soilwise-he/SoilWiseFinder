UPDATE pdfdata_link
SET error = 'NO_BLOCKS PDF empty content'
WHERE error LIKE '%[NO_BLOCKS] PDF parsing resulted in empty content%';

UPDATE pdfdata_link
SET error = REPLACE(error, '==> prepareXmlGrobid ', '')
WHERE error LIKE '%==> prepareXmlGrobid %';

UPDATE pdfdata_link
SET error = REPLACE(error, ' on POST request for "https://grobid.soilwise-he.containers.wur.nl/api/processFulltextDocument":', '')
WHERE error LIKE '% on POST request for "https://grobid.soilwise-he.containers.wur.nl/api/processFulltextDocument":%';

UPDATE pdfdata_link
SET error = 'Read timed out'
WHERE error LIKE '%Read timed out%';

UPDATE pdfdata_link
SET error = '502 Bad Gateway'
WHERE error LIKE '%502 Bad Gateway%';

UPDATE pdfdata_link
SET error = '503 Service Temporarily Unavailable'
WHERE error LIKE '%503 Service Temporarily Unavailable%';

UPDATE pdfdata_link
SET error = 'HTTP 404 Not Found'
WHERE error LIKE '%pdfDataIngestion 404%';

UPDATE pdfdata_link
SET error = 'HTTP 403 Forbidden'
WHERE error LIKE '%pdfDataIngestion 403%';

UPDATE pdfdata_link
SET error = 'HTTP 401 Unauthorized'
WHERE error LIKE '%pdfDataIngestion 401%';

UPDATE pdfdata_link
SET error = 'HTTP 410 Gone'
WHERE error LIKE '%pdfDataIngestion 410%';

UPDATE pdfdata_link
SET error = 'HTTP 500 Server Error'
WHERE error LIKE '%pdfDataIngestion 500%';

UPDATE pdfdata_link
SET error = 'HTTP 503 Service Unavailable'
WHERE error LIKE '%pdfDataIngestion 503%';

UPDATE pdfdata_link
SET error = 'HTTP I/O error Circular redirect'
WHERE error LIKE '%pdfDataIngestion I/O error%';

select count(*)
from linky.links l
left join linky.records r on r.id = l.fk_record 
where l.id_link not in (select pl.link_id from public.pdfdata_link pl) and l.link_type = 'application/pdf';

select l.id_link, r.record_id 
from linky.links l
left join linky.records r on r.id = l.fk_record 
where l.id_link not in (select pl.link_id from public.pdfdata_link pl) and l.link_type = 'application/pdf'
order by r.record_id;

SELECT *
FROM (
    SELECT
        id,
        record_id,
        ROW_NUMBER() OVER (ORDER BY record_id, link_id) AS expected_id
    FROM public.pdfdata_link
) sub
WHERE id != expected_id;

SELECT *
FROM (
    SELECT
        id,
        record_id,
        order_,
        ROW_NUMBER() OVER (PARTITION BY record_id ORDER BY id) - 1 AS expected_order
    FROM public.pdfdata_link
) sub
WHERE order_ != expected_order;

