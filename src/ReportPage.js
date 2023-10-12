import React from 'react';
import Axios from 'axios';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom'; 

const ReportPage = () => {

    const generatePDF = async () => {
        try {
            const response = await Axios.get("http://localhost:3001/getCustomersWhoRentedMovies"); 
            const customers = response.data;

            const doc = new jsPDF();
            let y = 20;
            const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            const bottomMargin = 10;

            doc.text('Customers who rented movies:', 10, y);
            y += 10;

            customers.forEach(customer => {
                if (y > pageHeight - bottomMargin) {
                    doc.addPage(); // Add a new page
                    y = 20; // Reset the y coordinate to the top
                }
                doc.text(`${customer.first_name} ${customer.last_name}`, 10, y);
                y += 10;
            });
            doc.save("report.pdf");
        } catch (error) {
            console.error("Error fetching customers and generating PDF:", error);
        }
    };

    return (
        <div>
            <h1>Report Page</h1>
            <div className="navigation-buttons">
                <Link to="/"><button>Home</button></Link>
                <Link to="/movies"><button>Movies</button></Link>
                <Link to="/customers"><button>Customers</button></Link>
            </div>
            <div className="report-actions">
                <button onClick={generatePDF}>Generate PDF</button>
            </div>
        </div>
    );
};

export default ReportPage;
