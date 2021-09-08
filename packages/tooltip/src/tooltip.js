import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import tippy from 'tippy.js';
//import 'tippy.js/dist/tippy.css';
console.dir(tippy);

export class TooltipElement extends DBPLitElement {

    constructor() {
        super();
        this.gitInfo = '';
    }


    static get properties() {
        return {
            ...super.properties,
            gitInfo: { type: String, attribute: 'git-info' },
        };
    }

    render() {
        // tippy('#myButton', {
        //     content: "I'm a Tippy tooltip!",
        // });

        return html`
        <div>
            <button id="myButton">My Button</button>
        </div>
        `;
    }

}
