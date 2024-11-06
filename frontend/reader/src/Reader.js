import './css/reader_styles.css';
import './css/AnnotationLayer.css'
import './css/TextLayer.css'
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

export default function Reader() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

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
        <div class="container">
            <div class="left-side">
                <div class="page-buttons">
                    <button onClick={prevPage} disabled={pageNumber <= 1} class="page-control">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#252E2C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <p class="page-num-display">Page {pageNumber}</p>
                    <button onClick={nextPage} disabled={pageNumber >= numPages} class="page-control">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#252E2C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </div>
                <div class="pdf-display">
                    <Document
                    file={`${process.env.PUBLIC_URL}/imgtemp/examplePDF.pdf`}
                    onLoadSuccess={onloadSuccess}
                    onLoadError={onLoadError}
                    onSourceError={onSourceError} 
                    >
                        <Page pageNumber={pageNumber}/>
                    </Document>
                </div>
            </div>
            <div class="right-side">
                <Timer />
                <Notes pageNumber={pageNumber}/>
            </div>
        </div>
    );
}

function Timer() {
    const totalTime = 3600;
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
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <div class="timer-div">
            <h3 class="time-display">{formatTime(timeLeft)}</h3>
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
        setEditedText(notes[index]);
    };

    const handleEditChange = (e) => {
        setEditedText(e.target.value);
    };

    const saveEdit = (index) => {
        const updatedNotes = [...notes];
        updatedNotes[index] = editedText;
        setNotes(updatedNotes);
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
        const updatedNotes = { ...notes };
        updatedNotes[pageNumber] = updatedNotes[pageNumber].filter((_, noteIndex) => noteIndex !== index);
        setNotes(updatedNotes);
    };

    return (
        <div class="notes-div">
            <h3>Notes</h3>
            <textarea
                type="text"
                class="note-input"
                placeholder="Enter your note here"
                value={noteInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDownInput}
            >
            </textarea>
            <button class="note-btn" onClick={addNote}>Add Note</button>
            <div id="noteContainer">
                {notes[pageNumber] && notes[pageNumber].map((note, index) => (
                    <div key={index} className="note">
                        <button class="delete-note" onClick={() => deleteNote(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC4C64" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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