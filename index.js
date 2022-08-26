const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const container = $('.dashboard')
const titleName = $('.song-name')
const author = $('.song-author')
const cd = $('.cd')
const thumbnail = $('.cd-thumb')
const songSources = $$('.song-src')
const playlist = $('.playlist')
const togglePlay = $('.btn-toggle-play')
const audio = $('.audio')
const prevSong = $('.btn-prev')
const nextSong = $('.btn-next')
const replay = $('.btn-repeat')
const shuffle = $('.btn-shuffle')
const songProgression = $('.song-progress')
const thumbnailAnimation = thumbnail.animate([
  {
    transform: 'rotate(360deg)'
  }
], {
  duration: 10000,
  iterations: Infinity,
})

const app = {
  currentQueueIndex: 0,
  isPlaying: false,
  isReplay: false,
  isShuffle: false,
  queue: [],
  songs: [
    {
      name: 'Kaze no Kanaasdfwsdfdsf fsdofdsflta fdfsdfbdsf',
      author: 'Yuiko',
      image: './assets/images/1.jpg',
      audio: './assets/audio/Kaze no Kanata 「 Yuiko 」.mp3',
    },
    {
      name: 'Kimi e no Uta',
      author: 'Mai Kuraki',
      image: './assets/images/2.jpg',
      audio: './assets/audio/Kaze no Kanata 「 Yuiko 」.mp3',
    },
    {
      name: 'Kimi ga Inai Sekai wa Setsunakute',
      author: 'CHIHIRO Feat. Ken The 390',
      image: './assets/images/3.jpg',
      audio: './assets/audio/Kimi ga Inai Sekai wa Setsunakute 「 CHIHIRO Feat. Ken The 390 」.mp3',
    },
    {
      name: 'Kimi ga Iru Sekai e',
      author: 'Kano',
      image: './assets/images/4.jpg',
      audio: './assets/audio/Kimi ga Iru Sekai e 「 Kano 」.mp3',
    },
    {
      name: 'Kimi Ni Ienakatta Omoi',
      author: 'KG Ft May J',
      image: './assets/images/5.jpg',
      audio: './assets/audio/Kimi Ni Ienakatta Omoi 「 KG Ft May J 」.mp3',
    },
    {
      name: 'Kimi ni Saigo no Kuchizuke wo',
      author: 'Majiko',
      image: './assets/images/6.jpg',
      audio: './assets/audio/Kimi ni Saigo no Kuchizuke wo 「 Majiko 」.mp3',
    },
    {
      name: 'Kimi to Futari de',
      author: 'Rhythmic',
      image: './assets/images/7.jpg',
      audio: './assets/audio/Kimi to Futari de 「 Rhythmic 」.mp3',
    },
  ],
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.queue[this.currentQueueIndex]]
      }
    })
    Object.defineProperty(this, 'currentSongIndex', {
      get: function () {
        return this.queue[this.currentQueueIndex]
      }
    })
  },
  loadCurrentSong: function () {
    titleName.innerHTML = `<span class="text">${this.currentSong.name}</span>`
    author.innerText = this.currentSong.author
    thumbnail.style.backgroundImage = `url('${this.currentSong.image}')`

    songSources.forEach(songSource => {
      songSource.src = this.currentSong.audio
    })
    if (titleName.clientWidth === titleName.querySelector('.text').clientWidth) {
      titleName.querySelector('.text').classList.add('animate-title')
    }
    audio.load()
    if (this.isPlaying) {
      thumbnailAnimation.play()
    } else {
      thumbnailAnimation.pause()
    }
    this.isPlaying ? this.play() : this.pause()
  },
  render: function () {
    const playlistItems = this.queue.map((element, key) => `
      <div value=${key} class="item">
        <div class="play-list-image" style="background-image: url('${app.songs[element].image}')"></div>
        <div class="info">
          <p class="playlist-info-title">${this.songs[element].name}</p>
          <p class="playlist-info-author">${this.songs[element].author}</p>
        </div>
      </div>
    `).join('')
    playlist.innerHTML = playlistItems
    $(`.item[value='${this.currentQueueIndex}']`).classList.add('selected')
  },
  handleEvent: function () {
    // Toggle play
    togglePlay.onclick = () => {
      this.togglePlay()
    }
    // Adjust song progress
    audio.ontimeupdate = () => {
      const currentProgress = audio.currentTime * 100 / audio.duration
      if (!isNaN(currentProgress))
        songProgression.value = currentProgress
    }
    songProgression.onchange = () => {
      const adjustProgress = songProgression.value * audio.duration / 100
      audio.currentTime = adjustProgress
    }
    // Next & Prev song
    prevSong.onclick = () => {
      this.previousSong()
      this.render()
      this.loadCurrentSong()
      this.play()
    }
    nextSong.onclick = () => {
      this.nextSong()
      this.render()
      this.loadCurrentSong()
      this.play()
    }
    // Load song
    audio.onloadeddata = () => {
      audio.currentTime = 0
    }
    // Toggle control
    shuffle.onclick = () => {
      this.toggleShuffle().then()
      this.render()
    }
    replay.onclick = () => {
      this.toggleReplay()
    }
    // Handle when ended
    audio.onended = () => {
      if (this.isReplay) {
        audio.currentTime = 0
      } else {
        this.nextSong()
        this.render()
        this.loadCurrentSong()
      }
      this.play()
    }
  },
  previousSong: function () {
    $(`.item[value='${this.currentQueueIndex}']`).classList.remove('selected')
    this.currentQueueIndex--
    if (this.currentQueueIndex < 0) {
      this.currentQueueIndex = this.songs.length - 1
    }
  },
  nextSong: function () {
    $(`.item[value='${this.currentQueueIndex}']`).classList.remove('selected')
    this.currentQueueIndex++
    if (this.currentQueueIndex >= this.songs.length) {
      this.currentQueueIndex = 0
    }
  },
  togglePlay: function () {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  },
  toggleShuffle: async function () {
    if (this.isShuffle) {
      await this.unShuffle()
      this.isShuffle = false
      shuffle.classList.remove('active')
    } else {
      await this.shuffle()
      this.isShuffle = true
      shuffle.classList.add('active')
    }
  },
  toggleReplay: function () {
    if (this.isReplay) {
      this.isReplay = false
      replay.classList.remove('active')
    } else {
      this.isReplay = true
      replay.classList.add('active')
    }
  },
  pause: function () {
    this.isPlaying = false
    thumbnailAnimation.pause()
    audio.pause()
    player.classList.remove('playing')
  },
  play: function () {
    this.isPlaying = true
    thumbnailAnimation.play()
    audio.play()
      .then()
      .catch(err => {
        this.pause()
      })
    player.classList.add('playing')
  },
  createQueue: function () {
    const songQuantity = this.songs.length
    for (let index = 0; index < songQuantity; index++) {
      const queueIndex = index + this.currentQueueIndex
      this.queue[index] = queueIndex
    }
  },
  unShuffle: function () {
    const songQuantity = this.songs.length
    this.currentQueueIndex = this.currentSongIndex
    for (let index = 0; index < songQuantity; index++) {
      const queueIndex = index
      this.queue[index] = queueIndex
    }

  },
  shuffle: function () {
    const songQuantity = this.songs.length
    for (let index = songQuantity - 1; index >= 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
      if (randomIndex !== 0) {
        const temp = this.queue[index]
        this.queue[index] = this.queue[randomIndex]
        this.queue[randomIndex] = temp
      }
      [this.queue[0], this.queue[this.currentQueueIndex]] = [this.queue[this.currentQueueIndex], this.queue[0]]
      this.currentQueueIndex = 0

    }
  },
  start: function () {
    this.defineProperties()
    this.createQueue()
    this.handleEvent()
    this.render()
    this.loadCurrentSong()
  },
}
app.start()

function resizeEventListener() {
  console.log("clientWidth", document.documentElement.clientWidth);
  console.log("clientHeight", document.documentElement.clientHeight);
}
window.addEventListener("resize", resizeEventListener);
