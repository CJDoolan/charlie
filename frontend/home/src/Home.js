import './css/home_styles.css';
import './css/AnnotationLayer.css'
import './css/TextLayer.css'
import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import * as THREE from 'three';
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

export default function Home() {
    return (
        <div class="container">
            <Mascot />
            <div class="right-side">
                <Upload />
                <div>
                    <h3 class="body_title">Jump back in</h3>
                    <div class="jump-back-in">
                        <Bookpreview
                            pdf="example.pdf"
                            bookname="Molecular Biology Techniques, 4th ed."
                            link="#"  // def change this later because the link will not be used and routing between home and start screen will be done through backend
                        />
                        <Bookpreview 
                            pdf="example.pdf"
                            bookname="Molecular Biology Techniques, 4th ed."
                            link="#"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Mascot() {
    const name = "Bo";

    return (
        <div class="left-side">
            <h3 class="body_title">Welcome back, {name}</h3>
            <div class="mascot-container">
            <Canvas camera={{ position: [0, 0, 10] }}>
                <ambientLight intensity={Math.PI / 3} color={'#FFFFFF'}/>
                <directionalLight position={[10, 10, 10]} angle={0.15} penumbra={1.3} decay={0.15} intensity={Math.PI / 2} color={'#FFFFFF'}/>
                <pointLight position={[-10, -10, -10]} decay={0.6} intensity={Math.PI} color={'#FFFFFF'}/>
                <OrbitControls enablePan={false} minDistance={5} maxDistance={20}/>

                <Critter/>
            </Canvas>
            </div>
        </div>
    );
}

function Critter() {
    const { scene, animations } = useGLTF(`${process.env.PUBLIC_URL}/imgtemp/peepeepoopoo.glb`);
    const modelRef = useRef();
    const { actions, names } = useAnimations(animations, modelRef);

    React.useEffect(() => {
        if (actions && names.length > 0) {
            actions[names[0]].play();
        }
    }, [actions, names]);

    return (
        <primitive 
            ref={modelRef} 
            object={scene} 
            scale={[1, 1, 1]} 
            rotation={[0, -Math.PI / 2, 0]}
            position={[0, -2, 0]}
        />
    );
}

function Upload() {
    const [fileName, setFileName] = useState('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const dragOverHandler = (event) => {
        if (!isFileUploaded) {
            event.preventDefault();
            event.stopPropagation();
            setIsDragging(true);
        }
    };

    const dragLeaveHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const dropHandler = (event) => {
        if (!isFileUploaded) {
            event.preventDefault();
            event.stopPropagation();
            setIsDragging(false);

            const file = event.dataTransfer.files[0];
            handleFile(file);
        }
    };

    const fileChangeHandler = (event) => {
        const file = event.target.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        if (file && file.type === 'application/pdf') {
            setFileName(file.name);
            setIsFileUploaded(true);
        } else {
            alert('Please upload a valid PDF file.');
        }
    };

    return (
        <div>
            <h3 class="body_title">Start a new reading</h3>
            <div
                id="dropArea"
                class={`new-reading ${isDragging ? 'dragging' : ''}`}
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                style={{ backgroundColor: isDragging ? '#EAFFFC' : '#FFFFFF' }}
            >
                {!isFileUploaded && ( <>
                    <svg
                        id="uploadSymbol"
                        xmlns="http://www.w3.org/2000/svg"
                        width="7em"
                        height="7em"
                        viewBox="0 0 24 24"
                    >
                        <path fill="#47837A" d="M11 14.825V18q0 .425.288.713T12 19t.713-.288T13 18v-3.175l.9.9q.15.15.338.225t.375.063t.362-.088t.325-.225q.275-.3.288-.7t-.288-.7l-2.6-2.6q-.15-.15-.325-.212T12 11.425t-.375.063t-.325.212l-2.6 2.6q-.3.3-.287.7t.312.7q.3.275.7.288t.7-.288zM6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V20q0 .825-.587 1.413T18 22zm7-14q0 .425.288.713T14 9h4l-5-5z"/>
                    </svg>
                    <p id="uploadText">Drop pdf files here or</p>
                    <button className="home-btn" id="uploadButton" onClick={() => document.getElementById('fileInput').click()}>Browse files</button>
                </> )}

                <input
                    type="file"
                    id="fileInput"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    onChange={fileChangeHandler}
                />

                {isFileUploaded && ( <>
                    <svg
                        id="confirmationSymbol"
                        xmlns="http://www.w3.org/2000/svg"
                        width="7em"
                        height="7em"
                        viewBox="0 0 24 24"
                    >
                        <path fill="#47837A" d="M10 10.5h1q.425 0 .713-.288T12 9.5v-1q0-.425-.288-.712T11 7.5H9.5q-.2 0-.35.15T9 8v4q0 .2.15.35t.35.15t.35-.15T10 12zm0-1v-1h1v1zm5 3q.425 0 .713-.288T16 11.5v-3q0-.425-.288-.712T15 7.5h-1.5q-.2 0-.35.15T13 8v4q0 .2.15.35t.35.15zm-1-1v-3h1v3zm4-1h.5q.2 0 .35-.15T19 10t-.15-.35t-.35-.15H18v-1h.5q.2 0 .35-.15T19 8t-.15-.35t-.35-.15h-1q-.2 0-.35.15T17 8v4q0 .2.15.35t.35.15t.35-.15T18 12zM8 18q-.825 0-1.412-.587T6 16V4q0-.825.588-1.412T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-4 4q-.825 0-1.412-.587T2 20V7q0-.425.288-.712T3 6t.713.288T4 7v13h13q.425 0 .713.288T18 21t-.288.713T17 22z"/>
                    </svg>
                    <p id="fileNameDisplay" style={{ display: 'block' }}>{fileName}</p>
                    <a href="#">
                        {
                            // this will take you to the start reading page for the newly uploaded book
                        }
                        <button class="home-btn" id="fileReadingButton" style={{ display: 'block' }}>Start reading</button>
                    </a>
                </> )}
            </div>
        </div>
    );
}

function Bookpreview(props) {
    function onLoadError(error) {
        console.log("Error loading PDF: ", error);
    }
    
    function onSourceError(error) {
        console.log("Error with PDF source: ", error);
    }

    return (
        <div class="book-card">
            <div class="pdf-thumbnail-holder">
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
                {
                    // this will take you to the start reading page for the respective book
                }
                <button class="home-btn">Read</button>
            </a>
        </div>
    );
}
