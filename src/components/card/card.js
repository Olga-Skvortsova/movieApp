import React from 'react';
import { Flex, Rate, Progress, Space } from 'antd';

import './card.css';
import { ServiceContext } from '../service-context/service-context';

const { Provider: ServiceProvider, Consumer: ServiceConsumer } = ServiceContext;

export default class Card extends React.Component {
  state = { result: [], value: 0 };

  async componentDidMount() {
    await this.allGenres();
  }

  allGenres = async () => {
    let { getGenres, cardGenres } = this.props;
    let arr = [];

    try {
      const response = await getGenres();
      response.genres.forEach((objectWithGenre) => {
        cardGenres.forEach((arrayEl) => {
          if (objectWithGenre.id === arrayEl) {
            arr.push(
              <button className="card-div__button" key={objectWithGenre.id}>
                {objectWithGenre.name}
              </button>
            );
          }
        });
      });

      this.setState({ result: arr });
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  setValue = (rate) => {
    this.context
      .postRate(rate, this.props.cardId, this.props.sessionId.guest_session_id)
      .then((response) => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then((result) => {
        result;
      });
    this.setState(({ value }) => {
      return {
        value: rate,
      };
    });
  };

  render() {
    let { posterPath, cardTitle, cardDate, cardOverview } = this.props;

    if (cardOverview.length > 150) {
      for (let i = 150; i > 0; i--) {
        if (cardOverview[i] === ' ') {
          cardOverview = cardOverview.slice(0, i) + ' ...';
          break;
        }
      }
    }

    if (cardTitle.length > 30) {
      for (let i = 30; i > 0; i--) {
        if (cardTitle[i] === ' ') {
          cardTitle = cardTitle.slice(0, i) + ' ...';
          break;
        }
      }
    }

    const color = () => {
      if (this.props.cardRating) {
        if (this.props.cardRating <= 3) {
          return {
            0: '#E90000',
            30: '#E90000',
          };
        } else if (this.props.cardRating <= 5) {
          return {
            0: '#E97E00',
            50: '#E97E00',
          };
        } else if (this.props.cardRating <= 7) {
          return {
            0: '#E9D100',
            70: '#E9D100',
          };
        } else if (this.props.cardRating > 7) {
          return {
            0: '#66E900',
            100: '#66E900',
          };
        }
      } else {
        if (this.state.value <= 3) {
          return {
            0: '#E90000',
            30: '#E90000',
          };
        } else if (this.state.value <= 5) {
          return {
            0: '#E97E00',
            50: '#E97E00',
          };
        } else if (this.state.value <= 7) {
          return {
            0: '#E9D100',
            70: '#E9D100',
          };
        } else if (this.state.value > 7) {
          return {
            0: '#66E900',
            100: '#66E900',
          };
        }
      }
    };

    return (
      <div className="card-div">
        <img
          className="card-div__movie-photo"
          alt="movie photo"
          src={`https://image.tmdb.org/t/p/original${posterPath}`}
          width="183"
          height="281"
        ></img>
        <h2>{cardTitle}</h2>
        <Space className="card-div__round" wrap>
          <Progress
            format={(percent) => percent / 10}
            type="circle"
            percent={this.props.cardRating ? this.props.cardRating * 10 : this.state.value * 10}
            strokeColor={color()}
            size={40}
          />
        </Space>
        <div className="card-div__buttons">{this.state.result}</div>
        <p className="card-div__date">{cardDate}</p>
        <p className="card-div__description"> {cardOverview} </p>
        <Flex className="card-div__rate" gap="middle" vertical>
          <Rate allowHalf count={10} onChange={this.setValue} value={this.props.cardRating} />
        </Flex>
      </div>
    );
  }
}

Card.contextType = ServiceContext;
