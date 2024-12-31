

class Web_Tool extends HTMLElement{

	
	constructor(){
		super();

		this.moveableBox = {
			dX: 0,
			dY: 0,
			mX: 0,
			mY: 0,
			el: null,
			elX: 0,
			elY: 0,
			active: false,
		}

		this.root = this.attachShadow({ mode: 'open' });
		this.root.innerHTML = `
			<style>				
				.scroll-design {overflow:scroll;scrollbar-color:transparent var(--theme-white);scrollbar-width:thin}
				.scroll-design.separate-body:hover {scrollbar-color:var(--theme-primary) transparent}
				.scroll-design:hover,.separate-header.scroll-design.active {scrollbar-color:var(--theme-primary) var(--theme-white)}
				.scroll-design::-webkit-scrollbar {width:8px;height:30px}
				.scroll-design::-webkit-scrollbar-track-piece {background-color:var(--theme-white)}
				.scroll-design::-webkit-scrollbar-thumb:vertical {height:30px;background-color:var(--theme-primary)}				
			</style>	

			<style>
				*{margin:0;padding:0;box-sizing:border-box;transition:0.3s all linear;}
				:host{width: 800px;display: block;resize:both;transition:none !important;overflow:hidden;position:absolute;top:25%;left:25%;}
				
				.tab{width:100%;border:2px solid #37495b;background:#fff;display:flex;overflow: hidden;height:400px;flex-direction:column;}

				.header{background:#37495b;display:flex;}
				.tab-menu{background:#37495b;display:flex;flex-wrap:wrap;list-style:none;position:sticky;top:0px;align-items:center;}
				.tab-menu li{color:#fff;padding:4px;width:40px;height:40px;display:inline-flex;justify-content:center;align-items:center;position:relative;overflow:hidden;}
				.tab-menu svg{width:15px;}
				.tab-menu-item-file-css svg{width:15px;}
				.tab-menu-item-selector-css svg{width:13px;}
				.tab-menu-item-settings svg{width:16px;}
				.tab-menu path{fill:#fff;}
				.tab-menu li:has(input:checked){background:#fff;}
				.tab-menu li:has(input:checked) path{fill:#37495b;}
				.moveable-by-me{flex-grow:1;}
				.tab-menu [type="radio"]{opacity:0;position:absolute;width:100%;height:100%;top:0;left:0;z-index:1;cursor:pointer;}		

				.tab-contents{width:100%;flex-grow:1;overflow:auto;}
				.tab-content{padding:8px;display:none;}
				.tab-content.show{display:block;}
			</style>

			
			<div class="tab">				
				<header class="header">
					<ul class="tab-menu">
						<li class="tab-menu-item-file-css" >
							<input type="radio" name="web-tool-menu" data-target="file-css">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>
						</li>
						<li class="tab-menu-item-selector-css">
							<input type="radio" name="web-tool-menu" checked data-target="selector-css">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>
						</li>
						<li class="tab-menu-item-settings">
							<input type="radio" name="web-tool-menu" data-target="settings">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
						</li>					
					</ul>
					<div class="moveable-by-me"></div>
				</header>
				<div class="tab-contents scroll-design">
					<div class="tab-content tab-content-file-css" contenteditable="true"></div>
					<div class="tab-content tab-content-selector-css show">
						<input type="number" data-prop-edit="font-size">
					</div>
					<div class="tab-content tab-content-settings"></div>
				</div>
			</div>
		`;	
	}

	connectedCallback(){
		this.appendCSSContent();
		this.componentMoveable();
		this.handleChangeEvent();
		this.handleInputEvent();

	}

	// Change Event
	handleChangeEvent(){
		this.root.querySelector('.tab').addEventListener('change',(e)=>{
			// Tab Menu
			if(e.target.closest('.tab-menu')){
				this.root.querySelectorAll('.tab-content').forEach((el)=>{
					el.classList.remove('show');
				})
				this.root.querySelector(`.tab-content-${e.target.dataset.target}`).classList.add('show');
			}
		})
	}

	// Click Event
	handleInputEvent(){
		this.root.querySelector('.tab').addEventListener('input',(e)=>{
			const t = e.target;

			// CSS Prop
			if(t.closest('[data-prop-edit]')){
				this.setPropToSelectorElement(t);
			}
		})
	}

	// append file css on load
	appendCSSContent(){
		this.fetchCSSWithComments('http://localhost:8000/style.css').then(cssText => {
		    this.root.querySelector('.tab-content-file-css').innerHTML = cssText.replaceAll('\n','<br>');		    		    
		}).catch((err)=>{
			console.log(err);
		});
	}
	fetchCSSWithComments(fileUrl) {
	  return fetch(fileUrl)
	    .then(response => {
	      if (!response.ok) {
	        throw new Error(`Failed to fetch ${fileUrl}: ${response.statusText}`);
	      }
	      return response.text();
	    })
	    .then(cssText => cssText)
	    .catch(error => {
	      console.error('File path is wrong');
	      return '';
	    });
	}

	// Moveable Box
	componentMoveable(){
		this.addEventListener('pointerdown', (e)=>{
			this.moveableBoxDown(e);
		})
		this.addEventListener('pointermove', (e)=>{
			this.moveableBoxMove(e);
		})
		this.addEventListener('pointerup', (e)=>{
			this.moveableBoxUp(e);
		})
	}
	moveableBoxDown(e){
		if(!e.composedPath()[0].matches('.moveable-by-me')) return false;
		this.moveableBox.active = true;
		this.moveableBox.dX = e.clientX;
		this.moveableBox.dY = e.clientY;
		
		this.moveableBox.elX = +(window.getComputedStyle(this)['left'].replace('px',''));
		this.moveableBox.elY = +(window.getComputedStyle(this)['top'].replace('px',''));
		this.setPointerCapture(e.pointerId);
	}
	moveableBoxMove(e){

		if(!this.hasPointerCapture(e.pointerId)) return false;

		this.moveableBox.mX = e.clientX;
		this.moveableBox.mY = e.clientY;
		this.style.left = (this.moveableBox.elX+this.moveableBox.mX-this.moveableBox.dX)+'px';
	    this.style.top = (this.moveableBox.elY+this.moveableBox.mY-this.moveableBox.dY)+'px';


	    if((this.moveableBox.elX+this.moveableBox.mX-this.moveableBox.dX) < 10) this.style.left = '10px';
	    if((this.moveableBox.elY+this.moveableBox.mY-this.moveableBox.dY) < 10) this.style.top = '10px';
	    if((this.moveableBox.elY+this.moveableBox.mY-this.moveableBox.dY) > document.body.offsetHeight-100) this.style.top = document.body.offsetHeight-100+'px';
	    if((this.moveableBox.elX+this.moveableBox.mX-this.moveableBox.dX) > document.body.offsetWidth-200) this.style.left = document.body.offsetWidth-200+'px';
	}
	moveableBoxUp(e){
		this.moveableBox.active = false;        
    	this.releasePointerCapture(e.pointerId);    
	}

	setPropToSelectorElement(t){
		console.log(t);
	}




}

if(!customElements.get('web-tool')){
	customElements.define('web-tool',Web_Tool);	
	document.body.appendChild(document.createElement('web-tool'));
	document.body.style.minHeight = '100vh';
}

