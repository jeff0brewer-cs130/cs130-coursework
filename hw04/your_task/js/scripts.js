const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

// Note: AudioPlayer is defined in audio-player.js
const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);

const search = (ev) => {
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    // issue three Spotify queries at once...
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}

const getTracks = (term) => {
    fetch(`https://www.apitutor.org/spotify/simple/v1/search?type=track&q=${term}`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                let num_tracks = data.length > 5 ? 5 : data.length;
                let s = "";
                for(let i = 0; i < num_tracks; i++){
                    s += `
                    <section class="track-item preview" data-preview-track="${data[i].preview_url}" data-image-url="${data[i].album.image_url}" data-song-name="${data[i].name}" data-artist-name="${data[i].artist.name}">
                        <img src="${data[i].album.image_url}">
                        <i class="fas play-track fa-play" aria-hidden="true"></i>
                        <div class="label">
                            <h3>${data[i].name}</h3>
                            <p>
                                ${data[i].artist.name}
                            </p>
                        </div>
                    </section>`;
                }
                document.getElementById('tracks').innerHTML = s;
            }
            else{
                document.getElementById('tracks').innerHTML = "no tracks found"
            }
        })
        .then(() => {
            document.getElementById('tracks').querySelectorAll('section').forEach(track => {
                track.onclick = setCurrTrack;
            });
        });
};

const getAlbums = (term) => {
    fetch(`https://www.apitutor.org/spotify/simple/v1/search?type=album&q=${term}`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                let s = "";
                for(let i = 0; i < data.length; i++){
                    s += `
                    <section class="album-card" id="${data[i].id}">
                        <div>
                            <img src="${data[i].image_url}">
                            <h3>${data[i].name}</h3>
                            <div class="footer">
                                <a href="${data[i].spotify_url}" target="_blank">
                                    view on spotify
                                </a>
                            </div>
                        </div>
                    </section>`;
                }
                document.getElementById('albums').innerHTML = s;
            }
            else{
                document.getElementById('albums').innerHTML = "no albums found";
            }
        });
};

const getArtist = (term) => {
    fetch(`https://www.apitutor.org/spotify/simple/v1/search?type=artist&q=${term}`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                let artist = data[0];
                document.getElementById('artist').innerHTML = `
                    <section class="artist-card" id="${artist.id}">
                        <div>
                            <img src="${artist.image_url}">
                            <h3>${artist.name}</h3>
                            <div class="footer">
                                <a href="${artist.spotify_url}" target="_blank">
                                    view on spotify
                                </a>
                            </div>
                        </div>
                    </section>`;
            }
            else{
                document.getElementById('artist').innerHTML = "no artists found";
            }
        });
};

const setCurrTrack = ev => {
    let section = ev.target;
    while(section.nodeName != "SECTION"){
        section = section.parentElement;
    }
    const track = {
        preview_url: section.dataset.previewTrack,
        image_url: section.dataset.imageUrl,
        song_name: section.dataset.songName,
        artist_name: section.dataset.artistName
    };
    document.getElementById('track-item').innerHTML = `
        <div class="track-item" data-preview-track="${track.preview_url}">
            <img src="${track.image_url}">
            <i class="fas play-track fa-pause" aria-hidden="true"></i>
            <div class="label">
                <h3>${track.song_name}</h3>
                <p>
                    ${track.artist_name}
                </p>
            </div>
        </div>`;
    audioPlayer.setAudioFile(track.preview_url);
    audioPlayer.play();
};


document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};