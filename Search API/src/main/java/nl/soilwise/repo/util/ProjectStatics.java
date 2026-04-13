package nl.soilwise.repo.util;

import java.text.SimpleDateFormat;
import java.util.TimeZone;

public class ProjectStatics {
    public static TimeZone UTC = TimeZone.getTimeZone("UTC");
    public static SimpleDateFormat SDF_DATE_PLUS_TIME = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssX");
    static {
        SDF_DATE_PLUS_TIME.setTimeZone(UTC);
    }


}
