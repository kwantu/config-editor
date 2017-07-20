// Create JS module instances
var database = new PouchDB('config')
database.replicate.to('http://localhost:5984/config')

// @ts-ignore
var uuid = new UUID(3, "ns:URL", "http://kwantu.net/")

var SDOViewModel = function (componentType) {
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
                // @ts-ignore
                return _.get(utils.URLParams, 'id')
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
    // On ready life cycle event of the main kwantu-tools element
    ready: function () {
        let self = this
        // Global Model Events
        let CREATE_MODEL = new Event('createModel')
        let READ_MODEL = new Event('readModel')
        let UPDATE_MODEL = new Event('updateModel')
        let DELETE_MODEL = new Event('deleteModel')
        // Defaults
        // Get the current config version
        let currentVersion = ''
        let config = {}
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
            // console.log('readModel event triggered!!')
            console.log('EVENT:: "SDO readModel" triggered!!', self.SDO_VIEWMODEL)
            database.get(self.SDO_VIEWMODEL_ID, function (err, response) {
                if (err) {
                    return console.log(err);
                }
                // handle response
                self.set('SDO_VIEWMODEL', response)
                console.log('SDO_VIEWMODEL: ', self.SDO_VIEWMODEL)
                // Get the current config version
                currentVersion = self.SDO_VIEWMODEL.component.currentVersion
                config = self.SDO_VIEWMODEL.component.version[currentVersion]
                // Initialise the designer with the current interface template
                // @ts-ignore
                utils.parseHTMLString(config.interface.template, canvas, true)
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
        // Get the config data model
        if (_.isUndefined(self.SDO_VIEWMODEL_ID)) {
            self.set('SDO_VIEWMODEL', SDOViewModel('default'))
            currentVersion = self.SDO_VIEWMODEL.component.currentVersion
            config = self.SDO_VIEWMODEL.component.version[currentVersion]
            // console.log('SDO_VIEWMODEL: ', self.SDO_VIEWMODEL)
            self.dispatchEvent(CREATE_MODEL)
        } else {
            console.log('self.SDO_VIEWMODEL_ID: ' + self.SDO_VIEWMODEL_ID)
            self.dispatchEvent(READ_MODEL)
        }

        // Config editor reference areas
        let canvas = self.$.canvas
        let elements = self.$.elements
        let source = self.$.source

        // Initialise the drag and drop functionality
        let editor = dragula([elements, canvas], {
            copy: true,
            revertOnSpill: true
        })
        // On drop of the element, create the associated Polymer component
        // and associated properties data model
        editor.on('drop', function (element, target, source, sibling) {
            let elementRef;
            element.create(config, target, source, sibling).then(function (data) {
                config.elements.push(data)
                config.interface.template = canvas.innerHTML
                self.set('CURRENT_ELEMENT_ID', data.id)
                self.set('CURRENT_ELEMENT_MODEL', data)
                self.dispatchEvent(UPDATE_MODEL)
            }).catch(function (error) {
                console.error(error)
            })
        })

        // Reload code editor on click of the source tab
        canvas.addEventListener('click', function (event) {
            console.log('EVENT:: "canvas.click" triggered!!', event)
            // @ts-ignore
            utils.setFocus(canvas, canvas)
            let children = document.getElementById('prop-editors').children
            for (var i = 0; i < children.length; i++) {
                var element = children[i];
                // @ts-ignore
                element.set('visible', false)
            }
        })
    }

});