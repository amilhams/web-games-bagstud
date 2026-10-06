export function getScoreTier(score) {
    if (score >= 87) {
        return {
            tierNum: 4,
            tier: "In Perfect Sync",
            badge: "Extraordinary Connection",
            video: "video/tier/Video 4.mp4",
            cardImg: "card/tier 4.png",
            videoTopPercent: 8.5,
            videoLeftPercent: 50.5,
            videoWidthPercent: 10.5,
            videoHeightPercent: 16.5
        };
    } else if (score >= 75) {
        return {
            tierNum: 3,
            tier: "A Rare Match",
            badge: "Strong Connection",
            video: "video/tier/Video 3.mp4",
            cardImg: "card/tier 3.png",
            videoTopPercent: 4.5,
            videoLeftPercent: 58.0,
            videoWidthPercent: 10.5,
            videoHeightPercent: 16.5
        };
    } else if (score >= 63) {
        return {
            tierNum: 2,
            tier: "Growing Closer",
            badge: "Something Is There",
            video: "video/tier/Video 2.mp4",
            cardImg: "card/tier 2.png",
            videoTopPercent: 8.5,
            videoLeftPercent: 50.5,
            videoWidthPercent: 12.5,
            videoHeightPercent: 16.0

        };
    } else {
        return {
            tierNum: 1,
            tier: "Different Paths",
            badge: "Curious Chemistry",
            video: "video/tier/Video 1.mp4",
            cardImg: "card/tier 1.png",
            videoTopPercent: 8.0,
            videoLeftPercent: 50.5,
            videoWidthPercent: 11.0,
            videoHeightPercent: 17.5
        };
    }
}

export function getMatchType(highestDimension) {
    const types = {
        chemistry: {
            title: "The Magnetic Pair",
            description: "Kombinasi nama Anda memancarkan daya tarik alami dan chemistry yang sangat kuat."
        },
        communication: {
            title: "The Understanding Pair",
            description: "Pola nama Anda menunjukkan keselarasan komunikasi dan saling pengertian yang mendalam."
        },
        energy: {
            title: "The Adventure Pair",
            description: "Kombinasi ini penuh dengan energi positif, semangat, dan ritme dinamis yang hidup."
        },
        harmony: {
            title: "The Balanced Pair",
            description: "Keseimbangan dan ketenangan menjadi pijakan utama dari keharmonisan nama Anda."
        },
        attraction: {
            title: "The Spark Pair",
            description: "Ada percikan istimewa dan pesona unik yang selalu menghidupkan pasangan ini."
        }
    };

    return types[highestDimension] || types.chemistry;
}



