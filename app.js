$( document ).ready(function() {
    const typingBar = document.querySelector('input.form-control#typing-area-input')
    $(typingBar).keypress(_.once(start))
    $(typingBar).keypress(_.once(createStatSection))
});
function start() {
    var state = createGwamState();
    const typingBar = document.querySelector('input.form-control#typing-area-input')
    const handler = _.curry((event, state) => incrementKeyStrokes(state));
    addKeyStrokeListener(typingBar, handler(_, state))
    var  ui = setInterval(function() { updateUI(state) }, 1000);
    addResetListener(ui, state, typingBar)
    addStopListener(ui)
}
function addResetListener(ui, state, typingBar) {
    document.querySelector('button#reset-button').addEventListener('click', function() { 
        state.keyStrokes = 0;
        state.start = Date.now();
        clearInterval(ui);
        updateUI(state);
        $(typingBar).keypress(_.once(start))
    })
}

function addStopListener(ui) {
    document.querySelector('button#stop-button').addEventListener('click', function() {
        clearInterval(ui)
    })
}
function resetClicked(event, state) {
    state = createGwamState()
}
function updateUI(state) {
    const elapsed = Date.now() - state.start
    const gwam = calculateGwam(state.keyStrokes, elapsed)
    updateStats(gwam, elapsed)
}
function calculateGwam(keyStrokes, timeElapsed) {
    return (keyStrokes / 5) / (timeElapsed / 1000 / 60);
}
function createGwamState() {
    const state = { keyStrokes : 0, start: Date.now(), }

    return state;
}
function incrementKeyStrokes(state) {
    return state.keyStrokes += 1;
}

function addKeyStrokeListener(textBar, handler) {
    $(textBar).keypress(handler)
}

function createStatSection() {
    const dl = document.createElement('dl')
    dl.id = "stats-section"
    dl.classList.add('row')
    const gwam = document.createElement('dt')
    gwam.classList.add('col-sm-3')
    gwam.textContent = 'GWAM'
    const gwamValue = document.createElement('dd')
    gwamValue.classList.add('col-sm-9')
    gwamValue.id = 'gwam'

    const timeElapsed = document.createElement('dt')
    timeElapsed.textContent = 'Time elapsed: '
    timeElapsed.classList.add('col-sm-3')

    const timeValue = document.createElement('dd')
    timeValue.classList.add('col-sm-9')
    timeValue.id = 'time-elapsed'

    dl.appendChild(gwam)
    dl.appendChild(gwamValue)
    dl.appendChild(timeElapsed)
    dl.appendChild(timeValue)
    document.querySelector('div#stats-div').appendChild(dl);
}

function updateDisplayText(message) {
    const displayText = document.querySelector('h1#display-text');
    displayText.textContent = message
}

function updateStats(gwamValue, timeValue) {
    const stats = document.querySelector('dl#stats-section');
    const gwam = stats.querySelector('dd#gwam')
    const timeElapsed = stats.querySelector('dd#time-elapsed')

    gwam.textContent = Math.floor(gwamValue)
    timeElapsed.textContent = Math.floor(timeValue / 1000)

}
