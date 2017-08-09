/**
 * (K)wantu (U)ser interface (L)anguage Element.
 * 
 * This constructor consists of the element id, name data model
 * and main app element. It exposes a few methods used to create
 * a KUL Element and add additional functionality to it so the
 * user can manipulate it.
 * 
 * @constructor
 * 
 * @param {String} name 
 * @param {any} model 
 * @param {any} appController 
 * 
 */
var KULElement = function(name, model, appController) {
    let self = this
    //
    this.id = model.id
    this.name = name    
    this.model = model  
    // Inherit the main app controller / element
    this.appController = appController
    // Create the element     
    this.view = document.createElement(this.name) 
    // Set the default tabindex value to allow the native
    // focus method to be used.    
    this.view.setAttribute('tabindex', '0')
    // Set the element id and data model attributes
    if (this.model !== undefined) {
        // Set the initial data model        
        this.view.set('model', this.model)
        // Set the element id        
        this.view.set('id', this.id)
    }  

    // Add the default event listeners    
    this.view.addEventListener('click', (event) => {
        console.log('EVENT:: "element.click" triggered!!', event)
        self.view.focus()
        self.view.setFocus(event)
        let editorName = _.toLower(this.name).replace('kul-', '') + '-props'
        // console.log('self.model: ', self.model)
        self.appController.set('CURRENT_ELEMENT_TYPE', editorName)
        self.appController.set('CURRENT_ELEMENT_ID', self.model.id)
        self.appController.set('CURRENT_ELEMENT_MODEL', self.model)
        // Show the correct properties form
        let children = document.getElementById('prop-editors').children
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            // console.log('element: ', element)
            element.setAttribute('style', 'display: none')
        }        
        let propEditor = document.getElementsByTagName(editorName)[0]
        propEditor.setAttribute('style', 'display: block')
    })      
    this.view.addEventListener('keydown', (event) => {
        // console.log('EVENT:: "element.keydown" triggered!!', event)
        if (event.code === 'Backspace'){
            console.log('Element EVENT:: "Backspace keydown" triggered!!', event)
            // Call the element remove method
            self.delete()
        }
    }) 

    // Add the draggable functionality
    interact(this.view).draggable({
        snap: {
            targets: [
                // @ts-ignore
                interact.createSnapGrid({ x: 10, y: 10 })
            ],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
        },
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            
            restriction: self.view.parentNode,
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,
        // call this function on every dragmove event
        onmove: function(event) {
            var target = event.target, // .children[0],
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        // call this function on every dragend event
        onend: function(event) {
            console.log('EVENT:: "element.drag-end" triggered!! ', event)
            // trigger update template event
            self.appController.dispatchEvent(self.appController.UPDATE_MODEL)
        }
    })
    // Add the resizable functionality
    interact(this.view).resizable({
        preserveAspectRatio: true,
        margin: 10,
        edges: { left: true, right: true, bottom: true, top: true }                    
    }).on('resizemove', (event) => {                
        let target = event.target
        let child = target.children[0],
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';
        child.style.width  = '100%';
        child.style.height = '100%';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)

    }).on('resizeend', (event) => {
        self.appController.dispatchEvent(self.appController.UPDATE_MODEL)
    })    
}

/**
 * 
 * 
 */
KULElement.prototype.getId = function() {
    return this.id;
}

/**
 * 
 * 
 */
KULElement.prototype.getName = function() {
    return this.name;
}

/**
 * 
 * 
 */
KULElement.prototype.getModel = function() {
    return this.model;
}

/**
 * 
 * 
 */
KULElement.prototype.getView = function() {
    return this.view;
}

/**
 * 
 * 
 */
KULElement.prototype.setId = function(id) {
    this.id = id
}

/**
 * 
 * 
 */
KULElement.prototype.setName = function(name) {
    this.name = name
}

/**
 * 
 * 
 */
KULElement.prototype.setModel = function(data) {
    this.model = _.isUndefined(this.model) ? data.base : this.model
}

/**
 * 
 * 
 */
KULElement.prototype.setView = function(view) {
    this.view = view
}

/**
 * 
 * 
 */
KULElement.prototype.setViewModel = function(data) {
    this.view.set(data.path, data.value)
}

/**
 * 
 * 
 */
KULElement.prototype.delete = function() {
    // Get the current version of the SDO_VIEWMODEL
    let viewModel = this.appController.SDO_VIEWMODEL
    let elements = viewModel.component.version[viewModel.component.currentVersion].elements
    // Find the element data model in the SDO_VIEWMODEL elements array
    let index = _.findIndex(elements, { id: this.model.id })
    // Remove the data model from the SDO_VIEWMODEL
    if (index !== -1) 
        elements.splice(index, 1)
    // Remove the element view from the canvas
    this.view.parentNode.removeChild(this.view)                
    // Update and persist the SDO_VIEWMODEL element data model
    this.appController.dispatchEvent(this.appController.UPDATE_MODEL)
    // Wait 1 second, then update and persist the SDO_VIEWMODEL template
    setTimeout(() => this.appController.dispatchEvent(this.appController.UPDATE_TEMPLATE), 1000)
}