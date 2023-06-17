const SECOND = 1000;

const setRandomInterval = (callback, min, max) => {
	let timeouts = {}; 
	let stillTiming = false;
	// this is insanely terrible
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

const animatedScript = (music, musicsrc) => {
	const dustin = document.querySelector("#dustinimagediv");
	const dustinImage = document.querySelector("#dustinimagediv img");

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
	window.addEventListener('click', (event) => {
		if (event.target === dustinImage && glowing) {
			if (mustangMode) {
				mustangTime=music.currentTime;
				musicsrc.src='resources/song2.ogg';
				music.load();
				music.play();	
			} else {
				musicsrc.src='resources/song1.ogg';
				music.load();
				music.currentTime=mustangTime;
				music.play();
			}
			mustangMode=(!mustangMode);
		}
	})
}

const togglePause = () => {
	console.log('toggled pause');
	const mustangs = document.querySelectorAll('.mustang');
	const slideshows = document.querySelectorAll('.mustang-slideshow > div');
	let newState = (mustangs[0].style.animationPlayState==='paused' ? 'running' : 'paused');
	[...mustangs, ...slideshows].forEach(elt => {
		elt.style.animationPlayState=newState;
	})
}

let i = 0;
const script = async () => {
	console.log (`running script for the ${i=i+1}th time`);
	const music = document.querySelector('#backgroundmusic');
	const musicSrc = document.querySelector('#backgroundmusic-src');
	const button = document.querySelector('button.play');
	try {
		await music.load();
		await music.play();
		animatedScript(music, musicSrc);
	} catch (e) {
		togglePause();
		button.onclick(() => {
			togglePause();
			music.play();
			document.querySelector('div.play-overlay').remove();
			animatedScript(music, musicSrc);
		})
	}
}

window.addEventListener('load', () => { script(); return true; });
