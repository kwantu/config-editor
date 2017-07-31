/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../../typings/global.d.ts" />

// @ts-ignore
Polymer({
    is: 'elem-button',

    /**
     * This is the config JSON model for the kul-button element type
     * 
     * @param uuid the unique id used to identify the model
     * @return JSON button data model
     */
    _createModel: function (uuid) {
        return {
            'id': uuid,
            'label': {
                "i18n": {
                    "en": "Button",
                    "pt": ""
                }
            },
            'type': 'kul-button',
            'ui': 'button-props',
            'class': 'element',
            'attrs': {
                'active': true,
                'disabled': false,
                'elevation': 2,
                'focused': true,
                'raised': true,
                'toggles': false
            },
            'event': {
                'name': 'saveModel',
                'params': [
                    'model'
                ]
            }
        }
    },

    /**
     * 
     */
    _createView: function (model, config, self, source, target) {
        let APP = document.getElementsByTagName('kul-app')[0]
        // Create the element
        let elem = document.createElement('kul-button')
        // Set the initial data model
        elem.set('model', model)
        // Set the element id
        elem.set('id', model.id)
        // Add the draggable class and initiate the draggable functionality      
        new Draggabilly(elem, {
            containment: target
        }).on('dragStart', (event, pointer) => {
            // elem.setFocus();

        }).on('dragEnd', (event, pointer) => {
            console.log('Drag End: ', target.innerHTML)
            APP.set(
                'SDO_VIEWMODEL.component.version[SDO_VIEWMODEL.component.currentVersion].interface.template',
                target.innerHTML)

        })
        // Change focus on click
        elem.addEventListener('click', (event) => {
            // utils.setFocus(elem.children[1], target)

        })
        // Attach to the DOM
        Polymer.dom(self.parentNode).replaceChild(elem, self)
    },

    /**
     * 
     */
    create: function (config, target, source, sibling) {
        let self = this
        let guid = uuid.make(1).format()
        return new Promise((resolve, reject) => {
            try {
                // Create the element config data model
                let model = self._createModel(guid)
                // Create the element
                let view = self._createView(model, config, self, source, target)
                // Return the updated data model                
                resolve(model)
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

});