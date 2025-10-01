# Should take a board like:
# .AN
# .L.
# BED
# and convert to:

def read_across(line, start_x):
    if start_x == 0:
        return line.split(".")[0]
    
    return line.split(line[:start_x])[1].split(".")[0]

def read_down(lines, start_x, start_y):
    col = "".join([line[start_x] for line in lines[start_y:]])
    return col.split(".")[0]

def get_clue(word, n, dir):
    if word in clues: return clues[word]
    return clues[f"{n}{dir[0]}"]

SIZE = 15
CLUES = True

import sys
input_lines = open(sys.argv[1], "r").read().split("\n")

clue_file = open(sys.argv[2], "r").read().split("\n")
clues = {}
for line in clue_file:
    clues[line.split(": ")[0]] = ": ".join(line.split(": ")[1:])


prev_line = None
board = {
    "size": SIZE,
    "blank": [],
    "numbers": {},
    "across": {},
    "down": {},
    "ref": {}
}

curr_num = 1

for y, line in enumerate(input_lines):
    if not line: continue
    prev_char = None
    for x, char in enumerate(line):
        # for num in board["numbers"]:
        #     print(f"{board['numbers'][num]} at {divmod(num, SIZE)[::-1]}")


        i = SIZE * y + x
        if char == ".": 
            prev_char = "."
            board["blank"] += [i]
            continue

        if prev_char in [None, "."]: # Start of an across clue (maybe)
            if x != SIZE - 1 and line[x + 1] != ".": # confirmed
                n = curr_num
                curr_num += 1
                acr = read_across(line, x)
                board["numbers"][i] = n
                board["across"][n] = {
                    "clue": get_clue(acr, n, "across") if CLUES else "",
                    "answer": acr
                }
                for j in range(len(acr)):
                    board["ref"][i + j] = board["ref"].get(i + j, []) + [f"{n}a"]


                
                if y != SIZE - 1 and (prev_line == None or prev_line[x] == ".") and input_lines[y + 1][x] != ".": # Also the start of a down clue
                    down = read_down(input_lines, x, y)
                    board["down"][n] = {
                        "clue": get_clue(down, n, "down") if CLUES else "",
                        "answer": down
                    } 
                    for j in range(len(down)):
                        board["ref"][i + SIZE * j] = board["ref"].get(i + SIZE * j, []) + [f"{n}d"]

                    
                    prev_char = char
                    continue

        if y != SIZE - 1 and (prev_line == None or prev_line[x] == ".") and input_lines[y + 1][x] != ".":
            n = curr_num
            curr_num += 1

            board["numbers"][i] = n
            down = read_down(input_lines, x, y)
            board["down"][n] = {
                "clue": get_clue(down, n, "down") if CLUES else "",
                "answer": down
            } 
            for j in range(len(down)):
                board["ref"][i + SIZE * j] = board["ref"].get(i + SIZE * j, []) + [f"{n}d"]


        prev_char = char

    prev_line = line



import json
with open(sys.argv[3], "w") as f:
    f.write(json.dumps(board, separators=(",",":")))