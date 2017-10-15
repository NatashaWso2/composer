/**
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import _ from 'lodash';
import './properties-form.css';
import TagInput from './tag-input';
import Pagination from './pagination';

/**
 * React component for a service definition.
 *
 * @class ServiceDefinition
 * @extends {React.Component}
 */
class PropertiesWindow extends React.Component {

    constructor(props) {
        super(props);
        const data = {};
        this.attributes = [];
        this.props.supportedProps.map((addedAnnotation) => {
            const key = addedAnnotation.identifier;
            data[key] = addedAnnotation.value;
            this.attributes.push(addedAnnotation);
        });
        this.state = { data,
            pageOfItems: [],
        };
        this.onChange = this.onChange.bind(this);
        this.onTagsAdded = this.onTagsAdded.bind(this);
        this.removeTagsAdded = this.removeTagsAdded.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.renderNumericInputs = this.renderNumericInputs.bind(this);
        this.renderTextInputs = this.renderTextInputs.bind(this);
        this.renderBooleanInputs = this.renderBooleanInputs.bind(this);
        this.renderTagInputs = this.renderTagInputs.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentDidMount() {
        if (this.props.model.viewState.showOverlayContainer) {
            document.addEventListener('mouseup', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('mouseup', this.handleOutsideClick, false);
        }
    }

    componentDidUpdate() {
        if (this.props.model.viewState.showOverlayContainer) {
            document.addEventListener('mouseup', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('mouseup', this.handleOutsideClick, false);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.handleOutsideClick, false);
    }

    /**
     * On page change event
     * @param pageOfItems
     */
    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems });
    }

    /**
     * On change event for form inputs
     * @param event
     * @param index
     */
    onChange(event, index) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({ data: _.extend(this.state.data, { [index]: value }) });
    }

    /**
     * Handle when tags are added to tag inputs
     * @param event
     * @param index
     */
    onTagsAdded(event, index) {
        if (event.keyCode === 13) {
            event.preventDefault();
            const { value } = event.target;
            if (this.state.data[index] === undefined) {
                this.setState({ data: _.extend(this.state.data,
                    { [index]: [] }) });
            }
            const obj = { [index]: [...this.state.data[index], value] };
            this.setState({ data: _.extend(this.state.data, obj) });
        }

        if ([this.state.data[index]].length && event.keyCode === 8) {
            this.removeTagsAdded(index, this.state.data[index].length - 1);
        }
    }

    /**
     * Hanldes the dismiss/cancel event of the prop window
     */
    handleDismiss() {
        this.props.addedValues(this.state.data);
        this.props.model.viewState.showOverlayContainer = false;
        this.props.model.viewState.overlayContainer = {};
    }

    /**
     * Handles the tags that are removed from the tag input
     * @param identifier
     * @param index
     */
    removeTagsAdded(identifier, index) {
        this.setState({ data: _.extend(this.state.data, { [identifier]:
            this.state.data[identifier].filter((item, i) => i !== index),
        }) });
    }

    /**
     * Handles the outside click of the prop window
     * @param e
     */
    handleOutsideClick(e) {
        if (this.node) {
            if (!this.node.contains(e.target)) {
                this.handleDismiss();
            }
        }
    }

    /**
     * Renders text input for form
     * @param key
     * @returns {XML}
     */
    renderTextInputs(identifier) {
        return (
            <div key={identifier} className="form-group">
                <label
                    htmlFor={identifier}
                    className='col-sm-5 property-dialog-label'
                >
                    {identifier}</label>
                <div className='col-sm-7'>
                    <input
                        className='property-dialog-form-control'
                        id={identifier}
                        name={identifier}
                        type='text'
                        placeholder={identifier}
                        value={this.state.data[identifier]}
                        onChange={event => this.onChange(event, identifier)}
                    />
                </div>
            </div>);
    }

    /**
     * Renders numeric input for form
     * @param key
     * @returns {XML}
     */
    renderNumericInputs(identifier) {
        return (
            <div key={identifier} className="form-group">
                <label
                    htmlFor={identifier}
                    className='col-sm-5 property-dialog-label'
                >
                    {identifier}</label>
                <div className='col-sm-7'>
                    <input
                        className='property-dialog-form-control'
                        id={identifier}
                        name={identifier}
                        type='number'
                        placeholder={identifier}
                        value={this.state.data[identifier]}
                        onChange={event => this.onChange(event, identifier)}
                    />
                </div>
            </div>);
    }

    /**
     * Renders boolean input for form
     * @param key
     * @param booleanValue
     * @returns {XML}
     */
    renderBooleanInputs(identifier, booleanValue) {
        return (
            <div key={identifier} className="form-group">
                <label
                    htmlFor={identifier}
                    className='col-sm-5 property-dialog-label'
                >
                    {identifier}</label>
                <div className='col-sm-7 properties-checkbox'>
                    <input
                        className="toggle"
                        type="checkbox"
                        id={identifier}
                        checked={booleanValue}
                        onChange={event => this.onChange(event, identifier)}
                    />
                </div>
            </div>);
    }

    /**
     * Renders tag inputs for form
     * @param key
     * @returns {XML}
     */
    renderTagInputs(identifier) {
        return (<div key={identifier} className="form-group">
            <label
                className="col-sm-5 property-dialog-label"
                htmlFor="tags"
            >{identifier}</label>
            <div className='col-sm-7 properties-tags'>
                <TagInput
                    id={identifier}
                    taggedElements={this.state.data[identifier]}
                    onTagsAdded={event =>
                        this.onTagsAdded(event, identifier)}
                    removeTagsAdded={this.removeTagsAdded}
                    placeholder={identifier}
                    ref={(node) => { this.node = node; }}
                />
            </div>
        </div>);
    }
    /**
     * Renders the view for a property window
     *
     * @returns {ReactElement} The view.
     * @memberof PropertyWindow
     */
    render() {
        return (
            <div
                id={`popover-${this.props.model.id}`}
                key={`popover-${this.props.model.id}`}
            >
                <div
                    id="popover-arrow"
                    style={this.props.styles.arrowStyle}
                />
                <div
                    id="property-modal"
                    ref={(node) => { this.node = node; }}
                    key={`propertiesForm/${this.props.model.id}`}
                    style={this.props.styles.popover}
                >
                    <div className="form-header">
                        <button
                            id='dismissBtn'
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={this.handleDismiss}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h5 className="form-title file-dialog-title">
                            {this.props.formHeading}</h5>
                    </div>
                    <div className="form-body">
                        <div className="container-fluid">
                            <form className='form-horizontal propertyForm'>
                                {this.state.pageOfItems.map((key) => {
                                    const type = key.bType;
                                    const identifier = key.identifier;
                                    if (type === 'int') {
                                        return this.renderNumericInputs(identifier);
                                    } else if (type === 'string') {
                                        return this.renderTextInputs(identifier);
                                    } else if (type === 'boolean') {
                                        let booleanValue = false;
                                        if (this.state.data[identifier]) {
                                            booleanValue = JSON.parse(this.state.data[identifier]);
                                        }
                                        return this.renderBooleanInputs(identifier, booleanValue);
                                    } else if (type === 'array') {
                                        return this.renderTagInputs(identifier);
                                    } else {
                                        return this.renderTextInputs(identifier);
                                    }
                                })}
                            </form>
                        </div>
                    </div>
                    <Pagination items={this.attributes} onChangePage={this.onChangePage} />
                </div>
            </div>);
    }
}
export default PropertiesWindow;
