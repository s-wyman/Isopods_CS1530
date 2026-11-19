package isopods.logic.foodinventoryviewer;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class ExpirationStatusTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 11, 18);

    @Test
    void dateBeforeTodayIsExpired() {
        assertEquals(ExpirationStatus.EXPIRED, ExpirationStatus.of(TODAY.minusDays(1), TODAY));
    }

    @Test
    void dateTodayIsExpiringSoon() {
        assertEquals(ExpirationStatus.EXPIRING_SOON, ExpirationStatus.of(TODAY, TODAY));
    }

    @Test
    void dateThreeDaysAwayIsExpiringSoon() {
        assertEquals(ExpirationStatus.EXPIRING_SOON, ExpirationStatus.of(TODAY.plusDays(3), TODAY));
    }

    @Test
    void dateFourDaysAwayIsFresh() {
        assertEquals(ExpirationStatus.FRESH, ExpirationStatus.of(TODAY.plusDays(4), TODAY));
    }

}