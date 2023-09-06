import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

interface IState {
  data: ServerRespond[];
  showGraph: boolean;
  loading: boolean; // Add loading state
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,
      loading: false, // Initialize loading state
    };
  }

  // Handle data fetching and streaming
  getDataFromServer() {
    if (this.state.loading) return; // Don't fetch data when already loading

    this.setState({ loading: true }); // Set loading to true before fetching

    let x = 0;
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({ data: serverResponds, showGraph: true, loading: false }); // Update loading state after fetching
      });

      x++;
      if (x > 1000) {
        clearInterval(interval);
      }
    }, 100);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">Bank & Merge Co Task 2</header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              this.getDataFromServer();
            }}
            disabled={this.state.loading} // Disable button when loading
          >
            {this.state.loading ? 'Streaming Data...' : 'Start Streaming Data'}
          </button>
          <div className="Graph">{this.state.showGraph && <Graph data={this.state.data} />}</div>
        </div>
      </div>
    );
  }
}

export default App;
