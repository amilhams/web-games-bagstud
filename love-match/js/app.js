import { calculateCompatibility } from './calculator.js';
import { getScoreTier, getMatchType } from './interpretation.js';
import { getURLParams, shareResult } from './share.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('match-form');
    const inputA = document.getElementById('name-a');
    const inputB = document.getElementById('name-b');
    const errorMsg = document.getElementById('error-msg');

    const landingSection = document.getElementById('landing-section');
    const videoSection = document.getElementById('video-section');
    const resultSection = document.getElementById('result-section');

    const matchVideo = document.getElementById('match-video');
    const videoScoreOverlay = document.getElementById('video-score-overlay');
    const videoScoreNumber = document.getElementById('video-score-number');
    const videoPairNames = document.getElementById('video-pair-names');

    const pairNamesDisplay = document.getElementById('pair-names-display');
    const tierDisplay = document.getElementById('tier-display');
    const cardWrapper = document.getElementById('card-wrapper');
    const cardImg = document.getElementById('card-img');
    const cardScoreNumber = document.getElementById('card-score-number');
    const cardPairNames = document.getElementById('card-pair-names');

    const matchTypeTitle = document.getElementById('match-type-title');
    const matchTypeDesc = document.getElementById('match-type-desc');

    const btnRetry = document.getElementById('btn-retry');
    const btnShare = document.getElementById('btn-share');
    const shareToast = document.getElementById('share-toast');

    let currentScore = 0;

    const resultContainer = document.getElementById('result-container');

    // Cek Query Parameter URL saat halaman dimuat
    const { nameA: urlA, nameB: urlB } = getURLParams();
    if (urlA && urlB) {
        inputA.value = urlA;
        inputB.value = urlB;
        startCalculation(urlA, urlB);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valA = inputA.value.trim();
        const valB = inputB.value.trim();

        if (!valA || !valB) {
            showError("Silakan masukkan kedua nama terlebih dahulu.");
            return;
        }

        hideError();
        startCalculation(valA, valB);
    });

    btnRetry.addEventListener('click', () => {
        if (resultContainer) resultContainer.style.display = 'none';
        resultSection.style.display = 'none';
        videoSection.style.display = 'none';
        landingSection.style.display = 'block';
        if (matchVideo) {
            matchVideo.pause();
            matchVideo.removeAttribute('src');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnShare.addEventListener('click', async () => {
        const valA = inputA.value.trim();
        const valB = inputB.value.trim();
        const score = `${currentScore}%`;

        const res = await shareResult(valA, valB, score);
        if (res.success) {
            showToast(res.method === 'clipboard' ? 'Tautan hasil telah disalin ke clipboard!' : 'Hasil berhasil dibagikan!');
        }
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }

    function hideError() {
        errorMsg.style.display = 'none';
    }

    function showToast(msg) {
        if (!shareToast) return;
        shareToast.textContent = msg;
        shareToast.classList.add('show');
        setTimeout(() => {
            shareToast.classList.remove('show');
        }, 3000);
    }

    function startCalculation(nameA, nameB) {
        const result = calculateCompatibility(nameA, nameB);
        if (!result) {
            showError("Nama yang dimasukkan tidak valid. Harap gunakan minimal satu huruf Latin.");
            return;
        }

        currentScore = result.finalScore;
        const tierInfo = getScoreTier(result.finalScore);

        // Sembunyikan Form Landing & Tampilkan Fullscreen Video Section
        landingSection.style.display = 'none';
        if (resultContainer) resultContainer.style.display = 'none';
        resultSection.style.display = 'none';
        videoSection.style.display = 'flex';
        videoScoreOverlay.style.display = 'none';

        // 1. Putar Loading Video (loading.mp4 - 5.15s)
        matchVideo.src = 'video/loading/loading.mp4';
        matchVideo.currentTime = 0;
        
        const playPromise = matchVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("Autoplay diproteksi browser, mengaktifkan muted playback:", err);
                matchVideo.muted = true;
                matchVideo.play();
            });
        }

        // Event listener saat Loading Video Selesai
        let overlayTriggered = false;

        const onLoadingEnded = () => {
            matchVideo.removeEventListener('ended', onLoadingEnded);

            // 2. Transisi ke Video Tier per Kategori (Video 1..4.mp4)
            matchVideo.src = tierInfo.video;
            matchVideo.currentTime = 0;
            matchVideo.play();

            // Atur posisi top & left overlay video sesuai tier
            videoScoreOverlay.style.top = `${tierInfo.videoTopPercent}%`;
            videoScoreOverlay.style.left = `${tierInfo.videoLeftPercent || 51.5}%`;
            videoPairNames.textContent = `${nameA.toUpperCase()} × ${nameB.toUpperCase()}`;

            // Handler Detik ke-5.0 pada Video Tier
            const onTimeUpdate = () => {
                if (matchVideo.currentTime >= 5.0 && !overlayTriggered) {
                    overlayTriggered = true;
                    videoScoreOverlay.style.display = 'block';
                    animateScoreText(videoScoreNumber, result.finalScore);
                }
            };

            const onTierEnded = () => {
                matchVideo.removeEventListener('timeupdate', onTimeUpdate);
                matchVideo.removeEventListener('ended', onTierEnded);
                
                // 3. Pindah ke Halaman Resume Card + Breakdown Dimensi
                renderResumePage(nameA, nameB, result, tierInfo);
            };

            matchVideo.addEventListener('timeupdate', onTimeUpdate);
            matchVideo.addEventListener('ended', onTierEnded);
        };

        matchVideo.addEventListener('ended', onLoadingEnded);
    }

    function renderResumePage(nameA, nameB, result, tierInfo) {
        videoSection.style.display = 'none';
        if (resultContainer) resultContainer.style.display = 'block';
        resultSection.style.display = 'block';

        const pairTitle = `${nameA.toUpperCase()} × ${nameB.toUpperCase()}`;
        pairNamesDisplay.textContent = pairTitle;
        tierDisplay.textContent = tierInfo.tier;

        // Render Resume Card Image & Data Tier Top Offset (Cardo Font Score Overlay)
        cardWrapper.setAttribute('data-tier', tierInfo.tierNum);
        cardImg.src = tierInfo.cardImg;
        cardScoreNumber.textContent = `${result.finalScore}%`;
        cardPairNames.textContent = pairTitle;

        // Render Match Archetype Text
        const matchTypeInfo = getMatchType(result.highestDimension);
        matchTypeTitle.textContent = matchTypeInfo.title;
        matchTypeDesc.textContent = matchTypeInfo.description;

        // Render Breakdown Bars
        for (const [dimKey, dimVal] of Object.entries(result.dimensions)) {
            const barFill = document.getElementById(`bar-${dimKey}`);
            const valLabel = document.getElementById(`val-${dimKey}`);
            if (barFill && valLabel) {
                barFill.style.width = '0%';
                valLabel.textContent = '0%';
                setTimeout(() => {
                    barFill.style.width = `${dimVal}%`;
                    valLabel.textContent = `${dimVal}%`;
                }, 300);
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function animateScoreText(element, targetScore) {
        let current = 0;
        element.textContent = "0%";
        const duration = 1200;
        const stepTime = Math.abs(Math.floor(duration / targetScore));

        const timer = setInterval(() => {
            current += 1;
            element.textContent = `${current}%`;

            if (current >= targetScore) {
                clearInterval(timer);
                element.textContent = `${targetScore}%`;
            }
        }, stepTime);
    }
});
