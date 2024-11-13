import './css/booklog_styles.css';
import './css/AnnotationLayer.css';
import './css/TextLayer.css';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

export default function Booklog() {
    const [searchQuery, setSearchQuery] = useState('');

    // Array of books to display (this will eventually come from the backend)
    const books = [
        {
            pdf: "example.pdf",
            bookname: "Molecular Biology Techniques, 4th ed.",
            // eventually the link might be replaced since the backend needs to handle routing between the booklog links and
            // the start reading page to display the correct book
            link: "#"
        },
        {
            pdf: "example.pdf",
            bookname: "Advanced Genetic Studies",
            link: "#"
        },
        {
            pdf: "example.pdf",
            bookname: "Example textbook",
            link: "#"
        },
        {
            pdf: "example.pdf",
            bookname: "The User Experience Mindset",
            link: "#"
        },
        {
            pdf: "example.pdf",
            bookname: "Javascript For Dummies",
            link: "#"
        },
    ];

    const filteredBooks = books.filter(book =>
        book.bookname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container">
            <Searchbar setSearchQuery={setSearchQuery} />
            <div className="display-container">
                {filteredBooks.map((book, index) => (
                    <Bookdisplay 
                        key={index}
                        pdf={book.pdf}
                        bookname={book.bookname}
                        link={book.link}
                    />
                ))}
            </div>
        </div>
    );
}

function Searchbar({ setSearchQuery }) {
    return (
        <div className='form-div'>
            <h3>Search</h3>
            <form>
                <input
                    type="text"
                    id="searchBar"
                    name="searchBar"
                    placeholder="Search by book name..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
        </div>
    );
}

function Bookdisplay(props) {
    function onLoadError(error) {
        console.log("Error loading PDF: ", error);
    }
    
    function onSourceError(error) {
        console.log("Error with PDF source: ", error);
    }

    return (
        <div className="book-card">
            <div className="pdf-thumbnail-holder">
                <Document
                    file={`${process.env.PUBLIC_URL}/imgtemp/${props.pdf}`}
                    onLoadError={onLoadError}
                    onSourceError={onSourceError}
                >
                    <Page 
                        pageNumber={1}
                        width={140}
                    />
                </Document>
            </div>
            <p>{props.bookname}</p>
            <a href={props.link}>
                <button className="home-btn">Read</button>
            </a>
        </div>
    );
}