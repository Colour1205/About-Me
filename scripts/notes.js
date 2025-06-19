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
        } else if (['pdf', 'ppt', 'pptx', 'doc', 'xls', 'xlsx', 'docx', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
            // PDF and images
            viewer_panel.innerHTML = `<iframe src="../public/file-viewer/index.html?fileUrl=${PATH}" scrolling="auto"></iframe>`;
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
    const lastDot = filename.lastIndexOf('.');
    if (lastDot == -1) return '';
    return filename.substring(lastDot + 1);
}

// helper to remove file extension
function removeFileExtension(filename) {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot == -1) return filename // doesn't have extension
    return filename.substring(0, lastDot);
}

/* show course button logic */
const show_course_button = document.getElementById('show-course-button');
show_course_button.addEventListener('click', () => {
    show_course_button.classList.toggle('active');
    const course_container = document.querySelector('.course-container');
    course_container.classList.toggle('active');
})

async function displayNotes() {
    let note_list = await listNotes();

    const course_panel = document.getElementById('course-panel');
    course_panel.innerHTML = '';
    if (note_list && Object.keys(note_list).length > 0) {
        for (const COURSE in note_list) {
            course_panel.innerHTML += `<button class="card vertical-text course" course-id="${COURSE}">${COURSE}</button>`;
        }
    }

    // add all course event listeners
    const course_buttons = course_panel.querySelectorAll('button[course-id]');
    course_buttons.forEach(course_btn => {
        course_btn.addEventListener('click', () => {
            course_buttons.forEach(b => b.classList.remove('active'));
            course_btn.classList.add('active');
            const course_container = document.querySelector('.course-container');
            if (course_container) course_container.classList.remove('active');
            show_course_button.classList.remove('active');

            const course_name = course_btn.getAttribute('course-id');
            const module_panel = document.getElementById('module-panel');
            const notes_panel = document.getElementById('notes-panel');

            module_panel.innerHTML = '' //reset module panel
            notes_panel.innerHTML = '' //reset notes panel

            const modules = note_list[course_name];

            for (const MODULE in modules) {
                module_panel.innerHTML += `<button class="card module" module-id="${MODULE}">${MODULE}</button>`;
            }

            // add all module event listener
            const module_buttons = module_panel.querySelectorAll('button[module-id]');
            module_buttons.forEach(module_btn => {
                module_btn.addEventListener('click', () => {
                    module_buttons.forEach(b => b.classList.remove('active'));
                    module_btn.classList.add('active');

                    const module_name = module_btn.getAttribute('module-id');
                    notes_panel.innerHTML = '' //reset notes panel
                    const notes = modules[module_name];

                    for (const NOTE of notes) {
                        notes_panel.innerHTML += `<button class="card note" note-id="${NOTE}">${NOTE}</button>`;
                    }

                    // add all note event listener
                    const note_buttons = notes_panel.querySelectorAll('button[note-id]');
                    note_buttons.forEach(note_btn => {
                        note_btn.addEventListener('click', () => {
                            note_buttons.forEach(b => b.classList.remove('active'));
                            note_btn.classList.add('active');

                            const note_name = note_btn.getAttribute('note-id');
                            viewNote(course_name, module_name, note_name);
                        })
                    })
                })
            })

            // simulate click of first module
            const first_module = document.querySelector('button[module-id]');

            if (first_module) {
                first_module.click();
                const first_note = document.querySelector('button[note-id]');

                // simulate click of first note and not on small screens
                if (first_note && window.innerWidth > 735) {
                    first_note.click();
                }
            }


        })
    })

    // display the initial view
    const first_course = document.querySelector('button[course-id]');

    if (first_course) {
        first_course.click();

        const first_module = document.querySelector('button[module-id]');

        if (first_module) {
            first_module.click();

            const first_note = document.querySelector('button[note-id]');

            if (first_note) {
                first_note.click();
            }
        }
    }


}

displayNotes(); // display note on initial load

