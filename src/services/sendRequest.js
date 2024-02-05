export default class SwapiService {
  getMovies = (numberOfPage) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmZkOWY1ZWNiZjZhMzUzMTk4MTJhZjYwMzVmYTFlZiIsInN1YiI6IjY1YWFkMjdkMGM0YzE2MDBkNjdiYTFkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.h5FlGtB-JBycgatwUATMCF-1pzObCuWi9F0T6uvpueE',
      },
    };
    return fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=${numberOfPage}`,
      options
    );
  };

  getMovieBySearch = (inputContent, numberOfPage = 1) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmZkOWY1ZWNiZjZhMzUzMTk4MTJhZjYwMzVmYTFlZiIsInN1YiI6IjY1YWFkMjdkMGM0YzE2MDBkNjdiYTFkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.h5FlGtB-JBycgatwUATMCF-1pzObCuWi9F0T6uvpueE',
      },
    };
    return fetch(
      `https://api.themoviedb.org/3/search/movie?query=${inputContent}&include_adult=false&language=en-US&page=${numberOfPage}`,
      options
    );
  };

  getGenres = () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmZkOWY1ZWNiZjZhMzUzMTk4MTJhZjYwMzVmYTFlZiIsInN1YiI6IjY1YWFkMjdkMGM0YzE2MDBkNjdiYTFkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.h5FlGtB-JBycgatwUATMCF-1pzObCuWi9F0T6uvpueE',
      },
    };
    return fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  };

  getGuestSesion = () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
    return fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=f2fd9f5ecbf6a35319812af6035fa1ef',
      options
    );
  };

  postRate = (filmGrade = 0, filmId, guestId) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: `{"value":${filmGrade}}`,
    };
    return fetch(
      `https://api.themoviedb.org/3/movie/${filmId}/rating?api_key=f2fd9f5ecbf6a35319812af6035fa1ef&guest_session_id=${guestId}`,
      options
    );
  };

  getRate = (guestId, numberOfPage = 1) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
    return fetch(
      `https://api.themoviedb.org/3/guest_session/${guestId}/rated/movies?language=ru-RU&page=${numberOfPage}&sort_by=created_at.asc&api_key=f2fd9f5ecbf6a35319812af6035fa1ef`,
      options
    );
  };
}
