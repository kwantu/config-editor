/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../../typings/global.d.ts" />

Polymer({
    is: 'card-props',
    properties: {
        visible: {
            type: Boolean,
            notify: true,
            value: false,
            observer: '_setVisibility'
        },
        model: {
            type: Object,
            notify: true
        }
    },
    observers: [
        '_updateModel(model.*)'
    ],

    /**
     * 
     */
    _updateModel: (data) => {
        let appController = document.getElementsByTagName('kul-app')[0]
        if (appController.CURRENT_ELEMENT_TYPE === 'card-props') {
            console.log('EVENT:: "card-props._updateModel" triggered!!', data)        
            let element = document.getElementById(data.base.id)
            this.model = _.isUndefined(data.base) ? this.model : data.base
            if (element)
                // Update the element UI
                element.set(data.path, data.value)
            // Update the SDO_VIEWMODEL
            let viewModel = appController.SDO_VIEWMODEL
            let currentVersion = viewModel.component.version[viewModel.component.currentVersion]
            let elements = currentVersion.elements
            // Find the object index in the App elements array
            let index = _.findIndex(elements, {
                id: this.model.id
            })
            // console.log('this.model', this.model)
            // Inset / Update the related item at index using native splice
            if (index !== -1) {
                elements.splice(index, 1, this.model)
            } else {
                elements.push(this.model)
            }
            // Update the SDO_VIEWMODEL
            appController.set('SDO_VIEWMODEL', viewModel)
            // Call update template event
            setTimeout(() => appController.dispatchEvent(appController.UPDATE_MODEL), 1000)
        }   
    },
    /**
     * 
     */
    _setVisibility: () => {
        // if(this.visible) {
        //     this.set('style', 'display: block')
        // } else {
        //     this.set('style', 'display: none')
        // }
    },
    /**
     * 
     */
    ready: () => {}

});