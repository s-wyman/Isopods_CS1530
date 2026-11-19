package isopods.logic.foodinventoryviewer;

import java.time.LocalDate;

/**
 * How close a food item is to its expiration date, as shown in the inventory list.
 */

public enum ExpirationStatus {

    FRESH,
    EXPIRING_SOON,
    EXPIRED;

    private static final int EXPIRING_SOON_DAYS = 3;

    /**
     * Returns EXPIRED after the expiration date, EXPIRING_SOON from three days before
     * through the expiration date itself, and FRESH otherwise.
     */

    public static ExpirationStatus of(LocalDate expirationDate, LocalDate today) {

        if (today.isAfter(expirationDate))
            return EXPIRED;
        if (!expirationDate.isAfter(today.plusDays(EXPIRING_SOON_DAYS)))
            return EXPIRING_SOON;

        return FRESH;
        
    }

}
