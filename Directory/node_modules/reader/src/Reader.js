import './css/reader_styles.css';

export default function Reader() {
    return (
        <div class="container">
            <PDFdisplay />
            <div class="right-side">
                <Timer />
                <Notes />
            </div>
        </div>
    );
}

function PDFdisplay() {
    return (
        <div class="left-side">
        </div>
    );
}

function Timer() {
    return (
        <div>
        </div>
    );
}

function Notes() {
    return (
        <div>
        </div>
    );
}