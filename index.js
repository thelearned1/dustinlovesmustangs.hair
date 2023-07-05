const SECOND = 1000;

/** Given two numbers `min` and `max` and a callback function `callback`, 
 * calls `callback` at random intervals between `min` and `max` 
 * milliseconds.
 * 
 * NB: this is an insanely terrible piece of code.  while this is an
 * open-source project, you should definitely not copy this part.
 * 
 * @param {function} callback a callback function
 * @param {number} min the minimum wait period before calling `callback`
 * @param {number} max the maximum wait period before calling `callback`
 * @returns {Function} `clearInterval`, a function which clears all 
 * intervals associated with the `randomInterval`.
 */
const setRandomInterval = (callback, min, max) => {
	let timeouts = {}; 
	let stillTiming = false;
	const interval = setInterval(() => {
		if (!stillTiming) {
			stillTiming=true;
			// -Math.min(min, 5) accounts for delay due to setTimeout interval
			const rand = (Math.random()*(max-min-Math.min(min, 5)))+min;
			const timeout = setTimeout(() => {
				callback(); 
				// clean up --- let setInterval know that timeout is done and
				// remove from set of active timeouts
				stillTiming=false;
				delete timeouts[timeout];  
			}, rand);
			timeouts[timeout] = true;
		}
	}, 5)

	return () => {
		clearInterval(interval)
		// clear any timeouts that are still pending
		Object.keys(timeouts).forEach((timeout) => {
			clearTimeout(timeout);
		});
	};
}

const insertLogo = () => {
	let logo = document.createElement('img');
	logo.src='resources/logo.png'

	let newDiv = document.createElement('div');
	newDiv.appendChild(logo);
	newDiv.className='logo';

	const mainContent = document.querySelector('div.maincontent');
	mainContent.childNodes[0].after(
		newDiv
	)
}
const animatedScript = () => {
	const dustin = document.querySelector("#dustinimgdiv");
	const dustinImage = document.querySelector("#dustinimgdiv img");

	let glowing = false; 
	const makeDustinGlow = () => {
		let i = 1;
		const interval = setInterval(() => {
			dustinImage.src=`resources/dustin-loves-mustangs-${i}.png`;
			i++
			if (i > 2) {
				glowing=true;
				if (i > 3) {
					clearInterval(interval);
				}	
			}
		}, 75)
		setTimeout(() => {
			dustinImage.src='resources/dustin-loves-mustangs-1.png';
			glowing=false;
		}, 0.75*SECOND)
	}

	setRandomInterval(makeDustinGlow, 3*SECOND, 10*SECOND);

	let mustangMode = true;
	let mustangTime = 0;
	const handleGlowClick = (mustangMode, glowing, event) => {
		const dustinImage = document.querySelector("#dustinimgdiv img");
		const music = document.querySelector('#backgroundmusic');
		const musicSrc = document.querySelector('#backgroundmusic-src');
		if (event.target === dustinImage && glowing) {
			if (mustangMode) {
				changePauseStage('paused');
				mustangTime=music.currentTime;
				musicSrc.src='resources/song2-intro.ogg';
				music.addEventListener('ended', () => {
					musicSrc.src='resources/song2.ogg';
					music.load();
					music.play();
					music.loop=true;
				})
				music.load();
				music.loop=false;
				music.currentTime=0;
				music.play();	
				insertLogo();
			} else {
				changePauseStage('running');
				musicSrc.src='resources/song1.ogg';
				music.load();
				music.currentTime=mustangTime;
				music.play();
				music.loop=true;
			}
			mustangMode=(!mustangMode);
		}
	}	

	window.addEventListener('click', (event) => {
		handleGlowClick(mustangMode, glowing, event);
	})
}

const changePauseStage = (newState) => {
	const mustangs = document.querySelectorAll('.mustang');
	const slideshows = document.querySelectorAll('.mustang-slideshow > div');
	[...mustangs, ...slideshows].forEach(elt => {
		elt.style.animationPlayState=newState;
	})
}

let i = 0;
const script = async () => {
	changePauseStage ('paused');
	const music = document.querySelector('#backgroundmusic');
	const button = document.querySelector('button.play');
	button.onclick=() => {
		changePauseStage('running');
		music.play();
		document.querySelector('div.play-overlay').remove();
		animatedScript();
	}
}

// script();

window.addEventListener('load', () => { script(); return true; });

