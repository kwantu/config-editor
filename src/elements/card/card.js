/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../../typings/global.d.ts" />

Polymer({
    is: 'kul-card',
    properties: {
        id: {
            type: String
        },
        model: {
            type: Object,
            observe: true,
            notify: true
        }
    },

    /**
     * 
     */
    ready: function () {
        let self = this        
        let APP = document.getElementsByTagName('kul-app')[0]
        self.addEventListener('click', (event) => {
            console.log('EVENT:: "element.click" triggered!!', event)
            // Set the currently selected element model
            APP.set('CURRENT_ELEMENT_ID', self.model.id)
            APP.set('CURRENT_ELEMENT_MODEL', self.model)
            self.setFocus(event)
            // 
            let children = document.getElementById('prop-editors').children
            for (var i = 0; i < children.length; i++) {
                var element = children[i];
                element.set('visible', false)
            }
            let props = document.getElementsByTagName('button-props')[0]
            props.set('visible', true)
        })

    },

    /**
     * 
     */
    setFocus: function (event) {
        if (event)
            event.stopPropagation()
        // @ts-ignore
        utils.setFocus(this.$.element, document.getElementById('canvas'))
    }

});