let in_game: boolean = true;
let current_word: string = "Bazinga";
let num_guesses: number = 5;
let cursor = {
    x:0,
    y:0,
}

let word_lists = {};
let curr_word_list = "";

async function load_word_list(url: string, list_name: string) {
    let list = await fetch(url).then((res)=>res.text()).then((text)=>text.toUpperCase().split(/\s+/));
    word_lists[list_name] = list;
}

document.onkeydown = function (event: KeyboardEvent) {
    let key = event.key;
    
    if(in_game) {
        if(key.length == 1 && key.toLowerCase() != key.toUpperCase()) {
            try_insert_letter(key);
        } else if(key.toLowerCase() === "enter") {
            try_complete_word();
        } else if(key.toLowerCase() === "backspace") {
            try_remove_letter();
        }
    }
}

function display_alert(msg: string) {
    let alert_box = document.getElementById("alert-box");
    alert_box.classList.remove("alert-box-anim");
    alert_box.innerHTML = msg;
    alert_box.classList.add("alert-box-anim");

    let duration = parseFloat(getComputedStyle(document.documentElement)
        .getPropertyValue('--alert-display-duration'));

    setTimeout(function(){
        alert_box.classList.remove("alert-box-anim");
    }, duration*1000);
}

function toggle_instruction_box() {
    let box = document.getElementById("instruction_box");
    if(box.className === "instruction-box") {
        box.className = "hidden-instruction-box";
    } else {
        box.className = "instruction-box";
    }
}

function try_insert_letter(letter: string) {
    if(cursor.x < current_word.length) {
        set_letter_inner(letter.toUpperCase(), cursor.x, cursor.y);
        cursor.x += 1;
    } else {
        notify_invalid_input();
    }
}

function try_remove_letter() {
    if(cursor.x > 0) {
        set_letter_inner("", cursor.x-1, cursor.y);
        cursor.x -= 1;
    } else {
        notify_invalid_input();
    }
}

function try_complete_word() {
    let won = false;
    if(cursor.x < current_word.length) {
        notify_invalid_input();
        return;
    }
    if(cursor.y < num_guesses) {
        let invalid_input = false;
	try {
	    won = validate_guess();
	} catch(e) {
	    notify_not_in_word_list();
	    invalid_input = true;
	}
	if(invalid_input) {
	    return;
	} else if(won || cursor.y == num_guesses-1) {
            end_game(won);
	} else {
            cursor.y += 1;
            cursor.x = 0;
        }
    }
}

function validate_guess() {
    let guess = get_guess(cursor.y).toUpperCase();
    
    if(!word_lists[curr_word_list].includes(guess)) {
        throw 0;
    }
    
    let correct = current_word.toUpperCase();
    let won = guess === correct;

    let correct_letter_set = {};

    // This is awful code but I'm not worried at all about efficiency here.
    for(let x = 0; x < current_word.length; x++) {
        correct_letter_set[guess.charAt(x)] = 0;
        correct_letter_set[correct.charAt(x)] = 0;
    }
    for(let x = 0; x < current_word.length; x++) {
        correct_letter_set[correct.charAt(x)] += 1;
    }
    let right_place_right_letter: Boolean[] = [];
    for(let x = 0; x < current_word.length; x++) {
        right_place_right_letter[x] = false;
        if(guess.charAt(x) === correct.charAt(x)) {
            correct_letter_set[guess.charAt(x)] -= 1;
            right_place_right_letter[x] = true;
        }
    }
    let wrong_place_right_letter: Boolean[] = [];
    for(let x = 0; x < current_word.length; x++) {
        wrong_place_right_letter[x] = false;
        if(!right_place_right_letter[x]) {
            if(correct_letter_set[guess.charAt(x)] > 0) {
                wrong_place_right_letter[x] = true;
                correct_letter_set[guess.charAt(x)] -= 1;
            }
        }
    }

    for(let x = 0; x < current_word.length; x++) {
        let elem = document.getElementById("letter_box_"+x+"_"+cursor.y);
        if(right_place_right_letter[x]) {
            elem.className = "correct-letter-box";
        } else if(wrong_place_right_letter[x]) {
            elem.className = "partial-correct-letter-box";
        } else {
            elem.className = "incorrect-letter-box";
        }
    }

    return won;
}

function end_game(won: boolean) {
    in_game = false;
    if(won) {
        alert("You Win!");
    } else {
        alert("You Lost! The Word was: " + current_word + "!");
    }
}

function get_guess(y: number) {
    let guess = "";
    for(let x = 0; x < current_word.length; x++) {
        guess += document.getElementById("letter_"+x+"_"+y)?.innerHTML;
    }
    return guess;
}

function notify_invalid_input() {
//   display_alert("Invalid Input!");
}
function notify_not_in_word_list() {
   display_alert("Not In Word List!"); 
}

function set_letter_inner(inner: string, x: number, y: number) {
    let elem = document.getElementById("letter_"+x+"_"+y);
    elem.innerHTML = inner;
}

async function initial_load() {
    const default_url = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
    await load_word_list(default_url, "default");
    const french_url = "https://raw.githubusercontent.com/Taknok/French-Wordlist/master/francais.txt";
    await load_word_list(french_url, "french");
    load_game("french");
}

function load_game(word_list: string) {
    curr_word_list = word_list;
    const word_list_len = word_lists[word_list].length;
    const word_index = Math.floor(Math.random() * word_list_len);
    current_word = word_lists[word_list][word_index].trim();
    num_guesses = current_word.length;
    init_words("words");
    in_game = true;
}

function init_words(id: string) {
    let x = current_word.length;
    let y = num_guesses;

    let elem = document.getElementById(id);
    elem.className = "words";
    let html = "";
    for(let j = 0; j < y; j++) {
        html += "<div class=\"word\">";
        for(let i = 0; i < x; i++) {
            html += "<div class=\"letter-box\" id=\"letter_box_"+i+"_"+j+"\">";
            html += "<div class=\"letter\" id=\"letter_"+i+"_"+j+"\"></div>";
            html += "</div>";
        }
        html += "</div>";
    }
    elem.innerHTML = html;
}

initial_load();
