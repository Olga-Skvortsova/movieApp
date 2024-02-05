import React from 'react';
import { Offline, Online } from 'react-detect-offline';

import Cards from '../cards/cards';
import './app.css';
import SwapiService from '../../services/sendRequest.js';
//import { ServiceProvider } from '../service-context/service-context';
import { ServiceContext } from '../service-context/service-context';

const { Provider: ServiceProvider, Consumer: ServiceConsumer } = ServiceContext;

export default class App extends React.Component {
  state = {
    sessionId: '',
  };
  swapiService = new SwapiService();
  componentDidMount() {
    this.swapiService
      .getGuestSesion()
      .then((response) => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then((result) => {
        if (result) {
          this.setState({ sessionId: result });
        }
      });
  }
  render() {
    return (
      <section className="movieapp">
        <Offline>
          <div className="offline-block">You are offline right now. Check your connection.</div>
        </Offline>
        <ServiceProvider value={this.swapiService}>
          <Online>
            <header></header>
            <section className="main">
              <Cards sessionId={this.state.sessionId} />
            </section>
          </Online>
        </ServiceProvider>
      </section>
    );
  }
}
