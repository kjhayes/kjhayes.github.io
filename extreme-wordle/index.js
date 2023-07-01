var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var in_game = true;
var current_word = "Bazinga";
var num_guesses = 5;
var cursor = {
    x: 0,
    y: 0
};
var word_lists = {};
var curr_word_list = "";
function load_word_list(url, list_name) {
    return __awaiter(this, void 0, void 0, function () {
        var list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url).then(function (res) { return res.text(); }).then(function (text) { return text.toUpperCase().split(/\s+/); })];
                case 1:
                    list = _a.sent();
                    word_lists[list_name] = list;
                    return [2 /*return*/];
            }
        });
    });
}
document.onkeydown = function (event) {
    var key = event.key;
    if (in_game) {
        if (key.length == 1 && key.toLowerCase() != key.toUpperCase()) {
            try_insert_letter(key);
        }
        else if (key.toLowerCase() === "enter") {
            try_complete_word();
        }
        else if (key.toLowerCase() === "backspace") {
            try_remove_letter();
        }
    }
};
function display_alert(msg) {
    var alert_box = document.getElementById("alert-box");
    alert_box.classList.remove("alert-box-anim");
    alert_box.innerHTML = msg;
    alert_box.classList.add("alert-box-anim");
    var duration = parseFloat(getComputedStyle(document.documentElement)
        .getPropertyValue('--alert-display-duration'));
    setTimeout(function () {
        alert_box.classList.remove("alert-box-anim");
    }, duration * 1000);
}
function toggle_instruction_box() {
    var box = document.getElementById("instruction_box");
    if (box.className === "instruction-box") {
        box.className = "hidden-instruction-box";
    }
    else {
        box.className = "instruction-box";
    }
}
function try_insert_letter(letter) {
    if (cursor.x < current_word.length) {
        set_letter_inner(letter.toUpperCase(), cursor.x, cursor.y);
        cursor.x += 1;
    }
    else {
        notify_invalid_input();
    }
}
function try_remove_letter() {
    if (cursor.x > 0) {
        set_letter_inner("", cursor.x - 1, cursor.y);
        cursor.x -= 1;
    }
    else {
        notify_invalid_input();
    }
}
function try_complete_word() {
    var won = false;
    if (cursor.x < current_word.length) {
        notify_invalid_input();
        return;
    }
    if (cursor.y < num_guesses) {
        var invalid_input = false;
        try {
            won = validate_guess();
        }
        catch (e) {
            notify_not_in_word_list();
            invalid_input = true;
        }
        if (invalid_input) {
            return;
        }
        else if (won || cursor.y == num_guesses - 1) {
            end_game(won);
        }
        else {
            cursor.y += 1;
            cursor.x = 0;
        }
    }
}
function validate_guess() {
    var guess = get_guess(cursor.y).toUpperCase();
    if (!word_lists[curr_word_list].includes(guess)) {
        throw 0;
    }
    var correct = current_word.toUpperCase();
    var won = guess === correct;
    var correct_letter_set = {};
    // This is awful code but I'm not worried at all about efficiency here.
    for (var x = 0; x < current_word.length; x++) {
        correct_letter_set[guess.charAt(x)] = 0;
        correct_letter_set[correct.charAt(x)] = 0;
    }
    for (var x = 0; x < current_word.length; x++) {
        correct_letter_set[correct.charAt(x)] += 1;
    }
    var right_place_right_letter = [];
    for (var x = 0; x < current_word.length; x++) {
        right_place_right_letter[x] = false;
        if (guess.charAt(x) === correct.charAt(x)) {
            correct_letter_set[guess.charAt(x)] -= 1;
            right_place_right_letter[x] = true;
        }
    }
    var wrong_place_right_letter = [];
    for (var x = 0; x < current_word.length; x++) {
        wrong_place_right_letter[x] = false;
        if (!right_place_right_letter[x]) {
            if (correct_letter_set[guess.charAt(x)] > 0) {
                wrong_place_right_letter[x] = true;
                correct_letter_set[guess.charAt(x)] -= 1;
            }
        }
    }
    for (var x = 0; x < current_word.length; x++) {
        var elem = document.getElementById("letter_box_" + x + "_" + cursor.y);
        if (right_place_right_letter[x]) {
            elem.className = "correct-letter-box";
        }
        else if (wrong_place_right_letter[x]) {
            elem.className = "partial-correct-letter-box";
        }
        else {
            elem.className = "incorrect-letter-box";
        }
    }
    return won;
}
function end_game(won) {
    in_game = false;
    if (won) {
        alert("You Win!");
    }
    else {
        alert("You Lost! The Word was: " + current_word + "!");
    }
}
function get_guess(y) {
    var _a;
    var guess = "";
    for (var x = 0; x < current_word.length; x++) {
        guess += (_a = document.getElementById("letter_" + x + "_" + y)) === null || _a === void 0 ? void 0 : _a.innerHTML;
    }
    return guess;
}
function notify_invalid_input() {
    //   display_alert("Invalid Input!");
}
function notify_not_in_word_list() {
    display_alert("Not In Word List!");
}
function set_letter_inner(inner, x, y) {
    var elem = document.getElementById("letter_" + x + "_" + y);
    elem.innerHTML = inner;
}
function initial_load() {
    return __awaiter(this, void 0, void 0, function () {
        var default_url, french_url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    default_url = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
                    return [4 /*yield*/, load_word_list(default_url, "default")];
                case 1:
                    _a.sent();
                    french_url = "https://raw.githubusercontent.com/Taknok/French-Wordlist/master/francais.txt";
                    return [4 /*yield*/, load_word_list(french_url, "french")];
                case 2:
                    _a.sent();
                    load_game("french");
                    return [2 /*return*/];
            }
        });
    });
}
function load_game(word_list) {
    curr_word_list = word_list;
    var word_list_len = word_lists[word_list].length;
    var word_index = Math.floor(Math.random() * word_list_len);
    current_word = word_lists[word_list][word_index].trim();
    num_guesses = current_word.length;
    init_words("words");
    in_game = true;
}
function init_words(id) {
    var x = current_word.length;
    var y = num_guesses;
    var elem = document.getElementById(id);
    elem.className = "words";
    var html = "";
    for (var j = 0; j < y; j++) {
        html += "<div class=\"word\">";
        for (var i = 0; i < x; i++) {
            html += "<div class=\"letter-box\" id=\"letter_box_" + i + "_" + j + "\">";
            html += "<div class=\"letter\" id=\"letter_" + i + "_" + j + "\"></div>";
            html += "</div>";
        }
        html += "</div>";
    }
    elem.innerHTML = html;
}
initial_load();
