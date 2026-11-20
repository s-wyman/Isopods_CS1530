package isopods.logic.foodinventoryviewer;

/**
 * The order of the inventory list, chosen by the "sort" query parameter.
 */

public enum SortOrder {

    NONE,
    ASCENDING,
    DESCENDING;

    /**
     * Returns ASCENDING for "asc", DESCENDING for "desc", and NONE for anything else,
     * including a missing parameter.
     */

    public static SortOrder parse(String param) {

        if ("asc".equalsIgnoreCase(param))
            return ASCENDING;
        if ("desc".equalsIgnoreCase(param))
            return DESCENDING;

        return NONE;
        
    }

}
