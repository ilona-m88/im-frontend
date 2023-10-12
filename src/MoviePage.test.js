import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MoviePage from './MoviePage';

test('renders MoviePage component', () => {
  render(
    <BrowserRouter>
      <MoviePage topMovies={[]} />
    </BrowserRouter>
  );
});
