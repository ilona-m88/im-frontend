import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({});
  const [newCustomer, setNewCustomer] = useState({ firstName: '', lastName: '', email: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);



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
            
            // Fetch the customers' list again
            const newCustomers = await Axios.get(`http://localhost:3001/getCustomers`);
            setCustomers(newCustomers.data);
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
      return; 
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
    try {
      const response = await Axios.get(`http://localhost:3001/getCustomers?q=${searchTerm}`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };


const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCustomer(prevState => ({
        ...prevState,
        [name]: value
    }));
};
const handleEditSubmit = () => {
  updateCustomer();
};

const updateCustomer = async () => {
  try {
    const { first_name: firstName, last_name: lastName, email } = editingCustomer;
      const response = await Axios.put(`http://localhost:3001/updateCustomer/${editingCustomer.customer_id}`, { firstName, lastName, email });
      if (response.data.success) {
          alert(response.data.message);
          setEditingCustomer(null);  // Exit editing mode
          // Optionally refresh the customer list to see updated details
      } else {
          alert('Failed to update customer details.');  // Add this for additional debugging.
      }
  } catch (error) {
      console.error("Error updating customer:", error);
      alert('Error updating customer. Please check the console for more details.');
  }
};



const deleteCustomer = async (customerId) => {
  try {
      const response = await Axios.delete(`http://localhost:3001/deleteCustomer/${customerId}`);
      if (response.data.success) {
          alert(response.data.message);
          // Update the customers list to remove the deleted customer
          // or refresh the customers list.
      }
  } catch (error) {
      console.error("Error deleting customer:", error);
  }
};
const handleReturnMovie = async (rentalId) => {
  try {
      const response = await Axios.put('http://localhost:3001/returnMovie', { rentalId });
      if (response.data.success) {
          alert(response.data.message);
          // Refresh rental history for the current customer to reflect the return
          handleCustomerClick(selectedCustomerId);
      } else {
          alert('Failed to return the movie.');
      }
  } catch (error) {
      console.error("Error returning movie:", error);
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
      {customers && customers.map((customer) => (
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
                    {rental.return_date ? (
            <p className="returned">Returned on: {rental.return_date}</p>
        ) : (
            <p className="not-returned">Not returned yet</p>
        )}
                  </div>
                ))}
                
        
                {!editingCustomer && <button onClick={() => setEditingCustomer(customer)}>Edit</button>}
                {editingCustomer && editingCustomer.customer_id === customer.customer_id && (
                  <div>
                    <input
                      type="text"
                      name="first_name"
                      value={editingCustomer.first_name}
                      onChange={handleEditChange}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      name="last_name"
                      value={editingCustomer.last_name}
                      onChange={handleEditChange}
                      placeholder="Last Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editingCustomer.email}
                      onChange={handleEditChange}
                      placeholder="Email"
                    />
                    <button onClick={handleEditSubmit}>Submit</button>
                    <button onClick={() => setEditingCustomer(null)}>Cancel</button>
                  </div>
                )}
                <button onClick={() => {
            if (window.confirm("Are you sure you want to delete this customer?")) {
                deleteCustomer(customer.customer_id);
            }
        }}>Delete</button>
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