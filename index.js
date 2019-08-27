import React, { Component } from 'react';
import { render } from 'react-dom';
import SVG from 'react-inlinesvg';

import './styles.scss';

import Map from './map.svg';
import Location from './Location';

import getLocationDetails from './utils/getLocationDetails';

class App extends Component {
  constructor() {
    super();

    this.state = {
      status: 'idle',
      data: []
    };

    this.input = React.createRef();

    this.getLocations = this.getLocations.bind(this);
  }

  asyncSetState(state) {
    return new Promise(resolve => {
      this.setState(state, resolve)
    })
  }

  async getLocations(postcode) {
    await this.asyncSetState({ status: 'loading' });

    // disable the currently active county
    if (document.querySelector(`.active`)){
      document.querySelector(`.active`).classList.remove('active')
    }

    getLocationDetails(postcode).then((response) => {
      this.setState({
        status: 'success',
        data: response
      })

      // highlight the active county on the map
      const activeCounty = document.querySelector(`.county${response.shortcode}`);
      activeCounty.classList.add('active');
      
    }).catch((error) => {
      this.setState({
        status: 'error',
        error
      })
    });
  }

  render() {
    const { status, data } = this.state;

    return (
      <div>
        <h1>Location Finder</h1>
        <h2>Enter a UK postcode or use one of the options below to find your nearest coffee shop</h2>
        <form onSubmit={() => this.getLocations(this.input.value)}>
          <input type="text" placeholder="Postcode" ref={this.input} />
          <button type="submit">Go</button>
          <hr />
        </form>
        <div className="buttons-list">
          <button onClick={this.getLocations}>
            Use your browsers location
          </button>
          <button onClick={() => this.getLocations('LD65AT')}>
            Use test postcode from Wales
          </button>
          <button onClick={() => this.getLocations('EH52 6TP')}>
            Use test postcode from Scotland
          </button>
          <button onClick={() => this.getLocations('PL30 5AQ')}>
            Use test postcode from Cornwall
          </button>
          <button onClick={() => this.getLocations('LE1 1GE')}>
            Use test postcode from Leicester
          </button>
        </div>
        {status === 'success' && data.locations.map((location) => <Location details={location}/>)}
        <SVG src={Map} />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
