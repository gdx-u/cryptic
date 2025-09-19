function move_forward() {
    let c_id = selected.id;
    let [ci, cx, cy] = c_id.split(";");
    let pi = ci;
    switch (selected_dir) {
        case "a":
            ci++;
            cx++;
            break;
        case "d":
            ci = parseInt(ci) + board.size;
            cy++;
    }

    selected = document.getElementById(`${ci};${cx};${cy}`);
    if (selected == null) {
        ci = pi;
        
        let ref = board.ref[ci];
        if (ref.length == 2) ref = ref.filter(e => e[e.length - 1] == selected_dir)[0];
        else ref = ref[0];

        // Backwards so find last num
        let d = selected_dir == "d" ? "down" : "across";
        let next_idx = Object.keys(board[d]).indexOf(ref.slice(0, ref.length - 1)) + 1;
        next_idx = next_idx < Object.keys(board[d]).length ? next_idx : 0;
        let [nx, ny] = get_origin(Object.keys(board[d])[next_idx] + selected_dir);
        ni = ny * board.size + nx;
        selected = document.getElementById(`${ni};${nx};${ny}`);
    }

    update_selection();
}

function move_backward() {
    let c_id = selected.id;
    let [ci, cx, cy] = c_id.split(";");
    let pi = ci;
    switch (selected_dir) {
        case "a":
            ci--;
            cx--;
            break;
        case "d":
            ci -= board.size;
            cy--;
    }

    selected = document.getElementById(`${ci};${cx};${cy}`);
    if (selected == null) {
        ci = pi;
        
        let ref = board.ref[ci];
        if (ref.length == 2) ref = ref.filter(e => e[e.length - 1] == selected_dir)[0];
        else ref = ref[0];

        // Backwards so find last num
        let d = selected_dir == "d" ? "down" : "across";
        
        let next_idx = Object.keys(board[d]).indexOf(ref.slice(0, ref.length - 1)) - 1;
        next_idx = next_idx >= 0 ? next_idx : Object.keys(board[d]).length - 1;
        // let [nx, ny] = get_origin(Object.keys(board[d])[next_idx] + selected_dir);

        // ni = ny * board.size + nx;
        // selected = document.getElementById(`${ni};${nx};${ny}`);
        selected = document.getElementById(clue_ends[Object.keys(board[d])[next_idx] + selected_dir]);
    }

    update_selection();
}

function update_selection() {
    [...document.querySelectorAll(".selected")].forEach(e => e.classList.remove("selected", "start", "colored"));
    [...document.querySelectorAll(".selected_clue")].forEach(e => e.classList.remove("selected_clue"));

    if (!selected) return;

    selected.classList.add("selected", "start", "colored");
    let x = 0;
    let y = 0;
    if (selected_dir == "a") x = 1;
    else y = 1;

    let cx = parseInt(selected.id.split(";")[1]) + x;
    let cy = parseInt(selected.id.split(";")[2]) + y;

    while (document.getElementById(`${cy * board.size + cx};${cx};${cy}`)) {
        document.getElementById(`${cy * board.size + cx};${cx};${cy}`).classList.add("selected", "colored");
        cx += x;
        cy += y;  
    }

    cx = parseInt(selected.id.split(";")[1]) - x;
    cy = parseInt(selected.id.split(";")[2]) - y;

    while (document.getElementById(`${cy * board.size + cx};${cx};${cy}`)) {
        document.getElementById(`${cy * board.size + cx};${cx};${cy}`).classList.add("selected", "colored");
        cx -= x;
        cy -= y;  
    }

    let i = parseInt(selected.id.split(";")[0]);

    // Get reference for clue highlighting
    let ref = board.ref[i];
    if (ref.length == 2) ref = ref.filter(e => e.charAt(e.length - 1) == selected_dir)[0];
    else ref = ref[0];

    let el = document.getElementById(ref);
    let par = el.parentElement.parentElement;

    let pr = par.getBoundingClientRect();
    let cr = el.getBoundingClientRect();

    let pst = par.scrollTop;
    let ccy = cr.top - pr.top + pst + cr.height / 2;

    let tst = ccy - par.clientHeight / 2;

    el.classList.add("selected_clue");
    par.scrollTo({
        left: 0,
        top: tst,
        behavior: "smooth"
    });
}

let selected;
let selected_dir;

function get_correct(square) {
    let [i, x, y] = square.id.split(";");
    let ref = board.ref[i];
    let clue = ref[0];

    let origin = get_origin(clue);
    let offset = Math.abs(x - origin[0]) + Math.abs(y - origin[1]);

    let char = board[clue.charAt(clue.length - 1) == "a" ? "across" : "down"][clue.slice(0, clue.length - 1)].answer.charAt(offset);

    return char
}

function main() {
    [...document.querySelectorAll(".square")].forEach(e => {
        e.addEventListener("click", (ev) => {
            if (selected == ev.target) {
                switch (selected_dir) {
                    case null:
                        selected_dir = "a";
                        break;
                    case "a":
                        selected_dir = "d";
                        break;
                    case "d":
                        selected_dir = null;
                        selected = null;
                        break;
                }
            } else {
                selected = ev.target;
                selected_dir = "a";
            }

            update_selection();
        });

        e.addEventListener("contextmenu", ev => {
            ev.preventDefault();
        });
    });

    document.onkeydown = e => {
        if (!selected) return;

        let key = e.key.toUpperCase();

        if (selected) {
            selected.classList.remove("incorrect");
            switch (key) {
                case "BACKSPACE":
                    selected.innerText = "";
                    move_backward();
                    break;
                case " ":
                    move_forward();
                    break;
                case "ARROWLEFT":
                    if (selected_dir == "a") move_backward();
                    else {
                        selected_dir = "a";
                        update_selection();
                    }
                    break;
                case "ARROWRIGHT":
                    if (selected_dir == "a") move_forward();
                    else {
                        selected_dir = "a";
                        update_selection();
                    }
                    break;
                case "ARROWUP":
                    if (selected_dir == "d") move_backward();
                    else {
                        selected_dir = "d";
                        update_selection();
                    }
                    break;
                case "ARROWDOWN":
                    if (selected_dir == "d") move_forward();
                    else {
                        selected_dir = "d";
                        update_selection();
                    }
                    break;

                default:
                    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(key)) {
                        selected.innerText = key;
                        move_forward();
                    }
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function check() {
    for (let square of document.querySelectorAll(".square")) {
        square.classList.add("flash");
        if (square.innerText == get_correct(square)) {
            square.style.backgroundColor = "lime";
        } else if (square.innerText) square.style.backgroundColor = "red";
    }

    await sleep(100);
    for (let square of document.querySelectorAll(".square")) {
        square.classList.remove("flash");
        square.style.backgroundColor = "";
    }
}