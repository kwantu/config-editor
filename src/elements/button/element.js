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
    create: function (appController) {
        let self = this
        let guid = uuid.make(1).format()
        return new Promise((resolve, reject) => {
            try {
                // Create the element
                let KElement = new KULElement('kul-button', self._createModel(guid), appController)
                // Attach to the DOM
                Polymer.dom(self.parentNode).replaceChild(KElement.getView(), self)
                // Return the updated data model                
                resolve(KElement.getModel())
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

});