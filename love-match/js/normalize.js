export function normalizeName(name) {
    if (typeof name !== "string") return "";

    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[^A-Z]/g, "");
}
