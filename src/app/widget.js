/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/global.d.ts" />

Polymer({
    is: 'kul-widget',
    properties: {
        id: {
            type: String
        },
        configId: {
            type: String
        },
        modelId: {
            type: String
        }
    },

    /**
     * 
     */
    init: function(config, target, _self){                
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

    /**
     * 
     */
    ready: function () {
        let self = this
        let appController = document.getElementsByTagName('kul-app')[0]
        let include = self.$.include
        console.log('this.configId: ', self.configId)
        console.log('this.modelId: ', self.modelId)
        console.log('this.$.include: ', include)
        console.log('appController: ', appController)        
        setTimeout(function(){
            console.log('appController.SDO_VIEWMODEL: ', appController.SDO_VIEWMODEL)  
            let currentVersion = appController.SDO_VIEWMODEL.component.currentVersion
            let config = appController.SDO_VIEWMODEL.component.version[currentVersion]
            self.init(config, include, appController);
        }, 1000)        
    }

});