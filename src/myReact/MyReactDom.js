import React from 'react';
import MyReact from './MyReact'

const render = (
    reactElement,
    domElement
) => {
    let curDom;
    // console.log("TEST", reactElement)
    if (reactElement === undefined) {
        return;
    }
    if (typeof reactElement === 'string' | typeof reactElement === 'number') {
        curDom =
            document.createTextNode(reactElement);
    } else {
        const { type, props } = reactElement;
        /// if type is ClassCompoennt
        if (type.prototype instanceof MyReact.Component) {
            // console.log('class componnent props', props)
            /// Mounting
            /// constructor
            const curInstance = new type(props);
            // console.log("curInstance", curInstance)
            curInstance.parentDomElement = domElement;
            // getDerivedStateFromProps
            curInstance.state = type.getDerivedStateFromProps(props, curInstance.state)
            // console.log("curInstance", curInstance)

            // render
            const curReactElement = curInstance.render();
            curInstance.preVDOM = curReactElement;
            // console.log("curReactElement", curReactElement);
            render(curReactElement, domElement);
            if (curInstance.componentDidmount) {
                curInstance.componentDidmount()
            }
            return
        }

        // Assignment if it is function component
        if (typeof type === 'function') {
            const curReactElement = type(props);
            // console.log("function compoennts TEST", curReactElement)
            render(curReactElement, domElement);
            return
        }
        /// else 
        curDom = document.createElement(type);
        Object.entries(props).forEach(
            ([key, value]) => {
                if (key === 'children') {
                    if (Array.isArray(value)) {
                        // console.log(value);
                        value.forEach((rElement) => {
                            render(rElement, curDom);
                        });
                    } else {
                        render(value, curDom);
                    }
                } else if (key.startsWith('on')) {
                    curDom.addEventListener(
                        getEventActionFromProps(key),
                        value
                    );
                } else {
                    curDom[key] = value;
                }
            }
        );
    }

    domElement.appendChild(curDom);
};


//utils

function getEventActionFromProps(propsKey) {
    return propsKey.slice(2).toLowerCase();
}

const MyReactDOM = {
    render: render
}


export default MyReactDOM