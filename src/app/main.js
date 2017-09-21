/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/global.d.ts" />

// Create JS module instances
var database = new PouchDB('config')
database.replicate.to('http://localhost:5984/config')

// @ts-ignore
var uuid = new UUID(3, "ns:URL", "http://kwantu.net/")

var SDOViewModel = function (componentType, uuid) {
    var uuid = uuid.make(1).format()
    return {
        "_id": uuid,
        "name": {
            "i18n": {
                "en": "Demo Kwantu Component"
            }
        },
        "documentation": {
            "i18n": {
                "en": ""
            }
        },
        "component": {
            "type": componentType,
            "currentVersion": "2_0_0",
            "version": {
                "2_0_0": {
                    "name": {
                        "i18n": {
                            "en": ""
                        }
                    },
                    "details": {
                        "i18n": {
                            "en": ""
                        }
                    },
                    "settings": {},
                    "includes": [],
                    "elements": [],
                    "interface": {
                        "format": "html",
                        "template": ""
                    }
                }
            }
        }
    }
};

Polymer({

    is: 'kul-app',

    properties: {
        elemSelector: {
            type: Number,
            value: 0
        },
        designSelector: {
            type: Number,
            value: 0
        },
        propSelector: {
            type: Number,
            value: 0
        },
        SDO_VIEWMODEL_ID: {
            type: String,
            value: function () {
                return _.get(window.utils.URLParams, 'id')
            }
        },
        SDO_VIEWMODEL: {
            type: Object,
            notify: true
        },
        CURRENT_ELEMENT_TYPE: {
            type: String,
            value: ''
        },
        CURRENT_ELEMENT_ID: {
            type: String,
            value: ''
        },
        CURRENT_ELEMENT_MODEL: {
            type: Object,
            notify: true
        },
        //
        configId: {
            type: String,
            value: function () {
                return _.get(window.utils.URLParams, 'id')
            }
        },
        modelId: {
            type: String,
            value: function () {
                return _.get(window.utils.URLParams, 'model')
            }
        }
    },
    /**
     * 
     */
    _initCanvas: function(config, target, _self){                
        // Convert the HTML string into HTML Elements
        let elements = window.utils.str2DOMElement(config.interface.template)
        for(var i = 0; i < elements.length; i++) {
            let elementName = elements[i].nodeName
            let elementAttrs = elements[i].attributes
            if (elementName !== '#text') {
                // Get the data model from the SDO_VIEWMODEL config data model  
                let model = _.filter(config.elements, { id: elements[i].id })[0]
                // console.log('config.elements: ', config.elements) 
                // Create the KUL Element
                let KElement = new KULElement(elementName, model, _self)
                let element = KElement.getView()            
                // Set the attributes
                for (var j = 0; j < elementAttrs.length; j++) {
                    element.setAttribute(elementAttrs[j].name, elementAttrs[j].value)
                }
                // Set the inner text
                // @ts-ignore
                // element.childNodes[1].innerText = elements[i].innerText.split('\n').join('').split(' ').join('')
                // Set the width and height
                // Set to 'width: 100%; height: 100%' by default to adjust to the size
                // of the parent element
                if (element.style.height || element.style.width){
                    let height = parseInt(element.style.height.replace('px', ''))
                    let width = parseInt(element.style.width.replace('px', ''))
                    if (height > 0 || width > 0) {
                        // @ts-ignore
                        element.childNodes[1].style = 'width: 100%; height: 100%' 
                    }                      
                }      
                // Append child element to the canvas DOM
                Polymer.dom(target).appendChild(element)               
            }                
        }
    },
    // On ready life cycle event of the main kwantu-tools element
    ready: function () {
        // Global Model Events
        this.CREATE_MODEL = new Event('createModel')
        this.READ_MODEL = new Event('readModel')
        this.UPDATE_MODEL = new Event('updateModel')
        this.DELETE_MODEL = new Event('deleteModel')
        this.UPDATE_TEMPLATE = new Event('updateTemplate')
        // Defaults
        // Get the current config version
        let currentVersion = ''
        let config = {}
        // Config editor reference areas
        let canvas = this.$.canvas
        let elements = this.$.elements
        let source = this.$.source
        // Add event listeners for database interaction
        this.addEventListener('createModel', function (event) {
            console.log('EVENT:: "SDO createModel" triggered!!', this.SDO_VIEWMODEL)
            database.put(this.SDO_VIEWMODEL, function (err, response) {
                if (err) {
                    return console.warn(err);
                }
                database.get(response.id, function (err, model) {
                    if (err) {
                        return console.warn(err);
                    }
                    this.set('SDO_VIEWMODEL', model)
                }.bind(this))
            }.bind(this))
        }.bind(this))
        this.addEventListener('readModel', function (event) {            
            database.get(this.SDO_VIEWMODEL_ID, function (err, response) {
                if (err) {
                    return console.log(err);
                }
                // Set the SDO_VIEWMODEL
                this.set('SDO_VIEWMODEL', response) 
                console.log('EVENT:: "SDO readModel" triggered!!', this.SDO_VIEWMODEL)               
                // Get the current config version
                currentVersion = this.SDO_VIEWMODEL.component.currentVersion
                config = this.SDO_VIEWMODEL.component.version[currentVersion]
                // Initialise the canvas with the saved HTML
                this._initCanvas(config, canvas, this)  
            }.bind(this))
        }.bind(this))
        this.addEventListener('updateModel', function (event) {
            // console.log('updateModel event triggered!!') 
            console.log('EVENT:: "SDO updateModel" triggered!!', this.SDO_VIEWMODEL)
            // Get the current config version
            let currentVersion = this.SDO_VIEWMODEL.component.currentVersion
            let path = 'SDO_VIEWMODEL.component.version.' + currentVersion + '.interface.template'
            this.set(path, canvas.innerHTML)
            database.put(this.SDO_VIEWMODEL, function (err, response) {
                if (err) {
                    return console.warn(err);
                }
                database.get(response.id, function (err, model) {
                    if (err) {
                        return console.warn(err);
                    }
                    this.set('SDO_VIEWMODEL', model)
                    console.log('After UPDATE:: SDO_VIEWMODEL', model)
                }.bind(this))
            }.bind(this))
        }.bind(this))
        this.addEventListener('deleteModel', function (event) {
            console.log('EVENT:: "SDO deleteModel" triggered!!')

        }.bind(this))
        // Get the config data model
        if (_.isUndefined(this.SDO_VIEWMODEL_ID)) {
            this.set('SDO_VIEWMODEL', SDOViewModel('default', uuid))
            currentVersion = this.SDO_VIEWMODEL.component.currentVersion
            // config = this.SDO_VIEWMODEL.component.version[currentVersion]
            // console.log('SDO_VIEWMODEL: ', this.SDO_VIEWMODEL)
            this.dispatchEvent(this.CREATE_MODEL)
        } else {
            // console.log('this.SDO_VIEWMODEL_ID: ' + this.SDO_VIEWMODEL_ID)
            this.dispatchEvent(this.READ_MODEL)
        }        

        // Initialise the drag and drop functionality
        let editor = dragula([elements, canvas], {
            copy: true,
            revertOnSpill: true
        })
        // On drop of the element, create the associated Polymer component
        // and associated properties data model
        editor.on('drop', function (element, target, source, sibling) {
            element.create(this).then((data) => {
                // Add the new element to the SDO_VIEWMODEL elements array
                let currentVersion = this.SDO_VIEWMODEL.component.currentVersion
                let elementsPath = 'SDO_VIEWMODEL.component.version.' + currentVersion + '.elements'
                this.push(elementsPath, data)
                // Set the current element id
                this.set('CURRENT_ELEMENT_ID', data.id)
                // Set the current element model
                this.set('CURRENT_ELEMENT_MODEL', data)
                // Persist the SDO_VIEWMODEL
                this.dispatchEvent(this.UPDATE_MODEL)
            }).catch(function (error) {
                console.error(error)
            }.bind(this))
        }.bind(this))

        // Reload code editor on click of the source tab
        canvas.addEventListener('click', function (event) {
            console.log('EVENT:: "canvas.click" triggered!!', event)
            // window.utils.setFocus(canvas, canvas)
            canvas.focus()
            let children = document.getElementById('prop-editors').children
            for (var i = 0; i < children.length; i++) {
                var element = children[i];
                // @ts-ignore
                element.set('visible', false)
            }
        }.bind(this))
    }

});