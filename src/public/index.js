// init length slider
var n_slider = document.getElementById("n_slider");
var n_output = document.getElementById("n_value");
n_output.innerHTML = n_slider.value;
n_slider.oninput = () => {
    n_output.innerHTML = n_slider.value;
}

// int speed slider
var s_slider = document.getElementById("s_slider");
var s_output = document.getElementById("s_value");
s_output.innerHTML = s_slider.value + 'ms';
s_slider.oninput = () => {
    s_output.innerHTML = s_slider.value + 'ms';
}

// move to next router function
function moveTo(path) {
    location.href = `${path}?n=${n_slider.value}&s=${s_slider.value}`;
}