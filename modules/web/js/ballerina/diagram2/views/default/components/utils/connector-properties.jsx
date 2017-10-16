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
import PropTypes from 'prop-types';
import _ from 'lodash';
import ConnectorHelper from './../../../../../env/helpers/connector-helper';
import './properties-form.css';
import PropertiesWindow from './property-window';
import TreeUtils from './../../../../../model/tree-util';
import NodeFactory from './../../../../../model/node-factory';
import FragmentUtils from './../../../../../utils/fragment-utils';
import TreeBuilder from './../../../../../model/tree-builder';
/**
 * React component for a connector prop window
 *
 * @class ConnectorPropertiesForm
 * @extends {React.Component}
 */
class ConnectorPropertiesForm extends React.Component {

    constructor(props) {
        super(props);
        this.getSupportedProps = this.getSupportedProps.bind(this);
        this.getDataAddedToConnectorInit = this.getDataAddedToConnectorInit.bind(this);
        this.setDataToConnectorInitArgs = this.setDataToConnectorInitArgs.bind(this);
        this.getConnectorInstanceString = this.getConnectorInstanceString.bind(this);
        this.getAddedValueOfProp = this.getAddedValueOfProp.bind(this);
    }

    /**
     * Get already added values to properties
     * @param node
     * @returns {string}
     */
    getAddedValueOfProp(node) {
        let value = '';
        if (TreeUtils.isLiteral(node)) { // If its a direct value
            value = node.getValue();
        } else if (TreeUtils.isSimpleVariableRef(node)) { // If its a reference variable
            value = node.getVariableName().value;
        }
        return value;
    }

    /**
     * Get the connector properties supported by each connector
     * @returns {*}
     */
    getSupportedProps() {
        const props = this.props.model.props;
        // Get the pkg alias
        const pkgAlias = props.model.getVariable().getInitialExpression().getConnectorType().getPackageAlias().value;
        const connectorProps = ConnectorHelper.getConnectorParameters(this.context.environment, pkgAlias);
        const addedValues = this.getDataAddedToConnectorInit();
        console.log(addedValues.getSource());
        /* connectorProps.map((property, index) => {
            if (TreeUtils.isSimpleVariableRef(addedValues[index])) {
                property.value = this.getAddedValueOfProp(addedValues[index]);
            } else if (TreeUtils.isRecordLiteralExpr(addedValues[indexOfOptions])) { // If its a map
                     // Get all the key-value pairs
                if (addedValues[indexOfOptions].getKeyValuePairs()) {
                    addedValues[indexOfOptions].getKeyValuePairs().map((element) => {
                        if (TreeUtils.isRecordLiteralKeyValue(element)) {
                            const key = element.getKey().getVariableName().value;
                                    // Get the value
                            if (element.getValue()) {
                                    // Iterate over the property fields until the key matches the field name
                                connectorProps.map((prop) => {
                                    const identifier = prop.identifier.replace('Options:', '');
                                    if (key === identifier) {
                                        prop.value = this.getAddedValueOfProp(element.getValue());
                                    }
                                });
                            }
                        }
                    });
                }
                property.value = '';
            } else {
                property.value = this.getAddedValueOfProp(addedValues[index]);
            }
        });*/
        return connectorProps;
    }

    /**
     * Add quotation for strings
     */
    addQuotationForStringValues(value) {
        if (!value.startsWith('"')) {
            value = '"' + value + '"';
        }
        return value;
    }

    /**
     * Create the connector init string
     * @param connectorInit
     * @param data
     * @returns {string}
     */
    getConnectorInstanceString(connectorInit, pkgAlias, data) {
        connectorInit.setExpressions([], true);
        const connectorInitStringArray = [];
        let map;
        this.getSupportedProps().forEach((property) => {
            // Checks if the property is a struct field value
            if (!property.identifier.includes(':')) {
                if (property.isStruct) {
                    if (map) {
                        connectorInitStringArray.push(JSON.stringify(map));
                    } else {
                        map = {};
                    }
                } else {
                    // just a field and not a struct field
                    connectorInitStringArray.push(JSON.stringify(data[property.identifier]));
                }
            } else {
                const structNameArray = property.identifier.split(':');
                _.setWith(map, structNameArray, data[property.identifier]);
            }
        });
        const obj = {};
        // Remove the keys in the map
        Object.keys(map).forEach((key) => {
            if (map[key]) {
                const keys = map[key];
                let lastPropertyAdded;
                Object.keys(keys).forEach((props) => {
                    if (typeof keys[props] === 'object') {
                        if (props.toLowerCase() === lastPropertyAdded.toLowerCase()) {
                            if (!keys[lastPropertyAdded]) {
                                delete obj[lastPropertyAdded];
                                obj[lastPropertyAdded] = keys[props];
                            }
                        }
                    } else {
                        lastPropertyAdded = props;
                        obj[props] = keys[props];
                    }
                });
            }
        });
        if (obj) {
            connectorInitStringArray.push(JSON.stringify(obj));
        }
        const connectorParams = connectorInitStringArray.join(',');
        const connectorInitString = pkgAlias + ':ClientConnector __endpoint1 = ' +
            'create ' + pkgAlias + ':ClientConnector(' + connectorParams + ')';
        const fragment = FragmentUtils.createStatementFragment(`${connectorInitString};`);
        const parsedJson = FragmentUtils.parseFragment(fragment);
        const varDefNode = TreeBuilder.build(parsedJson);
        connectorInit.setExpressions(varDefNode.getVariable().getInitialExpression().getExpressions());
    }

    /**
     * Set data to the connector init arguments and create the connector init string
     * @param data
     */
    setDataToConnectorInitArgs(data) {
        const props = this.props.model.props;
        const connectorInit = props.model.getVariable().getInitialExpression();
        const pkgAlias = connectorInit.getConnectorType().getPackageAlias().value;
        this.getConnectorInstanceString(connectorInit, pkgAlias, data);
    }

    /**
     * Get the values already added as arguments to the connector init expression
     * @returns {Expression[]}
     */
    getDataAddedToConnectorInit() {
        const props = this.props.model.props;
        return props.model.getVariable().getInitialExpression();
    }

    /**
     * Renders the view for a connector properties window
     *
     * @returns {ReactElement} The view.
     * @memberof connector properties window
     */
    render() {
        const props = this.props.model.props;
        const positionX = (props.bBox.x) - 8 + 'px';
        const positionY = (props.bBox.y) + 'px';

        const styles = {
            popover: {
                top: props.bBox.y + 10 + 'px',
                left: positionX,
                height: '360px',
                minWidth: '500px',
            },
            arrowStyle: {
                top: positionY,
                left: props.bBox.x + 'px',
            },
        };
        const supportedProps = this.getSupportedProps();
        if (!supportedProps.length) {
            return null;
        }
        return (
            <PropertiesWindow
                model={props.model}
                formHeading='Connector Properties'
                key={`connectorProp/${props.model.id}`}
                styles={styles}
                supportedProps={supportedProps}
                addedValues={this.setDataToConnectorInitArgs}
            />);
    }
}

export default ConnectorPropertiesForm;

ConnectorPropertiesForm.contextTypes = {
    environment: PropTypes.instanceOf(Object).isRequired,
};
