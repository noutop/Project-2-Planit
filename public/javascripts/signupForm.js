const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const p = document.getElementById("errorMessage");
const alarmP = document.getElementById("alarmMessage");





signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

document.addEventListener('DOMContentLoaded', () => {

	if (p.innerText) {
		container.classList.add("right-panel-active");
	}

});

document.addEventListener('DOMContentLoaded', () => {
	if (alarmP.innerText) {
		container.classList.add("right-panel-active");
	}

});