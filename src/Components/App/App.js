import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);

    Spotify.getAccessToken();

    this.state = {
        searchResults: [],
        playlistName: 'New Playlist',
        playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (!this.state.playlistTracks.find(currTrack => currTrack.id === track.id)) {
        const newTracks = this.state.playlistTracks;
        newTracks.push(track);

        this.setState({
            playlistTracks: newTracks
        });
    }
  }

  removeTrack(track) {
    const newTracks = this.state.playlistTracks.filter(currTrack => currTrack.id !== track.id);

    this.setState({
        playlistTracks: newTracks
    });
  }

  updatePlaylistName(name) {
    this.setState({
        playlistName: name
    });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => {
        return `spotify:track:${track.id}`
    });

    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
    })
  }

  search(term) {
    Spotify.search(term).then(tracks => {
        this.setState({
            searchResults: tracks
        });
    });
  }

  render() {
    return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search} />
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
              <Playlist
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
              />
            </div>
          </div>
        </div>
    );
  }
}

export default App;