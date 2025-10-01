function reveal_word() {
    // Get which word you're even on
    if (!selected) return;

    let i = parseInt(selected.id.split(";")[0]);
    
    let ref = board.ref[i];
    if (ref.length == 2) ref = ref.filter(e => e.charAt(e.length - 1) == selected_dir)[0];
    else ref = ref[0];

    let origin = get_origin(ref);
    
    let dir = ref.charAt(ref.length - 1) == "d" ? "down" : "across";
    let soln = board[dir][ref.slice(0, ref.length - 1)].answer;

    let [cx, cy] = origin;

    for (let i = 0; i < soln.length; i++) {
        let ci = cy * board.size + cx;
        let el = document.getElementById(`${ci};${cx};${cy}`);
        el.innerText = soln.charAt(i);
        el.classList.remove("incorrect");
        switch (dir) {
            case "down": 
                cy++;
                break;
            case "across":
                cx++;
                break;
        }
    }
}

function reveal_letter() {
    if (selected) selected.innerText = get_correct(selected);
    selected?.classList.remove("incorrect");
}





function check_square(square) {
    return square.innerText == get_correct(square);
}

function format_check(square) {
    if (!square || !square.innerText) return;
    if (!check_square(square)) square.classList.add("incorrect");
}

function check_word() {
    if (!selected) return;

    let i = parseInt(selected.id.split(";")[0]);
    
    let ref = board.ref[i];
    if (ref.length == 2) ref = ref.filter(e => e.charAt(e.length - 1) == selected_dir)[0];
    else ref = ref[0];

    let origin = get_origin(ref);
    
    let dir = ref.charAt(ref.length - 1) == "d" ? "down" : "across";
    let soln = board[dir][ref.slice(0, ref.length - 1)].answer;
    let [cx, cy] = origin;

    for (let i = 0; i < soln.length; i++) {
        let ci = cy * board.size + cx;
        let el = document.getElementById(`${ci};${cx};${cy}`);
        format_check(el);
        switch (dir) {
            case "down": 
                cy++;
                break;
            case "across":
                cx++;
                break;
        }
    }
}

function check_puzzle() {
    for (let square of document.querySelectorAll(".square")) format_check(square);
}





function get_save_code() {
    let out = "";
    for (let square of document.querySelectorAll(".square")) {
        // if (square.innerText) out += `${square.id.split(";")[0]}:${square.innerText},`;
        if (!square.innerText) out += " ";
        else out += square.innerText;
    }

    let w = window.open("about:blank", "_blank");
    w.document.write(btoa(out));
}

let old = false;
function load_from_save_code(code) {
    let t = atob(code);
    if (old) {
        for (let opt of t.split(",")) {
            let [i, x] = opt.split(":");
            let X = i % board.size;
            let Y = Math.floor(i / board.size);
            document.getElementById(`${i};${X};${Y}`).innerText = x;
        }
    } else {
        let squares = [...document.querySelectorAll(".square")];
        for (let i = 0; i < squares.length; i++) {
            squares[i].innerText = t[i];
        }
    }
}