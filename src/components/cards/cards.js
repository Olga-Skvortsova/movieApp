import React from 'react';
import { Pagination, Tabs } from 'antd';
import { debounce } from 'lodash';

import Card from '../card/card';
import Errorr from '../error/error';
import './cards.css';
import Spinner from '../spinner/spinner';
import SwapiService from '../../services/sendRequest.js';
import NoSuchMovies from '../noSuchMovies/noSuchMovies';
import { ServiceContext } from '../service-context/service-context';

const { Provider: ServiceProvider, Consumer: ServiceConsumer } = ServiceContext;

export default class Cards extends React.Component {
  state = {
    movies: [],
    loading: true,
    error: false,
    url: '',
    inputContentState: '',
    hasResult: true,
  };

  swapiService = new SwapiService();

  componentDidMount() {
    this.newFilms();
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  newFilms(page = 1) {
    this.setState({ hasResult: true });
    this.swapiService
      .getMovies(page)
      .then((response) => {
        if (!response.ok) {
          this.onError();
          return null;
        }
        this.newUrl(response.url);
        return response.json();
      })
      .then((result) => {
        if (result) {
          if (this.props.sessionId.guest_session_id) {
            this.swapiService
              .getRate(this.props.sessionId.guest_session_id, page)
              .then((response) => {
                if (!response.ok) {
                  this.onError();
                  return null;
                }
                return response.json();
              })
              .then((result2) => {
                if (result2) {
                  result.results.forEach((resultItem) => {
                    result2.results.forEach((resultItem2) => {
                      if (resultItem.id === resultItem2.id) {
                        resultItem.rating = resultItem2.rating;
                      }
                    });
                  });
                  this.newState(result);
                }
              });
          } else {
            this.newState(result);
          }
        }
      })
      .catch(() => {
        this.onError();
      });
  }

  getMovieBySearch(inputContent, page) {
    this.setState({ loading: true, hasResult: true });
    if (inputContent === '') {
      this.newFilms();
      return;
    }
    this.swapiService
      .getMovieBySearch(inputContent, page)
      .then((response) => {
        if (!response.ok) {
          this.onError();
          return null;
        }
        this.newUrl(response.url);
        return response.json();
      })
      .then((result) => {
        if (result.total_results === 0) {
          console.log('no result');
          this.setState(() => {
            return {
              hasResult: false,
            };
          });
        }
        if (result) {
          if (this.props.sessionId.guest_session_id) {
            this.swapiService
              .getRate(this.props.sessionId.guest_session_id, page)
              .then((response) => {
                if (!response.ok) {
                  this.onError();
                  return null;
                }
                return response.json();
              })
              .then((result2) => {
                if (result2) {
                  result.results.forEach((resultItem) => {
                    result2.results.forEach((resultItem2) => {
                      if (resultItem.id === resultItem2.id) {
                        resultItem.rating = resultItem2.rating;
                      }
                    });
                  });
                  this.newState(result);
                }
              });
          } else {
            this.newState(result);
          }
        }
      });
  }

  getRateMovies(sessionId, page) {
    this.setState({ hasResult: true });
    this.swapiService
      .getRate(sessionId, page)
      .then((response) => {
        if (!response.ok) {
          this.onError();
          return null;
        }
        this.newUrl(response.url);
        return response.json();
      })
      .then((result) => {
        if (result) {
          this.newState(result);
        }
      })
      .catch(() => {
        this.onError();
      });
  }

  newState(resultOfFetch) {
    this.setState(({ movies, loading }) => {
      const newArr = [...resultOfFetch.results];
      return {
        movies: newArr,
        loading: false,
      };
    });
  }

  newUrl(getUrl) {
    this.setState(({ url }) => {
      const newUrl = getUrl;
      return {
        url: newUrl,
      };
    });
  }

  searchChange = debounce((inputContent, page) => {
    const trimmedInput = inputContent.trim();
    this.setState({ inputContentState: trimmedInput });
    this.getMovieBySearch(trimmedInput, page);
  }, 500);

  CardsWithMovies = () => {
    return this.state.movies.map((card) => <MovieView key={card.id} card={card} sessionId={this.props.sessionId} />);
  };

  handleTabChange = (key) => {
    if (key === '1') {
      // Переключение на вкладку "Search"
      this.newFilms(1); // Устанавливаем текущую страницу пагинации на 1
      this.setState({ currentPage: 1 }); // Сбрасываем текущую страницу в состоянии компонента
    }
    if (key === '2') {
      // Переключение на вкладку "Rated"
      this.getRateMovies(this.props.sessionId.guest_session_id, 1); // Устанавливаем текущую страницу пагинации на 1
      this.setState({ currentPage: 1 }); // Сбрасываем текущую страницу в состоянии компонента
    }
  };

  render() {
    const { movies, loading, error, url, inputContentState, hasResult } = this.state;
    const onChange = (page) => {
      const { url } = this.state;
      if (url[29] === 'd') {
        this.newFilms(page); // Загрузка данных для вкладки "Search"
      } else if (url[29] === 's') {
        this.searchChange(this.state.inputContentState, page); // Загрузка данных для вкладки "Search"
      } else {
        this.getRateMovies(this.props.sessionId.guest_session_id, page); // Загрузка данных для вкладки "Rated"
      }
    };
    const errorIndicator = error ? <Errorr /> : null;
    const spinner = loading ? <Spinner /> : null;
    const noMovies = hasResult ? null : <NoSuchMovies />;
    const content = !(loading || error) ? <React.Fragment> {this.CardsWithMovies()} </React.Fragment> : null;
    const contentPagination = !(loading || error || !hasResult) ? (
      <Pagination
        className="paginationInSite"
        defaultCurrent={1}
        current={this.state.currentPage} // Установите текущую страницу из состояния
        total={500}
        onChange={onChange}
        showSizeChanger={false}
      />
    ) : null;
    const searchContent = (
      <React.Fragment>
        <input
          onInput={(e) => this.searchChange(e.target.value)}
          placeholder="Type to search..."
          className="search-panel"
        ></input>
        <ul className="movie-list">
          {errorIndicator}
          {spinner}
          {content}
          {noMovies}
        </ul>
      </React.Fragment>
    );
    const rateContent = (
      <React.Fragment>
        <ul className="movie-list">
          {errorIndicator}
          {spinner}
          {content}
        </ul>
      </React.Fragment>
    );
    const backToContent = (
      <React.Fragment>
        <input
          onInput={(e) => this.searchChange(e.target.value)}
          placeholder="Type to search..."
          className="search-panel"
        ></input>
        <ul className="movie-list">
          {errorIndicator}
          {spinner}
          {content}
        </ul>
      </React.Fragment>
    );

    const items = [
      { key: '1', label: 'Search', children: backToContent },
      { key: '2', label: 'Rated', children: rateContent },
    ];

    return (
      <React.Fragment>
        <Tabs
          destroyInactiveTabPane={true}
          defaultActiveKey="1"
          onChange={this.handleTabChange}
          centered
          items={items}
        />
        {contentPagination}
      </React.Fragment>
    );
  }
}

const MovieView = ({ card, sessionId }) => {
  return (
    <React.Fragment>
      <li key={card.id}>
        <ServiceConsumer>
          {({ getGenres }) => {
            return (
              <Card
                getGenres={getGenres}
                posterPath={card.poster_path}
                cardTitle={card.title}
                cardDate={card.release_date}
                cardOverview={card.overview}
                cardGenres={card.genre_ids}
                cardId={card.id}
                sessionId={sessionId}
                cardRating={card.rating}
              />
            );
          }}
        </ServiceConsumer>
      </li>
    </React.Fragment>
  );
};
