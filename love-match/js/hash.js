import { normalizeName } from './normalize.js';

export function getCanonicalPair(nameA, nameB) {
    const normA = normalizeName(nameA);
    const normB = normalizeName(nameB);
    
    // Validasi input tidak boleh kosong setelah normalisasi
    if (!normA || !normB) return null;
    
    return [normA, normB].sort().join("|");
}

export function hashString(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    // Konversi signed 32-bit int menjadi unsigned 32-bit positive integer (>>> 0)
    return hash >>> 0;
}

// Pseudo-Random Generator Deterministik (Seeded PRNG)
export function createPRNG(seed) {
    let s = seed;
    return function() {
        s |= 0; 
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
