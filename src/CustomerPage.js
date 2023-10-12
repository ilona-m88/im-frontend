import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({});
  const [newCustomer, setNewCustomer] = useState({ firstName: '', lastName: '', email: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const addCustomer = async () => {
    try {
      const response = await Axios.post('http://localhost:3001/addCustomer', newCustomer);
      if (response.data.success) {
        alert(response.data.message);
        // Reset form
        setNewCustomer({ firstName: '', lastName: '', email: '' });
        // Optionally refresh the customer list
      }
    } catch (error) {
      console.error("Error adding new customer:", error);
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/getCustomers?q=${searchTerm}`);
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [searchTerm]);

  const handleCustomerClick = async (customerId) => {
    // If the clicked customer's details are currently displayed, hide them.
    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null);
      return;
    }
  
    if (customerDetails[customerId]) {
      setSelectedCustomerId(customerId);
      return; // If already fetched, just toggle display
    }
  
    try {
      const response = await Axios.get(`http://localhost:3001/getCustomerRentals/${customerId}`);
      setCustomerDetails(prevDetails => ({
        ...prevDetails,
        [customerId]: response.data
      }));
      setSelectedCustomerId(customerId);
    } catch (error) {
      console.error("Error fetching customer rentals:", error);
    }
  };
  

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    // Add code to perform the search when the button is clicked
    try {
      const response = await Axios.get(`http://localhost:3001/getCustomers?q=${searchTerm}`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <div>
      <div className="text-center my-4">
        <h1 className="text-dark mb-4">Customers</h1>
        <div className="d-flex justify-content-center" style={{ marginBottom: '50px' }}>
          <Link to="/" className="btn btn-warning mx-3" style={{ fontSize: '24px', padding: '15px 50px' }}>
            Home
          </Link>
          <Link to="/movies" className="btn btn-success mx-3" style={{ fontSize: '24px', padding: '15px 50px' }}>
            Movies
          </Link>
          <Link to="/reports" className="btn btn-info mx-3" style={{ fontSize: '24px', padding: '15px 50px' }}>
            Reports
          </Link>
        </div>
      </div>

      <div className="container text-center"> {/* Center the search input and button */}
        <div className="row justify-content-center">
          <div className="col-8 col-md-6 col-lg-4">
            <div className="input-group mb-3">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Search by customer id, first name, or last name"
                className="form-control form-control-lg mt-3"
                style={{ width: '80%'}}
                
              />
                <button className="btn btn-primary" type="button" onClick={handleSearch}>
                  Search
                </button>
              
            </div>
          </div>
        </div>
      </div>

      <ul>
      {customers.map((customer) => (
          <li key={customer.customer_id}>
            <span onClick={() => handleCustomerClick(customer.customer_id)}>
                {customer.first_name} {customer.last_name}
            </span>
            {selectedCustomerId === customer.customer_id && customerDetails[customer.customer_id] && 
              <div>
                <p>ID: {customerDetails[customer.customer_id][0]?.customer_id}</p>
                <p>Email: {customerDetails[customer.customer_id][0]?.email}</p>
                {customerDetails[customer.customer_id].map((rental, index) => (
                  <div key={index}>
                    <p>Rental History:</p>
                    <p>Title: {rental.title}</p>
                    <p>Rental Date: {rental.rental_date}</p>
                  </div>
                ))}
              </div>
            }
          </li>
        ))}
      </ul>
      <h2>Add New Customer</h2>
      <div className="customer-form">
        <input
          type="text"
          name="firstName"
          value={newCustomer.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          value={newCustomer.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
        />
        <input
          type="email"
          name="email"
          value={newCustomer.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <button onClick={addCustomer}>Add Customer</button>
      </div>
    </div>
  );
};

export default CustomerPage;