const moods = ["happy", "chill", "energetic", "sad"];
let currentMood = "happy";
let unplayedSongs = [];
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const seekbar = document.getElementById("seekbar");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const songTitleEl = document.getElementById("song-title");

const moodSongs = {
    "happy": Array.from({ length: 30 }, (_, i) => `/music/happy/song${i + 1}.mp3`),
    "chill": Array.from({ length: 30 }, (_, i) => `/music/chill/song${i + 1}.mp3`),
    "energetic": Array.from({ length: 30 }, (_, i) => `/music/energetic/song${i + 1}.mp3`),
    "sad": Array.from({ length: 30 }, (_, i) => `/music/sad/song${i + 1}.mp3`)
};

// Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initialize song queue
function initializeQueue(mood) {
    unplayedSongs = [...moodSongs[mood]];
    shuffleArray(unplayedSongs);
}

// Set Mood
function setMood(mood) {
    if (!moods.includes(mood)) {
        console.error("Invalid mood:", mood);
        return;
    }
    currentMood = mood;
    initializeQueue(mood);
    playNextSong();
}

// Play Next Song
function playNextSong() {
    if (unplayedSongs.length === 0) {
        initializeQueue(currentMood);
    }

    let nextSong = unplayedSongs.shift();
    console.log("Now Playing:", nextSong);
    audio.src = nextSong;
    songTitleEl.textContent = nextSong.split("/").pop().replace(".mp3", "");
    audio.load();
    audio.play();
}

// Play/Pause
function playPauseSong() {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = "⏸";
    } else {
        audio.pause();
        playPauseBtn.textContent = "▶";
    }
}

// Seek Bar
audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
        seekbar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

seekbar.addEventListener("input", () => {
    audio.currentTime = (seekbar.value / 100) * audio.duration;
});

// Format Time
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Event Listeners
playPauseBtn.addEventListener("click", playPauseSong);
nextBtn.addEventListener("click", playNextSong);
audio.addEventListener("ended", playNextSong);
