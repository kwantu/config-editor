/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../../typings/global.d.ts" />

Polymer({
    is: 'button-props',
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
        console.log('EVENT:: "_updateModel" triggered!!', data)
        // console.log('this.model: ', this.model)
        let model = _.isUndefined(this.model) ? data.base : this.model
        // console.log('model: ', model)
        // Get the related HTML element by ID
        let element = document.getElementById(model.id)
        // Update the element data model
        element.set(data.path, data.value)
        // Update the SDO_VIEWMODEL
        
        // @ts-ignore
        let viewModel = APP.SDO_VIEWMODEL
        let elements = viewModel.component.version[viewModel.component.currentVersion].elements
        // console.log('elements: ', elements)
        // console.log('model.id: ', model.id)
        let index = _.findIndex(elements, {
            id: model.id
        })
        // Replace item at index using native splice
        if (index !== -1) {
            elements.splice(index, 1, model)
        } else {
            elements.push(model)
        }
        // elements.splice(index, 1, model)
        // console.log('index: ', index)
        // console.log('SDO_VIEWMODEL: ', viewModel)
        APP.set('SDO_VIEWMODEL', viewModel)
        // console.log('app.SDO_VIEWMODEL: ', app.SDO_VIEWMODEL)
        APP.dispatchEvent(APP.UPDATE_MODEL)
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