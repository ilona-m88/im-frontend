import { render, fireEvent } from '@testing-library/react';
import Axios from 'axios';
import ReportPage from './ReportPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

test('calls the correct API endpoint when generating PDF', async () => {
  Axios.get.mockResolvedValue({ data: [{ first_name: "John", last_name: "Doe" }] });

  const { getByText } = render(
    <BrowserRouter>
      <ReportPage />
    </BrowserRouter>
  );

  fireEvent.click(getByText("Generate PDF"));

  expect(Axios.get).toHaveBeenCalledWith("http://localhost:3001/getCustomersWhoRentedMovies");
});
