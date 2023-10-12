import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomerPage from './CustomerPage';
import Axios from 'axios';

jest.mock('axios');
Axios.post.mockResolvedValue({ data: { success: true, message: 'Success' } });
Axios.get.mockResolvedValue({ data: [] }); 



test('calls addCustomer function on "Add Customer" button click', async () => {
  const { getByText } = render(
    <BrowserRouter>
      <CustomerPage />
    </BrowserRouter>
  );

  fireEvent.click(getByText("Add Customer"));

  expect(Axios.post).toHaveBeenCalledTimes(1);
});

