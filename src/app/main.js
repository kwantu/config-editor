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
            "currentVersion": "2.0.0",
            "version": {
                "2.0.0": {
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
        CURRENT_ELEMENT_ID: {
            type: String,
            value: ''
        },
        CURRENT_ELEMENT_MODEL: {
            type: Object,
            notify: true
        }
    },
    observers: [
        '_updateModel(SDO_VIEWMODEL.*, this)'
    ],
    //
    _updateModel: (data, _this) => {
        console.log('EVENT:: "app._updateModel" triggered!!', data)
        _this.dispatchEvent(_this.READ_MODEL)
        _this.dispatchEvent(_this.UPDATE_MODEL)
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
                // console.log('model: ', model) 
                // Create the KUL Element
                let KElement = new KULElement(elementName, model, _self)
                let element = KElement.getView()            
                // Set the attributes
                for (var j = 0; j < elementAttrs.length; j++) {
                    element.setAttribute(elementAttrs[j].name, elementAttrs[j].value)
                }
                // Set the inner text
                // @ts-ignore
                element.childNodes[1].innerText = elements[i].innerText.split('\n').join('').split(' ').join('')
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
        let self = this
        // Global Model Events
        self.CREATE_MODEL = new Event('createModel')
        self.READ_MODEL = new Event('readModel')
        self.UPDATE_MODEL = new Event('updateModel')
        self.DELETE_MODEL = new Event('deleteModel')
        self.UPDATE_TEMPLATE = new Event('updateTemplate')
        // Defaults
        // Get the current config version
        let currentVersion = ''
        let config = {}
        // Config editor reference areas
        let canvas = self.$.canvas
        let elements = self.$.elements
        let source = self.$.source
        // Add event listeners for database interaction
        self.addEventListener('createModel', function (event) {
            console.log('EVENT:: "SDO createModel" triggered!!', self.SDO_VIEWMODEL)
            database.put(self.SDO_VIEWMODEL, function (err, response) {
                if (err) {
                    return console.warn(err);
                }
                database.get(response.id, function (err, model) {
                    if (err) {
                        return console.warn(err);
                    }
                    self.set('SDO_VIEWMODEL', model)
                })
            })
        })
        self.addEventListener('readModel', function (event) {            
            database.get(self.SDO_VIEWMODEL_ID, function (err, response) {
                if (err) {
                    return console.log(err);
                }
                // Set the SDO_VIEWMODEL
                self.set('SDO_VIEWMODEL', response) 
                console.log('EVENT:: "SDO readModel" triggered!!', self.SDO_VIEWMODEL)               
                // Get the current config version
                currentVersion = self.SDO_VIEWMODEL.component.currentVersion
                config = self.SDO_VIEWMODEL.component.version[currentVersion]
                // Initialise the canvas with the saved HTML
                self._initCanvas(config, canvas, self)  
            })
        })
        self.addEventListener('updateModel', function (event) {
            // console.log('updateModel event triggered!!') 
            console.log('EVENT:: "SDO updateModel" triggered!!', self.SDO_VIEWMODEL)
            database.put(self.SDO_VIEWMODEL, function (err, response) {
                if (err) {
                    return console.log(err);
                }
                database.get(response.id, function (err, model) {
                    if (err) {
                        return console.log(err);
                    }
                    self.set('SDO_VIEWMODEL', model)
                })
            })
        })
        self.addEventListener('deleteModel', function (event) {
            console.log('EVENT:: "SDO deleteModel" triggered!!')

        })
        self.addEventListener('updateTemplate', function (event) {
            console.log('EVENT:: "SDO updateTemplate" triggered!!', self.SDO_VIEWMODEL)
            // Get the current config version
            currentVersion = self.SDO_VIEWMODEL.component.currentVersion
            config = self.SDO_VIEWMODEL.component.version[currentVersion]
            config.interface.template = canvas.innerHTML            
            // console.log('SDO_VIEWMODEL: ', self.SDO_VIEWMODEL)
            self.dispatchEvent(self.UPDATE_MODEL)
        })
        // Get the config data model
        if (_.isUndefined(self.SDO_VIEWMODEL_ID)) {
            self.set('SDO_VIEWMODEL', SDOViewModel('default', uuid))
            currentVersion = self.SDO_VIEWMODEL.component.currentVersion
            config = self.SDO_VIEWMODEL.component.version[currentVersion]
            // console.log('SDO_VIEWMODEL: ', self.SDO_VIEWMODEL)
            self.dispatchEvent(self.CREATE_MODEL)
        } else {
            // console.log('self.SDO_VIEWMODEL_ID: ' + self.SDO_VIEWMODEL_ID)
            self.dispatchEvent(self.READ_MODEL)
        }        

        // Initialise the drag and drop functionality
        let editor = dragula([elements, canvas], {
            copy: true,
            revertOnSpill: true
        })
        // On drop of the element, create the associated Polymer component
        // and associated properties data model
        editor.on('drop', function (element, target, source, sibling) {
            element.create(config).then(function (data) {
                // Add the new element to the SDO_VIEWMODEL elements array
                config.elements.push(data)
                // Update the SDO_VIEWMODEL template
                config.interface.template = canvas.innerHTML
                // Set the current element id
                self.set('CURRENT_ELEMENT_ID', data.id)
                // Set the current element model
                self.set('CURRENT_ELEMENT_MODEL', data)
                // Persist the SDO_VIEWMODEL
                self.dispatchEvent(self.UPDATE_MODEL)
            }).catch(function (error) {
                console.error(error)
            })
        })

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
        })
    }

});