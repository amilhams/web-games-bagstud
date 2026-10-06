export function getShareURL(nameA, nameB) {
    const url = new URL(window.location.href);
    url.searchParams.set('a', nameA);
    url.searchParams.set('b', nameB);
    return url.toString();
}

export function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        nameA: params.get('a') || "",
        nameB: params.get('b') || ""
    };
}

export async function shareResult(nameA, nameB, score) {
    const shareUrl = getShareURL(nameA, nameB);
    const shareData = {
        title: 'Love Match Calculator - Bahagia Studio',
        text: `Kecocokan nama ${nameA} & ${nameB} adalah ${score}%! Cek kecocokan namamu di sini:`,
        url: shareUrl
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            return { success: true, method: 'native' };
        } catch (err) {
            // User cancelled share
            if (err.name !== 'AbortError') {
                console.warn('Web Share failed:', err);
            }
        }
    }

    // Fallback: Copy Link
    try {
        await navigator.clipboard.writeText(shareUrl);
        return { success: true, method: 'clipboard' };
    } catch (err) {
        console.error('Clipboard copy failed:', err);
        return { success: false, method: 'none' };
    }
}
