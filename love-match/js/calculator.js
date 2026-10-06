import { getCanonicalPair, hashString, createPRNG } from './hash.js';

export function calculateCompatibility(nameA, nameB) {
    const pair = getCanonicalPair(nameA, nameB);
    if (!pair) return null;

    const seed = hashString(pair);
    const prng = createPRNG(seed);

    // 1. Skor Utama Deterministik dalam rentang 50% - 99% (Batas bawah 50%)
    const finalScore = Math.floor(prng() * 50) + 50;

    // Helper untuk menghasilkan variasi alami di sekitar finalScore (selalu di antara 50% - 99%)
    const getDimScore = () => {
        // Variasi offset antara -8 hingga +8
        const offset = Math.floor((prng() * 17) - 8);
        const val = finalScore + offset;
        return Math.min(99, Math.max(50, val));
    };

    // 2. Lima Dimensi Bervariasi Secara Alami Di Sekitar Skor Utama
    const chemistry = getDimScore();
    const communication = getDimScore();
    const energy = getDimScore();
    const harmony = getDimScore();
    const attraction = getDimScore();

    const dimensions = {
        chemistry,
        communication,
        energy,
        harmony,
        attraction
    };

    // Mencari dimensi tertinggi untuk Match Type
    let highestDimension = 'chemistry';
    let maxVal = chemistry;

    for (const [key, val] of Object.entries(dimensions)) {
        if (val > maxVal) {
            maxVal = val;
            highestDimension = key;
        }
    }

    return {
        pair,
        seed,
        finalScore,
        dimensions,
        highestDimension
    };
}
