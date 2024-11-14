// Importing necessary CSS files for styling
import './css/startread_styles.css';
import './css/AnnotationLayer.css';
import './css/TextLayer.css';

// Importing React and necessary hooks
import React, { useState } from 'react';

// Importing components from react-pdf library
import { Document, Page, pdfjs } from "react-pdf";

// Setting the worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

// Main component that renders the Startread component
export default function Startread() {
    return (
        <div class="container">
            <MainContainer />
        </div>
    );
}

// MainContainer component that contains the main functionality
function MainContainer() {
    // Constant for the initial page number
    const pageNum = 1;

    // State variables for managing time, dragging, editing, and input time
    const [time, setTime] = useState(20);
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [inputTime, setInputTime] = useState(time);

    // Function to handle errors when loading the PDF
    function onLoadError(error) {
        console.log("Error loading PDF: ", error);
    }
    
    // Function to handle errors with the PDF source
    function onSourceError(error) {
        console.log("Error with PDF source: ", error);
    }

    // Function to calculate time based on the position of the click within the container
    const calculateTimeFromPosition = (event, container) => {
        const rect = container.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const width = rect.width;
        return Math.min(120, Math.max(0, (offsetX / width) * 120));
    };

    // Function to handle click events on the progress container
    const handleClick = (event) => {
        const progressContainer = event.currentTarget;
        const newTime = calculateTimeFromPosition(event, progressContainer);
        setTime(Math.round(newTime));
    };

    // Function to handle mouse down events
    const handleMouseDown = () => {
        setIsDragging(true);
    };

    // Function to handle mouse move events
    const handleMouseMove = (event) => {
        if (isDragging) {
            const progressContainer = event.currentTarget;
            const newTime = calculateTimeFromPosition(event, progressContainer);
            setTime(Math.round(newTime));
        }
    };

    // Function to handle mouse up events
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Function to handle click events on the time display
    const handleTimeDisplayClick = () => {
        setIsEditing(true);
        setInputTime(time);
    };

    // Function to handle changes in the input field
    const handleInputChange = (event) => {
        setInputTime(event.target.value);
    };

    // Function to handle blur events on the input field
    const handleInputBlur = () => {
        finalizeTimeEdit();
    };

    // Function to handle key down events on the input field
    const handleInputKeyDown = (event) => {
        if (event.key === "Enter") {
            finalizeTimeEdit();
        }
    };

    // Function to finalize the time edit and update the state
    const finalizeTimeEdit = () => {
        const newTime = Math.max(5, Math.min(120, parseInt(inputTime, 10) || 5));
        setTime(newTime);
        setIsEditing(false);
    };

    return (
        <div>
            <div className="new-reading">
                <div className="left-side">
                    <h4>Book selected</h4>
                    <div className="pdf-thumbnail-holder">
                        <Document
                            file={`${process.env.PUBLIC_URL}/imgtemp/example.pdf`}
                            onLoadError={onLoadError}
                            onSourceError={onSourceError}
                        >
                            <Page 
                                pageNumber={1}
                                width={220}
                            />
                        </Document>
                    </div>
                    <p>Sample book name goes here</p>
                    <p id="pageNumber">Page {pageNum}</p>
                    <a href="#">
                        {
                            // this will take you to the book log
                        }
                        <button className="home-btn">Select different book</button>
                    </a>
                </div>
                <div className="right-side">
                    <h4>Set reading length</h4>
                    <div className="timer-container">
                        <div 
                            className="timer-timeDisplay"
                            onClick={handleTimeDisplayClick}
                        >
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="timer-input"
                                    value={inputTime}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    onKeyDown={handleInputKeyDown}
                                    min="5"
                                    max="120"
                                    autoFocus
                                />
                            ) : (
                                <p><span>{time}</span> min</p>
                            )}
                        </div>
                        <div
                            className="timer-progressContainer"
                            onClick={handleClick}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <div
                                className="timer-progressBar"
                                style={{ width: `${(time / 120) * 100}%` }}
                            />
                        </div>
                    </div>
                    <a href="#">
                        {
                            // this will take you to the reader
                        }
                        <button className="home-btn">Start reading</button>
                    </a>
                </div>
            </div>
        </div>
    );
}
