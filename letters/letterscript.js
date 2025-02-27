let songs = [
    { title: "I think they call this love", url: "sound/song2.mp3" },
    { title: "Blue", url: "sound/song3.mp3" },
    { title: "Still with you", url: "sound/song5.mp3" },
    { title: "Say Yes Say Yes", url: "sound/song6.mp3" },
    { title: "My you", url: "sound/song7.mp3" },
    { title: "Serpihan", url: "sound/song8.mp3" },
    { title: "Sampai akhir", url: "sound/song9.mp3" },
    { title: "Penjaga Hati", url: "sound/song10.mp3" },
    { title: "Terlukis indah", url: "sound/song11.mp3" },
];

let currentSongIndex = 0;
const audio = document.getElementById("audio");
const songTitle = document.getElementById("song-title");
const seekBar = document.getElementById("seek-bar");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");
const playlist = document.getElementById("playlist");
const playPauseBtn = document.getElementById("playPauseBtn");

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function loadSong(index) {
    audio.src = songs[index].url;
    songTitle.textContent = songs[index].title;
    audio.play();
    playPauseBtn.textContent = "⏸️"; 

    audio.onloadedmetadata = () => {
        totalTimeDisplay.textContent = formatTime(audio.duration);
    };
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = "⏸️";
    } else {
        audio.pause();
        playPauseBtn.textContent = "▶️";
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
}

// Update seek bar & time
audio.addEventListener("timeupdate", () => {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener("input", () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// Load songs into the playlist
songs.forEach((song, index) => {
    let div = document.createElement("div");
    div.textContent = song.title;
    div.classList.add("song-item");
    div.onclick = () => { 
        currentSongIndex = index;
        loadSong(index);
    };
    playlist.appendChild(div);
});

loadSong(currentSongIndex);
