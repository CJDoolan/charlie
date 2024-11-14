import './css/startread_styles.css';
import './css/AnnotationLayer.css'
import './css/TextLayer.css'
import React, { useState } from 'react';
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

export default function Startread() {
    return (
        <div class="container">
            <MainContainer />
        </div>
    );
}

function MainContainer() {
    const pageNum = 1;
    const [time, setTime] = useState(20);
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [inputTime, setInputTime] = useState(time);

    function onLoadError(error) {
        console.log("Error loading PDF: ", error);
    }
    
    function onSourceError(error) {
        console.log("Error with PDF source: ", error);
    }

    const calculateTimeFromPosition = (event, container) => {
        const rect = container.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const width = rect.width;
        return Math.min(120, Math.max(0, (offsetX / width) * 120));
    };

    const handleClick = (event) => {
        const progressContainer = event.currentTarget;
        const newTime = calculateTimeFromPosition(event, progressContainer);
        setTime(Math.round(newTime));
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const progressContainer = event.currentTarget;
            const newTime = calculateTimeFromPosition(event, progressContainer);
            setTime(Math.round(newTime));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTimeDisplayClick = () => {
        setIsEditing(true);
        setInputTime(time);
    };

    const handleInputChange = (event) => {
        setInputTime(event.target.value);
    };

    const handleInputBlur = () => {
        finalizeTimeEdit();
    };

    const handleInputKeyDown = (event) => {
        if (event.key === "Enter") {
            finalizeTimeEdit();
        }
    };

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
                        <button className="home-btn">Start reading</button>
                    </a>
                </div>
            </div>
        </div>
    );
}
