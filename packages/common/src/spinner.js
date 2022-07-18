// Note: This doesn't have a lit-element dependency on purpose, so it can be loaded faster before
// other web components (assuming it's not bundled)

export class Spinner extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
<style>
:host {
    display: block;
}

#all-spinner {
    width:130px;
    height:130px;
    position:relative;
    background-color:transparent;
    margin:0 auto;
}

.all-box {
    width:50%;
    height:50%;
    /* Use a fallback color, in case this is used standalone */
    background-color:var(--dbp-accent-surface, #9E1E4D);
    position:absolute;
    top:50%;
    left:50%;
    animation-duration: 1.6s;
    animation-direction:alternate-reverse;
    animation-iteration-count:infinite;
}

#box-1 {
      animation-name: box1;
}

#box-2 {
      animation-name: box2;
}

#box-3 {
      animation-name: box3;
}

@keyframes box1 {
    0% { transform:translateX(-50%) translateY(-50%) rotate(45deg); opacity: 0.5;  }
    30% { transform:translateX(-70%) translateY(-50%) rotate(45deg);  opacity: 0.4; }
    70% { transform:translateX(-70%) translateY(-50%) rotate(45deg);  opacity: 0.5; }
  90%  { transform:translateX(-70%) translateY(-50%) rotate(45deg);  opacity: 0.4; }
  100%  { transform:translateX(-70%) translateY(-50%) rotate(45deg); opacity: 0.5;}
}

@keyframes box2 {
    0% { transform:translateX(-50%) translateY(-50%) rotate(45deg); opacity: 0.6; }
    30% { transform:translateX(-50%) translateY(-50%) rotate(45deg); opacity: 0.7;}
    70% { transform:translateX(-50%) translateY(-50%) rotate(45deg); opacity: 0.6;}
  90% { transform:translateX(-50%) translateY(-50%) rotate(45deg); opacity: 0.7;}
  100% { transform:translateX(-50%) translateY(-50%) rotate(45deg);  opacity: 0.6;}

}

@keyframes box3 {
    0% { transform:translateX(-50%) translateY(-50%) rotate(45deg);opacity: 0.9;  }
    30% { transform:translateX(-30%) translateY(-50%) rotate(45deg);  opacity: 0.7;}
    70% { transform:translateX(-30%) translateY(-50%) rotate(45deg);  opacity: 0.9;}
  90%  { transform:translateX(-30%) translateY(-50%) rotate(45deg);  opacity: 0.7;}
  100%  { transform:translateX(-30%) translateY(-50%) rotate(45deg); opacity: 0.9;}
}
</style>

<div id="all-spinner">
  <div id="box-1" class="all-box"></div>
  <div id="box-2" class="all-box"></div>
  <div id="box-3" class="all-box"></div>
</div>`;
    }
}
