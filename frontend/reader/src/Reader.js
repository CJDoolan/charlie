import './css/reader_styles.css';
import './css/AnnotationLayer.css'
import './css/TextLayer.css'
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

export default function Reader() {
    const pageStart = 1;
    // this variable is the page the user starts on. It will need to be updated using the backend based on the page they last ended on
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(pageStart);

    function onloadSuccess({numPages}) {
        setNumPages(numPages);
    }

    function onLoadError(error) {
        console.log("Error loading pdf: ", error);
    }

    function onSourceError(error) {
        console.log("Error with PDF source: ", error)
    }

    function prevPage() {
        setPageNumber(prevPage => Math.max(prevPage - 1, 1))
    }

    function nextPage() {
        setPageNumber(prevPage => Math.min(prevPage + 1, numPages))
    }

    return (
        <div className="container">
            <Endreading pageNumber={pageNumber}/>
            <div className="left-side">
                <div className="page-buttons">
                    <button onClick={prevPage} disabled={pageNumber <= 1} className="page-control">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 -12 24 24" fill="none" stroke="#252E2C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <h3>Page {pageNumber}</h3>
                    <button onClick={nextPage} disabled={pageNumber >= numPages} className="page-control">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 -12 24 24" fill="none" stroke="#252E2C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </div>
                <div className="pdf-display">
                    <Document
                        // this is where the pdf link goes. don't know yet how it will be stored in the backend
                        file={`${process.env.PUBLIC_URL}/imgtemp/examplePDF.pdf`}
                        onLoadSuccess={onloadSuccess}
                        onLoadError={onLoadError}
                        onSourceError={onSourceError} 
                    >
                        <Page pageNumber={pageNumber}/>
                    </Document>
                </div>
            </div>
            <div className="right-side">
                <Timer />
                <Notes pageNumber={pageNumber}/>
            </div>
        </div>
    );
}

function Timer() {
    const totalTime = 120;
    // this variable will be updated based on time selected earlier
    const [timeLeft, setTimeLeft] = useState(totalTime);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <div className="timer-div">
            <h3 className="time-display">{formatTime(timeLeft)}</h3>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>
    );
}


function Notes({ pageNumber }) {
    const [noteInput, setNoteInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedText, setEditedText] = useState('');
    // notes are stored in an object
    // keys are the pages that the notes appear on
    // values are lists of notes
    // might be able to store the whole object in the backend instead of storing each note individually
    // otherwise could just reconstuct the object before rendering to the page

    const handleInputChange = (e) => {
        setNoteInput(e.target.value);
    };

    const handleKeyDownInput = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNote();
        }
    };

    const addNote = () => {
        if (noteInput.trim() !== '') {
            const newNotes = { ...notes };
            if (!newNotes[pageNumber]) {
                newNotes[pageNumber] = [];
            }
            newNotes[pageNumber].push(noteInput);
            setNotes(newNotes);
            setNoteInput('');
        }
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditedText(notes[pageNumber][index]);
    };

    const handleEditChange = (e) => {
        setEditedText(e.target.value);
    };

    const saveEdit = (index) => {
        const pageNotes = [...(notes[pageNumber] || [])];
        pageNotes[index] = editedText;
        setNotes({ ...notes, [pageNumber]: pageNotes });
        setEditingIndex(null);
    };

    const handleKeyDownEdit = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit(index);
        }
    };

    const handleBlur = () => {
        if (editingIndex !== null) {
            saveEdit(editingIndex);
        }
    };

    const deleteNote = (index) => {
        const pageNotes = notes[pageNumber].filter((_, noteIndex) => noteIndex !== index);
        setNotes({ ...notes, [pageNumber]: pageNotes });
    };

    return (
        <div className="notes-div">
            <h3>Notes</h3>
            <textarea
                type="text"
                className="note-input"
                placeholder="Enter your note here"
                value={noteInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDownInput}
            >
            </textarea>
            <button className="page-btn" onClick={addNote}>Add Note</button>
            <div id="noteContainer">
                {notes[pageNumber] && notes[pageNumber].map((note, index) => (
                    <div key={index} className="note">
                        <button className="delete-note" onClick={() => deleteNote(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC4C64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                        {editingIndex === index ? (
                            <textarea
                                type="text"
                                value={editedText}
                                onChange={handleEditChange}
                                onKeyDown={(e) => handleKeyDownEdit(e, index)}
                                onBlur={handleBlur}
                                className="edit-input"
                            />
                        ) : (
                            <div onClick={() => startEditing(index)}>
                                {note}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Endreading({ pageNumber }) {
    const pageStart = 1;
    // this variable is the page the user starts on. It will need to be updated using the backend based on the page they last ended on
    const totalTime = 120;
    // this variable will be updated based on time selected earlier
    const [timeLeft, setTimeLeft] = useState(totalTime);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else {
            document.getElementById('screen-cover').style.display = "block";
        }
    }, [timeLeft]);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div id='screen-cover' style={{display: "none"}}>
            <div className='screen-cover-fade'></div>
            <div className='end-container'>
                <div className='end-text-div'>
                    <h3>Great job! Here's a breakdown of your session.</h3>
                    <p>You read for <span>
                            {formatTime(totalTime)}
                        </span> and earned <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="1 -4 24 24"><path fill="#FFCC4D" d="M17 3.34A10 10 0 1 1 2 12l.005-.324A10 10 0 0 1 17 3.34M12 6a1 1 0 0 0-1 1a3 3 0 1 0 0 6v2a1.02 1.02 0 0 1-.866-.398l-.068-.101a1 1 0 0 0-1.732.998a3 3 0 0 0 2.505 1.5H11a1 1 0 0 0 .883.994L12 18a1 1 0 0 0 1-1l.176-.005A3 3 0 0 0 13 11V9c.358-.012.671.14.866.398l.068.101a1 1 0 0 0 1.732-.998A3 3 0 0 0 13.161 7H13a1 1 0 0 0-1-1m1 7a1 1 0 0 1 0 2zm-2-4v2a1 1 0 0 1 0-2"/></svg>
                            {Math.floor(totalTime / 30)}
                        </span>.
                    </p>
                    <p>In this session you got through <span>
                            {(pageNumber - pageStart) + 1}
                        </span> pages.
                    </p>
                    <p style={{marginTop: "20%"}}>We generated a quiz for you, based on the pages you read.</p>
                    <p>Would you like to test your knowledge?</p>
                    {
                        // this button will route to the take quiz area
                    }
                    <button className='page-btn' style={{marginRight: "30px", marginTop: "22px"}}>
                        Take Quiz
                    </button>
                    {
                        // this button will route to the booklog
                    }
                    <button className='page-btn' style={{marginTop: "22px"}}>
                        Continue Reading
                    </button>
                </div>
            </div>
        </div>
    );
}