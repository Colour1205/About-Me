fetch('http://192.168.1.45:5000/api/notes')
    .then(response => {
        console.log("Raw response:", response);
        return response.json();
    })
    .then(data => {
        console.log("Parsed JSON:", data);
        // Use data as needed for your UI
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });

const NOTE_SERVER_ADDRESS = 'http://192.168.1.45:5000';

async function listNotes() {
    try {
        const response = await fetch(`${NOTE_SERVER_ADDRESS}/api/notes`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error listing notes:', error);
    }
}

async function viewNote(course, module, note) {
    const PATH = `${NOTE_SERVER_ADDRESS}/notes/${encodeURIComponent(course)}/${encodeURIComponent(module)}/${encodeURIComponent(note)}`;
    const viewer_panel = document.getElementById('viewer-panel');
    const ext = getFileExtension(note);

    try {
        if (['txt', 'md', 'json', 'csv', 'js', 'py', 'java', 'c', 'cpp', 'log'].includes(ext)) {
            // Text-based: fetch as text
            const response = await fetch(PATH);
            if (!response.ok) throw new Error();
            const text = await response.text();
            viewer_panel.innerHTML = `<pre>${escapeHtml(text)}</pre>`;
        } else if (['pdf'].includes(ext)) {
            // PDF: show with iframe
            viewer_panel.innerHTML = `<iframe src="${PATH}"></iframe>`;
        } else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
            // Images
            viewer_panel.innerHTML = `<img src="${PATH}" alt="${note}">`;
        } else if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
            // Audio
            viewer_panel.innerHTML = `<audio controls src="${PATH}"></audio>`;
        } else if (['mp4', 'webm', 'mov'].includes(ext)) {
            // Video
            viewer_panel.innerHTML = `<video controls src="${PATH}"></video>`;
        } else {
            // Fallback: offer download
            viewer_panel.innerHTML = `
                <p>Cannot preview this file type. <a href="${PATH}" download>Download ${note}</a></p>
            `;
        }
    } catch (error) {
        viewer_panel.innerHTML = 'Error loading note.';
    }
}

// Helper to prevent HTML injection when showing text files
function escapeHtml(unsafe) {
    return unsafe.replace(/[&<>"']/g, function (m) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[m];
    });
}

// helper that returns file extension
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}


async function displayNotes() {
    let note_list = await listNotes();

    const course_panel = document.getElementById('course-panel');
    course_panel.innerHTML = '';
    if (note_list && Object.keys(note_list).length > 0) {
        for (const COURSE in note_list) {
            course_panel.innerHTML += `<button class="card" course-id="${COURSE}">${COURSE}</button>`;
        }
    }

    // add all course event listeners
    const course_buttons = course_panel.querySelectorAll('button[course-id]');
    course_buttons.forEach(course_btn => {
        course_btn.addEventListener('click', () => {
            const course_name = course_btn.getAttribute('course-id');
            const module_panel = document.getElementById('module-panel');
            const notes_panel = document.getElementById('notes-panel');

            module_panel.innerHTML = '' //reset module panel
            notes_panel.innerHTML = '' //reset notes panel

            const modules = note_list[course_name];

            for (const MODULE in modules) {
                module_panel.innerHTML += `<button class="card" module-id="${MODULE}">${MODULE}</button>`;
            }

            // add all module event listener
            const module_buttons = module_panel.querySelectorAll('button[module-id]');
            module_buttons.forEach(module_btn => {
                module_btn.addEventListener('click', () => {
                    const module_name = module_btn.getAttribute('module-id');
                    notes_panel.innerHTML = '' //reset notes panel
                    const notes = modules[module_name];

                    for (const NOTE of notes) {
                        notes_panel.innerHTML += `<button class="card" note-id="${NOTE}">${NOTE}</button>`;
                    }

                    // add all note event listener
                    const note_buttons = notes_panel.querySelectorAll('button[note-id]');
                    note_buttons.forEach(note_btn => {
                        note_btn.addEventListener('click', () => {
                            const note_name = note_btn.getAttribute('note-id');
                            viewNote(course_name, module_name, note_name);
                        })
                    })
                })
            })


        })
    })
}

displayNotes(); // display note on initial load