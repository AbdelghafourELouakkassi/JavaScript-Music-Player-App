

//get the dom tree elements in our app to edit later 
const container = document.querySelector(".container"),
  musicImg = container.querySelector(".song-details .song-image"),
  musicTitle = container.querySelector(".song-details .title"),
  musicArtist = container.querySelector(".song-details .artist"),
  playPauseBtn = container.querySelector("#play-pause-song"),
  prevBtn = container.querySelector("#prev-song"),
  nextBtn = container.querySelector("#next-song"),
  mainAudio = container.querySelector("#main-audio"),
  progressArea = container.querySelector(".song-progress-area"),
  progressBar = progressArea.querySelector(".song-progress-bar");


let musicIndex = 0;
let isPlaying = false;


// loading a song to be the main song of our music player when the page loaded
window.addEventListener("load", () => {
  loadMusic(musicIndex);
});


// function to set the properties of the song played in our  music player

function loadMusic(indexNumber) {
  musicImg.src = listOfSongs[indexNumber].image;
  mainAudio.src = listOfSongs[indexNumber].songSrc;
  musicTitle.textContent = listOfSongs[indexNumber].songName;
  musicArtist.textContent = listOfSongs[indexNumber].artist;
}


function playMusic() {
  isPlaying = true;
  playPauseBtn.classList.add("fa-circle-pause");
  mainAudio.play();
}

function pauseMusic() {
  isPlaying = false;
  playPauseBtn.classList.remove("fa-circle-pause");
  mainAudio.pause();
}


//click event with ternary condition to check if the song is playing or paused to change his current state
playPauseBtn.addEventListener("click", () => {
  isPlaying ? pauseMusic() : playMusic();
});


function nextSong() {
  musicIndex += 1;
  if (musicIndex > listOfSongs.length - 1) {
    musicIndex = 0;
  }
  loadMusic(musicIndex);
  playMusic();
}

nextBtn.addEventListener("click", () => {
  nextSong();
});

function prevSong() {
  musicIndex -= 1;
  if (musicIndex < 0) {
    musicIndex = 0;
  }
  loadMusic(musicIndex);
  playMusic();
}

prevBtn.addEventListener("click", () => {
  prevSong();
});


//click event with switch condition to see the state of the repeat button to change its design in html 
const repeatBtn = container.querySelector("#repeat-playlist");

repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerHTML;

  switch (getText) {
    case "repeat":
      repeatBtn.innerHTML = "repeat_one";
      repeatBtn.setAttribute("title", "Song Looped");
      break;
    case "repeat_one":
      repeatBtn.innerHTML = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerHTML = "repeat";
      repeatBtn.setAttribute("title", "Playlist Looped");
      break;
  }
});


// logic for what is going to happen when the song end depends on the current state of repeat button
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerHTML;

  switch (getText) {
    case "repeat":
      nextSong();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randowIndex = Math.floor(Math.random() * listOfSongs.length);
      do {
        randowIndex = Math.floor(Math.random() * listOfSongs.length);
      } while (randowIndex == musicIndex);
      {
        musicIndex = randowIndex;
        loadMusic(musicIndex);
        playMusic();
        break;
      }
  }
});


//get the current time of the song wich is playing and make it show up on the player  
//make the progress bar moving with the time of the song till the end of it

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;

  let progressWidth = (currentTime / duration) * 100;
 

  progressBar.style.width = `${progressWidth}%`;

  let songCurrentTime = container.querySelector(".current-time");
  let songMaxDuration = container.querySelector(".max-duration");

  mainAudio.addEventListener("loadeddata", () => {
    const interval = setInterval(() => {
      const _elapsed = mainAudio.currentTime;
      songCurrentTime.innerHTML = formatTime(_elapsed);
    }, 1000);

    const _duration = mainAudio.duration;
    songMaxDuration.innerHTML =formatTime(_duration);

    mainAudio.addEventListener("ended", () => {
      clearInterval(interval);
    });
  });
});


progressArea.addEventListener("click",(e)=>{
  let progressBarWidth=progressArea.clientWidth;
  let clickedArea=e.offsetX;
  let songDuration=mainAudio.duration;
  mainAudio.currentTime=(clickedArea/progressBarWidth)*songDuration
  
})


//litle function to format the time of the song that playing on the screen to minutes and seconds

function formatTime(time){

  if(time && !isNaN(time)){
    const minutes=Math.floor(time/60)<10?`0${Math.floor(time/60)}`:Math.floor(time/60); 
    const seconds=Math.floor(time%60)<10?`0${Math.floor(time%60)}`:Math.floor(time%60);
    return `${minutes}:${seconds}`
  }
  return "00:00"

}
