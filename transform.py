with open("clues.txt", "w") as of:
    with open("temp", "r") as f:
        lines = f.read().split("\n")
        out_lines = []
        curr = ""
        for line in lines:
            if not line: continue
            if (line in ["ACROSS", "DOWN"] or line[0].isdigit()) and curr:
                out_lines += [curr.strip()]
                curr = line
            else:
                curr += " " + line

        if curr:
            out_lines += [curr.strip().split(" New to cryptic")[0]]

        down_marker = out_lines.index("DOWN")

        for i, clue in enumerate(out_lines):
            if clue in ["ACROSS", "DOWN"]: continue
            num = clue.split(" ")[0]
            sol = " ".join(clue.split(" ")[1:])
            
            if i < down_marker:
                of.write(f"{num}a: {sol}\n")
            else:
                of.write(f"{num}d: {sol}\n")