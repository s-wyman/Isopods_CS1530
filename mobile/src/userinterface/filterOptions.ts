export type FilterOption = { key: string; label: string };

export const FOOD_TYPES: FilterOption[] = [
    { key: 'produce', label: 'Produce' },
    { key: 'meat', label: 'Meat' },
    { key: 'seafood', label: 'Seafood' },
    { key: 'dairy-eggs', label: 'Dairy & Eggs' },
    { key: 'bread-bakery', label: 'Bread & Bakery' },
    { key: 'grains-pasta', label: 'Grains & Pasta' },
    { key: 'canned-jarred', label: 'Canned & Jarred' },
    { key: 'condiments-sauces', label: 'Condiments & Sauces' },
    { key: 'snacks', label: 'Snacks' },
    { key: 'sweets', label: 'Sweets' },
    { key: 'beverages', label: 'Beverages' },
    { key: 'other', label: 'Other' },
];

export function labelFor(options: FilterOption[], key: string): string {
    return options.find((option) => option.key === key.toLowerCase())?.label ?? key;
}